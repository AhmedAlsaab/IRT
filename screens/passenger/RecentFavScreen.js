import React, { Component } from 'react';
import { Text, View, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
import { Container, Content } from 'native-base';
import GlobalHeader from '../../components/GlobalHeader';
import ip from '../../ipstore';
import Icon from 'react-native-vector-icons/AntDesign';
import uuid from 'uuid/v4';

import { connect } from 'react-redux';
import { favouriteTicket, removeFavouriteTicket } from '../../redux/actions/ticketAction';
import { postRequestAuthorized } from '../../API';
import colors from '../../constants/Colors';

const { width } = Dimensions.get('window');
class RecentFavScreen extends Component {
	static navigationOptions = {
		header: null
	};

	state = {
		ticketId: null,
		favourited: null
	};

	navigateTo = () => {
		this.props.navigation.navigate('Home');
	};

	toggleFavouriteJourney = () => {
		const data = {
			ticketId: this.state.ticketId,
			favourited: this.state.favourited
		};

		postRequestAuthorized(`http://${ip}:3000/toggleFavourite`, data)
			.then((responseJSON) => {
				switch (responseJSON.status) {
					//Success
					case 10:
						if (this.state.favourited === 1) {
							this.props.favourite(this.state.ticketId);
						} else if (this.state.favourited === 0) {
							this.props.removeFavourite(this.state.ticketId);
						}
						break;
					//User Exists
					case 1:
						this.setState({
							errors: [ { title: 'Errors', content: 'There was an error when favouriting this ticket' } ]
						});
						break;
				}
			})
			.catch((error) => console.log(error));
	};

	favouriteJourneys = () => {
		var favouriteJourneys = false;
		if (this.props.tickets.length > 0) {
			this.props.tickets.forEach((ticket) => {
				if (ticket.favourited === 1) {
					favouriteJourneys = true;
					return false;
				}
			});
		}
		return favouriteJourneys;
	};

	recentJourneys = () => {
		var recentJourneys = false;
		if (this.props.tickets.length > 0) {
			this.props.tickets.forEach((ticket) => {
				if (ticket.completed === 1) {
					recentJourneys = true;
					return false;
				}
			});
		}
		return recentJourneys;
	};

	render() {
		return (
			<Container>
				<GlobalHeader
					type={3}
					navigateTo={this.navigateTo}
					header="Recent and Favourites"
					isBackButtonActive={1}
				/>
				<Content>
					<View style={styles.container}>
						<Text style={styles.header}>FAVOURITE JOURNEYS</Text>
						{!this.favouriteJourneys() && (
							<Text style={styles.body}>You do not have any saved journeys</Text>
						)}
						{this.props.tickets.map((ticket) => {
							if (ticket.favourited === 1) {
								return (
									<View style={styles.journeyContainer} key={uuid()}>
										<View style={styles.coordinateContainer}>
											<View style={styles.coordinateRow}>
												<Text style={styles.coordinateHeader}>FROM:</Text>
												<Text style={styles.coordinate}>
													{ticket.fromStreet}, {ticket.fromCity}
												</Text>
											</View>
											<View style={styles.coordinateRow}>
												<Text style={styles.coordinateHeader}>TO:</Text>
												<Text style={styles.coordinate}>
													{ticket.toStreet}, {ticket.toCity}
												</Text>
											</View>
										</View>
										<TouchableOpacity
											onPress={() => {
												this.setState({ favourited: 0, ticketId: ticket.id }, () => {
													this.toggleFavouriteJourney();
												});
											}}
										>
											<View style={{ justifyContent: 'center' }}>
												<Icon name="star" size={35} color={colors.brandColor} />
											</View>
										</TouchableOpacity>
									</View>
								);
							}
						})}

						<Text style={styles.header}>RECENT JOURNEYS</Text>
						{!this.recentJourneys() && <Text style={styles.body}>You do not have any recent journeys</Text>}
						{this.props.tickets.map((ticket) => {
							if (ticket.completed === 1) {
								return (
									<View style={styles.journeyContainer} key={uuid()}>
										<View style={styles.coordinateContainer}>
											<View style={styles.coordinateRow}>
												<Text style={styles.coordinateHeader}>FROM:</Text>
												<Text style={styles.coordinate}>
													{ticket.fromStreet}, {ticket.fromCity}
												</Text>
											</View>
											<View style={styles.coordinateRow}>
												<Text style={styles.coordinateHeader}>TO:</Text>
												<Text style={styles.coordinate}>
													{ticket.toStreet}, {ticket.toCity}
												</Text>
											</View>
										</View>
										<TouchableOpacity
											onPress={() => {
												this.setState({ favourited: 1, ticketId: ticket.id }, () => {
													this.toggleFavouriteJourney();
												});
											}}
										>
											<View style={{ justifyContent: 'center' }}>
												<Icon name="staro" size={35} color={colors.brandColor} />
											</View>
										</TouchableOpacity>
									</View>
								);
							}
						})}
					</View>
				</Content>
			</Container>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'column',
		marginTop: 10,
		marginRight: width * 0.1,
		marginLeft: width * 0.1
	},
	header: {
		marginBottom: 10,
		marginTop: 20,
		color: colors.emphasisTextColor
	},
	body: {
		color: colors.bodyTextColor
	},
	journeyContainer: {
		flexDirection: 'row',
		borderColor: colors.lightBorder,
		borderWidth: 0.75,
		padding: 10,
		justifyContent: 'space-between',
		marginBottom: 5,
		borderRadius: 5
	},
	coordinateContainer: {
		flexDirection: 'column',
		flex: 5
	},
	coordinateRow: {
		flexDirection: 'row'
	},
	coordinateHeader: {
		color: colors.brandColor,
		flex: 1
	},
	coordinate: {
		flex: 4,
		color: colors.bodyTextColor
	},
	iconContainer: {
		justifyContent: 'center'
	}
});

const mapStateToProps = (state) => ({
	tickets: state.ticketReducer.tickets,
	user: state.userReducer.user
});

const mapDispatchToProps = (dispatch) => {
	return {
		favourite: (ticketId) => dispatch(favouriteTicket(ticketId)),
		removeFavourite: (ticketId) => dispatch(removeFavouriteTicket(ticketId))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(RecentFavScreen);
