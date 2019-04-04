import { Ionicons } from '@expo/vector-icons';
import { Accordion, Button, Container, Content, Text } from 'native-base';
import React, { Component } from 'react';
import { Dimensions, Picker, StyleSheet, TextInput, View, KeyboardAvoidingView } from 'react-native';
import GlobalHeader from '../../components/GlobalHeader';
import ip from '../../server/keys/ipstore';
import colors from '../../constants/Colors';
import { postRequestNotAuthorized } from '../../API';

class RegistrationScreen extends Component {
	state = {
		firstName: 'Martin',
		lastName: 'Jones',
		phoneNumber: '07914287655',
		email: 'SimonOM@cardiff.ac.uk',
		password: 'Qwerty123',
		passwordConfirm: 'Qwerty123',
		type: 1,
		errors: [],

		firstNameFocused: false,
		lastNameFocused: false,
		phoneFocused: false,
		emailFocused: false,
		passwordFocused: false,
		passConfirmFocused: false,
		passengerTypeFocused: false
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

		postRequestNotAuthorized(`http://${ip}:3000/register`, data)
			.then((responseJSON) => {
				switch (responseJSON.status) {
					//Success
					case 10:
						this.props.navigation.navigate('Login', { success: 10 });
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

	navigateTo = () => {
		this.props.navigation.navigate('');
	};

	render() {
		return (
			<Container>
				<GlobalHeader type={1} navigateTo={this.navigateTo} />
				<KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
					<Content style={styles.content}>
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
								<Text style={styles.title}>REGISTRATION</Text>
							</View>
							<View
								style={[
									styles.inputContainer,
									{
										borderBottomColor: this.state.firstNameFocused
											? colors.brandColor
											: colors.lightBorder
									}
								]}
							>
								<Ionicons
									name="md-person"
									color={
										this.state.firstNameFocused ? colors.emphasisTextColor : colors.bodyTextColor
									}
									size={32}
									style={styles.inputIcons}
								/>
								<TextInput
									placeholder="First Name"
									style={[
										styles.input,
										{
											color: this.state.firstNameFocused
												? colors.emphasisTextColor
												: colors.bodyTextColor
										}
									]}
									onChangeText={(text) => this.setState({ firstName: text })}
									value={this.state.firstName}
									onFocus={() => {
										this.setState({ firstNameFocused: true });
									}}
									onBlur={() => {
										this.setState({ firstNameFocused: false });
									}}
								/>
							</View>
							<View
								style={[
									styles.inputContainer,
									{
										borderBottomColor: this.state.lastNameFocused
											? colors.brandColor
											: colors.lightBorder
									}
								]}
							>
								<Ionicons
									name="md-person"
									color={this.state.lastNameFocused ? colors.emphasisTextColor : colors.bodyTextColor}
									size={32}
									style={styles.inputIcons}
								/>
								<TextInput
									placeholder="Last Name"
									style={[
										styles.input,
										{
											color: this.state.lastNameFocused
												? colors.emphasisTextColor
												: colors.bodyTextColor
										}
									]}
									onChangeText={(text) => this.setState({ lastName: text })}
									value={this.state.lastName}
									onFocus={() => {
										this.setState({ lastNameFocused: true });
									}}
									onBlur={() => {
										this.setState({ lastNameFocused: false });
									}}
								/>
							</View>
							<View
								style={[
									styles.inputContainer,
									{
										borderBottomColor: this.state.phoneFocused
											? colors.brandColor
											: colors.lightBorder
									}
								]}
							>
								<Ionicons
									name="md-phone-portrait"
									color={this.state.phoneFocused ? colors.emphasisTextColor : colors.bodyTextColor}
									size={32}
									style={styles.inputIcons}
								/>
								<TextInput
									placeholder="Phone Number"
									style={[
										styles.input,
										{
											color: this.state.phoneFocused
												? colors.emphasisTextColor
												: colors.bodyTextColor
										}
									]}
									onChangeText={(text) => this.setState({ phoneNumber: text })}
									value={this.state.phoneNumber}
									onFocus={() => {
										this.setState({ phoneFocused: true });
									}}
									onBlur={() => {
										this.setState({ phoneFocused: false });
									}}
								/>
							</View>
							<View
								style={[
									styles.inputContainer,
									{
										borderBottomColor: this.state.emailFocused
											? colors.brandColor
											: colors.lightBorder
									}
								]}
							>
								<Ionicons
									name="md-mail"
									color={this.state.emailFocused ? colors.emphasisTextColor : colors.bodyTextColor}
									size={32}
									style={styles.inputIcons}
								/>
								<TextInput
									placeholder="Email"
									style={[
										styles.input,
										{
											color: this.state.emailFocused
												? colors.emphasisTextColor
												: colors.bodyTextColor
										}
									]}
									onChangeText={(text) => this.setState({ email: text })}
									value={this.state.email}
									onFocus={() => {
										this.setState({ emailFocused: true });
									}}
									onBlur={() => {
										this.setState({ emailFocused: false });
									}}
								/>
							</View>
							<View
								style={[
									styles.inputContainer,
									{
										borderBottomColor: this.state.passwordFocused
											? colors.brandColor
											: colors.lightBorder
									}
								]}
							>
								<Ionicons
									name="md-lock"
									color={this.state.passwordFocused ? colors.emphasisTextColor : colors.bodyTextColor}
									size={32}
									style={styles.inputIcons}
								/>
								<TextInput
									placeholder="Password"
									secureTextEntry={true}
									style={[
										styles.input,
										{
											color: this.state.passwordFocused
												? colors.emphasisTextColor
												: colors.bodyTextColor
										}
									]}
									onChangeText={(text) => this.setState({ password: text })}
									value={this.state.password}
									onFocus={() => {
										this.setState({ passwordFocused: true });
									}}
									onBlur={() => {
										this.setState({ passwordFocused: false });
									}}
								/>
							</View>
							<View
								style={[
									styles.inputContainer,
									{
										borderBottomColor: this.state.passConfirmFocused
											? colors.brandColor
											: colors.lightBorder
									}
								]}
							>
								<Ionicons
									name="md-lock"
									color={
										this.state.passConfirmFocused ? colors.emphasisTextColor : colors.bodyTextColor
									}
									size={32}
									style={styles.inputIcons}
								/>
								<TextInput
									placeholder="Password Confirm"
									secureTextEntry={true}
									style={[
										styles.input,
										{
											color: this.state.passConfirmFocused
												? colors.emphasisTextColor
												: colors.bodyTextColor
										}
									]}
									onChangeText={(text) => this.setState({ passwordConfirm: text })}
									value={this.state.passwordConfirm}
									onFocus={() => {
										this.setState({ passConfirmFocused: true });
									}}
									onBlur={() => {
										this.setState({ passConfirmFocused: false });
									}}
								/>
							</View>
							<View style={[ styles.inputContainer, { borderBottomColor: colors.lightBorder } ]}>
								<Ionicons
									name="md-person"
									color={colors.bodyTextColor}
									size={32}
									style={styles.inputIcons}
								/>
								<View style={styles.inputContainerPicker}>
									<Text style={styles.body}>I am a </Text>
									<Picker
										name="type"
										style={styles.inputPicker}
										selectedValue={this.state.type}
										onValueChange={(itemValue, itemIndex) => this.setState({ type: itemValue })}
									>
										<Picker.Item color={colors.bodyTextColor} label="Passenger" value="1" />
										<Picker.Item color={colors.bodyTextColor} label="Driver" value="2" />
									</Picker>
								</View>
							</View>
							<View style={styles.buttonContainer}>
								<Button danger style={styles.button} onPress={this.onSubmit}>
									<Text>REGISTER</Text>
								</Button>
							</View>
							<View style={styles.registerContainer}>
								<Text style={styles.body}>Have an account?</Text>
								<Text style={styles.registerText} onPress={this.onAccountClick}>
									LOGIN
								</Text>
							</View>
						</View>
					</Content>
				</KeyboardAvoidingView>
			</Container>
		);
	}
}

const width = '80%';
const buttonWidth = '40%';
const window = Dimensions.get('window');

const styles = StyleSheet.create({
	content: {
		flex: 1
	},
	inputContainer: {
		flexDirection: 'row',
		borderBottomWidth: 0.75,
		alignItems: 'center',
		width
	},
	errorStyle: {
		fontWeight: 'bold',
		backgroundColor: colors.backgroundColor
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
		color: colors.brandColor
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
		alignItems: 'center',
		marginTop: 30,
		justifyContent: 'flex-end'
	},
	titleContainer: {
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
		borderColor: colors.brandColor,
		color: colors.bodyTextColor
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
		backgroundColor: colors.brandColor
	},
	error: {
		color: colors.brandColor
	},
	imageContainer: {
		height: 120,
		backgroundColor: colors.brandColor,
		width: window.width,
		alignItems: 'center'
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

export default RegistrationScreen;
