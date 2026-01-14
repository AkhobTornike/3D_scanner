import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { COLORS } from '../constants';
import { NavigationContainer } from '@react-navigation/native';
import { ScanScreen } from '../screens/ScanScreen';
import { ProcessingScreen } from '../screens/ProcessingScreen';
import { RootStackParamList } from './types';
import { PreviewScreen } from '../screens/PreviewScreen';
import { GalleryScreen } from '../screens/GalleryScreen';

const HomeScreen = () => (
    <View style={styles.placeholder}>
        <Text style={styles.text}>Home Screen</Text>
    </View>
);

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Home"
              screenOptions={{
                headerStyle: {
                    backgroundColor: COLORS.primary,
                },
                headerTintColor: COLORS.text,
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                contentStyle: {
                    backgroundColor: COLORS.background,
                },
              }}
            >
                <Stack.Screen
                  name="Home"
                  component={HomeScreen}
                  options={{ title: '3D Scanner' }}
                />

                <Stack.Screen
                  name="Scan"
                  component={ScanScreen}
                  options={{ title: 'Scan Object' }}
                />
                <Stack.Screen
                  name="Processing"
                  component={ProcessingScreen}
                  options={{ title: 'Processing...', headerBackVisible: false }}
                />
                <Stack.Screen
                  name="Preview"
                  component={PreviewScreen}
                  options={{ title: '3D Preview' }}
                />
                <Stack.Screen
                  name="Gallery"
                  component={GalleryScreen}
                  options={{ title: 'My Models' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    placeholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
    text: {
        color: COLORS.text,
        fontSize: 20,
        fontWeight: 'bold',
    }
})