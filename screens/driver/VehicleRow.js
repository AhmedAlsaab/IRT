import { Text } from 'native-base';
import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Dialog, { DialogFooter, DialogButton, DialogContent, DialogTitle, SlideAnimation } from 'react-native-popup-dialog';
import colors from '../../constants/Colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ip from '../../ipstore';

import { connect } from 'react-redux';
import { removeVehicle, selectVehicle } from '../../redux/actions/vehicleAction';
import { postRequestAuthorized } from '../../API'

class VehicleRow extends React.Component {
	static navigationOptions = {
		header: null
	};

	state = {
		deleteDialog: false,
		selectDialog: false,
	};

	getIconName = (vehicleType) => {
		if (vehicleType === 1) {
			return "bus"
		} else if (vehicleType === 2) {
			return "van-passenger"
		} else if (vehicleType === 3) {
			return "taxi"
		} else if (vehicleType === 4) {
			return "car"
		}
	};

	showDeleteConfirmDialog = () => {
		this.setState({
			deleteDialog: true
		});
	};

	hideDeleteConfirmDialog = () => {
		this.setState({
			deleteDialog: false
		});
	};

	deleteVehicle = (id) => {
		data = {
			id: id,
		}
		postRequestAuthorized(`http://${ip}:3000/driver/vehicles/removeVehicle`, data)
			.then((responseJSON) => {
				switch (responseJSON.status) {
					//Success
					case 10:
						this.props.removeVehicle(id);
				}
			})
			.catch((error) => console.log(error));
	};

	showSelectConfirmDialog = () => {
		this.setState({
			selectDialog: true
		});
	};

	hideSelectConfirmDialog = () => {
		this.setState({
			selectDialog: false
		});
	};

	selectVehicle = (id) => {
		const data = {
			selectedVehicle: this.props.selectedVehicle,
			vehicleToBeSelectedId: id
		}
		postRequestAuthorized(`http://${ip}:3000/driver/vehicles/selectVehicle`, data)
			.then((responseJSON) => {
				switch (responseJSON.status) {
					//Success
					case 10:
						this.props.selectVehicle(data);
				}
			})
			.catch((error) => console.log(error));
	};

	render() {
		vehicle = this.props.vehicle;
		return (
			<View style={styles.card}>
				<View style={styles.icon}>
					<Icon
						name={this.getIconName(vehicle.vehicleType)}
						color={colors.bodyTextColor}
						size={40} />
				</View>
				<View style={styles.details}>
					<Text style={{ color: colors.emphasisTextColor }}>{vehicle.make} {vehicle.model}</Text>
					<Text style={{ color: colors.emphasisTextColor }}>Registration: <Text style={{ color: colors.bodyTextColor }}>{vehicle.registration}</Text></Text>
				</View>
				<View style={styles.actionIcons}>
					<TouchableOpacity onPress={this.showDeleteConfirmDialog}>
						{this.props.activeVehicle &&
							<Icon name="check-circle" color={colors.success} size={25} />
						}
						{!this.props.activeVehicle &&
							<>
								<TouchableOpacity onPress={this.showSelectConfirmDialog}>
									<Icon name="check-circle-outline" color={colors.bodyTextColor} size={25} />
								</TouchableOpacity>
								<TouchableOpacity onPress={this.showDeleteConfirmDialog}>
									<Icon name="delete" color={colors.bodyTextColor} size={25} />
								</TouchableOpacity>
							</>
						}
					</TouchableOpacity>
				</View>

				{/* Delete confirmation dialogue */}
				<Dialog
					dialogAnimation={new SlideAnimation}
					width={0.8}
					visible={this.state.deleteDialog}
					dialogTitle={
						<DialogTitle textStyle={styles.dialogTitle} color={colors.emphasisTextColor} title="DELETE VEHICLE" />
					}
					footer={
						<DialogFooter>
							<DialogButton
								textStyle={{ color: colors.brandColor }}
								text="REMOVE"
								onPress={() => {
									this.deleteVehicle(vehicle.id);
									this.hideDeleteConfirmDialog();
								}} />
							<DialogButton
								textStyle={{ color: colors.bodyTextColor }}
								text="CANCEL"
								onPress={this.hideDeleteConfirmDialog}
							/>
						</DialogFooter>
					}
					onTouchOutside={this.hideDeleteConfirmDialog}
				>
					<DialogContent>
						<Text style={styles.body}>Are you sure you want to delete this vehicle? </Text>
					</DialogContent>
				</Dialog>

				{/* Select confirmation dialogue */}
				<Dialog
					dialogAnimation={new SlideAnimation}
					width={0.8}
					visible={this.state.selectDialog}
					dialogTitle={
						<DialogTitle textStyle={styles.dialogTitle} color={colors.emphasisTextColor} title="SELECT VEHICLE" />
					}
					footer={
						<DialogFooter>
							<DialogButton
								textStyle={{ color: colors.brandColor }}
								text="YES"
								onPress={() => {
									this.selectVehicle(vehicle.id);
									this.hideSelectConfirmDialog();
								}} />
							<DialogButton
								textStyle={{ color: colors.bodyTextColor }}
								text="CANCEL"
								onPress={this.hideSelectConfirmDialog}
							/>
						</DialogFooter>
					}
					onTouchOutside={this.hideSelectConfirmDialog}
				>
					<DialogContent>
						<Text style={styles.body}>Select this as your currently driven vehicle? </Text>
					</DialogContent>
				</Dialog>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	card: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 15,
		borderBottomColor: colors.lightBorder,
		borderBottomWidth: 0.75,
		backgroundColor: colors.backgroundColor,
		marginBottom: 0.5,
	},
	icon: {
		width: '20%',
		alignItems: 'center',
		justifyContent: 'center'
	},
	details: {
		width: '70%'
	},
	actionIcons: {
		flex: 1,
		width: '10%',
		justifyContent: 'space-between',
	},
	dialogTitle: {
		color: colors.emphasisTextColor,
	},
	body: {
		marginTop: 20,
		color: colors.bodyTextColor,
	}
});

const mapDispatchToProps = (dispatch) => {
	return {
		removeVehicle: (vehicleId) => dispatch(removeVehicle(vehicleId)),
		selectVehicle: (data) => dispatch(selectVehicle(data)),
	};
};

const mapStateToProps = state => ({
	vehicles: state.vehicleReducer.vehicles,
});

export default connect(mapStateToProps, mapDispatchToProps)(VehicleRow);