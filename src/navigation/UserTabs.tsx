import React, { useRef, useState } from 'react';
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
	GestureResponderEvent,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

const Tab = createBottomTabNavigator();

type Objective = 'ganancia muscular' | 'definición muscular';
type TrainingExercise = { id: string; name: string; prescription: string };
type TrainingExerciseGroup = { id: string; name: string; exercises: TrainingExercise[] };
type TrainingDay = { id: string; title: string; focus: string; exercises?: TrainingExercise[]; groups?: TrainingExerciseGroup[] };
type Reminder = { id: string; icon: string; title: string; body: string };

const fallbackProgramDays: TrainingDay[] = [
	{
		id: 'day-1',
		title: 'Día 1',
		focus: 'Piernas',
		groups: [
			{
				id: 'group-1',
				name: 'Compuestos',
				exercises: [
					{ id: 'ex-1', name: 'Prensa', prescription: '4 x 4' },
					{ id: 'ex-2', name: 'Sentadillas con peso', prescription: '4 x 4' },
				],
			},
			{
				id: 'group-2',
				name: 'Aislamiento',
				exercises: [{ id: 'ex-3', name: 'Peso muerto rumano', prescription: '3 x 8' }],
			},
		],
	},
	{
		id: 'day-2',
		title: 'Día 2',
		focus: 'Pecho y tríceps',
		groups: [
			{
				id: 'group-3',
				name: 'Pecho',
				exercises: [
					{ id: 'ex-4', name: 'Press banca', prescription: '4 x 6' },
					{ id: 'ex-5', name: 'Fondos', prescription: '3 x 10' },
				],
			},
			{
				id: 'group-4',
				name: 'Tríceps',
				exercises: [{ id: 'ex-6', name: 'Press francés', prescription: '3 x 12' }],
			},
		],
	},
];

const reminders: Reminder[] = [
	{ id: 'rem-1', icon: 'water-outline', title: 'Hidratación', body: 'Bebe un vaso de agua cada 2 horas.' },
	{ id: 'rem-2', icon: 'walk-outline', title: 'Entrenamiento', body: 'Sesión programada para las 18:00.' },
	{ id: 'rem-3', icon: 'nutrition-outline', title: 'Comida pre-entreno', body: 'Consume carbohidratos ligeros 45 minutos antes.' },
	{ id: 'rem-4', icon: 'moon-outline', title: 'Hora de dormir', body: 'Desconéctate 30 minutos antes para mejorar el descanso.' },
];

const objectiveChips: Objective[] = ['ganancia muscular', 'definición muscular'];

const formatTime = (seconds: number) => {
	const mm = Math.floor(seconds / 60)
		.toString()
		.padStart(2, '0');
	const ss = (seconds % 60).toString().padStart(2, '0');
	return `${mm}:${ss}`;
};

const UserExercisesScreen = () => {
	const { user } = useAuth() as AuthWithOptionalUpdate;
	const [completed, setCompleted] = useState<Record<string, boolean>>({});
	const assignedProgram = React.useMemo<TrainingDay[]>(() => {
		const trainerPlan = user?.programDays;
		return trainerPlan && trainerPlan.length ? trainerPlan : fallbackProgramDays;
	}, [user?.programDays]);

	React.useEffect(() => setCompleted({}), [assignedProgram]);

	const toggleExercise = (id: string) =>
		setCompleted((prev) => ({ ...prev, [id]: !prev[id] }));

	return (
		<SafeAreaView style={styles.screen}>
			<ScrollView contentContainerStyle={styles.scroll}>
				<Text style={styles.title}>Ejercicios</Text>
				<Text style={styles.subtitle}>Revisa tu plan por día y marca los ejercicios completados.</Text>
				{assignedProgram.map((day) => {
					const groupedExercisesCount =
						day.groups?.reduce((count, group) => count + group.exercises.length, 0) ?? 0;
					const totalExercises = groupedExercisesCount + (day.exercises?.length ?? 0);
					return (
						<View key={day.id} style={styles.dayCard}>
							<View style={styles.dayHeader}>
								<View>
									<Text style={styles.dayTitle}>{day.title}</Text>
									<Text style={styles.dayMeta}>{`${totalExercises} ejercicios`}</Text>
								</View>
								<View style={styles.dayFocusPill}>
									<Ionicons name="flash-outline" size={14} color="#4AD1A9" style={styles.dayFocusIcon} />
									<Text style={styles.dayFocus}>{day.focus}</Text>
								</View>
							</View>
							{day.groups?.map((group) => (
								<View key={group.id} style={styles.exerciseGroup}>
									<Text style={styles.exerciseGroupTitle}>{group.name}</Text>
									{group.exercises.map((exercise) => {
										const done = completed[exercise.id];
										return (
											<Pressable
												key={exercise.id}
												style={({ pressed }) => [
													styles.exerciseRow,
													done && styles.exerciseRowDone,
													pressed && styles.exerciseRowPressed,
												]}
												onPress={() => toggleExercise(exercise.id)}
											>
												<View>
													<Text style={styles.exerciseName}>{exercise.name}</Text>
													<Text style={styles.exercisePrescription}>{exercise.prescription}</Text>
												</View>
												<Ionicons
													name={done ? 'checkmark-circle' : 'ellipse-outline'}
													size={22}
													color={done ? '#4AD1A9' : '#5D6770'}
												/>
											</Pressable>
										);
									})}
								</View>
							))}
							{day.exercises?.map((exercise) => {
								const done = completed[exercise.id];
								return (
									<Pressable
										key={exercise.id}
										style={({ pressed }) => [
											styles.exerciseRow,
											done && styles.exerciseRowDone,
											pressed && styles.exerciseRowPressed,
										]}
										onPress={() => toggleExercise(exercise.id)}
									>
										<View>
											<Text style={styles.exerciseName}>{exercise.name}</Text>
											<Text style={styles.exercisePrescription}>{exercise.prescription}</Text>
										</View>
										<Ionicons
											name={done ? 'checkmark-circle' : 'ellipse-outline'}
											size={22}
											color={done ? '#4AD1A9' : '#5D6770'}
										/>
									</Pressable>
								);
							})}
						</View>
					);
				})}
			</ScrollView>
		</SafeAreaView>
	);
};

