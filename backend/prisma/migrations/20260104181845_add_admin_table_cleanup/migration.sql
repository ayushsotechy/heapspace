/*
  Warnings:

  - You are about to drop the column `isAdmin` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Problem" ADD COLUMN     "adminId" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isAdmin";

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- AddForeignKey
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
