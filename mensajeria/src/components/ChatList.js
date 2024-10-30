import React, { useEffect, useState } from 'react';
import { View, Text, Alert, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';

const ChatList = ({ currentUsername, navigation }) => {
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://192.168.1.83:8000/api/users/');
            const filteredUsers = response.data.filter(user => user.username !== currentUsername);
            setUsers(filteredUsers);
        } catch (error) {
            console.error('Error fetching users:', error);
            Alert.alert('Error', 'No se pudo cargar la lista de usuarios.');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleUserPress = (username) => {
        console.log(`Navegando al chat con: ${username}`);
        navigation.navigate('ChatScreen', { username });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Lista de Chats</Text>
            <ScrollView>
                {users.map((user) => (
                    <TouchableOpacity
                        key={user.username}
                        style={styles.userButton}
                        onPress={() => handleUserPress(user.username)}
                    >
                        <Text style={styles.userButtonText}>{user.username}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f7f7f7',
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    userButton: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: '#007AFF',
        marginVertical: 8,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    userButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '500',
        textAlign: 'center',
    },
});

export default ChatList;
