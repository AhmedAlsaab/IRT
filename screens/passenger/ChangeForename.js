import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, TextInput } from 'react-native';
import { Button, Container, Text, Header, Content, Left, Right } from 'native-base';
import GlobalHeader from '../../components/GlobalHeader';
import ip from '../../ipstore';
import { Icon } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { getRequestAuthorized } from '../../API';

export default class AccountsScreen extends Component {
	static navigationOptions = {
		header: null
	};

	state = {
		userDetails: []
	};

	componentDidMount() {
		const id = this.props.userId;
		getRequestAuthorized(`http://${ip}:3000/userChangeDetails?id=${id}`).then((response) => {
			console.log(response);
			this.setState({
				userDetails: response.details
			});
		});
	}

	navigateTo = () => {
		this.props.navigation.navigate('');
	};

	settings = () => {
		this.props.navigation.navigate('Settings');
	};

	forename = () => {
		this.props.navigation.navigate('ChangeForename');
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
						<Text style={styles.title}>Update My Details</Text>
					</View>

					<View style={styles.inputContainer}>
						<Ionicons name="md-person" size={32} style={styles.inputIcons} />
						<TextInput placeholder="First Name" style={styles.input} />
					</View>
				</Content>
			</Container>
		);
	}
}

const width = '70%';
const window = Dimensions.get('window');

const styles = StyleSheet.create({
	contentContainer: {
		width: '80%',
		flex: 1,
		flexDirection: 'column',
		alignSelf: 'center'
	},
	logoutButton: {
		backgroundColor: '#ff0000',
		justifyContent: 'center',
		marginTop: 25,
		alignSelf: 'center'
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
		width
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
