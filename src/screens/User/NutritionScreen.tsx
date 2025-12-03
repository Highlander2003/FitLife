import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { ProgressBar } from '../../components/ProgressBar';
import { FoodForm } from '../../components/FoodForm';

export const NutritionScreen: React.FC = () => {
	const { user } = useAuth();
	const [modalVisible, setModalVisible] = useState(false);
	const [intake, setIntake] = useState({ calories: 1200, protein: 80, carbs: 200, fats: 50 });

	const targets = useMemo(
		() => ({
			calories: user?.macros?.calories ?? 2000,
			protein: user?.macros?.protein ?? 150,
			carbs: user?.macros?.carbs ?? 250,
			fats: user?.macros?.fats ?? 70,
		}),
		[user],
	);

	const registerFood = (data: typeof intake) => {
		setIntake(prev => ({
			calories: prev.calories + data.calories,
			protein: prev.protein + data.protein,
			carbs: prev.carbs + data.carbs,
			fats: prev.fats + data.fats,
		}));
	};

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView contentContainerStyle={styles.content}>
				<Text style={styles.title}>Objetivo: {user?.nutritionGoal === 'definición' ? 'Definición' : 'Ganancia'}</Text>
				<View style={styles.card}>
					<ProgressBar label="Calorías" current={intake.calories} total={targets.calories} color="#ff8a65" />
					<ProgressBar label="Proteína (g)" current={intake.protein} total={targets.protein} color="#4caf50" />
					<ProgressBar label="Carbohidratos (g)" current={intake.carbs} total={targets.carbs} color="#64b5f6" />
					<ProgressBar label="Grasas (g)" current={intake.fats} total={targets.fats} color="#f06292" />
					<TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
						<Text style={styles.addText}>Agregar comida</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
			<FoodForm visible={modalVisible} onClose={() => setModalVisible(false)} onAdd={registerFood} />
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
	},
	title: {
		fontSize: 22,
		fontWeight: '700',
		color: '#1a1a1a',
		marginBottom: 16,
	},
	card: {
		backgroundColor: '#ffffff',
		borderRadius: 20,
		padding: 20,
		shadowColor: '#000',
		shadowOpacity: 0.08,
		shadowRadius: 12,
		elevation: 3,
	},
	addButton: {
		marginTop: 20,
		backgroundColor: '#ff7043',
		borderRadius: 16,
		paddingVertical: 14,
		alignItems: 'center',
	},
	addText: {
		color: '#ffffff',
		fontSize: 16,
		fontWeight: '600',
	},
});
