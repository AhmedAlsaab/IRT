import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import moment from 'moment';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { Button, Content, Container, Text, StyleProvider } from 'native-base';
import Dialog, { DialogFooter, DialogButton, DialogContent, DialogTitle } from 'react-native-popup-dialog';
import getTheme from '../native-base-theme/components';
import platform from '../native-base-theme/variables/platform';
import GlobalHeader from '../components/GlobalHeader';
import ip from '../ipstore';
import uuid from 'uuid/v4';

import { connect } from 'react-redux';
import { addTransaction } from '../redux/actions/transactionAction';
import { userPayForTicket } from '../redux/actions/userAction';
import { cancelTicket } from '../redux/actions/ticketAction';

class TicketDetail extends React.Component {
	static navigationOptions = {
		header: null
	};

	state = {
		cancelTicketPopup: false
	};

	amendTicket = (ticketData) => {
		this.props.navigation.navigate('Amend', { ticket: ticketData });
	};

	cancelTicketPopup = () => {
		this.setState({
			cancelTicketPopup: true
		});
	};

	cancelTicketPopupNo = () => {
		this.setState({
			cancelTicketPopup: false
		});
	};

	cancelTicketPopupYes = (ticketDate) => {
		// Cancellation fee applied
		if (this.cancellationFeeApplied(ticketDate)) {
			new Promise((resolve, reject) => {
				this.props.userPayForTicket(1);
				resolve();
			}).then(() => {
				this.props.addTransaction({
					current_funds: parseFloat(this.props.user.funds).toFixed(2),
					date: new Date(),
					fk_transaction_type_id: 4,
					fk_user_id: this.props.user.id,
					spent_funds: 1,
					transaction_id: uuid(),
					type: 'Ticket Cancelled',
					cancellation_fee: 1
				});
			});
			this.ticketCancelledPost(0, 1);
		} else {
			// Cancellation fee not applied
			this.props.addTransaction({
				current_funds: parseFloat(this.props.user.funds).toFixed(2),
				date: new Date(),
				fk_transaction_type_id: 4,
				fk_user_id: this.props.user.id,
				spent_funds: 0,
				transaction_id: uuid(),
				type: 'Ticket Cancelled',
				cancellation_fee: 0
			});
			this.ticketCancelledPost(0, 0);
		}

		this.props.ticketCancelRedux(this.props.navigation.state.params.ticket.id);
		this.cancelTicketPopupNo();
		this.navigateTo();
	};

	cancellationFeeApplied = (ticketDate) => {
		//Mock date at the moment, until we can get a journey time
		const journeytime = moment(ticketDate).add(1, 'hour');
		const timeDiff = moment(journeytime).unix() - moment(ticketDate).unix();

		if (timeDiff <= 7200 && timeDiff >= 0) return true;
		return false;
	};

