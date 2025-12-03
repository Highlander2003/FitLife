import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
	current: number;
	total: number;
	color?: string;
	label: string;
}

export const ProgressBar: React.FC<Props> = ({ current, total, color = '#4caf50', label }) => {
	const percentage = Math.min((current / total) * 100, 100);

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.label}>{label}</Text>
				<Text style={styles.value}>
					{current} / {total}
				</Text>
			</View>
			<View style={styles.track}>
				<View style={[styles.fill, { width: `${percentage}%`, backgroundColor: color }]} />
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginBottom: 16,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 6,
	},
	label: {
		fontSize: 14,
		color: '#424242',
		fontWeight: '500',
	},
	value: {
		fontSize: 14,
		color: '#757575',
	},
	track: {
		height: 16,
		borderRadius: 8,
		backgroundColor: '#e0e0e0',
		overflow: 'hidden',
	},
	fill: {
		height: '100%',
		borderRadius: 8,
	},
});
