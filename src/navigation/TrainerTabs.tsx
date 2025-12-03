import React, { useEffect, useMemo, useState } from 'react';
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

const Tab = createBottomTabNavigator();

type MealEntry = {
	id: string;
	description: string;
	calories: number;
	protein: number;
	carbs: number;
	fat: number;
};

type RoutineExercise = {
	id: string;
	name: string;
	prescription: string;
};

type RoutineDay = {
	id: string;
	title: string;
	focus: string;
	exercises: RoutineExercise[];
};

type RoutinePhase = {
	id: string;
	name: string;
	description: string;
	days: RoutineDay[];
};

type Client = {
	id: string;
	name: string;
	startDate: string;
	phases: RoutinePhase[];
	nutrition: {
		objective: Objective;
		targets: { calories: number; protein: number; carbs: number; fat: number };
		current: { calories: number; protein: number; carbs: number; fat: number };
		meals: MealEntry[];
	};
};

const clientsSeed: Client[] = [
	{
		id: 'client-1',
		name: 'Úrsula Usuario',
		startDate: '01/04/2024',
		phases: [
			{
				id: 'client-1-phase-1',
				name: 'Fase 1 · Fuerza base',
				description: 'Consolidación de patrones y control técnico.',
				days: [
					{
						id: 'client-1-phase-1-day-1',
						title: 'Día 1',
						focus: 'Piernas',
						exercises: [
							{ id: 'c1p1d1-ex1', name: 'Prensa', prescription: '4 x 4' },
							{ id: 'c1p1d1-ex2', name: 'Sentadilla con peso', prescription: '4 x 4' },
							{ id: 'c1p1d1-ex3', name: 'Peso muerto rumano', prescription: '3 x 8' },
						],
					},
					{
						id: 'client-1-phase-1-day-2',
						title: 'Día 2',
						focus: 'Pecho y tríceps',
						exercises: [
							{ id: 'c1p1d2-ex1', name: 'Press banca', prescription: '4 x 6' },
							{ id: 'c1p1d2-ex2', name: 'Fondos', prescription: '3 x 10' },
							{ id: 'c1p1d2-ex3', name: 'Press francés', prescription: '3 x 12' },
						],
					},
				],
			},
			{
				id: 'client-1-phase-2',
				name: 'Fase 2 · Hipertrofia',
				description: 'Aumento de volumen y estímulo metabólico.',
				days: [
					{
						id: 'client-1-phase-2-day-1',
						title: 'Día 3',
						focus: 'Espalda y bíceps',
						exercises: [
							{ id: 'c1p2d1-ex1', name: 'Dominadas', prescription: '4 x 8' },
							{ id: 'c1p2d1-ex2', name: 'Remo con barra', prescription: '4 x 10' },
							{ id: 'c1p2d1-ex3', name: 'Curl bíceps', prescription: '3 x 12' },
						],
					},
					{
						id: 'client-1-phase-2-day-2',
						title: 'Día 4',
						focus: 'Piernas',
						exercises: [
							{ id: 'c1p2d2-ex1', name: 'Prensa inclinada', prescription: '4 x 10' },
							{ id: 'c1p2d2-ex2', name: 'Desplantes caminando', prescription: '3 x 12' },
							{ id: 'c1p2d2-ex3', name: 'Curl femoral', prescription: '3 x 15' },
						],
					},
				],
			},
			{
				id: 'client-1-phase-3',
				name: 'Fase 3 · Potencia',
				description: 'Énfasis en velocidad y control del esfuerzo.',
				days: [
					{
						id: 'client-1-phase-3-day-1',
						title: 'Día 5',
						focus: 'Full body',
						exercises: [
							{ id: 'c1p3d1-ex1', name: 'Kettlebell swing', prescription: '4 x 12' },
							{ id: 'c1p3d1-ex2', name: 'Burpees', prescription: '3 x 10' },
							{ id: 'c1p3d1-ex3', name: 'Plancha', prescription: '3 x 45"' },
						],
					},
				],
			},
		],
		nutrition: {
			objective: 'ganancia muscular',
			targets: { calories: 2800, protein: 160, carbs: 320, fat: 75 },
			current: { calories: 1850, protein: 95, carbs: 170, fat: 42 },
			meals: [
				{
					id: 'c1-meal-1',
					description: 'Desayuno: omelette con avena',
					calories: 520,
					protein: 42,
					carbs: 46,
					fat: 18,
				},
				{
					id: 'c1-meal-2',
					description: 'Comida: pollo con arroz integral',
					calories: 680,
					protein: 58,
					carbs: 62,
					fat: 16,
				},
				{
					id: 'c1-meal-3',
					description: 'Snack: yogur griego y nueces',
					calories: 210,
					protein: 18,
					carbs: 12,
					fat: 9,
				},
			],
		},
	},
	{
		id: 'client-2',
		name: 'Diego Dinámico',
		startDate: '15/05/2024',
		phases: [
			{
				id: 'client-2-phase-1',
				name: 'Fase 1 · Definición',
				description: 'Control de cargas y ritmo cardiaco.',
				days: [
					{
						id: 'client-2-phase-1-day-1',
						title: 'Día 1',
						focus: 'Full body',
						exercises: [
							{ id: 'c2p1d1-ex1', name: 'Remo con mancuerna', prescription: '4 x 12' },
							{ id: 'c2p1d1-ex2', name: 'Press militar', prescription: '3 x 12' },
							{ id: 'c2p1d1-ex3', name: 'Zancadas', prescription: '3 x 14' },
						],
					},
					{
						id: 'client-2-phase-1-day-2',
						title: 'Día 2',
						focus: 'Cardio HIIT',
						exercises: [
							{ id: 'c2p1d2-ex1', name: 'Sprints 200m', prescription: '6 x 200m' },
							{ id: 'c2p1d2-ex2', name: 'Battle ropes', prescription: '4 x 40"' },
							{ id: 'c2p1d2-ex3', name: 'Bike erg', prescription: '3 x 5 min' },
						],
					},
				],
			},
			{
				id: 'client-2-phase-2',
				name: 'Fase 2 · Intensidad',
				description: 'Mayor densidad de trabajo y super series.',
				days: [
					{
						id: 'client-2-phase-2-day-1',
						title: 'Día 3',
						focus: 'Pecho y espalda',
						exercises: [
							{ id: 'c2p2d1-ex1', name: 'Press inclinado', prescription: '4 x 10' },
							{ id: 'c2p2d1-ex2', name: 'Dominadas asistidas', prescription: '4 x 8' },
							{ id: 'c2p2d1-ex3', name: 'Superserie fly + remo', prescription: '3 x 12' },
						],
					},
					{
						id: 'client-2-phase-2-day-2',
						title: 'Día 4',
						focus: 'Piernas y core',
						exercises: [
							{ id: 'c2p2d2-ex1', name: 'Sentadilla goblet', prescription: '4 x 12' },
							{ id: 'c2p2d2-ex2', name: 'Peso muerto rumano', prescription: '3 x 10' },
							{ id: 'c2p2d2-ex3', name: 'Mountain climbers', prescription: '3 x 40"' },
						],
					},
				],
			},
			{
				id: 'client-2-phase-3',
				name: 'Fase 3 · Mantenimiento',
				description: 'Consolidar resultados con cargas medias.',
				days: [
					{
						id: 'client-2-phase-3-day-1',
						title: 'Día 5',
						focus: 'Full body ligero',
						exercises: [
							{ id: 'c2p3d1-ex1', name: 'Press con mancuernas', prescription: '3 x 15' },
							{ id: 'c2p3d1-ex2', name: 'Remo TRX', prescription: '3 x 15' },
							{ id: 'c2p3d1-ex3', name: 'Plancha lateral', prescription: '3 x 40"' },
						],
					},
				],
			},
		],
		nutrition: {
			objective: 'definición muscular',
			targets: { calories: 2200, protein: 180, carbs: 220, fat: 65 },
			current: { calories: 1350, protein: 92, carbs: 110, fat: 38 },
			meals: [
				{
					id: 'c2-meal-1',
					description: 'Desayuno: bowl de claras con espinacas',
					calories: 320,
					protein: 34,
					carbs: 18,
					fat: 9,
				},
				{
					id: 'c2-meal-2',
					description: 'Comida: salmón con quinoa',
					calories: 540,
					protein: 46,
					carbs: 42,
					fat: 18,
				},
				{
					id: 'c2-meal-3',
					description: 'Cena: ensalada proteica',
					calories: 310,
					protein: 28,
					carbs: 20,
					fat: 12,
				},
			],
		},
	},
];

