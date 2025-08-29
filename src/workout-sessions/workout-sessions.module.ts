import { Module } from '@nestjs/common';
import { WorkoutSessionsController } from './workout-sessions.controller';
import { WorkoutSessionsService } from './workout-sessions.service';
import { PrismaService } from 'src/core/services/prisma.service';

@Module({
  controllers: [WorkoutSessionsController],
  providers: [WorkoutSessionsService, PrismaService],
  exports: [WorkoutSessionsService],
})
export class WorkoutSessionsModule {}
