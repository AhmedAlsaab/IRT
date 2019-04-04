import React from 'react'
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import { Text } from 'native-base';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import colors from '../constants/Colors';

export default class CustomDateTimePicker extends React.Component {
    render() {
        return (
            <>
                <TouchableOpacity onPress={this.props.onPress}>
                    <View style={[
                        styles.inputContainer,
                        { borderBottomColor: colors.lightBorder, height: 50 }
                    ]}>
                        <MaterialIcon
                            name={this.props.iconName}
                            size={20}
                            color={colors.bodyTextColor}
                        />
                        <Text style={styles.dateTime}>
                            {this.props.value ? moment(this.props.value).format(this.props.format) : this.props.placeholder}
                        </Text>
                    </View>
                    <DateTimePicker
                        isVisible={this.props.isVisible}
                        onConfirm={(value) => this.props.onConfirm(value)}
                        onCancel={this.props.onCancel}
                        mode={this.props.mode}
                    />
                </TouchableOpacity>
            </>
        )
    }
}

const styles = StyleSheet.create({
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
    dateTime: {
        marginLeft: 8,
        color: colors.bodyTextColor,
        fontSize: 14
    },
})