import { z } from "zod";

export const playerSchema = z.object({
  fullName: z
    .string()
    .min(3, "Name must contain at least 3 characters")
    .regex(/^[A-Za-z\s]+$/, "Only letters and spaces allowed"),

  gender: z.string().min(1, "Please select gender"),

  dob: z.string().refine((date) => {
    const age =
      new Date().getFullYear() -
      new Date(date).getFullYear();

    return age >= 5 && age <= 60;
  }, "Age should be between 5 and 60"),

  event: z.string().min(1, "Please select event"),

  email: z
    .string()
    .email("Invalid email"),

  phone: z
    .string()
    .regex(/^\d{10}$/, "Phone must contain 10 digits"),

  aadharCard: z
    .string()
    .regex(/^\d{12}$/, "Aadhar must contain 12 digits"),

  institute: z
    .string()
    .min(2, "Institute name required"),

  addressLine1: z
    .string()
    .min(5, "Address required"),

  addressLine2: z.string().optional(),

  pincode: z
    .string()
    .regex(/^\d{6}$/, "Pincode must contain 6 digits")
});