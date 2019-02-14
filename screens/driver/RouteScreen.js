import React from 'react';
import { Image, Platform, ScrollView, StyleSheet, FlatList, TouchableOpacity, View, Dimensions } from 'react-native';

import MapView, { Marker, Polyline, Circle } from 'react-native-maps';
import PolyLine from '@mapbox/polyline';

import { Container } from 'native-base';
//const window = Dimensions.get('window');

RADIUS = 2000;
zoomAmount = 15;

export default class RouteScreen extends React.Component {
	static navigationOptions = {
		header: null
	};

	state = {
		data: [],
		mapRegion: { latitude: 51.481583, longitude: -3.17909, latitudeDelta: 0.0122, longitudeDelta: 0.0121 },
		locationResult: null,
		currentLatitude: null,
		currentLongitude: null,
		location: { coords: { latitude: 51.481583, longitude: -3.17909 } },
		LATLNG: {
			latitude: 51.481583,
			longitude: -3.17909
		}
	};

	fetchData = async () => {
		const response = await fetch('http://192.168.0.33:3000/driver/schedule');
		const coordinate = await response.json();
		this.setState({ data: coordinate });
	};

	componentDidMount() {
		this.fetchData();
	}

	TestStates = () => {
		const data = {
			coordsArray: this.state.data
		};
		console.log(data);
	};

	render() {
		return (
			<Container>
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

					{this.state.data.map((coordinates) => (
						<MapView.Polyline coordinates={this.state.data} strokeWidth={6} strokeColor="red" />
					))}
				</MapView>
			</Container>
		);
	}
}
const width = '80%';
const buttonWidth = '40%';
const window = Dimensions.get('window');

const styles = StyleSheet.create({
	map: {
		marginTop: 20,
		height: 200
	},
	container: {
		...StyleSheet.absoluteFillObject
	},
	map: {
		...StyleSheet.absoluteFillObject
	}
});
