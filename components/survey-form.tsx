"use client"

import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Form } from "formik"
import { stepSchemas } from "@/schemas/survey"
import { LuArrowRight } from "react-icons/lu"
import { Button } from "@heroui/react"

const TOTAL_STEPS = 6
const stepTitles = ["Company & Contact", "Current Systems", "Challenges", "Hidden Needs", "Customization", "Feedback"]

export default function SurveyForm() {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [currentStep, setCurrentStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Complete form data state matching database fields
  const [formData, setFormData] = useState({
    // Step 1: Company & Contact
    company_name: "",
    no_of_employees: "",
    location: "",
    industries: [] as string[],
    industry_other: "",
    contact_person: "",
    role: "",
    email: "",
    phone: "",

    // Step 2: Current Systems
    current_systems: [] as string[],
    current_system_other: "",
    satisfaction_level: "",

    // Step 3: Operational Challenges
    system_performance_issues: [] as string[],
    process_workflow_issues: [] as string[],
    reporting_data_issues: [] as string[],
    hr_payroll_issues: [] as string[],
    customer_sales_issues: [] as string[],
    inventory_supply_chain_issues: [] as string[],
    digital_marketing_issues: [] as string[],

    // Step 4: Hidden Needs
    daily_situations: [] as string[],
    improvement_areas: [] as string[],

    // Step 5: System Customization
    systems_of_interest: [] as string[],
    system_of_interest_other: "",
    preferred_features: [] as string[],

    // Step 6: Open Feedback
    pain_points: "",
    ideal_system: "",
    additional_comments: "",
  })

  const [otherSelections, setOtherSelections] = useState({
    industry: false,
    system: false,
    interest: false,
  })

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }))
  }

  const handleCheckboxChange = (field: keyof typeof formData, value: string, checked: boolean) => {
    setFormData((prev) => {
      const arr = prev[field] as string[]
      return {
        ...prev,
        [field]: checked ? [...arr, value] : arr.filter((v) => v !== value),
      }
    })
    setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const digitsOnly = value.replace(/\D/g, "")
    const sanitizedValue = digitsOnly.slice(0, 11)

    setFormData((prev) => ({ ...prev, phone: sanitizedValue }))

    if (value !== digitsOnly) {
      setErrors((prev) => ({ ...prev, phone: "Phone number cannot contain letters" }))
    } else if (digitsOnly.length > 11) {
      setErrors((prev) => ({ ...prev, phone: "Phone number cannot exceed 11 digits" }))
    } else {
      setErrors((prev) => ({ ...prev, phone: "" }))
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData((prev) => ({ ...prev, email: value }))

    if (value && !validateEmail(value)) {
      setErrors((prev) => ({ ...prev, email: "Please enter a valid email address" }))
    } else {
      setErrors((prev) => ({ ...prev, email: "" }))
    }
  }

  const handleOtherToggle = (field: "industry" | "system" | "interest", checked: boolean) => {
    setOtherSelections((prev) => ({ ...prev, [field]: checked }))

    if (field === "industry") {
      if (checked) {
        setFormData((prev) => ({
          ...prev,
          industries: [...prev.industries, "Other"],
        }))
      } else {
        setFormData((prev) => ({
          ...prev,
          industries: prev.industries.filter((item) => item !== "Other"),
          industry_other: "",
        }))
      }
    }

    if (field === "system") {
      if (checked) {
        setFormData((prev) => ({
          ...prev,
          current_systems: [...prev.current_systems, "Other"],
        }))
      } else {
        setFormData((prev) => ({
          ...prev,
          current_systems: prev.current_systems.filter((item) => item !== "Other"),
          current_system_other: "",
        }))
      }
    }

    if (field === "interest") {
      if (checked) {
        setFormData((prev) => ({
          ...prev,
          systems_of_interest: [...prev.systems_of_interest, "Other"],
        }))
      } else {
        setFormData((prev) => ({
          ...prev,
          systems_of_interest: prev.systems_of_interest.filter((item) => item !== "Other"),
          system_of_interest_other: "",
        }))
      }
    }
  }

  const handleNext = async () => {
    const schema = stepSchemas[currentStep - 1]

    try {
      await schema.validate(formData, { abortEarly: false })
      setErrors({})
      if (currentStep < TOTAL_STEPS) {
        setCurrentStep(currentStep + 1)
      }
    } catch (err: any) {
      if (err.inner) {
        const newErrors: Record<string, string> = {}
        err.inner.forEach((validationError: any) => {
          if (validationError.path) {
            newErrors[validationError.path] = validationError.message
          }
        })
        setErrors(newErrors)
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      await stepSchemas[5].validate(formData, { abortEarly: false })

      const response = await fetch("/api/surveys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        setSubmitted(true)
      } else {
        console.error("Failed to submit survey:", data)
        alert("Failed to submit survey. Please try again.")
      }
    } catch (err: any) {
      if (err.inner) {
        const newErrors: any = {}
        err.inner.forEach((e: any) => {
          newErrors[e.path] = e.message
        })
        setErrors(newErrors)
        setIsSubmitting(false)
        return
      }

      console.error("Error submitting survey:", err)
      alert("An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <Card className="max-w-lg mx-auto bg-white/95 backdrop-blur shadow-2xl border-0">
        <CardContent className="pt-12 pb-12 text-center">
          <CheckCircle2 className="w-20 h-20 text-emerald-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-3 text-slate-800">Thank You!</h2>
          <p className="text-slate-600">
            Thank you for taking the time to share your business needs. Your feedback helps us build smarter, more effective customized systems for
            your organization.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {stepTitles.map((title, index) => (
            <div
              key={title}
              className={cn(
                "flex flex-col items-center flex-1 text-center",
                index + 1 === currentStep && "text-primary",
                index + 1 < currentStep && "text-emerald-400",
                index + 1 > currentStep && "text-primary/50",
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors",
                  index + 1 === currentStep && "text-white bg-gradient-to-r from-blue-600 to-cyan-500",
                  index + 1 < currentStep && "bg-emerald-500 text-white border-emerald-500",
                  index + 1 > currentStep && "bg-slate-800 border-blue-400/30 text-blue-300/50",
                )}
              >
                {index + 1 < currentStep ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
              </div>
              <span className="text-xs mt-1 hidden md:block">{title}</span>
            </div>
          ))}
        </div>
        <div className="w-full bg-slate-700/50 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-600 to-cyan-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>

      <Card className="mb-6 bg-white/95 backdrop-blur shadow-2xl border-0">
        {/* Step 1: Company & Contact */}
        {currentStep === 1 && (
          <>
            <CardHeader>
              <CardTitle className="text-slate-800">Company & Contact Information</CardTitle>
              <CardDescription>Tell us about your organization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-slate-700">
                    Company Name
                  </Label>
                  <Input
                    id="companyName"
                    placeholder="Enter company name"
                    className="border-slate-300"
                    value={formData.company_name}
                    onChange={(e) => handleInputChange("company_name", e.target.value)}
                  />
                  {errors.company_name && <p className="text-red-500 text-xs mt-1">{errors.company_name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="noOfEmployees" className="text-slate-700">
                    Number of Employees
                  </Label>
                  <Select value={formData.no_of_employees} onValueChange={(value) => handleInputChange("no_of_employees", value)}>
                    <SelectTrigger id="noOfEmployees" className="border-slate-300 bg-white">
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="1-10" className="focus:text-white hover:bg-primary focus:bg-primary cursor-pointer">
                        1-10
                      </SelectItem>
                      <SelectItem value="11-50" className="focus:text-white hover:bg-primary focus:bg-primary cursor-pointer">
                        11-50
                      </SelectItem>
                      <SelectItem value="51-200" className="focus:text-white hover:bg-primary focus:bg-primary cursor-pointer">
                        51-200
                      </SelectItem>
                      <SelectItem value="201-500" className="focus:text-white hover:bg-primary focus:bg-primary cursor-pointer">
                        201-500
                      </SelectItem>
                      <SelectItem value="501-1000" className="focus:text-white hover:bg-primary focus:bg-primary cursor-pointer">
                        501-1000
                      </SelectItem>
                      <SelectItem value="1000+" className="focus:text-white hover:bg-primary focus:bg-primary cursor-pointer">
                        1000+
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.no_of_employees && <p className="text-red-500 text-xs mt-1">{errors.no_of_employees}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-slate-700">
                    Location
                  </Label>
                  <Input
                    id="location"
                    placeholder="Enter location"
                    className="border-slate-300"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                  />
                  {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-slate-700">Industry</Label>
                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                  {["Manufacturing", "Retail", "Healthcare", "Logistics", "Education", "Finance", "Hospitality", "Construction", "Other"].map(
                    (industry) => (
                      <div key={industry}>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`industry-${industry}`}
                            checked={industry === "Other" ? otherSelections.industry : formData.industries.includes(industry)}
                            onCheckedChange={(checked) => {
                              if (industry === "Other") {
                                if (checked) {
                                  setFormData((prev) => ({ ...prev, industries: [] }))
                                  handleOtherToggle("industry", true)
                                } else {
                                  handleOtherToggle("industry", false)
                                }
                              } else {
                                if (checked) {
                                  handleOtherToggle("industry", false)
                                  handleCheckboxChange("industries", industry, true)
                                } else {
                                  handleCheckboxChange("industries", industry, false)
                                }
                              }
                            }}
                          />

                          <Label htmlFor={`industry-${industry}`} className="font-normal text-sm text-slate-600">
                            {industry}
                          </Label>
                        </div>
                      </div>
                    ),
                  )}
                  {errors.industries && <p className="text-red-500 text-xs mt-1">{errors.industries}</p>}
                </div>
                {otherSelections.industry && (
                  <div className="mt-2 ml-6">
                    <Input
                      placeholder="Please specify your industry"
                      value={formData.industry_other}
                      onChange={(e) => handleInputChange("industry_other", e.target.value)}
                      className="border-slate-300"
                    />
                    {errors.industry_other && <p className="text-red-500 text-xs mt-1">{errors.industry_other}</p>}
                  </div>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contactPerson" className="text-slate-700">
                    Contact Person
                  </Label>
                  <Input
                    id="contactPerson"
                    placeholder="Enter name"
                    className="border-slate-300"
                    value={formData.contact_person}
                    onChange={(e) => handleInputChange("contact_person", e.target.value)}
                  />
                  {errors.contact_person && <p className="text-red-500 text-xs mt-1">{errors.contact_person}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-slate-700">
                    Role / Position
                  </Label>
                  <Input
                    id="role"
                    placeholder="Enter role"
                    className="border-slate-300"
                    value={formData.role}
                    onChange={(e) => handleInputChange("role", e.target.value)}
                  />
                  {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email"
                    className={cn("border-slate-300", errors.email && "border-red-500 focus-visible:ring-red-500")}
                    value={formData.email}
                    onChange={handleEmailChange}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-slate-700">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter phone number"
                    className={cn("border-slate-300", errors.phone && "border-red-500 focus-visible:ring-red-500")}
                    value={formData.phone}
                    onChange={handlePhoneChange}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
              </div>
            </CardContent>
          </>
        )}

        {/* Step 2: Current Systems */}
        {currentStep === 2 && (
          <>
            <CardHeader>
              <CardTitle className="text-slate-800">Current System Overview</CardTitle>
              <CardDescription>What systems are you currently using?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label className="text-slate-700">Select all that apply</Label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    "ERP",
                    "CRM",
                    "HR / Payroll System",
                    "Inventory Management",
                    "POS System",
                    "E-commerce / Ordering System",
                    "Excel / Manual Records",
                    "Booking System",
                    "Other",
                  ].map((system) => (
                    <div key={system}>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`system-${system}`}
                          checked={system === "Other" ? otherSelections.system : formData.current_systems.includes(system)}
                          onCheckedChange={(checked) => {
                            if (system === "Other") {
                              if (checked) {
                                setFormData((prev) => ({ ...prev, current_systems: [] }))
                                handleOtherToggle("system", true)
                              } else {
                                handleOtherToggle("system", false)
                              }
                            } else {
                              if (checked) {
                                handleOtherToggle("system", false)
                                handleCheckboxChange("current_systems", system, true)
                              } else {
                                handleCheckboxChange("current_systems", system, false)
                              }
                            }
                          }}
                        />
                        <Label htmlFor={`system-${system}`} className="font-normal text-sm text-slate-600">
                          {system}
                        </Label>
                      </div>
                      {errors.current_systems && <p className="text-red-500 text-xs mt-1">{errors.current_systems}</p>}
                    </div>
                  ))}
                </div>
                {otherSelections.system && (
                  <div className="mt-2 ml-6">
                    <Input
                      placeholder="Please specify your system"
                      value={formData.current_system_other}
                      onChange={(e) => handleInputChange("current_system_other", e.target.value)}
                      className="border-slate-300"
                    />
                    {errors.current_system_other && <p className="text-red-500 text-xs mt-1">{errors.current_system_other}</p>}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Label className="text-slate-700">How satisfied are you with your current systems?</Label>
                <RadioGroup
                  value={formData.satisfaction_level}
                  onValueChange={(value) => handleInputChange("satisfaction_level", value)}
                  className="space-y-2"
                >
                  {["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very Dissatisfied"].map((level) => (
                    <div key={level} className="flex items-center space-x-2">
                      <RadioGroupItem value={level.toLowerCase().replace(" ", "-")} id={`satisfaction-${level}`} />
                      <Label htmlFor={`satisfaction-${level}`} className="font-normal text-sm text-slate-600">
                        {level}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                {errors.satisfaction_level && <p className="text-red-500 text-xs mt-1">{errors.satisfaction_level}</p>}
              </div>
            </CardContent>
          </>
        )}

        {/* Step 3: Operational Challenges */}
        {currentStep === 3 && (
          <>
            <CardHeader>
              <CardTitle className="text-slate-800">Operational Challenges</CardTitle>
              <CardDescription>Indicate the problems you currently face</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                {
                  title: "System Performance Issues",
                  field: "system_performance_issues",
                  items: [
                    "Slow system response",
                    "Frequent system downtime",
                    "System crashes or bugs",
                    "Poor user interface",
                    "Difficult navigation",
                  ],
                },
                {
                  title: "Process & Workflow",
                  field: "process_workflow_issues",
                  items: ["Manual data entry", "Repetitive tasks", "Inefficient approval process", "Data duplication", "Lack of automation"],
                },
                {
                  title: "Reporting & Data",
                  field: "reporting_data_issues",
                  items: ["Inaccurate reports", "Delayed reporting", "Difficult to extract data", "No real-time dashboard", "Limited analytics"],
                },
                {
                  title: "Human Resources / Payroll",
                  field: "hr_payroll_issues",
                  items: ["Payroll errors", "Late salary processing", "Leave management issues", "Attendance tracking problems", "Compliance issues"],
                },
                {
                  title: "Customer & Sales Management",
                  field: "customer_sales_issues",
                  items: ["Poor customer tracking", "Delayed order processing", "Lost sales data", "No CRM system", "Lack of customer insights"],
                },
                {
                  title: "Inventory & Supply Chain",
                  field: "inventory_supply_chain_issues",
                  items: ["Stock shortages", "Overstocking", "Inaccurate stock levels", "Poor supplier tracking", "Manual stock updates"],
                },
                {
                  title: "Digital Marketing & Online Presence",
                  field: "digital_marketing_issues",
                  items: [
                    "Low online visibility",
                    "Ineffective social media",
                    "Poor website performance",
                    "Low lead generation",
                    "Lack of campaign tracking",
                  ],
                },
              ].map((section) => (
                <div key={section.title} className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-800">{section.title}</Label>
                  <div className="grid gap-2 grid-cols-1 md:grid-cols-2">
                    {section.items.map((item) => (
                      <div key={item} className="flex items-center space-x-2">
                        <Checkbox
                          id={`challenge-${item}`}
                          checked={(formData[section.field as keyof typeof formData] as string[])?.includes(item) || false}
                          onCheckedChange={(checked) => handleCheckboxChange(section.field as keyof typeof formData, item, checked as boolean)}
                        />

                        <Label htmlFor={`challenge-${item}`} className="font-normal text-sm text-slate-600">
                          {item}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {(errors[section.field as keyof typeof formData] as string) && (
                    <p className="text-red-500 text-xs mt-1">{errors[section.field as keyof typeof formData]}</p>
                  )}
                </div>
              ))}
            </CardContent>
          </>
        )}

        {/* Step 4: Hidden Needs Discovery */}
        {currentStep === 4 && (
          <>
            <CardHeader>
              <CardTitle className="text-slate-800">Hidden Needs Discovery</CardTitle>
              <CardDescription>Even if you have not identified issues, please consider the following</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label className="text-slate-700">Which of these situations occur in your daily operations?</Label>
                <div className="space-y-2">
                  {[
                    "Employees spend too much time on manual tasks",
                    "Difficulty tracking overall business performance",
                    "Delayed decision-making due to lack of data",
                    "Multiple systems not integrated",
                    "Customer complaints due to operational delays",
                  ].map((situation) => (
                    <div key={situation} className="flex items-center space-x-2">
                      <Checkbox
                        id={`situation-${situation}`}
                        checked={formData.daily_situations.includes(situation)}
                        onCheckedChange={(checked) => handleCheckboxChange("daily_situations", situation, checked as boolean)}
                      />
                      <Label htmlFor={`situation-${situation}`} className="font-normal text-sm text-slate-600">
                        {situation}
                      </Label>
                    </div>
                  ))}
                  {(errors.daily_situations as string) && <p className="text-red-500 text-xs mt-1">{errors.daily_situations}</p>}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-slate-700">Which areas would you like to improve?</Label>
                <div className="grid gap-2 md:grid-cols-2">
                  {["Speed of operations", "Cost reduction", "Accuracy of data", "Customer satisfaction", "Employee productivity", "Branding"].map(
                    (area) => (
                      <div key={area} className="flex items-center space-x-2">
                        <Checkbox
                          id={`improve-${area}`}
                          checked={formData.improvement_areas.includes(area)}
                          onCheckedChange={(checked) => handleCheckboxChange("improvement_areas", area, checked as boolean)}
                        />
                        <Label htmlFor={`improve-${area}`} className="font-normal text-sm text-slate-600">
                          {area}
                        </Label>
                      </div>
                    ),
                  )}
                </div>
                {(errors.improvement_areas as string) && <p className="text-red-500 text-xs mt-1">{errors.improvement_areas}</p>}
              </div>
            </CardContent>
          </>
        )}

        {/* Step 5: System Customization Interest */}
        {currentStep === 5 && (
          <>
            <CardHeader>
              <CardTitle className="text-slate-800">System Customization Interest</CardTitle>
              <CardDescription>What solutions are you looking for?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label className="text-slate-700">Which systems are you interested in improving or implementing?</Label>
                <div className="grid gap-2 md:grid-cols-2">
                  {[
                    "Payroll System",
                    "HR Management",
                    "CRM",
                    "Inventory System",
                    "E-commerce / Ordering System",
                    "Project Management",
                    "Automated Reporting",
                    "Custom Workflow",
                    "Other",
                  ].map((system) => (
                    <div key={system}>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`interest-${system}`}
                          checked={system === "Other" ? otherSelections.interest : formData.systems_of_interest.includes(system)}
                          onCheckedChange={(checked) => {
                            if (system === "Other") {
                              if (checked) {
                                setFormData((prev) => ({ ...prev, systems_of_interest: [] }))
                                handleOtherToggle("interest", true)
                              } else {
                                handleOtherToggle("interest", false)
                              }
                            } else {
                              if (checked) {
                                handleOtherToggle("interest", false)
                                handleCheckboxChange("systems_of_interest", system, true)
                              } else {
                                handleCheckboxChange("systems_of_interest", system, false)
                              }
                            }
                          }}
                        />
                        <Label htmlFor={`interest-${system}`} className="font-normal text-sm text-slate-600">
                          {system}
                        </Label>
                      </div>
                    </div>
                  ))}
                </div>
                {(errors.systems_of_interest as string) && <p className="text-red-500 text-xs mt-1">{errors.systems_of_interest}</p>}
                {otherSelections.interest && (
                  <div className="mt-2 ml-6">
                    <Input
                      placeholder="Please specify the system you're interested in"
                      value={formData.system_of_interest_other}
                      onChange={(e) => handleInputChange("system_of_interest_other", e.target.value)}
                      className="border-slate-300"
                    />
                    {(errors.system_of_interest_other as string) && <p className="text-red-500 text-xs mt-1">{errors.system_of_interest_other}</p>}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Label className="text-slate-700">Preferred features (Select all that apply)</Label>
                <div className="grid gap-2 md:grid-cols-2">
                  {["Cloud-based access", "Mobile access", "Automated reporting", "System integration", "Multi-user roles", "Real-time alerts"].map(
                    (feature) => (
                      <div key={feature} className="flex items-center space-x-2">
                        <Checkbox
                          id={`feature-${feature}`}
                          checked={formData.preferred_features.includes(feature)}
                          onCheckedChange={(checked) => handleCheckboxChange("preferred_features", feature, checked as boolean)}
                        />
                        <Label htmlFor={`feature-${feature}`} className="font-normal text-sm text-slate-600">
                          {feature}
                        </Label>
                      </div>
                    ),
                  )}
                  {(errors.preferred_features as string) && <p className="text-red-500 text-xs mt-1">{errors.preferred_features}</p>}
                </div>
              </div>
            </CardContent>
          </>
        )}

        {/* Step 6: Open Feedback */}
        {currentStep === 6 && (
          <>
            <CardHeader>
              <CardTitle className="text-slate-800">Open Feedback</CardTitle>
              <CardDescription>Share your thoughts and requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="painPoints" className="text-slate-700">
                  What are your main operational pain points?
                </Label>
                <Textarea
                  id="painPoints"
                  placeholder="Describe your main challenges..."
                  rows={3}
                  className="border-slate-300"
                  value={formData.pain_points}
                  onChange={(e) => handleInputChange("pain_points", e.target.value)}
                />
                {(errors.pain_points as string) && <p className="text-red-500 text-xs mt-1">{errors.pain_points}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="idealSystem" className="text-slate-700">
                  What would an ideal system look like for your company?
                </Label>
                <Textarea
                  id="idealSystem"
                  placeholder="Describe your ideal solution..."
                  rows={3}
                  className="border-slate-300"
                  value={formData.ideal_system}
                  onChange={(e) => handleInputChange("ideal_system", e.target.value)}
                />
                {(errors.ideal_system as string) && <p className="text-red-500 text-xs mt-1">{errors.ideal_system}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="comments" className="text-slate-700">
                  Any additional comments or suggestions?
                </Label>
                <Textarea
                  id="comments"
                  placeholder="Additional feedback..."
                  rows={3}
                  className="border-slate-300"
                  value={formData.additional_comments}
                  onChange={(e) => handleInputChange("additional_comments", e.target.value)}
                />
                {(errors.additional_comments as string) && <p className="text-red-500 text-xs mt-1">{errors.additional_comments}</p>}
              </div>
            </CardContent>
          </>
        )}
      </Card>

      <div className="flex flex-col sm:flex-row justify-between gap-4 w-full">
        {/* Previous Button */}
        <Button
          variant="bordered"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          size="lg"
          className="gap-2 bg-transparent border-primary text-primary hover:bg-blue-900 hover:text-white disabled:opacity-30 w-full sm:w-auto"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        {/* Next or Submit */}
        {currentStep < TOTAL_STEPS ? (
          <Button
            onClick={handleNext}
            size="lg"
            className="gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 
                 hover:from-yellow-600 hover:to-orange-600 
                 text-white border-0 w-full sm:w-auto"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            size="lg"
            className="bg-gradient-to-r from-yellow-500 to-orange-500 
                 hover:from-yellow-600 hover:to-orange-600 
                 text-white border-0 w-full sm:w-auto"
            endContent={<LuArrowRight />}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Survey"
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
