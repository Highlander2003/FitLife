import React, { useMemo, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
	Pressable,
	SafeAreaView,
	StyleSheet,
	Text,
	TextInput,
	View,
	useWindowDimensions,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthStack';
import { useAuth } from '../../context/AuthContext';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
	const { login } = useAuth();
	const { width } = useWindowDimensions();
	const scale = useMemo(() => Math.min(Math.max(width / 375, 0.9), 1.15), [width]);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = () => {
		try {
			login(username, password);
			setError(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Error desconocido.');
		}
	};

	return (
		<SafeAreaView style={styles.screen}>
			<View style={[styles.content, { paddingHorizontal: 24 * scale }]}>
				<View style={styles.headerSection}>
					<View style={styles.brandBadge}>
						<Ionicons name="fitness-outline" size={18} color="#4AD1A9" />
						<Text style={styles.brandBadgeText}>FitLife</Text>
					</View>
					<Text style={styles.title}>Te damos la bienvenida</Text>
					<Text style={styles.subtitle}>
						Gestiona tus entrenamientos y progreso con una experiencia clara y minimalista.
					</Text>
				</View>
				<View style={styles.form}>
					<Text style={styles.label}>Usuario</Text>
					<View style={styles.inputWrapper}>
						<Ionicons name="person-outline" size={18} color="#5D6770" style={styles.inputIcon} />
						<TextInput
							style={styles.input}
							placeholder="Ingresa tu usuario"
							placeholderTextColor="#5D6770"
							autoCapitalize="none"
							value={username}
							onChangeText={setUsername}
						/>
					</View>
					<Text style={styles.label}>Contraseña</Text>
					<View style={styles.inputWrapper}>
						<Ionicons name="lock-closed-outline" size={18} color="#5D6770" style={styles.inputIcon} />
						<TextInput
							style={styles.input}
							placeholder="••••••••"
							placeholderTextColor="#5D6770"
							secureTextEntry
							value={password}
							onChangeText={setPassword}
						/>
						<Ionicons name="eye-off-outline" size={18} color="#374049" />
					</View>
					{error && <Text style={styles.error}>{error}</Text>}
					<Pressable
						onPress={handleSubmit}
						style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
					>
						<Text style={styles.primaryButtonText}>Ingresar</Text>
					</Pressable>
				</View>
				<Pressable
					onPress={() => navigation.navigate('Register')}
					style={({ pressed }) => [styles.link, pressed && styles.linkPressed]}
				>
					<Text style={styles.linkText}>¿No tienes cuenta? Regístrate</Text>
				</Pressable>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	screen: { flex: 1, backgroundColor: '#0B0F12' },
	content: {
		flex: 1,
		justifyContent: 'center',
		paddingVertical: 32,
		maxWidth: 420,
		width: '100%',
		alignSelf: 'center',
	},
	headerSection: { marginBottom: 32, alignItems: 'center' },
	brandBadge: {
		alignSelf: 'flex-start',
		flexDirection: 'row',
		alignItems: 'center',
		borderRadius: 999,
		paddingHorizontal: 12,
		paddingVertical: 6,
		backgroundColor: 'rgba(74,209,169,0.12)',
		marginBottom: 16,
	},
	brandBadgeText: { color: '#4AD1A9', fontSize: 12, fontWeight: '600', marginLeft: 6 },
	title: { color: '#E6EEF3', fontSize: 26, fontWeight: '700', textAlign: 'center' },
	subtitle: { color: '#A6B1B8', fontSize: 14, marginTop: 8, textAlign: 'center' },
	form: { marginTop: 16, width: '100%' },
	label: { color: '#A6B1B8', fontSize: 13, fontWeight: '500', marginBottom: 8 },
	inputWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#0F1316',
		borderRadius: 12,
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.04)',
		marginBottom: 16,
	},
	inputIcon: { marginRight: 12 },
	input: { flex: 1, color: '#E6EEF3', fontSize: 15 },
	error: { color: '#FF6B6B', marginBottom: 8, textAlign: 'center' },
	primaryButton: {
		marginTop: 8,
		backgroundColor: '#4AD1A9',
		borderRadius: 12,
		paddingVertical: 14,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOpacity: 0.18,
		shadowRadius: 8,
		shadowOffset: { height: 4, width: 0 },
		elevation: 4,
	},
	primaryButtonPressed: { opacity: 0.88, transform: [{ scale: 0.99 }] },
	primaryButtonText: { color: '#061012', fontSize: 16, fontWeight: '600' },
	link: { marginTop: 32, alignItems: 'center' },
	linkPressed: { opacity: 0.7 },
	linkText: { color: '#5DA3FF', fontSize: 14, fontWeight: '500' },
});
