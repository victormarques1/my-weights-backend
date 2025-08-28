export class ExerciseResponseDto {
  id: number;
  name: string;
  category: string;
  userId: number;

  constructor(exercise: any) {
    this.id = exercise.id;
    this.name = exercise.name;
    this.category = exercise.category;
    this.userId = exercise.userId;
  }
}
