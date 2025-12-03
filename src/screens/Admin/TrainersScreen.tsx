import React, { useState } from 'react';
import {
	Modal,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useData } from '../../context/DataContext';
import { Trainer } from '../../types';

export const TrainersScreen: React.FC = () => {
	const { trainers, addTrainer } = useData();
	const [modalVisible, setModalVisible] = useState(false);
	const [form, setForm] = useState({ name: '', email: '' });

	const submit = () => {
		if (!form.name.trim()) return;
		const newTrainer: Trainer = {
			id: `t${Date.now()}`,
			name: form.name.trim(),
			email: form.email.trim() || `${Date.now()}@example.com`,
			users: [],
		};
		addTrainer(newTrainer);
		setForm({ name: '', email: '' });
		setModalVisible(false);
	};

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView contentContainerStyle={styles.content}>
				<Text style={styles.title}>Entrenadores</Text>
				{trainers.map(trainer => (
					<View key={trainer.id} style={styles.card}>
						<Text style={styles.name}>{trainer.name}</Text>
						<Text style={styles.email}>{trainer.email}</Text>
						<Text style={styles.count}>Usuarios asignados: {trainer.users.length}</Text>
					</View>
				))}
			</ScrollView>
			<TouchableOpacity style={styles.add} onPress={() => setModalVisible(true)}>
				<Text style={styles.addText}>Agregar entrenador</Text>
			</TouchableOpacity>
			<Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContent}>
						<Text style={styles.modalTitle}>Nuevo entrenador</Text>
						<TextInput
							style={styles.input}
							placeholder="Nombre"
							value={form.name}
							onChangeText={value => setForm(prev => ({ ...prev, name: value }))}
						/>
						<TextInput
							style={styles.input}
							placeholder="Email"
							value={form.email}
							onChangeText={value => setForm(prev => ({ ...prev, email: value }))}
							keyboardType="email-address"
						/>
						<TouchableOpacity style={styles.save} onPress={submit}>
							<Text style={styles.saveText}>Guardar</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.cancel} onPress={() => setModalVisible(false)}>
							<Text style={styles.cancelText}>Cancelar</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
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
		paddingBottom: 80,
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
	count: {
		color: '#1976d2',
		fontWeight: '500',
	},
	add: {
		position: 'absolute',
		right: 16,
		bottom: 24,
		backgroundColor: '#1976d2',
		paddingVertical: 14,
		paddingHorizontal: 20,
		borderRadius: 18,
	},
	addText: {
		color: '#ffffff',
		fontWeight: '600',
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.4)',
		justifyContent: 'center',
		padding: 24,
	},
	modalContent: {
		backgroundColor: '#ffffff',
		borderRadius: 20,
		padding: 20,
		gap: 12,
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: '600',
	},
	input: {
		borderRadius: 14,
		borderWidth: 1,
		borderColor: '#e0e0e0',
		padding: 14,
		fontSize: 16,
	},
	save: {
		backgroundColor: '#1976d2',
		borderRadius: 14,
		paddingVertical: 12,
		alignItems: 'center',
	},
	saveText: {
		color: '#ffffff',
		fontWeight: '600',
	},
	cancel: {
		alignItems: 'center',
		paddingVertical: 10,
	},
	cancelText: {
		color: '#f44336',
		fontWeight: '600',
	},
});