const UserNutritionScreen = () => {
	const selectedObjective: Objective = 'ganancia muscular';
	const [nutritionProgress, setNutritionProgress] = useState({
		calories: { target: 2800, current: 1850 },
		protein: { target: 160, current: 95 },
		carbs: { target: 320, current: 170 },
		fat: { target: 75, current: 42 },
	});
	const [showMealForm, setShowMealForm] = useState(false);
	const [mealForm, setMealForm] = useState({
		description: '',
		calories: '',
		protein: '',
		carbs: '',
		fat: '',
	});
	const [feedback, setFeedback] = useState<string | null>(null);

	const updateField = (key: keyof typeof mealForm, value: string) =>
		setMealForm((prev) => ({ ...prev, [key]: value }));

	const handleAddMeal = () => {
		const values = {
			calories: Number(mealForm.calories) || 0,
			protein: Number(mealForm.protein) || 0,
			carbs: Number(mealForm.carbs) || 0,
			fat: Number(mealForm.fat) || 0,
		};
		if (!mealForm.description.trim()) {
			setFeedback('Describe la comida para registrarla.');
			return;
		}
		setNutritionProgress((prev) => ({
			calories: {
				target: prev.calories.target,
				current: Math.min(prev.calories.current + values.calories, prev.calories.target),
			},
			protein: {
				target: prev.protein.target,
				current: Math.min(prev.protein.current + values.protein, prev.protein.target),
			},
			carbs: {
				target: prev.carbs.target,
				current: Math.min(prev.carbs.current + values.carbs, prev.carbs.target),
			},
			fat: {
				target: prev.fat.target,
				current: Math.min(prev.fat.current + values.fat, prev.fat.target),
			},
		}));
		setMealForm({ description: '', calories: '', protein: '', carbs: '', fat: '' });
		setShowMealForm(false);
		setFeedback('Comida registrada correctamente.');
	};

	return (
		<SafeAreaView style={styles.screen}>
			<ScrollView contentContainerStyle={styles.scroll}>
				<Text style={styles.title}>Nutrición</Text>
				<Text style={styles.subtitle}>
					Selecciona tu objetivo y monitorea tus macros diarios.
				</Text>
				<View style={styles.objectiveRow}>
					{objectiveChips.map((objective) => (
						<View
							key={objective}
							style={[
								styles.chip,
								objective === selectedObjective && styles.chipActive,
								styles.chipLocked,
							]}
						>
							<Text
								style={[
									styles.chipLabel,
									objective === selectedObjective && styles.chipLabelActive,
								]}
							>
								{objective === selectedObjective ? `${objective} (asignado)` : objective}
							</Text>
						</View>
					))}
				</View>
				<Text style={styles.objectiveHint}>Objetivo definido por tu entrenador.</Text>
				<View style={styles.progressCard}>
					<Text style={styles.progressTitle}>Macros diarios</Text>
					{Object.entries(nutritionProgress).map(([key, value]) => {
						const labelMap: Record<string, string> = {
							calories: 'Calorías',
							protein: 'Proteínas',
							carbs: 'Carbohidratos',
							fat: 'Grasas',
						};
						const barColorMap: Record<string, string> = {
							calories: '#5DA3FF',
							protein: '#4AD1A9',
							carbs: '#5DA3FF',
							fat: '#FFB86B',
						};
						const percentage = Math.min((value.current / value.target) * 100, 100);
						return (
							<View key={key} style={styles.progressRow}>
								<View style={styles.progressHeader}>
									<Text style={styles.progressLabel}>{labelMap[key]}</Text>
									<Text style={styles.progressValue}>
										{value.current} / {value.target}
									</Text>
								</View>
								<View style={styles.progressTrack}>
									<View
										style={[
											styles.progressFill,
											{ width: `${percentage}%`, backgroundColor: barColorMap[key] },
										]}
									/>
								</View>
							</View>
						);
					})}
				</View>
				{feedback && <Text style={styles.feedback}>{feedback}</Text>}
				<Pressable
					onPress={() => setShowMealForm((prev) => !prev)}
					style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
				>
					<Text style={styles.primaryButtonText}>
						{showMealForm ? 'Cancelar registro' : 'Agregar comida'}
					</Text>
				</Pressable>
				{showMealForm && (
					<View style={styles.formCard}>
						<Text style={styles.formTitle}>Nueva comida</Text>
						<TextInput
							style={styles.input}
							placeholder="Descripción breve"
							placeholderTextColor="#5D6770"
							value={mealForm.description}
							onChangeText={(text) => updateField('description', text)}
						/>
						<View style={styles.macroRow}>
							<TextInput
								style={styles.inputHalf}
								keyboardType="numeric"
								placeholder="Calorías"
								placeholderTextColor="#5D6770"
								value={mealForm.calories}
								onChangeText={(text) => updateField('calories', text)}
							/>
							<TextInput
								style={styles.inputHalf}
								keyboardType="numeric"
								placeholder="Proteínas"
								placeholderTextColor="#5D6770"
								value={mealForm.protein}
								onChangeText={(text) => updateField('protein', text)}
							/>
						</View>
						<View style={styles.macroRow}>
							<TextInput
								style={styles.inputHalf}
								keyboardType="numeric"
								placeholder="Carbohidratos"
								placeholderTextColor="#5D6770"
								value={mealForm.carbs}
								onChangeText={(text) => updateField('carbs', text)}
							/>
							<TextInput
								style={styles.inputHalf}
								keyboardType="numeric"
								placeholder="Grasas"
								placeholderTextColor="#5D6770"
								value={mealForm.fat}
								onChangeText={(text) => updateField('fat', text)}
							/>
						</View>
						<Pressable
							onPress={handleAddMeal}
							style={({ pressed }) => [styles.secondaryButton, pressed && styles.secondaryButtonPressed]}
						>
							<Text style={styles.secondaryButtonText}>Guardar comida</Text>
						</Pressable>
					</View>
				)}
			</ScrollView>
		</SafeAreaView>
	);
};

