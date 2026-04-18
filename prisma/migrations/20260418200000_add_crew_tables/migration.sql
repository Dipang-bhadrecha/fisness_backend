-- CreateEnum
CREATE TYPE "CrewStatus" AS ENUM ('active', 'left');

-- CreateTable
CREATE TABLE "crew_members" (
    "id"            TEXT NOT NULL,
    "boatId"        TEXT NOT NULL,
    "name"          TEXT NOT NULL,
    "role"          TEXT NOT NULL,
    "phone"         TEXT,
    "aadhaarNumber" TEXT,
    "joiningDate"   TIMESTAMP(3),
    "monthlyPagar"  DOUBLE PRECISION,
    "seasonAdvance" DOUBLE PRECISION,
    "status"        "CrewStatus" NOT NULL DEFAULT 'active',
    "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"     TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crew_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crew_advances" (
    "id"           TEXT NOT NULL,
    "crewMemberId" TEXT NOT NULL,
    "amount"       DOUBLE PRECISION NOT NULL,
    "reason"       TEXT,
    "givenBy"      TEXT,
    "date"         TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "crew_advances_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "crew_members" ADD CONSTRAINT "crew_members_boatId_fkey"
    FOREIGN KEY ("boatId") REFERENCES "boats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crew_advances" ADD CONSTRAINT "crew_advances_crewMemberId_fkey"
    FOREIGN KEY ("crewMemberId") REFERENCES "crew_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;