	ticketCancelledPost = (amount, cancellationFeeApplied) => {
		const data = {
			ticketId: this.props.navigation.state.params.ticket.id,
			amount: amount,
			cancellationFeeApplied: cancellationFeeApplied
		};

		return fetch(`http://${ip}:3000/user/cancelTicket`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		}).catch((err) => {});
	};

	navigateTo = () => {
		this.props.navigation.navigate('Ticket');
	};

	navigateToTrack = () => {
		this.props.navigation.navigate('Track');
	};

	render() {
		const ticket = this.props.navigation.state.params.ticket;
		return (
			<StyleProvider style={getTheme(platform)}>
				<Container>
					<GlobalHeader type={3} header='Ticket Details'  navigateTo={this.navigateTo} isBackButtonActive={1} />
					<Content>
						<View style={styles.card}>
							<View style={styles.ticketTypeContainer}>
								{ticket.expired ? (
									<View style={[ styles.ticketType, { backgroundColor: '#bcbcbc' } ]}>
										<Text style={styles.ticketTypeText}>
											SGL
											{/* Code prepared for return tickets - don't remove */}
											{/* {ticket.return === 1 ? 'RTN' : 'SGL'} */}
										</Text>
									</View>
								) : (
									<View style={styles.ticketType}>
										<Text style={styles.ticketTypeText}>
											SGL
											{/* Code prepared for return tickets - don't remove */}
											{/* {ticket.return === 1 ? 'RTN' : 'SGL'} */}
										</Text>
									</View>
								)}
							</View>
							<View style={styles.ticket}>
								<View style={styles.ticketHeader}>
									<View style={styles.ticketDateTime}>
										<Text style={styles.dateText}>
											{moment(ticket.date).format('Do MMMM YYYY')}
										</Text>
										<Text style={styles.timeText}>{moment(ticket.time).format('LT')}</Text>
									</View>
								</View>
								<View style={styles.ticketDetails}>
									<View style={styles.ticketFrom}>
										<Text style={styles.body}>
											{ticket.fromStreet}, {ticket.fromCity}
										</Text>
									</View>
									<View style={styles.ticketTypeIcon}>
										{/* Code prepared for return tickets - don't remove */}
										{/* {ticket.return ?
									<Icon name="ios-swap" size={30} color="#999999" />
									:
									<Icon name="ios-arrow-round-forward" size={30} color="#999999" />
								} */}
										<IonIcon name="ios-arrow-round-forward" size={30} color="#999999" />
									</View>
									<View style={styles.ticketTo}>
										<Text style={styles.body}>
											{ticket.toStreet}, {ticket.toCity}
										</Text>
									</View>
								</View>
							</View>
						</View>

						<View style={styles.qrCodeContainer}>
							<View style={styles.qrHeader}>
								<Text style={styles.qrHeaderText}>TICKET QR CODE</Text>
							</View>
							<View style={styles.qrCode}>
								<Image
									source={require('../assets/images/qrcode.jpg')}
									style={{
										width: 150,
										height: 150,
										borderRadius: 10,
										alignSelf: 'center'
									}}
								/>
							</View>
						</View>

						{ticket.expired === 0 &&
						ticket.cancelled === 0 && (
							<View style={styles.buttonContainer}>
								<Button
									danger
									style={[ styles.button, { backgroundColor: '#ff0000' } ]}
									onPress={() => {
										this.navigateToTrack();
									}}
								>
									<Text style={styles.buttonText}>TRACK VEHICLE</Text>
								</Button>
							</View>
						)}

						<View style={styles.itineraryContainer}>
							<Text style={styles.heading}>ITINERARY DETAILS</Text>
							<View style={styles.itinerary}>
								<View style={styles.labels}>
									<Text style={styles.label}>Ticket type:</Text>
									<Text style={styles.label}>Passengers:</Text>
								</View>
								<View style={styles.details}>
									<Text style={[ styles.body, { marginTop: 5 } ]}>Single journey</Text>
									<View style={styles.icon}>
										<IonIcon name="md-people" size={20} color="#999999" />
										<Text style={[ styles.body, { marginLeft: 7 } ]}>{ticket.numPassengers}</Text>
									</View>
									{ticket.numWheelchairs > 0 ? (
										<View style={styles.icon}>
											<MaterialIcon name="accessible" size={20} color="#999999" />
											<Text style={[ styles.body, { marginLeft: 5 } ]}>
												{ticket.numWheelchairs}
											</Text>
										</View>
									) : null}
								</View>
							</View>
						</View>

						{ticket.expired === 0 &&
						ticket.cancelled === 0 && (
							<View style={styles.buttonContainer}>
								<Button danger bordered style={styles.button} onPress={this.cancelTicketPopup}>
									<Text style={styles.buttonText}>CANCEL</Text>
								</Button>

								<Button
									danger
									bordered
									style={styles.button}
									onPress={() => {
										this.amendTicket(ticket);
									}}
								>
									<Text style={styles.buttonText}>AMEND</Text>
								</Button>
							</View>
						)}

						<Dialog
							width={0.8}
							visible={this.state.cancelTicketPopup}
							dialogTitle={<DialogTitle title="Ticket Cancellation" />}
							footer={
								<DialogFooter>
									<DialogButton text="No" onPress={this.cancelTicketPopupNo} />
									<DialogButton
										text="Yes"
										onPress={() => this.cancelTicketPopupYes(ticket.startTime)}
									/>
								</DialogFooter>
							}
							onTouchOutside={this.cancelTicketPopupNo}
						>
							<DialogContent>
								<Text>
									Are you sure you want to cancel your journey from{' '}
									<Text style={{ fontWeight: 'bold' }}>
										{ticket.fromCity}, {ticket.fromStreet}
									</Text>{' '}
									to{' '}
									<Text style={{ fontWeight: 'bold' }}>
										{ticket.toCity}, {ticket.toStreet}
									</Text>?
								</Text>
							</DialogContent>
						</Dialog>
					</Content>
				</Container>
			</StyleProvider>
		);
	}
}

