/*
  Warnings:

  - You are about to drop the column `tipoId` on the `HitoAcademico` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `HitoAcademico` DROP FOREIGN KEY `HitoAcademico_ibfk_2`;

-- AlterTable
ALTER TABLE `HitoAcademico` DROP COLUMN `tipoId`,
    ADD COLUMN     `tipoAcademicoId` INT;

-- CreateTable
CREATE TABLE `Programa` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `tipoId` INT NOT NULL,
    `approved` INT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Programa` ADD FOREIGN KEY (`tipoId`) REFERENCES `TipoAcademico`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HitoAcademico` ADD FOREIGN KEY (`tipoAcademicoId`) REFERENCES `TipoAcademico`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
