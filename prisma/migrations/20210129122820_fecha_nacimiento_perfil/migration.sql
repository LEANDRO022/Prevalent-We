/*
  Warnings:

  - Added the required column `fechaNacimiento` to the `Perfil` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Perfil` ADD COLUMN     `fechaNacimiento` DATETIME(3) NOT NULL;
