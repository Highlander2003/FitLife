import React from 'react';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { AuthStack } from './AuthStack';
import { AdminStack } from './AdminStack';
import { TrainerTabs } from './TrainerTabs';
import { UserTabs } from './UserTabs';
import { useAuth } from '../context/AuthContext';
import { FABChat } from '../components/FABChat';

const appDarkTheme = {
	...DarkTheme,
	colors: {
		...DarkTheme.colors,
		background: '#0B0F12',
		card: '#0F1316',
		primary: '#4AD1A9',
		text: '#E6EEF3',
		border: 'rgba(255,255,255,0.03)',
		notification: '#FF6B6B',
	},
};

export const AppNavigator: React.FC = () => {
	const { user } = useAuth();

	return (
		<NavigationContainer theme={appDarkTheme}>
			{user ? (
				user.role === 'administrador' ? (
					<AdminStack />
				) : user.role === 'entrenador' ? (
					<TrainerTabs />
				) : (
					<UserTabs />
				)
			) : (
				<AuthStack />
			)}
			{user && <FABChat />}
		</NavigationContainer>
	);
};
