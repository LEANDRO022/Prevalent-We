/*
  Warnings:

  - You are about to alter the column `status` on the `Empresa` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `TinyInt`.

*/
-- DropIndex
DROP INDEX `DatosEmpresa_empresaId_unique` ON `DatosEmpresa`;

-- AlterTable
ALTER TABLE `Empresa` MODIFY `status` BOOLEAN NOT NULL;
