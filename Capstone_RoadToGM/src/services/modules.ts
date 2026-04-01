import { apiFetch } from "./api";
import type { Module } from "../types/module";
import type { Exercise } from "../types/exercise";

export function getModules(): Promise<Module[]> {
  return apiFetch<Module[]>("/modules");
}

export function getModuleById(id: string): Promise<Module> {
  return apiFetch<Module>(`/modules/${id}`);
}

export function getExercisesByModuleId(id: string): Promise<Exercise[]> {
  return apiFetch<Exercise[]>(`/modules/${id}/exercises`);
}

export function createModule(data: {
  title: string;
  description: string;
  category: string;
}): Promise<Module> {
  return apiFetch<Module>("/modules", {
    method: "POST",
    body: JSON.stringify(data),
  });
}