import React, { useMemo } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { TrainerStackParamList } from '../../navigation/TrainerStack';
import { User } from '../../types';

type Navigation = NativeStackNavigationProp<TrainerStackParamList, 'Asignados'>;

export const AssignedUsersScreen: React.FC = () => {
	const navigation = useNavigation<Navigation>();
	const { user } = useAuth();
	const { users } = useData();

	const assignedUsers = useMemo(
		() => users.filter(candidate => candidate.role === 'usuario' && candidate.trainerId === user?.id),
		[users, user],
	);

	const renderItem = ({ item }: { item: User }) => (
		<TouchableOpacity
			style={styles.card}
			onPress={() => navigation.navigate('DetalleUsuario', { userId: item.id })}
		>
			<Text style={styles.name}>{item.name}</Text>
			<Text style={styles.email}>{item.email}</Text>
			<Text style={styles.goal}>
				Objetivo: {item.nutritionGoal === 'definición' ? 'Definición' : 'Ganancia'}
			</Text>
		</TouchableOpacity>
	);

	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.title}>Tus usuarios</Text>
			{assignedUsers.length === 0 ? (
				<Text style={styles.empty}>No tienes usuarios asignados.</Text>
			) : (
				<FlatList
					contentContainerStyle={styles.list}
					data={assignedUsers}
					keyExtractor={item => item.id}
					renderItem={renderItem}
				/>
			)}
			<TouchableOpacity style={styles.profileCTA} onPress={() => navigation.navigate('Perfil')}>
				<Text style={styles.profileText}>Ver perfil</Text>
			</TouchableOpacity>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		backgroundColor: '#f5f5f5',
	},
	title: {
		fontSize: 24,
		fontWeight: '700',
		marginBottom: 16,
		color: '#1a1a1a',
	},
	list: {
		gap: 12,
		paddingBottom: 24,
	},
	card: {
		backgroundColor: '#ffffff',
		borderRadius: 18,
		padding: 16,
		shadowColor: '#000',
		shadowOpacity: 0.08,
		shadowRadius: 10,
		elevation: 2,
	},
	name: {
		fontSize: 18,
		fontWeight: '600',
		color: '#212121',
	},
	email: {
		marginTop: 4,
		color: '#616161',
	},
	goal: {
		marginTop: 8,
		color: '#1976d2',
		fontWeight: '500',
	},
	empty: {
		marginTop: 64,
		textAlign: 'center',
		color: '#9e9e9e',
		fontSize: 16,
	},
	profileCTA: {
		marginTop: 16,
		paddingVertical: 14,
		backgroundColor: '#43a047',
		borderRadius: 16,
		alignItems: 'center',
	},
	profileText: {
		color: '#ffffff',
		fontWeight: '600',
		fontSize: 16,
	},
});
