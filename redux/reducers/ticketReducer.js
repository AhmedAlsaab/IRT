import {
	FETCH_TICKETS,
	CANCEL_TICKET,
	AMEND_TICKET,
	ADD_TICKET,
	FAVOURITE_TICKET,
	REMOVE_FAVOURITE_TICKET
} from '../actions/types';

const initialState = {
	tickets: [],
	ticketsLength: 0
};

export default function (state = initialState, action) {
	switch (action.type) {
		case FETCH_TICKETS:
			const fetchedTickets = action.payload.ticket;
			const newTicketList = [];
			let newTicket = {};

			for (let i = 1; i < fetchedTickets.length + 1; i++) {
				const ticket = fetchedTickets[i - 1];

				if (i % 2 === 1) {
					newTicket.id = ticket.ticket_id;
					newTicket.fromCity = ticket.city;
					newTicket.fromStreet = ticket.street;
					newTicket.date = ticket.date_of_journey;
					newTicket.time = ticket.time_of_journey;
					newTicket.startTime = ticket.start_time;
					newTicket.endTime = ticket.end_time;
					newTicket.expired = ticket.expired;
					newTicket.paid = ticket.paid;
					newTicket.used = ticket.used;
					newTicket.cancelled = ticket.cancelled;
					newTicket.completed = ticket.completed;
					newTicket.favourited = ticket.favourited;
					newTicket.accessibilityRequired = ticket.accessibility_required;
					newTicket.numPassengers = ticket.no_of_passengers;
					newTicket.numWheelchairs = ticket.no_of_wheelchairs;
					newTicket.returnTicket = ticket.returnTicket;
					continue;
				}

				newTicket.toCity = ticket.city;
				newTicket.toStreet = ticket.street;

				newTicketList.push(newTicket);
				newTicket = {};
			}

			return {
				...state,
				tickets: newTicketList,
				ticketsLength: newTicketList.length + 1
			};

		case CANCEL_TICKET:
			return {
				...state,
				tickets: state.tickets.map(
					(ticket) => (ticket.id === action.payload ? { ...ticket, cancelled: 1, expired: 1 } : ticket)
				)
			};

		// Amend a ticket with the new data
		case AMEND_TICKET:
			const data = action.payload;

			return {
				...state,
				tickets: state.tickets.map(
					(ticket) =>
						ticket.id === data.ticketId
							? {
								...ticket,
								numWheelchairs: data.numWheelchair,
								date: data.date,
								time: data.time
							}
							: ticket
				)
			};

		// Favourite a ticket
		case FAVOURITE_TICKET:
			return {
				...state,
				tickets: state.tickets.map(
					(ticket) => (ticket.id === action.payload ? { ...ticket, favourited: 1 } : ticket)
				)
			};

		// Remove a ticket from favourites
		case REMOVE_FAVOURITE_TICKET:
			return {
				...state,
				tickets: state.tickets.map(
					(ticket) => (ticket.id === action.payload ? { ...ticket, favourited: 0 } : ticket)
				)
			};

		case ADD_TICKET:
			return {
				...state,
				tickets: [...state.tickets, action.payload],
				ticketsLength: state.ticketsLength + 1
			};

		default:
			return state;
	}
}
