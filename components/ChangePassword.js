import React, { Component } from 'react';
import { StyleSheet, View, TextInput, Dimensions, TouchableOpacity } from 'react-native';
import { Button, Container, Text, Content } from 'native-base';
import GlobalHeader from './GlobalHeader';
import ip from '../server/keys/ipstore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { postRequestAuthorized } from '../API';
import colors from '../constants/Colors';


export default class ChangePassword extends Component {
	static navigationOptions = {
		header: null
	};

	state = {
		currentPassword: '',
		newPassword: '',
		confirmPassword: '',
		secureTextEntry: true
	};

	navigateTo = () => {
		this.props.navigation.navigate('Account');
	};

	onShowPassword = () => {
		this.setState({ secureTextEntry: false });
	};

	onChangePassword = () => {
		const { currentPassword, newPassword, confirmPassword } = this.state;
		if (currentPassword === '' || newPassword === '' || confirmPassword === '') {
			return alert('Enter text into the fields');
		}

		postRequestAuthorized(`http://${ip}:3000/userUpdatePassword`, { currentPassword, newPassword, confirmPassword })
			.then((responseJSON) => {
				switch (responseJSON.status) {
					//Success
					case 10:
						alert('Successfully Updated Password');
						break;
					//If email exist
					case (1, 0):
						alert('Unsuccessful Update. Please Try Again');
						break;
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	render() {
		return (
			<Container>
				<GlobalHeader type={1} navigateTo={this.navigateTo} isBackButtonActive={1} />
				<Content>
					<View style={styles.contentContainer}>
							<View style={styles.titleContainer}>
								<Text style={styles.title}>Password</Text>
							</View>
					</View>
					<View style={styles.inputContainer}>
						<Icon name="lock" size={32} style={styles.inputIcons} />
						<TextInput
							onChangeText={(text) => this.setState({ currentPassword: text })}
							placeholder="Current Password"
							style={styles.input}
							secureTextEntry={this.state.secureTextEntry}
						/>
						<TouchableOpacity onPress={this.onShowPassword}>
							<Icon name="remove-red-eye" size={30} style={styles.updateIcon} />
						</TouchableOpacity>
					</View>
					<View style={styles.inputContainer}>
						<Icon name="lock" size={32} style={styles.inputIcons} />
						<TextInput
							onChangeText={(text) => this.setState({ newPassword: text })}
							placeholder="New Password"
							style={styles.input}
							secureTextEntry={this.state.secureTextEntry}
						/>
						<TouchableOpacity onPress={this.onShowPassword}>
							<Icon name="remove-red-eye" size={30} style={styles.updateIcon} />
						</TouchableOpacity>
					</View>
					<View style={styles.inputContainer}>
						<Icon name="lock" size={32} style={styles.inputIcons} />
						<TextInput
							onChangeText={(text) => this.setState({ confirmPassword: text })}
							placeholder="Confirm Password"
							style={styles.input}
							secureTextEntry={this.state.secureTextEntry}
						/>
						<TouchableOpacity onPress={this.onShowPassword}>
							<Icon name="remove-red-eye" size={30} style={styles.updateIcon} />
						</TouchableOpacity>
					</View>

					<View style={styles.buttonContainer}>
						<Button danger style={styles.button} onPress={this.onChangePassword}>
							<Text>UPDATE</Text>
						</Button>
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
	input: {
		flex: 1,
		padding: 10,
		color: colors.emphasisTextColor
	},
	inputIcons: {
		width: 50,
		padding: 10,
		textAlign: 'center',
		color: colors.emphasisTextColor
	},
	inputContainer: {
		flexDirection: 'row',
		borderBottomWidth: 2,
		borderBottomColor: colors.lightBorder,
		alignItems: 'center',
		width,
		alignSelf: 'center',
		justifyContent: 'center'
	},
	contentContainer: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'flex-end'
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
	buttonContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 30,
		justifyContent: 'center'
	},
	button: {
		width: buttonWidth,
		justifyContent: 'center',
		backgroundColor: colors.brandColor
	},
	buttontext: {
		color: '#000000',
		fontSize: 20
	},
	updateIcon: {
		padding: 6,
		color: colors.emphasisTextColor,
	}
});
