import React, { Component } from 'react';
import { StyleSheet, View, TouchableHighlight, Keyboard, ScrollView, TouchableOpacity, Image } from 'react-native';
// import API_KEY from '../google_api_key';
import _ from 'lodash';
import { Content, Container, Button, Text, Item, Input, StyleProvider } from 'native-base';
import getTheme from '../native-base-theme/components';
import platform from '../native-base-theme/variables/platform';
import GlobalHeader from '../components/GlobalHeader';
import ip from '../ipstore';

export default class TicketDetail extends React.Component {
	static navigationOptions = {
		header: null
	};

	state = {
		expansionIsOpen: false,
		isLoadingComplete: false,
		ticketData: []
	};

	componentDidMount() {
		const { id } = this.props.navigation.state.params;

		fetch(`http://${ip}:3000/ticketsQuery?id=${id}`).then((response) => response.json()).then((response) => {
			this.setState({
				ticketData: response.ticket
			});
		});
	}

	openTicket = () => {
		this.setState({
			expansionIsOpen: true
		});
	};

	closeTicket = () => {
		console.log('hello');
		this.setState({
			expansionIsOpen: false
		});
	};

	navigateTo = () => {
		this.props.navigation.navigate('Ticket');
	};

	render() {
		return (
			<StyleProvider style={getTheme(platform)}>
				<ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
					<GlobalHeader
						type={3}
						header="Ticket Details"
						navigateTo={this.navigateTo}
						isBackButtonActive={1}
					/>
					<Container style={styles.contentContainer}>
						<Content>
							{this.state.ticketData.length >= 1 && (
								<View style={styles.container}>
									<React.Fragment>
										<Text>
											City From:
											{this.state.ticketData[0].city}
										</Text>
										<Text>
											{' '}
											Street From:
											{this.state.ticketData[0].street}
										</Text>
										<Text>
											{' '}
											Start Date and Time:
											{this.state.ticketData[0].start_time}
										</Text>
										<View style={styles.imageContainer}>
											<Image
												source={require('../assets/images/qrcode.jpg')}
												style={{
													width: 150,
													height: 150,
													borderRadius: 10,
													alignSelf: 'center'
												}}
											/>
										</View>
										<Text>
											To City:
											{this.state.ticketData[1].city}
										</Text>
										<Text>
											{' '}
											To Street:
											{this.state.ticketData[1].street}
										</Text>
										<Text>
											{' '}
											Start Date and Time:
											{this.state.ticketData[1].end_time}
										</Text>
									</React.Fragment>
								</View>
							)}
						</Content>
					</Container>
				</ScrollView>
			</StyleProvider>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		marginLeft: 10,
		marginBottom: 10,
		marginTop: 10,
		height: 300,
		width: 300,
		borderRadius: 0.5,
		borderWidth: 1,
		borderColor: '#d6d7da'
	},
	iconWithInput: {
		marginTop: 10
	},
	imageContainer: {
		flex: 1
	},
	image: {
		borderRadius: 10,
		...StyleSheet.absoluteFillObject,
		width: 10,
		height: 10
	},
	locationSuggestion: {
		backgroundColor: 'white',
		padding: 5,
		fontSize: 18,
		borderWidth: 0.5
	},
	flex_1: {
		flex: 1,
		alignItems: 'center'
	},
	contentContainer: {
		width: '80%',
		flex: 1,
		flexDirection: 'column',
		alignSelf: 'center'
	},
	map: {
		...StyleSheet.absoluteFillObject
	},
	buttonContainer: {
		flexDirection: 'row',
		alignSelf: 'center',
		marginTop: 15,
		alignItems: 'center'
	},
	button: {
		width: '100%',
		justifyContent: 'center',
		color: '#ff6666'
	},
	buttontext: {
		color: '#000000'
	},
	secondaryButtonContainer: {
		flexDirection: 'row',
		marginTop: 25
	},
	secondaryButton: {
		width: '100%',
		justifyContent: 'center'
	},
	secondaryButtontext: {
		color: '#ff0000'
	},
	Container: {
		paddingTop: 20
	},
	title: {
		textAlign: 'center',
		fontSize: 30,
		fontWeight: 'bold',
		color: 'gray',
		paddingTop: 10
	}
});
