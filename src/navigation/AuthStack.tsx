import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../screens/Auth/LoginScreen';
import { RegisterScreen } from '../screens/Auth/RegisterScreen';

export type AuthStackParamList = {
	Login: undefined;
	Register: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthStack = () => (
	<Stack.Navigator
		screenOptions={{
			headerStyle: { backgroundColor: '#0F1316' },
			headerTintColor: '#E6EEF3',
			headerTitleStyle: { fontWeight: '600' },
			headerShadowVisible: false,
			contentStyle: { backgroundColor: '#0B0F12' },
		}}
	>
		<Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Inicia sesión' }} />
		<Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Regístrate' }} />
	</Stack.Navigator>
);
