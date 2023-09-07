/*
  Warnings:

  - You are about to drop the column `pais` on the `HitoAcademico` table. All the data in the column will be lost.
  - You are about to drop the column `programa` on the `HitoAcademico` table. All the data in the column will be lost.
  - You are about to drop the column `tipoAcademicoId` on the `HitoAcademico` table. All the data in the column will be lost.
  - You are about to drop the column `pais` on the `HitoPersonal` table. All the data in the column will be lost.
  - Added the required column `paisId` to the `HitoAcademico` table without a default value. This is not possible if the table is not empty.
  - Added the required column `programaId` to the `HitoAcademico` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paisId` to the `HitoPersonal` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `HitoAcademico` DROP FOREIGN KEY `HitoAcademico_ibfk_2`;

-- AlterTable
ALTER TABLE `HitoAcademico` DROP COLUMN `pais`,
    DROP COLUMN `programa`,
    DROP COLUMN `tipoAcademicoId`,
    ADD COLUMN     `paisId` INT NOT NULL,
    ADD COLUMN     `programaId` INT NOT NULL;

-- AlterTable
ALTER TABLE `HitoPersonal` DROP COLUMN `pais`,
    ADD COLUMN     `paisId` INT NOT NULL;

-- AddForeignKey
ALTER TABLE `HitoAcademico` ADD FOREIGN KEY (`paisId`) REFERENCES `Pais`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HitoAcademico` ADD FOREIGN KEY (`programaId`) REFERENCES `Programa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HitoPersonal` ADD FOREIGN KEY (`paisId`) REFERENCES `Pais`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
