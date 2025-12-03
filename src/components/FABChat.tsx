import React, { useMemo, useState } from 'react';
import {
	Modal,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';

type Message = { text: string; sender: 'bot' | 'user' };

export const FABChat: React.FC = () => {
	const [open, setOpen] = useState(false);
	const [input, setInput] = useState('');
	const [messages, setMessages] = useState<Message[]>([{ text: 'Hola, ¿en qué puedo ayudarte?', sender: 'bot' }]);

	const keywordReplies = useMemo(
		() => ({
			prensa: 'La prensa de piernas fortalece cuadríceps y glúteos; recuerda mantener la espalda pegada.',
			sentadilla: 'La sentadilla trabaja piernas completas y core. Controla la técnica antes del peso.',
			cardio: 'Incluye 20-30 minutos de cardio moderado 3 veces por semana para mejorar resistencia.',
		}),
		[],
	);

	const sendMessage = () => {
		const trimmed = input.trim();
		if (!trimmed) return;
		const lower = trimmed.toLowerCase();
		const reply =
			Object.entries(keywordReplies).find(([keyword]) => lower.includes(keyword))?.[1] ??
			'No entendí, pregunta por un ejercicio o rutina.';
		setMessages(prev => [...prev, { text: trimmed, sender: 'user' }, { text: reply, sender: 'bot' }]);
		setInput('');
	};

	return (
		<>
			<TouchableOpacity style={styles.fab} onPress={() => setOpen(true)}>
				<Text style={styles.fabIcon}>💬</Text>
			</TouchableOpacity>
			<Modal visible={open} animationType="slide" onRequestClose={() => setOpen(false)}>
				<View style={styles.modal}>
					<View style={styles.header}>
						<Text style={styles.headerText}>Asistente Virtual</Text>
						<TouchableOpacity onPress={() => setOpen(false)}>
							<Text style={styles.close}>Cerrar</Text>
						</TouchableOpacity>
					</View>
					<ScrollView style={styles.history} contentContainerStyle={{ padding: 16, gap: 12 }}>
						{messages.map((message, index) => (
							<View
								key={`${message.sender}-${index}`}
								style={[
									styles.bubble,
									message.sender === 'user' ? styles.userBubble : styles.botBubble,
								]}
							>
								<Text style={styles.bubbleText}>{message.text}</Text>
							</View>
						))}
					</ScrollView>
					<View style={styles.inputRow}>
						<TextInput
							style={styles.input}
							placeholder="Escribe tu mensaje..."
							value={input}
							onChangeText={setInput}
						/>
						<TouchableOpacity style={styles.send} onPress={sendMessage}>
							<Text style={styles.sendText}>Enviar</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		</>
	);
};

const styles = StyleSheet.create({
	fab: {
		position: 'absolute',
		bottom: 24,
		right: 24,
		width: 64,
		height: 64,
		borderRadius: 32,
		backgroundColor: '#1976d2',
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: '#000',
		shadowOpacity: 0.2,
		shadowRadius: 12,
		shadowOffset: { width: 0, height: 6 },
		elevation: 6,
	},
	fabIcon: {
		fontSize: 28,
		color: '#ffffff',
	},
	modal: {
		flex: 1,
		backgroundColor: '#ffffff',
	},
	header: {
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#eeeeee',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	headerText: {
		fontSize: 18,
		fontWeight: '600',
		color: '#212121',
	},
	close: {
		color: '#f44336',
		fontWeight: '600',
	},
	history: {
		flex: 1,
	},
	bubble: {
		borderRadius: 16,
		padding: 12,
		maxWidth: '80%',
	},
	userBubble: {
		alignSelf: 'flex-end',
		backgroundColor: '#1976d2',
	},
	botBubble: {
		alignSelf: 'flex-start',
		backgroundColor: '#eeeeee',
	},
	bubbleText: {
		color: '#212121',
	},
	inputRow: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 16,
		gap: 12,
		borderTopWidth: 1,
		borderTopColor: '#eeeeee',
	},
	input: {
		flex: 1,
		borderRadius: 16,
		borderWidth: 1,
		borderColor: '#e0e0e0',
		paddingHorizontal: 16,
		paddingVertical: 12,
		fontSize: 16,
	},
	send: {
		backgroundColor: '#1976d2',
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderRadius: 14,
		minWidth: 72,
		alignItems: 'center',
	},
	sendText: {
		color: '#ffffff',
		fontWeight: '600',
	},
});
