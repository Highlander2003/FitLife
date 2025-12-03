import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const quickTimes = [30, 60, 90, 120];

export const TimerControl: React.FC = () => {
	const [remaining, setRemaining] = useState(0);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		if (remaining <= 0 && intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
	}, [remaining]);

	const startCountdown = (seconds: number) => {
		if (intervalRef.current) clearInterval(intervalRef.current);
		setRemaining(seconds);
		intervalRef.current = setInterval(() => {
			setRemaining(prev => {
				if (prev <= 1 && intervalRef.current) {
					clearInterval(intervalRef.current);
					intervalRef.current = null;
				}
				return prev - 1;
			});
		}, 1000);
	};

	return (
		<View style={styles.wrapper}>
			<View style={styles.timerCircle}>
				<Text style={styles.timerText}>{remaining > 0 ? `${remaining}s` : 'Listo'}</Text>
			</View>
			<View style={styles.buttonsRow}>
				{quickTimes.map(time => (
					<TouchableOpacity key={time} style={styles.quickButton} onPress={() => startCountdown(time)}>
						<Text style={styles.quickText}>{time}s</Text>
					</TouchableOpacity>
				))}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	wrapper: {
		alignItems: 'center',
	},
	timerCircle: {
		width: 200,
		height: 200,
		borderRadius: 100,
		backgroundColor: '#ffffff',
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 24,
		shadowColor: '#000',
		shadowOpacity: 0.1,
		shadowRadius: 12,
		elevation: 3,
	},
	timerText: {
		fontSize: 32,
		fontWeight: '700',
		color: '#212121',
	},
	buttonsRow: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'center',
		gap: 12,
	},
	quickButton: {
		minWidth: 72,
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderRadius: 12,
		backgroundColor: '#1976d2',
		alignItems: 'center',
	},
	quickText: {
		color: '#ffffff',
		fontWeight: '600',
	},
});
