/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  Edit3, 
  Eye, 
  Trash2, 
  X, 
  Check, 
  Search,
  DollarSign,
  GraduationCap,
  CreditCard,
  TrendingUp,
  Users,
  Calendar,
  FileText,
  Award,
  HandHeart,
  Calculator,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react";

// Types based on your schema
interface FeeStructure {
  id: string;
  universityId: string;
  programId: string | null;
  structureName: string;
  structureType: string;
  academicYear: string;
  tuitionFee: number;
  admissionFee: number;
  registrationFee: number;
  examFee: number;
  libraryFee: number;
  labFee: number;
  hostelFee: number;
  messFee: number;
  transportFee: number;
  sportsFee: number;
  medicalFee: number;
  healthInsurance: number;
  accidentInsurance: number;
  studentActivityFee: number;
  technologyFee: number;
  securityDeposit: number;
  cautionMoney: number;
  isDepositRefundable: boolean;
  totalMandatoryFees: number;
  totalOptionalFees: number;
  grandTotal: number;
  currency: string;
  currencySymbol: string;
  isActive: boolean;
  effectiveDate: string;
  expiryDate: string | null;
}

interface TuitionBreakdown {
  id: string;
  universityId: string;
  programId: string | null;
  academicYear: string;
  yearNumber: number;
  baseTuition: number;
  labFees: number;
  libraryFees: number;
  technologyFees: number;
  activityFees: number;
  healthInsurance: number;
  dormitoryFees: number;
  mealPlanFees: number;
  applicationFee: number;
  registrationFee: number;
  examFees: number;
  graduationFee: number;
  totalTuition: number;
  totalAdditionalFees: number;
  grandTotal: number;
  currency: string;
  currencySymbol: string;
  paymentTerms: string | null;
  installmentCount: number;
  isActive: boolean;
  effectiveDate: string;
  expiryDate: string | null;
}

interface PaymentSchedule {
  id: string;
  tuitionBreakdownId: string;
  installmentNumber: number;
  dueDate: string;
  amount: number;
  description: string | null;
  lateFee: number;
  gracePeroidDays: number;
  isActive: boolean;
}

interface Scholarship {
  id: string;
  universityId: string;
  programId: string | null;
  scholarshipName: string;
  scholarshipSlug: string;
  scholarshipType: string;
  description: string | null;
  eligibilityCriteria: string | null;
  amount: number | null;
  percentage: number | null;
  maxAmount: number | null;
  currency: string;
  coverageTuition: boolean;
  coverageFees: boolean;
  coverageLiving: boolean;
  coverageBooks: boolean;
  applicationRequired: boolean;
  applicationDeadline: string | null;
  documentsRequired: string | null;
  totalAvailable: number | null;
  currentlyAwarded: number;
  minimumGpa: number | null;
  minimumTestScore: number | null;
  testType: string | null;
  citizenshipRequired: string | null;
  isActive: boolean;
  applicationOpenDate: string | null;
  applicationCloseDate: string | null;
  awardDate: string | null;
}

interface FinancialAid {
  id: string;
  universityId: string;
  programId: string | null;
  aidName: string;
  aidType: string;
  description: string | null;
  amount: number | null;
  percentage: number | null;
  maxAmount: number | null;
  currency: string;
  interestRate: number | null;
  repaymentPeriod: number | null;
  gracePeriod: number | null;
  eligibilityCriteria: string | null;
  minimumGpa: number | null;
  maximumFamilyIncome: number | null;
  citizenshipRequired: string | null;
  applicationRequired: boolean;
  applicationDeadline: string | null;
  documentsRequired: string | null;
  isActive: boolean;
  applicationOpenDate: string | null;
  applicationCloseDate: string | null;
}

interface University {
  id: string;
  universityName: string;
}

interface Program {
  id: string;
  programName: string;
}




