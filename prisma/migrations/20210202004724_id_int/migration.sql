/*
  Warnings:

  - The migration will change the primary key for the `Ciudad` table. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Ciudad` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `nombre` on the `Ciudad` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `departamentoId` on the `Ciudad` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The migration will change the primary key for the `Departamento` table. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Departamento` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `paisId` on the `Departamento` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `programaId` on the `HitoAcademico` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `institucionId` on the `HitoAcademico` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `tipoId` on the `HitoPersonal` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `ciudadId` on the `HitoPersonal` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `tipoId` on the `HitoProfesional` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `paisId` on the `HitoProfesional` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The migration will change the primary key for the `Institucion` table. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Institucion` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `countryId` on the `Institucion` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The migration will change the primary key for the `Pais` table. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Pais` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The migration will change the primary key for the `Programa` table. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Programa` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `tipoId` on the `Programa` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The migration will change the primary key for the `TipoAcademico` table. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `TipoAcademico` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The migration will change the primary key for the `TipoPersonal` table. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `TipoPersonal` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The migration will change the primary key for the `TipoProfesional` table. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `TipoProfesional` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- DropForeignKey
ALTER TABLE `Ciudad` DROP FOREIGN KEY `Ciudad_ibfk_1`;

-- DropForeignKey
ALTER TABLE `Departamento` DROP FOREIGN KEY `Departamento_ibfk_1`;

-- DropForeignKey
ALTER TABLE `HitoAcademico` DROP FOREIGN KEY `HitoAcademico_ibfk_2`;

-- DropForeignKey
ALTER TABLE `HitoAcademico` DROP FOREIGN KEY `HitoAcademico_ibfk_3`;

-- DropForeignKey
ALTER TABLE `HitoPersonal` DROP FOREIGN KEY `HitoPersonal_ibfk_3`;

-- DropForeignKey
ALTER TABLE `HitoPersonal` DROP FOREIGN KEY `HitoPersonal_ibfk_2`;

-- DropForeignKey
ALTER TABLE `HitoProfesional` DROP FOREIGN KEY `HitoProfesional_ibfk_3`;

-- DropForeignKey
ALTER TABLE `HitoProfesional` DROP FOREIGN KEY `HitoProfesional_ibfk_2`;

-- DropForeignKey
ALTER TABLE `Institucion` DROP FOREIGN KEY `Institucion_ibfk_1`;

-- DropForeignKey
ALTER TABLE `Programa` DROP FOREIGN KEY `Programa_ibfk_1`;

-- AlterTable
ALTER TABLE `Ciudad` DROP PRIMARY KEY,
    MODIFY `id` INT NOT NULL AUTO_INCREMENT,
    MODIFY `nombre` INT NOT NULL,
    MODIFY `departamentoId` INT NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Departamento` DROP PRIMARY KEY,
    MODIFY `id` INT NOT NULL AUTO_INCREMENT,
    MODIFY `paisId` INT NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `HitoAcademico` MODIFY `programaId` INT,
    MODIFY `institucionId` INT NOT NULL;

-- AlterTable
ALTER TABLE `HitoPersonal` MODIFY `tipoId` INT NOT NULL,
    MODIFY `ciudadId` INT NOT NULL;

-- AlterTable
ALTER TABLE `HitoProfesional` MODIFY `tipoId` INT NOT NULL,
    MODIFY `paisId` INT NOT NULL;

-- AlterTable
ALTER TABLE `Institucion` DROP PRIMARY KEY,
    MODIFY `id` INT NOT NULL AUTO_INCREMENT,
    MODIFY `countryId` INT NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Pais` DROP PRIMARY KEY,
    MODIFY `id` INT NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Programa` DROP PRIMARY KEY,
    MODIFY `id` INT NOT NULL AUTO_INCREMENT,
    MODIFY `tipoId` INT NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `TipoAcademico` DROP PRIMARY KEY,
    MODIFY `id` INT NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `TipoPersonal` DROP PRIMARY KEY,
    MODIFY `id` INT NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `TipoProfesional` DROP PRIMARY KEY,
    MODIFY `id` INT NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `Ciudad` ADD FOREIGN KEY (`departamentoId`) REFERENCES `Departamento`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Departamento` ADD FOREIGN KEY (`paisId`) REFERENCES `Pais`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HitoAcademico` ADD FOREIGN KEY (`institucionId`) REFERENCES `Institucion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HitoAcademico` ADD FOREIGN KEY (`programaId`) REFERENCES `Programa`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HitoPersonal` ADD FOREIGN KEY (`tipoId`) REFERENCES `TipoPersonal`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HitoPersonal` ADD FOREIGN KEY (`ciudadId`) REFERENCES `Ciudad`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HitoProfesional` ADD FOREIGN KEY (`tipoId`) REFERENCES `TipoProfesional`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HitoProfesional` ADD FOREIGN KEY (`paisId`) REFERENCES `Pais`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Institucion` ADD FOREIGN KEY (`countryId`) REFERENCES `Pais`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Programa` ADD FOREIGN KEY (`tipoId`) REFERENCES `TipoAcademico`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
