/*
  Warnings:

  - You are about to drop the column `pais` on the `HitoProfesional` table. All the data in the column will be lost.
  - Added the required column `paisId` to the `HitoProfesional` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `HitoProfesional` DROP COLUMN `pais`,
    ADD COLUMN     `paisId` INT NOT NULL;

-- AddForeignKey
ALTER TABLE `HitoProfesional` ADD FOREIGN KEY (`paisId`) REFERENCES `Pais`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
