/*
  Warnings:

  - You are about to drop the column `status` on the `Empresa` table. All the data in the column will be lost.
  - Added the required column `approved` to the `Empresa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Empresa` DROP COLUMN `status`,
    ADD COLUMN     `approved` BOOLEAN NOT NULL;
