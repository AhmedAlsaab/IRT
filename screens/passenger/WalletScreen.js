import { Button, Container, Content, Text } from 'native-base';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import GlobalHeader from '../../components/GlobalHeader';

export default class WalletScreen extends React.Component {
	static navigationOptions = {
		header: null
	};

	onSubmit = () => {
		this.props.navigation.navigate('AddFunds');
	};

	render() {
		return (
			<Container>
				<GlobalHeader type={1} />
				<Content>
					<View style={styles.headerContainer}>
						<Text>WALLET</Text>
					</View>
					<View style={styles.balanceContainer}>
						<Text>Your Balance</Text>
						<Text style={styles.balanceSpacing}>£0.00</Text>
						<View>
							<Button danger style={styles.button} onPress={this.onSubmit}>
								<Text>Add Funds</Text>
							</Button>
						</View>
					</View>
					<View>
						<Text style={styles.transactionHeader}>Recent Transactions</Text>
						<View style={styles.purchaseContainer}>
							<View style={styles.purchaseRow}>
								<Text style={styles.left}>06 Feb 19</Text>
								<Text style={styles.right}>£12.00</Text>
							</View>
							<View style={styles.purchaseRow}>
								<Text style={styles.purchaseBold}>Ticket Purchased</Text>
								<Text style={styles.purchaseBold}>- £4.00</Text>
							</View>
						</View>
					</View>
				</Content>
			</Container>
		);
	}
}

const styles = StyleSheet.create({
	headerContainer: {
		padding: 25,
		borderBottomWidth: 1,
		borderBottomColor: '#dfdfdf'
	},
	balanceContainer: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 25,
		shadowOffset: { width: 0, height: -20 },
		shadowColor: 'black',
		shadowOpacity: 1,
		elevation: 10,
		backgroundColor: '#fff',
		marginBottom: 15
	},
	balanceSpacing: {
		margin: 25
	},
	button: {
		width: 175,
		justifyContent: 'center',
		backgroundColor: '#ff0000',
		borderRadius: 5
	},
	transactionHeader: {
		paddingLeft: 25,
		paddingRight: 25,
		paddingTop: 10,
		paddingBottom: 10,
		borderBottomColor: '#dfdfdf',
		borderBottomWidth: 1
	},
	purchaseContainer: {
		flex: 1,
		flexDirection: 'column',
		paddingLeft: 25,
		paddingRight: 25,
		paddingTop: 12,
		paddingBottom: 12,
		borderBottomColor: '#dfdfdf',
		borderBottomWidth: 1
	},
	purchaseRow: {
		flexDirection: 'row',
		marginBottom: 3,
		marginTop: 3,
		justifyContent: 'space-between'
	},
	purchaseBold: {
		fontWeight: 'bold'
	}
});
