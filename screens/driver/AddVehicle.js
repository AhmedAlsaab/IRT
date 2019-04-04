import { Accordion, Button, Container, Content, Text, ListItem, CheckBox, Body } from 'native-base';
import React from 'react';
import { StyleSheet, TouchableOpacity, View, TextInput, KeyboardAvoidingView, Picker } from 'react-native';
import GlobalHeader from '../../components/GlobalHeader';
import colors from '../../constants/Colors';
import ip from '../../server/keys/ipstore';
var vehicleData = require('../../vehicleData.json');

import { connect } from 'react-redux';
import { addVehicle } from './../../redux/actions/vehicleAction';
import { fetchVehicles } from '../../redux/actions/vehicleAction';
import { postRequestAuthorized } from '../../API';
import CustomInput from './../../components/CustomInput';

class AddVehicle extends React.Component {
	static navigationOptions = {
		header: null
	};
	state = {
		makeId: null,
		make: null,
		model: null,
		registration: null,
		numSeats: null,
		wheelchairAccess: false,
		numWheelchairs: null,
		currentlyDriven: null,
		vehicleType: null,

		registrationFocused: false,
		numSeatsFocused: false,
		vehicleTypeFocused: false,

		models: []
	};

	onSubmit = () => {
		const { make, model, registration, numSeats, numWheelchairs, vehicleType } = this.state;
		const data = {
			make: make,
			model: model,
			registration: registration.toUpperCase(),
			numPassengers: numSeats,
			numWheelchairs: numWheelchairs ? numWheelchairs : 0,
			currentlyDriven: 0,
			vehicleType: vehicleType
		};
		// Send data to the server
		postRequestAuthorized(`http://${ip}:3000/driver/vehicles/addVehicle`, data)
			.then((responseJSON) => {
				switch (responseJSON.status) {
					//Success
					case 10:
						// If successfully stored, add the vehicle to the redux array and re-fetch
						// tickets so the new vehicle is pulled into Redux in case the vehicle
						// needs to be removed in which case the id is required.
						this.props.addVehicle(data);
						this.props.navigation.state.params.onFetchNewVehicleId();
						this.navigateTo();
						break;
					//Input Validation Failed
					case 0:
						this.setState({
							errors: this.parseErrors(responseJSON.errors)
						});
						break;
				}
			})
			.catch((error) => console.log(error));
	};

	// If there are validation errors, pass them and return them in an array
	parseErrors = (errorList) => {
		var errors = {
			title: 'Errors',
			content: ''
		};

		for (var i = 0; i < errorList.length; i++) {
			errors.content += errorList[i].msg + '\n';
		}

		return [errors];
	};

	componentDidUpdate() {
		this.props.fetchVehicles();
	}

	// When a make is selected make note of the details so that models can be determined
	onMakeSelect = (itemId, itemMake) => {
		this.setState({
			makeId: itemId,
			make: itemMake
		});
		this.props.navigation.navigate('AddVehicle');
	};

	// Sets state of model and empties the previous array of models in case user selects new make
	onModelSelect = (itemModel) => {
		this.setState({
			model: itemModel
		});
		this.setState({ models: [] });
		this.props.navigation.navigate('AddVehicle');
	};

	// Clear the states for model as they will change based on choice of make
	navigateToMakeSelect = () => {
		this.setState({ model: null, models: [] });
		const data = {
			vehicleData: vehicleData.car_makes,
			selectType: 'make',
			header: 'Select a Make',
			dividers: true
		};
		this.props.navigation.navigate('MakeModelSelect', {
			onMakeSelect: this.onMakeSelect,
			onNavigateBack: this.onNavigateBack,
			data: data
		});
	};

	// Take the make details and determine the models to show before generating the list
	navigateToModelSelect = () => {
		this.determineModels();
		const data = {
			vehicleData: this.state.models,
			selectType: 'model',
			header: 'Select a Model',
			dividers: false,
			makeId: this.state.makeId
		};
		this.props.navigation.navigate('MakeModelSelect', {
			onModelSelect: this.onModelSelect,
			onNavigateBack: this.onNavigateBack,
			data: data
		});
	};

	// Determines the models based on make
	determineModels = () => {
		vehicleData.car_models.forEach((item) => {
			if (this.state.makeId === item.make_id) {
				this.setState({
					models: this.state.models.push(item)
				});
			}
		});
	};

	onNavigateBack = () => {
		this.setState({ models: [] });
		this.props.navigation.navigate('AddVehicle');
	};

	navigateTo = () => {
		this.props.navigation.navigate('MyVehicles');
	};

