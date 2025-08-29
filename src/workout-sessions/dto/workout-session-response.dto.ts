export class WorkoutSessionExerciseResponseDto {
  id: number;
  exerciseId: number;
  exerciseName: string;
  exerciseCategory: string;
  workoutExerciseId: number;
  setNumber: number;
  reps: number;
  weight: number;
  restTime?: number;
  notes?: string;
  createdAt: Date;

  constructor(sessionExercise: any) {
    this.id = sessionExercise.id;
    this.exerciseId = sessionExercise.exerciseId;
    this.exerciseName = sessionExercise.exercise.name;
    this.exerciseCategory = sessionExercise.exercise.category;
    this.workoutExerciseId = sessionExercise.workoutExerciseId;
    this.setNumber = sessionExercise.setNumber;
    this.reps = sessionExercise.reps;
    this.weight = sessionExercise.weight;
    this.restTime = sessionExercise.restTime;
    this.notes = sessionExercise.notes;
    this.createdAt = sessionExercise.createdAt;
  }
}

export class WorkoutSessionResponseDto {
  id: number;
  workoutId: number;
  workoutName: string;
  userId: number;
  startTime: Date;
  endTime?: Date;
  totalTime?: number; // em segundos
  notes?: string;
  createdAt: Date;
  exercises: WorkoutSessionExerciseResponseDto[];

  constructor(session: any) {
    this.id = session.id;
    this.workoutId = session.workoutId;
    this.workoutName = session.workout?.name;
    this.userId = session.userId;
    this.startTime = session.startTime;
    this.endTime = session.endTime;
    this.totalTime = session.totalTime;
    this.notes = session.notes;
    this.createdAt = session.createdAt;
    this.exercises =
      session.exercises?.map(
        (ex: any) => new WorkoutSessionExerciseResponseDto(ex),
      ) || [];
  }
}
