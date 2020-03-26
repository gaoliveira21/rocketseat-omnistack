import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-community/async-storage';
import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';

import api from '../services/api';

import logo from '../assets/logo.png';
import like from '../assets/like.png';
import dislike from '../assets/dislike.png';
import itsamatch from '../assets/itsamatch.png';

export default function Main({ navigation }) {

    const id = navigation.getParam('user');
    const [users, setUsers] = useState([]);
    const [matchDev, setMatchDev] = useState(null);

    useEffect(() => {

        async function loadUsers() {
            const response = await api.get('/devs', {
                headers: {
                    user: id,
                }
            });

            setUsers(response.data);
        }

        loadUsers();

    }, [id]);

    //websocket
    useEffect(() => {

        const socket = io('http://localhost:3333', {
            query: { user: id }
        });

        socket.on('match', dev => {
            setMatchDev(dev);
        });

    }, [id]);

    async function handleLike() {

        const [user, ...rest] = users;

        await api.post(`/devs/${user._id}/likes`, null, {
            headers: { user: id },
        });

        setUsers(rest);
    }

    async function handleDislike() {

        const [user, ...rest] = users;

        await api.post(`/devs/${user._id}/dislikes`, null, {
            headers: { user: id },
        });

        setUsers(rest);
    }

    async function handleLogout() {

        await AsyncStorage.clear();

        navigation.navigate('Login');

    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleLogout}>
                <Image style={styles.logo} source={logo} />
            </TouchableOpacity>

            <View style={styles.cardsContainer}>

                {users.length > 0 ? (
                    users.map((user, index) => {
                        return (<View key={user._id} style={[styles.card, { zIndex: users.length - index }]}>
                            <Image style={styles.avatar} source={{ uri: user.avatar }} />
                            <View style={styles.footer}>
                                <Text style={styles.name}>{user.name}</Text>
                                <Text style={styles.bio} numberOfLines={3}>{user.bio}</Text>
                            </View>
                        </View>);
                    })
                ) : (
                        <Text style={styles.empty}>Acabou :( </Text>
                    )}
            </View>

            {users.length > 0 && (
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity onPress={handleDislike} style={styles.button}>
                        <Image source={dislike} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleLike} style={styles.button}>
                        <Image source={like} />
                    </TouchableOpacity>
                </View>
            )}

            {matchDev && (
                <View style={[styles.matchContainer, { zIndex: users.length + 1 }]}>
                    <Image style={styles.matchImage} source={itsamatch} />
                    <Image style={styles.matchAvatar} source={{ uri: matchDev.avatar }} />

                    <Text style={styles.matchName}>{matchDev.name}</Text>
                    <Text style={styles.matchBio}>{matchDev.bio}</Text>
                    <TouchableOpacity onPress={() => setMatchDev(null)}>
                        <Text style={styles.closeMatch}>FECHAR</Text>
                    </TouchableOpacity>
                </View>
            )}

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    logo: {
        marginTop: 30,
    },

    empty: {
        alignSelf: 'center',
        color: '#999',
        fontSize: 24,
        fontWeight: 'bold',
    },

    cardsContainer: {
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'center',
        maxHeight: 500,
    },

    card: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        margin: 30,
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },

    avatar: {
        flex: 1,
        height: 300,
    },

    footer: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 15
    },

    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
    },

    bio: {
        fontSize: 14,
        color: '#999',
        marginTop: 5,
        lineHeight: 18
    },

    buttonsContainer: {
        flexDirection: 'row',
        marginBottom: 30,
    },

    button: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 2,
        shadowOffset: {
            width: 0,
            height: 2,
        },
    },

    matchContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center'
    },

    matchImage: {
        height: 60,
        resizeMode: 'contain',
    },  

    matchAvatar: {
        width: 160,
        height: 160,
        borderRadius: 80,
        borderWidth: 5,
        borderColor: '#fff',
        marginVertical: 30,
    },

    matchName: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#fff',
    },

    matchBio: {
        marginTop: 10,
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
        lineHeight: 24,
        textAlign: 'center',
        paddingHorizontal: 30
    },

    closeMatch: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
        marginTop: 30,
        fontWeight: 'bold'
    }

});