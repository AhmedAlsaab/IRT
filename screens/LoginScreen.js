import React, { Component } from 'react';
import { Platform, StyleSheet, StatusBar, View, TextInput, Image, Dimensions } from 'react-native';
import { Container, Content, Button, Text, Accordion } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import GlobalHeader from '../components/GlobalHeader';

export default class loginScreen extends Component {
	state = {
		email: 'Qwertyyy@hotmail.com',
		password: 'Qwerty123',
		errors: []
	};

	onLoginClick = () => {
		const message = [ { title: 'Errors', content: 'Provide correct credentials' } ];

		const data = {
			email: this.state.email,
			password: this.state.password
		};

		fetch('http://192.168.0.33:3000/login', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
			.then((response) => response.json())
			.then((responseJSON) => {
				if (responseJSON.status != 10) {
					return this.setState({ errors: message });
				}

				switch (responseJSON.content.fk_user_type_id) {
					case 1:
						this.props.navigation.navigate('Passenger');
						break;

					case 2:
						this.props.navigation.navigate('Driver');
						break;
				}
			});
	};

	onRegisterClick = () => {
		return this.props.navigation.navigate('Register');
	};

	render() {
		return (
			<Container>
				<Content>
					<GlobalHeader type={2} />
					{this.state.errors &&
					!!this.state.errors.length && (
						<Accordion
							dataArray={this.state.errors}
							icon="add"
							expandedIcon="remove"
							contentStyle={styles.errorStyle}
							expanded={0}
						/>
					)}

					<View style={styles.contentContainer}>
						<View style={styles.titleContainer}>
							<Text style={styles.title}>Login</Text>
						</View>
						<View style={styles.inputContainer}>
							<Ionicons name="md-mail" size={32} style={styles.inputIcons} />
							<TextInput
								placeholder="Email"
								style={styles.input}
								onChangeText={(text) => this.setState({ email: text })}
								value={this.state.email}
							/>
						</View>
						<View style={styles.inputContainer}>
							<Ionicons name="md-lock" size={32} style={styles.inputIcons} />
							<TextInput
								placeholder="Password"
								style={styles.input}
								onChangeText={(text) => this.setState({ password: text })}
								value={this.state.password}
								secureTextEntry={true}
							/>
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
							<Text style={styles.registerText} onPress={this.onRegisterClick}>
								REGISTER
							</Text>
						</View>
					</View>
				</Content>
			</Container>
		);
	}
}

const width = '70%';
const buttonWidth = '40%';
const window = Dimensions.get('window');

const styles = StyleSheet.create({
	errorStyle: {
		fontWeight: 'bold',
		backgroundColor: '#f4f4f4'
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
