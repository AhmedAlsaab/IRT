import React, { Component } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';

export default class ResultJourney extends Component {

  render() {
    return (
      <TouchableOpacity style={{ padding: 10, borderBottomColor: '#dfdfdf', borderBottomWidth: 1, flexDirection: "row", alignItems: 'center' }} onPress={this.props.onClick}>
        <View style={{ flex: 1 }}><Text style={{ fontWeight: 'bold' }}>{`${this.props.departDays} days \n ${this.props.departHours} hours \n ${this.props.departMinutes} mins`}</Text></View>
        <View style={{ flexDirection: 'row', flex: 5 }}>
          <View style={{ flexDirection: 'column', flex: 1, marginLeft: 20, marginRight: 20 }}>
            <View style={{ flexDirection: "row", justifyContent: 'flex-start' }}><Icon name="md-walk" size={25} style={{ marginRight: 20 }} /><Icon name="md-bus" size={25} /></View>

            <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
              <Text>{moment(this.props.startDate).format('hh:mm a')} - {moment(this.props.endDate).format('hh:mm a')}</Text>
              <Text>{`${this.props.totalHours} hr ${this.props.totalMinutes} min`}</Text>
            </View>
          </View>
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={{ fontWeight: 'bold', fontSize: 20 }}>£{3 * this.props.passengers}.00</Text>
          <Text></Text>
        </View>
      </TouchableOpacity>
    )
  }
}