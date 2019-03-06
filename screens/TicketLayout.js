import React, { Component } from 'react';
import { Dimensions, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Icon, Left, Body, Right } from 'native-base';
import ip from '../ipstore';
import moment from 'moment';

const { width, height } = Dimensions.get('window');
const cols = 3,
	rows = 3;

export default class TicketLayout extends Component {
	static navigationOptions = {
		header: null
	};

	state = {
		expansionIsOpen: false,
		isLoadingComplete: false,
		ticketData: []
	};

	componentDidMount() {
		const id = this.props.ticketId;
		const expired = this.props.expired;

		fetch(`http://${ip}:3000/ticketsQuery?id=${id}&expired=${expired}`)
			.then((response) => response.json())
			.then((response) => {
				console.log(response);
				this.setState({
					ticketData: response.ticket
				});
			});
	}

	render() {
		return (
			<View style={{ backgroundColor: 'transparent', paddingBottom: 10, paddingLeft: 15 }}>
				<Content>
					<ImageBackground
						source={require('../assets/images/active-tickets.png')}
						style={{ width: 300, height: 275, justifyContent: 'center' }}
					>
						<Left>
							<Body>
								<TouchableOpacity style={styles.container} onPress={this.props.onOpen}>
									{this.state.ticketData.length >= 1 && (
										<View style={styles.container}>
											<React.Fragment>
												<Text style={{ textAlign: 'left', fontWeight: 'bold', fontSize: 15 }}>
													From:
												</Text>
												<Text>
													{this.state.ticketData[0].street}, {this.state.ticketData[0].city}
												</Text>
												<Text>
													Departure:{' '}
													{moment(this.state.ticketData[0].start_time).format(
														'dddd Do h:mm a'
													)}
												</Text>
												{/* <View style={styles.imageContainer}>
											<Image
												source={require('../assets/images/transport.jpg')}
												style={{
													width: 150,
													height: 150,
													borderRadius: 10,
													
												}}
											/>
										</View> */}

												<Text style={{ textAlign: 'left', fontWeight: 'bold', fontSize: 15 }}>
													To:
												</Text>
												<Text>
													{this.state.ticketData[1].street}, {this.state.ticketData[1].city}
												</Text>
												<Text>
													Arrival:{' '}
													{moment(this.state.ticketData[1].end_time).format('dddd Do h:mm a')}
												</Text>

												<Text style={{ textAlign: 'left', fontWeight: 'bold', fontSize: 15 }}>
													Your seat has been reserved!
												</Text>
											</React.Fragment>
										</View>
									)}
								</TouchableOpacity>
							</Body>
						</Left>
					</ImageBackground>
				</Content>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		marginLeft: 10,
		marginBottom: 10,
		height: (height - 20 - 18) / rows - 9,
		width: 300,
		alignSelf: 'center',
		paddingLeft: 34,
		paddingTop: 20,
		backgroundColor: 'transparent',
		justifyContent: 'space-between'
	},
	imageContainer: {
		flex: 1
	},
	image: {
		...StyleSheet.absoluteFillObject,
		width: 10,
		height: 10
	},
	To: {
		fontSize: 20,
		marginTop: 4
	},
	From: {
		backgroundColor: 'transparent',
		fontSize: 15,
		lineHeight: 14
	}
});
