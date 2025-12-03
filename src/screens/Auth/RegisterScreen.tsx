import React, { useMemo, useState } from 'react';
import {
	Pressable,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	View,
	useWindowDimensions,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthStack';
import { Role, useAuth } from '../../context/AuthContext';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;
const roles: Role[] = ['administrador', 'entrenador', 'usuario'];

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
	const { register } = useAuth();
	const { width } = useWindowDimensions();
	const scale = useMemo(() => Math.min(Math.max(width / 375, 0.9), 1.15), [width]);
	const [fullName, setFullName] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [selectedRole, setSelectedRole] = useState<Role>('usuario');
	const [error, setError] = useState<string | null>(null);

	const handleRegister = () => {
		try {
			register({ fullName, username, password, role: selectedRole });
			setError(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Error desconocido.');
		}
	};

	return (
		<SafeAreaView style={styles.screen}>
			<ScrollView
				contentContainerStyle={[styles.content, { paddingHorizontal: 24 * scale }]}
				showsVerticalScrollIndicator={false}
				keyboardShouldPersistTaps="handled"
			>
				<Text style={styles.title}>Crear cuenta</Text>
				<Text style={styles.subtitle}>Configura tu perfil para personalizar rutinas y metas.</Text>
				<View style={styles.form}>
					<Text style={styles.label}>Nombre completo</Text>
					<TextInput
						style={styles.input}
						placeholder="Ingresa tu nombre"
						placeholderTextColor="#5D6770"
						value={fullName}
						onChangeText={setFullName}
					/>
					<Text style={styles.label}>Usuario</Text>
					<TextInput
						style={styles.input}
						placeholder="Elige un usuario"
						placeholderTextColor="#5D6770"
						autoCapitalize="none"
						value={username}
						onChangeText={setUsername}
					/>
					<Text style={styles.label}>Contraseña</Text>
					<TextInput
						style={styles.input}
						placeholder="Crea una contraseña"
						placeholderTextColor="#5D6770"
						secureTextEntry
						value={password}
						onChangeText={setPassword}
					/>
					<View style={styles.rolesContainer}>
						<Text style={styles.rolesLabel}>Selecciona tu rol</Text>
						<View style={styles.rolesRow}>
							{roles.map((role) => (
								<Pressable
									key={role}
									onPress={() => setSelectedRole(role)}
									style={({ pressed }) => [
										styles.roleChip,
										selectedRole === role && styles.roleChipActive,
										pressed && styles.roleChipPressed,
									]}
									hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
								>
									<Text
										style={[
											styles.roleChipText,
											selectedRole === role && styles.roleChipTextActive,
										]}
									>
										{role}
									</Text>
								</Pressable>
							))}
						</View>
					</View>
					{error && <Text style={styles.error}>{error}</Text>}
					<Pressable
						onPress={handleRegister}
						style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
					>
						<Text style={styles.primaryButtonText}>Registrar y entrar</Text>
					</Pressable>
				</View>
				<Pressable
					onPress={() => navigation.replace('Login')}
					style={({ pressed }) => [styles.link, pressed && styles.linkPressed]}
				>
					<Text style={styles.linkText}>¿Ya tienes cuenta? Inicia sesión</Text>
				</Pressable>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	screen: { flex: 1, backgroundColor: '#0B0F12' },
	content: { paddingVertical: 32 },
	title: { color: '#E6EEF3', fontSize: 26, fontWeight: '700' },
	subtitle: { color: '#A6B1B8', fontSize: 14, marginTop: 8, marginBottom: 24 },
	form: { gap: 0 },
	label: { color: '#A6B1B8', fontSize: 13, fontWeight: '500', marginBottom: 8 },
	input: {
		backgroundColor: '#0F1316',
		borderRadius: 12,
		paddingHorizontal: 16,
		paddingVertical: 12,
		color: '#E6EEF3',
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.04)',
		marginBottom: 16,
	},
	rolesContainer: { marginTop: 8 },
	rolesLabel: { color: '#A6B1B8', fontSize: 13, fontWeight: '500', marginBottom: 12 },
	rolesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
	roleChip: {
		borderRadius: 16,
		paddingHorizontal: 14,
		paddingVertical: 8,
		backgroundColor: '#0F1316',
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.06)',
	},
	roleChipActive: { backgroundColor: '#4AD1A9', borderColor: '#4AD1A9' },
	roleChipPressed: { opacity: 0.85 },
	roleChipText: { color: '#A6B1B8', fontSize: 12, fontWeight: '500' },
	roleChipTextActive: { color: '#061012' },
	error: { color: '#FF6B6B', marginBottom: 12, textAlign: 'center' },
	primaryButton: {
		marginTop: 8,
		backgroundColor: '#5DA3FF',
		borderRadius: 12,
		paddingVertical: 14,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOpacity: 0.18,
		shadowRadius: 8,
		shadowOffset: { height: 4, width: 0 },
		elevation: 4,
	},
	primaryButtonPressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
	primaryButtonText: { color: '#061012', fontSize: 16, fontWeight: '600' },
	link: { marginTop: 32, alignItems: 'center' },
	linkPressed: { opacity: 0.7 },
	linkText: { color: '#4AD1A9', fontSize: 14, fontWeight: '500' },
});
