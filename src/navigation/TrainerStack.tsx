import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AssignedUsersScreen } from '../screens/Trainer/AssignedUsersScreen';
import { UserDetailScreen } from '../screens/Trainer/UserDetailScreen';
import { ProfileScreen } from '../screens/Common/ProfileScreen';

export type TrainerStackParamList = {
	Asignados: undefined;
	DetalleUsuario: { userId: string };
	Perfil: undefined;
};

const Stack = createNativeStackNavigator<TrainerStackParamList>();

export const TrainerStackNavigator: React.FC = () => (
	<Stack.Navigator>
		<Stack.Screen name="Asignados" component={AssignedUsersScreen} options={{ title: 'Usuarios asignados' }} />
		<Stack.Screen
			name="DetalleUsuario"
			component={UserDetailScreen}
			options={{ title: 'Detalle de usuario' }}
		/>
		<Stack.Screen
			name="Perfil"
			component={ProfileScreen}
			options={{ title: 'Perfil' }}
		/>
	</Stack.Navigator>
);
