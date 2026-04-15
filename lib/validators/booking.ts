import { z } from "zod";

export const bookingSchema = z
  .object({
    customerFullName: z.string().min(2),
    customerPhone: z.string().min(7),
    customerEmail: z.string().email().optional().or(z.literal("")),
    eventType: z.string().min(2),
    eventDate: z.string(),
    serviceStartTime: z.string(),
    serviceEndTime: z.string(),
    serviceAddress: z.string().min(8),
    city: z.string().min(2),
    state: z.string().min(2),
    zipCode: z.string().min(5),
    notes: z.string().optional(),
    peopleCount: z.coerce.number().int().positive(),
    assignedWorkerId: z.string().optional(),
    quotedTotal: z.coerce.number().nonnegative(),
    depositSubmitted: z.coerce.boolean(),
    depositAmount: z.coerce.number().nonnegative(),
    depositPaymentMode: z.enum(["ZELLE", "VENMO", "APPLE_CASH", "CASH", "OTHER"]).optional(),
    remainingBalanceStatus: z.enum(["PENDING", "COLLECTED"]),
    finalPaymentMode: z.enum(["ZELLE", "VENMO", "APPLE_CASH", "CASH", "OTHER"]).optional(),
    bookingStatus: z.enum(["INQUIRY", "TENTATIVE", "CONFIRMED", "COMPLETED", "CANCELLED"]),
  })
  .transform((values) => ({
    ...values,
    remainingBalance: Number((values.quotedTotal - values.depositAmount).toFixed(2)),
  }));
