import React, { useState } from 'react';
import {
	KeyboardAvoidingView,
	Modal,
	Platform,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from 'react-native';

interface FoodFormValues {
	calories: number;
	protein: number;
	carbs: number;
	fats: number;
}

interface Props {
	visible: boolean;
	onClose: () => void;
	onAdd: (data: FoodFormValues) => void;
}

export const FoodForm: React.FC<Props> = ({ visible, onClose, onAdd }) => {
	const [form, setForm] = useState<FoodFormValues>({ calories: 0, protein: 0, carbs: 0, fats: 0 });

	const handleChange = (key: keyof FoodFormValues, value: string) => {
		const numeric = Number(value.replace(/[^0-9.]/g, '')) || 0;
		setForm(prev => ({ ...prev, [key]: numeric }));
	};

	const submit = () => {
		onAdd(form);
		setForm({ calories: 0, protein: 0, carbs: 0, fats: 0 });
		onClose();
	};

	return (
		<Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
			<TouchableWithoutFeedback onPress={onClose}>
				<View style={styles.overlay}>
					<KeyboardAvoidingView
						behavior={Platform.OS === 'ios' ? 'padding' : undefined}
						style={styles.modalContent}
					>
						<Text style={styles.title}>Registrar comida</Text>
						{(['calories', 'protein', 'carbs', 'fats'] as (keyof FoodFormValues)[]).map(key => (
							<TextInput
								key={key}
								style={styles.input}
								keyboardType="numeric"
								placeholder={key === 'calories' ? 'Calorías' : `Gramos de ${key}`}
								value={String(form[key] || '')}
								onChangeText={value => handleChange(key, value)}
							/>
						))}
						<TouchableOpacity style={styles.submit} onPress={submit}>
							<Text style={styles.submitText}>Agregar</Text>
						</TouchableOpacity>
					</KeyboardAvoidingView>
				</View>
			</TouchableWithoutFeedback>
		</Modal>
	);
};

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.4)',
		justifyContent: 'flex-end',
	},
	modalContent: {
		backgroundColor: '#ffffff',
		padding: 24,
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
		gap: 12,
	},
	title: {
		fontSize: 18,
		fontWeight: '600',
		color: '#212121',
	},
	input: {
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#e0e0e0',
		padding: 12,
		fontSize: 16,
	},
	submit: {
		marginTop: 8,
		backgroundColor: '#ff7043',
		paddingVertical: 14,
		borderRadius: 12,
		alignItems: 'center',
	},
	submitText: {
		color: '#ffffff',
		fontWeight: '600',
		fontSize: 16,
	},
});
