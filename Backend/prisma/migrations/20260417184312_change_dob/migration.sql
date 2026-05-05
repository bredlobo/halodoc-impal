/*
  Warnings:

  - Made the column `dob` on table `PatientProfile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "PatientProfile" ALTER COLUMN "dob" SET NOT NULL;
