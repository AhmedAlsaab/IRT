import React, { Component } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Button, Text } from 'native-base';
import colors from '../constants/Colors'

// Method to connect redux and the component
import { connect } from 'react-redux';

class WalletBalance extends Component {
	render() {
		if (this.props.type == 2) {
			return (
				<React.Fragment>
					{/* Show the amount of funds a user has in their account */}
					<Text style={{ color: colors.emphasisTextColor, fontWeight: 'bold' }}>{`£${parseFloat(this.props.user.funds).toFixed(2)}`}</Text>
					<Text style={styles.body}>Wallet Balance</Text>
				</React.Fragment>
			);
		} else {
			return (
				<View style={styles.balanceContainer}>
					<Text style={styles.body}>YOUR BALANCE</Text>
					
					{/* Show the amount of funds a user has in their account */}
					<Text style={styles.balanceSpacing}>{`£${parseFloat(this.props.user.funds).toFixed(2)}`}</Text>
					<View>
						{this.props.type === 1 && (
							// If the prop 'type' = 1, show the add funds button and call the method in 'WalletScreen' to redirect to AddFunds
							<Button danger style={styles.button} onPress={this.props.onSubmit}>
								<Text>Add Funds</Text>
							</Button>
						)}
					</View>
				</View>
			);
		}
	}
}

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
	balanceContainer: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 25,
		shadowOffset: { width: 0, height: -20 },
		shadowColor: 'black',
		shadowOpacity: 1,
		elevation: 5,
		backgroundColor: colors.backgroundColor,
		marginBottom: 15,
		width
	},
	balanceSpacing: {
		fontSize: 40,
		fontWeight: '100',
		color: colors.emphasisTextColor
	},
	button: {
		width: 175,
		justifyContent: 'center',
		backgroundColor: colors.brandColor,
		borderRadius: 5,
		marginTop: 10
	},
	balance: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 8,
		color: colors.emphasisTextColor
	},
	body: {
		color: colors.bodyTextColor,
		fontSize: 16
	}
});

// Retrieve user details from the redux store which include
// the amount of funds they have, which will be used to diplay the balance
const mapStateToProps = (state) => ({
	user: state.userReducer.user
});

// Connect the component to redux
export default connect(mapStateToProps)(WalletBalance);
