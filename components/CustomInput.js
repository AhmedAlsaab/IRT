import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import { Input } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

const CustomInput = props => {
    return (
        <View style={styles.inputContainer}>
            <Ionicons name={props.icon} size={32} style={styles.inputIcons}></Ionicons>
            <Input placeholder={props.placeholder} style={styles.input} placeholderTextColor={'#cccccc'}></Input>
        </View>
    )
}

const width = '80%';
const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ff6666',
        alignItems: 'center',
        width,
        marginBottom: 10
    },
    input: {
        margin: 10
        
    },
    inputIcons: {
        width: 50,
        padding: 10,
        textAlign: 'center'
    }
})

export default CustomInput;