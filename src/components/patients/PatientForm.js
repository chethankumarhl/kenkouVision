"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Save, 
  Plus, 
  X, 
  User, 
  Phone, 
  Mail, 
  Calendar,
  MapPin,
  Heart,
  Pill,
  FileText,
  AlertTriangle
} from "lucide-react";
import { patientSchema } from "@/lib/validations/patient";

const formSections = [
  {
    id: "personal",
    title: "Personal Information",
    icon: User,
    fields: ["firstName", "lastName", "email", "phone", "dateOfBirth", "gender", "address"]
  },
  {
    id: "emergency",
    title: "Emergency Contact",
    icon: Phone,
    fields: ["emergencyContact"]
  },
  {
    id: "medical",
    title: "Medical Information",
    icon: Heart,
    fields: ["bloodType", "allergies", "status", "medicalHistory"]
  },
  {
    id: "medications",
    title: "Current Medications",
    icon: Pill,
    fields: ["currentMedications", "chronicConditions"]
  }
];

export default function PatientForm({ initialData = null, mode = "create" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentSection, setCurrentSection] = useState(0);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
    trigger
  } = useForm({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      firstName: initialData?.firstName || "",
      lastName: initialData?.lastName || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      dateOfBirth: initialData?.dateOfBirth ? 
        new Date(initialData.dateOfBirth).toISOString().split('T')[0] : "",
      gender: initialData?.gender || "MALE",
      address: initialData?.address || "",
      emergencyContact: initialData?.emergencyContact || "",
      bloodType: initialData?.bloodType || "",
      allergies: initialData?.allergies || [],
      status: initialData?.status || "ACTIVE",
      medicalHistory: initialData?.medicalHistory || "",
      currentMedications: initialData?.currentMedications || [],
      chronicConditions: initialData?.chronicConditions || [],
    }
  });

  const {
    fields: allergyFields,
    append: appendAllergy,
    remove: removeAllergy
  } = useFieldArray({
    control,
    name: "allergies"
  });

  const {
    fields: medicationFields,
    append: appendMedication,
    remove: removeMedication
  } = useFieldArray({
    control,
    name: "currentMedications"
  });

  const {
    fields: conditionFields,
    append: appendCondition,
    remove: removeCondition
  } = useFieldArray({
    control,
    name: "chronicConditions"
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");

    try {
      const url = mode === "create" 
        ? "/api/patients" 
        : `/api/patients/${initialData.id}`;
      
      const method = mode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to save patient");
      }

      const patient = await response.json();
      router.push(`/patients/${patient.id}`);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const nextSection = async () => {
    const currentFields = formSections[currentSection].fields;
    const isValid = await trigger(currentFields);
    
    if (isValid && currentSection < formSections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  // Extract current section data for cleaner JSX
  const currentSectionData = formSections[currentSection];
  const IconComponent = currentSectionData.icon;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900">
          {mode === "create" ? "Add New Patient" : "Edit Patient"}
        </h1>
        <p className="text-gray-600 mt-2">
          {mode === "create" 
            ? "Enter patient information to create a new record"
            : "Update patient information"
          }
        </p>
      </motion.div>

      {/* Progress Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex justify-center"
      >
        <div className="flex space-x-4">
          {formSections.map((section, index) => {
            const SectionIcon = section.icon;
            return (
              <div
                key={section.id}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  index === currentSection
                    ? "bg-blue-600 text-white"
                    : index < currentSection
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <SectionIcon className="h-4 w-4" />
                <span className="text-sm font-medium">{section.title}</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <motion.div
        key={currentSection}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <IconComponent className="h-5 w-5 text-blue-600" />
              <span>{currentSectionData.title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
              {currentSection === 0 && (
                <PersonalInfoSection
                  register={register}
                  errors={errors}
                  setValue={setValue}
                  watch={watch}
                />
              )}

              {/* Emergency Contact */}
              {currentSection === 1 && (
                <EmergencyContactSection
                  register={register}
                  errors={errors}
                />
              )}

              {/* Medical Information */}
              {currentSection === 2 && (
                <MedicalInfoSection
                  register={register}
                  errors={errors}
                  setValue={setValue}
                  watch={watch}
                  allergyFields={allergyFields}
                  appendAllergy={appendAllergy}
                  removeAllergy={removeAllergy}
                />
              )}

              {/* Medications */}
              {currentSection === 3 && (
                <MedicationsSection
                  register={register}
                  errors={errors}
                  medicationFields={medicationFields}
                  appendMedication={appendMedication}
                  removeMedication={removeMedication}
                  conditionFields={conditionFields}
                  appendCondition={appendCondition}
                  removeCondition={removeCondition}
                />
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevSection}
                  disabled={currentSection === 0}
                >
                  Previous
                </Button>

                <div className="space-x-2">
                  {currentSection < formSections.length - 1 ? (
                    <Button
                      type="button"
                      onClick={nextSection}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          {mode === "create" ? "Create Patient" : "Update Patient"}
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// Section Components
function PersonalInfoSection({ register, errors, setValue, watch }) {
  const selectedGender = watch("gender");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Label htmlFor="firstName">First Name *</Label>
        <Input
          id="firstName"
          {...register("firstName")}
          className={errors.firstName ? "border-red-500" : ""}
        />
        {errors.firstName && (
          <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="lastName">Last Name *</Label>
        <Input
          id="lastName"
          {...register("lastName")}
          className={errors.lastName ? "border-red-500" : ""}
        />
        {errors.lastName && (
          <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="phone">Phone Number *</Label>
        <Input
          id="phone"
          {...register("phone")}
          className={errors.phone ? "border-red-500" : ""}
        />
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="dateOfBirth">Date of Birth *</Label>
        <Input
          id="dateOfBirth"
          type="date"
          {...register("dateOfBirth")}
          className={errors.dateOfBirth ? "border-red-500" : ""}
        />
        {errors.dateOfBirth && (
          <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="gender">Gender *</Label>
        <Select 
          value={selectedGender} 
          onValueChange={(value) => setValue("gender", value)}
        >
          <SelectTrigger className={errors.gender ? "border-red-500" : ""}>
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MALE">Male</SelectItem>
            <SelectItem value="FEMALE">Female</SelectItem>
            <SelectItem value="OTHER">Other</SelectItem>
          </SelectContent>
        </Select>
        {errors.gender && (
          <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
        )}
      </div>

      <div className="md:col-span-2">
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          {...register("address")}
          placeholder="Enter full address"
          rows={3}
          className={errors.address ? "border-red-500" : ""}
        />
        {errors.address && (
          <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
        )}
      </div>
    </div>
  );
}

function EmergencyContactSection({ register, errors }) {
  return (
    <div>
      <Label htmlFor="emergencyContact">Emergency Contact Information</Label>
      <Textarea
        id="emergencyContact"
        {...register("emergencyContact")}
        placeholder="Name, relationship, and phone number"
        rows={3}
        className={errors.emergencyContact ? "border-red-500" : ""}
      />
      {errors.emergencyContact && (
        <p className="text-red-500 text-sm mt-1">{errors.emergencyContact.message}</p>
      )}
      <p className="text-sm text-gray-600 mt-2">
        Example: John Doe (Spouse) - +1-234-567-8900
      </p>
    </div>
  );
}

function MedicalInfoSection({ 
  register, 
  errors, 
  setValue, 
  watch, 
  allergyFields, 
  appendAllergy, 
  removeAllergy 
}) {
  const [newAllergy, setNewAllergy] = useState("");
  const selectedBloodType = watch("bloodType");
  const selectedStatus = watch("status");

  const addAllergy = () => {
    if (newAllergy.trim()) {
      appendAllergy(newAllergy.trim());
      setNewAllergy("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="bloodType">Blood Type</Label>
          <Select 
            value={selectedBloodType} 
            onValueChange={(value) => setValue("bloodType", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select blood type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A+">A+</SelectItem>
              <SelectItem value="A-">A-</SelectItem>
              <SelectItem value="B+">B+</SelectItem>
              <SelectItem value="B-">B-</SelectItem>
              <SelectItem value="AB+">AB+</SelectItem>
              <SelectItem value="AB-">AB-</SelectItem>
              <SelectItem value="O+">O+</SelectItem>
              <SelectItem value="O-">O-</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="status">Patient Status</Label>
          <Select 
            value={selectedStatus} 
            onValueChange={(value) => setValue("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="CRITICAL">Critical</SelectItem>
              <SelectItem value="STABLE">Stable</SelectItem>
              <SelectItem value="DISCHARGED">Discharged</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Allergies */}
      <div>
        <Label>Allergies</Label>
        <div className="flex space-x-2 mt-2">
          <Input
            value={newAllergy}
            onChange={(e) => setNewAllergy(e.target.value)}
            placeholder="Add allergy"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergy())}
          />
          <Button type="button" onClick={addAllergy} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {allergyFields.map((field, index) => (
            <Badge
              key={field.id}
              variant="outline"
              className="flex items-center gap-1"
            >
              {field.value || watch(`allergies.${index}`)}
              <button
                type="button"
                onClick={() => removeAllergy(index)}
                className="text-red-500 hover:text-red-700 ml-1"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Medical History */}
      <div>
        <Label htmlFor="medicalHistory">Medical History</Label>
        <Textarea
          id="medicalHistory"
          {...register("medicalHistory")}
          placeholder="Enter relevant medical history"
          rows={4}
          className={errors.medicalHistory ? "border-red-500" : ""}
        />
        {errors.medicalHistory && (
          <p className="text-red-500 text-sm mt-1">{errors.medicalHistory.message}</p>
        )}
      </div>
    </div>
  );
}

function MedicationsSection({
  register,
  errors,
  medicationFields,
  appendMedication,
  removeMedication,
  conditionFields,
  appendCondition,
  removeCondition
}) {
  const [newMedication, setNewMedication] = useState("");
  const [newCondition, setNewCondition] = useState("");

  const addMedication = () => {
    if (newMedication.trim()) {
      appendMedication(newMedication.trim());
      setNewMedication("");
    }
  };

  const addCondition = () => {
    if (newCondition.trim()) {
      appendCondition(newCondition.trim());
      setNewCondition("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Medications */}
      <div>
        <Label>Current Medications</Label>
        <div className="flex space-x-2 mt-2">
          <Input
            value={newMedication}
            onChange={(e) => setNewMedication(e.target.value)}
            placeholder="Add medication (e.g., Aspirin 81mg daily)"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMedication())}
          />
          <Button type="button" onClick={addMedication} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2 mt-3">
          {medicationFields.map((field, index) => (
            <div
              key={field.id}
              className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
            >
              <span>{field.value}</span>
              <button
                type="button"
                onClick={() => removeMedication(index)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Chronic Conditions */}
      <div>
        <Label>Chronic Conditions</Label>
        <div className="flex space-x-2 mt-2">
          <Input
            value={newCondition}
            onChange={(e) => setNewCondition(e.target.value)}
            placeholder="Add chronic condition"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCondition())}
          />
          <Button type="button" onClick={addCondition} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2 mt-3">
          {conditionFields.map((field, index) => (
            <div
              key={field.id}
              className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
            >
              <span>{field.value}</span>
              <button
                type="button"
                onClick={() => removeCondition(index)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
