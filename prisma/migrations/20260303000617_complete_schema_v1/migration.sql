-- CreateEnum
CREATE TYPE "CompanyPermissionType" AS ENUM ('CREATE_TALI', 'VIEW_TALI', 'FILL_FISH_PRICE', 'VIEW_BILL', 'CREATE_BILL', 'SEND_BILL', 'ADD_COMPANY_EXPENSE', 'VIEW_COMPANY_EXPENSE', 'VIEW_EMPLOYEE_RECORDS', 'MANAGE_EMPLOYEES', 'VIEW_FINANCIAL_REPORT', 'VIEW_MEMBERS');

-- CreateEnum
CREATE TYPE "BoatPermissionType" AS ENUM ('ADD_BOAT_EXPENSE', 'VIEW_BOAT_EXPENSE', 'CREATE_TALI', 'VIEW_TALI', 'FILL_FISH_PRICE', 'VIEW_BILL', 'CREATE_BILL', 'VIEW_FINANCIAL_REPORT');

-- CreateEnum
CREATE TYPE "BoatExpenseCategory" AS ENUM ('DIESEL', 'MAINTENANCE', 'CREW_KHARCHI');

-- CreateEnum
CREATE TYPE "CompanyExpenseCategory" AS ENUM ('MAINTENANCE', 'SALARY', 'UTILITIES', 'OTHER');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('ACTIVE', 'PENDING_PRICE', 'BILLED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "BillStatus" AS ENUM ('DRAFT', 'CONFIRMED', 'SENT', 'CANCELLED');

-- CreateEnum
CREATE TYPE "EntityType" AS ENUM ('BOAT', 'COMPANY');

-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'EXPIRED', 'REVOKED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "otps" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "userId" TEXT,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "otps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameGujarati" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "gstNumber" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_memberships" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_permissions" (
    "id" TEXT NOT NULL,
    "membershipId" TEXT NOT NULL,
    "permission" "CompanyPermissionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "company_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "boats" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameGujarati" TEXT,
    "registrationNumber" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "boats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "boat_assignments" (
    "id" TEXT NOT NULL,
    "boatId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "boat_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "boat_permissions" (
    "id" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "permission" "BoatPermissionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "boat_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registered_boats" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameGujarati" TEXT,
    "ownerName" TEXT,
    "ownerPhone" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "appBoatId" TEXT,

    CONSTRAINT "registered_boats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "boat_expenses" (
    "id" TEXT NOT NULL,
    "boatId" TEXT NOT NULL,
    "category" "BoatExpenseCategory" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "tripDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "addedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "boat_expenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_expenses" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "category" "CompanyExpenseCategory" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "expenseDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "addedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_expenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "registeredBoatId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "boatId" TEXT,
    "status" "SessionStatus" NOT NULL DEFAULT 'ACTIVE',
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),
    "notes" TEXT,
    "clientId" TEXT,
    "syncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fish_entries" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "fishId" TEXT NOT NULL,
    "fishName" TEXT NOT NULL,
    "fishNameGujarati" TEXT,
    "bucketWeight" DOUBLE PRECISION NOT NULL,
    "totalKg" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fish_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bills" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "billNumber" TEXT NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "sellingCharge" DOUBLE PRECISION NOT NULL,
    "sellingChargeRate" DOUBLE PRECISION NOT NULL DEFAULT 0.06,
    "finalTotal" DOUBLE PRECISION NOT NULL,
    "status" "BillStatus" NOT NULL DEFAULT 'DRAFT',
    "priceFilledById" TEXT,
    "sentViaWhatsApp" BOOLEAN NOT NULL DEFAULT false,
    "whatsappSentAt" TIMESTAMP(3),
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bill_items" (
    "id" TEXT NOT NULL,
    "billId" TEXT NOT NULL,
    "fishEntryId" TEXT NOT NULL,
    "fishName" TEXT NOT NULL,
    "fishNameGujarati" TEXT,
    "totalKg" DOUBLE PRECISION NOT NULL,
    "pricePerKg" DOUBLE PRECISION NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bill_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invitations" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "entityType" "EntityType" NOT NULL,
    "companyId" TEXT,
    "boatId" TEXT,
    "invitedById" TEXT NOT NULL,
    "status" "InvitationStatus" NOT NULL DEFAULT 'PENDING',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "acceptedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "defaultPermissions" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "invitations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "company_memberships_companyId_userId_key" ON "company_memberships"("companyId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "company_permissions_membershipId_permission_key" ON "company_permissions"("membershipId", "permission");

-- CreateIndex
CREATE UNIQUE INDEX "boat_assignments_boatId_userId_key" ON "boat_assignments"("boatId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "boat_permissions_assignmentId_permission_key" ON "boat_permissions"("assignmentId", "permission");

-- CreateIndex
CREATE UNIQUE INDEX "registered_boats_companyId_name_key" ON "registered_boats"("companyId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_clientId_key" ON "sessions"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "bills_sessionId_key" ON "bills"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "bills_billNumber_key" ON "bills"("billNumber");

-- CreateIndex
CREATE UNIQUE INDEX "bill_items_fishEntryId_key" ON "bill_items"("fishEntryId");

-- CreateIndex
CREATE UNIQUE INDEX "invitations_code_key" ON "invitations"("code");

-- AddForeignKey
ALTER TABLE "otps" ADD CONSTRAINT "otps_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_memberships" ADD CONSTRAINT "company_memberships_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_memberships" ADD CONSTRAINT "company_memberships_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_permissions" ADD CONSTRAINT "company_permissions_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "company_memberships"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boats" ADD CONSTRAINT "boats_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boat_assignments" ADD CONSTRAINT "boat_assignments_boatId_fkey" FOREIGN KEY ("boatId") REFERENCES "boats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boat_assignments" ADD CONSTRAINT "boat_assignments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boat_permissions" ADD CONSTRAINT "boat_permissions_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "boat_assignments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registered_boats" ADD CONSTRAINT "registered_boats_appBoatId_fkey" FOREIGN KEY ("appBoatId") REFERENCES "boats"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registered_boats" ADD CONSTRAINT "registered_boats_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boat_expenses" ADD CONSTRAINT "boat_expenses_boatId_fkey" FOREIGN KEY ("boatId") REFERENCES "boats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_expenses" ADD CONSTRAINT "company_expenses_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_registeredBoatId_fkey" FOREIGN KEY ("registeredBoatId") REFERENCES "registered_boats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_boatId_fkey" FOREIGN KEY ("boatId") REFERENCES "boats"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fish_entries" ADD CONSTRAINT "fish_entries_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bills" ADD CONSTRAINT "bills_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bill_items" ADD CONSTRAINT "bill_items_billId_fkey" FOREIGN KEY ("billId") REFERENCES "bills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bill_items" ADD CONSTRAINT "bill_items_fishEntryId_fkey" FOREIGN KEY ("fishEntryId") REFERENCES "fish_entries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
