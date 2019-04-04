import React from 'react';
import { StyleSheet, TouchableOpacity, View, TextInput, KeyboardAvoidingView } from 'react-native';
import { Accordion, Button, Container, Content, Input, Item, StyleProvider, Text } from 'native-base';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';
import GlobalHeader from '../../components/GlobalHeader';
import ip from '../../server/keys/ipstore';
import colors from '../../constants/Colors';

import { connect } from 'react-redux';
import { amendTicket } from '../../redux/actions/ticketAction';
import { postRequestAuthorized } from '../../API';
import SummaryRow from '../../components/SummaryRow';
import CustomDateTimePicker from '../../components/CustomDateTimePicker';
import CustomInput from '../../components/CustomInput';

class AmendTicket extends React.Component {
	static navigationOptions = {
		header: null
	};

	state = {
		isLoadingComplete: false,
		date: null,
		time: null,
		numWheelchair: null,
		errors: [],

		wheelchairFocused: false
	};

	onSubmit = () => {
		const ticket = this.props.navigation.state.params.ticket;
		const data = {
			ticketId: ticket.id,
			date: this.state.date === null ? moment(ticket.date).format('YYYY-MM-DD HH:mm:ss') : this.state.date,
			time: this.state.time === null ? moment(ticket.time).format('YYYY-MM-DD HH:mm:ss') : this.state.time,
			numWheelchair: this.state.numWheelchair === null ? ticket.numWheelchairs : this.state.numWheelchair,
			numPassenger: ticket.numPassengers
		};
		// Send the above data to the server
		postRequestAuthorized(`http://${ip}:3000/amendTicket`, data)
			.then((responseJSON) => {
				switch (responseJSON.status) {
					//Success
					case 10:
						this.props.amendTicket(data);
						this.props.navigation.navigate('Ticket');
						break;
					//Input Validation Failed
					case 0:
						this.setState({
							errors: this.parseErrors(responseJSON.errors)
						});
						break;
				}
			})
			.catch((error) => console.log(error));
	};

	// If there are errors, parse them and return them in an array
	parseErrors = (errorList) => {
		var errors = {
			title: 'Errors',
			content: ''
		};

		for (var i = 0; i < errorList.length; i++) {
			errors.content += errorList[i].msg + '\n';
		}

		return [errors];
	};

	navigateTo = () => {
		this.props.navigation.navigate('Details');
	};

	// Functionality to show/hide the date picker and to set the state
	_showDatePicker = () => this.setState({ isDatePickerVisible: true });
	_hideDatePicker = () => this.setState({ isDatePickerVisible: false });

	_handleDatePicked = (newDate) => {
		this.setState({ date: moment(newDate).format('YYYY-MM-DD HH:mm:ss') });
		this._hideDatePicker();
	};

	// Functionality to show/hide the time picker and to set the state
	_showTimePicker = () => this.setState({ isTimePickerVisible: true });
	_hideTimePicker = () => this.setState({ isTimePickerVisible: false });

	_handleTimePicked = (newTime) => {
		this.setState({ time: moment(newTime).format('YYYY-MM-DD HH:mm:ss') });
		this._hideTimePicker();
	};

