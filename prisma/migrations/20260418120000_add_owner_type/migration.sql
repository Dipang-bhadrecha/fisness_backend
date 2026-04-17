-- CreateEnum
CREATE TYPE "OwnerType" AS ENUM ('BOAT', 'COMPANY', 'BOTH');

-- AlterTable
ALTER TABLE "users" ADD COLUMN "ownerType" "OwnerType";
