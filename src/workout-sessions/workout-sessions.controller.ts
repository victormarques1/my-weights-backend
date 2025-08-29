import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkoutSessionsService } from './workout-sessions.service';
import { CreateWorkoutSessionDto } from './dto/create-workout-session.dto';
import { CreateWorkoutSessionExerciseDto } from './dto/workout-session-exercise.dto';
import { FinishWorkoutSessionDto } from './dto/finish-workout-session.dto';
import { WorkoutSessionResponseDto } from './dto/workout-session-response.dto';

@Controller('workout-sessions')
@UseGuards(JwtAuthGuard)
export class WorkoutSessionsController {
  constructor(
    private readonly workoutSessionsService: WorkoutSessionsService,
  ) {}

  @Post()
  async create(
    @Request() req,
    @Body() createSessionDto: CreateWorkoutSessionDto,
  ): Promise<WorkoutSessionResponseDto> {
    return this.workoutSessionsService.create(req.user.id, createSessionDto);
  }

  @Get()
  async findAll(@Request() req): Promise<WorkoutSessionResponseDto[]> {
    return this.workoutSessionsService.findUserSessions(req.user.id);
  }

  @Get('active')
  async getActive(@Request() req): Promise<WorkoutSessionResponseDto | null> {
    return this.workoutSessionsService.getActiveSession(req.user.id);
  }

  @Get(':id')
  async findOne(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<WorkoutSessionResponseDto> {
    return this.workoutSessionsService.findOne(req.user.id, id);
  }

  @Post(':id/exercises')
  async addExerciseSet(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() exerciseDto: CreateWorkoutSessionExerciseDto,
  ): Promise<WorkoutSessionResponseDto> {
    return this.workoutSessionsService.addExerciseSet(
      req.user.id,
      id,
      exerciseDto,
    );
  }

  @Put(':id/finish')
  async finish(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() finishDto: FinishWorkoutSessionDto,
  ): Promise<WorkoutSessionResponseDto> {
    return this.workoutSessionsService.finishSession(
      req.user.id,
      id,
      finishDto,
    );
  }
}
