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

type Trainer = {
	id: string;
	name: string;
	email: string;
	phone: string;
	users: { id: string; name: string; since: string }[];
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
		name: 'Carlos Coach',
		email: 'c.carlos@fitlife.app',
		phone: '+52 55 1234 5678',
		users: [
			{ id: 'user-1', name: 'Úrsula Usuario', since: '01/04/2024' },
			{ id: 'user-2', name: 'Diego Dinámico', since: '15/05/2024' },
		],
	},
	{
		id: 'trainer-2',
		name: 'Laura Lift',
		email: 'l.lift@fitlife.app',
		phone: '+52 33 9876 5432',
		users: [{ id: 'user-3', name: 'María Meta', since: '20/02/2024' }],
	},
];

const usersSeed: ManagedUser[] = [
	{ id: 'user-1', name: 'Úrsula Usuario', trainer: 'Carlos Coach', goal: 'Ganancia muscular' },
	{ id: 'user-2', name: 'Diego Dinámico', trainer: 'Carlos Coach', goal: 'Definición muscular' },
	{ id: 'user-3', name: 'María Meta', trainer: 'Laura Lift', goal: 'Resistencia' },
];

const AdminProfileScreen = () => {
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
				<Text style={styles.subtitle}>Actualiza los datos del administrador principal.</Text>
				<View style={styles.card}>
					<Text style={styles.label}>Nombre completo</Text>
					<TextInput
						style={styles.input}
						value={profile.name}
						onChangeText={(value) => handleChange('name', value)}
						placeholderTextColor="#5D6770"
					/>
					<Text style={styles.label}>Correo electrónico</Text>
					<TextInput
						style={styles.input}
						value={profile.email}
						onChangeText={(value) => handleChange('email', value)}
						autoCapitalize="none"
						keyboardType="email-address"
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
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const AdminTrainersScreen = () => {
	const [trainers, setTrainers] = useState<Trainer[]>(trainersSeed);
	const [selectedTrainerId, setSelectedTrainerId] = useState<string>(trainersSeed[0]?.id ?? '');
	const selectedTrainer = useMemo(
		() => trainers.find((trainer) => trainer.id === selectedTrainerId),
		[selectedTrainerId, trainers],
	);
	const [showTrainerForm, setShowTrainerForm] = useState(false);
	const [trainerFormMode, setTrainerFormMode] = useState<'create' | 'edit'>('create');
	const [trainerForm, setTrainerForm] = useState({ name: '', email: '', phone: '' });
	const [trainerFormError, setTrainerFormError] = useState<string | null>(null);

	const resetTrainerForm = () => {
		setTrainerForm({ name: '', email: '', phone: '' });
		setTrainerFormMode('create');
		setTrainerFormError(null);
		setShowTrainerForm(false);
	};

	const openCreateTrainer = () => {
		setTrainerFormMode('create');
		setTrainerForm({ name: '', email: '', phone: '' });
		setTrainerFormError(null);
		setShowTrainerForm(true);
	};

	const openEditTrainer = () => {
		if (!selectedTrainer) return;
		setTrainerFormMode('edit');
		setTrainerForm({
			name: selectedTrainer.name,
			email: selectedTrainer.email,
			phone: selectedTrainer.phone,
		});
		setTrainerFormError(null);
		setShowTrainerForm(true);
	};

	const handleTrainerChange = (key: 'name' | 'email' | 'phone', value: string) => {
		setTrainerForm((prev) => ({ ...prev, [key]: value }));
	};

	const handleTrainerSubmit = () => {
		const name = trainerForm.name.trim();
		const email = trainerForm.email.trim();
		const phone = trainerForm.phone.trim();
		if (!name || !email || !phone) {
			setTrainerFormError('Completa todos los campos.');
			return;
		}
		if (trainerFormMode === 'create') {
			const newTrainer: Trainer = {
				id: `trainer-${Date.now()}`,
				name,
				email,
				phone,
				users: [],
			};
			setTrainers((prev) => [...prev, newTrainer]);
			setSelectedTrainerId(newTrainer.id);
			resetTrainerForm();
			return;
		}
		if (!selectedTrainer) {
			setTrainerFormError('Selecciona un entrenador.');
			return;
		}
		setTrainers((prev) =>
			prev.map((trainer) =>
				trainer.id === selectedTrainer.id ? { ...trainer, name, email, phone } : trainer,
			),
		);
		resetTrainerForm();
	};

	const handleTrainerDelete = () => {
		if (!selectedTrainer) return;
		setTrainers((prev) => {
			const updated = prev.filter((trainer) => trainer.id !== selectedTrainer.id);
			const nextSelection = updated[0]?.id ?? '';
			setSelectedTrainerId(nextSelection);
			return updated;
		});
		resetTrainerForm();
	};

	return (
		<SafeAreaView style={styles.screen}>
			<ScrollView contentContainerStyle={styles.scroll}>
				<Text style={styles.title}>Entrenadores</Text>
				<Text style={styles.subtitle}>Administra el equipo con acciones rápidas de CRUD.</Text>
				<View style={styles.actionsRow}>
					<Pressable
						onPress={openCreateTrainer}
						style={({ pressed }) => [
							styles.actionButton,
							styles.actionButtonCreate,
							pressed && styles.actionButtonPressed,
						]}
					>
						<Ionicons name="add-circle-outline" size={18} color="#4AD1A9" style={styles.actionButtonIcon} />
						<Text style={[styles.actionButtonText, styles.actionButtonAccentSuccess]}>Crear</Text>
					</Pressable>
					<Pressable
						onPress={openEditTrainer}
						style={({ pressed }) => [
							styles.actionButton,
							styles.actionButtonEdit,
							pressed && styles.actionButtonPressed,
						]}
					>
						<Ionicons name="create-outline" size={18} color="#5DA3FF" style={styles.actionButtonIcon} />
						<Text style={[styles.actionButtonText, styles.actionButtonAccentInfo]}>Editar</Text>
					</Pressable>
					<Pressable
						onPress={handleTrainerDelete}
						style={({ pressed }) => [
							styles.actionButton,
							styles.actionButtonDelete,
							pressed && styles.actionButtonPressed,
						]}
					>
						<Ionicons name="trash-outline" size={18} color="#FF6B6B" style={styles.actionButtonIcon} />
						<Text style={[styles.actionButtonText, styles.actionButtonAccentDanger]}>Eliminar</Text>
					</Pressable>
				</View>
				{showTrainerForm && (
				 <View style={styles.card}>
					<Text style={styles.sectionTitle}>
						{trainerFormMode === 'create' ? 'Nuevo entrenador' : 'Editar entrenador'}
					</Text>
					<TextInput
						style={styles.input}
						value={trainerForm.name}
						onChangeText={(value) => handleTrainerChange('name', value)}
						placeholder="Nombre completo"
						placeholderTextColor="#5D6770"
					/>
					<TextInput
						style={styles.input}
						value={trainerForm.email}
						onChangeText={(value) => handleTrainerChange('email', value)}
						placeholder="correo@fitlife.app"
						placeholderTextColor="#5D6770"
						autoCapitalize="none"
						keyboardType="email-address"
					/>
					<TextInput
						style={styles.input}
						value={trainerForm.phone}
						onChangeText={(value) => handleTrainerChange('phone', value)}
						placeholder="+52 55 0000 0000"
						placeholderTextColor="#5D6770"
					/>
					{trainerFormError && <Text style={styles.formErrorText}>{trainerFormError}</Text>}
					<View style={styles.trainerFormActions}>
						<Pressable
							onPress={resetTrainerForm}
							style={({ pressed }) => [styles.secondaryButton, pressed && styles.secondaryButtonPressed]}
						>
							<Text style={styles.secondaryButtonText}>Cancelar</Text>
						</Pressable>
						<Pressable
							onPress={handleTrainerSubmit}
							style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
						>
							<Text style={styles.primaryButtonText}>
								{trainerFormMode === 'create' ? 'Guardar entrenador' : 'Guardar cambios'}
							</Text>
						</Pressable>
					</View>
				 </View>
				)}
				<View style={styles.card}>
					<Text style={styles.sectionTitle}>Listado</Text>
					{trainers.map((trainer) => {
						const active = selectedTrainerId === trainer.id;
						return (
							<Pressable
								key={trainer.id}
								onPress={() => setSelectedTrainerId(trainer.id)}
								style={({ pressed }) => [
									styles.trainerRow,
									active && styles.trainerRowActive,
									pressed && styles.trainerRowPressed,
								]}
							>
								<View>
									<Text style={styles.trainerName}>{trainer.name}</Text>
									<Text style={styles.trainerInfo}>{trainer.email}</Text>
								</View>
								<Ionicons
									name="chevron-forward"
									size={18}
									color={active ? '#4AD1A9' : '#66707A'}
								/>
							</Pressable>
						);
					})}
				</View>
				{selectedTrainer && (
					<View style={styles.detailCard}>
						<Text style={styles.sectionTitle}>{selectedTrainer.name}</Text>
						<Text style={styles.detailText}>Correo: {selectedTrainer.email}</Text>
						<Text style={styles.detailText}>Teléfono: {selectedTrainer.phone}</Text>
						<Text style={[styles.detailText, { marginTop: 16 }]}>Usuarios asignados</Text>
						{selectedTrainer.users.map((user) => (
							<View key={user.id} style={styles.detailUserRow}>
								<Ionicons name="person-outline" size={16} color="#4AD1A9" style={{ marginRight: 8 }} />
								<View>
									<Text style={styles.detailUserName}>{user.name}</Text>
									<Text style={styles.detailUserMeta}>Desde {user.since}</Text>
								</View>
							</View>
						))}
					</View>
				)}
			</ScrollView>
		</SafeAreaView>
	);
};

const AdminUsersScreen = () => {
	const [users] = useState<ManagedUser[]>(usersSeed);
	const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(usersSeed[0] ?? null);

	return (
		<SafeAreaView style={styles.screen}>
			<ScrollView contentContainerStyle={styles.scroll}>
				<Text style={styles.title}>Usuarios</Text>
				<Text style={styles.subtitle}>Gestiona usuarios y reasigna entrenadores de forma rápida.</Text>
				<View style={styles.actionsRow}>
					<Pressable style={({ pressed }) => [styles.actionButton, pressed && styles.actionButtonPressed]}>
						<Ionicons name="add-circle-outline" size={18} color="#4AD1A9" />
						<Text style={styles.actionButtonText}>Crear</Text>
					</Pressable>
					<Pressable style={({ pressed }) => [styles.actionButton, pressed && styles.actionButtonPressed]}>
						<Ionicons name="swap-horizontal-outline" size={18} color="#5DA3FF" />
						<Text style={styles.actionButtonText}>Cambiar entrenador</Text>
					</Pressable>
					<Pressable style={({ pressed }) => [styles.actionButton, pressed && styles.actionButtonPressed]}>
						<Ionicons name="trash-outline" size={18} color="#FF6B6B" />
						<Text style={styles.actionButtonText}>Eliminar</Text>
					</Pressable>
				</View>
				<View style={styles.card}>
					<Text style={styles.sectionTitle}>Listado</Text>
					{users.map((user) => {
						const active = selectedUser?.id === user.id;
						return (
							<Pressable
								key={user.id}
								onPress={() => setSelectedUser(user)}
								style={({ pressed }) => [
									styles.trainerRow,
									active && styles.trainerRowActive,
									pressed && styles.trainerRowPressed,
								]}
							>
								<View>
									<Text style={styles.trainerName}>{user.name}</Text>
									<Text style={styles.trainerInfo}>{user.goal}</Text>
								</View>
								<Text style={styles.assignedCoach}>{user.trainer}</Text>
							</Pressable>
						);
					})}
				</View>
				{selectedUser && (
					<View style={styles.detailCard}>
						<Text style={styles.sectionTitle}>{selectedUser.name}</Text>
						<Text style={styles.detailText}>Objetivo actual: {selectedUser.goal}</Text>
						<Text style={styles.detailText}>Entrenador asignado: {selectedUser.trainer}</Text>
						<Pressable
							onPress={() => {}}
							style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
						>
							<Text style={styles.primaryButtonText}>Actualizar información</Text>
						</Pressable>
					</View>
				)}
			</ScrollView>
		</SafeAreaView>
	);
};

const AdminTabs = () => (
	<Tab.Navigator
		screenOptions={{
			headerShown: false,
			tabBarStyle: {
				backgroundColor: '#0F1316',
				borderTopColor: 'rgba(255,255,255,0.03)',
				height: 68,
				paddingBottom: 12,
				paddingTop: 12,
			},
			tabBarActiveTintColor: '#4AD1A9',
			tabBarInactiveTintColor: '#66707A',
			tabBarLabelStyle: { fontSize: 12, fontWeight: '500' },
		}}
	>
		<Tab.Screen
			name="AdminProfile"
			component={AdminProfileScreen}
			options={{
				title: 'Perfil',
				tabBarIcon: ({ color, size }) => <Ionicons name="person-circle-outline" size={size} color={color} />,
			}}
		/>
		<Tab.Screen
			name="AdminTrainers"
			component={AdminTrainersScreen}
			options={{
				title: 'Entrenadores',
				tabBarIcon: ({ color, size }) => <Ionicons name="people-outline" size={size} color={color} />,
			}}
		/>
		<Tab.Screen
			name="AdminUsers"
			component={AdminUsersScreen}
			options={{
				title: 'Usuarios',
				tabBarIcon: ({ color, size }) => <Ionicons name="body-outline" size={size} color={color} />,
			}}
		/>
	</Tab.Navigator>
);

export const AdminStack = () => (
	<Stack.Navigator
		screenOptions={{
			headerStyle: { backgroundColor: '#0F1316' },
			headerTintColor: '#E6EEF3',
			headerTitleStyle: { fontWeight: '600' },
			headerShadowVisible: false,
			contentStyle: { backgroundColor: '#0B0F12' },
		}}
	>
		<Stack.Screen name="AdminTabs" component={AdminTabs} options={{ headerShown: false }} />
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
});
