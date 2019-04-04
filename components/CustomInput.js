import React from 'react'
import { View, StyleSheet, TextInput } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import colors from '../constants/Colors';

export default class CustomInput extends React.Component {
    render() {
        return (
            <View
                style={[styles.inputContainer,
                {
                    borderBottomColor: this.props.focused
                        ? colors.brandColor
                        : colors.lightBorder
                }]}
            >
                <MaterialIcon
                    name={this.props.iconName}
                    size={20}
                    color={this.props.focused ? colors.emphasisTextColor : colors.bodyTextColor}
                />
                <TextInput
                    placeholder={this.props.placeholder}
                    placeholderTextColor={
                        this.props.focused ? colors.emphasisTextColor : colors.bodyTextColor
                    }
                    style={[styles.input,
                    {
                        color: this.props.focused
                            ? colors.emphasisTextColor
                            : colors.bodyTextColor
                    }]}
                    onChangeText={this.props.onChangeText}
                    value={this.props.value}
                    onFocus={this.props.onFocus}
                    onBlur={this.props.onBlur}
                    ref={this.props.onRef && this.props.onRef}
                />
            </View>
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
})