const styles = StyleSheet.create({
	card: {
		flex: 1,
		flexDirection: 'row',
		marginTop: 15
	},
	ticketTypeContainer: {
		width: '10%',
		marginRight: 10,
		flexDirection: 'row'
	},
	ticketType: {
		backgroundColor: '#ff0000',
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
		color: '#fff',
		fontWeight: 'bold'
	},
	ticket: {
		width: '90%',
		flex: 1,
		flexDirection: 'column'
	},
	ticketHeader: {
		flexDirection: 'row',
		marginTop: 10
	},
	ticketDateTime: {
		width: '57%'
	},
	dateText: {
		color: '#999999',
		fontSize: 16
	},
	timeText: {
		color: '#666666',
		fontSize: 18,
		marginTop: 5
	},
	ticketDetails: {
		marginTop: 5,
		flex: 1,
		flexDirection: 'row',
		marginBottom: 10,
		width: '98%'
	},
	ticketFrom: {
		width: '40%',
		marginRight: 10,
		justifyContent: 'center'
	},
	ticketTypeIcon: {
		width: '10%',
		marginRight: 15,
		justifyContent: 'center',
		alignItems: 'center'
	},
	ticketTo: {
		width: '40%',
		justifyContent: 'center'
	},
	body: {
		color: '#999999',
		fontSize: 14
	},
	icon: {
		flexDirection: 'row',
		alignItems: 'center',
		marginRight: 10,
		marginTop: 5
	},
	label: {
		color: '#999999',
		fontSize: 14,
		fontWeight: 'bold',
		marginTop: 5
	},
	qrCodeContainer: {
		marginTop: 10,
		width: '80%',
		borderWidth: 1,
		borderColor: '#ff0000',
		borderRadius: 5,
		alignSelf: 'center'
	},
	qrHeader: {
		backgroundColor: '#ff0000',
		alignItems: 'center',
		paddingTop: 5,
		paddingBottom: 5
	},
	qrHeaderText: {
		color: '#fff',
		fontSize: 14
	},
	itineraryContainer: {
		width: '80%',
		marginTop: 15,
		alignSelf: 'center'
	},
	itinerary: {
		flexDirection: 'row'
	},
	heading: {
		color: '#999999',
		fontSize: 15,
		marginBottom: 10
	},
	labels: {
		width: '50%'
	},
	details: {
		width: '50%'
	},
	buttonContainer: {
		flex: 1,
		flexDirection: 'row',
		width: '100%',
		marginTop: 15,
		justifyContent: 'space-evenly',
		marginBottom: 15
	},
	button: {
		width: '45%',
		justifyContent: 'center'
	}
});

const mapStateToProps = (state) => ({
	user: state.userReducer.user
});

const mapDispatchToProps = (dispatch) => {
	return {
		userPayForTicket: (amount) => dispatch(userPayForTicket(amount)),
		addTransaction: (transaction) => dispatch(addTransaction(transaction)),
		ticketCancelRedux: (ticketId) => dispatch(cancelTicket(ticketId))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(TicketDetail);
