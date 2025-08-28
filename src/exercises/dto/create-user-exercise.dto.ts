import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { MuscleGroup } from 'generated/prisma';

export class CreateUserExerciseDto {
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString()
  @MaxLength(80, {
    message: 'Nome do exercício deve ter no máximo 80 caracteres',
  })
  name: string;

  @IsNotEmpty({ message: 'Categoria é obrigatória' })
  @IsEnum(MuscleGroup, { message: 'Categoria inválida' })
  category: MuscleGroup;
}
