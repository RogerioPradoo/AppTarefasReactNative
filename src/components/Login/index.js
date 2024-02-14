import React, { useState } from 'react';
import { StyleSheet, Text, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import firebase from '../../services/connectFirebase.js';


export default function Login({ changeStatus }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [type, setType] = useState('login');

    function handleLogin() {
        if (type === 'login') {
            const user = firebase.auth().signInWithEmailAndPassword(email, password)
                .then((user) => {
                    changeStatus(user.user.uid);
                }).catch((error) => {
                    console.log(error);
                    alert('Travou');
                    return;
                })
        } else {
            const user = firebase.auth().createUserWithEmailAndPassword(email, password)
                .then((user) => {
                    changeStatus(user.user.uid);
                })
                .catch((error) => {
                    console.log(error);
                    alert('Travou');
                    return;
                })
        }
    }


    return (
        <SafeAreaView style={styles.container}>

            <TextInput
                placeholder="Seu email"
                style={styles.input}
                value={email}
                onChangeText={(text) => setEmail(text)}
            />

            <TextInput
                placeholder="*********"
                style={styles.input}
                value={password}
                onChangeText={(text) => setPassword(text)}
            />

            <TouchableOpacity style={[styles.btnLogin, { backgroundColor: type === 'login' ? '#3ea6f2' : '#141414' }]}
                onPress={handleLogin}
            >
                <Text style={styles.textLogin}>{type === 'login' ? 'Acessar' : 'Cadastrar'}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setType(type => type === 'login' ? 'cadastrar' : 'login')}>
                <Text style={{ textAlign: 'center' }}>
                    {type === 'login' ? 'Criar uma conta' : 'Fazer Login'}
                </Text>
            </TouchableOpacity>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 40,
        paddingHorizontal: 10,
        backgroundColor: "#F2f6fc"
    },
    input: {
        marginBottom: 10,
        backgroundColor: '#FFF',
        borderRadius: 4,
        height: 46,
        padding: 10,
        borderWidth: 1,
        borderColor: "#141414"
    },
    btnLogin: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 45,
        marginBottom: 10
    },
    textLogin: {
        color: '#FFF',
        fontSize: 17
    }
});
