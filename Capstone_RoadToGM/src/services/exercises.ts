import { apiFetch } from "./api";
import type { Exercise } from "../types/exercise";

export function getExerciseById(id: string): Promise<Exercise> {
  return apiFetch<Exercise>(`/exercises/${id}`);
}