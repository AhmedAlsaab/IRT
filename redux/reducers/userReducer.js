import { ADD_USER, UPDATE_USER_FUNDS, USER_PAY_FOR_TICKET} from '../actions/types'

const initialState = {
    user: null
}

export default function(state = initialState, action) {
    switch(action.type) {
        case ADD_USER:
            return {
                ...state,
                user: action.payload
            }
        case UPDATE_USER_FUNDS:
            return {
                ...state,
                user: {
                    ...state.user,
                    funds: parseFloat(parseInt(state.user.funds) + parseInt(action.payload)).toFixed(2)
                }
            }
        case USER_PAY_FOR_TICKET:
            return {
                ...state,
                user: {
                    ...state.user,
                    funds: parseFloat(parseInt(state.user.funds) - parseInt(action.payload)).toFixed(2)
                }
            }
        default:
            return state;
    }
}