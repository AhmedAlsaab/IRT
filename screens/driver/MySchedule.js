import React from 'react';
import {
	Image,
	Platform,
	ScrollView,
	StyleSheet,
	FlatList,
	TouchableOpacity,
	View,
	Dimensions,
	Text
} from 'react-native';
import { WebBrowser } from 'expo';

import { MonoText } from '../../components/StyledText';
import { Button } from 'native-base';
import MapView, { Marker, Polyline } from 'react-native-maps';
import PolyLine from '@mapbox/polyline';

const window = Dimensions.get('window');

export default class MySchedule extends React.Component {
	static navigationOptions = {
		header: null
	};

	state = {
		data: [],
		mapRegion: { latitude: 51481583, longitude: -3.17909, latitudeDelta: 0.0922, longitudeDelta: 0.0421 },
		locationResult: null,
		location: { coords: { latitude: 51.481583, longitude: -3.17909 } }
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
			<View style={styles.container}>
				{/* <Button
					style={styles.TestButton}
					onPress={() => {
						this.TestStates();
					}}
				>
					<Text>Test</Text>
				</Button> */}
				<MapView
					style={styles.map}
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
				{/* <FlatList
					data={this.state.data}
					keyExtractor={(item, index) => index.toString()}
					renderItem={({ item }) => (
						<View style={{ backgroundColor: '#abc123', padding: 10, margin: 10 }}>
							<Text>{item.latitude}</Text>
							<Text>{item.longitude}</Text>
						</View>
					)}
				/> */}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	TestButton: {
		marginTop: 60
	},
	container: {
		...StyleSheet.absoluteFillObject
	},
	map: {
		...StyleSheet.absoluteFillObject
	}
});
