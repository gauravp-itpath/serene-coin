import { z } from "zod";

export const checkoutSchema = z.object({
  cardNumber: z
    .string()
    .refine(
      (val) => /^[\d\s]+$/.test(val),
      "Card number must contain only digits and spaces"
    ) // Allow spaces
    .transform((val) => val.replace(/\s/g, "")) // Remove spaces before further validation
    .refine((val) => val.length === 16, "Card number must be 16 digits"), // Check for exactly 16 digits

  expiryDate: z
    .string()
    .length(4, "Expiry date must be 4 digits (MMYY)")
    .regex(/^\d+$/, "Expiry date must contain only digits")
    .refine(
      (val) => {
        const month = parseInt(val.substring(0, 2), 10);
        return month >= 1 && month <= 12;
      },
      { message: "Invalid month" }
    )
    .refine(
      (val) => {
        const year = parseInt(val.substring(2), 10);
        return year >= new Date().getFullYear() % 100;
      },
      { message: "Card has expired" }
    ),
  cvv: z
    .string()
    .length(3, "CVV must be 3 digits")
    .regex(/^\d+$/, "CVV must contain only digits"),
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name must contain only letters and spaces"),
  email: z.string().email("Invalid email address"),
  country: z.string().min(1, "Please select a country"),
});
