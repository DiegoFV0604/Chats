import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './src/screens/Login';
import Registro from './src/screens/Registro';
import ChatsScreen from './src/screens/Chats';  // Asegúrate de que la ruta es correcta
import ChatScreen from './src/components/ChatScreen';  // Asegúrate de que la ruta es correcta
import ProfileScreen from './src/components/ProfileScreen';

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                {/* Cada pantalla se pasa con el prop 'component' */}
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Registro" component={Registro} />
                <Stack.Screen name="Chats" component={ChatsScreen} />
                <Stack.Screen options={{ headerShown: false }} name="ChatScreen" component={ChatScreen} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
