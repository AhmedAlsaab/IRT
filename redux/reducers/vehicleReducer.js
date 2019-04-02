import { FETCH_VEHICLES, ADD_VEHICLE, REMOVE_VEHICLE, SELECT_VEHICLE } from '../actions/types'

const initialState = {
    vehicles: [],
}

export default function (state = initialState, action) {
    switch (action.type) {
        case FETCH_VEHICLES:
            var fetchedVehicles = action.payload;
            const newVehicleList = [];
            let newVehicle = {};

            fetchedVehicles.forEach(vehicle => {
                newVehicle.id = vehicle.vehicle_id;
                newVehicle.make = vehicle.make;
                newVehicle.model = vehicle.model;
                newVehicle.registration = vehicle.registration;
                newVehicle.numPassengers = vehicle.passenger_seats;
                newVehicle.numWheelchairs = vehicle.wheelchair_spaces;
                newVehicle.selectedVehicle = vehicle.currently_driven;
                newVehicle.vehicleType = vehicle.fk_vehicle_type_id;

                newVehicleList.push(newVehicle)
                newVehicle = {}
            });

            return {
                ...state,
                vehicles: newVehicleList,
            }

        case ADD_VEHICLE:
            return {
                ...state,
                vehicles: [...state.vehicles, action.payload],
            }

        case REMOVE_VEHICLE:
            const vehicleId = action.payload;

            return {
                ...state,
                vehicles: state.vehicles.filter(vehicle => vehicle.id !== vehicleId)
            }

        case SELECT_VEHICLE:
            const data = action.payload;

            return {
                ...state,
                vehicles: state.vehicles.map(vehicle => {
                    if (data.selectedVehicle) {
                        if (vehicle.id === data.selectedVehicle.id) {
                            return {
                                ...vehicle,
                                selectedVehicle: 0,
                            }
                        } else if (vehicle.id === data.vehicleToBeSelectedId) {
                            return {
                                ...vehicle,
                                selectedVehicle: 1,
                            }
                        } else {
                            return vehicle
                        }
                    } else if (vehicle.id === data.vehicleToBeSelectedId) {
                        return {
                            ...vehicle,
                            selectedVehicle: 1,
                        }
                    } else {
                        return vehicle
                    }
                })
            }

        default:
            return state;
    }
}