	render() {
		return (
			<Container>
				<GlobalHeader type={3} navigateTo={this.navigateTo} header="Add a vehicle" isBackButtonActive={1} />
				<Content>
					{/* Display validation errors here */}
					{this.state.errors &&
						!!this.state.errors.length && (
							<Accordion
								dataArray={this.state.errors}
								icon="add"
								expandedIcon="remove"
								contentStyle={styles.errorStyle}
								expanded={0}
							/>
						)}
					{this.state.error && (
						<Accordion
							dataArray={this.state.error}
							icon="add"
							expandedIcon="remove"
							contentStyle={styles.errorStyle}
							expanded={0}
						/>
					)}
					<KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
						<Content style={styles.content}>
							<View style={styles.contentContainer}>
								{/* Car make */}
								<TouchableOpacity
									onPress={this.navigateToMakeSelect}
									style={[
										styles.inputContainer,
										{ borderBottomColor: colors.lightBorder, height: 50 }
									]}
								>
									<Text style={styles.text}>{this.state.make ? this.state.make : 'Make'}</Text>
								</TouchableOpacity>

								{/* Car model */}
								<TouchableOpacity
									disabled={this.state.makeId ? false : true}
									onPress={this.navigateToModelSelect}
									style={[
										styles.inputContainer,
										{ borderBottomColor: colors.lightBorder, height: 50 }
									]}
								>
									<Text
										style={[
											styles.text,
											{ color: this.state.makeId ? colors.bodyTextColor : colors.lightBorder }
										]}
									>
										{this.state.model ? this.state.model : 'Model'}
									</Text>
								</TouchableOpacity>

								{/* Car registration */}
								<CustomInput
									focused={this.state.registrationFocused}
									placeholder={"Registration"}
									value={this.state.registration ? this.state.registration.toString() : null}
									onFocus={() => this.setState({ registrationFocused: true })}
									onBlur={() => this.setState({ registrationFocused: false })}
									onChangeText={(value) => this.setState({ registration: value })}
								/>

								{/* Car number of seats */}
								<CustomInput
									focused={this.state.numSeatsFocused}
									placeholder={"No. of passenger seats"}
									value={this.state.numSeats ? this.state.numSeats.toString() : null}
									onFocus={() => this.setState({ numSeatsFocused: true })}
									onBlur={() => this.setState({ numSeatsFocused: false })}
									onChangeText={(value) => this.setState({ numSeats: value })}
								/>

								{/* Wheelchair spaces option */}
								<ListItem
									style={{
										marginLeft: 5,
										borderBottomWidth: 0.75,
										borderBottomColor: colors.lightBorder
									}}
								>
									<CheckBox
										checked={this.state.wheelchairAccess}
										onPress={() =>
											this.setState({ wheelchairAccess: !this.state.wheelchairAccess })}
										color={colors.bodyTextColor}
									/>
									<Body>
										<Text style={styles.body}>Wheelchair spaces?</Text>
									</Body>
								</ListItem>

								{/* Car number of wheelchairs */}
								{this.state.wheelchairAccess &&
									<CustomInput
										focused={this.state.wheelchairAccessFocused}
										placeholder={"No. of wheelchair spaces"}
										value={this.state.numWheelchairs ? this.state.numWheelchairs.toString() : null}
										onFocus={() => this.setState({ wheelchairAccessFocused: true })}
										onBlur={() => this.setState({ wheelchairAccessFocused: false })}
										onChangeText={(value) => this.setState({ numWheelchairs: value })}
									/>
								}

								{/* Vehicle type picker */}
								<View
									style={[
										styles.inputContainer,
										{ borderBottomColor: colors.lightBorder, height: 50 }
									]}
								>
									<Picker
										name="type"
										style={styles.inputPicker}
										itemStyle={{ color: colors.bodyTextColor }}
										selectedValue={this.state.vehicleType}
										onValueChange={(itemValue, itemIndex) =>
											this.setState({ vehicleType: itemValue })}
									>
										<Picker.Item
											color={colors.bodyTextColor}
											size={5}
											label="Select a vehicle type"
											value={0}
										/>
										<Picker.Item color={colors.bodyTextColor} fontSize={5} label="Bus" value={1} />
										<Picker.Item color={colors.bodyTextColor} fontSize={5} label="Mini Bus" value={2} />
										<Picker.Item color={colors.bodyTextColor} fontSize={5} label="Taxi" value={3} />
										<Picker.Item color={colors.bodyTextColor} fontSize={5} label="Car" value={4} />
									</Picker>
								</View>

								{/* Add vehicle */}
								<View style={styles.buttonContainer}>
									<Button danger style={styles.button} onPress={() => this.onSubmit()}>
										<Text>Add Vehicle</Text>
									</Button>
								</View>
							</View>
						</Content>
					</KeyboardAvoidingView>
				</Content>
			</Container>
		);
	}
}

const styles = StyleSheet.create({
	content: {
		flex: 1
	},
	dateTime: {
		marginLeft: 8,
		color: colors.bodyTextColor,
		fontSize: 14
	},
	inputContainer: {
		flexDirection: 'row',
		borderBottomWidth: 0.75,
		alignItems: 'center'
	},
	input: {
		width: '100%',
		padding: 10,
		color: colors.bodyTextColor
	},
	inputPicker: {
		height: 50,
		width: 350
	},
	locationSuggestion: {
		color: colors.emphasisTextColor,
		backgroundColor: 'white',
		padding: 5,
		borderBottomWidth: 0.5,
		borderBottomColor: colors.emphasisTextColor
	},
	contentContainer: {
		width: '80%',
		marginTop: 20,
		marginBottom: 20,
		flex: 1,
		flexDirection: 'column',
		alignSelf: 'center',
		justifyContent: 'flex-end'
	},
	map: {
		...StyleSheet.absoluteFillObject
	},
	buttonContainer: {
		flexDirection: 'row',
		alignSelf: 'center',
		alignItems: 'center',
		marginTop: 20,
		marginBottom: 15
	},
	button: {
		width: '100%',
		justifyContent: 'center',
		backgroundColor: colors.brandColor
	},
	secondaryButtonContainer: {
		flexDirection: 'row',
		marginTop: 25,
		marginBottom: 20
	},
	secondaryButton: {
		width: '100%',
		justifyContent: 'center'
	},
	secondaryButtontext: {
		color: colors.brandColor
	},
	body: {
		color: colors.bodyTextColor,
		fontSize: 14
	},
	checkboxContainer: {
		justifyContent: 'flex-start'
	},
	text: {
		fontSize: 14,
		color: colors.bodyTextColor,
		padding: 10
	}
});

const mapDispatchToProps = (dispatch) => {
	return {
		addVehicle: (vehicle) => dispatch(addVehicle(vehicle)),
		fetchVehicles: () => dispatch(fetchVehicles())
	};
};

export default connect(null, mapDispatchToProps)(AddVehicle);
