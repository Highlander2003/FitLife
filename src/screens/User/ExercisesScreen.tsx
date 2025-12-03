import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { ExerciseCard } from '../../components/ExerciseCard';

export const ExercisesScreen: React.FC = () => {
	const { top } = useSafeAreaInsets();
	const { user } = useAuth();
	const { getExercisesByUser } = useData();

	const routine = useMemo(() => (user ? getExercisesByUser(user.id) ?? {} : {}), [user, getExercisesByUser]);

	return (
		<SafeAreaView style={[styles.container, { paddingTop: top + 8 }]}>
			<ScrollView contentContainerStyle={styles.content}>
				<Text style={styles.header}>Rutina semanal</Text>
				{Object.keys(routine).length === 0 && <Text style={styles.empty}>No hay ejercicios asignados.</Text>}
				{Object.entries(routine).map(([day, exercises]) => (
					<View key={day} style={styles.section}>
						<Text style={styles.sectionTitle}>Día {day}</Text>
						{exercises.map(exercise => (
							<ExerciseCard key={exercise.id} exercise={exercise} />
						))}
					</View>
				))}
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
		paddingHorizontal: 16,
		paddingBottom: 24,
	},
	header: {
		fontSize: 24,
		fontWeight: '700',
		color: '#1a1a1a',
		marginBottom: 16,
	},
	section: {
		marginBottom: 24,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: '#424242',
		marginBottom: 12,
	},
	empty: {
		fontSize: 16,
		color: '#757575',
		textAlign: 'center',
		marginTop: 48,
	},
});
