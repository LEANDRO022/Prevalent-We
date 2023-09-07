/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[ciudadOtrasId]` on the table `Ciudad`. If there are existing duplicate values, the migration will fail.
  - The migration will add a unique constraint covering the columns `[otrosDepartamentosId]` on the table `Departamento`. If there are existing duplicate values, the migration will fail.
  - The migration will add a unique constraint covering the columns `[otraInstitucionId]` on the table `Institucion`. If there are existing duplicate values, the migration will fail.
  - The migration will add a unique constraint covering the columns `[otroProgramaId]` on the table `Programa`. If there are existing duplicate values, the migration will fail.

*/
-- AlterTable
ALTER TABLE `Ciudad` ADD COLUMN     `ciudadOtrasId` INTEGER;

-- AlterTable
ALTER TABLE `Departamento` ADD COLUMN     `otrosDepartamentosId` INTEGER;

-- AlterTable
ALTER TABLE `Institucion` ADD COLUMN     `otraInstitucionId` INTEGER;

-- AlterTable
ALTER TABLE `Programa` ADD COLUMN     `otroProgramaId` INTEGER;

-- CreateTable
CREATE TABLE `OtroPrograma` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OtraInstitucion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OtrosDepartamentos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OtrasCiudades` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Ciudad_ciudadOtrasId_unique` ON `Ciudad`(`ciudadOtrasId`);

-- CreateIndex
CREATE UNIQUE INDEX `Departamento_otrosDepartamentosId_unique` ON `Departamento`(`otrosDepartamentosId`);

-- CreateIndex
CREATE UNIQUE INDEX `Institucion_otraInstitucionId_unique` ON `Institucion`(`otraInstitucionId`);

-- CreateIndex
CREATE UNIQUE INDEX `Programa_otroProgramaId_unique` ON `Programa`(`otroProgramaId`);

-- AddForeignKey
ALTER TABLE `Ciudad` ADD FOREIGN KEY (`ciudadOtrasId`) REFERENCES `OtrasCiudades`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Departamento` ADD FOREIGN KEY (`otrosDepartamentosId`) REFERENCES `OtrosDepartamentos`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Institucion` ADD FOREIGN KEY (`otraInstitucionId`) REFERENCES `OtraInstitucion`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Programa` ADD FOREIGN KEY (`otroProgramaId`) REFERENCES `OtroPrograma`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
