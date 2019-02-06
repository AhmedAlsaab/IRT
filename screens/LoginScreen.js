import React, { Component } from 'react';
import { Platform, StyleSheet, StatusBar, View, TextInput, Image, Dimensions } from 'react-native';
import { Container, Content, Button, Text } from 'native-base';
import { Ionicons } from '@expo/vector-icons';

export default class loginScreen extends Component {

    state = {
        email: '12@12.com',
        password: '123456789'
    }

    onLoginClick = () => {
        if (this.state.email == '' || this.state.password == ''){
            //Show Error Message
            
            return;
        }

        const data = this.state;

        fetch("http://10.22.201.102:3000/login", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then((response) => response.json())
        .then((responseJSON) => {
            console.log(responseJSON)
            switch(responseJSON.fk_user_type_id){
                case 1:
                    this.props.navigation.navigate('Passenger');

                case 2:
                    this.props.navigation.navigate('Driver');
            }
        })
    }

    onRegisterClick = () => { this.props.navigation.navigate('Register'); }

    render() {
        return (
            <Container style={styles.container}>       
                <Content contentContainerStyle={styles.contentContainer}>
                    <View style={styles.imageContainer}>
                        <Image resizeMode={'contain'} style={styles.image} source={require('../assets/images/four_line/TFW_four_line_mono_negative_rgb.png')} />
                    </View>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Login</Text>
                    </View>
                    <View style={styles.inputContainer}>
                        <Ionicons name="md-mail" size={32} style={styles.inputIcons}></Ionicons>
                        <TextInput placeholder='Email' style={styles.input} onChangeText={(text) => this.setState({ email: text })} value={this.state.email}></TextInput>
                    </View>
                    <View style={styles.inputContainer}>
                        <Ionicons name="md-lock" size={32} style={styles.inputIcons}></Ionicons>
                        <TextInput placeholder='Password' style={styles.input} onChangeText={(text) => this.setState({ password: text })} value={this.state.password} secureTextEntry={true}></TextInput>
                    </View>
                    <View style={styles.forgotPasswordContainer}>
                        <Text style={styles.forgotPassword}>Forgot your password?</Text>
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button danger style={styles.button} onPress={this.onLoginClick}>
                            <Text>LOGIN</Text>
                        </Button>
                    </View>
                    <View style={styles.registerContainer}>
                        <Text>Dont have an account?</Text>
                        <Text style={styles.registerText} onPress={this.onRegisterClick}>REGISTER</Text>
                    </View>
                </Content>
            </Container>
        )
    }
}

const width = '70%'
const buttonWidth = '40%';
const window = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        ...Platform.select({
            android: {
                marginTop: StatusBar.currentHeight,
            }
        }),
    },
    inputContainer: {
        flexDirection: 'row',
        borderBottomWidth: 2,
        borderBottomColor: '#ff0000',
        alignItems: 'center',
        width,
        marginBottom: 10
    },
    input: {
        flex: 1,
        padding: 10
    },
    inputIcons: {
        width: 50,
        padding: 10,
        textAlign: 'center'
    },
    flex_1: {
        flex: 1,
        alignItems: 'center'
    },
    contentContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center'
    },
    titleContainer: {
        paddingTop: 30,
        paddingBottom: 5,
        width
    },
    title: {
        textAlign: 'left',
        fontSize: 30,
        fontWeight: 'bold',
        color: 'gray'
    },
    forgotPasswordContainer: {
        width
    },
    forgotPassword: {
        textAlign: 'right',
        color: '#ff0000'
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 30
    },
    button: {
        width: buttonWidth,
        justifyContent: 'center',
        backgroundColor: '#ff0000'
    },
    registerContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        width,
        marginTop: 25
    },
    registerText: {
        color: '#ff0000'
    },
    imageContainer: {
        height: 250,
        backgroundColor: '#ff0000'
    },
    image: {
        flex: 1,
        alignSelf: 'stretch',
        width: window.width,
        height: window.height
    }
});