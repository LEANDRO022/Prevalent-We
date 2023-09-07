-- CreateTable
CREATE TABLE `Institucion` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `web_pages` VARCHAR(191) NOT NULL,
    `domains` VARCHAR(191) NOT NULL,
    `alpha_two_code` VARCHAR(191) NOT NULL,
    `countryId` INT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Institucion` ADD FOREIGN KEY (`countryId`) REFERENCES `Pais`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
