import { Button, Container, Content, Text } from 'native-base';
import React from 'react';
import { Dimensions, Image, Modal, StyleSheet, TextInput, View, WebView } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import GlobalHeader from '../../components/GlobalHeader';
import ip from '../../ipstore';
import uuid from 'uuid/v4';
import colors from '../../constants/Colors'

import WalletBalance from './WalletBalance';

import { connect } from 'react-redux';
import { addTransaction } from '../../redux/actions/transactionAction';
import { updateUserFunds } from '../../redux/actions/userAction';

class AddFundsScreen extends React.Component {
	static navigationOptions = {
		header: null
	};

	state = {
		showModal: false,
		status: '',
		amount: null,
		funds: 0.0,

		amountFocused: false,
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
			const { amount, funds } = this.state;
			this.props.onAddTransaction({
				current_funds: parseFloat(parseInt(this.props.user.funds) + parseInt(amount)).toFixed(2),
				date: new Date(),
				fk_transaction_type_id: 2,
				fk_user_id: this.props.user.id,
				spent_funds: amount,
				transaction_id: uuid(),
				type: 'Funds added',
				cancellation_fee: 0
			});

			this.props.onUpdateUserFunds(amount);
			this.setState({
				showModal: false,
				status: 'Complete',
				funds: parseFloat(parseInt(funds) + parseInt(amount)).toFixed(2)
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
		const { amount } = this.state;
		this.props.onAddTransaction({
			current_funds: parseFloat(parseInt(this.props.user.funds) + parseInt(amount)).toFixed(2),
			date: new Date(),
			fk_transaction_type_id: 2,
			fk_user_id: null,
			spent_funds: amount,
			transaction_id: uuid(),
			type: 'Funds added'
		});

		this.props.onUpdateUserFunds(amount);
	};

	onAmountFocus = () => {
		new Promise((resolve, reject) => {
			this.setState({ amount: 0.0, amountFocused: true });
			resolve();
		}).then(() => {
			this.textInputRef.clear();
		});
	};

	onAmountEnter = (amount) => {
		this.setState({ amount });
	};

	navigateTo = () => {
		this.props.navigation.navigate('Wallet');
	};

	render() {
		return (
			<Container>
				<GlobalHeader type={3} header='Add Funds' navigateTo={this.navigateTo} isBackButtonActive={1} />
				<Content contentContainerStyle={styles.contentContainer}>
					<WalletBalance />
					<View style={[styles.amountContainer, { borderBottomColor: this.state.amountFocused ? colors.brandColor : colors.lightBorder }]}>
						<Icon name="pluscircleo" size={20} color={this.state.amountFocused ? colors.emphasisTextColor : colors.bodyTextColor} style={styles.amountIcon} />
						<TextInput
							style={[styles.amountInput, { color: this.state.amountFocused ? colors.emphasisTextColor : colors.bodyTextColor }]}
							ref={(ref) => (this.textInputRef = ref)}
							placeholder='Amount'
							onFocus={this.onAmountFocus}
							onBlur={() => this.setState({ amountFocused: false })}
							keyboardType="numeric"
							onChangeText={(amount) => this.onAmountEnter(amount)}
							value={this.state.amount ? this.state.amount.toString() : null}
							maxLength={7}
						/>
					</View>
					<Text style={styles.paymentHeader}>PAYMENT METHOD</Text>
					<View style={styles.paymentOptionsContainer}>
						<Button style={styles.paymentOption} onPress={this.onDebitCreditSubmit}>
							<Image
								source={require('../../assets/images/debit-card-icon.png')}
								style={[styles.paymentOptionImage, { width: 80, height: 60 }]}
							/>
							<Text style={styles.paymentOptionText} uppercase={false}>
								Credit/Debit Card
								</Text>
						</Button>
					</View>
					<View style={styles.paymentOptionsContainer}>
						<Button style={styles.paymentOption} onPress={this.onPaypalSubmit}>
							<Image
								source={require('../../assets/images/paypal-icon.png')}
								style={styles.paymentOptionImage}
							/>
							<Text style={styles.paymentOptionText} uppercase={false}>
								PayPal
								</Text>
						</Button>
					</View>
					<Modal
						visible={this.state.showModal}
						onRequestClose={() => this.setState({ showModal: false })}
					>
						<WebView
							style={styles.webview}
							source={{ uri: `http://${ip}:3000/paypal-button` }}
							onNavigationStateChange={(data) => this.handleResponse(data)}
							injectedJavaScript={`document.getElementById("paypal-amount").value = ${this.state
								.amount}; document.paypal.submit()`}
						/>
					</Modal>
					<Text style={[styles.body, {marginBottom: 50}]}>PAYMENT STATUS: {this.state.status}</Text>
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
		alignItems: 'center',
		marginTop: 15
	},
	amountContainer: {
		height: 50,
		flexDirection: 'row',
		alignItems: 'center',
		width: window.width * 0.75,
		borderBottomWidth: 0.75,
		margin: 30
	},
	amountInput: {
		flex: 1,
		paddingLeft: 10
	},
	amountIcon: {
		padding: 6,
	},
	paymentHeader: {
		paddingLeft: 25,
		paddingRight: 25,
		paddingTop: 10,
		paddingBottom: 10,
		width: window.width,
		color: colors.bodyTextColor,
		fontSize: 15,
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
		borderWidth: 0.75,
		borderColor: colors.lightBorder,
		backgroundColor: colors.backgroundColor,
		borderRadius: 5,
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
		color: colors.bodyTextColor,
		fontSize: 17,
		padding: 17,
		textTransform: 'none'
	},
	paymentOptionImage: {
		flex: 1,
		height: 40,
		resizeMode: 'contain'
	},
	body: {
		color: colors.bodyTextColor,
	}
});

const mapStateToProps = (state) => ({
	user: state.userReducer.user
});

const mapDispatchToProps = (dispatch) => {
	return {
		onAddTransaction: (transaction) => dispatch(addTransaction(transaction)),
		onUpdateUserFunds: (amount) => dispatch(updateUserFunds(amount))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(AddFundsScreen);
