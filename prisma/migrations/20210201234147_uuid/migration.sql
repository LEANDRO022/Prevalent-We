/*
  Warnings:

  - The migration will change the primary key for the `CV` table. If it partially fails, the table could be left without primary key constraint.
  - The migration will change the primary key for the `Ciudad` table. If it partially fails, the table could be left without primary key constraint.
  - The migration will change the primary key for the `Departamento` table. If it partially fails, the table could be left without primary key constraint.
  - The migration will change the primary key for the `Empresa` table. If it partially fails, the table could be left without primary key constraint.
  - The migration will change the primary key for the `HitoAcademico` table. If it partially fails, the table could be left without primary key constraint.
  - The migration will change the primary key for the `HitoPersonal` table. If it partially fails, the table could be left without primary key constraint.
  - The migration will change the primary key for the `HitoProfesional` table. If it partially fails, the table could be left without primary key constraint.
  - The migration will change the primary key for the `Institucion` table. If it partially fails, the table could be left without primary key constraint.
  - The migration will change the primary key for the `Pais` table. If it partially fails, the table could be left without primary key constraint.
  - The migration will change the primary key for the `Perfil` table. If it partially fails, the table could be left without primary key constraint.
  - The migration will change the primary key for the `Programa` table. If it partially fails, the table could be left without primary key constraint.
  - The migration will change the primary key for the `Roles` table. If it partially fails, the table could be left without primary key constraint.
  - The migration will change the primary key for the `TipoAcademico` table. If it partially fails, the table could be left without primary key constraint.
  - The migration will change the primary key for the `TipoPersonal` table. If it partially fails, the table could be left without primary key constraint.
  - The migration will change the primary key for the `TipoProfesional` table. If it partially fails, the table could be left without primary key constraint.
  - The migration will change the primary key for the `accounts` table. If it partially fails, the table could be left without primary key constraint.
  - The migration will change the primary key for the `sessions` table. If it partially fails, the table could be left without primary key constraint.
  - The migration will change the primary key for the `users` table. If it partially fails, the table could be left without primary key constraint.
  - The migration will change the primary key for the `verification_requests` table. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `CV` DROP FOREIGN KEY `CV_ibfk_1`;

-- DropForeignKey
ALTER TABLE `Ciudad` DROP FOREIGN KEY `Ciudad_ibfk_1`;

-- DropForeignKey
ALTER TABLE `Departamento` DROP FOREIGN KEY `Departamento_ibfk_1`;

-- DropForeignKey
ALTER TABLE `Empresa` DROP FOREIGN KEY `Empresa_ibfk_1`;

-- DropForeignKey
ALTER TABLE `HitoAcademico` DROP FOREIGN KEY `HitoAcademico_ibfk_1`;

-- DropForeignKey
ALTER TABLE `HitoAcademico` DROP FOREIGN KEY `HitoAcademico_ibfk_4`;

-- DropForeignKey
ALTER TABLE `HitoAcademico` DROP FOREIGN KEY `HitoAcademico_ibfk_3`;

-- DropForeignKey
ALTER TABLE `HitoPersonal` DROP FOREIGN KEY `HitoPersonal_ibfk_3`;

-- DropForeignKey
ALTER TABLE `HitoPersonal` DROP FOREIGN KEY `HitoPersonal_ibfk_1`;

-- DropForeignKey
ALTER TABLE `HitoPersonal` DROP FOREIGN KEY `HitoPersonal_ibfk_2`;

-- DropForeignKey
ALTER TABLE `HitoProfesional` DROP FOREIGN KEY `HitoProfesional_ibfk_1`;

-- DropForeignKey
ALTER TABLE `HitoProfesional` DROP FOREIGN KEY `HitoProfesional_ibfk_3`;

-- DropForeignKey
ALTER TABLE `HitoProfesional` DROP FOREIGN KEY `HitoProfesional_ibfk_2`;

-- DropForeignKey
ALTER TABLE `Institucion` DROP FOREIGN KEY `Institucion_ibfk_1`;

-- DropForeignKey
ALTER TABLE `Perfil` DROP FOREIGN KEY `Perfil_ibfk_1`;

-- DropForeignKey
ALTER TABLE `Programa` DROP FOREIGN KEY `Programa_ibfk_1`;

-- DropForeignKey
ALTER TABLE `_RolesToUser` DROP FOREIGN KEY `_RolesToUser_ibfk_1`;

-- DropForeignKey
ALTER TABLE `_RolesToUser` DROP FOREIGN KEY `_RolesToUser_ibfk_2`;

-- AlterTable
ALTER TABLE `CV` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `userId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Ciudad` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `departamentoId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Departamento` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `paisId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Empresa` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `approverId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `HitoAcademico` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `cvId` VARCHAR(191) NOT NULL,
    MODIFY `programaId` VARCHAR(191),
    MODIFY `institucionId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `HitoPersonal` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `cvId` VARCHAR(191) NOT NULL,
    MODIFY `tipoId` VARCHAR(191) NOT NULL,
    MODIFY `ciudadId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `HitoProfesional` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `cvId` VARCHAR(191) NOT NULL,
    MODIFY `tipoId` VARCHAR(191) NOT NULL,
    MODIFY `paisId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Institucion` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `countryId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Pais` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Perfil` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `userId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Programa` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `tipoId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Roles` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `TipoAcademico` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `TipoPersonal` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `TipoProfesional` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `_RolesToUser` MODIFY `A` VARCHAR(191) NOT NULL,
    MODIFY `B` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `accounts` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `user_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `sessions` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `user_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `users` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `verification_requests` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `CV` ADD FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ciudad` ADD FOREIGN KEY (`departamentoId`) REFERENCES `Departamento`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Departamento` ADD FOREIGN KEY (`paisId`) REFERENCES `Pais`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Empresa` ADD FOREIGN KEY (`approverId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HitoAcademico` ADD FOREIGN KEY (`cvId`) REFERENCES `CV`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HitoAcademico` ADD FOREIGN KEY (`institucionId`) REFERENCES `Institucion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HitoAcademico` ADD FOREIGN KEY (`programaId`) REFERENCES `Programa`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HitoPersonal` ADD FOREIGN KEY (`cvId`) REFERENCES `CV`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HitoPersonal` ADD FOREIGN KEY (`tipoId`) REFERENCES `TipoPersonal`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HitoPersonal` ADD FOREIGN KEY (`ciudadId`) REFERENCES `Ciudad`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HitoProfesional` ADD FOREIGN KEY (`cvId`) REFERENCES `CV`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HitoProfesional` ADD FOREIGN KEY (`tipoId`) REFERENCES `TipoProfesional`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HitoProfesional` ADD FOREIGN KEY (`paisId`) REFERENCES `Pais`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Institucion` ADD FOREIGN KEY (`countryId`) REFERENCES `Pais`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Perfil` ADD FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Programa` ADD FOREIGN KEY (`tipoId`) REFERENCES `TipoAcademico`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RolesToUser` ADD FOREIGN KEY (`A`) REFERENCES `Roles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RolesToUser` ADD FOREIGN KEY (`B`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
