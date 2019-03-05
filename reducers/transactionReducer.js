import { FETCH_TRANSACTIONS, ADD_TRANSACTION} from '../actions/types'

const initialState = {
    transactions: []
}

export default function(state = initialState, action) {
    switch(action.type) {
        case FETCH_TRANSACTIONS:
            return {
                ...state,
                transactions: action.payload
            }
        case ADD_TRANSACTION:
            return {
                ...state,
                transactions: [action.payload, ...state.transactions]
            }
        default:
            return state;
    }
}