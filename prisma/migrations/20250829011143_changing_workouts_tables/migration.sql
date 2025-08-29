/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `workout_exercises` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "public"."workout_exercises" DROP COLUMN "description",
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "restTime" INTEGER;

-- CreateTable
CREATE TABLE "public"."workout_sessions" (
    "id" SERIAL NOT NULL,
    "workoutId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "totalTime" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workout_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."workout_session_exercises" (
    "id" SERIAL NOT NULL,
    "workoutSessionId" INTEGER NOT NULL,
    "exerciseId" INTEGER NOT NULL,
    "workoutExerciseId" INTEGER NOT NULL,
    "setNumber" INTEGER NOT NULL,
    "reps" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "restTime" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workout_session_exercises_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."workout_sessions" ADD CONSTRAINT "workout_sessions_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "public"."workouts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."workout_sessions" ADD CONSTRAINT "workout_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."workout_session_exercises" ADD CONSTRAINT "workout_session_exercises_workoutSessionId_fkey" FOREIGN KEY ("workoutSessionId") REFERENCES "public"."workout_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."workout_session_exercises" ADD CONSTRAINT "workout_session_exercises_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "public"."exercises"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
