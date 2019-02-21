import React, { Component } from 'react';
import { StyleSheet, View, TouchableHighlight, Keyboard, ScrollView, TouchableOpacity } from 'react-native';
// import API_KEY from '../google_api_key';
import _ from 'lodash';
import { Content, Container, Button, Text, Item, Input, StyleProvider } from 'native-base';
import getTheme from '../native-base-theme/components';
import platform from '../native-base-theme/variables/platform';
import GlobalHeader from '../components/GlobalHeader';
import tickets from './data';
import ip from '../ipstore';

import TicketLayout from './TicketLayout';
import { ACTION_ZEN_MODE_EVENT_RULE_SETTINGS } from 'expo/build/IntentLauncherAndroid/IntentLauncherAndroid';

export default class TicketsScreen extends React.Component {
	static navigationOptions = {
		header: null
	};

	state = {
		expansionIsOpen: false,
		isLoadingComplete: false,
		data: [],
		ticketData: []
	};

	componentDidMount() {
		fetch(`http://${ip}:3000/tickets`).then((response) => response.json()).then((response) => {
			this.setState({
				ticketData: response.ticket
			});
		});
	}

	openTicket = (data) => {
		this.props.navigation.navigate('Details', { id: data });
	};

	closeTicket = () => {
		console.log('hello');
		this.setState({
			expansionIsOpen: false
		});
	};

	render() {
		// const data = {
		// 	to: null,
		// 	from: null
		// }

		var ticket = [];
		var count = 0;

		for (let i = 0; i < this.state.ticketData.length; i++) {
			count++;
			var currentTicket = this.state.ticketData[i];

			if (count === 1) {
				// data.to = currentTicket;
				continue;
			}

			if (count === 2) {
				// data.from = currentTicket;
				var ticketId = currentTicket.ticket_id;
				// new Promise((resolve, reject) => {
				ticket.push(<TicketLayout onOpen={() => this.openTicket(ticketId)} key={i} />);
				count = 0;
				// 	resolve();
				// })
				// .then(() => {
				// 	data.to = null;
				// 	data.from = null;
				// 	count = 0;
				// })
			}
			console.log(ticket.length);
		}

		return (
			<StyleProvider style={getTheme(platform)}>
				<ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
					<GlobalHeader type={1} />
					<Container style={styles.contentContainer}>
						<Content>
							<View style={styles.titleContainer}>
								<Text style={styles.title}>My Tickets</Text>
							</View>
							<View style={styles.secondaryButtonContainer}>
								<Button bordered danger style={styles.secondaryButton}>
									<Text style={styles.secondaryButtontext}>Active Tickets</Text>
								</Button>
							</View>
							<View style={styles.Container}>{ticket}</View>
						</Content>
					</Container>
				</ScrollView>
			</StyleProvider>
		);
	}
}

const styles = StyleSheet.create({
	dateTimeContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 10,
		borderBottomWidth: 0.5,
		borderBottomColor: '#d3d3d3',
		height: 50
	},
	dateTime: {
		marginLeft: 6,
		color: '#bcbcbc',
		fontSize: 17
	},
	iconWithInput: {
		marginTop: 10
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