const FinancialManagementSystem = () => {
  // Sample data
  const [universities] = useState<University[]>([
    { id: "univ-1", universityName: "Harvard University" },
    { id: "univ-2", universityName: "MIT" },
    { id: "univ-3", universityName: "Stanford University" },
  ]);

  const [programs] = useState<Program[]>([
    { id: "prog-1", programName: "Computer Science" },
    { id: "prog-2", programName: "Business Administration" },
    { id: "prog-3", programName: "Engineering" },
    { id: "prog-4", programName: "Medicine" },
  ]);

  // State for different modules
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [tuitionBreakdowns, setTuitionBreakdowns] = useState<TuitionBreakdown[]>([]);
  const [paymentSchedules, setPaymentSchedules] = useState<PaymentSchedule[]>([]);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [financialAids, setFinancialAids] = useState<FinancialAid[]>([]);

  // UI State
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [selectedUniversity, setSelectedUniversity] = useState<string>("all");
  const [selectedProgram, setSelectedProgram] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [newItem, setNewItem] = useState<any>({});

  // Analytics data
  const [analytics, setAnalytics] = useState({
    totalFeeStructures: 0,
    totalTuitionBreakdowns: 0,
    totalScholarships: 0,
    totalFinancialAids: 0,
    totalScholarshipAmount: 0,
    totalFinancialAidAmount: 0,
    averageTuitionFee: 0,
    activeScholarships: 0,
  });

  // Calculate analytics
  useEffect(() => {
    const totalScholarshipAmount = scholarships.reduce((sum, s) => sum + (s.amount || 0), 0);
    const totalFinancialAidAmount = financialAids.reduce((sum, f) => sum + (f.amount || 0), 0);
    const averageTuitionFee = feeStructures.length > 0 
      ? feeStructures.reduce((sum, f) => sum + f.tuitionFee, 0) / feeStructures.length 
      : 0;
    const activeScholarships = scholarships.filter(s => s.isActive).length;

    setAnalytics({
      totalFeeStructures: feeStructures.length,
      totalTuitionBreakdowns: tuitionBreakdowns.length,
      totalScholarships: scholarships.length,
      totalFinancialAids: financialAids.length,
      totalScholarshipAmount,
      totalFinancialAidAmount,
      averageTuitionFee,
      activeScholarships,
    });
  }, [feeStructures, tuitionBreakdowns, scholarships, financialAids]);

  // Generic handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let parsedValue: unknown = value;
    
    if (type === "number") parsedValue = parseFloat(value) || 0;
    if (type === "checkbox") parsedValue = (e.target as HTMLInputElement).checked;
    
    setNewItem({ ...newItem, [name]: parsedValue });
  };

  interface Item {
  id: number;
  name: string;
  description: string;
}

  const handleEdit = (item: Item) => {
    setEditingItem(item);
    setNewItem({ ...item });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (activeTab === "fee-structures") {
      setFeeStructures(feeStructures.filter(item => item.id !== id));
    } else if (activeTab === "tuition-breakdowns") {
      setTuitionBreakdowns(tuitionBreakdowns.filter(item => item.id !== id));
    } else if (activeTab === "payment-schedules") {
      setPaymentSchedules(paymentSchedules.filter(item => item.id !== id));
    } else if (activeTab === "scholarships") {
      setScholarships(scholarships.filter(item => item.id !== id));
    } else if (activeTab === "financial-aids") {
      setFinancialAids(financialAids.filter(item => item.id !== id));
    }
  };

  const handleSubmit = () => {
    const newId = editingItem ? editingItem.id : `${activeTab}-${Date.now()}`;
    const itemWithId = { ...newItem, id: newId };

    if (activeTab === "fee-structures") {
      const totals = calculateFeeStructureTotals(newItem);
      const completeItem = { ...itemWithId, ...totals };
      
      if (editingItem) {
        setFeeStructures(feeStructures.map(item => item.id === editingItem.id ? completeItem : item));
      } else {
        setFeeStructures([...feeStructures, completeItem]);
      }
    } else if (activeTab === "tuition-breakdowns") {
      const totals = calculateTuitionTotals(newItem);
      const completeItem = { ...itemWithId, ...totals };
      
      if (editingItem) {
        setTuitionBreakdowns(tuitionBreakdowns.map(item => item.id === editingItem.id ? completeItem : item));
      } else {
        setTuitionBreakdowns([...tuitionBreakdowns, completeItem]);
      }
    } else if (activeTab === "payment-schedules") {
      if (editingItem) {
        setPaymentSchedules(paymentSchedules.map(item => item.id === editingItem.id ? itemWithId : item));
      } else {
        setPaymentSchedules([...paymentSchedules, itemWithId]);
      }
    } else if (activeTab === "scholarships") {
      if (editingItem) {
        setScholarships(scholarships.map(item => item.id === editingItem.id ? itemWithId : item));
      } else {
        setScholarships([...scholarships, itemWithId]);
      }
    } else if (activeTab === "financial-aids") {
      if (editingItem) {
        setFinancialAids(financialAids.map(item => item.id === editingItem.id ? itemWithId : item));
      } else {
        setFinancialAids([...financialAids, itemWithId]);
      }
    }
    
    closeModal();
  };

  const calculateFeeStructureTotals = (structure: Partial<FeeStructure>) => {
    const mandatory = [
      structure.tuitionFee || 0,
      structure.admissionFee || 0,
      structure.registrationFee || 0,
      structure.examFee || 0,
      structure.libraryFee || 0,
      structure.labFee || 0,
      structure.sportsFee || 0,
      structure.medicalFee || 0,
      structure.healthInsurance || 0,
      structure.accidentInsurance || 0,
      structure.studentActivityFee || 0,
      structure.technologyFee || 0
    ].reduce((sum, fee) => sum + fee, 0);

    const optional = [
      structure.hostelFee || 0,
      structure.messFee || 0,
      structure.transportFee || 0,
      structure.securityDeposit || 0,
      structure.cautionMoney || 0
    ].reduce((sum, fee) => sum + fee, 0);

    const grandTotal = mandatory + optional;

    return { 
      totalMandatoryFees: mandatory, 
      totalOptionalFees: optional, 
      grandTotal 
    };
  };

  const calculateTuitionTotals = (breakdown: Partial<TuitionBreakdown>) => {
    const additionalFees = [
      breakdown.labFees || 0,
      breakdown.libraryFees || 0,
      breakdown.technologyFees || 0,
      breakdown.activityFees || 0,
      breakdown.healthInsurance || 0,
      breakdown.dormitoryFees || 0,
      breakdown.mealPlanFees || 0,
      breakdown.applicationFee || 0,
      breakdown.registrationFee || 0,
      breakdown.examFees || 0,
      breakdown.graduationFee || 0
    ].reduce((sum, fee) => sum + fee, 0);

    const grandTotal = (breakdown.baseTuition || 0) + additionalFees;

    return { 
      totalTuition: breakdown.baseTuition || 0,
      totalAdditionalFees: additionalFees, 
      grandTotal 
    };
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setNewItem({});
  };

  const formatCurrency = (amount: number, currencySymbol = "$") => {
    return `${currencySymbol}${amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };





  const getFilteredData = () => {
    let data: any[] = [];
    
    if (activeTab === "fee-structures") data = feeStructures;
    else if (activeTab === "tuition-breakdowns") data = tuitionBreakdowns;
    else if (activeTab === "payment-schedules") data = paymentSchedules;
    else if (activeTab === "scholarships") data = scholarships;
    else if (activeTab === "financial-aids") data = financialAids;

    return data.filter(item => {
      const matchesUniversity = selectedUniversity === "all" || item.universityId === selectedUniversity;
      const matchesProgram = selectedProgram === "all" || 
                            (item.programId === selectedProgram || 
                             (!item.programId && selectedProgram === "none"));
      const matchesSearch = searchTerm === "" || 
                           JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesUniversity && matchesProgram && matchesSearch;
    });
  };

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "fee-structures", label: "Fee Structures", icon: DollarSign },
    { id: "tuition-breakdowns", label: "Tuition Breakdowns", icon: Calculator },
    { id: "payment-schedules", label: "Payment Schedules", icon: Calendar },
    { id: "scholarships", label: "Scholarships", icon: Award },
    { id: "financial-aids", label: "Financial Aids", icon: HandHeart },
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fee Structures</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalFeeStructures}</div>
            <p className="text-xs text-muted-foreground">Total active structures</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scholarships</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.activeScholarships}</div>
            <p className="text-xs text-muted-foreground">Active scholarships</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scholarship Amount</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analytics.totalScholarshipAmount)}</div>
            <p className="text-xs text-muted-foreground">Total scholarship value</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Tuition</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analytics.averageTuitionFee)}</div>
            <p className="text-xs text-muted-foreground">Average tuition fee</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Financial Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Financial Aid</span>
                <span className="font-bold">{formatCurrency(analytics.totalFinancialAidAmount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Tuition Breakdowns</span>
                <span className="font-bold">{analytics.totalTuitionBreakdowns}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Financial Aids</span>
                <span className="font-bold">{analytics.totalFinancialAids}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => {
                  setActiveTab("fee-structures");
                  setIsModalOpen(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Fee Structure
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => {
                  setActiveTab("scholarships");
                  setIsModalOpen(true);
                }}
              >
                <Award className="mr-2 h-4 w-4" />
                Add Scholarship
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => {
                  setActiveTab("financial-aids");
                  setIsModalOpen(true);
                }}
              >
                <HandHeart className="mr-2 h-4 w-4" />
                Create Financial Aid
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderDataTable = () => {
    const filteredData = getFilteredData();
    
    return (
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold capitalize">{activeTab.replace("-", " ")}</h2>
            <p className="text-gray-600">{filteredData.length} items found</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select
              value={selectedUniversity}
              onChange={(e) => setSelectedUniversity(e.target.value)}
              className="border rounded-lg px-3 py-2 min-w-[180px]"
            >
              <option value="all">All Universities</option>
              {universities.map((university) => (
                <option key={university.id} value={university.id}>
                  {university.universityName}
                </option>
              ))}
            </select>
            
            <select
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              className="border rounded-lg px-3 py-2 min-w-[180px]"
            >
              <option value="all">All Programs</option>
              <option value="none">No Program</option>
              {programs.map((program) => (
                <option key={program.id} value={program.id}>
                  {program.programName}
                </option>
              ))}
            </select>
            
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add New
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredData.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {item.structureName || item.scholarshipName || item.aidName || `${activeTab} ${item.id}`}
                      <span className={`inline-block w-2 h-2 rounded-full ${
                        item.isActive ? 'bg-green-500' : 'bg-gray-400'
                      }`}></span>
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-500 mt-1">
                      {universities.find(u => u.id === item.universityId)?.universityName || 'Unknown University'}
                      {item.programId && ` • ${programs.find(p => p.id === item.programId)?.programName || 'Unknown Program'}`}
                    </CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit3 className="w-4 h-4 text-gray-500" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {activeTab === "fee-structures" && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Tuition Fee</span>
                      <span className="font-medium">
                        {formatCurrency(item.tuitionFee, item.currencySymbol)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Grand Total</span>
                      <span className="font-bold text-blue-600">
                        {formatCurrency(item.grandTotal, item.currencySymbol)}
                      </span>
                    </div>
                  </div>
                )}
                
                {activeTab === "scholarships" && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Type</span>
                      <span className="font-medium">{item.scholarshipType}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Amount</span>
                      <span className="font-bold text-green-600">
                        {item.amount ? formatCurrency(item.amount) : `${item.percentage}%`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Available</span>
                      <span>{item.totalAvailable || 'Unlimited'}</span>
                    </div>
                  </div>
                )}
                
                {activeTab === "financial-aids" && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Type</span>
                      <span className="font-medium">{item.aidType}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Amount</span>
                      <span className="font-bold text-purple-600">
                        {item.amount ? formatCurrency(item.amount) : `${item.percentage}%`}
                      </span>
                    </div>
                    {item.interestRate && (
                      <div className="flex justify-between text-sm">
                        <span>Interest Rate</span>
                        <span>{item.interestRate}%</span>
                      </div>
                    )}
                  </div>
                )}
                
                {activeTab === "tuition-breakdowns" && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Base Tuition</span>
                      <span className="font-medium">
                        {formatCurrency(item.baseTuition, item.currencySymbol)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Additional Fees</span>
                      <span className="font-medium">
                        {formatCurrency(item.totalAdditionalFees, item.currencySymbol)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-bold">
                      <span>Grand Total</span>
                      <span className="text-blue-600">
                        {formatCurrency(item.grandTotal, item.currencySymbol)}
                      </span>
                    </div>
                  </div>
                )}
                
                {activeTab === "payment-schedules" && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Installment</span>
                      <span className="font-medium">#{item.installmentNumber}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Due Date</span>
                      <span>{new Date(item.dueDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Amount</span>
                      <span className="font-bold text-green-600">
                        {formatCurrency(item.amount)}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderModal = () => {
    if (!isModalOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingItem ? "Edit" : "Add New"} {activeTab.replace("-", " ")}
              </h2>
              <Button variant="ghost" size="icon" onClick={closeModal}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
             <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                
                <div>
                  <Label htmlFor="universityId">University</Label>
                  <select
                    id="universityId"
                    name="universityId"
                    value={newItem.universityId || ""}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  >
                    <option value="">Select University</option>
                    {universities.map((university) => (
                      <option key={university.id} value={university.id}>
                        {university.universityName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="programId">Program (Optional)</Label>
                  <select
                    id="programId"
                    name="programId"
                    value={newItem.programId || ""}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="">Select Program</option>
                    {programs.map((program) => (
                      <option key={program.id} value={program.id}>
                        {program.programName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Fee Structure Fields */}
                {activeTab === "fee-structures" && (
                  <>
                    <div>
                      <Label htmlFor="structureName">Structure Name</Label>
                      <Input
                        id="structureName"
                        name="structureName"
                        value={newItem.structureName || ""}
                        onChange={handleInputChange}
                        placeholder="e.g., Undergraduate Fee Structure 2024"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="structureType">Structure Type</Label>
                      <select
                        id="structureType"
                        name="structureType"
                        value={newItem.structureType || ""}
                        onChange={handleInputChange}
                        className="w-full border rounded-lg px-3 py-2"
                        required
                      >
                        <option value="">Select Type</option>
                        <option value="undergraduate">Undergraduate</option>
                        <option value="graduate">Graduate</option>
                        <option value="doctoral">Doctoral</option>
                        <option value="certificate">Certificate</option>
                      </select>
                    </div>
                    
                    <div>
                      <Label htmlFor="academicYear">Academic Year</Label>
                      <Input
                        id="academicYear"
                        name="academicYear"
                        value={newItem.academicYear || ""}
                        onChange={handleInputChange}
                        placeholder="e.g., 2024-25"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="currency">Currency</Label>
                      <select
                        id="currency"
                        name="currency"
                        value={newItem.currency || "USD"}
                        onChange={handleInputChange}
                        className="w-full border rounded-lg px-3 py-2"
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="CAD">CAD</option>
                        <option value="AUD">AUD</option>
                        <option value="INR">INR</option>
                      </select>
                    </div>
                    
                    <div>
                      <Label htmlFor="currencySymbol">Currency Symbol</Label>
                      <Input
                        id="currencySymbol"
                        name="currencySymbol"
                        value={newItem.currencySymbol || "$"}
                        onChange={handleInputChange}
                        placeholder="$"
                        required
                      />
                    </div>
                  </>
                )}

                {/* Scholarship Fields */}
                {activeTab === "scholarships" && (
                  <>
                    <div>
                      <Label htmlFor="scholarshipName">Scholarship Name</Label>
                      <Input
                        id="scholarshipName"
                        name="scholarshipName"
                        value={newItem.scholarshipName || ""}
                        onChange={handleInputChange}
                        placeholder="e.g., Merit Scholarship"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="scholarshipType">Scholarship Type</Label>
                      <select
                        id="scholarshipType"
                        name="scholarshipType"
                        value={newItem.scholarshipType || ""}
                        onChange={handleInputChange}
                        className="w-full border rounded-lg px-3 py-2"
                        required
                      >
                        <option value="">Select Type</option>
                        <option value="merit">Merit-based</option>
                        <option value="need">Need-based</option>
                        <option value="athletic">Athletic</option>
                        <option value="academic">Academic</option>
                        <option value="minority">Minority</option>
                        <option value="international">International</option>
                      </select>
                    </div>
                    
                    <div>
                      <Label htmlFor="amount">Amount (leave empty if percentage)</Label>
                      <Input
                        id="amount"
                        name="amount"
                        type="number"
                        value={newItem.amount || ""}
                        onChange={handleInputChange}
                        placeholder="5000"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="percentage">Percentage (leave empty if fixed amount)</Label>
                      <Input
                        id="percentage"
                        name="percentage"
                        type="number"
                        value={newItem.percentage || ""}
                        onChange={handleInputChange}
                        placeholder="25"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="totalAvailable">Total Available</Label>
                      <Input
                        id="totalAvailable"
                        name="totalAvailable"
                        type="number"
                        value={newItem.totalAvailable || ""}
                        onChange={handleInputChange}
                        placeholder="10"
                      />
                    </div>
                  </>
                )}

                {/* Financial Aid Fields */}
                {activeTab === "financial-aids" && (
                  <>
                    <div>
                      <Label htmlFor="aidName">Financial Aid Name</Label>
                      <Input
                        id="aidName"
                        name="aidName"
                        value={newItem.aidName || ""}
                        onChange={handleInputChange}
                        placeholder="e.g., Student Loan Program"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="aidType">Aid Type</Label>
                      <select
                        id="aidType"
                        name="aidType"
                        value={newItem.aidType || ""}
                        onChange={handleInputChange}
                        className="w-full border rounded-lg px-3 py-2"
                        required
                      >
                        <option value="">Select Type</option>
                        <option value="grant">Grant</option>
                        <option value="loan">Loan</option>
                        <option value="work-study">Work-Study</option>
                        <option value="fellowship">Fellowship</option>
                        <option value="assistantship">Assistantship</option>
                      </select>
                    </div>
                    
                    <div>
                      <Label htmlFor="interestRate">Interest Rate (%)</Label>
                      <Input
                        id="interestRate"
                        name="interestRate"
                        type="number"
                        step="0.1"
                        value={newItem.interestRate || ""}
                        onChange={handleInputChange}
                        placeholder="3.5"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="repaymentPeriod">Repayment Period (months)</Label>
                      <Input
                        id="repaymentPeriod"
                        name="repaymentPeriod"
                        type="number"
                        value={newItem.repaymentPeriod || ""}
                        onChange={handleInputChange}
                        placeholder="120"
                      />
                    </div>
                  </>
                )}

                {/* Tuition Breakdown Fields */}
                {activeTab === "tuition-breakdowns" && (
                  <>
                    <div>
                      <Label htmlFor="academicYear">Academic Year</Label>
                      <Input
                        id="academicYear"
                        name="academicYear"
                        value={newItem.academicYear || ""}
                        onChange={handleInputChange}
                        placeholder="2024-25"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="yearNumber">Year Number</Label>
                      <Input
                        id="yearNumber"
                        name="yearNumber"
                        type="number"
                        value={newItem.yearNumber || ""}
                        onChange={handleInputChange}
                        placeholder="1"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="baseTuition">Base Tuition</Label>
                      <Input
                        id="baseTuition"
                        name="baseTuition"
                        type="number"
                        value={newItem.baseTuition || ""}
                        onChange={handleInputChange}
                        placeholder="25000"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="installmentCount">Installment Count</Label>
                      <Input
                        id="installmentCount"
                        name="installmentCount"
                        type="number"
                        value={newItem.installmentCount || ""}
                        onChange={handleInputChange}
                        placeholder="2"
                        required
                      />
                    </div>
                  </>
                )}

                {/* Payment Schedule Fields */}
                {activeTab === "payment-schedules" && (
                  <>
                    <div>
                      <Label htmlFor="tuitionBreakdownId">Tuition Breakdown</Label>
                      <select
                        id="tuitionBreakdownId"
                        name="tuitionBreakdownId"
                        value={newItem.tuitionBreakdownId || ""}
                        onChange={handleInputChange}
                        className="w-full border rounded-lg px-3 py-2"
                        required
                      >
                        <option value="">Select Tuition Breakdown</option>
                        {/* Add tuition breakdown options here */}
                      </select>
                    </div>
                    
                    <div>
                      <Label htmlFor="installmentNumber">Installment Number</Label>
                      <Input
                        id="installmentNumber"
                        name="installmentNumber"
                        type="number"
                        value={newItem.installmentNumber || ""}
                        onChange={handleInputChange}
                        placeholder="1"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="dueDate">Due Date</Label>
                      <Input
                        id="dueDate"
                        name="dueDate"
                        type="date"
                        value={newItem.dueDate || ""}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="amount">Amount</Label>
                      <Input
                        id="amount"
                        name="amount"
                        type="number"
                        value={newItem.amount || ""}
                        onChange={handleInputChange}
                        placeholder="12500"
                        required
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Fee Details Section for Fee Structures */}
              {activeTab === "fee-structures" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Fee Details</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="tuitionFee">Tuition Fee</Label>
                      <Input
                        id="tuitionFee"
                        name="tuitionFee"
                        type="number"
                        value={newItem.tuitionFee || ""}
                        onChange={handleInputChange}
                        placeholder="25000"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="admissionFee">Admission Fee</Label>
                      <Input
                        id="admissionFee"
                        name="admissionFee"
                        type="number"
                        value={newItem.admissionFee || ""}
                        onChange={handleInputChange}
                        placeholder="500"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="registrationFee">Registration Fee</Label>
                      <Input
                        id="registrationFee"
                        name="registrationFee"
                        type="number"
                        value={newItem.registrationFee || ""}
                        onChange={handleInputChange}
                        placeholder="200"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="examFee">Exam Fee</Label>
                      <Input
                        id="examFee"
                        name="examFee"
                        type="number"
                        value={newItem.examFee || ""}
                        onChange={handleInputChange}
                        placeholder="300"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="libraryFee">Library Fee</Label>
                      <Input
                        id="libraryFee"
                        name="libraryFee"
                        type="number"
                        value={newItem.libraryFee || ""}
                        onChange={handleInputChange}
                        placeholder="150"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="labFee">Lab Fee</Label>
                      <Input
                        id="labFee"
                        name="labFee"
                        type="number"
                        value={newItem.labFee || ""}
                        onChange={handleInputChange}
                        placeholder="400"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="hostelFee">Hostel Fee</Label>
                      <Input
                        id="hostelFee"
                        name="hostelFee"
                        type="number"
                        value={newItem.hostelFee || ""}
                        onChange={handleInputChange}
                        placeholder="8000"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="messFee">Mess Fee</Label>
                      <Input
                        id="messFee"
                        name="messFee"
                        type="number"
                        value={newItem.messFee || ""}
                        onChange={handleInputChange}
                        placeholder="3000"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="transportFee">Transport Fee</Label>
                      <Input
                        id="transportFee"
                        name="transportFee"
                        type="number"
                        value={newItem.transportFee || ""}
                        onChange={handleInputChange}
                        placeholder="1200"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="sportsFee">Sports Fee</Label>
                      <Input
                        id="sportsFee"
                        name="sportsFee"
                        type="number"
                        value={newItem.sportsFee || ""}
                        onChange={handleInputChange}
                        placeholder="100"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="medicalFee">Medical Fee</Label>
                      <Input
                        id="medicalFee"
                        name="medicalFee"
                        type="number"
                        value={newItem.medicalFee || ""}
                        onChange={handleInputChange}
                        placeholder="200"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="healthInsurance">Health Insurance</Label>
                      <Input
                        id="healthInsurance"
                        name="healthInsurance"
                        type="number"
                        value={newItem.healthInsurance || ""}
                        onChange={handleInputChange}
                        placeholder="600"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="technologyFee">Technology Fee</Label>
                      <Input
                        id="technologyFee"
                        name="technologyFee"
                        type="number"
                        value={newItem.technologyFee || ""}
                        onChange={handleInputChange}
                        placeholder="300"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="securityDeposit">Security Deposit</Label>
                      <Input
                        id="securityDeposit"
                        name="securityDeposit"
                        type="number"
                        value={newItem.securityDeposit || ""}
                        onChange={handleInputChange}
                        placeholder="1000"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={newItem.isActive || false}
                      onChange={handleInputChange}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="isActive">Active</Label>
                  </div>
                  
                  <div>
                    <Label htmlFor="effectiveDate">Effective Date</Label>
                    <Input
                      id="effectiveDate"
                      name="effectiveDate"
                      type="date"
                      value={newItem.effectiveDate || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Additional Fields for Tuition Breakdowns */}
              {activeTab === "tuition-breakdowns" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Additional Fees</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="labFees">Lab Fees</Label>
                      <Input
                        id="labFees"
                        name="labFees"
                        type="number"
                        value={newItem.labFees || ""}
                        onChange={handleInputChange}
                        placeholder="1200"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="libraryFees">Library Fees</Label>
                      <Input
                        id="libraryFees"
                        name="libraryFees"
                        type="number"
                        value={newItem.libraryFees || ""}
                        onChange={handleInputChange}
                        placeholder="800"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="technologyFees">Technology Fees</Label>
                      <Input
                        id="technologyFees"
                        name="technologyFees"
                        type="number"
                        value={newItem.technologyFees || ""}
                        onChange={handleInputChange}
                        placeholder="500"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="activityFees">Activity Fees</Label>
                      <Input
                        id="activityFees"
                        name="activityFees"
                        type="number"
                        value={newItem.activityFees || ""}
                        onChange={handleInputChange}
                        placeholder="300"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="dormitoryFees">Dormitory Fees</Label>
                      <Input
                        id="dormitoryFees"
                        name="dormitoryFees"
                        type="number"
                        value={newItem.dormitoryFees || ""}
                        onChange={handleInputChange}
                        placeholder="8000"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="mealPlanFees">Meal Plan Fees</Label>
                      <Input
                        id="mealPlanFees"
                        name="mealPlanFees"
                        type="number"
                        value={newItem.mealPlanFees || ""}
                        onChange={handleInputChange}
                        placeholder="4000"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={newItem.isActive || false}
                      onChange={handleInputChange}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="isActive">Active</Label>
                  </div>
                </div>
              )}

              {/* Common fields for scholarships and financial aids */}
              {(activeTab === "scholarships" || activeTab === "financial-aids") && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Additional Information</h3>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <textarea
                      id="description"
                      name="description"
                      value={newItem.description || ""}
                      onChange={handleInputChange}
                      className="w-full border rounded-lg px-3 py-2 h-24"
                      placeholder="Brief description..."
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="eligibilityCriteria">Eligibility Criteria</Label>
                    <textarea
                      id="eligibilityCriteria"
                      name="eligibilityCriteria"
                      value={newItem.eligibilityCriteria || ""}
                      onChange={handleInputChange}
                      className="w-full border rounded-lg px-3 py-2 h-24"
                      placeholder="Eligibility requirements..."
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="minimumGpa">Minimum GPA</Label>
                    <Input
                      id="minimumGpa"
                      name="minimumGpa"
                      type="number"
                      step="0.1"
                      value={newItem.minimumGpa || ""}
                      onChange={handleInputChange}
                      placeholder="3.0"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="applicationDeadline">Application Deadline</Label>
                    <Input
                      id="applicationDeadline"
                      name="applicationDeadline"
                      type="date"
                      value={newItem.applicationDeadline || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={newItem.isActive || false}
                      onChange={handleInputChange}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="isActive">Active</Label>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={closeModal}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
                {editingItem ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial Management System</h1>
          <p className="text-gray-600">Manage university fees, scholarships, and financial aid programs</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2"
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </Button>
            );
          })}
        </div>

        {activeTab === "dashboard" ? renderDashboard() : renderDataTable()}
        {renderModal()}
      </div>
    </div>
  );
};

export default FinancialManagementSystem;