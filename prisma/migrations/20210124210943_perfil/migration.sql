-- CreateTable
CREATE TABLE `Perfil` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `userId` INT NOT NULL,
    `gender` VARCHAR(191) NOT NULL,
    `typeDocument` VARCHAR(191) NOT NULL,
    `document` VARCHAR(191) NOT NULL,
    `image` VARCHAR(1000),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Perfil` ADD FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
