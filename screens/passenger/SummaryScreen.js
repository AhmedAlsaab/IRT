import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { Content, Container, Button, Text, StyleProvider, Item, Row } from 'native-base';
import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';
import GlobalHeader from '../../components/GlobalHeader';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ip from '../../ipstore';
import WalletBalance from './WalletBalance';
import uuid from 'uuid/v4';
import { Location, Permissions, Notifications} from 'expo';
import { connect } from 'react-redux';
import { addTransaction } from '../../redux/actions/transactionAction';
import { userPayForTicket } from '../../redux/actions/userAction';
import { addTicket } from '../../redux/actions/ticketAction';
import colors from '../../constants/Colors'

class SummaryScreen extends React.Component {
	static navigationOptions = {
		header: null
	};

	state = {
		isLoadingComplete: false,
		data: [],
		date: new Date(),
		dateOptions: { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' },
		total: 0.0,
		deviceToken: ''
	};

	sendEmail = () => {
		const {
			date,
			street,
			endStreet,
			numPassenger,
			numWheelchair,
			city,
			endCity
		} = this.props.navigation.state.params;
		//Send data to the server
		const data = {
			data: {
				startLocation: `${street}, ${city}`,
				endLocation: `${endStreet}, ${endCity}`,
				passenger: numPassenger,
				wheelchair: numWheelchair
			},
			date: moment(date).format('MMMM Do YYYY'),
			email: this.props.user.email
		};

		fetch(`http://${ip}:3000/book`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
			.then((response) => response.json())
			.then((responseJSON) => {
				switch (responseJSON.status) {
					//Success
					case 10:
						break;
					//User Exists
					case 1:
						this.setState({
							errors: [{ title: 'Errors', content: 'There was an error whilst sending confirmation' }]
						});
						break;
				}
			})
			.catch((error) => console.log(error));
	};

	bookJourney = () => {
		const bookingData = this.props.navigation.state.params;
		fetch(`http://${ip}:3000/booking/temp`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(bookingData)
		}).catch((error) => console.log(error));
	};

	componentDidMount() {
		const { numPassenger } = this.props.navigation.state.params;
		this.setState({
			total: parseInt(numPassenger * 3)
		});

		// Channel for popup notifications
		if (Platform.OS === 'android') {
			Expo.Notifications.createChannelAndroidAsync('reminders', {
				name: 'Reminders',
				priority: 'max',
				vibrate: [0, 250, 250, 250]
			});
		}
	}
	async componentWillMount() {
		await this.registerForPushNotificationsAsync();
	}

	payForTicket = () => {
		if (this.props.user.funds - this.state.total <= 0) {
			//Throw error, not enough money to pay
			return;
		}
		//Pay for Ticket
		//Add Transaction
		const {
			date,
			street,
			endStreet,
			numPassenger,
			numWheelchair,
			city,
			endCity,
			time
		} = this.props.navigation.state.params;
		const data = {
			current_funds: parseFloat(parseInt(this.props.user.funds) - parseInt(this.state.total)).toFixed(2),
			spent_funds: this.state.total,
			fk_transaction_type_id: 1
		};

		fetch(`http://${ip}:3000/user/addTransaction`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
			.then((reponse) => reponse.json())
			.then((response) => {
				if (response.status !== 10) return;

				this.props.userPayForTicket(this.state.total);

				this.props.onAddTransaction({
					current_funds: parseFloat(this.props.user.funds).toFixed(2),
					date: new Date(),
					fk_transaction_type_id: 1,
					fk_user_id: this.props.user.id,
					spent_funds: this.state.total,
					transaction_id: uuid(),
					type: 'Ticket Purchased',
					cancellation_fee: 0
				});

				this.props.addTicket({
					accessibilityRequired: numWheelchair > 0 ? 1 : 0,
					date: date,
					time: time,
					numPassengers: numPassenger,
					numWheelchairs: numWheelchair,
					cancelled: 0,
					endTime: date,
					expired: 0,
					completed: 1,
					fromCity: city,
					fromStreet: street,
					id: this.props.ticketslength,
					paid: 1,
					startTime: time,
					toCity: endCity,
					toStreet: endStreet,
					used: 0
				});
			})
			.catch((error) => console.log(error));

		const navData = {
			data: {
				startLocation: `${street}, ${city}`,
				endLocation: `${endStreet}, ${endCity}`,
				passenger: numPassenger,
				wheelchair: numWheelchair
			},
			date: moment(date).format('MMMM Do YYYY'),
			time: moment(time).format('LT')
		};

		this.bookJourney();
		this.sendEmail();
		this.sendPushNotification();
		this.props.navigation.navigate('Confirmation', navData);
	};

	payWithConcessionary = () => {
		const {
			date,
			time,
			street,
			endStreet,
			numPassenger,
			numWheelchair,
			city,
			endCity
		} = this.props.navigation.state.params;
		const data = {
			current_funds: this.props.user.funds,
			spent_funds: 0.0,
			fk_transaction_type_id: 3
		};

		fetch(`http://${ip}:3000/user/addTransaction`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
			.then((reponse) => reponse.json())
			.then((response) => {
				if (response.status !== 10) return;

				this.props.userPayForTicket(0.0);

				this.props.onAddTransaction({
					current_funds: parseFloat(this.props.user.funds).toFixed(2),
					date: new Date(),
					fk_transaction_type_id: 3,
					fk_user_id: this.props.user.id,
					spent_funds: 0.0,
					transaction_id: uuid(),
					type: 'Concessionary Ticket'
				});
			});

		this.props.addTicket({
			accessibilityRequired: numWheelchair > 0 ? 1 : 0,
			cancelled: 0,
			date: date,
			time: time,
			numPassengers: numPassenger,
			numWheelchairs: numWheelchair,
			endTime: date,
			expired: 0,
			completed: 1,
			fromCity: city,
			fromStreet: street,
			id: this.props.ticketslength,
			paid: 1,
			startTime: time,
			toCity: endCity,
			toStreet: endStreet,
			used: 0
		});

		const navData = {
			data: {
				startLocation: `${street}, ${city}`,
				endLocation: `${endStreet}, ${endCity}`,
				passenger: numPassenger,
				wheelchair: numWheelchair
			},
			date: moment(date).format('MMMM Do YYYY')
		};

		this.bookJourney();
		this.sendEmail();
		this.sendPushNotification();
		this.props.navigation.navigate('Confirmation', navData);
	};

	registerForPushNotificationsAsync = async () => {
		const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
		let finalStatus = existingStatus;

		// only ask if permissions have not already been determined, because
		// iOS won't necessarily prompt the user a second time.
		if (existingStatus !== 'granted') {
			// Android remote notification permissions are granted during the app
			// install, so this will only ask on iOS
			const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
			finalStatus = status;
		}

		// Stop here if the user did not grant permissions
		if (finalStatus !== 'granted') {
			return;
		}

		// Get the token that uniquely identifies this device
		let token = await Notifications.getExpoPushTokenAsync();
		this.setState({
			deviceToken: token
		});
		console.log(token);
	};

	sendPushNotification = () => {
		let response = fetch('https://exp.host/--/api/v2/push/send', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				to: `${this.state.deviceToken}`,
				sound: 'default',
				title: 'Booking confirmation',
				priority: 'high',
				body: `Thank you for booking with TFW. An email confirmation will be sent to you shortly`, // insert service number, pickup location
				sound: 'default', // android 7.0 , 6, 5 , 4
				channelId: 'reminders', // android 8.0 later
				icon: '../../assets/images/Notification_Icon_3.png'
			})
		});
	};

