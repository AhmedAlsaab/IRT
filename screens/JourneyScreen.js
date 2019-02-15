import React, { Component } from 'react';
import { StyleSheet, View, TouchableHighlight, Keyboard, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Collapsible from 'react-native-collapsible';
import DateTimePicker from 'react-native-modal-datetime-picker';
import API_KEY from '../google_api_key';
import _ from 'lodash';
import { Content, Container, Button, Text, Item, Input, StyleProvider } from 'native-base';
import getTheme from '../native-base-theme/components';
import platform from '../native-base-theme/variables/platform';
import GlobalHeader from '../components/GlobalHeader';
import PolyLine from '@mapbox/polyline';
import { getDateFromDateTime, getTimeFromDateTime } from '../utilityFunctions'

export default class JourneyScreen extends Component {
	static navigationOptions = {
		header: null
	};

	// Temporary states --> These should be in app.js
	constructor(props) {
		super(props);
		this.state = {
			switchValue: false,
			error: '',
			latitude: 0,
			longitude: 0,
			locationPredictions: [],

			isCollapsed: true,
			isDatePickerVisible: false,
			isTimePickerVisible: false,

			from: null,
			to: null,
			date: null,
			time: null,
			numPassenger: 1,
			numWheelchair: 0,

			//StartLocation
			locationPredictions: [],
			placeID: 'EhxTb3V0aCBQYXJrIFJvYWQsIENhcmRpZmYsIFVLIi4qLAoUChIJpatKxdccbkgRQ2yDFI_iUzESFAoSCamRx0IRO1oCEXoliDJDoPjE',
			street: 'South Park Road',
			city: 'Cardiff',
			country: 'UK',
			lat: '51.4816575,',
			lng: '-3.1458798,',
			startType: 1,

			//EndLocation
			endLocationPredictions: [],
			endPlaceID: 'Eh9Tb3V0aCBDbGl2ZSBTdHJlZXQsIENhcmRpZmYsIFVLIi4qLAoUChIJpSXnPloDbkgRaZvKffcCrskSFAoSCfVT7DTUAm5IEQ5nhmXbBjQU',
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
		this.setState({ date: newDate });
		console.log(this.state.date);
		this._hideDatePicker();
	};

	// Functionality to show/hide the time picker and to set the state
	_showTimePicker = () => this.setState({ isTimePickerVisible: true });
	_hideTimePicker = () => this.setState({ isTimePickerVisible: false });

	_handleTimePicked = (newTime) => {
		this.setState({ time: newTime });
		console.log(this.state.time);
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
		const { placeID, endPlaceID, date, time} = this.state;

		console.log(placeID, endPlaceID);
		if (placeID.length === 0 || endPlaceID.length === 0) {
			return console.log('no');
		}

		try {
			const response = await fetch(
				`https://maps.googleapis.com/maps/api/directions/json?origin=place_id:${placeID}&destination=place_id:${endPlaceID}&key=${API_KEY}`
			);
			// const startLoc = "EhlRdWVlbiBTdHJlZXQsIENhcmRpZmYsIFVLIi4qLAoUChIJd_pfUbccbkgR8GM8fGAnzNYSFAoSCamRx0IRO1oCEXoliDJDoPjE";
			const json = await response.json();
			console.log(json);
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
			console.log('yay');
		} catch (error) {
			console.error(error);
		}
	};

	// Get Start Location
	async startPosition(destination) {
		this.setState({ destination });
		const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${destination}
    &types=geocode&location=51.481583,-3.179090&radius=3000&key=${API_KEY}&strictbounds`;
		const result = await fetch(apiUrl);
		const jsonResult = await result.json();
		this.setState({
			locationPredictions: jsonResult.predictions
		});
		console.log(jsonResult);
	}

	// Get End Location
	async endLocation(endDestination) {
		this.setState({ endDestination });
		const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${endDestination}
    &types=geocode&location=51.481583,-3.179090&radius=3000&key=${API_KEY}&strictbounds`;
		const result = await fetch(apiUrl);
		const jsonResult = await result.json();
		this.setState({
			endLocationPredictions: jsonResult.predictions
		});
		console.log(jsonResult);
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

	onSubmit = () => {
		const { placeID, endPlaceID, date, time, numPassenger, numWheelchair} = this.state;

		if (placeID.length === 0 || endPlaceID.length === 0 || date == null || time == null || numWheelchair > numPassenger) {
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

		fetch('http://10.22.201.102:3000/booking/temp', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});
	};

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
		// Search box
		// Start Location Input Box
		// End Location Input Box

		return (
			<StyleProvider style={getTheme(platform)}>
				<ScrollView>
					<GlobalHeader type={1} />
					<Container style={styles.contentContainer}>
						<Content>
							{/* Favourite recent journeys button */}
							<View style={styles.secondaryButtonContainer}>
								<Button bordered danger style={styles.secondaryButton}>
									<Text style={styles.secondaryButtontext}>Favourite/Recent Journeys</Text>
								</Button>
							</View>

							{/* Starting location field */}
							<Item style={styles.iconWithInput}>
								<Icon name="my-location" size={20} color="#bcbcbc" />
								<Input
									placeholder="From"
									placeholderTextColor="#bcbcbc"
									onChangeText={(destination) => {
										this.setState({ destination });
										this.startPositionDebounced(destination);
									}}
									value={this.state.destination}
								/>
							</Item>
							{locationPredictions}

							{/* Destination field */}
							<Item style={styles.iconWithInput}>
								<Icon name="location-on" size={20} color="#bcbcbc" />
								<Input
									placeholder="To"
									placeholderTextColor="#bcbcbc"
									onChangeText={(endDestination) => {
										this.setState({ endDestination });
										this.endLocationDebounced(endDestination);
									}}
									value={this.state.endDestination}
								/>
							</Item>
							{endLocationPredictions}

							{/* Date picker */}
							<TouchableOpacity onPress={this._showDatePicker}>
								<View style={styles.dateTimeContainer}>
									<Icon name="date-range" size={20} color="#bcbcbc" />
									{this.state.date ? (
										<Text style={[ styles.dateTime, { color: '#000' } ]}>
											{this.state.date.toString().slice(4, 15)}
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
								<View style={styles.dateTimeContainer}>
									<Icon name="access-time" size={20} color="#bcbcbc" />
									{this.state.time ? (
										<Text style={[ styles.dateTime, { color: '#000' } ]}>
											{this.state.time.toString().slice(16, 21)}
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
									<Item style={styles.iconWithInput}>
										<Icon name="people" size={20} color="#bcbcbc" />
										<Input
											keyboardType='numeric'
											maxLength={1}
											placeholder="Group size"
											placeholderTextColor="#bcbcbc"
											onChangeText={(value) => this.handleNumPassengersChange(value)}
										/>
									</Item>

									<Item style={styles.iconWithInput}>
										<Icon name="accessible" size={20} color="#bcbcbc" />
										<Input
											maxLength={1}
											keyboardType = 'numeric'
											placeholder="No. of wheelchairs"
											placeholderTextColor="#bcbcbc"
											onChangeText={(value) => this.handleNumWheelchairChange(value)}
										/>
									</Item>
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
				</ScrollView>
			</StyleProvider>
		);
	}
}

const styles = StyleSheet.create({
	dateTimeContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 10,
		borderBottomWidth: 0.5,
		borderBottomColor: '#d3d3d3',
		height: 50
	},
	dateTime: {
		marginLeft: 6,
		color: '#bcbcbc',
		fontSize: 17
	},
	iconWithInput: {
		marginTop: 10
	},
	locationSuggestion: {
		backgroundColor: 'white',
		padding: 5,
		fontSize: 18,
		borderWidth: 0.5
	},
	flex_1: {
		flex: 1,
		alignItems: 'center'
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
		marginTop: 15,
		alignItems: 'center'
	},
	button: {
		width: '100%',
		justifyContent: 'center',
		color: '#ff6666'
	},
	buttontext: {
		color: '#000000'
	},
	secondaryButtonContainer: {
		flexDirection: 'row',
		marginTop: 25
	},
	secondaryButton: {
		width: '100%',
		justifyContent: 'center'
	},
	secondaryButtontext: {
		color: '#ff0000'
	}
});
