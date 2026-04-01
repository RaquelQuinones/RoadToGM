export type Exercise = {
    exercise_id: number;
    module_id?: number;
    title: string;
    description?: string;
    initial_fen: string;
    solution_moves: string[];
    side_to_move: "w" | "b";
  };