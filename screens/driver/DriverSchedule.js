import moment from 'moment';
import { Card, CardItem, Container, Content, H1, H2, List, ListItem, Right, Text } from 'native-base';
import React from 'react';
import { Dimensions, FlatList, StyleSheet, View } from 'react-native';
import MapView from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import GlobalHeader from '../../components/GlobalHeader';
import ip from '../../ipstore';
import { getRequestAuthorized } from '../../API';

import { connect } from 'react-redux';
import { fetchVehicles } from '../../redux/actions/vehicleAction';

class DriverSchedule extends React.Component {
	static navigationOptions = {
		header: null
	};

	state = {
		journeys: []
	};

	componentDidMount() {
		this.props.fetchVehicles();
		getRequestAuthorized(`http://${ip}:3000/driver/journeys`).then((response) => {
			let journey = {};
			for (let i = 0; i < response.length; i++) {
				const element = response[i];

				if (i % 2 === 0) {
					journey.id = element.journey_id;
					journey.fromCity = element.city;
					journey.fromStreet = element.street;
					journey.startTime = element.start_time;
					journey.endTime = element.end_time;
					continue;
				}

				journey.toCity = element.city;
				journey.toStreet = element.street;

				this.setState({
					journeys: [ ...this.state.journeys, journey ]
				});

				journey = {};
			}
			console.log(this.state.journeys);
		});
	}

	TestStates = () => {
		const data = {
			coordsArray: this.state.data
		};
		console.log(data);
	};

	navigateTo = () => {
		this.props.navigation.navigate('');
	};

	render() {
		return (
			<Container>
				<GlobalHeader type={1} navigateTo={this.navigateTo} />
				<Content padder>
					{console.log(this.state.journeys.length)}
					{this.state.journeys.map((journey, key) => {
						return (
							<View style={styles.cardContainer} key={key}>
								<Card style={styles.card}>
									<CardItem header bordered style={styles.cardTitle}>
										<Icon name="schedule" size={40} />
										<H1>
											{' '}
											{moment(journey.startTime).format('hh:mm a')} -{' '}
											{moment(journey.endTime).format('hh:mm a')}{' '}
										</H1>
										<Right>
											<Icon
												name="arrow-forward"
												size={40}
												onPress={() => {
													this.props.navigation.navigate('SelectedJourney', {
														id: journey.id
													});
												}}
											/>
										</Right>
									</CardItem>

									<View>
										<Content>
											<CardItem>
												<Icon name="directions-bus" size={20} color="#bcbcbc" />
												<Text style={styles.cardHeaders}>
													Service Number: {Math.floor(Math.random() * 1000000)}
												</Text>
											</CardItem>
											<CardItem>
												<Icon name="my-location" size={20} color="#bcbcbc" />
												<Text
													style={styles.cardHeaders}
												>{`${journey.fromStreet}, ${journey.fromCity}`}</Text>
											</CardItem>
											<CardItem style={styles.middleCard} />
											<View style={styles.middleCard} />
										</Content>
										<CardItem>
											<Icon name="location-on" size={20} color="#bcbcbc" />
											<Text
												style={styles.cardHeaders}
											>{`${journey.toStreet}, ${journey.toCity}`}</Text>
										</CardItem>
									</View>
								</Card>
							</View>
						);
					})}
				</Content>
			</Container>
		);
	}
}
const width = '80%';
const buttonWidth = '40%';
const window = Dimensions.get('window');

const styles = StyleSheet.create({
	middleCard: {
		borderLeftWidth: 3.5,
		borderLeftColor: '#ff3333',
		width,
		alignSelf: 'center'
	},
	cardContainer: {
		marginTop: 5
	},
	cardHeaders: {
		color: 'black',
		padding: 5
	},

	cardTitle: {
		backgroundColor: 'rgba(49, 46, 50, 0.1)'
	}
});

export default connect(null, { fetchVehicles })(DriverSchedule);
