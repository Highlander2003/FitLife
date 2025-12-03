import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TrainersScreen } from '../screens/Admin/TrainersScreen';
import { AdminUsersScreen } from '../screens/Admin/UsersScreen';
import { ProfileScreen } from '../screens/Common/ProfileScreen';

export type AdminTabParamList = {
	Entrenadores: undefined;
	Usuarios: undefined;
	Perfil: undefined;
};

const Tab = createBottomTabNavigator<AdminTabParamList>();

export const AdminTabNavigator: React.FC = () => (
	<Tab.Navigator screenOptions={{ headerShown: false }}>
		<Tab.Screen name="Entrenadores" component={TrainersScreen} />
		<Tab.Screen name="Usuarios" component={AdminUsersScreen} />
		<Tab.Screen name="Perfil" component={ProfileScreen} />
	</Tab.Navigator>
);
