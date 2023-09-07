-- CreateTable
CREATE TABLE `accounts` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `compound_id` VARCHAR(191) NOT NULL,
    `user_id` INT NOT NULL,
    `provider_type` VARCHAR(191) NOT NULL,
    `provider_id` VARCHAR(191) NOT NULL,
    `provider_account_id` VARCHAR(191) NOT NULL,
    `refresh_token` VARCHAR(191),
    `access_token` VARCHAR(191),
    `access_token_expires` DATETIME(3),
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
UNIQUE INDEX `accounts.compound_id_unique`(`compound_id`),
INDEX `providerAccountId`(`provider_account_id`),
INDEX `providerId`(`provider_id`),
INDEX `userId`(`user_id`),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sessions` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `user_id` INT NOT NULL,
    `expires` DATETIME(3) NOT NULL,
    `session_token` VARCHAR(191) NOT NULL,
    `access_token` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
UNIQUE INDEX `sessions.session_token_unique`(`session_token`),
UNIQUE INDEX `sessions.access_token_unique`(`access_token`),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `verification_requests` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `identifier` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
UNIQUE INDEX `verification_requests.token_unique`(`token`),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191),
    `email` VARCHAR(191),
    `email_verified` DATETIME(3),
    `image` VARCHAR(191),
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
UNIQUE INDEX `users.email_unique`(`email`),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CV` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` INT NOT NULL,
UNIQUE INDEX `CV_userId_unique`(`userId`),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HitoAcademico` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `cvId` INT NOT NULL,
    `tipoId` INT NOT NULL,
    `titulo` VARCHAR(191) NOT NULL,
    `fechaInicio` DATETIME(3) NOT NULL,
    `fechaFin` DATETIME(3),
    `pais` VARCHAR(191) NOT NULL,
    `institucion` VARCHAR(191) NOT NULL,
    `programa` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TipoAcademico` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HitoProfesional` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `cvId` INT NOT NULL,
    `empresa` VARCHAR(191) NOT NULL,
    `cargo` VARCHAR(191) NOT NULL,
    `tipoId` INT NOT NULL,
    `funciones` VARCHAR(191) NOT NULL,
    `logros` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191),
    `fechaInicio` DATETIME(3) NOT NULL,
    `fechaFin` DATETIME(3),
    `pais` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TipoProfesional` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HitoPersonal` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `cvId` INT NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `tipoId` INT NOT NULL,
    `fecha` DATETIME(3) NOT NULL,
    `pais` VARCHAR(191) NOT NULL,
    `departamento` VARCHAR(191) NOT NULL,
    `ciudad` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TipoPersonal` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CV` ADD FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HitoAcademico` ADD FOREIGN KEY (`cvId`) REFERENCES `CV`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HitoAcademico` ADD FOREIGN KEY (`tipoId`) REFERENCES `TipoAcademico`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HitoProfesional` ADD FOREIGN KEY (`cvId`) REFERENCES `CV`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HitoProfesional` ADD FOREIGN KEY (`tipoId`) REFERENCES `TipoProfesional`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HitoPersonal` ADD FOREIGN KEY (`cvId`) REFERENCES `CV`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HitoPersonal` ADD FOREIGN KEY (`tipoId`) REFERENCES `TipoPersonal`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
