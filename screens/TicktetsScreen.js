import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Content, Container, Button, Text, StyleProvider } from 'native-base';
import getTheme from '../native-base-theme/components';
import platform from '../native-base-theme/variables/platform';
import GlobalHeader from '../components/GlobalHeader';
import TicketLayout from './TicketLayout';
import uuid from 'uuid/v4';

import { connect } from 'react-redux';

class TicketsScreen extends React.Component {
	static navigationOptions = {
		header: null
	};

	state = {
		showActive: 0
	};

	openTicket = (ticketData) => {
		this.props.navigation.navigate('Details', { ticket: ticketData });
	};

	showActive = () => {
		this.setState({ showActive: 0 })
	};

	showExpired = () => {
		this.setState({ showActive: 1 })
	};

	navigateTo = () => {
		this.props.navigation.navigate('Ticket');
	};

	render() {
		return (
			<StyleProvider style={getTheme(platform)}>
				<Container>
					<GlobalHeader type={1} navigateTo={this.navigateTo} />
					<Content>
						<View style={styles.header}>
							<View style={styles.buttonContainer}>
								{this.state.showActive === 0 ?
									<>
										<Button style={styles.activeButtonSelected} onPress={this.showActive}>
											<Text>Active Tickets</Text>
										</Button>
										<Button bordered danger style={styles.expiredButton} onPress={this.showExpired}>
											<Text>Expired Tickets</Text>
										</Button>
									</>
									:
									<>
										<Button bordered danger style={styles.activeButton} onPress={this.showActive}>
											<Text>Active Tickets</Text>
										</Button>
										<Button style={styles.expiredButtonSelected} onPress={this.showExpired}>
											<Text>Expired Tickets</Text>
										</Button>
									</>
								}
							</View>
						</View>
						<View style={styles.ticketContainer}>
							{this.props.tickets !== 'undefined' && this.state.showActive === 0 && this.props.tickets.length > 0 && this.props.tickets.map((ticket) => {
								if (ticket.expired === 0) {
									return (
										<TicketLayout onOpen={() => this.openTicket(ticket)} key={uuid()} ticket={ticket} />
									)
								};
							})}
							{this.props.tickets !== 'undefined' && this.state.showActive === 1 && this.props.tickets.length > 0 && this.props.tickets.map((ticket) => {
								if (ticket.expired === 1) {
									return (
										<TicketLayout onOpen={() => this.openTicket(ticket)} key={uuid()} ticket={ticket} />
									)
								};
							})}
						</View>
					</Content>
				</Container>
			</StyleProvider>
		);
	};
};

const styles = StyleSheet.create({
	header: {
		borderBottomColor: '#dfdfdf',
		borderBottomWidth: 1
	},
	buttonContainer: {
		width: '80%',
		flex: 1,
		flexDirection: 'row',
		alignSelf: 'center',
		marginTop: 15,
		marginBottom: 15,
	},
	activeButtonSelected: {
		width: '50%',
		justifyContent: 'center',
		backgroundColor: '#ff0000',
		borderTopRightRadius: 0,
		borderBottomRightRadius: 0,
	},
	expiredButton: {
		width: '50%',
		justifyContent: 'center',
		borderTopLeftRadius: 0,
		borderBottomLeftRadius: 0,
	},
	activeButton: {
		width: '50%',
		justifyContent: 'center',
		borderTopRightRadius: 0,
		borderBottomRightRadius: 0,
	},
	expiredButtonSelected: {
		width: '50%',
		justifyContent: 'center',
		backgroundColor: '#ff0000',
		borderTopLeftRadius: 0,
		borderBottomLeftRadius: 0,
	},
	ticketContainer: {
		justifyContent: 'center',
	},
});

const mapStateToProps = state => ({
	tickets: state.ticketReducer.tickets
});

export default connect(mapStateToProps)(TicketsScreen);