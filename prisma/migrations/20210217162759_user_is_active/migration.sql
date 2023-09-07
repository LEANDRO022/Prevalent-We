/*
  Warnings:

  - Added the required column `isActive` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN     `isActive` BOOLEAN NOT NULL;
