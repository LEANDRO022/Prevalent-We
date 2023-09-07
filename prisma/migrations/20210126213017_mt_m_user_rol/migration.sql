-- AlterTable
ALTER TABLE `Roles` ADD COLUMN     `userId` INT;

-- CreateTable
CREATE TABLE `_RolesToUser` (
    `A` INT NOT NULL,
    `B` INT NOT NULL,
UNIQUE INDEX `_RolesToUser_AB_unique`(`A`, `B`),
INDEX `_RolesToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_RolesToUser` ADD FOREIGN KEY (`A`) REFERENCES `Roles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RolesToUser` ADD FOREIGN KEY (`B`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
