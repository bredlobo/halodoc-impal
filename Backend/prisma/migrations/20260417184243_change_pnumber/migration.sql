/*
  Warnings:

  - A unique constraint covering the columns `[telephoneNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Made the column `telephoneNumber` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "telephoneNumber" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_telephoneNumber_key" ON "User"("telephoneNumber");
