import React, { useMemo } from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrainerStackParamList } from '../../navigation/TrainerStack';
import { useData } from '../../context/DataContext';
import { ExerciseCard } from '../../components/ExerciseCard';

type Route = RouteProp<TrainerStackParamList, 'DetalleUsuario'>;

export const UserDetailScreen: React.FC = () => {
	const route = useRoute<Route>();
	const { getUserById } = useData();
	const user = getUserById(route.params.userId);

	const exercises = useMemo(() => user?.exercises ?? {}, [user]);

	if (!user) {
		return (
			<SafeAreaView style={styles.container}>
				<Text style={styles.empty}>Usuario no encontrado.</Text>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView contentContainerStyle={styles.content}>
				<Text style={styles.title}>{user.name}</Text>
				<Text style={styles.sectionLabel}>Rutina</Text>
				{Object.keys(exercises).length === 0 && <Text style={styles.empty}>No hay ejercicios registrados.</Text>}
				{Object.entries(exercises).map(([day, list]) => (
					<View key={day} style={styles.section}>
						<Text style={styles.sectionTitle}>Día {day}</Text>
						{list.map(item => (
							<ExerciseCard key={item.id} exercise={item} />
						))}
						<TouchableOpacity style={styles.action}>
							<Text style={styles.actionText}>Añadir ejercicio (mock)</Text>
						</TouchableOpacity>
					</View>
				))}
				<Text style={styles.sectionLabel}>Nutrición</Text>
				<View style={styles.card}>
					<Text style={styles.label}>Objetivo: {user.nutritionGoal}</Text>
					<Text style={styles.label}>
						Macros: C {user.macros?.carbs ?? 0}g · P {user.macros?.protein ?? 0}g · G{' '}
						{user.macros?.fats ?? 0}g
					</Text>
					<TouchableOpacity style={[styles.action, styles.secondary]}>
						<Text style={styles.actionText}>Editar nutrición (mock)</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5',
	},
	content: {
		padding: 16,
		gap: 16,
	},
	title: {
		fontSize: 26,
		fontWeight: '700',
		color: '#1a1a1a',
	},
	sectionLabel: {
		fontSize: 20,
		fontWeight: '600',
		color: '#424242',
	},
	section: {
		gap: 12,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: '#1976d2',
	},
	card: {
		backgroundColor: '#ffffff',
		borderRadius: 18,
		padding: 16,
		gap: 12,
	},
	label: {
		fontSize: 16,
		color: '#424242',
	},
	action: {
		backgroundColor: '#43a047',
		paddingVertical: 12,
		borderRadius: 12,
		alignItems: 'center',
	},
	secondary: {
		backgroundColor: '#1976d2',
	},
	actionText: {
		color: '#ffffff',
		fontWeight: '600',
	},
	empty: {
		marginTop: 24,
		textAlign: 'center',
		color: '#9e9e9e',
		fontSize: 16,
	},
});
