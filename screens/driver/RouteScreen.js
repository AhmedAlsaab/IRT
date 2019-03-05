import { Button, Text } from 'native-base';
import React, { Component } from 'react';
import { Dimensions, StyleSheet, View, TextInput } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import MapView, { Marker, Callout } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import API_KEY from '../../google_api_key';
import ip from '../../ipstore';

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
			data: [],
			distance: '',
			duration: ''
		};

		this.mapView = null;
	}

	fetchData = async () => {
		const response = await fetch(`http://${ip}:3000/driver/schedule`);
		const coordinate = await response.json();
		this.setState({ data: coordinate });
	};

	componentDidMount() {
		this.fetchData();
	}

	render() {
		const customMap = [
			{
				elementType: 'geometry',
				stylers: [
					{
						color: '#ebe3cd'
					}
				]
			},
			{
				elementType: 'labels.text.fill',
				stylers: [
					{
						color: '#523735'
					}
				]
			},
			{
				elementType: 'labels.text.stroke',
				stylers: [
					{
						color: '#f5f1e6'
					}
				]
			},
			{
				featureType: 'administrative',
				elementType: 'geometry.stroke',
				stylers: [
					{
						color: '#c9b2a6'
					}
				]
			},
			{
				featureType: 'administrative.land_parcel',
				elementType: 'geometry.stroke',
				stylers: [
					{
						color: '#dcd2be'
					}
				]
			},
			{
				featureType: 'administrative.land_parcel',
				elementType: 'labels.text.fill',
				stylers: [
					{
						color: '#ae9e90'
					}
				]
			},
			{
				featureType: 'landscape.natural',
				elementType: 'geometry',
				stylers: [
					{
						color: '#dfd2ae'
					}
				]
			},
			{
				featureType: 'poi',
				elementType: 'geometry',
				stylers: [
					{
						color: '#dfd2ae'
					}
				]
			},
			{
				featureType: 'poi',
				elementType: 'labels.text.fill',
				stylers: [
					{
						color: '#93817c'
					}
				]
			},
			{
				featureType: 'poi.park',
				elementType: 'geometry.fill',
				stylers: [
					{
						color: '#a5b076'
					}
				]
			},
			{
				featureType: 'poi.park',
				elementType: 'labels.text.fill',
				stylers: [
					{
						color: '#447530'
					}
				]
			},
			{
				featureType: 'road',
				elementType: 'geometry',
				stylers: [
					{
						color: '#f5f1e6'
					}
				]
			},
			{
				featureType: 'road.arterial',
				elementType: 'geometry',
				stylers: [
					{
						color: '#fdfcf8'
					}
				]
			},
			{
				featureType: 'road.highway',
				elementType: 'geometry',
				stylers: [
					{
						color: '#f8c967'
					}
				]
			},
			{
				featureType: 'road.highway',
				elementType: 'geometry.stroke',
				stylers: [
					{
						color: '#e9bc62'
					}
				]
			},
			{
				featureType: 'road.highway.controlled_access',
				elementType: 'geometry',
				stylers: [
					{
						color: '#e98d58'
					}
				]
			},
			{
				featureType: 'road.highway.controlled_access',
				elementType: 'geometry.stroke',
				stylers: [
					{
						color: '#db8555'
					}
				]
			},
			{
				featureType: 'road.local',
				elementType: 'labels.text.fill',
				stylers: [
					{
						color: '#806b63'
					}
				]
			},
			{
				featureType: 'transit.line',
				elementType: 'geometry',
				stylers: [
					{
						color: '#dfd2ae'
					}
				]
			},
			{
				featureType: 'transit.line',
				elementType: 'labels.text.fill',
				stylers: [
					{
						color: '#8f7d77'
					}
				]
			},
			{
				featureType: 'transit.line',
				elementType: 'labels.text.stroke',
				stylers: [
					{
						color: '#ebe3cd'
					}
				]
			},
			{
				featureType: 'transit.station',
				elementType: 'geometry',
				stylers: [
					{
						color: '#dfd2ae'
					}
				]
			},
			{
				featureType: 'water',
				elementType: 'geometry.fill',
				stylers: [
					{
						color: '#b9d3c2'
					}
				]
			},
			{
				featureType: 'water',
				elementType: 'labels.text.fill',
				stylers: [
					{
						color: '#92998d'
					}
				]
			}
		];

		return (
			<View style={StyleSheet.absoluteFill}>
				<View style={styles.bottom}>
					<Button style={styles.journeyInfoContainer}>
						<View>
							<Text style={styles.journeyInfo}>
								<Icon name="schedule" size={15} /> {this.state.duration.toString().slice(0, -1)} Min
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
					customMapStyle={customMap}
					ref={(c) => (this.mapView = c)}
					onPress={this.onMapPress}
				>
					{this.state.coordinates.map((coordinate, index) => (
						<MapView.Marker
							pinColor="rgba(46, 49, 50, 0.5)"
							key={`coordinate_${index}`}
							coordinate={coordinate}
							title={'Predefined Stop'}
							description={'start/end destination of the service'}
						/>
					))}
					{this.state.data.map((marker, index) => (
						<Marker
							pinColor={'green'}
							key={index}
							coordinate={{ longitude: marker.longitude, latitude: marker.latitude }}
							title={marker.street}
							description={`Passengers: ${marker.no_of_passengers.toString()}`}
						/>
					))}

					{this.state.data.length >= 1 && (
						<MapViewDirections
							origin={this.state.coordinates[0]}
							//	waypoints={this.state.coordinates.length > 2 ? this.state.coordinates.slice(1, -1) : null}
							waypoints={this.state.data}
							destination={this.state.coordinates[this.state.coordinates.length - 1]}
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
									duration: result.duration
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
	calloutView: {
		flexDirection: 'row',
		// backgroundColor: 'rgba(255, 255, 255, 0.9)',
		// borderRadius: 10,
		// width: '40%',
		marginLeft: '5%',
		// marginRight: '30%',
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
