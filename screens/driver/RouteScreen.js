import { Button, Text } from 'native-base';
import React, { Component } from 'react';
import { Dimensions, StyleSheet, View, Image } from 'react-native';
import { Location, Permissions } from 'expo';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MapView, { Marker, Callout } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import API_KEY from '../../server/keys/google_api_key';
import ip from '../../server/keys/ipstore';
import socketIO from 'socket.io-client';

import uuid from 'uuid/v4';
import { getRequestAuthorized } from '../../API';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 51.481583;
const LONGITUDE = -3.17909;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class RouteScreen extends Component {
	static navigationOptions = {
		header: null
	};
	constructor(props) {
		super(props);

		// Start / End location
		this.state = {
			busStartingLocationLat: 51.47667946,
			busStartingLocationLong: -3.180427374,
			latDriver: null,
			longDriver: null,
			locationResult: null,
			driverStartedRoute: false,
			coordinates: [
				{
					latitude: 51.47667946,
					longitude: -3.180427374
				},
				{
					latitude: 51.48530001,
					longitude: -3.178014415
				}
			],
			startCoords: null,
			endCoords: null,
			data: [],
			distance: '',
			duration: '',
			xMapCoords: []
		};

		this.mapView = null;
		this.socket = null;
	}

	// Get the coordiante of the the start, end and waypoint coordinates, so the data can be
	// Place on Google Maps so the driver will know where to go
	fetchData = async () => {
		const coordinate = await getRequestAuthorized(
			`http://${ip}:3000/driver/schedule?id=${this.props.navigation.state.params.id}`
		);

		for (let i = 0; i < coordinate.length; i++) {
			const element = coordinate[i];

			switch (element.fk_coordinate_type_id) {
				case 1:
					this.setState({
						startCoords: { latitude: element.latitude, longitude: element.longitude }
					});
					break;

				case 2:
					this.setState({
						endCoords: { latitude: element.latitude, longitude: element.longitude }
					});
					break;

				case 3:
					this.setState({
						data: [ ...this.state.data, element ]
					});
					break;
			}
		}
	};

	componentDidMount = async () => {
		this.fetchData();
		this.openDriverSocket();
		this._getLocationAsync();
	};

	// Get location permission
	_getLocationAsync = async () => {
		let { status } = await Permissions.askAsync(Permissions.LOCATION);
		if (status !== 'granted') {
			this.setState({
				locationResult: 'Permission to access location was denied'
			});
		}
		// Get driver location
		let location = await Location.getCurrentPositionAsync({});
		this.setState({
			locationResult: location,
			latDriver: location.coords.latitude,
			longDriver: location.coords.longitude,
			hasData: true
		});
		console.log(location);
	};

	// Driver Socket
	// Subscribes to socket when component is mounted
	async openDriverSocket() {
		this.socket = socketIO.connect(`http://${ip}:3000`);
		this.socket.on('connect', () => {
			console.log('driver client connected');
			this.socket.emit('connectDriver');
		});
	}

	// Background Tracking -> Not in use
	// Requires EXPO SDK 32 (Not working on NSA Laptops)
	trackDriverLocationBackground = async () => {
		await Location.startLocationUpdatesAsync('firstTask', {
			accuracy: Location.Accuracy.High,
			timeInterval: 3000,
			distanceInterval: 5
		});
		console.log('Tracking?');
	};

	// Foreground Tracking - Works & in use
	// Emits to socket new coordinates every 3 seconds
	trackDriverLocationForeground = async () => {
		let locationWatch = await Location.watchPositionAsync(
			{
				// Track location changes at the specified distance and time interval
				accuracy: Location.Accuracy.High,
				timeInterval: 3000,
				distanceInterval: 5
			},
			(loc) => {
				// with each location change emit the new location to the driverLocation socket
				if (loc.timestamp) {
					this.socket.emit('driverLocation', {
						latitude: loc.coords.latitude,
						longitude: loc.coords.longitude
					});
					this.setState({
						latDriver: loc.coords.latitude,
						longDriver: loc.coords.longitude
					});
				} else {
					//log error
				}
				console.log(loc);
			}
		);
		this.setState({
			driverStartedRoute: true
		});
	};

	render() {
		let driverMarker = null;
		// Update the bus icon with the new location changes on the map by passing the locations to the marker
		if (this.state.driverStartedRoute) {
			driverMarker = (
				<Marker
					coordinate={{ longitude: this.state.longDriver, latitude: this.state.latDriver }}
					title={'Service XX'}
					description={'Bus Location'}
				>
					<Image source={require('../../assets/images/bus-icon.png')} style={{ width: 40, height: 40 }} />
				</Marker>
			);
		}

		// MapViewDirections is a library
		// the 'data' array is passed in as waypoints
		// 'data' array contains coordinates retrieved from the database that act as pickup locations
		return (
			<View style={StyleSheet.absoluteFill}>
				<View style={styles.bottom}>
					<Button style={styles.journeyInfoContainer}>
						<View>
							<Text style={styles.journeyInfo}>
								<Icon name="schedule" size={15} /> {parseInt(this.state.duration)} Min
							</Text>
						</View>
						<View>
							<Text style={styles.journeyInfo}>
								<Icon name="directions-bus" size={15} /> {this.state.distance.toString().slice(0, -1)}{' '}
								Miles
							</Text>
						</View>
					</Button>
				</View>
				<MapView
					initialRegion={{
						latitude: LATITUDE,
						longitude: LONGITUDE,
						latitudeDelta: LATITUDE_DELTA,
						longitudeDelta: LONGITUDE_DELTA
					}}
					style={StyleSheet.absoluteFill}
					ref={(c) => (this.mapView = c)}
					onPress={this.onMapPress}
				>
					{/* Setting waypoints on the map */}
					{this.state.data.map((stop) => (
						<Marker
							pinColor={'green'}
							key={uuid()}
							coordinate={{ latitude: stop.latitude, longitude: stop.longitude }}
							title={`${stop.street}, ${stop.city}`}
							description={`Passengers: ${stop.no_of_passengers.toString()}`}
						/>
					))}

					{/* Setting start location on the map */}
					{this.state.startCoords !== null && (
						<MapView.Marker
							pinColor="rgba(46, 49, 50, 0.5)"
							key={uuid()}
							coordinate={this.state.startCoords}
							title={'Predefined Stop'}
							description={'Start destination of the service'}
						/>
					)}

					{/* Setting end location on the map */}
					{this.state.endCoords !== null && (
						<MapView.Marker
							pinColor="rgba(46, 49, 50, 0.5)"
							key={uuid()}
							coordinate={this.state.endCoords}
							title={'Predefined Stop'}
							description={'End destination of the service'}
						/>
					)}
					{this.state.data.length >= 1 && (
						<MapViewDirections
							origin={this.state.startCoords}
							waypoints={this.state.data}
							destination={this.state.endCoords}
							apikey={API_KEY}
							strokeWidth={4}
							strokeColor="rgba(253, 113, 103, 1)"
							optimizeWaypoints={true}
							onStart={(params) => {
								console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
							}}
							onReady={(result) => {
								this.setState({
									distance: result.distance,
									duration: result.duration,
									xMapCoords: result.coordinates
								});

								this.mapView.fitToCoordinates(result.coordinates, {
									edgePadding: {
										right: width / 20,
										bottom: height / 20,
										left: width / 20,
										top: height / 20
									}
								});
							}}
							onError={(errorMessage) => {
								// console.log('GOT AN ERROR');
							}}
						/>
					)}
					{driverMarker}
				</MapView>
				<Callout>
					<View style={styles.calloutView}>
						<Button
							style={styles.journeyInfoContainer}
							onPress={() => {
								this.props.navigation.navigate('SelectedJourney');
							}}
						>
							<View>
								<Text style={styles.journeyInfo}>
									<Icon name="arrow-back" size={15} /> Back
								</Text>
							</View>
						</Button>
					</View>
					<View style={styles.calloutView}>
						<Button
							style={styles.buttonTop}
							onPress={() => {
								this.trackDriverLocationForeground();
							}}
						>
							<View>
								<Text style={styles.ButtonTopText}>Start Route</Text>
							</View>
						</Button>
					</View>
				</Callout>
			</View>
		);
	}
}
const styles = StyleSheet.create({
	buttonStyle: {
		fontWeight: 'bold',
		backgroundColor: '#f4f4f4'
	},
	bottom: {
		flex: 1,
		justifyContent: 'flex-end',
		marginBottom: 5,
		marginLeft: 2
	},
	journeyInfo: {
		color: 'black'
	},
	journeyInfoContainer: {
		backgroundColor: 'white',
		borderColor: 'rgba(46, 49, 50, 0.5)',

		borderWidth: 1
	},
	buttonTop: {
		backgroundColor: '#2dabff'
	},

	ButtonTopText: {
		color: 'white'
	},
	calloutView: {
		flexDirection: 'row',
		marginLeft: '5%',
		marginTop: 30
	},
	calloutSearch: {
		borderColor: 'transparent',
		textAlign: 'center',
		height: 40,
		width: '90%'
	}
});

export default RouteScreen;

// Tracking location changes in the background (while application is not running)
// Requires EXPO SDK 32 - Not in use right now

// Background location tracker
// TaskManager.defineTask('firstTask', async ({ data, error }) => {
// 	console.log('location update');
// 	if (error) {
// 		console.log(error);
// 		return;
// 	}
// 	if (data) {
// 		const { locations } = data;
// 	}
// });
