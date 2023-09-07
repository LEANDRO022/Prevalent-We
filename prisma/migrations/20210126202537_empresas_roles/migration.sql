/*
  Warnings:

  - Added the required column `descripcion` to the `HitoPersonal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `HitoPersonal` ADD COLUMN     `descripcion` VARCHAR(500) NOT NULL;

-- CreateTable
CREATE TABLE `Empresa` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `legalName` VARCHAR(191) NOT NULL,
    `idType` VARCHAR(191) NOT NULL,
    `idNumber` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `userId` INT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `approvedDate` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Roles` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Empresa` ADD FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
