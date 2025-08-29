import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateWorkoutSessionDto {
  @IsNumber({}, { message: 'ID da ficha deve ser um número válido' })
  workoutId: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
