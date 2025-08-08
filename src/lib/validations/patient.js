import { z } from "zod";

export const patientSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  dateOfBirth: z.string().refine((date) => {
    const birthDate = new Date(date);
    const today = new Date();
    return birthDate < today;
  }, "Date of birth must be in the past"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
  bloodType: z.string().optional(),
  allergies: z.array(z.string()).default([]),
  status: z.enum(["ACTIVE", "CRITICAL", "STABLE", "DISCHARGED"]).default("ACTIVE"),
  medicalHistory: z.string().optional(),
  currentMedications: z.array(z.string()).default([]),
  chronicConditions: z.array(z.string()).default([]),
});

export const patientUpdateSchema = patientSchema.partial();
