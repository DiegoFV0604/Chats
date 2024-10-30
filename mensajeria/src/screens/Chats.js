import React, { useState, useLayoutEffect, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ChatList from '../components/ChatList';
import axios from 'axios'; // Asegúrate de tener axios importado

const Chat = ({ route, navigation }) => {
    const { username, email } = route.params || {}; 
    const [menuVisible, setMenuVisible] = useState(false); // Estado para controlar el menú

    // Verifica si se recibió el username
    if (!username) {
        console.error("No se recibió el username");
        return (
            <View>
                <Text>Error: No se pudo obtener el nombre de usuario</Text>
            </View>
        );
    }
    if (!email) {
        console.error("No se recibió el email");
        return (
            <View>
                <Text>Error: No se pudo obtener el email</Text>
            </View>
        );
    }

    // Configuración del encabezado
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)} style={{ marginRight: 15 }}>
                    <Ionicons name="ellipsis-vertical" size={24} color="black" />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    


    // Función para manejar las opciones del menú
    const handleOptionPress = (option) => {
        setMenuVisible(false); // Cierra el menú

        if (option === 'Perfil') {
            // Navega a la pantalla de perfil con el email
            navigation.navigate('Profile', { username: username, email: email });
        } else if (option === 'Cerrar sesión') {
            navigation.navigate('Login');
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <ChatList currentUsername={username} navigation={navigation} />

            {/* Menú flotante debajo de los tres puntos */}
            {menuVisible && (
                <View style={styles.dropdownMenu}>
                    <TouchableOpacity onPress={() => handleOptionPress('Perfil')} style={styles.menuOption}>
                        <Text style={styles.optionText}>Perfil</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleOptionPress('Cerrar sesión')} style={styles.menuOption}>
                        <Text style={styles.optionText}>Cerrar sesión</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setMenuVisible(false)} style={styles.menuOption}>
                        <Text style={styles.optionText}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

// Estilos para el menú flotante
const styles = StyleSheet.create({
    dropdownMenu: {
        position: 'absolute',
        top: 5, // Ajusta esta posición dependiendo de la altura de tu barra de navegación
        right: 15,
        backgroundColor: 'white',
        borderRadius: 5,
        elevation: 5, // Sombra en Android
        shadowColor: '#000', // Sombra en iOS
        shadowOffset: { width: 0, height: 2 }, // Sombra en iOS
        shadowOpacity: 0.8, // Sombra en iOS
        shadowRadius: 2, // Sombra en iOS
        zIndex: 1000, // Asegura que se muestre encima de otros elementos
    },
    menuOption: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    optionText: {
        fontSize: 16,
    },
});

export default Chat;
