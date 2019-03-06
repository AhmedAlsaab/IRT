import moment from 'moment';
import { Card, CardItem, Container, Content, H1, H2, List, ListItem, Right, Text } from 'native-base';
import React from 'react';
import { Dimensions, FlatList, StyleSheet, View } from 'react-native';
import MapView from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import GlobalHeader from '../../components/GlobalHeader';
import ip from '../../ipstore';

export default class DriverSchedule extends React.Component {
	static navigationOptions = {
		header: null
	};

	state = {};

	componentDidMount() {}

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
					<View style={styles.cardContainer}>
						<Card style={styles.card}>
							<CardItem header bordered style={styles.cardTitle}>
								<Icon name="schedule" size={40} />
								<H1> 12:00 - 13:00 </H1>
								<Right>
									<Icon
										name="arrow-forward"
										size={40}
										onPress={() => {
											this.props.navigation.navigate('SelectedJourney');
										}}
									/>
								</Right>
							</CardItem>

							<View>
								<Content>
									<CardItem>
										<Icon name="directions-bus" size={20} color="#bcbcbc" />
										<Text style={styles.cardHeaders}>Service Number: 43</Text>
									</CardItem>
									<CardItem>
										<Icon name="my-location" size={20} color="#bcbcbc" />
										<Text style={styles.cardHeaders}>Cardiff Central</Text>
									</CardItem>
									<CardItem style={styles.middleCard} />
									<View style={styles.middleCard} />
								</Content>
								<CardItem>
									<Icon name="location-on" size={20} color="#bcbcbc" />
									<Text style={styles.cardHeaders}>Cardiff University </Text>
								</CardItem>
							</View>
						</Card>
					</View>
					<View style={styles.cardContainer}>
						<Card style={styles.card}>
							<CardItem header bordered style={styles.cardTitle}>
								<Icon name="schedule" size={40} />
								<H1> 13:30 - 15:00 </H1>
								<Right>
									<Icon name="arrow-forward" size={40} />
								</Right>
							</CardItem>

							<View>
								<Content>
									<CardItem>
										<Icon name="directions-bus" size={20} color="#bcbcbc" />
										<Text style={styles.cardHeaders}>Service Number: 61</Text>
									</CardItem>
									<CardItem>
										<Icon name="my-location" size={20} color="#bcbcbc" />
										<Text style={styles.cardHeaders}>Cardiff University</Text>
									</CardItem>
									<CardItem style={styles.middleCard} />
									<View style={styles.middleCard} />
								</Content>
								<CardItem>
									<Icon name="location-on" size={20} color="#bcbcbc" />
									<Text style={styles.cardHeaders}>Heath </Text>
								</CardItem>
							</View>
						</Card>
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
