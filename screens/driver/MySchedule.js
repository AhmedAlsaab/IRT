import moment from 'moment';
import { Card, CardItem, Container, Content, H1, H2, List, ListItem, Right, Text } from 'native-base';
import React from 'react';
import { Dimensions, FlatList, StyleSheet, View } from 'react-native';
import MapView from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import GlobalHeader from '../../components/GlobalHeader';
import ip from '../../server/keys/ipstore';
import { getRequestAuthorized } from '../../API';

export default class MySchedule extends React.Component {
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

	// Fetches the list of stops from the database when the component mounts
	// Stops are returned based on the ID of the journey (the ones assigned to the selected schedule)
	// The data returned is stored in the data[] array (state is set)
	componentDidMount() {
		getRequestAuthorized(
			`http://${ip}:3000/driver/stops?id=${this.props.navigation.state.params.id}`
		).then((coordinate) => this.setState({ data: coordinate }));
	}

	navigateTo = () => {
		this.props.navigation.navigate('DailySchedule');
	};

	// Populates the card/container by mapping the through the data[] array
	// Each index acts as a new list item
	render() {
		const RADIUS = 200;
		const zoomAmount = 15;
		return (
			<Container>
				<GlobalHeader type={1} navigateTo={this.navigateTo} isBackButtonActive={1} />

				<Content padder>
					<View>
						<Card style={styles.card}>
							<CardItem header bordered>
								<H1> YOUR JOURNEY </H1>
								<Right>
									<Icon name="directions-bus" size={40} />
								</Right>
							</CardItem>

							<View>
								<Content>
									<CardItem>
										<Icon name="my-location" size={20} color="#bcbcbc" />
										<Text style={styles.cardHeaders}>
											{this.props.navigation.state.params.from}
										</Text>
									</CardItem>
									<View style={styles.middleCard}>
										<FlatList
											data={this.state.data}
											keyExtractor={(item, index) => index.toString()}
											renderItem={({ item }) => (
												<View style={styles.stopsList}>
													<CardItem bordered>
														<List>
															<ListItem>
																<Icon name="flag" size={20} color="#bcbcbc" />
																<Text style={styles.listText}>
																	{item.street}, {item.city}
																</Text>
															</ListItem>
															<ListItem>
																<Icon name="date-range" size={20} color="#bcbcbc" />
																<Text style={styles.listText}>
																	{moment(item.date_of_journey).format(
																		'MMMM Do YYYY'
																	)}
																</Text>
															</ListItem>
															<ListItem>
																<Icon name="schedule" size={20} color="#bcbcbc" />
																<Text style={styles.listText}>
																	{moment(item.time_of_journey).format('HH:mm')}
																</Text>
															</ListItem>
															<ListItem>
																<Icon name="group" size={20} color="#bcbcbc" />
																<Text style={styles.listText}>
																	{item.no_of_passengers}
																</Text>
															</ListItem>
															<ListItem>
																<Icon name="accessible" size={20} color="#bcbcbc" />
																<Text style={styles.listText}>
																	{item.no_of_wheelchairs}
																</Text>
															</ListItem>
														</List>
													</CardItem>
												</View>
											)}
										/>
									</View>
								</Content>
								<CardItem header bordered>
									<Icon name="location-on" size={20} color="#bcbcbc" />
									<Text style={styles.cardHeaders}>{this.props.navigation.state.params.to}</Text>
								</CardItem>
							</View>
						</Card>
						<View>
							<H2 style={styles.ViewRoute}>View Route & Directions</H2>
						</View>
						<MapView
							onPress={() => {
								this.props.navigation.navigate('Route', { id: this.props.navigation.state.params.id });
							}}
							style={styles.map}
							minZoomLevel={zoomAmount}
							region={{
								latitude: this.state.location.coords.latitude,
								longitude: this.state.location.coords.longitude,
								latitudeDelta: 0.0922,
								longitudeDelta: 0.0421
							}}
						>
							<MapView.Circle
								key={(this.state.currentLongitude + this.state.currentLatitude).toString()}
								center={this.state.LATLNG}
								radius={RADIUS}
								strokeWidth={1}
								strokeColor={'#1a66ff'}
								fillColor={'rgba(230,238,255,0.5)'}
							/>
						</MapView>
					</View>
				</Content>
			</Container>
		);
	}
}
const width = '80%';
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
		width,
		alignSelf: 'center'
	},
	middleCard: {
		borderLeftWidth: 3.5,
		borderLeftColor: '#ff3333',
		width,
		alignSelf: 'center'
	},
	stopsList: {
		marginLeft: 30,

		borderBottomColor: '#bcbcbc',
		borderBottomWidth: 0.5
	},
	cardText: {
		margin: 5
	},
	cardHeaders: {
		fontWeight: 'bold',
		color: 'black'
	},
	innerText: {},
	ViewRoute: {
		marginTop: 10
	},
	listText: {
		padding: 5
	}
});
