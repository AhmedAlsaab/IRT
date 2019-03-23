import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import moment from 'moment';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import colors from '../constants/Colors';

export default class TicketLayout extends Component {
	render() {
		const ticket = this.props.ticket;
		return (
			<View style={styles.card}>
				<View style={styles.ticketTypeContainer}>
					{ticket.expired ?
						<View style={[styles.ticketType, { backgroundColor: colors.bodyTextColor }]}>
							<Text style={styles.ticketTypeText}>
								SGL
								{/* Code prepared for return tickets - don't remove */}
								{/* {ticket.return === 1 ? 'RTN' : 'SGL'} */}
							</Text>
						</View>
						:
						<View style={styles.ticketType}>
							<Text style={styles.ticketTypeText}>
								SGL
								{/* Code prepared for return tickets - don't remove */}
								{/* {ticket.return === 1 ? 'RTN' : 'SGL'} */}
							</Text>
						</View>
					}
				</View>
				<TouchableOpacity style={styles.ticket} onPress={this.props.onOpen}>
					<View style={styles.ticketHeader}>
						<View style={styles.ticketDateTime}>
							<Text style={styles.dateText}>{moment(ticket.date).format('Do MMMM YYYY')}</Text>
							<Text style={styles.timeText}>{moment(ticket.time).format('LT')}</Text>
						</View>
						<View style={styles.passengerInfo}>
							<View style={styles.icon}>
								<IonIcon name="md-people" size={20} color={colors.bodyTextColor} />
								<Text style={[styles.body, { marginLeft: 5 }]}>
									{ticket.numPassengers}
								</Text>
							</View>
							{ticket.numWheelchairs > 0 ?
								<View style={styles.icon}>
									<MaterialIcon name="accessible" size={20} color={colors.bodyTextColor} />
									<Text style={[styles.body, { marginLeft: 5 }]}>
										{ticket.numWheelchairs}
									</Text>
								</View>
								: null}
						</View>
					</View>
					<View style={styles.ticketDetails}>
						<View style={styles.ticketFrom}>
							<Text style={styles.body}>{ticket.fromStreet}, {ticket.fromCity}</Text>
						</View>
						<View style={styles.ticketTypeIcon}>
							{/* Code prepared for return tickets - don't remove */}
							{/* {ticket.return ?
									<IonIcon name="ios-swap" size={30} color="#999999" />
									:
									<IonIcon name="ios-arrow-round-forward" size={30} color="#999999" />
								} */}
							<IonIcon name="ios-arrow-round-forward" size={30} color="#999999" />
						</View>
						<View style={styles.ticketTo}>
							<Text style={styles.body}>{ticket.toStreet}, {ticket.toCity}</Text>
						</View>
					</View>
				</TouchableOpacity>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	card: {
		flex: 1,
		flexDirection: 'row',
		borderBottomColor: colors.lightBorder,
		borderBottomWidth: 1
	},
	ticketTypeContainer: {
		width: '10%',
		marginRight: 10,
		flexDirection: 'row',
	},
	ticketType: {
		backgroundColor: colors.brandColor,
		top: 10,
		flex: 1,
		alignSelf: 'flex-start',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		borderTopRightRadius: 5,
		borderBottomRightRadius: 5,
		paddingTop: 2,
		paddingBottom: 3,
	},
	ticketTypeText: {
		color: colors.backgroundColor,
		fontWeight: 'bold',
	},
	ticket: {
		width: '90%',
		flex: 1,
		flexDirection: 'column',
	},
	ticketHeader: {
		flexDirection: 'row',
		marginTop: 10,
	},
	ticketDateTime: {
		width: '57%',
	},
	dateText: {
		color: colors.bodyTextColor,
		fontSize: 16,
	},
	timeText: {
		color: colors.emphasisTextColor,
		fontSize: 18,
		marginTop: 5,
	},
	passengerInfo: {
		width: '43%',
		flexDirection: 'row',
		alignSelf: 'flex-start',
	},
	ticketDetails: {
		marginTop: 5,
		flex: 1,
		flexDirection: 'row',
		marginBottom: 10,
		width: '98%',
	},
	ticketFrom: {
		width: '40%',
		marginRight: 10,
		justifyContent: 'center',
	},
	ticketTypeIcon: {
		width: '10%',
		marginRight: 15,
		justifyContent: 'center',
		alignItems: 'center',
	},
	ticketTo: {
		width: '40%',
		justifyContent: 'center',
	},
	body: {
		color: colors.bodyTextColor,
		fontSize: 14,
	},
	icon: {
		flexDirection: 'row',
		alignItems: 'center',
		marginRight: 15,
	},
});
