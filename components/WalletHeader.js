import React, { Component } from 'react'
import { Text, View, StyleSheet, Dimensions} from 'react-native'
import colors from '../constants/Colors'

export default class WalletHeader extends Component {
  render() {
    return (
        <View style={styles.headerContainer}>
            <Text style={styles.headerText}>{this.props.title}</Text>
        </View>
    )
  }
}

const { width } = Dimensions.get('window')
const styles = StyleSheet.create({
	headerContainer: {
        flexDirection: 'row',
		padding: 25,
		borderBottomWidth: 1,
        borderBottomColor: colors.bodyTextColor,
        width
    },
    headerText: {
        alignSelf: 'flex-start',
		fontSize: 25,
		fontWeight: '100'
	},
});
