import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TimerControl } from '../../components/TimerControl';

export const TimerScreen: React.FC = () => (
	<SafeAreaView style={styles.container}>
		<View style={styles.content}>
			<Text style={styles.title}>Descansos rápidos</Text>
			<Text style={styles.subtitle}>Selecciona un tiempo para tus pausas entre series.</Text>
			<TimerControl />
		</View>
	</SafeAreaView>
);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5',
	},
	content: {
		flex: 1,
		padding: 24,
		alignItems: 'center',
	},
	title: {
		fontSize: 24,
		fontWeight: '700',
		color: '#1a1a1a',
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 16,
		color: '#616161',
		marginBottom: 32,
		textAlign: 'center',
	},
});
