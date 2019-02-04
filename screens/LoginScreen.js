import React, { Component } from 'react'
import { Platform, StyleSheet, StatusBar, View, TextInput } from 'react-native'
import { Container, Content, Header, Body, Title, Left, Right, Button, Text } from 'native-base';
import { Ionicons } from '@expo/vector-icons';

export default class loginScreen extends Component {

    state = {
        email: '',
        password: ''
    }

    render() {
        return (
            <Container style={styles.container}>
                <Header>
                    <Left style={styles.flex_1} />
                    <Body style={styles.flex_1}>
                        <Title>Login</Title>
                    </Body>
                    <Right style={styles.flex_1} />
                </Header>
                <Content contentContainerStyle={styles.contentContainer}>
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
                        <Button danger style={styles.button} onPress={this.onSubmit}>
                            <Text>REGISTER</Text>
                        </Button>
                    </View>
                    <View style={styles.registerContainer}>
                        <Text>Dont have an account?</Text>
                        <Text style={styles.registerText}>REGISTER</Text>
                    </View>
                </Content>
            </Container>
        )
    }
}

const width = '80%'
const buttonWidth = '40%';

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
        paddingTop: 20,
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
        justifyContent: 'center'
    },
    registerContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        width,
        marginTop: 25
    },
    registerText: {
        color: '#ff0000'
    }
    
});