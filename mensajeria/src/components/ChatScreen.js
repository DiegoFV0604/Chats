import React, { useEffect, useState, useRef } from 'react';
import { View, TextInput, Button, FlatList, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import axiosInstance from '../services/axiosInstance';
import { useNavigation } from '@react-navigation/native';

const ChatScreen = ({ route }) => {
    const { username, currentUsername } = route.params;
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const navigation = useNavigation();
    const flatListRef = useRef(null);

    const fetchMessages = async () => {
        try {
            const response = await axiosInstance.get(`messages/${username}/`);
            const modifiedMessages = response.data.messages.map(message => ({
                ...message,
                sender: message.sender === currentUsername ? 'Yo' : message.sender,
            }));
            setMessages(modifiedMessages);
        } catch (error) {
            console.error('Error al obtener mensajes:', error.response ? error.response.data : error.message);
            Alert.alert('Error', 'No se pudieron cargar los mensajes.');
        }
    };

    const sendMessage = async () => {
        try {
            await axiosInstance.post('messages/', {
                recipient: username,
                content: newMessage,
            });
            setMessages(prevMessages => [...prevMessages, {
                sender: 'Yo',
                content: newMessage,
                timestamp: new Date().toISOString(),
            }]);
            setNewMessage('');
        } catch (error) {
            console.error('Error al enviar el mensaje:', error.response ? error.response.data : error.message);
            Alert.alert('Error', 'No se pudo enviar el mensaje.');
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    useEffect(() => {
        // Solo realiza el scroll si hay mensajes cargados
        if (messages.length > 0 && flatListRef.current) {
            // Retrasa un poco el scroll para asegurarse de que los mensajes se hayan renderizado
            setTimeout(() => {
                flatListRef.current.scrollToEnd({ animated: true });
            }, 100);
        }
    }, [messages]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{username}</Text>
            </View>

            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={({ item }) => (
                    <View style={[styles.messageContainer, item.sender !== username ? styles.myMessage : styles.otherMessage]}>
                        <Text style={item.sender !== username ? styles.myMessageText : styles.otherMessageText}>
                            {item.content}
                        </Text>
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
            <TextInput
                style={styles.input}
                placeholder="Escribe un mensaje..."
                value={newMessage}
                onChangeText={setNewMessage}
            />
            <Button title="Enviar" onPress={sendMessage} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        backgroundColor: '#f5f5f5',
        marginTop: 12,
    },
    backButton: {
        paddingHorizontal: 10,
    },
    backButtonText: {
        fontSize: 36,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
        marginRight: 63,
        marginTop: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginVertical: 10,
    },
    messageContainer: {
        marginVertical: 5,
        padding: 10,
        borderRadius: 10,
    },
    myMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#DCF8C6',
    },
    otherMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#FFF',
        borderColor: '#000',
        borderWidth: 1,
    },
    myMessageText: {
        color: '#000',
    },
    otherMessageText: {
        color: '#000',
    },
});

export default ChatScreen;
