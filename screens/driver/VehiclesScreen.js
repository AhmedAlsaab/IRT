import { Container, Text } from 'native-base';
import React from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native';
import GlobalHeader from '../../components/GlobalHeader';
import colors from '../../constants/Colors';
import addIcon from '../../assets/images/add.png';
import uuid from 'uuid/v4';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { connect } from 'react-redux';
import VehicleRow from '../../components/VehicleRow';
import { fetchVehicles } from '../../redux/actions/vehicleAction';

class VehiclesScreen extends React.Component {
	static navigationOptions = {
		header: null
	};

	navigateToAddVehicle = () => {
		this.props.navigation.navigate('AddVehicle', { onFetchNewVehicleId: this.fetchNewVehicleId });
	};

	navigateTo = () => {
		this.props.navigation.navigate('');
	};

	// Check if a vehicle is already selected and if so return it
	selectedVehicle = () => {
		var selectedVehicle;
		if (this.props.vehicles.length > 0) {
			this.props.vehicles.forEach(vehicle => {
				if (vehicle.selectedVehicle === 1) {
					selectedVehicle = vehicle;
				}
			})
		}
		return selectedVehicle;
	}

	// Fetch the list of vehicles again if a new vehicle is added so that it's id can be used
	fetchNewVehicleId = () => {
		this.props.fetchVehicles();
	}

	render() {
		return (
			<Container>
				<GlobalHeader type={1} navigateTo={this.navigateTo} />
				<ScrollView style={styles.container}>
					<View style={[styles.headerContainer, {
						borderBottomColor: this.selectedVehicle() && colors.lightBorder,
						borderBottomWidth: this.selectedVehicle() && 0.75
					}]}>
						<Text style={styles.header}>CURRENTLY DRIVING</Text>
					</View>

					{/* If there is a vehicle selected render it */}
					{this.selectedVehicle() ?
						<VehicleRow vehicle={this.selectedVehicle()} activeVehicle={true} /> :
						<Text style={styles.body}>No vehicle currently selected</Text>
					}
					<View style={[styles.headerContainer, {
						borderBottomColor: (this.props.vehicles.length > 0) ? colors.lightBorder : colors.backgroundColor,
						borderBottomWidth: (this.props.vehicles.length > 0) ? 0.75 : 0
					}]}>
						<Text style={styles.header}>YOUR VEHICLES</Text>
						<TouchableOpacity style={styles.addButton} onPress={this.navigateToAddVehicle}>
							<Text style={styles.header}>ADD </Text><Icon name="plus-circle-outline" color={colors.brandColor} size={20} />
						</TouchableOpacity>
					</View>

					{/* If the user has stored vehicles render them */}
					{(this.props.vehicles && this.props.vehicles.length > 0) ?
						this.props.vehicles.map((vehicle) => {
							return (
								<VehicleRow vehicle={vehicle} key={uuid()} activeVehicle={false} selectedVehicle={this.selectedVehicle()} />
							)
						}) :
						<Text style={styles.body}>No saved vehicles to show</Text>
					}
				</ScrollView>
			</Container>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	header: {
		color: colors.emphasisTextColor,
	},
	body: {
		marginLeft: 25,
		color: colors.bodyTextColor,
	},
	headerContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '100%',
		paddingTop: 20,
		paddingBottom: 10,
		paddingLeft: 25,
		paddingRight: 25,
	},
	addButton: {
		flexDirection: 'row',
	}
});

const mapStateToProps = state => ({
	vehicles: state.vehicleReducer.vehicles,
});

const mapDispatchToProps = (dispatch) => {
	return {
		fetchVehicles: () => dispatch(fetchVehicles()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(VehiclesScreen);