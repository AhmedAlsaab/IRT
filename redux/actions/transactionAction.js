import { FETCH_TRANSACTIONS, ADD_TRANSACTION } from './types'
import ip from '../../ipstore'

export function addTransaction(transaction){
    return {
        type: ADD_TRANSACTION,
        payload: transaction
    }
}

export function fetchTransactions() {
    return function(dispatch) {
        fetch(`http://${ip}:3000/user/transactions`)
		.then((response) => response.json())
		.then((response) => {
            dispatch({
                type: FETCH_TRANSACTIONS,
				payload: response
        })});
    }
}