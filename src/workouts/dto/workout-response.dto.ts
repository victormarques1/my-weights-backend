export class WorkoutExerciseResponseDto {
  id: number;
  exerciseId: number;
  exerciseName: string;
  exerciseCategory: string;
  sets: number;
  reps: number;
  weight: number;
  restTime?: number;
  notes?: string;

  constructor(workoutExercise: any) {
    this.id = workoutExercise.id;
    this.exerciseId = workoutExercise.exerciseId;
    this.exerciseName = workoutExercise.exercise.name;
    this.exerciseCategory = workoutExercise.exercise.category;
    this.sets = workoutExercise.sets;
    this.reps = workoutExercise.reps;
    this.weight = workoutExercise.weight;
    this.restTime = workoutExercise.restTime;
    this.notes = workoutExercise.notes;
  }
}

export class WorkoutResponseDto {
  id: number;
  name: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  exercises: WorkoutExerciseResponseDto[];

  constructor(workout: any) {
    this.id = workout.id;
    this.name = workout.name;
    this.userId = workout.userId;
    this.createdAt = workout.createdAt;
    this.updatedAt = workout.updatedAt;
    this.exercises =
      workout.exercises?.map(
        (workoutExercises: any) =>
          new WorkoutExerciseResponseDto(workoutExercises),
      ) || [];
  }
}
