import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import moment from 'moment';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { Button, Content, Container, Text, StyleProvider, Accordion } from 'native-base';
import Dialog, {
	DialogFooter,
	DialogButton,
	DialogContent,
	DialogTitle,
	SlideAnimation,
} from 'react-native-popup-dialog';
import _ from 'lodash';
import getTheme from '../native-base-theme/components';
import platform from '../native-base-theme/variables/platform';
import GlobalHeader from './GlobalHeader';
import ip from '../server/keys/ipstore';
import uuid from 'uuid/v4';
import colors from '../constants/Colors';
import QRCode from 'react-native-qrcode';

import { connect } from 'react-redux';
import { addTransaction } from '../redux/actions/transactionAction';
import { userPayForTicket } from '../redux/actions/userAction';
import { cancelTicket } from '../redux/actions/ticketAction';
import { postRequestAuthorized, getRequestAuthorized } from '../API';

class TicketDetail extends React.Component {
	static navigationOptions = {
		header: null
	};

	state = {
		cancelTicketPopup: false,
		errors: null
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
		const cancellationFee = 1;

		if(this.props.user.concessionary === 0 && !this.userCanCancel(cancellationFee)) {
			return this.cancelTicketPopupNo();
		}
	
		this.cancellationFeeApplied(ticketDate).then((cancellationFeeApplied) => {
			if (cancellationFeeApplied && this.props.user.concessionary === 0) {
				this.ticketCancelledPost(1, 1);

				this.props.userPayForTicket(cancellationFee);
				this.props.addTransaction({
					current_funds: parseFloat(this.props.user.funds).toFixed(2),
					date: new Date(),
					fk_transaction_type_id: 4,
					fk_user_id: this.props.user.id,
					spent_funds: cancellationFee,
					transaction_id: uuid(),
					type: 'Ticket Cancelled',
					cancellation_fee: 1
				});
			} else {
				// Cancellation fee not applied
				this.ticketCancelledPost(0, 0);
				this.props.addTransaction({
					current_funds: parseFloat(this.props.user.funds).toFixed(2),
					date: new Date(),
					fk_transaction_type_id: 4,
					fk_user_id: this.props.user.id,
					spent_funds: 0.0,
					transaction_id: uuid(),
					type: 'Ticket Cancelled',
					cancellation_fee: 0
				});
			}

			this.props.ticketCancelRedux(this.props.navigation.state.params.ticket.id);
			this.cancelTicketPopupNo();
			this.navigateTo();
		});
	};


	ticketCancelledPost = (amount, cancellationFeeApplied) => {
		const data = {
			ticketId: this.props.navigation.state.params.ticket.id,
			amount: amount,
			cancellationFeeApplied: cancellationFeeApplied
		};

		return postRequestAuthorized(`http://${ip}:3000/user/cancelTicket`, data);
	};

	userCanCancel = (amount) => {
		if (this.props.user.funds - amount < 0) {
			//Throw error, not enough money to pay
			this.setState({ errors: [{ title: 'Errors', content: 'Add funds (£1) to your account to cancel the ticket' }]});
			return false;
		}
		return true;
	}

	cancellationFeeApplied = (ticketDate) => {
		return getRequestAuthorized(
			`http://${ip}:3000/user/cancelTicket/journey?ticketId=${this.props.navigation.state.params.ticket.id}`
		).then((endTime) => {
			const timeDiff = moment(endTime).unix() - moment(ticketDate).unix();

			if (timeDiff <= 7200 && timeDiff >= 0) return Promise.resolve(true);
			return Promise.resolve(false);
		});
	};

	// Sends the pickup locations for each unique ticket
	_getPickupLocation = () => {
		return getRequestAuthorized(
			`http://${ip}:3000/ticket/pickup?id=${this.props.navigation.state.params.ticket.id}`
		)
			.then((response) => {
				return Promise.resolve(response);
			})
			.then((coords) => {
				this.navigateToTrack(coords);
			})
			.catch((error) => console.log(error));
	};

	navigateTo = () => {
		this.props.navigation.navigate('Ticket');
	};

	navigateToTrack = (startCoords) => {
		this.props.navigation.navigate('Track', startCoords);
	};

