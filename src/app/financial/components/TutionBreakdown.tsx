/* eslint-disable @typescript-eslint/no-unused-vars */
// components/TuitionBreakdownForm.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Save,
  X,
  Calculator,
  DollarSign,
  Calendar,
  Building,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";
import {
  TuitionBreakdown,
  University,
  Program,
  CreateTuitionBreakdownData,
  UpdateTuitionBreakdownData,
  ACADEMIC_YEARS,
  YEAR_NUMBERS,
  CURRENCIES,
  PAYMENT_TERMS,
} from "../types/finanance";
import {
  createTuitionBreakdown,
  updateTuitionBreakdown,
} from "../action/action";

interface TuitionBreakdownFormProps {
  tuitionBreakdown?: TuitionBreakdown;
  universities: University[];
  programs: Program[];
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormData {
  universityId: string;
  programId: string;
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
  currency: string;
  currencySymbol: string;
  paymentTerms: string;
  installmentCount: number;
  isActive: boolean;
  effectiveDate: string;
  expiryDate: string;
}

interface FormErrors {
  universityId?: string;
  programId?: string;
  academicYear?: string;
  yearNumber?: string;
  baseTuition?: string;
  currency?: string;
  effectiveDate?: string;
  installmentCount?: string;
  general?: string;
}

const TuitionBreakdownForm: React.FC<TuitionBreakdownFormProps> = ({
  tuitionBreakdown,
  universities,
  programs,
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState<FormData>({
    universityId: "",
    programId: "",
    academicYear: "",
    yearNumber: 1,
    baseTuition: 0,
    labFees: 0,
    libraryFees: 0,
    technologyFees: 0,
    activityFees: 0,
    healthInsurance: 0,
    dormitoryFees: 0,
    mealPlanFees: 0,
    applicationFee: 0,
    registrationFee: 0,
    examFees: 0,
    graduationFee: 0,
    currency: "USD",
    currencySymbol: "$",
    paymentTerms: "",
    installmentCount: 1,
    isActive: true,
    effectiveDate: "",
    expiryDate: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);
  const [calculatedTotals, setCalculatedTotals] = useState({
    totalAdditionalFees: 0,
    grandTotal: 0,
  });

  // Initialize form data if editing
  useEffect(() => {
    if (tuitionBreakdown) {
      setFormData({
        universityId: tuitionBreakdown.universityId,
        programId: tuitionBreakdown.programId || "",
        academicYear: tuitionBreakdown.academicYear,
        yearNumber: tuitionBreakdown.yearNumber,
        baseTuition: tuitionBreakdown.baseTuition,
        labFees: tuitionBreakdown.labFees,
        libraryFees: tuitionBreakdown.libraryFees,
        technologyFees: tuitionBreakdown.technologyFees,
        activityFees: tuitionBreakdown.activityFees,
        healthInsurance: tuitionBreakdown.healthInsurance,
        dormitoryFees: tuitionBreakdown.dormitoryFees,
        mealPlanFees: tuitionBreakdown.mealPlanFees,
        applicationFee: tuitionBreakdown.applicationFee,
        registrationFee: tuitionBreakdown.registrationFee,
        examFees: tuitionBreakdown.examFees,
        graduationFee: tuitionBreakdown.graduationFee,
        currency: tuitionBreakdown.currency,
        currencySymbol: tuitionBreakdown.currencySymbol,
        paymentTerms: tuitionBreakdown.paymentTerms || "",
        installmentCount: tuitionBreakdown.installmentCount,
        isActive: tuitionBreakdown.isActive,
        effectiveDate: tuitionBreakdown.effectiveDate
          .toISOString()
          .split("T")[0],
        expiryDate: tuitionBreakdown.expiryDate
          ? tuitionBreakdown.expiryDate.toISOString().split("T")[0]
          : "",
      });
    } else {
      // Set default effective date to today
      const today = new Date().toISOString().split("T")[0];
      setFormData((prev) => ({ ...prev, effectiveDate: today }));
    }
  }, [tuitionBreakdown]);

  // Filter programs based on selected university
  useEffect(() => {
    if (formData.universityId) {
      const filtered = programs.filter(
        (program) => program.universityId === formData.universityId
      );
      setFilteredPrograms(filtered);

      // Reset program selection if current program doesn't belong to selected university
      if (
        formData.programId &&
        !filtered.some((p) => p.id === formData.programId)
      ) {
        setFormData((prev) => ({ ...prev, programId: "" }));
      }
    } else {
      setFilteredPrograms([]);
      setFormData((prev) => ({ ...prev, programId: "" }));
    }
  }, [formData.universityId, programs]);

  // Calculate totals whenever relevant fields change
  useEffect(() => {
    const additionalFees = [
      formData.labFees,
      formData.libraryFees,
      formData.technologyFees,
      formData.activityFees,
      formData.healthInsurance,
      formData.dormitoryFees,
      formData.mealPlanFees,
      formData.applicationFee,
      formData.registrationFee,
      formData.examFees,
      formData.graduationFee,
    ].reduce((sum, fee) => sum + (fee || 0), 0);

    const grandTotal = (formData.baseTuition || 0) + additionalFees;

    setCalculatedTotals({
      totalAdditionalFees: additionalFees,
      grandTotal,
    });
  }, [
    formData.baseTuition,
    formData.labFees,
    formData.libraryFees,
    formData.technologyFees,
    formData.activityFees,
    formData.healthInsurance,
    formData.dormitoryFees,
    formData.mealPlanFees,
    formData.applicationFee,
    formData.registrationFee,
    formData.examFees,
    formData.graduationFee,
  ]);

  // Handle currency change
  const handleCurrencyChange = (currency: string) => {
    const currencyData = CURRENCIES.find((c) => c.code === currency);
    if (currencyData) {
      setFormData((prev) => ({
        ...prev,
        currency,
        currencySymbol: currencyData.symbol,
      }));
    }
  };

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required fields
    if (!formData.universityId) {
      newErrors.universityId = "University is required";
    }

    if (!formData.academicYear) {
      newErrors.academicYear = "Academic year is required";
    }

    if (
      !formData.yearNumber ||
      formData.yearNumber < 1 ||
      formData.yearNumber > 8
    ) {
      newErrors.yearNumber = "Year number must be between 1 and 8";
    }

    if (!formData.baseTuition || formData.baseTuition <= 0) {
      newErrors.baseTuition = "Base tuition must be greater than 0";
    }

    if (!formData.currency) {
      newErrors.currency = "Currency is required";
    }

    if (!formData.effectiveDate) {
      newErrors.effectiveDate = "Effective date is required";
    }

    if (formData.installmentCount < 1 || formData.installmentCount > 12) {
      newErrors.installmentCount = "Installment count must be between 1 and 12";
    }

    // Date validation
    if (formData.effectiveDate && formData.expiryDate) {
      const effectiveDate = new Date(formData.effectiveDate);
      const expiryDate = new Date(formData.expiryDate);

      if (expiryDate <= effectiveDate) {
        newErrors.general = "Expiry date must be after effective date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the validation errors");
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const submitData:
        | CreateTuitionBreakdownData
        | UpdateTuitionBreakdownData = {
        universityId: formData.universityId,
        programId: formData.programId || undefined,
        academicYear: formData.academicYear,
        yearNumber: formData.yearNumber,
        baseTuition: formData.baseTuition,
        labFees: formData.labFees || 0,
        libraryFees: formData.libraryFees || 0,
        technologyFees: formData.technologyFees || 0,
        activityFees: formData.activityFees || 0,
        healthInsurance: formData.healthInsurance || 0,
        dormitoryFees: formData.dormitoryFees || 0,
        mealPlanFees: formData.mealPlanFees || 0,
        applicationFee: formData.applicationFee || 0,
        registrationFee: formData.registrationFee || 0,
        examFees: formData.examFees || 0,
        graduationFee: formData.graduationFee || 0,
        currency: formData.currency,
        currencySymbol: formData.currencySymbol,
        paymentTerms: formData.paymentTerms || "",
        installmentCount: formData.installmentCount,
        isActive: formData.isActive,
        effectiveDate: new Date(formData.effectiveDate),
        expiryDate: formData.expiryDate
          ? new Date(formData.expiryDate)
          : undefined,
      };

      let result;
      if (tuitionBreakdown) {
        result = await updateTuitionBreakdown({
          ...submitData,
          id: tuitionBreakdown.id,
        } as UpdateTuitionBreakdownData);
      } else {
        result = await createTuitionBreakdown(
          submitData as CreateTuitionBreakdownData
        );
      }

      if (result.success) {
        toast.success(result.message);
        onSuccess();
      } else {
        toast.error(result.error || "Operation failed");
        setErrors({ general: result.error });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error(errorMessage);
      setErrors({ general: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input changes
  const handleInputChange = (
    field: keyof FormData,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear related error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return `${formData.currencySymbol}${amount.toLocaleString()}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {tuitionBreakdown
              ? "Edit Tuition Breakdown"
              : "Create New Tuition Breakdown"}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* General Error */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-600">{errors.general}</p>
          </div>
        )}

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Building className="w-4 h-4 inline mr-1" />
              University *
            </label>
            <select
              value={formData.universityId}
              onChange={(e) =>
                handleInputChange("universityId", e.target.value)
              }
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.universityId ? "border-red-300" : "border-gray-300"
              }`}
              disabled={isSubmitting}
            >
              <option value="">Select University</option>
              {universities.map((university) => (
                <option key={university.id} value={university.id}>
                  {university.universityName}
                </option>
              ))}
            </select>
            {errors.universityId && (
              <p className="mt-1 text-sm text-red-600">{errors.universityId}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <BookOpen className="w-4 h-4 inline mr-1" />
              Program
            </label>
            <select
              value={formData.programId}
              onChange={(e) => handleInputChange("programId", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isSubmitting || !formData.universityId}
            >
              <option value="">Select Program (Optional)</option>
              {filteredPrograms.map((program) => (
                <option key={program.id} value={program.id}>
                  {program.programName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Academic Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Academic Year *
            </label>
            <select
              value={formData.academicYear}
              onChange={(e) =>
                handleInputChange("academicYear", e.target.value)
              }
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.academicYear ? "border-red-300" : "border-gray-300"
              }`}
              disabled={isSubmitting}
            >
              <option value="">Select Academic Year</option>
              {ACADEMIC_YEARS.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            {errors.academicYear && (
              <p className="mt-1 text-sm text-red-600">{errors.academicYear}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Year Number *
            </label>
            <select
              value={formData.yearNumber}
              onChange={(e) =>
                handleInputChange("yearNumber", parseInt(e.target.value))
              }
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.yearNumber ? "border-red-300" : "border-gray-300"
              }`}
              disabled={isSubmitting}
            >
              {YEAR_NUMBERS.map((year) => (
                <option key={year} value={year}>
                  Year {year}
                </option>
              ))}
            </select>
            {errors.yearNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.yearNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Currency *
            </label>
            <select
              value={formData.currency}
              onChange={(e) => handleCurrencyChange(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.currency ? "border-red-300" : "border-gray-300"
              }`}
              disabled={isSubmitting}
            >
              {CURRENCIES.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.symbol} {currency.code} - {currency.name}
                </option>
              ))}
            </select>
            {errors.currency && (
              <p className="mt-1 text-sm text-red-600">{errors.currency}</p>
            )}
          </div>
        </div>

        {/* Tuition and Fees */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Tuition & Fees
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base Tuition *
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.baseTuition}
                onChange={(e) =>
                  handleInputChange(
                    "baseTuition",
                    parseFloat(e.target.value) || 0
                  )
                }
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.baseTuition ? "border-red-300" : "border-gray-300"
                }`}
                disabled={isSubmitting}
              />
              {errors.baseTuition && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.baseTuition}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lab Fees
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.labFees}
                onChange={(e) =>
                  handleInputChange("labFees", parseFloat(e.target.value) || 0)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Library Fees
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.libraryFees}
                onChange={(e) =>
                  handleInputChange(
                    "libraryFees",
                    parseFloat(e.target.value) || 0
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Technology Fees
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.technologyFees}
                onChange={(e) =>
                  handleInputChange(
                    "technologyFees",
                    parseFloat(e.target.value) || 0
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Activity Fees
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.activityFees}
                onChange={(e) =>
                  handleInputChange(
                    "activityFees",
                    parseFloat(e.target.value) || 0
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Health Insurance
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.healthInsurance}
                onChange={(e) =>
                  handleInputChange(
                    "healthInsurance",
                    parseFloat(e.target.value) || 0
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dormitory Fees
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.dormitoryFees}
                onChange={(e) =>
                  handleInputChange(
                    "dormitoryFees",
                    parseFloat(e.target.value) || 0
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meal Plan Fees
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.mealPlanFees}
                onChange={(e) =>
                  handleInputChange(
                    "mealPlanFees",
                    parseFloat(e.target.value) || 0
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Application Fee
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.applicationFee}
                onChange={(e) =>
                  handleInputChange(
                    "applicationFee",
                    parseFloat(e.target.value) || 0
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registration Fee
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.registrationFee}
                onChange={(e) =>
                  handleInputChange(
                    "registrationFee",
                    parseFloat(e.target.value) || 0
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exam Fees
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.examFees}
                onChange={(e) =>
                  handleInputChange("examFees", parseFloat(e.target.value) || 0)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Graduation Fee
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.graduationFee}
                onChange={(e) =>
                  handleInputChange(
                    "graduationFee",
                    parseFloat(e.target.value) || 0
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>

        {/* Calculation Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
            <Calculator className="w-4 h-4 mr-2" />
            Cost Summary
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Base Tuition:</span>
              <span className="font-medium ml-2">
                {formatCurrency(formData.baseTuition)}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Additional Fees:</span>
              <span className="font-medium ml-2">
                {formatCurrency(calculatedTotals.totalAdditionalFees)}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Grand Total:</span>
              <span className="font-bold ml-2 text-lg">
                {formatCurrency(calculatedTotals.grandTotal)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Terms
            </label>
            <select
              value={formData.paymentTerms}
              onChange={(e) =>
                handleInputChange("paymentTerms", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isSubmitting}
            >
              <option value="">Select Payment Terms</option>
              {PAYMENT_TERMS.map((term: string) => (
                <option key={term} value={term}>
                  {term}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Installment Count *
            </label>
            <input
              type="number"
              min="1"
              max="12"
              value={formData.installmentCount}
              onChange={(e) =>
                handleInputChange(
                  "installmentCount",
                  parseInt(e.target.value) || 1
                )
              }
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.installmentCount ? "border-red-300" : "border-gray-300"
              }`}
              disabled={isSubmitting}
            />
            {errors.installmentCount && (
              <p className="mt-1 text-sm text-red-600">
                {errors.installmentCount}
              </p>
            )}
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Effective Date *
            </label>
            <input
              type="date"
              value={formData.effectiveDate}
              onChange={(e) =>
                handleInputChange("effectiveDate", e.target.value)
              }
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.effectiveDate ? "border-red-300" : ""
              }`}
              disabled={isSubmitting}
            />
            {errors.effectiveDate && (
              <p className="mt-1 text-sm text-red-600">
                {errors.effectiveDate}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Expiry Date
            </label>
            <input
              type="date"
              value={formData.expiryDate}
              onChange={(e) => handleInputChange("expiryDate", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Active Status */}
        <div className="flex items-center">
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={formData.isActive}
                onChange={(e) =>
                  handleInputChange("isActive", e.target.checked)
                }
                disabled={isSubmitting}
              />
              <div
                className={`block w-14 h-7 rounded-full transition-colors ${
                  formData.isActive ? "bg-green-500" : "bg-gray-400"
                }`}
              ></div>
              <div
                className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform ${
                  formData.isActive ? "transform translate-x-7" : ""
                }`}
              ></div>
            </div>
            <span className="ml-3 text-sm font-medium text-gray-700">
              {formData.isActive ? "Active" : "Inactive"}
            </span>
          </label>
        </div>

        {/* Form Buttons */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={isSubmitting}
          >
            <Save className="w-4 h-4 inline mr-1" />
            {isSubmitting ? "Saving..." : "Save Tuition Breakdown"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TuitionBreakdownForm;
