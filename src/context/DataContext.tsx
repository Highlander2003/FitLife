import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Exercise, Reminder, Trainer, User } from '../types';

interface DataContextValue {
	users: User[];
	trainers: Trainer[];
	reminders: Reminder[];
	addUser: (user: User) => void;
	updateUser: (id: string, patch: Partial<User>) => User | undefined;
	addTrainer: (trainer: Trainer) => void;
	updateTrainerUsers: (trainerId: string, userIds: string[]) => void;
	getUserById: (id: string) => User | undefined;
	getExercisesByUser: (id: string) => Record<number, Exercise[]> | undefined;
}

const mockUsers: User[] = [
	{
		id: 'u1',
		name: 'Juan Pérez',
		email: 'usuario@example.com',
		birthDate: '1992-05-10',
		role: 'usuario',
		trainerId: 't1',
		nutritionGoal: 'ganancia',
		macros: { calories: 2200, protein: 160, carbs: 260, fats: 70 },
		exercises: {
			1: [
				{ id: 'e1', name: 'Sentadilla', sets: 4, reps: 8 },
				{ id: 'e2', name: 'Peso muerto rumano', sets: 3, reps: 10 },
			],
			2: [
				{ id: 'e3', name: 'Press de banca', sets: 4, reps: 8 },
				{ id: 'e4', name: 'Dominadas', sets: 3, reps: 8 },
			],
		},
	},
	{
		id: 't1',
		name: 'Entrenador X',
		email: 'entrenador@example.com',
		birthDate: '1988-03-21',
		role: 'entrenador',
	},
	{
		id: 'a1',
		name: 'Admin Y',
		email: 'admin@example.com',
		birthDate: '1985-11-02',
		role: 'administrador',
	},
];

const mockTrainers: Trainer[] = [
	{ id: 't1', name: 'Entrenador X', email: 'entrenador@example.com', users: ['u1'] },
];

const mockReminders: Reminder[] = [
	{ id: 'r1', title: 'Beber agua', time: '10:00' },
	{ id: 'r2', title: 'Snack saludable', time: '12:30' },
	{ id: 'r3', title: 'Tiempo de descanso', time: '15:00' },
];

const DataContext = createContext<DataContextValue | undefined>(undefined);

export const DataProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const [users, setUsers] = useState<User[]>(mockUsers);
	const [trainers, setTrainers] = useState<Trainer[]>(mockTrainers);
	const [reminders] = useState<Reminder[]>(mockReminders);

	const addUser = useCallback((user: User) => {
		setUsers(prev => [...prev, user]);
	}, []);

	const updateUser = useCallback((id: string, patch: Partial<User>) => {
		let updated: User | undefined;
		setUsers(prev =>
			prev.map(item => {
				if (item.id !== id) return item;
				updated = { ...item, ...patch };
				return updated;
			}),
		);
		return updated;
	}, []);

	const addTrainer = useCallback((trainer: Trainer) => {
		setTrainers(prev => [...prev, trainer]);
	}, []);

	const updateTrainerUsers = useCallback((trainerId: string, userIds: string[]) => {
		setTrainers(prev =>
			prev.map(trainer => (trainer.id === trainerId ? { ...trainer, users: userIds } : trainer)),
		);
		setUsers(prev =>
			prev.map(user =>
				userIds.includes(user.id)
					? { ...user, trainerId: trainerId }
					: user.trainerId === trainerId && !userIds.includes(user.id)
					? { ...user, trainerId: undefined }
					: user,
			),
		);
	}, []);

	const getUserById = useCallback(
		(id: string) => users.find(user => user.id === id),
		[users],
	);

	const getExercisesByUser = useCallback(
		(id: string) => getUserById(id)?.exercises,
		[getUserById],
	);

	const value = useMemo(
		() => ({
			users,
			trainers,
			reminders,
			addUser,
			updateUser,
			addTrainer,
			updateTrainerUsers,
			getUserById,
			getExercisesByUser,
		}),
		[
			users,
			trainers,
			reminders,
			addUser,
			updateUser,
			addTrainer,
			updateTrainerUsers,
			getUserById,
			getExercisesByUser,
		],
	);

	return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
	const ctx = useContext(DataContext);
	if (!ctx) throw new Error('useData debe usarse dentro de DataProvider');
	return ctx;
};
