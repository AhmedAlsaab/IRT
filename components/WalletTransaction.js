import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import moment from 'moment';
import colors from '../constants/Colors'

// Method to connect redux and the component
import { connect } from 'react-redux';

// Method to fetch the transactions of a user from the redux store
import { fetchTransactions } from '../redux/actions/transactionAction';

class WalletTransaction extends Component {

	componentDidMount() {
		// fetching user transactions
		this.props.fetchTransactions();
	}

	render() {
		const transactions = this.props.transactions.map((transaction) => {
			return (
				<View style={styles.purchaseContainer} key={transaction.transaction_id}>
					<View style={styles.purchaseRow}>
						<Text style={styles.left}>{moment(transaction.date).format("Do MMM YY")}</Text>
						<Text style={styles.right}>{`£${parseFloat(transaction.current_funds).toFixed(2)}`}</Text>
					</View>
					<View style={styles.purchaseRow}>
					{/* Depending on the kind of transaction the user has made, different text will display
					the dfferent options are Funds Added, Ticket Purchased, Concessionary Ticket and Cancelled Ticket */}
						<Text style={styles.purchaseBold}>{transaction.type}</Text>
							{transaction.fk_transaction_type_id === 1 && <Text style={styles.purchaseBold}>- £{parseFloat(transaction.spent_funds).toFixed(2)}</Text>} 
							{transaction.fk_transaction_type_id === 2 && <Text style={styles.purchaseBold}>+ £{parseFloat(transaction.spent_funds).toFixed(2)}</Text>} 
							{transaction.fk_transaction_type_id === 3 && <Text style={styles.purchaseBold}>£{parseFloat(transaction.spent_funds).toFixed(2)}</Text>} 
							{transaction.fk_transaction_type_id === 4 && transaction.cancellation_fee === 0 && <Text style={styles.purchaseBold}>£{parseFloat(transaction.spent_funds).toFixed(2)}</Text>}
							{transaction.fk_transaction_type_id === 4 && transaction.cancellation_fee === 1 && <Text style={styles.purchaseBold}>- £{parseFloat(transaction.spent_funds).toFixed(2)}</Text>}
					</View>
				</View>
			)
		})

		return (
			<View>
				<Text style={styles.transactionHeader}>RECENT TRANSACTIONS</Text>
				{transactions}
			</View>
		)
	}
}

const styles = StyleSheet.create({
	transactionHeader: {
		paddingLeft: 25,
		paddingRight: 25,
		paddingTop: 10,
		paddingBottom: 10,
		color: colors.emphasisTextColor
	},
	purchaseContainer: {
		flex: 1,
		flexDirection: 'column',
		paddingLeft: 25,
		paddingRight: 25,
		paddingTop: 12,
		paddingBottom: 12,
		borderTopColor: colors.lightBorder,
		borderTopWidth: 0.75
	},
	purchaseRow: {
		flexDirection: 'row',
		marginBottom: 3,
		marginTop: 3,
		justifyContent: 'space-between'
	},
	purchaseBold: {
		fontWeight: 'bold',
		color: colors.emphasisTextColor,
	},
	left: {
		color: colors.bodyTextColor,
	},
	right: {
		color: colors.bodyTextColor,
	},
});

// Retrieve user transactions from the redux store 
const mapStateToProps = state => ({
	transactions: state.transactionReducer.transactions
})

// Connect the component to redux
export default connect(mapStateToProps, { fetchTransactions })(WalletTransaction);