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
import { getRequestAuthorized } from '../../API';

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
		getRequestAuthorized(`http://${ip}:3000/ticketsExpired`).then((response) => {
			this.setState({
				ticketData: response.ticketExpired
			});
		});
	}

	openTicket = (data) => {
		this.props.navigation.navigate('Details', { id: data });
	};

	closeTicket = () => {
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
							<View style={{ flex: 1, flexDirection: 'row', paddingTop: 25, paddingBottom: 25 }}>
								<Button bordered danger style={styles.secondaryButton}>
									<Text style={styles.secondaryButtontext}>Active Tickets</Text>
								</Button>
								<Button bordered danger style={styles.secondaryButton}>
									<Text style={styles.secondaryButtontext}>Expired Tickets</Text>
								</Button>
								<View>{ticket}</View>
							</View>
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
		alignSelf: 'center',
		backgroundColor: 'transparent'
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
	secondaryButton: {
		flex: 1,
		flexDirection: 'row',
		width: '50%'
	},
	secondaryButtontext: {
		color: '#ff0000'
	},
	Container: {
		paddingTop: 20,
		backgroundColor: 'transparent'
	},
	title: {
		textAlign: 'center',
		fontSize: 30,
		fontWeight: 'bold',
		color: 'gray',
		paddingTop: 10
	}
});
