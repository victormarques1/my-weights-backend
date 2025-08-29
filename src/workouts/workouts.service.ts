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
    // Verificar se usuário já tem ficha com esse nome
    const existingWorkout = await this.prisma.workout.findFirst({
      where: {
        name: createWorkoutDto.name,
        userId: userId,
      },
    });

    if (existingWorkout) {
      throw new ConflictException('Você já possui uma ficha com esse nome');
    }

    // Verificar se todos os exercícios existem e pertencem ao usuário
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

    // Criar ficha com exercícios usando transação
    const workout = await this.prisma.$transaction(async (tx) => {
      // Criar a ficha
      const newWorkout = await tx.workout.create({
        data: {
          name: createWorkoutDto.name,
          userId: userId,
        },
      });

      // Criar os exercícios da ficha
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

      // Buscar ficha completa com exercícios
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
}
