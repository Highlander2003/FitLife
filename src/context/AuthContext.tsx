import React, { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react';

export type Role = 'administrador' | 'entrenador' | 'usuario';

export interface User {
	username: string;
	fullName: string;
	role: Role;
}

interface AuthContextData {
	user: User | null;
	login: (username: string, password: string) => void;
	register: (payload: { username: string; password: string; fullName: string; role: Role }) => void;
	logout: () => void;
}

const mockUsers: Array<{ username: string; password: string; fullName: string; role: Role }> = [
	{ username: 'admin', password: 'admin123', fullName: 'Ana Admin', role: 'administrador' },
	{ username: 'coach', password: 'coach123', fullName: 'Carlos Coach', role: 'entrenador' },
	{ username: 'user', password: 'user123', fullName: 'Úrsula Usuario', role: 'usuario' },
];

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [users, setUsers] = useState(mockUsers);

	const login = useCallback(
		(rawUsername: string, password: string) => {
			const username = rawUsername.trim().toLowerCase();
			if (!username || !password.trim()) {
				throw new Error('Ingresa usuario y contraseña.');
			}
			const found = users.find(
				(item) => item.username.toLowerCase() === username && item.password === password.trim(),
			);
			if (!found) {
				throw new Error('Credenciales inválidas.');
			}
			setUser({ username: found.username, fullName: found.fullName, role: found.role });
		},
		[users],
	);

	const register = useCallback(
		({ username, password, fullName, role }: { username: string; password: string; fullName: string; role: Role }) => {
			const normalized = username.trim().toLowerCase();
			if (!normalized || !password.trim() || !fullName.trim()) {
				throw new Error('Todos los campos son obligatorios.');
			}
			if (users.some((item) => item.username.toLowerCase() === normalized)) {
				throw new Error('El usuario ya existe.');
			}
			const newUser = { username: normalized, password: password.trim(), fullName: fullName.trim(), role };
			setUsers((prev) => [...prev, newUser]);
			setUser({ username: newUser.username, fullName: newUser.fullName, role: newUser.role });
		},
		[users],
	);

	const logout = useCallback(() => setUser(null), []);

	const value = useMemo(
		() => ({
			user,
			login,
			register,
			logout,
		}),
		[user, login, register, logout],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
