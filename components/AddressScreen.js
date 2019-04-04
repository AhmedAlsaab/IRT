import React, { Component } from 'react';
import { StyleSheet, View, TextInput, Dimensions } from 'react-native';
import { Button, Container, Text, Header, Content, Left, Right } from 'native-base';
import GlobalHeader from './GlobalHeader';
import ip from '../server/keys/ipstore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../constants/Colors';
import { postRequestAuthorized } from '../API';


export default class ChangePassword extends Component {
	static navigationOptions = {
		header: null
	};

	state = {
		city: '',
		street: '',
		house_number: '',
		postcode: ''
	};

	navigateTo = () => {
		this.props.navigation.navigate('Account');
	};

	addAddress = () => {
		const { city, street, house_number, postcode } = this.state;

		postRequestAuthorized(`http://${ip}:3000/addAddress`, { city, street, house_number, postcode })
			.then((responseJSON) => {
				console.log(responseJSON);
				switch (responseJSON.status) {
					//Success
					case 10:
						alert('Added');
						break;
					//If email exist
					case (1, 0):
						alert('Could not add address');
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
								<Text style={styles.title}>Address</Text>
							</View>
					</View>
					<View style={styles.inputContainer}>
						<Icon name="location-city" size={32} style={styles.updateIcon} />
						<TextInput
							onChangeText={(text) => this.setState({ city: text })}
							placeholder="City"
							style={styles.input}
							value={this.state.city}
						/>
					</View>
					<View style={styles.inputContainer}>
						<Icon name="location-city" size={32} style={styles.updateIcon} />
						<TextInput
							onChangeText={(text) => this.setState({ street: text })}
							placeholder="Street"
							style={styles.input}
							value={this.state.street}
						/>
					</View>
					<View style={styles.inputContainer}>
						<Icon name="location-city" color={colors.emphasisTextColor} size={32} style={styles.updateIcon} />
						<TextInput
							onChangeText={(text) => this.setState({ house_number: text })}
							placeholder="House Number"
							style={styles.input}
							value={this.state.house_number}
						/>
					</View>
					<View style={styles.inputContainer}>
						<Icon name="location-city" size={32} style={styles.updateIcon} />
						<TextInput
							onChangeText={(text) => this.setState({ postcode: text })}
							placeholder="Postcode"
							style={styles.input}
							value={this.state.postcode}
						/>
					</View>

					<View style={styles.buttonContainer}>
						<Button danger style={styles.button} onPress={this.addAddress}>
							<Text style={styles.buttonText}>ADD ADDRESS</Text>
						</Button>
					</View>
				</Content>
			</Container>
		);
	}
}

const width = '80%';
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
