// src/app/api/upload/dashboard/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Execute all queries in a single transaction
    const result = await prisma.$transaction(async (tx) => {
      // Core counts - single query with multiple counts
      const [
        totalUsers,
        newUsersLast30Days,
        newUsersLast7Days,
        totalUniversities,
        totalPrograms,
        totalApplications,
        activeApplications,
        acceptedApplications,
        submittedApplications,
        totalEssays,
        completedEssays,
        inProgressEssays,
        draftEssays,
        totalCVs,
        activeCVs,
        recentCVs,
        totalScholarships,
        activeScholarships,
        totalFinancialAids,
        totalProfiles,
        completedProfiles,
        recentEssays,
        recentScholarshipApps,
      ] = await Promise.all([
        // User counts
        tx.user.count(),
        tx.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
        tx.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
        
        // University & Program counts
        tx.university.count({ where: { isActive: true } }),
        tx.program.count({ where: { isActive: true } }),
        
        // Application counts
        tx.application.count(),
        tx.application.count({
          where: {
            applicationStatus: { in: ['SUBMITTED', 'UNDER_REVIEW', 'INTERVIEW_SCHEDULED', 'INTERVIEW_COMPLETED'] }
          }
        }),
        tx.application.count({ where: { applicationStatus: 'ACCEPTED' } }),
        tx.application.count({
          where: {
            applicationStatus: { in: ['SUBMITTED', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED', 'WAITLISTED'] }
          }
        }),
        
        // Essay counts
        tx.essay.count(),
        tx.essay.count({ where: { status: 'COMPLETED' } }),
        tx.essay.count({ where: { status: 'IN_PROGRESS' } }),
        tx.essay.count({ where: { status: 'DRAFT' } }),
        
        // CV counts
        tx.cV.count(),
        tx.cV.count({ where: { isActive: true } }),
        tx.cV.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
        
        // Financial counts
        tx.scholarship.count(),
        tx.scholarship.count({ where: { isActive: true } }),
        tx.financialAid.count({ where: { isActive: true } }),
        
        // Personality profiles
        tx.personalityProfile.count(),
        tx.personalityProfile.count({ where: { isComplete: true } }),
        
        // Recent activity
        tx.essay.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
        tx.scholarshipApplication.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      ]);

      // Group queries for aggregations
      const [
        subscriptionStats,
        applicationStatusBreakdown,
        cvExportCount,
      ] = await Promise.all([
        tx.subscription.groupBy({
          by: ['plan', 'status'],
          _count: true,
        }),
        tx.application.groupBy({
          by: ['applicationStatus'],
          _count: true,
        }),
        tx.cVExport.aggregate({
          _count: { id: true },
        }),
      ]);

      // Fetch queries for lists
      const [upcomingEvents, recentApplications, topUniversities] = await Promise.all([
        tx.calendarEvent.findMany({
          where: {
            startDate: { gte: now, lte: sevenDaysFromNow },
            eventStatus: 'active',
          },
          take: 10,
          orderBy: { startDate: 'asc' },
          select: {
            id: true,
            title: true,
            startDate: true,
            eventType: true,
            priority: true,
          },
        }),
        
        tx.application.findMany({
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            applicationStatus: true,
            completionPercentage: true,
            createdAt: true,
            submissionDate: true,
            university: {
              select: {
                universityName: true,
                country: true,
              },
            },
            program: {
              select: {
                programName: true,
                degreeType: true,
              },
            },
          },
        }),
        
        tx.university.findMany({
          take: 10,
          where: { isActive: true },
          select: {
            id: true,
            universityName: true,
            country: true,
            city: true,
            acceptanceRate: true,
            _count: {
              select: {
                applications: true,
                programs: true,
              },
            },
          },
          orderBy: {
            applications: { _count: 'desc' },
          },
        }),
      ]);

      // Process subscription data
      const activeSubscriptions = subscriptionStats.filter(s => s.status === 'active');
      const subscriptions = {
        total: activeSubscriptions.reduce((sum, stat) => sum + stat._count, 0),
        byPlan: activeSubscriptions.reduce((acc, stat) => {
          acc[stat.plan] = (acc[stat.plan] || 0) + stat._count;
          return acc;
        }, {} as Record<string, number>),
        byStatus: subscriptionStats.reduce((acc, stat) => {
          acc[stat.status] = (acc[stat.status] || 0) + stat._count;
          return acc;
        }, {} as Record<string, number>),
      };

      // Process application status breakdown
      const statusBreakdown = applicationStatusBreakdown.reduce((acc, stat) => {
        acc[stat.applicationStatus] = stat._count;
        return acc;
      }, {} as Record<string, number>);

      // Calculate success rate
      const successRate = submittedApplications > 0
        ? Number(((acceptedApplications / submittedApplications) * 100).toFixed(1))
        : 0;

      // Calculate personality profile completion rate
      const profileCompletionRate = totalProfiles > 0
        ? ((completedProfiles / totalProfiles) * 100).toFixed(1)
        : '0';

      return {
        overview: {
          totalUsers,
          newUsersLast30Days,
          newUsersLast7Days,
          totalUniversities,
          totalPrograms,
          totalApplications,
          activeApplications,
          successRate,
        },
        userActivity: {
          recentEssays,
          recentCVs,
          recentScholarshipApps,
        },
        subscriptions,
        essays: {
          total: totalEssays,
          completed: completedEssays,
          inProgress: inProgressEssays,
          draft: draftEssays,
        },
        cvs: {
          total: totalCVs,
          active: activeCVs,
          totalExports: cvExportCount._count.id || 0,
          recentlyCreated: recentCVs,
        },
        financial: {
          totalScholarships,
          activeScholarships,
          totalFinancialAids,
        },
        personalityProfiles: {
          total: totalProfiles,
          completed: completedProfiles,
          completionRate: profileCompletionRate,
        },
        applicationStatusBreakdown: statusBreakdown,
        upcomingEvents,
        recentApplications,
        topUniversities,
      };
    }, {
      timeout: 30000, // 30 second timeout
      maxWait: 10000, // Max 10 seconds to acquire connection
    });

    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch dashboard data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
  // DON'T call prisma.$disconnect() - singleton pattern handles this
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;