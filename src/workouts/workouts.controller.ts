import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { WorkoutsService } from './workouts.service';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { WorkoutResponseDto } from './dto/workout-response.dto';

@Controller('workouts')
@UseGuards(JwtAuthGuard)
export class WorkoutsController {
  constructor(private readonly workoutService: WorkoutsService) {}

  @Post()
  async create(
    @Request() req,
    @Body() createWorkoutDto: CreateWorkoutDto,
  ): Promise<WorkoutResponseDto> {
    return this.workoutService.create(req.user.id, createWorkoutDto);
  }

  @Get()
  async findAll(@Request() req): Promise<WorkoutResponseDto[]> {
    return this.workoutService.findAll(req.user.id);
  }
}
