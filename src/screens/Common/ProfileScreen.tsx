import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export const ProfileScreen: React.FC = () => {
	const { user, refreshUser, logout } = useAuth();
	const { updateUser } = useData();
	const [state, setState] = useState({
		name: user?.name ?? '',
		email: user?.email ?? '',
		password: user?.password ?? '',
		birthDate: user?.birthDate ?? '',
	});

	useEffect(() => {
		setState({
			name: user?.name ?? '',
			email: user?.email ?? '',
			password: user?.password ?? '',
			birthDate: user?.birthDate ?? '',
		});
	}, [user]);

	if (!user) return null;

	const handleChange = (key: keyof typeof state, value: string) => {
		setState(prev => ({ ...prev, [key]: value }));
	};

	const save = () => {
		const updated = updateUser(user.id, state);
		if (updated) {
			refreshUser(updated.id);
			Alert.alert('Perfil actualizado', 'Los cambios se guardaron correctamente.');
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView contentContainerStyle={styles.content}>
				<Text style={styles.title}>Perfil ({user.role})</Text>
				<TextInput
					style={styles.input}
					placeholder="Nombre"
					value={state.name}
					onChangeText={text => handleChange('name', text)}
				/>
				<TextInput
					style={styles.input}
					placeholder="Email"
					value={state.email}
					onChangeText={text => handleChange('email', text)}
					keyboardType="email-address"
				/>
				<TextInput
					style={styles.input}
					placeholder="Contraseña"
					value={state.password}
					onChangeText={text => handleChange('password', text)}
					secureTextEntry
				/>
				<TextInput
					style={styles.input}
					placeholder="Fecha de nacimiento (YYYY-MM-DD)"
					value={state.birthDate}
					onChangeText={text => handleChange('birthDate', text)}
				/>
				<TouchableOpacity style={styles.save} onPress={save}>
					<Text style={styles.saveText}>Guardar cambios</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.logout} onPress={logout}>
					<Text style={styles.logoutText}>Cerrar sesión</Text>
				</TouchableOpacity>
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
		gap: 16,
	},
	title: {
		fontSize: 24,
		fontWeight: '700',
		color: '#1a1a1a',
	},
	input: {
		backgroundColor: '#ffffff',
		borderRadius: 16,
		padding: 16,
		fontSize: 16,
		borderWidth: 1,
		borderColor: '#e0e0e0',
	},
	save: {
		backgroundColor: '#1976d2',
		borderRadius: 16,
		paddingVertical: 14,
		alignItems: 'center',
	},
	saveText: {
		color: '#ffffff',
		fontWeight: '600',
		fontSize: 16,
	},
	logout: {
		backgroundColor: '#eeeeee',
		borderRadius: 16,
		paddingVertical: 14,
		alignItems: 'center',
	},
	logoutText: {
		color: '#d32f2f',
		fontWeight: '600',
		fontSize: 16,
	},
});