	navigateTo = () => {
		this.props.navigation.navigate('Home');
	};

	render() {
		const data = this.props.navigation.state.params;
		return (
			<StyleProvider style={getTheme(platform)}>
				<Container>
					<Content>
						<GlobalHeader type={3} header='Journey Summary' navigateTo={this.navigateTo} isBackButtonActive={1} />
						<View>
							{/* Page header and introductory text */}
							<View style={styles.introduction}>
								<Text style={styles.body}>
									Times are an approximation and subject to change. You will receive confirmation on
									the day of travel.
								</Text>
							</View>

							{/* The summary card showing booking information */}
							<View style={styles.summaryCard}>
								<View style={styles.cardContent}>
									<View style={styles.details}>
										<View>
											<View style={styles.icon}>
												<Icon name="date-range" size={20} color={colors.bodyTextColor} />
												<Text style={styles.cardBody}>
													{moment(data.date).format('MMMM Do YYYY')}
												</Text>
											</View>
											<View style={styles.icon}>
												<Icon name="my-location" size={20} color={colors.bodyTextColor} />
												<Text style={styles.cardBody}>
													{data.street}, {data.city}
												</Text>
											</View>
										</View>

										<View>
											<View style={styles.icon}>
												<Icon name="location-on" size={20} color={colors.bodyTextColor} />
												<Text style={styles.cardBody}>
													{data.endStreet}, {data.endCity}
												</Text>
											</View>
											<View style={styles.icon}>
												<Icon name="people" size={20} color={colors.bodyTextColor} />
												<Text style={styles.cardBody}>
													{data.numPassenger}
													{data.numPassenger > 1 ? ' Passengers' : ' Passenger'}
												</Text>
											</View>
											{data.numWheelchair > 0 ? (
												<View style={styles.icon}>
													<Icon name="accessible" size={20} color={colors.bodyTextColor} />
													<Text style={styles.cardBody}>
														{data.numWheelchair}
														{data.numWheelchair > 1 ? ' Wheelchairs' : ' Wheelchair'}
													</Text>
												</View>
											) : null}
										</View>
									</View>
									<View style={styles.journeyInfo}>
										<Text style={styles.cardBody}>£3.00</Text>
										<Icon name="directions-bus" size={65} color={colors.bodyTextColor} />
										<Text style={styles.cardVehicle}>Minibus</Text>
									</View>
								</View>
							</View>

							{/* Payment summary and options */}
							<View style={styles.paymentInfo}>
								<Text style={styles.header}>PAYMENT</Text>
								<Text style={styles.body}>
									Following payment you will receive confirmation of payment and booking.
								</Text>
								<View style={styles.paymentSummary}>
									<Text style={styles.paymentText}>Total</Text>
									<Text style={styles.paymentText}>£{this.state.total}.00</Text>
								</View>

								{/* Wallet information */}
								<View style={styles.walletBlance}>
									<WalletBalance type={2} />
									{this.props.user.concessionary == 0 && (
										<View style={styles.buttonContainer}>
											<Button
												danger
												style={[styles.button, { backgroundColor: colors.brandColor }]}
												onPress={this.payForTicket}
											>
												<Text>Pay</Text>
											</Button>

											<Button
												bordered
												danger
												style={styles.button}
												onPress={() => {
													this.props.navigation.navigate('AddFunds');
												}}
											>
												<Text style={styles.buttonText}>Add Funds</Text>
											</Button>
										</View>
									)}
									{this.props.user.concessionary == 1 && (
										<View style={styles.buttonButtonContainer}>
											<View style={styles.buttonContainer}>
												<Button
													danger
													style={[styles.button, { backgroundColor: colors.brandColor }]}
													onPress={this.payForTicket}
												>
													<Text style={styles.buttonText}>Pay</Text>
												</Button>

												<Button
													danger
													style={[styles.button, { backgroundColor: colors.brandColor }]}
													onPress={() => {
														this.props.navigation.navigate('AddFunds');
													}}
												>
													<Text style={styles.buttonText}>Add Funds</Text>
												</Button>
											</View>
											<View
												style={[styles.buttonContainer, { marginTop: -5, marginBottom: 25 }]}
											>
												<Button
													bordered
													danger
													style={styles.buttonFullWidth}
													onPress={this.payWithConcessionary}
												>
													<Text style={styles.buttonText}>Concessionary</Text>
												</Button>
											</View>
										</View>
									)}
								</View>
							</View>
						</View>
					</Content>
				</Container>
			</StyleProvider>
		);
	}
}

