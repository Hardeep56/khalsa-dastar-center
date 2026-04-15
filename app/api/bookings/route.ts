import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { bookingSchema } from "@/lib/validators/booking";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.businessId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = req.nextUrl.searchParams;
  const status = params.get("status") ?? undefined;
  const workerId = params.get("workerId") ?? undefined;

  const bookings = await db.booking.findMany({
    where: {
      businessId: session.user.businessId,
      status: status as any,
      assignedWorkerId: workerId,
    },
    include: { customer: true, assignedWorker: true, attachments: true, payments: true },
    orderBy: { eventDate: "asc" },
  });

  return NextResponse.json(bookings);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.businessId || session.user.role === "WORKER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await req.json();
  const parsed = bookingSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const booking = await db.$transaction(async (tx) => {
    const customer = await tx.customer.create({
      data: {
        businessId: session.user.businessId!,
        fullName: data.customerFullName,
        phone: data.customerPhone,
        email: data.customerEmail || null,
      },
    });

    return tx.booking.create({
      data: {
        businessId: session.user.businessId!,
        customerId: customer.id,
        assignedWorkerId: data.assignedWorkerId,
        eventType: data.eventType,
        eventDate: new Date(data.eventDate),
        serviceStartTime: new Date(data.serviceStartTime),
        serviceEndTime: new Date(data.serviceEndTime),
        serviceAddress: data.serviceAddress,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        notes: data.notes,
        peopleCount: data.peopleCount,
        quotedTotal: data.quotedTotal,
        depositSubmitted: data.depositSubmitted,
        depositAmount: data.depositAmount,
        depositPaymentMode: data.depositPaymentMode,
        remainingBalance: data.remainingBalance,
        remainingBalanceState: data.remainingBalanceStatus,
        finalPaymentMode: data.finalPaymentMode,
        status: data.bookingStatus,
      },
    });
  });

  return NextResponse.json(booking, { status: 201 });
}
