import { Ionicons } from '@expo/vector-icons';
import { Accordion, Button, Container, Content, Text } from 'native-base';
import React, { Component } from 'react';
import { Dimensions, Picker, StyleSheet, TextInput, View } from 'react-native';
import GlobalHeader from '../components/GlobalHeader';
import ip from '../ipstore';

class RegistrationScreen extends Component {
	state = {
		firstName: 'fdfdf',
		lastName: 'dfdfdfdf',
		phoneNumber: '11111111',
		email: 'Qwerty@hotmail.com',
		password: 'Qwerty123',
		passwordConfirm: 'Qwerty123',
		type: 1,
		errors: []
	};

	onSubmit = () => {
		//Send data to the server
		const data = {
			firstName: this.state.firstName,
			lastName: this.state.lastName,
			phoneNumber: this.state.phoneNumber,
			email: this.state.email,
			password: this.state.password,
			passwordConfirm: this.state.passwordConfirm,
			type: this.state.type
		};

		fetch(`http://${ip}:3000/register`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
			.then((response) => response.json())
			.then((responseJSON) => {
				switch (responseJSON.status) {
					//Success
					case 10:
						this.props.navigation.navigate('Login');
						break;
					//User Exists
					case 1:
						this.setState({
							errors: [ { title: 'Errors', content: 'Account already exists' } ]
						});
						break;
					//Input Validation Failed
					case 0:
						this.setState({
							errors: this.parseErrors(responseJSON.errors)
						});
						break;
				}
			})
			.catch((error) => console.log(error));
	};

	parseErrors = (errorList) => {
		var errors = {
			title: 'Errors',
			content: ''
		};

		for (var i = 0; i < errorList.length; i++) {
			errors.content += errorList[i].msg + '\n';
		}

		return [ errors ];
	};

	onAccountClick = () => {
		return this.props.navigation.navigate('Login');
	};

	render() {
		return (
			<Container>
				<Content>
					<GlobalHeader type={1} />
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
					{this.state.error && (
						<Accordion
							dataArray={this.state.error}
							icon="add"
							expandedIcon="remove"
							contentStyle={styles.errorStyle}
							expanded={0}
						/>
					)}

					<View style={styles.contentContainer}>
						<View style={styles.titleContainer}>
							<Text style={styles.title}>Create Account</Text>
						</View>
						<View style={styles.inputContainer}>
							<Ionicons name="md-person" size={32} style={styles.inputIcons} />
							<TextInput
								placeholder="First Name"
								style={styles.input}
								onChangeText={(text) => this.setState({ firstName: text })}
								value={this.state.firstName}
							/>
						</View>
						<View style={styles.inputContainer}>
							<Ionicons name="md-person" size={32} style={styles.inputIcons} />
							<TextInput
								placeholder="Last Name"
								style={styles.input}
								onChangeText={(text) => this.setState({ lastName: text })}
								value={this.state.lastName}
							/>
						</View>
						<View style={styles.inputContainer}>
							<Ionicons name="md-phone-portrait" size={32} style={styles.inputIcons} />
							<TextInput
								placeholder="Phone Number"
								style={styles.input}
								onChangeText={(text) => this.setState({ phoneNumber: text })}
								value={this.state.phoneNumber}
							/>
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
								secureTextEntry={true}
								style={styles.input}
								onChangeText={(text) => this.setState({ password: text })}
								value={this.state.password}
							/>
						</View>
						<View style={styles.inputContainer}>
							<Ionicons name="md-lock" size={32} style={styles.inputIcons} />
							<TextInput
								placeholder="Password Confirm"
								secureTextEntry={true}
								style={styles.input}
								onChangeText={(text) => this.setState({ passwordConfirm: text })}
								value={this.state.passwordConfirm}
							/>
						</View>
						<View style={styles.inputContainer}>
							<Ionicons name="md-person" size={32} style={styles.inputIcons} />
							<View style={styles.inputContainerPicker}>
								<Text>I am a </Text>
								<Picker
									name="type"
									style={styles.inputPicker}
									selectedValue={this.state.type}
									onValueChange={(itemValue, itemIndex) => this.setState({ type: itemValue })}
								>
									<Picker.Item label="Passenger" value="1" />
									<Picker.Item label="Driver" value="2" />
								</Picker>
							</View>
						</View>
						<View style={styles.buttonContainer}>
							<Button danger style={styles.button} onPress={this.onSubmit}>
								<Text>REGISTER</Text>
							</Button>
						</View>
						<View style={styles.registerContainer}>
							<Text>Have an account?</Text>
							<Text style={styles.registerText} onPress={this.onAccountClick}>
								LOGIN
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
	inputContainer: {
		flexDirection: 'row',
		borderBottomWidth: 2,
		borderBottomColor: '#ff0000',
		alignItems: 'center',
		width
	},
	errorStyle: {
		fontWeight: 'bold',
		backgroundColor: '#f4f4f4'
	},
	input: {
		flex: 1,
		padding: 10
	},
	registerContainer: {
		flexDirection: 'column',
		alignItems: 'center',
		width,
		marginTop: 25,
		marginBottom: 20
	},
	registerText: {
		color: '#ff0000'
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
	inputPicker: {
		borderWidth: 2,
		borderColor: '#ff0000'
	},
	inputContainerPicker: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	inputPicker: {
		height: 50,
		width: 350
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
	buttontext: {
		color: '#000000'
	},
	error: {
		color: '#ff0000'
	},
	imageContainer: {
		height: 120,
		backgroundColor: '#ff0000',
		width: window.width,
		alignItems: 'center'
	},
	image: {
		flex: 1,
		alignSelf: 'stretch',
		width: window.width,
		height: window.height
	}
});

export default RegistrationScreen;
