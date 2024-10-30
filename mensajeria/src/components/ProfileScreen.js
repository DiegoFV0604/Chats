// ProfileScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProfileScreen = ({ route }) => {
    // Supongamos que el perfil muestra el nombre de usuario y el correo electrónico
    const { username, email } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Perfil</Text>
            <Text style={styles.label}>Nombre de usuario: {username}</Text>
            <Text style={styles.label}>Correo electrónico: {email}</Text>
            {/* Puedes añadir más detalles del perfil aquí */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
    },
});

export default ProfileScreen;
