import PolyLine from '@mapbox/polyline';
import _ from 'lodash';
import moment from 'moment';
import { Button, Container, Content, StyleProvider, Text } from 'native-base';
import React, { Component } from 'react';
import { Keyboard, StyleSheet, TouchableHighlight, TouchableOpacity, View, TextInput } from 'react-native';
import Collapsible from 'react-native-collapsible';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import GlobalHeader from '../../components/GlobalHeader';
import API_KEY from '../../google_api_key';
import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';
import colors from '../../constants/Colors';

import { connect } from 'react-redux';
import { fetchTickets } from '../../redux/actions/ticketAction';

class JourneyScreen extends Component {
	static navigationOptions = {
		header: null
	};

	// Temporary states --> These should be in app.js
	constructor(props) {
		super(props);
		this.state = {
			fromFocused: false,
			toFocused: false,
			groupFocused: false,
			wheelchairFocused: false,

			switchValue: false,
			error: '',
			latitude: 0,
			longitude: 0,
			locationPredictions: [],

			isCollapsed: true,
			isDatePickerVisible: false,
			isTimePickerVisible: false,

			from: 'duke street',
			to: 'cathays',
			date: new Date (),
			time: new Date (),
			numPassenger: 1,
			numWheelchair: null,

			//StartLocation
			locationPredictions: [],
			placeID:
				'EhxTb3V0aCBQYXJrIFJvYWQsIENhcmRpZmYsIFVLIi4qLAoUChIJpatKxdccbkgRQ2yDFI_iUzESFAoSCamRx0IRO1oCEXoliDJDoPjE',
			street: 'South Park Road',
			city: 'Cardiff',
			country: 'UK',
			lat: '51.4816575,',
			lng: '-3.1458798,',
			startType: 1,

			//EndLocation
			endLocationPredictions: [],
			endPlaceID:
				'Eh9Tb3V0aCBDbGl2ZSBTdHJlZXQsIENhcmRpZmYsIFVLIi4qLAoUChIJpSXnPloDbkgRaZvKffcCrskSFAoSCfVT7DTUAm5IEQ5nhmXbBjQU',
			endStreet: 'South Clive Street',
			endCity: 'Cardiff',
			endCountry: 'UK',
			endLat: '51.4599197,',
			endLng: '-3.1844829,',
			endType: 2
		};
		this.startPositionDebounced = _.debounce(this.startPosition, 500);
		this.endLocationDebounced = _.debounce(this.endLocation, 500);
	}

	componentDidMount() {
		this.props.fetchTickets()
	}
	// Sets the state when each input is changed

	handleNumPassengersChange = (value) => {
		this.setState({ numPassenger: value });
	};

