import React, { PureComponent } from 'react';
import { Alert, Keyboard, StyleSheet, TouchableOpacity, TouchableHighlight, FlatList } from 'react-native';
import { Container, Header, Content, List, ListItem, Text } from 'native-base';


//SELECTED ITEM FROM LIST
export default class LocationList extends PureComponent{

    _handlePress = async () => {
        const result = await this.props.fetchDetails(this.props.place_id)
        console.log('result of pressed item', result)
        Keyboard.dismiss();
    }

    render(){
        return(
            <TouchableHighlight style={style.root} onPress={this._handlePress}>
                <Text>{this.props.description}</Text>
            </TouchableHighlight>

                
        );
    }
}


const style = StyleSheet.create({
    root: {
        backgroundColor: "white",
        padding: 5,
       // fontSize: 18,
        borderWidth: 0.5
    }
})





