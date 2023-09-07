/*
  Warnings:

  - You are about to drop the column `userId` on the `Empresa` table. All the data in the column will be lost.
  - Added the required column `approverId` to the `Empresa` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Empresa` DROP FOREIGN KEY `Empresa_ibfk_1`;

-- AlterTable
ALTER TABLE `Empresa` DROP COLUMN `userId`,
    ADD COLUMN     `approverId` INT NOT NULL;

-- AddForeignKey
ALTER TABLE `Empresa` ADD FOREIGN KEY (`approverId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
