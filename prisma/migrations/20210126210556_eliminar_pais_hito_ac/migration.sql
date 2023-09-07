/*
  Warnings:

  - You are about to drop the column `paisId` on the `HitoAcademico` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `HitoAcademico` DROP FOREIGN KEY `HitoAcademico_ibfk_2`;

-- AlterTable
ALTER TABLE `HitoAcademico` DROP COLUMN `paisId`;
