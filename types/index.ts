export interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  role: "normal" | "superuser";
  createdAt: string;
}

export interface Todo {
  id: string;
  userId: string;
  title: string;
  description: string;
  scheduledAt: string;
  completed: boolean;
  completedAt?: string;
  createdAt: string;
}

export interface Session {
  currentUserId: string;
}

export interface Profile {
  name: string;
  avatar?: string;
}

export type TodoFilter = "all" | "upcoming" | "completed";
