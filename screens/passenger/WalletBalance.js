import React, { Component } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Button, Text } from 'native-base';
import colors from '../../constants/Colors'

import { connect } from 'react-redux';

class WalletBalance extends Component {
	render() {
		if (this.props.type == 2) {
			return (
				<React.Fragment>
					<Text style={{ color: colors.emphasisTextColor, fontWeight: 'bold' }}>{`£${parseFloat(this.props.user.funds).toFixed(2)}`}</Text>
					<Text style={styles.body}>Wallet Balance</Text>
				</React.Fragment>
			);
		} else {
			return (
				<View style={styles.balanceContainer}>
					<Text style={styles.body}>YOUR BALANCE</Text>
					<Text style={styles.balanceSpacing}>{`£${parseFloat(this.props.user.funds).toFixed(2)}`}</Text>
					<View>
						{this.props.type === 1 && (
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

const mapStateToProps = (state) => ({
	user: state.userReducer.user
});

export default connect(mapStateToProps)(WalletBalance);
