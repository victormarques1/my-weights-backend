import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/core/services/prisma.service';
import { ExerciseResponseDto } from './dto/exercise-response.dto';
import { CreateUserExerciseDto } from './dto/create-user-exercise.dto';

@Injectable()
export class ExercisesService {
  constructor(private prisma: PrismaService) {}

  async createUserExercise(
    userId: number,
    createUserExerciseDto: CreateUserExerciseDto,
  ): Promise<ExerciseResponseDto> {
    const existingExercise = await this.prisma.exercise.findFirst({
      where: {
        name: createUserExerciseDto.name,
        userId: userId,
      },
    });

    if (existingExercise) {
      throw new ConflictException('Você já possui um exercício com esse nome');
    }

    return this.prisma.exercise.create({
      data: {
        ...createUserExerciseDto,
        userId: userId,
      },
    });
  }

  async findUserExercises(userId: number) {
    return this.prisma.exercise.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
