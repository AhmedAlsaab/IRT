import React, { Component } from 'react';
import { StyleSheet, View, TextInput, Dimensions } from 'react-native';
import {
	Button,
	Container,
	Text,
	Header,
	Content,
	Left,
	Right,
} from 'native-base';
import GlobalHeader from './GlobalHeader';
import ip from '../server/keys/ipstore';
import { Ionicons } from '@expo/vector-icons';
import { postRequestAuthorized } from '../API'

export default class ChangePassword extends Component {
	static navigationOptions = {
		header: null
	};

	state = {
		currentPassword: '',
		newPassword: '',
		confirmPassword: '',
		secureTextEntry: true
	}

	navigateTo = () => {
		this.props.navigation.navigate('Account');
	};

	onShowPassword = () => {
		this.setState({secureTextEntry: false})
	}

	onChangePassword = () => {
		const {currentPassword, newPassword, confirmPassword} = this.state;
		if (currentPassword === '' || newPassword === '' || confirmPassword === ''){
			return alert('Enter text into the fields')
		}

		postRequestAuthorized(`http://${ip}:3000/userUpdatePassword`, {currentPassword, newPassword, confirmPassword})
		.then((responseJSON) => {
			switch (responseJSON.status) {
				//Success
				case 10:
					alert('Updated')
					break;
				//If email exist
					case 1, 0:
					alert('Successfully Updated Password')
					break;
			}
		})
			.catch(err => {
				console.log(err)

			})
	}

	render() {
		return (
			<Container>
				<GlobalHeader type={1} navigateTo={this.navigateTo} isBackButtonActive={1} />
				<Content>
				<View>
					<Text style={styles.title}>
						Change Password:
					</Text>
				</View>
				<View style={styles.inputContainer}>
						<Ionicons name="md-lock" size={32} style={styles.inputIcons} />
						<TextInput
							onChangeText={(text) => this.setState({currentPassword: text})}
							placeholder="Current Password"
							style={styles.input}
							secureTextEntry={this.state.secureTextEntry}
						/>
				</View>
				<View style={styles.inputContainer}>
						<Ionicons name="md-lock" size={32} style={styles.inputIcons} />
						<TextInput
							onChangeText={(text) => this.setState({newPassword: text})}
							placeholder="New Password"
							style={styles.input}
							secureTextEntry={this.state.secureTextEntry}
						/>
				</View>
				<View style={styles.inputContainer}>
						<Ionicons name="md-lock" size={32} style={styles.inputIcons} />
						<TextInput
							onChangeText={(text) => this.setState({confirmPassword: text})}
							placeholder="Confirm Password"
							style={styles.input}
							secureTextEntry={this.state.secureTextEntry}
						/>
				</View>

				<View style={styles.buttonContainer}>
						<Button danger style={styles.button} onPress={this.onChangePassword}>
							<Text>CHANGE PASSWORD</Text>
						</Button>
					</View>
					<View style={styles.buttonContainer}>
						<Button danger style={styles.button} onPress={this.onShowPassword}>
							<Text>SHOW PASSWORD</Text>
						</Button>
					</View>
				</Content>
			</Container>)
	}
}


const width = '80%';
const window = Dimensions.get('window');

const styles = StyleSheet.create({
input: {
	flex: 1,
	padding: 10
},
inputIcons: {
	width: 50,
	padding: 10,
	textAlign: 'center'
},
inputContainer: {
	flexDirection: 'row',
	borderBottomWidth: 2,
	borderBottomColor: '#ff0000',
	alignItems: 'center',
	width,
	alignSelf: 'center',
	justifyContent: 'center'
},
title: {
	textAlign: 'left',
	fontSize: 30,
	fontWeight: 'bold',
	color: 'gray'
},
buttonContainer: {
	flexDirection: 'row',
	alignItems: 'center',
	marginTop: 30,
	justifyContent: 'center',

},
button: {
	width: '100%',
	justifyContent: 'center',
	backgroundColor: '#ff0000'
},
buttontext: {
	color: '#000000'
},
});