const styles = StyleSheet.create({
	introduction: {
		marginTop: 20,
		width: '80%',
		flex: 1,
		flexDirection: 'column',
		alignSelf: 'center'
	},
	header: {
		fontSize: 16,
		color: colors.emphasisTextColor,
		marginTop: 15,
		marginBottom: 10
	},
	body: {
		color: colors.bodyTextColor,
		fontSize: 16
	},
	summaryCard: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		shadowOffset: { width: 0, height: -20 },
		shadowColor: 'black',
		shadowOpacity: 1,
		elevation: 5,
		backgroundColor: colors.backgroundColor,
		marginTop: 15,
		marginBottom: 15,
	},
	cardContent: {
		flex: 1,
		flexDirection: 'row',
		marginTop: 10,
		width: '80%',
		justifyContent: 'space-between'
	},
	details: {
		width: '70%'
	},
	journeyInfo: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
		width: '30%'
	},
	cardBody: {
		color: colors.bodyTextColor,
		marginLeft: 6
	},
	cardVehicle: {
		fontSize: 13,
		color: 'gray',
		marginLeft: 6
	},
	icon: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 15
	},
	paymentInfo: {
		width: '80%',
		alignSelf: 'center'
	},
	paymentText: {
		fontSize: 18,
		fontWeight: 'bold',
		color: colors.emphasisTextColor
	},
	paymentSummary: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 15,
		paddingBottom: 15,
		borderBottomColor: colors.bodyTextColor,
		borderBottomWidth: 0.5
	},
	walletBlance: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
		marginTop: 20
	},
	balance: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 8
	},
	buttonContainer: {
		flex: 1,
		flexDirection: 'row',
		width: '100%',
		marginTop: 15,
		justifyContent: 'space-evenly'
	},
	button: {
		width: '45%',
		justifyContent: 'center'
	},
	buttonFullWidth: {
		width: '94%',
		justifyContent: 'center',
		marginBottom: 15
	},
	buttonButtonContainer: {
		flexDirection: 'column'
	}
});

const mapDispatchToProps = (dispatch) => {
	return {
		userPayForTicket: (amount) => dispatch(userPayForTicket(amount)),
		onAddTransaction: (transaction) => dispatch(addTransaction(transaction)),
		addTicket: (ticket) => dispatch(addTicket(ticket))
	};
};

const mapStateToProps = (state) => ({
	user: state.userReducer.user,
	ticketslength: state.ticketReducer.ticketsLength
});

export default connect(mapStateToProps, mapDispatchToProps)(SummaryScreen);
