import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { Content, Container, Button, Text, StyleProvider, Item, Row } from 'native-base';
import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';
import GlobalHeader from '../../components/GlobalHeader';
import moment from 'moment';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';

import ip from '../../server/keys/ipstore';
import WalletBalance from '../../components/WalletBalance';
import uuid from 'uuid/v4';
import { Location, Permissions, Notifications } from 'expo';
import { connect } from 'react-redux';
import { addTransaction } from '../../redux/actions/transactionAction';
import { userPayForTicket } from '../../redux/actions/userAction';
import { addTicket } from '../../redux/actions/ticketAction';
import colors from '../../constants/Colors';
import { postRequestAuthorized } from '../../API';
import SummaryRow from '../../components/SummaryRow';

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
		deviceToken: '',
		locationResult: ''
	};

	// Asking & Checking location Permissions
	_getLocationPermissionAsync = async () => {
		let { status } = await Permissions.askAsync(Permissions.LOCATION);
		if (status !== 'granted') {
			this.setState({
				locationResult: 'Permission to access location was denied'
			});
			console.log(locationResult);
		}
	};

	sendEmail = () => {
		const {
			date,
			time,
			street,
			endStreet,
			numPassenger,
			numWheelchair,
			returnTicket,
			city,
			endCity
		} = this.props.navigation.state.params.jData;
		//Send data to the server
		const data = {
			data: {
				startLocation: `${street}, ${city}`,
				endLocation: `${endStreet}, ${endCity}`,
				passenger: numPassenger,
				wheelchair: numWheelchair,
				returnTicket: returnTicket
			},
			date: moment(date).format('MMMM Do YYYY'),
			time: moment(time).format('LT'),
			email: this.props.user.email
		};

		postRequestAuthorized(`http://${ip}:3000/booking/sendEmail`, data);
	};

	bookJourney = () => {
		const data = this.props.navigation.state.params;
		postRequestAuthorized(`http://${ip}:3000/booking/book`, data);
	};

	componentDidMount() {
		this._getLocationPermissionAsync();
		const { numPassenger, returnTicket } = this.props.navigation.state.params.jData;

		if (returnTicket === 1) {
			this.setState({
				total: parseInt(numPassenger * (3 * 2))
			});
		} else {
			this.setState({
				total: parseInt(numPassenger * 3)
			});
		}

		// Channel for popup notifications
		if (Platform.OS === 'android') {
			Expo.Notifications.createChannelAndroidAsync('reminders', {
				name: 'Reminders',
				priority: 'max',
				vibrate: [ 0, 250, 250, 250 ]
			});
		}
	}
	async componentWillMount() {
		await this.registerForPushNotificationsAsync();
	}

	payForTicket = () => {
		if (this.props.user.funds - this.state.total < 0) {
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
			returnTicket,
			city,
			endCity,
			time
		} = this.props.navigation.state.params.jData;
		const data = {
			current_funds: parseFloat(parseInt(this.props.user.funds) - parseInt(this.state.total)).toFixed(2),
			spent_funds: this.state.total,
			fk_transaction_type_id: 1
		};

		postRequestAuthorized(`http://${ip}:3000/user/addTransaction`, data)
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
					returnTicket: returnTicket,
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
			returnTicket,
			city,
			endCity
		} = this.props.navigation.state.params.jData;

		const data = {
			current_funds: this.props.user.funds,
			spent_funds: 0.0,
			fk_transaction_type_id: 3
		};

		postRequestAuthorized(`http://${ip}:3000/user/addTransaction`, data).then((response) => {
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
			return: returnTicket,
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

	// Sends the notification to the server hosted by EXPO specifically for push notifications
	// The server sends the noification back with the specfied values (fetched from the indicated state)
	// Sends it to the provided GCM / Device Token
	sendPushNotification = () => {
		const { date, street } = this.props.navigation.state.params.jData;

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
				body: `Thank you for booking with TFW. The bus will pick you up from ${street} on ${moment(date).format(
					'MMMM Do YYYY'
				)}. You will receive a time-slot confirmation prior to the bus departing. Please view your email for further information `, // insert service number, pickup location
				sound: 'default', // android 7.0 , 6, 5 , 4
				channelId: 'reminders', // android 8.0 later
				icon: '../../assets/images/Notification_Icon_3.png'
			})
		});
	};

	navigateTo = () => {
		this.props.navigation.navigate('Results');
	};

	render() {
		const data = this.props.navigation.state.params.jData;
		return (
			<StyleProvider style={getTheme(platform)}>
				<Container>
					<GlobalHeader
						type={3}
						header="Journey Summary"
						navigateTo={this.navigateTo}
						isBackButtonActive={1}
					/>
					<Content>
						<View>
							{/* Page header and introductory text */}
							<View style={styles.introduction}>
								<Text style={styles.body}>
									Times are an approximation and subject to change. You will receive confirmation on
									the day of travel.
								</Text>
							</View>

							{/* The summary card showing booking information */}
							<View style={styles.cardContent}>
								<View style={styles.ticketTypeContainer}>
									<View style={styles.ticketType}>
										<Text style={styles.ticketTypeText}>
											{data.returnTicket === 1 ? 'RTN' : 'SGL'}
										</Text>
									</View>
								</View>
								<View style={styles.details}>
									<View>
										<SummaryRow
											iconName="date-range"
											value={moment(data.date).format('MMMM Do YYYY')}
										/>
										<SummaryRow iconName="access-time" value={moment(data.time).format('LT')} />
										<SummaryRow
											iconName="my-location"
											value={[ data.street ] + ', ' + [ data.city ]}
										/>
										<SummaryRow
											iconName="location-on"
											value={[ data.endStreet ] + ', ' + [ data.endCity ]}
										/>
										<SummaryRow
											iconName="people"
											value={
												[ data.numPassenger ] +
												' ' +
												[ data.numPassenger > 1 ? 'Passengers' : 'Passenger' ]
											}
										/>
										{data.numWheelchair > 0 && (
											<SummaryRow
												iconName="accessible"
												value={
													[ data.numWheelchair ] +
													' ' +
													[ data.numWheelchair > 1 ? 'Wheelchairs' : 'Wheelchair' ]
												}
											/>
										)}
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
									<Text style={styles.ticketBreakdown}>
										{data.numPassenger} x
										{data.returnTicket === 1 ? ' RETURN' : ' SINGLE'}
										{data.numPassenger > 1 ? ' tickets' : ' ticket'}
									</Text>
									<Text style={styles.paymentText}>£{this.state.total}.00</Text>
								</View>

								{/* Wallet information */}
								<View style={styles.walletBlance}>
									<WalletBalance type={2} />
									{this.props.user.concessionary == 0 && (
										<View style={styles.buttonContainer}>
											<Button
												danger
												style={[ styles.button, { backgroundColor: colors.brandColor } ]}
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
													style={[ styles.button, { backgroundColor: colors.brandColor } ]}
													onPress={this.payForTicket}
												>
													<Text style={styles.buttonText}>Pay</Text>
												</Button>

												<Button
													danger
													style={[ styles.button, { backgroundColor: colors.brandColor } ]}
													onPress={() => {
														this.props.navigation.navigate('AddFunds');
													}}
												>
													<Text style={styles.buttonText}>Add Funds</Text>
												</Button>
											</View>
											<View
												style={[ styles.buttonContainer, { marginTop: -5, marginBottom: 25 } ]}
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
		marginBottom: 10
	},
	body: {
		color: colors.bodyTextColor,
		fontSize: 16
	},
	cardContent: {
		flexDirection: 'row',
		marginTop: 15,
		marginBottom: 15,
		paddingTop: 10,
		shadowOffset: { width: 0, height: -20 },
		shadowColor: 'black',
		shadowOpacity: 1,
		elevation: 5,
		backgroundColor: colors.backgroundColor
	},
	details: {
		width: '90%'
	},
	paymentInfo: {
		width: '80%',
		alignSelf: 'center'
	},
	ticketBreakdown: {
		color: colors.bodyTextColor,
		alignItems: 'center',
		justifyContent: 'center'
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
		borderBottomColor: colors.lightBorder,
		borderBottomWidth: 0.75
	},
	walletBlance: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
		marginTop: 20
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
	},
	ticketTypeContainer: {
		width: '10%',
		marginRight: 10,
		flexDirection: 'row'
	},
	ticketType: {
		backgroundColor: colors.brandColor,
		top: 10,
		flex: 1,
		alignSelf: 'flex-start',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		borderTopRightRadius: 5,
		borderBottomRightRadius: 5,
		paddingTop: 2,
		paddingBottom: 3
	},
	ticketTypeText: {
		color: colors.backgroundColor,
		fontWeight: 'bold',
		fontSize: 14
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
