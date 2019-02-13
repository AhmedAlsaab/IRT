import React from 'react';
import { Image, Platform, ScrollView, StyleSheet, FlatList, TouchableOpacity, View, Dimensions } from 'react-native';
import { WebBrowser } from 'expo';

import { MonoText } from '../../components/StyledText';
import MapView, { Marker, Polyline } from 'react-native-maps';
import PolyLine from '@mapbox/polyline';
import GlobalHeader from '../../components/GlobalHeader';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
	Content,
	Container,
	Button,
	Text,
	Accordion,
	Card,
	CardItem,
	Body,
	Header,
	H1,
	Right,
	H3,
	H2
} from 'native-base';
//const window = Dimensions.get('window');

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
			<Container>
				<GlobalHeader type={1} />

				<Content padder>
					<View>
						<Card style={styles.card}>
							<CardItem header bordered>
								<H1> YOUR JOURNEY </H1>
								<Right>
									<Icon name="directions-bus" size={40} />
								</Right>
							</CardItem>
							<CardItem>
								<Icon name="schedule" size={20} color="#bcbcbc" />
								<Text style={styles.cardText}># Time</Text>
							</CardItem>
							<CardItem>
								<Icon name="flag" size={20} color="#bcbcbc" />
								<Text style={styles.cardText}># Stops</Text>
							</CardItem>
							<CardItem bordered>
								<Icon name="accessible" size={20} color="#bcbcbc" />
								<Text style={styles.cardText}># Wheelchair Passenger</Text>
							</CardItem>

							<View style={styles.innerCard}>
								<CardItem>
									<Icon name="my-location" size={20} color="#bcbcbc" />
									<Text style={styles.cardHeaders}>Cardiff Central</Text>
									<Right />
								</CardItem>
								<Content padder>
									<FlatList
										data={this.state.data}
										keyExtractor={(item, index) => index.toString()}
										renderItem={({ item }) => (
											<View style={styles.stopsList}>
												<Text>
													{item.street} {item.city}
												</Text>

												<Text style={styles.innerText}>
													<Icon name="person" size={20} color="#bcbcbc" />
													5
												</Text>
											</View>
										)}
									/>
								</Content>
								<CardItem header bordered>
									<Icon name="location-on" size={20} color="#bcbcbc" />
									<Text style={styles.cardHeaders}>End Destination</Text>
									<Right>
										<Icon name="schedule" />
									</Right>
								</CardItem>
							</View>
						</Card>
						<H2>
							<Text>View Route & Directions </Text>
						</H2>
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
				</Content>
			</Container>
		);
	}
}
const width = '70%';
const buttonWidth = '40%';
const window = Dimensions.get('window');

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		alignSelf: 'center',
		width
	},
	map: {
		marginTop: 20,
		height: 200
	},
	innerCard: {
		borderLeftWidth: 0.5
	},
	stopsList: {
		padding: 10,
		marginLeft: 30,
		marginTop: 10,
		borderBottomColor: '#bcbcbc',
		borderBottomWidth: 0.5,

		width
	},
	cardText: {
		margin: 5
	},
	cardHeaders: {
		fontWeight: 'bold',
		color: 'black',
		margin: 5
	},
	innerText: {
		margin: 5,
		padding: 5
	}
});