const UserTimerScreen = () => {
	const quickTimers = [30, 60, 90, 120];
	const [seconds, setSeconds] = useState(0);
	const [isRunning, setIsRunning] = useState(false);
	const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
	const [customMinutes, setCustomMinutes] = useState('');
	const [customSecondsInput, setCustomSecondsInput] = useState('');
	const [customError, setCustomError] = useState<string | null>(null);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const clearTimer = () => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
	};

	const startTimer = (duration?: number, options?: { trackSelection?: boolean }) => {
		const trackSelection = options?.trackSelection ?? true;
		const initialDuration = typeof duration === 'number' ? duration : seconds || selectedDuration || 60;
		setSeconds(initialDuration);
		setSelectedDuration(trackSelection ? (typeof duration === 'number' ? duration : initialDuration) : null);
		setCustomError(null);
		clearTimer();
		setIsRunning(true);
		intervalRef.current = setInterval(() => {
			setSeconds((prev) => {
				if (prev <= 1) {
					clearTimer();
					setIsRunning(false);
					setSelectedDuration(null);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);
	};

	const startCustomTimer = () => {
		const minutes = parseInt(customMinutes, 10) || 0;
		const secs = parseInt(customSecondsInput, 10) || 0;
		const totalSeconds = minutes * 60 + secs;
		if (totalSeconds <= 0) {
			setCustomError('Ingresa un tiempo válido.');
			return;
		}
		startTimer(totalSeconds, { trackSelection: false });
	};

	const pauseTimer = () => {
		clearTimer();
		setIsRunning(false);
	};

	const resetTimer = () => {
		clearTimer();
		setSeconds(0);
		setIsRunning(false);
		setSelectedDuration(null);
		setCustomError(null);
	};

	return (
		<SafeAreaView style={styles.screen}>
			<View style={[styles.scroll, { flex: 1, justifyContent: 'center' }]}>
				<Text style={styles.title}>Tiempos</Text>
				<Text style={styles.subtitle}>Selecciona un tiempo rápido o controla el cronómetro.</Text>
				<View style={styles.timerDisplay}>
					<Text style={styles.timerValue}>{formatTime(seconds)}</Text>
				</View>
				<View style={styles.customTimerCard}>
					<Text style={styles.customTimerLabel}>Tiempo personalizado</Text>
					<View style={styles.customTimerInputs}>
						<TextInput
							style={styles.customTimerInput}
							keyboardType="numeric"
							value={customMinutes}
							onChangeText={setCustomMinutes}
							placeholder="Min"
							placeholderTextColor="#5D6770"
						/>
						<Text style={styles.customTimerSeparator}>:</Text>
						<TextInput
							style={styles.customTimerInput}
							keyboardType="numeric"
							value={customSecondsInput}
							onChangeText={setCustomSecondsInput}
							placeholder="Seg"
							placeholderTextColor="#5D6770"
						/>
						<Pressable
							onPress={startCustomTimer}
							style={({ pressed }) => [styles.customTimerButton, pressed && styles.customTimerButtonPressed]}
						>
							<Text style={styles.customTimerButtonText}>Usar</Text>
						</Pressable>
					</View>
					{customError && <Text style={styles.customTimerError}>{customError}</Text>}
				</View>
				<View style={styles.quickRow}>
					{quickTimers.map((time) => {
						const isActive = selectedDuration === time;
						return (
							<Pressable
								key={time}
								onPress={() => startTimer(time)}
								style={({ pressed }) => [
									styles.quickButton,
									isActive && styles.quickButtonActive,
									pressed && styles.quickButtonPressed,
								]}
							>
								<View style={styles.quickButtonContent}>
									<Ionicons
										name="stopwatch-outline"
										size={18}
										color={isActive ? '#4AD1A9' : '#E6EEF3'}
										style={styles.quickButtonIcon}
									/>
									<Text style={[styles.quickButtonText, isActive && styles.quickButtonTextActive]}>
										{time >= 60 ? `${Math.floor(time / 60)}:${(time % 60).toString().padStart(2, '0')} min` : `${time} seg`}
									</Text>
								</View>
							</Pressable>
						);
					})}
				</View>
				<View style={styles.timerActions}>
					<Pressable
						onPress={() => startTimer()}
						style={({ pressed }) => [styles.timerActionPrimary, pressed && styles.timerActionPressed]}
					>
						<Ionicons
							name={isRunning ? 'refresh-outline' : 'play-circle-outline'}
							size={20}
							color="#061012"
							style={styles.timerActionIcon}
						/>
						<Text style={styles.timerActionTextPrimary}>{isRunning ? 'Reiniciar' : 'Iniciar'}</Text>
					</Pressable>
					<Pressable
						onPress={pauseTimer}
						style={({ pressed }) => [styles.timerActionSecondary, pressed && styles.timerActionPressed]}
					>
						<Ionicons
							name="pause-circle-outline"
							size={20}
							color="#5DA3FF"
							style={styles.timerActionIcon}
						/>
						<Text style={styles.timerActionTextSecondary}>Pausar</Text>
					</Pressable>
					<Pressable
						onPress={resetTimer}
						style={({ pressed }) => [styles.timerActionGhost, pressed && styles.timerActionPressed]}
					>
						<Ionicons
							name="stop-circle-outline"
							size={20}
							color="#A6B1B8"
							style={styles.timerActionIcon}
						/>
						<Text style={styles.timerActionTextGhost}>Reset</Text>
					</Pressable>
				</View>
			</View>
		</SafeAreaView>
	);
};

type UpdateProfileFn = (payload: { fullName: string; email: string; birthdate: string; password?: string }) => void;
type WithUserFields = {
	email?: string;
	birthdate?: string;
	fullName?: string;
	username?: string;
	programDays?: TrainingDay[];
};
type AuthReturn = ReturnType<typeof useAuth>;
type AuthWithOptionalUpdate = Omit<AuthReturn, 'user'> & {
	user: AuthReturn['user'] extends null ? null : AuthReturn['user'] & WithUserFields;
	updateProfile?: UpdateProfileFn;
	logout?: () => void;
};

const UserProfileScreen = () => {
	const { user, updateProfile, logout } = useAuth() as AuthWithOptionalUpdate;
	const [form, setForm] = useState({
		name: user?.fullName ?? '',
		email: user?.email ?? '',
		password: '',
		birthdate: user?.birthdate ?? '',
	});
	const [message, setMessage] = useState<string | null>(null);

	React.useEffect(() => {
		if (user) {
			setForm({
				name: user.fullName ?? '',
				email: user.email ?? '',
				password: '',
				birthdate: user.birthdate ?? '',
			});
		}
	}, [user]);

	const handleChange = (key: 'name' | 'email' | 'password' | 'birthdate', value: string) =>
		setForm((prev) => ({ ...prev, [key]: value }));

	const handleSave = () => {
		updateProfile?.({
			fullName: form.name,
			email: form.email,
			birthdate: form.birthdate,
			password: form.password || undefined,
		});
		setForm((prev) => ({ ...prev, password: '' }));
		setMessage('Perfil actualizado.');
	};

	return (
		<SafeAreaView style={styles.screen}>
			<ScrollView contentContainerStyle={styles.scroll}>
				<Text style={styles.title}>Perfil</Text>
				<Text style={styles.subtitle}>Actualiza tu información personal.</Text>

				{/* user badge (inline styles to avoid modifying global styles object) */}
				<View style={{ backgroundColor: '#1E2125', padding: 12, borderRadius: 8, marginBottom: 24 }}>
					<Text style={{ color: '#FFFFFF', fontWeight: '500' }}>
						Usuario: @{user?.username ?? '—'}
					</Text>
				</View>

				<View style={styles.formCard}>
					<Text style={styles.label}>Nombre</Text>
					<TextInput
						style={styles.input}
						value={form.name}
						onChangeText={(value) => handleChange('name', value)}
						placeholder="Nombre completo"
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
					<Text style={styles.label}>Contraseña</Text>
					<TextInput
						style={styles.input}
						value={form.password}
						onChangeText={(value) => handleChange('password', value)}
						secureTextEntry
						placeholder="••••••••"
						placeholderTextColor="#5D6770"
					/>
					<Text style={styles.label}>Fecha de nacimiento</Text>
					<TextInput
						style={styles.input}
						value={form.birthdate}
						onChangeText={(value) => handleChange('birthdate', value)}
						placeholder="AAAA-MM-DD"
						placeholderTextColor="#5D6770"
					/>
					<Pressable
						onPress={handleSave}
						style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
					>
						<Text style={styles.primaryButtonText}>Guardar cambios</Text>
					</Pressable>
					{message && <Text style={styles.feedback}>{message}</Text>}
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

const UserNoticesScreen = () => {
	const [userReminders, setUserReminders] = useState<Reminder[]>(reminders);
	const [completedIds, setCompletedIds] = useState<string[]>([]);
	const [showReminderForm, setShowReminderForm] = useState(false);
	const [newReminder, setNewReminder] = useState({ title: '', body: '' });
	const [editingId, setEditingId] = useState<string | null>(null);

	const toggleNotice = (id: string) =>
		setCompletedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));

	const resetReminderForm = () => {
		setShowReminderForm(false);
		setEditingId(null);
		setNewReminder({ title: '', body: '' });
	};

	const handleSaveReminder = () => {
		if (!newReminder.title.trim() || !newReminder.body.trim()) {
			return;
		}
		if (editingId) {
			setUserReminders((prev) =>
				prev.map((item) =>
					item.id === editingId
						? { ...item, title: newReminder.title.trim(), body: newReminder.body.trim() }
						: item,
				),
			);
		} else {
			setUserReminders((prev) => [
				...prev,
				{
					id: `rem-${Date.now()}`,
					icon: 'notifications-outline',
					title: newReminder.title.trim(),
					body: newReminder.body.trim(),
				},
			]);
		}
		resetReminderForm();
	};

	const handleEditReminder = (reminder: Reminder) => {
		setNewReminder({ title: reminder.title, body: reminder.body });
		setEditingId(reminder.id);
		setShowReminderForm(true);
	};

	const handleDeleteReminder = (id: string) => {
		setUserReminders((prev) => prev.filter((item) => item.id !== id));
		setCompletedIds((prev) => prev.filter((item) => item !== id));
		if (editingId === id) {
			resetReminderForm();
		}
	};

	const stopCardPress = (event: GestureResponderEvent) => event.stopPropagation();

	return (
		<SafeAreaView style={styles.screen}>
			<ScrollView contentContainerStyle={styles.scroll}>
				<Text style={styles.title}>Avisos</Text>
				<Text style={styles.subtitle}>Mantén tu rutina bajo control con estos recordatorios.</Text>
				<Pressable
					onPress={() => (showReminderForm ? resetReminderForm() : setShowReminderForm(true))}
					style={({ pressed }) => [
						styles.primaryButton,
						styles.noticeCreateButton,
						pressed && styles.primaryButtonPressed,
					]}
				>
					<Text style={styles.primaryButtonText}>
						{showReminderForm ? 'Cancelar' : 'Agregar recordatorio'}
					</Text>
				</Pressable>
				{showReminderForm && (
					<View style={styles.noticeForm}>
						<Text style={styles.noticeFormTitle}>
							{editingId ? 'Editar recordatorio' : 'Nuevo recordatorio'}
						</Text>
						<TextInput
							style={styles.noticeFormInput}
							value={newReminder.title}
							onChangeText={(value) => setNewReminder((prev) => ({ ...prev, title: value }))}
							placeholder="Título"
							placeholderTextColor="#5D6770"
						/>
						<TextInput
							style={[styles.noticeFormInput, styles.noticeFormInputMultiline]}
							value={newReminder.body}
							onChangeText={(value) => setNewReminder((prev) => ({ ...prev, body: value }))}
							placeholder="Descripción"
							placeholderTextColor="#5D6770"
							multiline
						/>
						<Pressable
							onPress={handleSaveReminder}
							style={({ pressed }) => [
								styles.secondaryButton,
								styles.noticeFormButton,
								pressed && styles.secondaryButtonPressed,
							]}
						>
							<Text style={styles.secondaryButtonText}>
								{editingId ? 'Guardar cambios' : 'Crear recordatorio'}
							</Text>
						</Pressable>
					</View>
				)}
				{userReminders.map((item) => {
					const done = completedIds.includes(item.id);
					return (
						<Pressable
							key={item.id}
							onPress={() => toggleNotice(item.id)}
							style={({ pressed }) => [
								styles.noticeCard,
								done && styles.noticeCardDone,
								pressed && styles.noticeCardPressed,
							]}
						>
							<View style={styles.noticeIconWrapper}>
								<Ionicons name={item.icon as any} size={20} color="#4AD1A9" />
							</View>
							<View style={styles.noticeBody}>
								<Text style={styles.noticeTitle}>{item.title}</Text>
								<Text style={styles.noticeText}>{item.body}</Text>
								<View style={styles.noticeActions}>
									<Pressable
										onPress={(event) => {
											stopCardPress(event);
											handleEditReminder(item);
										}}
										style={({ pressed }) => [
											styles.noticeActionButton,
											pressed && styles.noticeActionButtonPressed,
										]}
									>
										<Ionicons name="create-outline" size={14} color="#5DA3FF" />
										<Text style={styles.noticeActionText}>Editar</Text>
									</Pressable>
									<Pressable
										onPress={(event) => {
											stopCardPress(event);
											handleDeleteReminder(item.id);
										}}
										style={({ pressed }) => [
											styles.noticeActionButton,
											styles.noticeActionDanger,
											pressed && styles.noticeActionButtonPressed,
										]}
									>
										<Ionicons name="trash-outline" size={14} color="#FF6B6B" />
										<Text style={styles.noticeActionTextDanger}>Eliminar</Text>
									</Pressable>
								</View>
							</View>
							<Ionicons
								name={done ? 'checkmark-circle' : 'ellipse-outline'}
								size={22}
								color={done ? '#4AD1A9' : '#5D6770'}
							/>
						</Pressable>
					);
				})}
			</ScrollView>
		</SafeAreaView>
	);
};

export const UserTabs = () => (
	<Tab.Navigator
		screenOptions={{
			headerShown: false,
			tabBarActiveTintColor: '#4AD1A9',
			tabBarInactiveTintColor: '#A6B1B8',
			tabBarStyle: { backgroundColor: '#0F1316', borderTopColor: 'rgba(255,255,255,0.04)' },
		}}
	>
		<Tab.Screen
			name="UserExercises"
			component={UserExercisesScreen}
			options={{
				title: 'Ejercicios',
				tabBarIcon: ({ color, size }) => <Ionicons name="barbell-outline" color={color} size={size} />,
			}}
		/>
		<Tab.Screen
			name="UserNutrition"
			component={UserNutritionScreen}
			options={{
				title: 'Nutrición',
				tabBarIcon: ({ color, size }) => <Ionicons name="restaurant-outline" color={color} size={size} />,
			}}
		/>
		<Tab.Screen
			name="UserTimer"
			component={UserTimerScreen}
			options={{
				title: 'Tiempos',
				tabBarIcon: ({ color, size }) => <Ionicons name="timer-outline" color={color} size={size} />,
			}}
		/>
		<Tab.Screen
			name="UserProfile"
			component={UserProfileScreen}
			options={{
				title: 'Perfil',
				tabBarIcon: ({ color, size }) => <Ionicons name="person-circle-outline" color={color} size={size} />,
			}}
		/>
		<Tab.Screen
			name="UserNotices"
			component={UserNoticesScreen}
			options={{
				title: 'Avisos',
				tabBarIcon: ({ color, size }) => <Ionicons name="notifications-outline" color={color} size={size} />,
			}}
		/>
	</Tab.Navigator>
);

const styles = StyleSheet.create({
	screen: { flex: 1, backgroundColor: '#0B0F12' },
	scroll: { paddingHorizontal: 24, paddingBottom: 32, paddingTop: 32 },
	title: { color: '#FFFFFF', fontSize: 24, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
	subtitle: { color: '#D9E6F2', fontSize: 14, marginBottom: 24, textAlign: 'center' },
	dayCard: {
		backgroundColor: '#161A1D',
		borderRadius: 18,
		padding: 14,
		marginBottom: 14,
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.03)',
	},
	dayHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 10,
	},
	dayTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
	dayMeta: { color: '#E2E8F0', fontSize: 12, marginTop: 2 },
	dayFocusPill: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 4,
		paddingHorizontal: 10,
		borderRadius: 12,
		backgroundColor: 'rgba(74,209,169,0.12)',
	},
	dayFocusIcon: { marginRight: 6 },
	dayFocus: { color: '#F0FFF9', fontSize: 14, marginTop: 4 },
	exerciseGroupTitle: { color: '#5DA3FF', fontSize: 13, fontWeight: '600', marginBottom: 6 },
	exerciseRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor: '#0F1316',
		borderRadius: 12,
		paddingVertical: 9,
		paddingHorizontal: 12,
		marginBottom: 8,
	},
	exerciseRowDone: { borderColor: '#4AD1A9', borderWidth: 1 },
	exerciseRowPressed: { opacity: 0.88 },
	exerciseName: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
	exercisePrescription: { color: '#E2E8F0', fontSize: 12, marginTop: 4 },
	objectiveRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 24 },
	chip: {
		paddingVertical: 8,
		paddingHorizontal: 16,
		borderRadius: 16,
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.06)',
		backgroundColor: '#0F1316',
		marginRight: 12,
		marginBottom: 12,
	},
	chipActive: { backgroundColor: '#4AD1A9', borderColor: '#4AD1A9' },
	chipPressed: { opacity: 0.85 },
	chipLocked: { opacity: 0.7 },
	chipLabel: { color: '#E5ECF4', fontSize: 12, fontWeight: '500' },
	chipLabelActive: { color: '#061012', fontWeight: '600' },
	objectiveHint: { color: '#E1E8F0', fontSize: 11, marginBottom: 16 },
	progressCard: {
		backgroundColor: '#161A1D',
		borderRadius: 18,
		padding: 20,
		marginBottom: 20,
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.03)',
	},
	progressTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '600', marginBottom: 16 },
	progressRow: { marginBottom: 16 },
	progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
	progressLabel: { color: '#E2E8F0', fontSize: 13, fontWeight: '500' },
	progressValue: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
	progressTrack: {
		height: 8,
		borderRadius: 8,
		backgroundColor: 'rgba(255,255,255,0.04)',
		overflow: 'hidden',
	},
	progressFill: { height: '100%', borderRadius: 8 },
	feedback: { color: '#9AC6FF', textAlign: 'center', marginBottom: 12 },
	formCard: {
		backgroundColor: '#161A1D',
		borderRadius: 18,
		padding: 20,
		marginTop: 20,
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.03)',
	},
	formTitle: { color: '#E6EEF3', fontSize: 16, fontWeight: '600', marginBottom: 16 },
	label: { color: '#EDF2F7', fontSize: 13, fontWeight: '500', marginBottom: 8 },
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
	inputHalf: {
		flex: 1,
		backgroundColor: '#0F1316',
		borderRadius: 12,
		paddingHorizontal: 16,
		paddingVertical: 12,
		color: '#E6EEF3',
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.04)',
		marginBottom: 16,
	},
	macroRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 16 },
	primaryButton: {
		backgroundColor: '#4AD1A9',
		borderRadius: 14,
		paddingVertical: 14,
		alignItems: 'center',
		marginTop: 12,
		shadowColor: '#000',
		shadowOpacity: 0.18,
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
	secondaryButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
	timerDisplay: {
		backgroundColor: '#161A1D',
		borderRadius: 24,
		paddingVertical: 36,
		alignItems: 'center',
		marginBottom: 24,
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.03)',
	},
	timerValue: { color: '#E6EEF3', fontSize: 48, fontWeight: '700', letterSpacing: 4 },
	quickRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
	quickButton: {
		width: '48%',
		backgroundColor: '#161A1D',
		borderRadius: 16,
		paddingVertical: 14,
		paddingHorizontal: 16,
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.04)',
		marginBottom: 16,
	},
	quickButtonActive: {
		borderColor: 'rgba(74,209,169,0.6)',
		backgroundColor: 'rgba(74,209,169,0.12)',
	},
	quickButtonPressed: { opacity: 0.88, transform: [{ scale: 0.98 }] },
	quickButtonContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
	quickButtonIcon: { marginRight: 8 },
	quickButtonText: { color: '#E6EEF3', fontSize: 14, fontWeight: '600' },
	quickButtonTextActive: { color: '#4AD1A9' },
	timerActions: { flexDirection: 'row', marginTop: 16 },
	timerActionPrimary: {
		flex: 1,
		marginHorizontal: 4,
		backgroundColor: '#4AD1A9',
		borderRadius: 16,
		paddingVertical: 16,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		shadowColor: '#000',
		shadowOpacity: 0.18,
		shadowRadius: 8,
		shadowOffset: { height: 4, width: 0 },
		elevation: 5,
	},
	timerActionSecondary: {
		flex: 1,
		marginHorizontal: 4,
		backgroundColor: '#0F1316',
		borderRadius: 16,
		paddingVertical: 16,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		borderWidth: 1,
		borderColor: 'rgba(93,163,255,0.18)',
	},
	timerActionGhost: {
		flex: 1,
		marginHorizontal: 4,
		backgroundColor: 'transparent',
		borderRadius: 16,
		paddingVertical: 16,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.06)',
	},
	timerActionPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
	timerActionIcon: { marginRight: 8 },
	timerActionTextPrimary: { color: '#061012', fontSize: 15, fontWeight: '700' },
	timerActionTextSecondary: { color: '#C7E2FF', fontSize: 15, fontWeight: '600' },
	timerActionTextGhost: { color: '#E2E8F0', fontSize: 15, fontWeight: '600' },
	noticeCard: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#161A1D',
		borderRadius: 18,
		padding: 18,
		marginBottom: 16,
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.03)',
	},
	noticeCardDone: { borderColor: '#4AD1A9' },
	noticeCardPressed: { opacity: 0.88 },
	noticeIconWrapper: {
		width: 44,
		height: 44,
		borderRadius: 22,
		backgroundColor: 'rgba(74,209,169,0.12)',
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 16,
	},
	noticeBody: { flex: 1 },
	noticeTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: '600', marginBottom: 4 },
	noticeText: { color: '#E2E8F0', fontSize: 13 },
	noticeActions: { flexDirection: 'row', marginTop: 12, gap: 12 },
	noticeActionButton: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#0F1316',
		borderRadius: 12,
		paddingVertical: 6,
		paddingHorizontal: 12,
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.06)',
		gap: 6,
	},
	noticeActionDanger: { borderColor: 'rgba(255,107,107,0.35)' },
	noticeActionButtonPressed: { opacity: 0.85 },
	noticeActionText: { color: '#BDD9FF', fontSize: 12, fontWeight: '600' },
	noticeActionTextDanger: { color: '#FFC0C0', fontSize: 12, fontWeight: '600' },
	logoutButton: {
		marginTop: 16,
		backgroundColor: '#FF6B6B',
		borderRadius: 12,
		paddingVertical: 14,
		alignItems: 'center',
	},
	logoutButtonPressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
	logoutButtonText: { color: '#061012', fontSize: 15, fontWeight: '700' },
	customTimerCard: {
		backgroundColor: '#161A1D',
		borderRadius: 18,
		padding: 20,
		marginBottom: 16,
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.03)',
	},
	customTimerLabel: { color: '#E6EEF3', fontSize: 14, fontWeight: '600', marginBottom: 12 },
	customTimerInputs: { flexDirection: 'row', alignItems: 'center' },
	customTimerInput: {
		width: 72,
		backgroundColor: '#0F1316',
		borderRadius: 12,
		paddingHorizontal: 12,
		paddingVertical: 10,
		color: '#E6EEF3',
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.04)',
		marginRight: 8,
	},
	customTimerSeparator: { color: '#E6EEF3', fontSize: 18, fontWeight: '700', marginRight: 8 },
	customTimerButton: {
		marginLeft: 'auto',
		backgroundColor: '#4AD1A9',
		borderRadius: 12,
		paddingVertical: 10,
		paddingHorizontal: 16,
	},
	customTimerButtonPressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
	customTimerButtonText: { color: '#061012', fontSize: 14, fontWeight: '700' },
	customTimerError: { color: '#FF6B6B', fontSize: 12, marginTop: 8 },
	noticeCreateButton: { marginBottom: 16 },
	noticeForm: {
		backgroundColor: '#161A1D',
		borderRadius: 16,
		padding: 16,
		marginBottom: 16,
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.03)',
	},
	noticeFormTitle: { color: '#E6EEF3', fontSize: 15, fontWeight: '600', marginBottom: 12 },
	noticeFormInput: {
		backgroundColor: '#0F1316',
		borderRadius: 12,
		paddingHorizontal: 14,
		paddingVertical: 12,
		color: '#E6EEF3',
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.04)',
		marginBottom: 12,
	},
	noticeFormInputMultiline: { minHeight: 72, textAlignVertical: 'top' },
	noticeFormButton: { marginTop: 4 },
	exerciseGroup: { marginBottom: 8 },
});