	handleNumWheelchairChange = (value) => {
		this.setState({ numWheelchair: value });
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

	_handleSwitchToggle = () =>
		this.setState((state) => ({
			switchValue: !state.switchValue
		}));

	// Toggles advanced search inputs
	toggleAdvanced = () => {
		this.setState({
			isCollapsed: !this.state.isCollapsed
		});
	};

	// Restricited search to cardiff - Check Coords
	// Radius of search is 3000 meters from location coords
	// Strictbounds ensures that no suggestions appear that are not within these paramaters

	getRouteDirections = async () => {
		const { placeID, endPlaceID, date, time } = this.state;

		if (placeID.length === 0 || endPlaceID.length === 0) {
			return console.log('Waiting for second input');
		}

		try {
			const response = await fetch(
				`https://maps.googleapis.com/maps/api/directions/json?origin=place_id:${placeID}&destination=place_id:${endPlaceID}&key=${API_KEY}`
			);
			// const startLoc = "EhlRdWVlbiBTdHJlZXQsIENhcmRpZmYsIFVLIi4qLAoUChIJd_pfUbccbkgR8GM8fGAnzNYSFAoSCamRx0IRO1oCEXoliDJDoPjE";
			const json = await response.json();
			const points = PolyLine.decode(json.routes[0].overview_polyline.points);
			iStartLat = json.routes[0].legs[0].start_location.lat;
			const iStartLng = json.routes[0].legs[0].start_location.lng;
			const iEndLat = json.routes[0].legs[0].end_location.lat;
			const iEndLng = json.routes[0].legs[0].end_location.lng;
			const pointCoords = points.map((point) => {
				return { latitude: point[0], longitude: point[1] };
			});
			this.setState({
				lat: iStartLat,
				lng: iStartLng,
				endLat: iEndLat,
				endLng: iEndLng,
				predictions: [],
				// destination: destinationName,
				routeResponse: json
			});
			Keyboard.dismiss();
			//  this.map.fitToCoordinates(pointCoords);
		} catch (error) {
			console.error(error);
		}
	};

	// Get Start Location
	async startPosition(destination) {
		this.setState({ destination });
		const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${destination}&types=geocode&location=51.481583,-3.179090&radius=3000&key=${API_KEY}&strictbounds`;
		const result = await fetch(apiUrl);
		const jsonResult = await result.json();
		this.setState({
			locationPredictions: jsonResult.predictions
		});
	}

	// Get End Location
	async endLocation(endDestination) {
		this.setState({ endDestination });
		const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${endDestination}&types=geocode&location=51.481583,-3.179090&radius=3000&key=${API_KEY}&strictbounds`;
		const result = await fetch(apiUrl);
		const jsonResult = await result.json();
		this.setState({
			endLocationPredictions: jsonResult.predictions
		});
	}

	// Populate the input field with selected prediction
	// Start Location Prediction
	pressedPrediction(
		prediction,
		selectedPredictionID,
		selectedPredictionStreet,
		selectedPredictionCity,
		selectedPredictionCountry
	) {
		new Promise((resolve, reject) => {
			Keyboard.dismiss();
			this.setState({
				locationPredictions: [],
				destination: prediction.description,
				placeID: selectedPredictionID,
				street: selectedPredictionStreet,
				city: selectedPredictionCity,
				country: selectedPredictionCountry
			});
			Keyboard;
			resolve();
		}).then(() => {
			this.getRouteDirections();
		});
	}

	// Populate the input field with selected prediction
	// End Location Prediction
	pressedEndPrediction(
		prediction,
		selectedEndPredictionID,
		selectedEndPredictionStreet,
		selectedEndPredictionCity,
		selectedEndPredictionCountry
	) {
		new Promise((resolve, reject) => {
			Keyboard.dismiss();
			this.setState({
				endLocationPredictions: [],
				endDestination: prediction.description,
				endPlaceID: selectedEndPredictionID,
				endStreet: selectedEndPredictionStreet,
				endCity: selectedEndPredictionCity,
				endCountry: selectedEndPredictionCountry
			});
			Keyboard;
			resolve();
		}).then(() => {
			this.getRouteDirections();
		});
	}
	navigateTo = () => {
		this.props.navigation.navigate('');
	};

	async onSubmit() {
		await this.checkPassengerState();

		const { placeID, endPlaceID, date, time, numPassenger, numWheelchair } = this.state;

		console.log(numPassenger, numWheelchair);
		if (
			placeID.length === 0 ||
			endPlaceID.length === 0 ||
			date == null ||
			time == null ||
			numWheelchair > numPassenger
		) {
			return console.log('no');
		}

		const data = {
			place_id: this.state.placeID,
			street: this.state.street,
			city: this.state.city,
			country: this.state.country,
			lat: this.state.lat,
			lng: this.state.lng,
			startType: this.state.startType,
			endPlaceID: this.state.endPlaceID,
			endStreet: this.state.endStreet,
			endCity: this.state.endCity,
			endCountry: this.state.endCountry,
			endLat: this.state.endLat,
			endLng: this.state.endLng,
			endType: this.state.endType,
			date: this.state.date,
			time: this.state.time,
			numPassenger: this.state.numPassenger,
			numWheelchair: this.state.numWheelchair
		};

		this.props.navigation.navigate('Summary', data);
	};

	checkPassengerState = () => {
		if (this.state.isCollapsed) {
			this.setState({ numPassenger: 1, numWheelchair: 0 });
		}
	}

	journey = () => {
		this.props.navigation.navigate('RecentFav')
	}


	render() {
		// Start Location Predictions - Suggestion List
		const locationPredictions = this.state.locationPredictions.map((prediction) => (
			<TouchableHighlight
				onPress={() => {
					this.pressedPrediction(
						prediction,
						prediction.place_id,
						prediction.terms[0].value,
						prediction.terms[1].value,
						prediction.terms[2].value
					);
				}}
				key={prediction.id}
				style={styles.suggestionContainer}
			>
				<Text style={styles.locationSuggestion}>{prediction.description}</Text>
			</TouchableHighlight>
		));
		// End Location Predictions - Suggestion Lis
		const endLocationPredictions = this.state.endLocationPredictions.map((prediction) => (
			<TouchableHighlight
				onPress={() => {
					this.pressedEndPrediction(
						prediction,
						prediction.place_id,
						prediction.terms[0].value,
						prediction.terms[1].value,
						prediction.terms[2].value
					);
				}}
				key={prediction.id}
			>
				<Text style={styles.locationSuggestion}>{prediction.description}</Text>
			</TouchableHighlight>
		));

		return (
			<StyleProvider style={getTheme(platform)}>
				<Container>
					<GlobalHeader type={1} navigateTo={this.navigateTo} />
					<Content style={styles.contentContainer}>
						{/* Favourite recent journeys button */}
						<View style={styles.secondaryButtonContainer}>
							<Button bordered danger style={styles.secondaryButton} onPress={this.journey}>
								<Text>Favourite/Recent Journeys</Text>
							</Button>
						</View>

						{/* Starting location field */}
						<View style={[styles.inputContainer, {
							borderBottomColor: this.state.fromFocused ? colors.brandColor : colors.bodyTextColor
						}]}>
							<Icon
								name="my-location"
								size={20}
								color={this.state.fromFocused ? colors.emphasisTextColor : colors.bodyTextColor}
								style={styles.inputIcons} />
							<TextInput
								placeholder="From"
								placeholderTextColor={this.state.fromFocused ? colors.emphasisTextColor : colors.bodyTextColor}
								style={[styles.input, {
									color: this.state.fromFocused ? colors.emphasisTextColor : colors.bodyTextColor
								}]}
								onChangeText={(destination) => {
									this.setState({ destination });
									this.startPositionDebounced(destination);
								}}
								value={this.state.destination}
								onFocus={() => { this.setState({ fromFocused: true }) }}
								onBlur={() => { this.setState({ fromFocused: false }) }}
							/>
						</View>
						{locationPredictions}

						{/* Destination field */}
						<View style={[styles.inputContainer, {
							borderBottomColor: this.state.toFocused ? colors.brandColor : colors.bodyTextColor
						}]}>
							<Icon
								name="location-on"
								size={20}
								color={this.state.toFocused ? colors.emphasisTextColor : colors.bodyTextColor}
								style={styles.inputIcons} />
							<TextInput
								placeholder="To"
								placeholderTextColor={this.state.toFocused ? colors.emphasisTextColor : colors.bodyTextColor}
								style={[styles.input, {
									color: this.state.toFocused ? colors.emphasisTextColor : colors.bodyTextColor
								}]}
								onChangeText={(endDestination) => {
									this.setState({ endDestination });
									this.endLocationDebounced(endDestination);
								}}
								value={this.state.endDestination}
								onFocus={() => { this.setState({ toFocused: true }) }}
								onBlur={() => { this.setState({ toFocused: false }) }}
							/>
						</View>
						{endLocationPredictions}

						{/* Date picker */}
						<TouchableOpacity onPress={this._showDatePicker}>
							<View style={[styles.inputContainer, { borderBottomColor: colors.bodyTextColor, height: 50 }]}>
								<Icon name="date-range" size={20} color={colors.bodyTextColor} style={styles.inputIcons} />
								{this.state.date ? (
									<Text style={styles.dateTime}>
										{moment(this.state.date).format('Do MMM YY')}
									</Text>
								) : (
										<Text style={styles.dateTime}>Date</Text>
									)}
							</View>
						</TouchableOpacity>
						<DateTimePicker
							isVisible={this.state.isDatePickerVisible}
							onConfirm={(value) => this._handleDatePicked(value)}
							onCancel={this._hideDatePicker}
							mode="date"
						/>

						{/* Time picker */}
						<TouchableOpacity onPress={this._showTimePicker}>
							<View style={[styles.inputContainer, { borderBottomColor: colors.bodyTextColor, height: 50 }]}>
								<Icon name="access-time" size={20} color={colors.bodyTextColor} style={styles.inputIcons} />
								{this.state.time ? (
									<Text style={styles.dateTime}>
										{moment(this.state.time).format('LT')}
									</Text>
								) : (
										<Text style={styles.dateTime}>Time</Text>
									)}
							</View>
						</TouchableOpacity>
						<DateTimePicker
							isVisible={this.state.isTimePickerVisible}
							onConfirm={(value) => this._handleTimePicked(value)}
							onCancel={this._hideTimePicker}
							mode="time"
						/>

						{/* Advanced search fields, expands and collapses on button click. */}
						<Collapsible collapsed={this.state.isCollapsed}>
							<View>
								<View style={[styles.inputContainer, {
									borderBottomColor: this.state.groupFocused ? colors.brandColor : colors.bodyTextColor
								}]}>
									<Icon
										name="people"
										size={20}
										color={this.state.groupFocused ? colors.emphasisTextColor : colors.bodyTextColor}
										style={styles.inputIcons} />
									<TextInput
										keyboardType="numeric"
										maxLength={1}
										placeholder="Group size"
										placeholderTextColor={this.state.groupFocused ? colors.emphasisTextColor : colors.bodyTextColor}
										style={[styles.input, { color: this.state.groupFocused ? colors.emphasisTextColor : colors.bodyTextColor }]}
										value={this.state.numPassenger ? this.state.numPassenger.toString() : null}
										onChangeText={(value) => this.handleNumPassengersChange(value)}
										onFocus={() => { this.setState({ groupFocused: true }) }}
										onBlur={() => { this.setState({ groupFocused: false }) }}
									/>
								</View>

								<View style={[styles.inputContainer, {
									borderBottomColor: this.state.wheelchairFocused ? colors.brandColor : colors.bodyTextColor
								}]}>
									<Icon
										name="accessible"
										size={20}
										color={this.state.wheelchairFocused ? colors.emphasisTextColor : colors.bodyTextColor}
										style={styles.inputIcons} />
									<TextInput
										maxLength={1}
										keyboardType="numeric"
										placeholder="No. of wheelchairs"
										placeholderTextColor={this.state.wheelchairFocused ? colors.emphasisTextColor : colors.bodyTextColor}
										style={[styles.input, { color: this.state.wheelchairFocused ? colors.emphasisTextColor : colors.bodyTextColor }]}
										value={this.state.numWheelchair ? this.state.numWheelchair.toString() : null}
										onChangeText={(value) => this.handleNumWheelchairChange(value)}
										onFocus={() => { this.setState({ wheelchairFocused: true }) }}
										onBlur={() => { this.setState({ wheelchairFocused: false }) }}
									/>

								</View>
							</View>
						</Collapsible>

						{/* Advanced search button, toggles advanced fields */}
						<View style={styles.secondaryButtonContainer}>
							<Button bordered danger style={styles.secondaryButton} onPress={this.toggleAdvanced}>
								<Text style={styles.secondaryButtontext}>
									{this.state.isCollapsed ? 'Advanced Search' : 'Basic Search'}
								</Text>
							</Button>
						</View>

						{/* Submit search */}
						<View style={styles.buttonContainer}>
							<Button
								danger
								style={styles.button}
								onPress={() => {
									this.onSubmit();
								}}
							>
								<Text>Search</Text>
							</Button>
						</View>
					</Content>
				</Container>
			</StyleProvider>
		);
	}
}

const styles = StyleSheet.create({
	dateTime: {
		marginLeft: 8,
		color: colors.bodyTextColor,
		fontSize: 14
	},
	inputContainer: {
		flexDirection: 'row',
		borderBottomWidth: 0.75,
		alignItems: 'center',
	},
	input: {
		flex: 1,
		padding: 10,
		color: colors.bodyTextColor
	},
	locationSuggestion: {
		color: colors.emphasisTextColor,
		backgroundColor: 'white',
		padding: 5,
		borderBottomWidth: 0.5,
		borderBottomColor: colors.emphasisTextColor,
	},
	contentContainer: {
		width: '80%',
		flex: 1,
		flexDirection: 'column',
		alignSelf: 'center'
	},
	map: {
		...StyleSheet.absoluteFillObject
	},
	buttonContainer: {
		flexDirection: 'row',
		alignSelf: 'center',
		alignItems: 'center',
		marginBottom: 15,
	},
	button: {
		width: '100%',
		justifyContent: 'center',
		backgroundColor: colors.brandColor
	},
	secondaryButtonContainer: {
		flexDirection: 'row',
		marginTop: 25,
		marginBottom: 20
	},
	secondaryButton: {
		width: '100%',
		justifyContent: 'center',
	},
	secondaryButtontext: {
		color: colors.brandColor
	}
});

export default connect(null, { fetchTickets })(JourneyScreen);