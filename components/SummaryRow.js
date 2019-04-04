import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'native-base';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import colors from '../constants/Colors';

export default class SummaryRow extends React.Component {
    render() {
        return (
            <View style={styles.icon}>
                <MaterialIcon name={this.props.iconName} size={20} color={colors.bodyTextColor} />
                <Text style={styles.cardBody}>
                    {this.props.value}
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    cardBody: {
        color: colors.bodyTextColor,
        marginLeft: 6
    },
    icon: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15
    },
})