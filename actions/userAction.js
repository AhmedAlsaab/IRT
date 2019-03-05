import { ADD_USER, UPDATE_USER_FUNDS, USER_PAY_FOR_TICKET} from './types'

export function addUser(user){
    return {
        type: ADD_USER,
        payload: user
    }
}

export function updateUserFunds(amount){
    return {
        type: UPDATE_USER_FUNDS,
        payload: amount
    }
}

export function userPayForTicket(amount){
    return {
        type: USER_PAY_FOR_TICKET,
        payload: amount
    }
}
