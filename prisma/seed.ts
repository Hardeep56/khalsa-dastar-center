import bcrypt from "bcryptjs";
import { PrismaClient, Role, BookingStatus, PaymentMode, BalanceStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.auditLog.deleteMany();
  await prisma.attachment.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.worker.deleteMany();
  await prisma.user.deleteMany();
  await prisma.brandingSetting.deleteMany();
  await prisma.business.deleteMany();

  const adminHash = await bcrypt.hash("Admin@12345", 10);
  const workerHash = await bcrypt.hash("Worker@12345", 10);

  const businesses = [
    {
      slug: "royal-singh-turbans",
      name: "Royal Singh Turban Studio",
      email: "admin@royalsingh.com",
      phone: "(916) 555-0101",
      address: "101 Event Way, Sacramento, CA 95814",
      brandColor: "#6d28d9",
    },
    {
      slug: "punjab-heritage-wraps",
      name: "Punjab Heritage Wraps",
      email: "owner@punjabheritage.com",
      phone: "(408) 555-0102",
      address: "88 Heritage Ave, San Jose, CA 95113",
      brandColor: "#0f766e",
    },
  ];

  for (const businessData of businesses) {
    const business = await prisma.business.create({ data: businessData });

    const admin = await prisma.user.create({
      data: {
        businessId: business.id,
        name: `${business.name} Admin`,
        email: business.email!,
        role: Role.BUSINESS_ADMIN,
        passwordHash: adminHash,
      },
    });

    const workerUser = await prisma.user.create({
      data: {
        businessId: business.id,
        name: `${business.name} Worker`,
        email: `worker+${business.slug}@example.com`,
        role: Role.WORKER,
        passwordHash: workerHash,
      },
    });

    const worker = await prisma.worker.create({
      data: {
        businessId: business.id,
        userId: workerUser.id,
        name: "Gurpreet Singh",
        email: workerUser.email,
        phone: "(555) 200-1111",
        roleLabel: "Lead Dastar Artist",
      },
    });

    const customer = await prisma.customer.create({
      data: {
        businessId: business.id,
        fullName: "Arjun Khalsa",
        phone: "(555) 300-4444",
        email: "arjun@example.com",
      },
    });

    const booking = await prisma.booking.create({
      data: {
        businessId: business.id,
        customerId: customer.id,
        assignedWorkerId: worker.id,
        eventType: "Wedding",
        eventDate: new Date("2026-07-20T10:00:00.000Z"),
        serviceStartTime: new Date("2026-07-20T09:30:00.000Z"),
        serviceEndTime: new Date("2026-07-20T12:30:00.000Z"),
        serviceAddress: "221 Grand Hall Blvd",
        city: "Fresno",
        state: "CA",
        zipCode: "93721",
        notes: "Need 6 coordinated colors with sherwani palette.",
        peopleCount: 6,
        quotedTotal: 950,
        depositSubmitted: true,
        depositAmount: 250,
        depositPaymentMode: PaymentMode.ZELLE,
        remainingBalance: 700,
        remainingBalanceState: BalanceStatus.PENDING,
        status: BookingStatus.CONFIRMED,
      },
    });

    await prisma.payment.create({
      data: {
        businessId: business.id,
        bookingId: booking.id,
        amount: 250,
        paymentMode: PaymentMode.ZELLE,
        isDeposit: true,
        note: "Initial deposit",
      },
    });

    await prisma.auditLog.create({
      data: {
        businessId: business.id,
        bookingId: booking.id,
        actorUserId: admin.id,
        action: "BOOKING_CREATED",
        entityType: "Booking",
        entityId: booking.id,
        diffJson: { status: "CONFIRMED", quotedTotal: 950 },
      },
    });

    await prisma.brandingSetting.create({
      data: {
        businessId: business.id,
        brandName: business.name,
        contactEmail: business.email,
        contactPhone: business.phone,
        address: business.address,
        brandColor: business.brandColor!,
      },
    });
  }

  await prisma.user.create({
    data: {
      name: "Platform Owner",
      email: "superadmin@khalsaplanner.com",
      role: Role.SUPER_ADMIN,
      passwordHash: adminHash,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
