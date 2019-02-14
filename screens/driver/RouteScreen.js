import React from 'react';
import { Image, Platform, ScrollView, StyleSheet, FlatList, TouchableOpacity, View, Dimensions } from 'react-native';
import API_KEY from '../../google_api_key';
import MapView, { Marker, Polyline, Circle } from 'react-native-maps';
import PolyLine from '@mapbox/polyline';
import { Container, Button, Text } from 'native-base';

RADIUS = 2000;
zoomAmount = 15;

export default class RouteScreen extends React.Component {
	static navigationOptions = {
		header: null
	};
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			coords: [],
			pickupCoordinates: [],
			mapRegion: { latitude: 51.481583, longitude: -3.17909, latitudeDelta: 0.0122, longitudeDelta: 0.0121 },
			locationResult: null,
			currentLatitude: null,
			currentLongitude: null,
			coordsArray: [],
			location: { coords: { latitude: 51.481583, longitude: -3.17909 } },
			latitude: 51.481583,
			longitude: -3.17909
		};
		this.getRouteDirections = this.getRouteDirections.bind(this);
	}
	fetchData = async () => {
		const response = await fetch('http://192.168.0.33:3000/driver/schedule');
		const coordinate = await response.json();
		this.setState({ data: coordinate });
	};

	fetchPlaceId = async () => {
		const response = await fetch('http://192.168.0.33:3000/driver/place');
		const place = await response.json();
		this.setState({ pickupCoordinates: place });
	};

	componentDidMount() {
		this.fetchData();
		this.fetchPlaceId();
		this.getRouteDirections('51.5082,	-3.18817');
		this.getRouteDirections('51.5076, -3.17341');
		this.getRouteDirections('51.4812,	-3.18132');
		this.getRouteDirections('51.4829,	-3.17582');
	}

	TestStates = () => {
		const mapData = {
			data: this.state.data,
			//  pickupCoordinates: this.state.pickupCoordinates.latitude
			coordsArray: this.state.coordsArray
		};
		console.log(mapData);
	};

	async getRouteDirections(destination) {
		try {
			const response = await fetch(
				`https://maps.googleapis.com/maps/api/directions/json?origin=${this.state.latitude}, ${this.state
					.longitude}&destination=${destination}&key=${API_KEY}`
			);
			const json = await response.json();
			const points = PolyLine.decode(json.routes[0].overview_polyline.points);

			console.log(points);
			let coords = points.map((point, index) => {
				return {
					latitude: point[0],
					longitude: point[1]
				};
			});
			const newCoordsArray = [ ...this.state.coordsArray, coords ];
			this.setState({
				coords: coords,
				coordsArray: newCoordsArray,
				routeResponse: json
			});
			console.log('yay');
		} catch (error) {
			console.error(error);
		}
	}

	render() {
		return (
			<Container>
				<Button
					style={styles.button}
					onPress={() => {
						this.TestStates();
						//		this.getRouteDirections();
					}}
				>
					<Text>Check State</Text>
				</Button>
				<MapView
					style={styles.map}
					//minZoomLevel={zoomAmount}
					region={{
						latitude: this.state.location.coords.latitude,
						longitude: this.state.location.coords.longitude,
						latitudeDelta: 0.0922,
						longitudeDelta: 0.0421
					}}
				>
					{this.state.data.map((marker) => (
						<Marker
							coordinate={{ longitude: marker.longitude, latitude: marker.latitude }}
							title="Street Name"
							description="# Passengers"
						/>
					))}

					{this.state.coordsArray.map((coords, index) => (
						<MapView.Polyline index={index} coordinates={coords} strokeWidth={4} strokeColor="#007acc" />
					))}

					{/* <MapView.Polyline coordinates={this.state.coords} strokeWidth={2} strokeColor="red" /> */}

					{/* {this.state.data.map((coordinates) => (
						<MapView.Polyline coordinates={this.state.data} strokeWidth={6} strokeColor="red" />
					))} */}
				</MapView>
			</Container>
		);
	}
}

const window = Dimensions.get('window');

const styles = StyleSheet.create({
	container: {
		...StyleSheet.absoluteFillObject
	},
	map: {
		marginTop: 50,
		...StyleSheet.absoluteFillObject
	},
	button: {
		marginTop: 30
	}
});
