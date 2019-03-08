import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Content, Container, Button, Text, StyleProvider, Item, Row } from 'native-base';
import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';
import GlobalHeader from '../../components/GlobalHeader';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ip from '../../ipstore';
import WalletBalance from './WalletBalance';
import uuid from 'uuid/v4';

import { connect } from 'react-redux';
import { addTransaction } from '../../actions/transactionAction';
import { userPayForTicket } from '../../actions/userAction';

class SummaryScreen extends React.Component {
	static navigationOptions = {
		header: null
	};

	state = {
		isLoadingComplete: false,
		data: [],
		date: new Date(),
		dateOptions: { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' },
		total: 0.0
	};

	// fetchData = async () => {
	// 	const response = await fetch(`http://${ip}:3000/journey`);
	// 	const JSONresponse = await response.json();
	// 	console.log(JSONresponse);
	// 	this.setState({ data: JSONresponse });
	// };

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
				wheelchair: numWheelchair,
			},
			date: moment(date).format('MMMM Do YYYY'),
			email: this.props.user.email,
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
		})
			.catch((error) => console.log(error));
	};

	componentDidMount() {
		const { numPassenger } = this.props.navigation.state.params;
		this.setState({
			total: parseInt(numPassenger * 3)
		});
	}

	payForTicket = () => {
		if (this.props.user.funds - this.state.total <= 0) {
			//Throw error, not enough money to pay
			return;
		}
		//Pay for Ticket
		//Add Transaction
		const data = {
			current_funds: parseFloat(parseInt(this.props.user.funds) - parseInt(this.state.total)).toFixed(2),
			spent_funds: this.state.total,
			fk_transaction_type_id: 1
		};

		fetch(`http://${ip}:3000/user/addTransaction`, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
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
					type: 'Ticket Purchased'
				});
			})
			.catch((error) => console.log(error));

		const { date, street, endStreet, numPassenger, numWheelchair, city, endCity } = this.props.navigation.state.params;
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
		this.props.navigation.navigate('Confirmation', navData);

	};

	payWithConcessionary = () => {
		const data = {
			current_funds: this.props.user.funds,
			spent_funds: 0.00,
			fk_transaction_type_id: 3
		};

		fetch(`http://${ip}:3000/user/addTransaction`, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
			.then((reponse) => reponse.json())
			.then((response) => {
				if (response.status !== 10) return;

				this.props.userPayForTicket(0.00);

				this.props.onAddTransaction({
					current_funds: parseFloat(this.props.user.funds).toFixed(2),
					date: new Date(),
					fk_transaction_type_id: 3,
					fk_user_id: this.props.user.id,
					spent_funds: 0.00,
					transaction_id: uuid(),
					type: 'Concessionary Ticket'
				});
			})

		const { date, street, endStreet, numPassenger, numWheelchair, city, endCity } = this.props.navigation.state.params;
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
		this.props.navigation.navigate('Confirmation', navData);
	}

	navigateTo = () => {
		this.props.navigation.navigate('Home');
	};

	render() {
		const data = this.props.navigation.state.params;
		console.log(this.props.user)
		return (
			<StyleProvider style={getTheme(platform)}>
				<Container>
					<Content>
						<GlobalHeader
							type={1}
							navigateTo={this.navigateTo}
							isBackButtonActive={1}
						/>
						<View>
							{/* Page header and introductory text */}
							<View style={styles.introduction}>
								<Text style={styles.header1}>YOUR JOURNEY</Text>
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
												<Icon name="date-range" size={20} color="#bcbcbc" />
												<Text style={styles.cardBody}>
													{moment(data.date).format('MMMM Do YYYY')}
												</Text>
											</View>
											<View style={styles.icon}>
												<Icon name="my-location" size={20} color="#bcbcbc" />
												<Text style={styles.cardBody}>
													{data.street}, {data.city}
												</Text>
											</View>
										</View>

										<View>
											<View style={styles.icon}>
												<Icon name="location-on" size={20} color="#bcbcbc" />
												<Text style={styles.cardBody}>
													{data.endStreet}, {data.endCity}
												</Text>
											</View>
											<View style={styles.icon}>
												<Icon name="people" size={20} color="#bcbcbc" />
												<Text style={styles.cardBody}>
													{data.numPassenger}
													{data.numPassenger > 1 ? ' Passengers' : ' Passenger'}
												</Text>
											</View>
											<View style={styles.icon}>
												<Icon name="people" size={20} color="#bcbcbc" />
												<Text style={styles.cardBody}>
													{data.numWheelchair}
													{data.numWheelchair > 1 ? ' Wheelchairs' : ' Wheelchair'}
												</Text>
											</View>
										</View>
									</View>
									<View style={styles.journeyInfo}>
										<Text style={styles.cardBody}>£3.00</Text>
										<Icon name="directions-bus" size={65} color="#bcbcbc" />
										<Text style={styles.cardVehicle}>Minibus</Text>
									</View>
								</View>
							</View>

							{/* Payment summary and options */}
							<View style={styles.paymentInfo}>
								<Text style={styles.header2}>PAYMENT</Text>
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
									{this.props.user.concessionary == 0 &&
										<View style={styles.buttonContainer}>
											<Button
												danger
												style={[styles.button, { backgroundColor: '#ff0000' }]}
												onPress={this.payForTicket}
											>
												<Text style={styles.buttonText}>Pay</Text>
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
									}
									{this.props.user.concessionary == 1 &&
										<View style={styles.buttonButtonContainer}>
											<View style={styles.buttonContainer}>
												<Button
													danger
													style={[styles.button, { backgroundColor: '#ff0000' }]}
													onPress={this.payForTicket}
												>
													<Text style={styles.buttonText}>Pay</Text>
												</Button>

												<Button
													danger
													style={[styles.button, { backgroundColor: '#ff0000' }]}
													onPress={() => {
														this.props.navigation.navigate('AddFunds');
													}}
												>
													<Text style={styles.buttonText}>Add Funds</Text>
												</Button>
											</View>
											<View style={[styles.buttonContainer, { marginTop: -17, marginBottom: 25 }]}>
												<Button bordered danger style={styles.buttonFullWidth} onPress={this.payWithConcessionary}>
													<Text style={styles.buttonText}>Concessionary</Text>
												</Button>
											</View>
										</View>}
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
		marginTop: 15,
		width: '80%',
		flex: 1,
		flexDirection: 'column',
		alignSelf: 'center'
	},
	header1: {
		width: '80%',
		fontSize: 28,
		color: 'gray',
		marginBottom: 5
	},
	header2: {
		fontSize: 16,
		color: '#bcbcbc',
		marginTop: 15,
		marginBottom: 10
	},
	body: {
		color: '#bcbcbc',
		fontSize: 16
	},
	summaryCard: {
		flex: 1,
		alignItems: 'center',
		marginTop: 15,
		width: '100%',
		borderTopWidth: 0.5,
		borderTopColor: '#d3d3d3',
		borderBottomWidth: 0.5,
		borderBottomColor: '#d3d3d3'
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
		fontSize: 18,
		color: 'gray',
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
		color: 'gray'
	},
	paymentSummary: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 15,
		paddingBottom: 15,
		borderBottomColor: '#d3d3d3',
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
		justifyContent: 'space-evenly',
	},
	button: {
		width: '45%',
		justifyContent: 'center'
	},
	buttonFullWidth: {
		width: '94%',
		justifyContent: 'center',
		marginBottom: 15,
	},
	buttonButtonContainer: {
		flexDirection: 'column'
	}
});

const mapDispatchToProps = (dispatch) => {
	return {
		userPayForTicket: (amount) => dispatch(userPayForTicket(amount)),
		onAddTransaction: (transaction) => dispatch(addTransaction(transaction))
	};
};

const mapStateToProps = (state) => ({
	user: state.userReducer.user
});

export default connect(mapStateToProps, mapDispatchToProps)(SummaryScreen);
