import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import { Button, Container, Text, Header, Content, Left, Right } from 'native-base';
import GlobalHeader from '../../components/GlobalHeader';
import ip from '../../ipstore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getRequestAuthorized, postRequestAuthorized } from '../../API';

export default class AccountsScreen extends Component {
	static navigationOptions = {
		header: null
	};

	state = {
		userDetails: null,
		forename: '',
		surname: '',
		email: '',
		phoneNumber: ''
	};

	componentDidMount() {
		const id = this.props.userId;
		getRequestAuthorized(`http://${ip}:3000/userDetails?id=${id}`).then((response) => {
			this.setState({
				userDetails: response.details,
				forename: response.details.forename,
				surname: response.details.surname,
				email: response.details.email,
				phoneNumber: response.details.phone_number
			});
		});
	}

	navigateTo = () => {
		this.props.navigation.navigate('');
	};

	settings = () => {
		this.props.navigation.navigate('Settings');
	};

	onChangePassword = () => {
		this.props.navigation.navigate('ChangePassword');
	};

	addAddress = () => {
		this.props.navigation.navigate('AddAddress');
	};

	onChangeForename = () => {
		const { forename } = this.state;
		postRequestAuthorized(`http://${ip}:3000/userChangeForename`, { forename })
			.then((responseJSON) => {
				switch (responseJSON.status) {
					case 10:
						alert('Successfully Updated First Name');
						break;
					case 1:
						alert('Unsuccessful Update. Please Try Again');
						break;
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	onChangeSurname = () => {
		const { surname } = this.state;
		postRequestAuthorized(`http://${ip}:3000/userChangeSurname`, { surname })
			.then((responseJSON) => {
				switch (responseJSON.status) {
					//Success
					case 10:
						alert('Successfully Updated Last Name');
						break;
					case 1:
						alert('Unsuccessful Update. Please Try Again');
						break;
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	onChangeEmail = () => {
		const { email } = this.state;
		postRequestAuthorized(`http://${ip}:3000/userChangeEmail`, { email })
			.then((responseJSON) => {
				switch (responseJSON.status) {
					//Success
					case 10:
						alert('Successfully Updated Email');
						break;
					//If email exist
					case 1:
						alert('Could not update as email already exist');
						break;
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	onChangeNumber = () => {
		const { phoneNumber } = this.state;
		postRequestAuthorized(`http://${ip}:3000/userChangePhoneNumber`, { phoneNumber })
			.then((responseJSON) => {
				switch (responseJSON.status) {
					//Success
					case 10:
						alert('Successfully Updated Phone Number');
						break;
					//If email exist
					case 1:
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
				<GlobalHeader type={1} navigateTo={this.navigateTo} />
				<Content style={styles.contentContainer} padder>
					<View style={styles.secondaryButtonContainer}>
						<Button bordered danger style={styles.secondaryButton} onPress={this.settings}>
							<Text style={styles.secondaryButtontext}>Settings</Text>
						</Button>
					</View>

					<View>
						<Text style={styles.title}>Update Details</Text>
					</View>
					{this.state.userDetails !== null && (
						<React.Fragment>
							<View style={styles.inputContainer}>
								<Icon name="person" size={32} style={styles.inputIcons} />
								<TextInput
									onChangeText={(text) => this.setState({ forename: text })}
									placeholder="First Name"
									style={styles.input}
									value={this.state.forename}
								/>
								<TouchableOpacity onPress={this.onChangeForename}>
									<Icon name="update" style={styles.updateIcon} />
								</TouchableOpacity>
							</View>
							<View style={styles.inputContainer}>
								<Icon name="person" size={32} style={styles.inputIcons} />
								<TextInput
									onChangeText={(text) => this.setState({ surname: text })}
									placeholder="Last Name"
									style={styles.input}
									value={this.state.surname}
								/>
								<TouchableOpacity onPress={this.onChangeSurname}>
									<Icon name="update" style={styles.updateIcon} />
								</TouchableOpacity>
							</View>
							<View style={styles.inputContainer}>
								<Icon name="mail" size={32} style={styles.inputIcons} />
								<TextInput
									onChangeText={(text) => this.setState({ email: text })}
									placeholder="Email"
									style={styles.input}
									value={this.state.email}
								/>
								<TouchableOpacity onPress={this.onChangeEmail}>
									<Icon name="update" style={styles.updateIcon} />
								</TouchableOpacity>
							</View>
							<View style={styles.inputContainer}>
								<Icon name="person" size={32} style={styles.inputIcons} />
								<TextInput
									onChangeText={(text) => this.setState({ phoneNumber: text })}
									placeholder="Phone Number"
									style={styles.input}
									value={this.state.phoneNumber}
								/>
								<TouchableOpacity onPress={this.onChangeNumber}>
									<Icon name="update" style={styles.updateIcon} />
								</TouchableOpacity>
							</View>
						</React.Fragment>
					)}

					<View style={styles.secondaryButtonContainer}>
						<Button bordered danger style={styles.button} onPress={this.addAddress}>
							<Text style={styles.buttonText}>Add Address</Text>
						</Button>
					</View>
					<View style={styles.secondaryButtonContainer}>
						<Button bordered danger style={styles.button} onPress={this.onChangePassword}>
							<Text style={styles.buttonText}>Update Password</Text>
						</Button>
					</View>
				</Content>
			</Container>
		);
	}
}

const width = '80%';
const window = Dimensions.get('window');

const styles = StyleSheet.create({
	contentContainer: {
		width: '80%',
		flex: 1,
		flexDirection: 'column',
		alignSelf: 'center'
	},
	buttonContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 30,
		justifyContent: 'center'
	},
	button: {
		width: '100%',
		justifyContent: 'center',
		backgroundColor: '#ff0000'
	},
	buttonText: {
		color: 'white'
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
	inputContainer: {
		flexDirection: 'row',
		borderBottomWidth: 2,
		borderBottomColor: '#ff0000',
		alignItems: 'center',
		width,
		alignSelf: 'center',
		justifyContent: 'center'
	},
	logoutButton: {
		backgroundColor: '#ff0000',
		justifyContent: 'center',
		marginTop: 25,
		alignSelf: 'center'
	},
	secondaryButtonContainer: {
		flexDirection: 'row',
		marginTop: 25,
		marginBottom: 25
	},
	title: {
		textAlign: 'left',
		fontSize: 30,
		fontWeight: 'bold',
		color: 'gray'
	},
	secondaryButton: {
		width: '100%',
		justifyContent: 'center',
		backgroundColor: '#fff'
	},
	secondaryButtontext: {
		color: '#ff0000'
	},
	forenameContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		width: window.width * 0.75,
		margin: 10
	},
	detailView: {
		flex: 1,
		paddingLeft: 10,
		fontSize: 16
	},
	updateIcon: {
		padding: 6,
		color: 'gray'
	}
});
