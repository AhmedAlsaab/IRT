import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions } from 'react-native';
import { Button, Container, Text, Content } from 'native-base';
import GlobalHeader from '../../components/GlobalHeader';
import colors from '../../constants/Colors';
import ip from '../../server/keys/ipstore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getRequestAuthorized } from '../../API';

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

	contact = () => {
		this.props.navigation.navigate('Contact');
	};

	logout = () => {
		this.props.navigation.navigate('Login');
	};

	navigateTo = () => {
		this.props.navigation.navigate('');
	};

	details = () => {
		this.props.navigation.navigate('ChangeDetails');
	};

	theme = () => {
		this.props.navigation.navigate('SetTheme');
	};

	render() {
		return (
			<Container>
				<GlobalHeader type={1} navigateTo={this.navigateTo} />
				<Content style={styles.contentContainer}>
					<View style={styles.secondaryButtonContainer}>
						<Button bordered danger style={styles.secondaryButton} onPress={this.details}>
							<Text style={styles.secondaryButtontext}>My Details</Text>
						</Button>
					</View>

					{this.state.userDetails !== null && (
						<View style={styles.container}>
							<React.Fragment>
								<View style={styles.detailContainer}>
									<Icon name="person" size={32} style={styles.inputIcons} />
									<Text style={styles.detailView}>Forename: {this.state.userDetails.forename}</Text>
									<TouchableOpacity onPress={this.details}>
										<Icon name="update" size={30} style={styles.updateIcon} />
									</TouchableOpacity>
								</View>
								<View style={styles.detailContainer}>
									<Icon name="person" size={32} style={styles.inputIcons} />
									<Text style={styles.detailView}>Surname: {this.state.userDetails.surname}</Text>
									<TouchableOpacity onPress={this.details}>
										<Icon name="update" size={30} style={styles.updateIcon} />
									</TouchableOpacity>
								</View>
								<View style={styles.detailContainer}>
									<Icon name="mail" size={32} style={styles.inputIcons} />
									<Text style={styles.detailView}>Email: {this.state.userDetails.email}</Text>
									<TouchableOpacity onPress={this.details}>
										<Icon name="update" size={30} style={styles.updateIcon} />
									</TouchableOpacity>
								</View>
								<View style={styles.detailContainer}>
									<Icon name="phone-android" size={32} style={styles.inputIcons} />
									<Text style={styles.detailView}>
										Phone Number: {this.state.userDetails.phone_number}
									</Text>
									<TouchableOpacity onPress={this.details}>
										<Icon name="update" size={30} style={styles.updateIcon} />
									</TouchableOpacity>
								</View>
							</React.Fragment>
						</View>
					)}

					<View style={styles.secondaryButtonContainer}>
						<Button bordered danger style={styles.secondaryButton} onPress={this.contact}>
							<Text style={styles.secondaryButtontext}>Emergency Contacts</Text>
						</Button>
					</View>
					<View style={styles.buttonContainer}>
						<Button danger style={styles.button} onPress={this.logout}>
							<Text style={styles.buttonText}>LOG OUT</Text>
						</Button>
					</View>
				</Content>
			</Container>
		);
	}
}
const width = '100%';
const buttonWidth = '40%';
const window = Dimensions.get('window');

const styles = StyleSheet.create({
	button: {
		width: '100%',
		justifyContent: 'center',
		backgroundColor: '#ff0000'
	},
	contentContainer: {
		width: '80%',
		flex: 1,
		flexDirection: 'column',
		alignSelf: 'center'
	},
	logoutButton: {
		backgroundColor: colors.brandColor,
		justifyContent: 'center',
		marginTop: 25,
		alignSelf: 'center'
	},
	secondaryButtonContainer: {
		flexDirection: 'row',
		marginTop: 25,
		marginBottom: 20
	},
	secondaryButton: {
		width: '100%',
		justifyContent: 'center',
		backgroundColor: '#fff'
	},
	secondaryButtontext: {
		color: '#ff0000'
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
	detailContainer: {
		flexDirection: 'row',
		borderBottomWidth: 2,
		borderBottomColor: colors.lightBorder,
		width,
		justifyContent: 'center',
		color: colors.emphasisTextColor
	},
	updateIcon: {
		padding: 6,
		color: colors.emphasisTextColor
	},
	detailView: {
		flex: 1,
		paddingLeft: 10,
		fontSize: 16,
		color: colors.emphasisTextColor
	},
	inputIcons: {
		width: 50,
		padding: 10,
		textAlign: 'center',
		color: colors.emphasisTextColor
	}
});
