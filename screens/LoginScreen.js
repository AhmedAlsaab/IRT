import { Ionicons } from '@expo/vector-icons';
import { Accordion, Button, Container, Content, Text } from 'native-base';
import React, { Component } from 'react';
import { Dimensions, StyleSheet, TextInput, View } from 'react-native';
import GlobalHeader from '../components/GlobalHeader';
import ip from '../ipstore';
import colors from '../constants/Colors';

import { connect } from 'react-redux';
import { addUser } from '../redux/actions/userAction';

class loginScreen extends Component {
	state = {
		email: 'laura.vuilleumier@gmail.com',
		password: 'Qwerty123',
		errors: [],

		isEmailFocused: false,
		isPasswordFocused: false,
	};

	onLoginClick = () => {
		const message = [{ title: 'Errors', content: 'Provide correct credentials' }];

		const data = {
			email: this.state.email,
			password: this.state.password
		};

		fetch(`http://${ip}:3000/login`, {
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
						this.props.onAddUser(responseJSON.content);
						this.props.navigation.navigate('Passenger');
						break;

					case 2:
						this.props.onAddUser(responseJSON.content);
						this.props.navigation.navigate('Driver');
						break;
				}
			})
			.catch((error) => console.log(error));
	};

	onRegisterClick = () => {
		return this.props.navigation.navigate('Register');
	};

	navigateTo = () => {
		this.props.navigation.navigate('');
	};

	render() {
		return (
			<Container>
				<Content>
					<GlobalHeader type={2} navigateTo={this.navigateTo} />
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
							<Text style={styles.title}>LOGIN</Text>
						</View>
						<View style={[styles.inputContainer, {
							borderBottomColor: this.state.isEmailFocused ? colors.brandColor : colors.lightBorder
						}]}>
							<Ionicons
								name="md-mail"
								size={32}
								color={this.state.isEmailFocused ? colors.emphasisTextColor : colors.bodyTextColor}
								style={styles.inputIcons} />
							<TextInput
								placeholder="Email"
								style={[styles.input, {
									color: this.state.isEmailFocused ? colors.emphasisTextColor : colors.bodyTextColor
								}]}
								onChangeText={(text) => this.setState({ email: text })}
								value={this.state.email}
								onFocus={() => { this.setState({ isEmailFocused: true }) }}
								onBlur={() => { this.setState({ isEmailFocused: false }) }}
							/>
						</View>
						<View style={[
							styles.inputContainer, {
								borderBottomColor: this.state.isPasswordFocused ? colors.brandColor : colors.lightBorder
							}]}>
							<Ionicons
								name="md-lock" size={32}
								color={this.state.isPasswordFocused ? colors.emphasisTextColor : colors.bodyTextColor}
								style={styles.inputIcons} />
							<TextInput
								placeholder="Password"
								style={[styles.input, {
									color: this.state.isEmailFocused ? colors.emphasisTextColor : colors.bodyTextColor
								}]}
								onChangeText={(text) => this.setState({ password: text })}
								value={this.state.password}
								secureTextEntry={true}
								onFocus={() => { this.setState({ isPasswordFocused: true }) }}
								onBlur={() => { this.setState({ isPasswordFocused: false }) }}
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
							<Text style={styles.body}>Dont have an account?</Text>
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
		backgroundColor: colors.backgroundColor
	},
	inputContainer: {
		flexDirection: 'row',
		borderBottomWidth: 0.75,
		alignItems: 'center',
		width,
		marginBottom: 10
	},
	input: {
		flex: 1,
		padding: 10,
		color: colors.bodyTextColor
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
		color: colors.emphasisTextColor,
		marginBottom: 20
	},
	forgotPasswordContainer: {
		width
	},
	forgotPassword: {
		textAlign: 'right',
		color: colors.brandColor
	},
	buttonContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 30
	},
	button: {
		width: buttonWidth,
		justifyContent: 'center',
		backgroundColor: colors.brandColor
	},
	registerContainer: {
		flexDirection: 'column',
		alignItems: 'center',
		width,
		marginTop: 25
	},
	registerText: {
		color: colors.brandColor
	},
	imageContainer: {
		height: 250,
		backgroundColor: colors.brandColor
	},
	image: {
		flex: 1,
		alignSelf: 'stretch',
		width: window.width,
		height: window.height
	},
	body: {
		color: colors.bodyTextColor
	}
});

const mapDispatchToProps = (dispatch) => {
	return {
		onAddUser: (user) => dispatch(addUser(user))
	};
};

export default connect(null, mapDispatchToProps)(loginScreen);
