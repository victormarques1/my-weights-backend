import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateWorkoutSessionExerciseDto {
  @IsNumber({}, { message: 'ID do exercício deve ser um número' })
  exerciseId: number;

  @IsNumber({}, { message: 'ID do exercício da ficha deve ser um número' })
  workoutExerciseId: number;

  @IsNumber({}, { message: 'Número da série deve ser um número' })
  @Min(1, { message: 'Número da série deve ser pelo menos 1' })
  setNumber: number;

  @IsNumber({}, { message: 'Repetições deve ser um número' })
  @Min(0, { message: 'Repetições não pode ser negativo' })
  reps: number;

  @IsNumber({}, { message: 'Peso deve ser um número' })
  @Min(0, { message: 'Peso não pode ser negativo' })
  weight: number;

  @IsOptional()
  @IsNumber({}, { message: 'Tempo de descanso deve ser um número' })
  restTime?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