	render() {
		const ticket = this.props.navigation.state.params.ticket;
		return (
			<StyleProvider style={getTheme(platform)}>
				<Container>
					<GlobalHeader
						type={3}
						header="Ticket Details"
						navigateTo={this.navigateTo}
						isBackButtonActive={1}
					/>
					<Content>
					{this.state.errors && (
							<Accordion
								dataArray={this.state.errors}
								icon="add"
								expandedIcon="remove"
								contentStyle={styles.errorStyle}
								expanded={0}
							/>
						)}
						<View style={styles.card}>
							<View style={styles.ticketTypeContainer}>
								{ticket.expired ? (
									<View style={[ styles.ticketType, { backgroundColor: colors.lightBorder } ]}>
										<Text style={styles.ticketTypeText}>
											{ticket.returnTicket === 1 ? 'RTN' : 'SGL'}
										</Text>
									</View>
								) : (
									<View style={styles.ticketType}>
										<Text style={styles.ticketTypeText}>
											{ticket.returnTicket === 1 ? 'RTN' : 'SGL'}
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
										{ticket.returnTicket ? (
											<IonIcon name="ios-swap" size={30} color={colors.bodyTextColor} />
										) : (
											<IonIcon
												name="ios-arrow-round-forward"
												size={30}
												color={colors.bodyTextColor}
											/>
										)}
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
									style={[ styles.button, { backgroundColor: colors.brandColor } ]}
									onPress={() => {
										this._getPickupLocation();
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
									<Text style={[ styles.body, { marginTop: 5 } ]}>
										{ticket.returnTicket === 1 ? 'RETURN' : 'SINGLE'}
									</Text>
									<View style={styles.icon}>
										<IonIcon name="md-people" size={20} color={colors.bodyTextColor} />
										<Text style={[ styles.body, { marginLeft: 7 } ]}>{ticket.numPassengers}</Text>
									</View>
									{ticket.numWheelchairs > 0 ? (
										<View style={styles.icon}>
											<MaterialIcon name="accessible" size={20} color={colors.bodyTextColor} />
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
							dialogAnimation={new SlideAnimation()}
							width={0.8}
							visible={this.state.cancelTicketPopup}
							dialogTitle={
								<DialogTitle
									textStyle={styles.dialogTitle}
									color={colors.emphasisTextColor}
									title="Ticket Cancellation"
								/>
							}
							footer={
								<DialogFooter>
									<DialogButton
										textStyle={{ color: colors.brandColor }}
										text="Yes"
										onPress={() => this.cancelTicketPopupYes(ticket.startTime)}
									/>
									<DialogButton
										textStyle={{ color: colors.bodyTextColor }}
										text="No"
										onPress={this.cancelTicketPopupNo}
									/>
								</DialogFooter>
							}
							onTouchOutside={this.cancelTicketPopupNo}
						>
							<DialogContent>
								<Text style={styles.dialogBody}>
									Are you sure you want to cancel your journey from{' '}
									<Text style={styles.dialogBodyEmphasised}>
										{ticket.fromCity}, {ticket.fromStreet}
									</Text>{' '}
									to{' '}
									<Text style={styles.dialogBodyEmphasised}>
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
		color: colors.bodyTextColor,
		fontSize: 16
	},
	timeText: {
		color: colors.emphasisTextColor,
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
		color: colors.bodyTextColor,
		fontSize: 14
	},
	icon: {
		flexDirection: 'row',
		alignItems: 'center',
		marginRight: 10,
		marginTop: 5
	},
	label: {
		color: colors.bodyTextColor,
		fontSize: 14,
		fontWeight: 'bold',
		marginTop: 5
	},
	qrCodeContainer: {
		marginTop: 10,
		width: '80%',
		borderWidth: 1,
		borderColor: colors.brandColor,
		borderRadius: 5,
		alignSelf: 'center',
		alignItems: 'center'
	},
	qrHeader: {
		backgroundColor: colors.brandColor,
		alignItems: 'center',
		paddingTop: 5,
		paddingBottom: 5,
		width: '100%'
	},
	qrHeaderText: {
		color: colors.backgroundColor,
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
		color: colors.bodyTextColor,
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
	},
	actionIcons: {
		flex: 1,
		width: '10%',
		justifyContent: 'space-between'
	},
	dialogTitle: {
		color: colors.emphasisTextColor
	},
	dialogBody: {
		color: colors.bodyTextColor
	},
	dialogBodyEmphasised: {
		color: colors.emphasisTextColor
	},
	errorStyle: {
		fontWeight: 'bold',
		backgroundColor: colors.backgroundColor
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
