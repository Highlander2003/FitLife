export type UserRole = 'usuario' | 'entrenador' | 'administrador';

export interface Exercise {
	id: string;
	name: string;
	sets: number;
	reps: number;
}

export interface User {
	id: string;
	name: string;
	email: string;
	password?: string;
	birthDate: string;
	role: UserRole;
	trainerId?: string;
	nutritionGoal?: 'ganancia' | 'definición';
	macros?: { calories: number; protein: number; carbs: number; fats: number };
	exercises?: Record<number, Exercise[]>;
}

export interface Trainer {
	id: string;
	name: string;
	email: string;
	users: string[];
}

export interface Reminder {
	id: string;
	title: string;
	time: string;
	icon?: string;
}