type MacroKey = keyof Client['nutrition']['targets'];

const objectiveOptions: Objective[] = ['ganancia muscular', 'definición muscular'];
const macroKeys: MacroKey[] = ['calories', 'protein', 'carbs', 'fat'];
const macroLabels: Record<MacroKey, string> = {
	calories: 'Calorías',
	protein: 'Proteínas',
	carbs: 'Carbohidratos',
	fat: 'Grasas',
};
const macroColors: Record<MacroKey, string> = {
	calories: '#5DA3FF',
	protein: '#4AD1A9',
	carbs: '#5DA3FF',
	fat: '#FFB86B',
};

const TrainerProfileScreen = () => {
	const { logout } = useAuth();
	const [profile, setProfile] = useState({
		name: 'Carlos Coach',
		email: 'carlos@fitlife.app',
		password: '',
		birthdate: '1989-06-11',
		about: 'Especialista en fuerza y acondicionamiento desde 2012.',
	});

	const updateProfile = (key: keyof typeof profile, value: string) =>
		setProfile((prev) => ({ ...prev, [key]: value }));

	return (
		<SafeAreaView style={styles.screen}>
			<ScrollView contentContainerStyle={styles.scroll}>
				<Text style={styles.title}>Perfil</Text>
				<Text style={styles.subtitle}>Comparte tu información con los usuarios bajo tu guía.</Text>
				<View style={styles.card}>
					<Text style={styles.label}>Nombre completo</Text>
					<TextInput
						style={styles.input}
						value={profile.name}
						onChangeText={(text) => updateProfile('name', text)}
						placeholderTextColor="#5D6770"
					/>
					<Text style={styles.label}>Correo electrónico</Text>
					<TextInput
						style={styles.input}
						value={profile.email}
						autoCapitalize="none"
						keyboardType="email-address"
						onChangeText={(text) => updateProfile('email', text)}
						placeholderTextColor="#5D6770"
					/>
					<Text style={styles.label}>Contraseña</Text>
					<TextInput
						style={styles.input}
						value={profile.password}
						onChangeText={(text) => updateProfile('password', text)}
						secureTextEntry
						placeholder="••••••••"
						placeholderTextColor="#5D6770"
					/>
					<Text style={styles.label}>Fecha de nacimiento</Text>
					<TextInput
						style={styles.input}
						value={profile.birthdate}
						onChangeText={(text) => updateProfile('birthdate', text)}
						placeholder="AAAA-MM-DD"
						placeholderTextColor="#5D6770"
					/>
					<Text style={styles.label}>Descripción</Text>
					<TextInput
						style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
						multiline
						value={profile.about}
						onChangeText={(text) => updateProfile('about', text)}
						placeholderTextColor="#5D6770"
					/>
					<Pressable
						onPress={() => {}}
						style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
					>
						<Text style={styles.primaryButtonText}>Guardar perfil</Text>
					</Pressable>
					<Pressable
						onPress={logout}
						style={({ pressed }) => [styles.logoutButton, pressed && styles.logoutButtonPressed]}
					>
						<Text style={styles.logoutButtonText}>Cerrar sesión</Text>
					</Pressable>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const TrainerUsersScreen = () => {
	const [clients, setClients] = useState<Client[]>(clientsSeed);
	const [selectedClientId, setSelectedClientId] = useState<string>(clientsSeed[0]?.id ?? '');
	const selectedClient = useMemo(
		() => clients.find((client) => client.id === selectedClientId) ?? null,
		[clients, selectedClientId],
	);
	const [routineDraft, setRoutineDraft] = useState<RoutinePhase[]>(selectedClient?.phases ?? []);
	const [nutritionDraft, setNutritionDraft] = useState<{
		objective: Objective;
		targets: Record<MacroKey, string>;
	}>({
		objective: selectedClient?.nutrition.objective ?? 'ganancia muscular',
		targets: {
			calories: selectedClient ? String(selectedClient.nutrition.targets.calories) : '0',
			protein: selectedClient ? String(selectedClient.nutrition.targets.protein) : '0',
			carbs: selectedClient ? String(selectedClient.nutrition.targets.carbs) : '0',
			fat: selectedClient ? String(selectedClient.nutrition.targets.fat) : '0',
		},
	});
	const [feedback, setFeedback] = useState<{ routine?: string; nutrition?: string }>({});

	useEffect(() => {
		if (selectedClient) {
			setRoutineDraft(JSON.parse(JSON.stringify(selectedClient.phases)));
			setNutritionDraft({
				objective: selectedClient.nutrition.objective,
				targets: {
					calories: String(selectedClient.nutrition.targets.calories),
					protein: String(selectedClient.nutrition.targets.protein),
					carbs: String(selectedClient.nutrition.targets.carbs),
					fat: String(selectedClient.nutrition.targets.fat),
				},
			});
			setFeedback({});
		}
	}, [selectedClient]);

	if (!selectedClient) {
		return null;
	}

	const updateExercise = (
		phaseId: string,
		dayId: string,
		exerciseId: string,
		field: 'name' | 'prescription',
		value: string,
	) => {
		setRoutineDraft((prev) =>
			prev.map((phase) =>
				phase.id === phaseId
					? {
							...phase,
							days: phase.days.map((day) =>
								day.id === dayId
									? {
											...day,
											exercises: day.exercises.map((exercise) =>
												exercise.id === exerciseId ? { ...exercise, [field]: value } : exercise,
											),
									  }
									: day,
							),
					  }
					: phase,
			),
		);
	};

	const handleSaveRoutine = () => {
		setClients((prev) =>
			prev.map((client) =>
				client.id === selectedClientId ? { ...client, phases: routineDraft } : client,
			),
		);
		setFeedback((prev) => ({ ...prev, routine: 'Rutina actualizada.' }));
	};

	const handleTargetChange = (key: MacroKey, value: string) => {
		const sanitized = value.replace(/[^0-9.]/g, '');
		setNutritionDraft((prev) => ({
			...prev,
			targets: { ...prev.targets, [key]: sanitized },
		}));
	};

	const handleSaveNutrition = () => {
		const parsedTargets = macroKeys.reduce(
			(acc, key) => ({ ...acc, [key]: Number(nutritionDraft.targets[key]) || 0 }),
			{} as Record<MacroKey, number>,
		);
		setClients((prev) =>
			prev.map((client) =>
				client.id === selectedClientId
					? {
							...client,
							nutrition: {
								...client.nutrition,
								objective: nutritionDraft.objective,
								targets: parsedTargets,
							},
					  }
					: client,
			),
		);
		setFeedback((prev) => ({ ...prev, nutrition: 'Metas nutricionales actualizadas.' }));
	};

	return (
		<SafeAreaView style={styles.screen}>
			<ScrollView contentContainerStyle={styles.scroll}>
				<Text style={styles.title}>Usuarios</Text>
				<Text style={styles.subtitle}>Selecciona un usuario para personalizar su plan.</Text>
				<View style={styles.userListCard}>
					<Text style={styles.sectionTitle}>Usuarios asignados</Text>
					{clients.map((client) => {
						const isActive = client.id === selectedClientId;
						return (
							<Pressable
								key={client.id}
								onPress={() => setSelectedClientId(client.id)}
								style={({ pressed }) => [
									styles.userRow,
									isActive && styles.userRowActive,
									pressed && styles.userRowPressed,
								]}
							>
								<View>
									<Text style={styles.userName}>{client.name}</Text>
									<Text style={styles.userMeta}>Inicio: {client.startDate}</Text>
								</View>
								<Ionicons
									name={isActive ? 'chevron-down' : 'chevron-forward'}
									size={18}
									color={isActive ? '#4AD1A9' : '#66707A'}
								/>
							</Pressable>
						);
					})}
				</View>

				<View style={styles.detailCard}>
					<View style={styles.userHeader}>
						<Text style={styles.detailName}>{selectedClient.name}</Text>
						<Text style={styles.detailMeta}>Inicio de programa: {selectedClient.startDate}</Text>
					</View>

					<View style={styles.detailSection}>
						<Text style={styles.sectionSubtitle}>Rutina por fases</Text>
						{routineDraft.map((phase) => (
							<View key={phase.id} style={styles.phaseCard}>
								<Text style={styles.phaseTitle}>{phase.name}</Text>
								<Text style={styles.phaseMeta}>{phase.description}</Text>
								{phase.days.map((day) => (
									<View key={day.id} style={styles.daySection}>
										<Text style={styles.dayTitle}>
											{day.title} · {day.focus}
										</Text>
										{day.exercises.map((exercise) => (
											<View key={exercise.id} style={styles.exerciseEditor}>
												<TextInput
													style={styles.exerciseNameInput}
													value={exercise.name}
													onChangeText={(value) =>
														updateExercise(phase.id, day.id, exercise.id, 'name', value)
													}
													placeholder="Nombre del ejercicio"
													placeholderTextColor="#5D6770"
												/>
												<TextInput
													style={styles.exercisePrescriptionInput}
													value={exercise.prescription}
													onChangeText={(value) =>
														updateExercise(phase.id, day.id, exercise.id, 'prescription', value)
													}
													placeholder="4 x 4"
													placeholderTextColor="#5D6770"
												/>
											</View>
										))}
									</View>
								))}
								{feedback.routine && <Text style={styles.feedbackText}>{feedback.routine}</Text>}
								<Pressable
									onPress={handleSaveRoutine}
									style={({ pressed }) => [styles.secondaryButton, pressed && styles.secondaryButtonPressed]}
								>
									<Text style={styles.secondaryButtonText}>Guardar rutina</Text>
								</Pressable>
							</View>
						))}
					</View>

					<View style={styles.detailSection}>
						<Text style={styles.sectionSubtitle}>Nutrición diaria</Text>
						<View style={styles.chipRow}>
							{objectiveOptions.map((option) => {
								const active = nutritionDraft.objective === option;
								return (
									<Pressable
										key={option}
										onPress={() =>
											setNutritionDraft((prev) => ({ ...prev, objective: option }))
										}
										style={({ pressed }) => [
											styles.chip,
											active && styles.chipActive,
											pressed && styles.chipPressed,
										]}
									>
										<Text
											style={[
												styles.chipLabel,
												active && styles.chipLabelActive,
											]}
										>
											{option}
										</Text>
									</Pressable>
								);
							})}
						</View>
						{macroKeys.map((macro) => {
							const targetValue = Number(nutritionDraft.targets[macro]) || 0;
							const currentValue = selectedClient.nutrition.current[macro];
							const percentage =
								targetValue > 0 ? Math.min((currentValue / targetValue) * 100, 100) : 0;
							return (
							 <View key={macro} style={styles.progressContainer}>
									<View style={styles.progressHeader}>
										<Text style={styles.progressLabel}>{macroLabels[macro]}</Text>
										<Text style={styles.progressValue}>
											{currentValue} / {targetValue || 0}
										</Text>
									</View>
									<View style={styles.progressTrack}>
										<View
											style={[
												styles.progressFill,
												{ width: `${percentage}%`, backgroundColor: macroColors[macro] },
											]}
										/>
									</View>
									<View style={styles.macroEditorRow}>
										<Text style={styles.macroLabel}>Meta diaria</Text>
										<TextInput
											style={styles.macroInput}
											keyboardType="numeric"
											value={nutritionDraft.targets[macro]}
											onChangeText={(value) => handleTargetChange(macro, value)}
											placeholder="0"
											placeholderTextColor="#5D6770"
										/>
									</View>
								</View>
							);
						})}
						{feedback.nutrition && <Text style={styles.feedbackText}>{feedback.nutrition}</Text>}
						<Pressable
							onPress={handleSaveNutrition}
							style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
						>
							<Text style={styles.primaryButtonText}>Actualizar nutrición</Text>
						</Pressable>
					</View>

					<View style={styles.detailSection}>
						<Text style={styles.sectionSubtitle}>Comidas registradas</Text>
						{selectedClient.nutrition.meals.map((meal) => (
							<View key={meal.id} style={styles.mealRow}>
								<Text style={styles.mealDesc}>{meal.description}</Text>
								<Text style={styles.mealMacros}>
									{meal.calories} kcal • P {meal.protein} g • C {meal.carbs} g • G {meal.fat} g
								</Text>
							</View>
						))}
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export const TrainerTabs = () => (
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
			name="TrainerProfile"
			component={TrainerProfileScreen}
			options={{
				title: 'Perfil',
				tabBarIcon: ({ color, size }) => <Ionicons name="person-circle-outline" size={size} color={color} />,
			}}
		/>
		<Tab.Screen
			name="TrainerClients"
			component={TrainerUsersScreen}
			options={{
				title: 'Usuarios',
				tabBarIcon: ({ color, size }) => <Ionicons name="people-outline" size={size} color={color} />,
			}}
		/>
	</Tab.Navigator>
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
		backgroundColor: '#4AD1A9',
		borderRadius: 14,
		paddingVertical: 14,
		alignItems: 'center',
		marginTop: 12,
		shadowColor: '#000',
		shadowOpacity: 0.2,
		shadowRadius: 8,
		shadowOffset: { height: 4, width: 0 },
		elevation: 5,
	},
	primaryButtonPressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
	primaryButtonText: { color: '#061012', fontSize: 15, fontWeight: '700' },
	secondaryButton: {
		backgroundColor: '#0F1316',
		borderRadius: 14,
		paddingVertical: 14,
		alignItems: 'center',
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.06)',
		marginTop: 12,
	},
	secondaryButtonPressed: { opacity: 0.85 },
	secondaryButtonText: { color: '#A6B1B8', fontSize: 15, fontWeight: '600' },
	userListCard: {
		backgroundColor: '#161A1D',
		borderRadius: 18,
		padding: 20,
		marginBottom: 24,
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.03)',
	},
	userRow: {
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
	userRowActive: { borderColor: '#4AD1A9' },
	userRowPressed: { opacity: 0.85 },
	userName: { color: '#E6EEF3', fontSize: 15, fontWeight: '600' },
	userMeta: { color: '#A6B1B8', fontSize: 12, marginTop: 4 },
	detailCard: {
		backgroundColor: '#161A1D',
		borderRadius: 18,
		padding: 20,
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.03)',
	},
	userHeader: { marginBottom: 24 },
	detailName: { color: '#E6EEF3', fontSize: 20, fontWeight: '700' },
	detailMeta: { color: '#5DA3FF', fontSize: 13, marginTop: 6 },
	detailSection: { marginBottom: 24 },
	sectionSubtitle: { color: '#E6EEF3', fontSize: 16, fontWeight: '600', marginBottom: 16 },
	phaseCard: {
		backgroundColor: '#0F1316',
		borderRadius: 16,
		padding: 16,
		marginBottom: 16,
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.04)',
	},
	phaseTitle: { color: '#E6EEF3', fontSize: 15, fontWeight: '600' },
	phaseMeta: { color: '#A6B1B8', fontSize: 13, marginTop: 6, marginBottom: 12 },
	daySection: { marginBottom: 12 },
	dayTitle: { color: '#A6B1B8', fontSize: 13, fontWeight: '600', marginBottom: 8 },
	exerciseEditor: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
	exerciseNameInput: {
		flex: 1,
		backgroundColor: '#161A1D',
		borderRadius: 12,
		paddingHorizontal: 12,
		paddingVertical: 10,
		color: '#E6EEF3',
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.04)',
	},
	exercisePrescriptionInput: {
		width: 80,
		backgroundColor: '#161A1D',
		borderRadius: 12,
		paddingVertical: 10,
		color: '#E6EEF3',
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.04)',
		textAlign: 'center',
	},
	chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
	chip: {
		paddingVertical: 8,
		paddingHorizontal: 14,
		borderRadius: 16,
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.06)',
		backgroundColor: '#0F1316',
	},
	chipActive: { backgroundColor: '#4AD1A9', borderColor: '#4AD1A9' },
	chipPressed: { opacity: 0.85 },
	chipLabel: { color: '#A6B1B8', fontSize: 12, fontWeight: '500' },
	chipLabelActive: { color: '#061012', fontWeight: '600' },
	progressContainer: { marginBottom: 18 },
	progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
	progressLabel: { color: '#A6B1B8', fontSize: 13, fontWeight: '500' },
	progressValue: { color: '#E6EEF3', fontSize: 13, fontWeight: '600' },
	progressTrack: {
		height: 8,
		borderRadius: 8,
		backgroundColor: 'rgba(255,255,255,0.04)',
		overflow: 'hidden',
		marginBottom: 10,
	},
	progressFill: { height: '100%', borderRadius: 8 },
	macroEditorRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
	macroLabel: { color: '#A6B1B8', fontSize: 12 },
	macroInput: {
		width: 96,
		backgroundColor: '#0F1316',
		borderRadius: 12,
		paddingHorizontal: 12,
		paddingVertical: 10,
		color: '#E6EEF3',
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.04)',
		textAlign: 'center',
	},
	mealRow: {
		backgroundColor: '#0F1316',
		borderRadius: 14,
		padding: 16,
		marginBottom: 12,
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.04)',
	},
	mealDesc: { color: '#E6EEF3', fontSize: 14, fontWeight: '600' },
	mealMacros: { color: '#A6B1B8', fontSize: 12, marginTop: 4 },
	feedbackText: { color: '#5DA3FF', fontSize: 12, marginTop: 8 },
	logoutButton: {
		backgroundColor: '#FF6B6B',
		borderRadius: 14,
		paddingVertical: 14,
		alignItems: 'center',
		marginTop: 12,
	},
	logoutButtonPressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
	logoutButtonText: { color: '#061012', fontSize: 15, fontWeight: '700' },
});
