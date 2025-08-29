import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/core/services/prisma.service';
import { WorkoutResponseDto } from './dto/workout-response.dto';
import { CreateWorkoutDto } from './dto/create-workout.dto';

@Injectable()
export class WorkoutsService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: number,
    createWorkoutDto: CreateWorkoutDto,
  ): Promise<WorkoutResponseDto> {
    const existingWorkout = await this.prisma.workout.findFirst({
      where: {
        name: createWorkoutDto.name,
        userId: userId,
      },
    });

    if (existingWorkout) {
      throw new ConflictException('Você já possui uma ficha com esse nome');
    }

    const exerciseIds = createWorkoutDto.exercises.map((e) => e.exerciseId);
    const exercises = await this.prisma.exercise.findMany({
      where: {
        id: { in: exerciseIds },
        userId: userId,
      },
    });

    if (exercises.length !== exerciseIds.length) {
      throw new NotFoundException(
        'Um ou mais exercícios não foram encontrados',
      );
    }

    const workout = await this.prisma.$transaction(async (tx) => {
      const newWorkout = await tx.workout.create({
        data: {
          name: createWorkoutDto.name,
          userId: userId,
        },
      });

      await tx.workoutExercise.createMany({
        data: createWorkoutDto.exercises.map((exercise) => ({
          workoutId: newWorkout.id,
          exerciseId: exercise.exerciseId,
          sets: exercise.sets,
          reps: exercise.reps,
          weight: exercise.weight,
          restTime: exercise.restTime,
          notes: exercise.notes,
        })),
      });

      return tx.workout.findUnique({
        where: { id: newWorkout.id },
        include: {
          exercises: {
            include: {
              exercise: true,
            },
            orderBy: { id: 'asc' },
          },
        },
      });
    });

    return new WorkoutResponseDto(workout);
  }

  async findAll(userId: number): Promise<WorkoutResponseDto[]> {
    const workouts = await this.prisma.workout.findMany({
      where: { userId: userId },
      include: {
        exercises: {
          include: {
            exercise: true,
          },
          orderBy: { id: 'asc' },
        },
      },
    });

    return workouts.map((workout) => new WorkoutResponseDto(workout));
  }
}
