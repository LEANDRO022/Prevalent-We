/*
  Warnings:

  - Added the required column `adminId` to the `Empresa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Empresa` ADD COLUMN     `adminId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN     `empresaId` VARCHAR(191);

-- CreateTable
CREATE TABLE `DatosEmpresa` (
    `id` VARCHAR(191) NOT NULL,
    `empresaId` VARCHAR(191) NOT NULL,
    `logo` VARCHAR(191) NOT NULL,
    `rut` VARCHAR(191) NOT NULL,
    `camara` VARCHAR(191) NOT NULL,
    `tamano` VARCHAR(191) NOT NULL,
UNIQUE INDEX `DatosEmpresa_empresaId_unique`(`empresaId`),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DatosEmpresa` ADD FOREIGN KEY (`empresaId`) REFERENCES `Empresa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Empresa` ADD FOREIGN KEY (`adminId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD FOREIGN KEY (`empresaId`) REFERENCES `Empresa`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
