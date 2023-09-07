-- AlterTable
ALTER TABLE `TipoAcademico` ADD COLUMN     `prioridad` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `TipoPersonal` ADD COLUMN     `prioridad` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `TipoProfesional` ADD COLUMN     `prioridad` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `users` ADD COLUMN     `termsAccepted` BOOLEAN NOT NULL DEFAULT false;
