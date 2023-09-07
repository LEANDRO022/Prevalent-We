-- DropForeignKey
ALTER TABLE `DatosEmpresa` DROP FOREIGN KEY `DatosEmpresa_ibfk_1`;

-- AlterTable
ALTER TABLE `Empresa` ADD COLUMN     `datosId` VARCHAR(191),
    MODIFY `approvedDate` DATETIME(3);

-- AddForeignKey
ALTER TABLE `Empresa` ADD FOREIGN KEY (`datosId`) REFERENCES `DatosEmpresa`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