	render() {
		const data = this.props.navigation.state.params.ticket;
		return (
			<StyleProvider style={getTheme(platform)}>
				<Container>
					<GlobalHeader
						type={3}
						header="Amend Ticket Details"
						navigateTo={this.navigateTo}
						isBackButtonActive={1}
					/>

					{/* Display error messages for validation in an accordion */}
					<KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
						<Content style={styles.content}>
							{this.state.errors &&
								!!this.state.errors.length && (
									<Accordion
										dataArray={this.state.errors}
										icon="add"
										expandedIcon="remove"
										contentStyle={styles.errorStyle}
										expanded={0}
									/>
								)}
							{this.state.error && (
								<Accordion
									dataArray={this.state.error}
									icon="add"
									expandedIcon="remove"
									contentStyle={styles.errorStyle}
									expanded={0}
								/>
							)}

							{/* Summary of the current ticket */}
							<View style={styles.contentContainer}>
								<View style={styles.summaryCard}>
									<View style={styles.cardContent}>
										<View style={styles.details}>
											<View>
												<Text style={styles.header2}>CURRENT TICKET DETAILS</Text>
												<SummaryRow iconName="date-range" value={moment(data.date).format('MMMM Do YYYY')} />
												<SummaryRow iconName="access-time" value={moment(data.time).format('LT')} />
												<SummaryRow iconName="my-location" value={[data.fromStreet] + ", " + [data.fromCity]} />
												<SummaryRow iconName="location-on" value={[data.toStreet] + ", " + [data.toCity]} />
												<SummaryRow iconName="people" value={[data.numPassengers] + " " + [data.numPassengers > 1 ? 'Passengers' : 'Passenger']} />
												{data.numWheelchairs > 0 &&
													<SummaryRow iconName="accessible" value={[data.numWheelchairs] + " " + [data.numWheelchairs > 1 ? 'Wheelchairs' : 'Wheelchair']} />
												}
											</View>
										</View>
									</View>
								</View>

								{/* Inputs to amend ticket including date, time and wheelchairs */}
								<View style={styles.inputs}>
									<Text style={styles.body}>
										If you wish to change details relating to the start/end locations or total
										number of passengers, please cancel this ticket and re-book.
									</Text>

									{/* Date picker */}
									<CustomDateTimePicker
										placeholder="Date"
										onPress={this._showDatePicker}
										mode="date"
										isVisible={this.state.isDatePickerVisible}
										onConfirm={(value) => this._handleDatePicked(value)}
										onCancel={this._hideDatePicker}
										iconName="date-range"
										format='Do MMM YY'
										value={this.state.date}
									/>

									{/* Time picker */}
									<CustomDateTimePicker
										placeholder="Time"
										onPress={this._showTimePicker}
										mode="time"
										isVisible={this.state.isTimePickerVisible}
										onConfirm={(value) => this._handleTimePicked(value)}
										onCancel={this._hideTimePicker}
										iconName="access-time"
										format='LT'
										value={this.state.time}
									/>

									{/* Number of wheelchairs input */}
									<CustomInput
										focused={this.state.wheelchairFocused}
										iconName="accessible"
										placeholder={"No. of wheelchairs"}
										value={this.state.numWheelchair ? this.state.numWheelchair.toString() : null}
										onFocus={() => this.setState({ wheelchairFocused: true })}
										onBlur={() => this.setState({ wheelchairFocused: false })}
										onChangeText={(value) => this.setState({ numWheelchair: value })}
										onRef={(ref) => (this.textInputWheelChair = ref)}
									/>

									{/* Submit amendments */}
									<View style={styles.buttonContainer}>
										<Button danger style={styles.button} onPress={this.onSubmit}>
											<Text>Amend</Text>
										</Button>
									</View>
								</View>
							</View>
						</Content>
					</KeyboardAvoidingView>
				</Container>
			</StyleProvider>
		);
	}
}

const styles = StyleSheet.create({
	content: {
		flex: 1
	},
	contentContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'flex-end'
	},
	inputs: {
		width: '80%',
		flex: 1,
		alignSelf: 'center',
		marginTop: 10
	},
	header2: {
		fontSize: 16,
		color: colors.emphasisTextColor,
		marginTop: 10,
		marginBottom: 10
	},
	body: {
		color: colors.bodyTextColor,
		fontSize: 16
	},
	summaryCard: {
		width: '100%',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		shadowOffset: { width: 0, height: -20 },
		shadowColor: 'black',
		shadowOpacity: 1,
		elevation: 5,
		backgroundColor: colors.backgroundColor,
		marginBottom: 15
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
	buttonContainer: {
		flexDirection: 'row',
		alignSelf: 'center',
		marginTop: 15,
		marginBottom: 15,
		alignItems: 'center'
	},
	button: {
		width: '100%',
		justifyContent: 'center',
		backgroundColor: colors.brandColor
	}
});

const mapDispatchToProps = (dispatch) => {
	return {
		amendTicket: (data) => dispatch(amendTicket(data))
	};
};

export default connect(null, mapDispatchToProps)(AmendTicket);
