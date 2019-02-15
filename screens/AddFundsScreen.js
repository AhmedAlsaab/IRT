import React from 'react';
import { StyleSheet, View, Dimensions, TextInput, Image, Modal, WebView, TouchableOpacity } from 'react-native';
import { Content, Container, Button, Text } from 'native-base';
import GlobalHeader from '../components/GlobalHeader';
import PayPal from 'react-native-paypal-wrapper';
import Icon from 'react-native-vector-icons/AntDesign';
import { client_id } from '../server/paypal_api_key';

export default class WalletScreen extends React.Component {
	static navigationOptions = {
		header: null
	};

	state = {
		showModal: false,
		status: '',
		amount: 0.0
	};

	onPaypalSubmit = () => {
		if (this.state.amount <= 5) return; //throw error
		this.setState({
			showModal: true,
			status: 'Pending'
		});
	};

	handleResponse = (data) => {
		if (data.title === 'success') {
			this.setState({
				showModal: false,
				status: 'Complete',
				amount: 0.0
			});
		}
		if (data.title === 'cancel') {
			this.setState({
				showModal: false,
				status: 'Cancelled',
				amount: 0.0
			});
		}
	};

	onDebitCreditSubmit = () => {
		console.log('debit/credit api');
	};

	onAmountFocus = () => {
		this.setState({ amount: 0.0 });
		this.textInputRef.clear();
	};

	onAmountEnter = (amount) => {
		this.setState({ amount });
	};

	render() {
		return (
			<Container>
				<GlobalHeader type={1} />
				<Content contentContainerStyle={styles.contentContainer}>
					<View style={styles.headerContainer}>
						<Text style={styles.headerText}>ADD FUNDS</Text>
					</View>
					<View style={styles.balanceContainer}>
						<Text style={styles.balanceText}>Your Balance</Text>
						<Text style={[ styles.balanceSpacing, styles.balanceText ]}>£0.00</Text>
					</View>
					<View style={styles.amountContainer}>
						<Icon name="pluscircleo" size={25} style={styles.amountIcon} />
						<TextInput
							style={styles.amountInput}
							ref={(ref) => (this.textInputRef = ref)}
							onFocus={this.onAmountFocus}
							keyboardType="numeric"
							onChangeText={(amount) => this.onAmountEnter(amount)}
							value={this.state.amount.toString()}
							maxLength={7}
						/>
					</View>
					<View>
						<Text style={styles.paymentHeader}>Payment Method</Text>
						<View style={styles.paymentOptionsContainer}>
							<Button style={styles.paymentOption} onPress={this.onDebitCreditSubmit}>
								<Image
									source={require('../assets/images/debit-card-icon.png')}
									style={[ styles.paymentOptionImage, { width: 80, height: 60 } ]}
								/>
								<Text style={styles.paymentOptionText} uppercase={false}>
									Credit/Debit Card
								</Text>
							</Button>
						</View>
						<View style={styles.paymentOptionsContainer}>
							<Button style={styles.paymentOption} onPress={this.onPaypalSubmit}>
								<Image
									source={require('../assets/images/paypal-icon.png')}
									style={styles.paymentOptionImage}
								/>
								<Text style={styles.paymentOptionText} uppercase={false}>
									PayPal
								</Text>
							</Button>
						</View>
					</View>
					<View>
						<Modal
							visible={this.state.showModal}
							onRequestClose={() => this.setState({ showModal: false })}
						>
							<WebView
								style={styles.webview}
								source={{ uri: 'http://192.168.0.33:3000/paypal-button' }}
								onNavigationStateChange={(data) => this.handleResponse(data)}
								injectedJavaScript={`document.getElementById("paypal-amount").value = ${this.state
									.amount}; document.f1.submit()`}
							/>
						</Modal>
						<Text>Payment Status: {this.state.status}</Text>
					</View>
				</Content>
			</Container>
		);
	}
}

const window = Dimensions.get('window');

const styles = StyleSheet.create({
	webview: {
		width: window.width,
		height: window.height,
		flex: 1
	},
	contentContainer: {
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center'
	},
	headerContainer: {
		padding: 25,
		borderBottomWidth: 1,
		borderBottomColor: '#dfdfdf',
		width: window.width
	},
	headerText: {
		fontSize: 25,
		fontWeight: '100',
		color: '#919191'
	},
	balanceContainer: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 25,
		shadowOffset: { width: 0, height: -20 },
		shadowColor: 'black',
		shadowOpacity: 1,
		elevation: 10,
		backgroundColor: '#fff',
		marginBottom: 15,
		width: window.width
	},
	balanceSpacing: {
		margin: 15,
		fontSize: 40,
		fontWeight: '100'
	},
	button: {
		width: 175,
		justifyContent: 'center',
		backgroundColor: '#ff0000',
		borderRadius: 5
	},
	amountContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		width: window.width * 0.75,
		borderBottomWidth: 1,
		borderBottomColor: '#ff0000',
		margin: 30
	},
	amountInput: {
		flex: 1,
		paddingLeft: 10
	},
	amountIcon: {
		padding: 6,
		color: 'gray'
	},
	paymentHeader: {
		paddingLeft: 25,
		paddingRight: 25,
		paddingTop: 10,
		paddingBottom: 10,
		width: window.width,
		color: '#919191'
	},
	paymentOptionsContainer: {
		flexDirection: 'column',
		paddingLeft: 25,
		paddingRight: 25,
		paddingTop: 12,
		paddingBottom: 12,
		width: window.width
	},
	paymentOption: {
		flex: 1,
		borderColor: '#919191',
		borderWidth: 1,
		backgroundColor: '#fff',
		borderRadius: 10,
		height: 'auto',
		width: window.width - 50,
		padding: 20,
		elevation: 0,
		shadowOpacity: 0,
		justifyContent: 'flex-start',
		flexDirection: 'row'
	},
	paymentOptionText: {
		flex: 5,
		color: '#919191',
		fontSize: 17,
		padding: 17,
		textTransform: 'none'
	},
	paymentOptionImage: {
		flex: 1,
		height: 40,
		resizeMode: 'contain'
	},
	balanceText: {
		color: '#919191'
	}
});
