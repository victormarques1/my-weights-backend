import { Module } from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { ExercisesController } from './exercises.controller';
import { PrismaService } from 'src/core/services/prisma.service';

@Module({
  providers: [ExercisesService, PrismaService],
  controllers: [ExercisesController],
  exports: [ExercisesService],
})
export class ExercisesModule {}
