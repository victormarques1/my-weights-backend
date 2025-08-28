import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ExercisesService } from './exercises.service';
import { CreateUserExerciseDto } from './dto/create-user-exercise.dto';

@Controller('exercises')
@UseGuards(JwtAuthGuard)
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Get()
  async findMyExercises(@Request() req) {
    return this.exercisesService.findUserExercises(req.user.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUserExercise(
    @Request() req,
    @Body() createExerciseDto: CreateUserExerciseDto,
  ) {
    return this.exercisesService.createUserExercise(
      req.user.id,
      createExerciseDto,
    );
  }
}
