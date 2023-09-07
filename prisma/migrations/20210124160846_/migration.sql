/*
  Warnings:

  - You are about to drop the column `institucion` on the `HitoAcademico` table. All the data in the column will be lost.
  - You are about to drop the column `departamento` on the `HitoPersonal` table. All the data in the column will be lost.
  - You are about to drop the column `ciudad` on the `HitoPersonal` table. All the data in the column will be lost.
  - You are about to drop the column `paisId` on the `HitoPersonal` table. All the data in the column will be lost.
  - Added the required column `institucionId` to the `HitoAcademico` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ciudadId` to the `HitoPersonal` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `HitoPersonal` DROP FOREIGN KEY `HitoPersonal_ibfk_3`;

-- AlterTable
ALTER TABLE `HitoAcademico` DROP COLUMN `institucion`,
    ADD COLUMN     `institucionId` INT NOT NULL;

-- AlterTable
ALTER TABLE `HitoPersonal` DROP COLUMN `departamento`,
    DROP COLUMN `ciudad`,
    DROP COLUMN `paisId`,
    ADD COLUMN     `ciudadId` INT NOT NULL;

-- CreateTable
CREATE TABLE `Departamento` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `paisId` INT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ciudad` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `departamentoId` INT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Departamento` ADD FOREIGN KEY (`paisId`) REFERENCES `Pais`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ciudad` ADD FOREIGN KEY (`departamentoId`) REFERENCES `Departamento`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HitoAcademico` ADD FOREIGN KEY (`institucionId`) REFERENCES `Institucion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HitoPersonal` ADD FOREIGN KEY (`ciudadId`) REFERENCES `Ciudad`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
