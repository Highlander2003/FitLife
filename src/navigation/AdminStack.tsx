import React, { useMemo, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import {
	Pressable,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	View,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

type Trainer = {
	id: string;
	name: string;
	email: string;
	phone: string;
	users: { id: string; name: string; since: string }[];
	credentials?: { username: string; password: string };
};

type ManagedUser = {
	id: string;
	name: string;
	trainer: string;
	goal: string;
};

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const trainersSeed: Trainer[] = [
	{
		id: 'trainer-1',
		name: 'Juan Pérez',
		email: 'juan@fitlife.app',
		phone: '555-0101',
		users: [
			{ id: 'user-1', name: 'Carlos López', since: '2023-01-15' },
			{ id: 'user-2', name: 'María García', since: '2023-02-20' },
		],
		credentials: { username: 'juan.perez', password: 'fit-1234' },
	},
	{
		id: 'trainer-2',
		name: 'Ana Torres',
		email: 'ana@fitlife.app',
		phone: '555-0102',
		users: [
			{ id: 'user-3', name: 'Luis Martínez', since: '2023-03-10' },
			{ id: 'user-4', name: 'Sofía Rodríguez', since: '2023-04-05' },
		],
		credentials: { username: 'ana.torres', password: 'fit-5678' },
	},
];

const usersSeed: ManagedUser[] = [
	{ id: 'user-1', name: 'Carlos López', trainer: 'Juan Pérez', goal: 'ganancia muscular' },
	{ id: 'user-2', name: 'María García', trainer: 'Juan Pérez', goal: 'definición muscular' },
	{ id: 'user-3', name: 'Luis Martínez', trainer: 'Ana Torres', goal: 'ganancia muscular' },
	{ id: 'user-4', name: 'Sofía Rodríguez', trainer: 'Ana Torres', goal: 'definición muscular' },
];

const AdminProfileScreen = () => {
	const { logout } = useAuth() as { logout?: () => void };
	const [profile, setProfile] = useState({
		name: 'Ana Admin',
		email: 'admin@fitlife.app',
		password: '',
		birthdate: '1988-08-18',
	});

	const handleChange = (key: keyof typeof profile, value: string) =>
		setProfile((prev) => ({ ...prev, [key]: value }));

	return (
		<SafeAreaView style={styles.screen}>
			<ScrollView contentContainerStyle={styles.scroll}>
				<Text style={styles.title}>Perfil</Text>
				<Text style={styles.subtitle}>Actualiza tu información personal.</Text>

				{/* user badge (inline styles to avoid modifying global styles object) */}
				<View style={{ backgroundColor: '#1E2125', padding: 12, borderRadius: 8, marginBottom: 24 }}>
					<Text style={{ color: '#FFFFFF', fontWeight: '500' }}>
						Usuario: @{profile.name}
					</Text>
				</View>

				<View style={styles.formCard}>
					<Text style={styles.label}>Nombre</Text>
					<TextInput
						style={styles.input}
						value={profile.name}
						onChangeText={(value) => handleChange('name', value)}
						placeholder="Nombre completo"
						placeholderTextColor="#5D6770"
					/>
					<Text style={styles.label}>Correo electrónico</Text>
					<TextInput
						style={styles.input}
						value={profile.email}
						onChangeText={(value) => handleChange('email', value)}
						autoCapitalize="none"
						keyboardType="email-address"
						placeholder="correo@fitlife.app"
						placeholderTextColor="#5D6770"
					/>
					<Text style={styles.label}>Contraseña</Text>
					<TextInput
						style={styles.input}
						value={profile.password}
						onChangeText={(value) => handleChange('password', value)}
						secureTextEntry
						placeholder="••••••••"
						placeholderTextColor="#5D6770"
					/>
					<Text style={styles.label}>Fecha de nacimiento</Text>
					<TextInput
						style={styles.input}
						value={profile.birthdate}
						onChangeText={(value) => handleChange('birthdate', value)}
						placeholder="AAAA-MM-DD"
						placeholderTextColor="#5D6770"
					/>
					<Pressable
						onPress={() => {}}
						style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
					>
						<Text style={styles.primaryButtonText}>Guardar cambios</Text>
					</Pressable>
					<Pressable
						onPress={() => logout?.()}
						style={({ pressed }) => [styles.logoutButton, pressed && styles.logoutButtonPressed]}
					>
						<Text style={styles.logoutButtonText}>Cerrar sesión</Text>
					</Pressable>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const AdminTrainersScreen = () => {
	const [trainers, setTrainers] = useState<Trainer[]>(trainersSeed);
	const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
	const [isCreatingTrainer, setIsCreatingTrainer] = useState(false);
	const [form, setForm] = useState({
		name: '',
		email: '',
		phone: '',
		username: '',
		password: '',
	});
	const [message, setMessage] = useState<string | null>(null);

	const handleSelectTrainer = (trainer: Trainer) => {
		setIsCreatingTrainer(false);
		setSelectedTrainer(trainer);
		setForm({
			name: trainer.name,
			email: trainer.email,
			phone: trainer.phone,
			username: trainer.credentials?.username ?? '',
			password: trainer.credentials?.password ?? '',
		});
		setMessage(null);
	};

	const startCreateTrainer = () => {
		setIsCreatingTrainer(true);
		setSelectedTrainer(null);
		setForm({ name: '', email: '', phone: '', username: '', password: '' });
		setMessage(null);
	};

	const handleChange = (key: keyof typeof form, value: string) =>
		setForm((prev) => ({ ...prev, [key]: value }));

	const handleSave = () => {
		if (selectedTrainer) {
			const updatedTrainer = {
				...selectedTrainer,
				name: form.name,
				email: form.email,
				phone: form.phone,
				credentials: { username: form.username.trim(), password: form.password },
			};
			setTrainers((prev) =>
				prev.map((trainer) =>
					trainer.id === selectedTrainer.id ? updatedTrainer : trainer,
				),
			);
			setSelectedTrainer(updatedTrainer);
			setForm({
				name: updatedTrainer.name,
				email: updatedTrainer.email,
				phone: updatedTrainer.phone,
				username: updatedTrainer.credentials.username,
				password: updatedTrainer.credentials.password,
			});
			setMessage('Entrenador actualizado.');
			return;
		}

		if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.username.trim() || !form.password.trim()) {
			setMessage('Completa todos los campos antes de registrar.');
			return;
		}

		const credentials = { username: form.username.trim(), password: form.password };
		const newTrainer: Trainer = {
			id: `trainer-${Date.now()}`,
			name: form.name.trim(),
			email: form.email.trim(),
			phone: form.phone.trim(),
			users: [],
			credentials,
		};
		setTrainers((prev) => [...prev, newTrainer]);
		setSelectedTrainer(newTrainer);
		setIsCreatingTrainer(false);
		setForm({
			name: newTrainer.name,
			email: newTrainer.email,
			phone: newTrainer.phone,
			username: credentials.username,
			password: credentials.password,
		});
		setMessage(`Nuevo entrenador registrado. Usuario: ${credentials.username} | Contraseña: ${credentials.password}`);
	};

	const handleDelete = (id: string) => {
		setTrainers((prev) => prev.filter((trainer) => trainer.id !== id));
		if (selectedTrainer?.id === id) {
			setSelectedTrainer(null);
			setIsCreatingTrainer(false);
			setForm({ name: '', email: '', phone: '', username: '', password: '' });
		}
		setMessage('Entrenador eliminado.');
	};

	return (
		<SafeAreaView style={styles.screen}>
			<ScrollView contentContainerStyle={styles.scroll}>
				<Text style={styles.title}>Entrenadores</Text>
				<Text style={styles.subtitle}>Gestiona los entrenadores de tu gimnasio.</Text>
				<View style={styles.card}>
					<Text style={styles.sectionTitle}>Lista de entrenadores</Text>
					<Pressable
						onPress={startCreateTrainer}
						style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
					>
						<Text style={styles.primaryButtonText}>Registrar entrenador</Text>
					</Pressable>
					{trainers.map((trainer) => (
						<Pressable
							key={trainer.id}
							onPress={() => handleSelectTrainer(trainer)}
							style={({ pressed }) => [
								styles.trainerRow,
								pressed && styles.trainerRowPressed,
								selectedTrainer?.id === trainer.id && styles.trainerRowActive,
							]}
						>
							<View>
								<Text style={styles.trainerName}>{trainer.name}</Text>
								<Text style={styles.trainerInfo}>{trainer.email}</Text>
							</View>
							<Ionicons name="chevron-forward" size={16} color="#A6B1B8" />
						</Pressable>
					))}
				</View>
				<View style={styles.card}>
					<Text style={styles.sectionTitle}>
						{selectedTrainer ? 'Detalles del entrenador' : isCreatingTrainer ? 'Registrar nuevo entrenador' : 'Selecciona un entrenador'}
					</Text>
					{message && <Text style={styles.detailText}>{message}</Text>}
					{selectedTrainer || isCreatingTrainer ? (
						<>
							<View style={styles.detailCard}>
								<Text style={styles.label}>Nombre</Text>
								<TextInput
									style={styles.input}
									value={form.name}
									onChangeText={(value) => handleChange('name', value)}
									placeholder="Nombre del entrenador"
									placeholderTextColor="#5D6770"
								/>
								<Text style={styles.label}>Correo electrónico</Text>
								<TextInput
									style={styles.input}
									value={form.email}
									onChangeText={(value) => handleChange('email', value)}
									autoCapitalize="none"
									keyboardType="email-address"
									placeholder="correo@fitlife.app"
									placeholderTextColor="#5D6770"
								/>
								<Text style={styles.label}>Teléfono</Text>
								<TextInput
									style={styles.input}
									value={form.phone}
									onChangeText={(value) => handleChange('phone', value)}
									placeholder="555-0101"
									placeholderTextColor="#5D6770"
								/>
								<Text style={styles.label}>Usuario de acceso</Text>
								<TextInput
									style={styles.input}
									value={form.username}
									onChangeText={(value) => handleChange('username', value)}
									autoCapitalize="none"
									placeholder="usuario.entrenador"
									placeholderTextColor="#5D6770"
								/>
								<Text style={styles.label}>Contraseña temporal</Text>
								<TextInput
									style={styles.input}
									value={form.password}
									onChangeText={(value) => handleChange('password', value)}
									secureTextEntry
									placeholder="Contraseña temporal"
									placeholderTextColor="#5D6770"
								/>
							</View>
							<View style={styles.trainerFormActions}>
								<Pressable
									onPress={handleSave}
									style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
								>
									<Text style={styles.primaryButtonText}>
										{selectedTrainer ? 'Guardar cambios' : 'Registrar entrenador'}
									</Text>
								</Pressable>
								{selectedTrainer && (
									<Pressable
										onPress={() => handleDelete(selectedTrainer.id)}
										style={({ pressed }) => [styles.logoutButton, pressed && styles.logoutButtonPressed]}
									>
										<Text style={styles.logoutButtonText}>Eliminar entrenador</Text>
									</Pressable>
								)}
							</View>
						</>
					) : (
						<Text style={styles.detailText}>Usa “Registrar entrenador” o selecciona uno para editarlo.</Text>
					)}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const AdminUsersScreen = () => {
	const [users, setUsers] = useState<ManagedUser[]>(usersSeed);
	const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null);
	const [form, setForm] = useState({
		name: '',
		trainer: '',
		goal: '',
	});
	const [message, setMessage] = useState<string | null>(null);

	const handleSelectUser = (user: ManagedUser) => {
		setSelectedUser(user);
		setForm({
			name: user.name,
			trainer: user.trainer,
			goal: user.goal,
		});
	};

	const handleChange = (key: keyof typeof form, value: string) =>
		setForm((prev) => ({ ...prev, [key]: value }));

	const handleSave = () => {
		if (selectedUser) {
			setUsers((prev) =>
				prev.map((user) =>
					user.id === selectedUser.id
						? { ...user, name: form.name, trainer: form.trainer, goal: form.goal }
						: user,
				),
			);
			setMessage('Usuario actualizado.');
		} else {
			const newUser = {
				id: `user-${Date.now()}`,
				name: form.name,
				trainer: form.trainer,
				goal: form.goal,
			};
			setUsers((prev) => [...prev, newUser]);
			setMessage('Usuario agregado.');
		}
		setSelectedUser(null);
		setForm({ name: '', trainer: '', goal: '' });
	};

	const handleDelete = (id: string) => {
		setUsers((prev) => prev.filter((user) => user.id !== id));
		if (selectedUser?.id === id) {
			setSelectedUser(null);
			setForm({ name: '', trainer: '', goal: '' });
		}
	};

	return (
		<SafeAreaView style={styles.screen}>
			<ScrollView contentContainerStyle={styles.scroll}>
				<Text style={styles.title}>Usuarios</Text>
				<Text style={styles.subtitle}>Gestiona los usuarios de tu gimnasio.</Text>
				<View style={styles.card}>
					<Text style={styles.sectionTitle}>Lista de usuarios</Text>
					{users.map((user) => (
						<Pressable
							key={user.id}
							onPress={() => handleSelectUser(user)}
							style={({ pressed }) => [
								styles.trainerRow,
								pressed && styles.trainerRowPressed,
								selectedUser?.id === user.id && styles.trainerRowActive,
							]}
						>
							<View>
								<Text style={styles.trainerName}>{user.name}</Text>
								<Text style={styles.trainerInfo}>{user.trainer}</Text>
							</View>
							<Ionicons name="chevron-forward" size={16} color="#A6B1B8" />
						</Pressable>
					))}
				</View>
				<View style={styles.card}>
					<Text style={styles.sectionTitle}>Detalles del usuario</Text>
					{selectedUser ? (
						<>
							<View style={styles.detailCard}>
								<Text style={styles.label}>Nombre</Text>
								<TextInput
									style={styles.input}
									value={form.name}
									onChangeText={(value) => handleChange('name', value)}
									placeholder="Nombre del usuario"
									placeholderTextColor="#5D6770"
								/>
								<Text style={styles.label}>Entrenador</Text>
								<TextInput
									style={styles.input}
									value={form.trainer}
									onChangeText={(value) => handleChange('trainer', value)}
									placeholder="Entrenador asignado"
									placeholderTextColor="#5D6770"
								/>
								<Text style={styles.label}>Objetivo</Text>
								<TextInput
									style={styles.input}
									value={form.goal}
									onChangeText={(value) => handleChange('goal', value)}
									placeholder="Objetivo del usuario"
									placeholderTextColor="#5D6770"
								/>
							</View>
							<View style={styles.trainerFormActions}>
								<Pressable
									onPress={handleSave}
									style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
								>
									<Text style={styles.primaryButtonText}>
										{selectedUser ? 'Guardar cambios' : 'Agregar usuario'}
									</Text>
								</Pressable>
								<Pressable
									onPress={() => handleDelete(selectedUser.id)}
									style={({ pressed }) => [styles.logoutButton, pressed && styles.logoutButtonPressed]}
								>
									<Text style={styles.logoutButtonText}>Eliminar usuario</Text>
								</Pressable>
							</View>
						</>
					) : (
						<Text style={styles.detailText}>Selecciona un usuario para ver sus detalles.</Text>
					)}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const AdminTabs = () => (
	<Tab.Navigator
		screenOptions={{
			headerShown: false,
			tabBarActiveTintColor: '#4AD1A9',
			tabBarInactiveTintColor: '#A6B1B8',
			tabBarStyle: { backgroundColor: '#0F1316', borderTopColor: 'rgba(255,255,255,0.04)' },
		}}
	>
		<Tab.Screen
			name="AdminProfile"
			component={AdminProfileScreen}
			options={{
				title: 'Perfil',
				tabBarIcon: ({ color, size }) => <Ionicons name="person-circle-outline" color={color} size={size} />,
			}}
		/>
		<Tab.Screen
			name="AdminTrainers"
			component={AdminTrainersScreen}
			options={{
				title: 'Entrenadores',
				tabBarIcon: ({ color, size }) => <Ionicons name="barbell-outline" color={color} size={size} />,
			}}
		/>
		<Tab.Screen
			name="AdminUsers"
			component={AdminUsersScreen}
			options={{
				title: 'Usuarios',
				tabBarIcon: ({ color, size }) => <Ionicons name="people-outline" color={color} size={size} />,
			}}
		/>
	</Tab.Navigator>
);

export const AdminStack = () => (
	<Stack.Navigator
		screenOptions={{
			headerShown: false,
		}}
	>
		<Stack.Screen name="AdminTabs" component={AdminTabs} />
	</Stack.Navigator>
);

const styles = StyleSheet.create({
	screen: { flex: 1, backgroundColor: '#0B0F12' },
	scroll: { paddingHorizontal: 24, paddingBottom: 32, paddingTop: 32 },
	title: { color: '#E6EEF3', fontSize: 24, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
	subtitle: { color: '#A6B1B8', fontSize: 14, textAlign: 'center', marginBottom: 24 },
	card: {
		backgroundColor: '#161A1D',
		borderRadius: 18,
		padding: 20,
		marginBottom: 24,
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.03)',
	},
	formCard: {
		backgroundColor: '#161A1D',
		borderRadius: 18,
		padding: 20,
		marginBottom: 24,
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.03)',
	},
	label: { color: '#A6B1B8', fontSize: 13, fontWeight: '500', marginBottom: 8 },
	input: {
		backgroundColor: '#0F1316',
		borderRadius: 12,
		paddingHorizontal: 16,
		paddingVertical: 12,
		color: '#E6EEF3',
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.04)',
		marginBottom: 16,
	},
	primaryButton: {
		backgroundColor: 'transparent',
		borderRadius: 12,
		paddingVertical: 12,
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#5DA3FF',
	},
	primaryButtonPressed: { opacity: 0.85 },
	primaryButtonText: { color: '#5DA3FF', fontSize: 15, fontWeight: '600' },
	secondaryButton: {
		backgroundColor: 'transparent',
		borderRadius: 12,
		paddingVertical: 12,
		alignItems: 'center',
		borderWidth: 1,
		borderColor: 'rgba(230,238,243,0.25)',
		flex: 1,
	},
	secondaryButtonPressed: { opacity: 0.85 },
	secondaryButtonText: { color: '#E6EEF3', fontSize: 14, fontWeight: '600' },
	logoutButton: {
		backgroundColor: 'transparent',
		borderRadius: 12,
		paddingVertical: 12,
		alignItems: 'center',
		borderWidth: 1,
		borderColor: 'rgba(255,107,107,0.6)',
		marginTop: 16,
	},
	logoutButtonPressed: { opacity: 0.85 },
	logoutButtonText: { color: '#FF6B6B', fontSize: 14, fontWeight: '600' },
	actionsRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 24,
		gap: 12,
	},
	actionButton: {
		flex: 1,
		borderRadius: 12,
		paddingVertical: 12,
		alignItems: 'center',
		borderWidth: 1,
		borderColor: 'rgba(230,238,243,0.18)',
		flexDirection: 'row',
		justifyContent: 'center',
	},
	actionButtonCreate: { borderColor: 'rgba(74,209,169,0.45)' },
	actionButtonEdit: { borderColor: 'rgba(93,163,255,0.45)' },
	actionButtonDelete: { borderColor: 'rgba(255,107,107,0.45)' },
	actionButtonPressed: { opacity: 0.8 },
	actionButtonIcon: { marginRight: 8 },
	actionButtonText: { fontSize: 13, fontWeight: '600', color: '#E6EEF3' },
	actionButtonAccentSuccess: { color: '#4AD1A9' },
	actionButtonAccentInfo: { color: '#5DA3FF' },
	actionButtonAccentDanger: { color: '#FF6B6B' },
	sectionTitle: { color: '#E6EEF3', fontSize: 18, fontWeight: '600', marginBottom: 16 },
	trainerRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor: '#0F1316',
		borderRadius: 14,
		paddingVertical: 14,
		paddingHorizontal: 16,
		marginBottom: 12,
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.04)',
	},
	trainerRowActive: { borderColor: '#4AD1A9' },
	trainerRowPressed: { opacity: 0.85 },
	trainerName: { color: '#E6EEF3', fontSize: 15, fontWeight: '600' },
	trainerInfo: { color: '#A6B1B8', fontSize: 12, marginTop: 4 },
	detailCard: {
		backgroundColor: '#161A1D',
		borderRadius: 18,
		padding: 20,
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.03)',
	},
	detailText: { color: '#A6B1B8', fontSize: 13, marginBottom: 6 },
	detailUserRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
	detailUserName: { color: '#E6EEF3', fontSize: 14, fontWeight: '600' },
	detailUserMeta: { color: '#A6B1B8', fontSize: 12 },
	assignedCoach: { color: '#5DA3FF', fontSize: 13, fontWeight: '600' },
	formErrorText: { color: '#FF6B6B', fontSize: 12, marginBottom: 8 },
	trainerFormActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 4 },
	exerciseGroup: { marginBottom: 8 },
});