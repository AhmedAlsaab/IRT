import React, { Component } from 'react'
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native'
import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../constants/Colors';

export default class ResultJourney extends Component {

  render() {
    return (
      <TouchableOpacity style={styles.container} onPress={this.props.onClick}>
        <View style={{ flex: 1 }}>
          <Text style={styles.departure}>{`${this.props.departDays} days \n ${this.props.departHours} hours \n ${this.props.departMinutes} mins`}</Text>
        </View>
        <View style={styles.travelInfo}>
          <View style={styles.details}>
            <View style={styles.iconRow}>
              <Icon name="md-walk" size={25} color={colors.bodyTextColor} style={{ marginRight: 20 }} />
              <Icon name="md-bus" size={25} color={colors.bodyTextColor} />
            </View>

            <View style={styles.timeContainer}>
              <Text style={styles.body}>{moment(this.props.startDate).format('hh:mm a')} - {moment(this.props.endDate).format('hh:mm a')}</Text>
              <Text style={styles.body}>{`${this.props.totalHours} hr ${this.props.totalMinutes} min`}</Text>
            </View>
          </View>
        </View>
        <View style={styles.costContainer}>
          <Text style={styles.body}>Total</Text>
          <Text style={styles.price}>£{this.props.returnTicket === 0 ? 3 : 6 * this.props.passengers}.00</Text>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderBottomColor: '#dfdfdf',
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: 'center'
  },
  departure: {
    fontWeight: 'bold',
    fontSize: 14,
    color: colors.emphasisTextColor
  },
  travelInfo: {
    flexDirection: 'row',
    flex: 5
  },
  details: {
    flexDirection: 'column',
    flex: 1,
    marginLeft: 20,
    marginRight: 20
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: 'flex-start'
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: 'space-between'
  },
  body: {
    color: colors.bodyTextColor
  },
  costContainer: {
    flex: 1,
    alignItems: "center",
  },
  price: {
    fontWeight: 'bold',
    fontSize: 14,
    color: colors.emphasisTextColor
  },

});