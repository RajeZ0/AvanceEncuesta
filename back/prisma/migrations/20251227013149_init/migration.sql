-- AlterTable
ALTER TABLE "User" ADD COLUMN "resetToken" TEXT;
ALTER TABLE "User" ADD COLUMN "resetTokenExpiry" DATETIME;
ALTER TABLE "User" ADD COLUMN "sessionToken" TEXT;
