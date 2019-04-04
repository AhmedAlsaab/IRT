import { FETCH_TRANSACTIONS, ADD_TRANSACTION } from './types';
import ip from '../../server/keys/ipstore';
import { getRequestAuthorized } from '../../API';

export function addTransaction(transaction) {
	return {
		type: ADD_TRANSACTION,
		payload: transaction
	};
}

export function fetchTransactions() {
	return function(dispatch) {
		getRequestAuthorized(`http://${ip}:3000/user/transactions`).then((response) => {
			dispatch({
				type: FETCH_TRANSACTIONS,
				payload: response
			});
		});
	};
}
