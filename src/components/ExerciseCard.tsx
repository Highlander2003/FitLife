import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Exercise } from '../types';

interface Props {
	exercise: Exercise;
}

export const ExerciseCard: React.FC<Props> = ({ exercise }) => {
	const [done, setDone] = useState(false);

	return (
		<TouchableOpacity
			activeOpacity={0.9}
			style={[styles.card, done && styles.cardDone]}
			onPress={() => setDone(prev => !prev)}
		>
			<View>
				<Text style={styles.name}>{exercise.name}</Text>
				<Text style={styles.sets}>
					{exercise.sets} x {exercise.reps}
				</Text>
			</View>
			<Text style={styles.status}>{done ? 'Completado' : 'Marcar'}</Text>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	card: {
		backgroundColor: '#ffffff',
		borderRadius: 16,
		padding: 16,
		marginBottom: 12,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		shadowColor: '#000',
		shadowOpacity: 0.08,
		shadowOffset: { width: 0, height: 4 },
		shadowRadius: 10,
		elevation: 2,
		minHeight: 72,
	},
	cardDone: {
		backgroundColor: '#e0ffe5',
	},
	name: {
		fontSize: 18,
		fontWeight: '600',
		color: '#1a1a1a',
	},
	sets: {
		fontSize: 14,
		color: '#666666',
		marginTop: 4,
	},
	status: {
		fontSize: 14,
		color: '#2e7d32',
		fontWeight: '600',
	},
});
