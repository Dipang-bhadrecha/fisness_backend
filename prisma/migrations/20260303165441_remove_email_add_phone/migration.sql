/*
  Warnings:

  - You are about to drop the column `email` on the `otps` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `users` table. All the data in the column will be lost.
  - Added the required column `phone` to the `otps` table without a default value. This is not possible if the table is not empty.
  - Made the column `phone` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "users_email_key";

-- AlterTable
ALTER TABLE "otps" DROP COLUMN "email",
ADD COLUMN     "phone" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "email",
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "phone" SET NOT NULL;
