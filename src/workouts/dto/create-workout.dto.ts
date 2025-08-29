import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateWorkoutExerciseDto {
  @IsNotEmpty({ message: 'ID do exercício é obrigatório' })
  exerciseId: number;

  @IsNumber({}, { message: 'Número de séries deve ser um número' })
  @Min(1, { message: 'Deve ter pelo menos 1 série' })
  sets: number;

  @IsNumber({}, { message: 'Número de séries deve ser um número' })
  @Min(1, { message: 'Deve ter pelo menos 1 repetição' })
  reps: number;

  @IsNumber({}, { message: 'Número de séries deve ser um número' })
  @Min(0, { message: 'Peso não pode ser negativo' })
  weight: number;

  @IsOptional()
  @IsNumber({}, { message: 'Tempo de descanso deve ser um número' })
  restTime?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateWorkoutDto {
  @IsNotEmpty({ message: 'Nome da ficha é obrigatório' })
  @IsString()
  name: string;

  @IsArray({ message: 'Exercícios devem ser um array' })
  @ArrayMinSize(1, { message: 'Ficha deve ter pelo menos 1 exercício' })
  @ValidateNested({ each: true })
  @Type(() => CreateWorkoutExerciseDto)
  exercises: CreateWorkoutExerciseDto[];
}
