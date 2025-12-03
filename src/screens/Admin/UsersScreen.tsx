import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useData } from '../../context/DataContext';

export const AdminUsersScreen: React.FC = () => {
	const { users, trainers, updateTrainerUsers } = useData();
	const clientUsers = users.filter(user => user.role === 'usuario');

	const cycleTrainer = (userId: string) => {
		const currentTrainerId = trainers.find(trainer => trainer.users.includes(userId))?.id;
		const currentIndex = trainers.findIndex(trainer => trainer.id === currentTrainerId);
		const nextTrainer = trainers[(currentIndex + 1) % trainers.length];
		const updatedAssignments = trainers.map(trainer =>
			trainer.id === nextTrainer.id
				? [...new Set([...trainer.users.filter(id => id !== userId), userId])]
				: trainer.users.filter(id => id !== userId),
		);
		trainers.forEach((trainer, index) => updateTrainerUsers(trainer.id, updatedAssignments[index]));
	};

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView contentContainerStyle={styles.content}>
				<Text style={styles.title}>Usuarios</Text>
				{clientUsers.map(user => {
					const trainer = trainers.find(candidate => candidate.users.includes(user.id));
					return (
						<View key={user.id} style={styles.card}>
							<Text style={styles.name}>{user.name}</Text>
							<Text style={styles.email}>{user.email}</Text>
							<Text style={styles.trainer}>
								Entrenador: {trainer ? trainer.name : 'Sin asignar'}
							</Text>
							<TouchableOpacity style={styles.assign} onPress={() => cycleTrainer(user.id)}>
								<Text style={styles.assignText}>Cambiar entrenador</Text>
							</TouchableOpacity>
						</View>
					);
				})}
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
		gap: 12,
	},
	title: {
		fontSize: 26,
		fontWeight: '700',
		color: '#1a1a1a',
	},
	card: {
		backgroundColor: '#ffffff',
		borderRadius: 18,
		padding: 16,
		shadowColor: '#000',
		shadowOpacity: 0.08,
		shadowRadius: 10,
		elevation: 2,
		gap: 6,
	},
	name: {
		fontSize: 18,
		fontWeight: '600',
		color: '#212121',
	},
	email: {
		color: '#616161',
	},
	trainer: {
		color: '#757575',
	},
	assign: {
		marginTop: 8,
		backgroundColor: '#ff7043',
		paddingVertical: 12,
		borderRadius: 14,
		alignItems: 'center',
	},
	assignText: {
		color: '#ffffff',
		fontWeight: '600',
	},
});
