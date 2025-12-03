import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../../src/context/AuthContext';
import { DataProvider } from '../../src/context/DataContext';
import { AppNavigator } from '../../src/navigation/AppNavigator';
import { NavigationIndependentTree } from '@react-navigation/native';

export default function App() {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<SafeAreaProvider>
				<DataProvider>
					<AuthProvider>
						<NavigationIndependentTree>
							<AppNavigator />
						</NavigationIndependentTree>
					</AuthProvider>
				</DataProvider>
				<StatusBar style="light" backgroundColor="#0B0F12" />
			</SafeAreaProvider>
		</GestureHandlerRootView>
	);
}
