import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../services/axiosInstance';

const LoginScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (event) => {
        event.persist();
        try {
            const response = await axiosInstance.post('login/', {
                username,
                password,
            });

            if (response.status === 200) {
                const token = response.data.token;
                const email = response.data.email;

                if (token) {
                    await AsyncStorage.setItem('access_token', token);
                    Alert.alert('Login exitoso');
                    navigation.navigate('Chats', { username, email });
                } else {
                    Alert.alert('Error', 'No se recibió ningún token');
                }
            }
        } catch (error) {
            Alert.alert('Error', 'Credenciales incorrectas');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Iniciar Sesión</Text>
            <TextInput
                style={styles.input}
                placeholder="Nombre de usuario"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Iniciar sesión</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Registro')}>
                <Text style={styles.registerText}>¿No tienes cuenta? Regístrate</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#f7f7f7',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#333',
    },
    input: {
        width: '100%',
        padding: 15,
        marginVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
    },
    button: {
        width: '100%',
        padding: 15,
        borderRadius: 8,
        backgroundColor: '#007AFF',
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    registerText: {
        marginTop: 20,
        color: '#007AFF',
        fontSize: 16,
        textDecorationLine: 'underline',
    },
});

export default LoginScreen;
