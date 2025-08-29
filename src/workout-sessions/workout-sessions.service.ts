// src/workout-sessions/workout-sessions.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../core/services/prisma.service';
import { CreateWorkoutSessionDto } from './dto/create-workout-session.dto';
import { CreateWorkoutSessionExerciseDto } from './dto/workout-session-exercise.dto';
import { WorkoutSessionResponseDto } from './dto/workout-session-response.dto';
import { FinishWorkoutSessionDto } from './dto/finish-workout-session.dto';

@Injectable()
export class WorkoutSessionsService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: number,
    createSessionDto: CreateWorkoutSessionDto,
  ): Promise<WorkoutSessionResponseDto> {
    const workout = await this.prisma.workout.findFirst({
      where: {
        id: createSessionDto.workoutId,
        userId: userId,
      },
      include: {
        exercises: {
          include: {
            exercise: true,
          },
        },
      },
    });

    if (!workout) {
      throw new NotFoundException('Ficha de treino não encontrada');
    }

    const activeSession = await this.prisma.workoutSession.findFirst({
      where: {
        userId: userId,
        endTime: null, // Sessão ainda não finalizada
      },
    });

    if (activeSession) {
      throw new ConflictException(
        'Você já possui um treino em andamento. Finalize antes de iniciar outro.',
      );
    }

    const session = await this.prisma.workoutSession.create({
      data: {
        workoutId: createSessionDto.workoutId,
        userId: userId,
        startTime: new Date(),
        notes: createSessionDto.notes,
      },
      include: {
        workout: true,
        exercises: {
          include: {
            exercise: true,
          },
        },
      },
    });

    return new WorkoutSessionResponseDto(session);
  }

  async findUserSessions(userId: number): Promise<WorkoutSessionResponseDto[]> {
    const sessions = await this.prisma.workoutSession.findMany({
      where: { userId },
      include: {
        workout: true,
        exercises: {
          include: {
            exercise: true,
          },
          orderBy: [{ exerciseId: 'asc' }, { setNumber: 'asc' }],
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return sessions.map((session) => new WorkoutSessionResponseDto(session));
  }

  async findOne(
    userId: number,
    sessionId: number,
  ): Promise<WorkoutSessionResponseDto> {
    const session = await this.prisma.workoutSession.findFirst({
      where: {
        id: sessionId,
        userId: userId,
      },
      include: {
        workout: true,
        exercises: {
          include: {
            exercise: true,
          },
          orderBy: [{ exerciseId: 'asc' }, { setNumber: 'asc' }],
        },
      },
    });

    if (!session) {
      throw new NotFoundException('Sessão de treino não encontrada');
    }

    return new WorkoutSessionResponseDto(session);
  }

  async getActiveSession(
    userId: number,
  ): Promise<WorkoutSessionResponseDto | null> {
    const session = await this.prisma.workoutSession.findFirst({
      where: {
        userId: userId,
        endTime: null,
      },
      include: {
        workout: true,
        exercises: {
          include: {
            exercise: true,
          },
          orderBy: [{ exerciseId: 'asc' }, { setNumber: 'asc' }],
        },
      },
    });

    return session ? new WorkoutSessionResponseDto(session) : null;
  }

  async addExerciseSet(
    userId: number,
    sessionId: number,
    exerciseDto: CreateWorkoutSessionExerciseDto,
  ): Promise<WorkoutSessionResponseDto> {
    const session = await this.prisma.workoutSession.findFirst({
      where: {
        id: sessionId,
        userId: userId,
        endTime: null, // Sessão ainda ativa
      },
    });

    if (!session) {
      throw new NotFoundException(
        'Sessão de treino não encontrada ou já finalizada',
      );
    }

    const exercise = await this.prisma.exercise.findFirst({
      where: {
        id: exerciseDto.exerciseId,
        userId: userId,
      },
    });

    if (!exercise) {
      throw new NotFoundException('Exercício não encontrado');
    }

    await this.prisma.workoutSessionExercise.create({
      data: {
        workoutSessionId: sessionId,
        exerciseId: exerciseDto.exerciseId,
        workoutExerciseId: exerciseDto.workoutExerciseId,
        setNumber: exerciseDto.setNumber,
        reps: exerciseDto.reps,
        weight: exerciseDto.weight,
        restTime: exerciseDto.restTime,
        notes: exerciseDto.notes,
      },
    });

    return this.findOne(userId, sessionId);
  }

  async finishSession(
    userId: number,
    sessionId: number,
    finishDto: FinishWorkoutSessionDto,
  ): Promise<WorkoutSessionResponseDto> {
    const session = await this.prisma.workoutSession.findFirst({
      where: {
        id: sessionId,
        userId: userId,
        endTime: null, // Ainda não finalizada
      },
    });

    if (!session) {
      throw new NotFoundException(
        'Sessão de treino não encontrada ou já finalizada',
      );
    }

    const endTime = new Date();
    const totalTime = Math.floor(
      (endTime.getTime() - session.startTime.getTime()) / 1000,
    ); // Em segundos

    const updatedSession = await this.prisma.workoutSession.update({
      where: { id: sessionId },
      data: {
        endTime: endTime,
        totalTime: totalTime,
        notes: finishDto.notes || session.notes,
      },
      include: {
        workout: true,
        exercises: {
          include: {
            exercise: true,
          },
          orderBy: [{ exerciseId: 'asc' }, { setNumber: 'asc' }],
        },
      },
    });

    return new WorkoutSessionResponseDto(updatedSession);
  }
}
