import { IsOptional, IsString } from 'class-validator';

export class FinishWorkoutSessionDto {
  @IsOptional()
  @IsString()
  notes?: string;
}
