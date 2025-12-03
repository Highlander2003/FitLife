import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useData } from '../../context/DataContext';

export const NoticesScreen: React.FC = () => {
	const { reminders } = useData();

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView contentContainerStyle={styles.content}>
				<Text style={styles.title}>Recordatorios</Text>
				{reminders.map(reminder => (
					<View key={reminder.id} style={styles.card}>
						<Text style={styles.remTitle}>{reminder.title}</Text>
						<Text style={styles.remTime}>{reminder.time}</Text>
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
		padding: 16,
		gap: 12,
	},
	title: {
		fontSize: 24,
		fontWeight: '700',
		color: '#1a1a1a',
		marginBottom: 8,
	},
	card: {
		backgroundColor: '#ffffff',
		borderRadius: 16,
		padding: 16,
		shadowColor: '#000',
		shadowOpacity: 0.08,
		shadowRadius: 8,
		elevation: 2,
	},
	remTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#424242',
	},
	remTime: {
		fontSize: 14,
		color: '#757575',
		marginTop: 4,
	},
});
