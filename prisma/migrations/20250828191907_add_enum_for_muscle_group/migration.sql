/*
  Warnings:

  - Changed the type of `category` on the `exercises` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."MuscleGroup" AS ENUM ('Abs', 'Back', 'Chest', 'Shoulders', 'Biceps', 'Triceps', 'Legs', 'Cardio');

-- AlterTable
ALTER TABLE "public"."exercises" DROP COLUMN "category",
ADD COLUMN     "category" "public"."MuscleGroup" NOT NULL;
