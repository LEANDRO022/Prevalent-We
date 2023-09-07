-- CreateTable
CREATE TABLE `MovimientoEmpresa` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `empresaId` VARCHAR(191) NOT NULL,
    `fechaIngreso` DATETIME(3) NOT NULL,
    `fechaRetiro` DATETIME(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MovimientoEmpresa` ADD FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MovimientoEmpresa` ADD FOREIGN KEY (`empresaId`) REFERENCES `Empresa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
