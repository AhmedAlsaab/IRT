import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import colors from '../constants/Colors';

export default class JourneyRow extends React.Component {
    render() {
        const ticket = this.props.ticket;
        return (
            <View style={styles.journeyContainer}>
                <View style={styles.coordinateContainer}>
                    <View style={styles.coordinateRow}>
                        <Text style={styles.coordinateHeader}>FROM:</Text>
                        <Text style={styles.coordinate}>
                            {ticket.fromStreet}, {ticket.fromCity}
                        </Text>
                    </View>
                    <View style={styles.coordinateRow}>
                        <Text style={styles.coordinateHeader}>TO:</Text>
                        <Text style={styles.coordinate}>
                            {ticket.toStreet}, {ticket.toCity}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity
                    onPress={this.props.onPress}
                >
                    <View style={{ justifyContent: 'center' }}>
                        <Icon name={this.props.iconName} size={35} color={colors.brandColor} />
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    journeyContainer: {
        flexDirection: 'row',
        borderColor: colors.lightBorder,
        borderWidth: 0.75,
        padding: 10,
        justifyContent: 'space-between',
        marginBottom: 5,
        borderRadius: 5
    },
    coordinateContainer: {
        flexDirection: 'column',
        flex: 5
    },
    coordinateRow: {
        flexDirection: 'row'
    },
    coordinateHeader: {
        color: colors.brandColor,
        flex: 1
    },
    coordinate: {
        flex: 4,
        color: colors.bodyTextColor
    },
});