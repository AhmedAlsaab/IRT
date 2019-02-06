import React from 'react';
import { StyleSheet,  View, TextInput, ScrollView, ActivityIndicator, Button, Keyboard, TouchableHighlight, FlatList } from 'react-native';
import { GoogleAutoComplete } from 'react-native-google-autocomplete';
import API_KEY from "../google_api_key";
import LocationList from '../components/LocationList';
import { Container, Header, Content, List, ListItem, Text } from 'native-base';


export default class TempScreen extends React.Component {

    static navigationOptions = {
        header: null,
      };


// debounce = limits the amount api requests made (make request after 500 ms)
// minlength = minimum amount of input required to display prediction
    render(){
        return(
            <View style={styles.container}>
        
                <GoogleAutoComplete apiKey={API_KEY} debounce={1000} minLength={3} components="country:uk">
                {({ 
                    handleTextChange, 
                    locationResults, 
                    fetchDetails, 
                    isSearching,
                    inputValue,
                    clearSearchs
                
                }) => (
                    <React.Fragment>
                        {console.log('locationResults', locationResults)}
                        <View style={styles.inputWrapper}>
                        <TextInput 
                            style={styles.textInput}
                            placeholder="Search for a place" 
                            onChangeText={handleTextChange}
                            value={inputValue}
                        />
                        <Button title="Clear" onPress={clearSearchs}/>
                        </View>
                            {isSearching && <ActivityIndicator size="large" color="red" />}
                        <ScrollView>
                            
                            {locationResults.map(el => (
                              <LocationList                                 
                                  {...el}
                                  key={el.place_id}
                                  fetchDetails={fetchDetails}
                                  // id={el}
                        />  
                        ))}
                        
                        </ScrollView>
                    </React.Fragment>
                )}
                </GoogleAutoComplete>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textInput: {
        height: 40,
        width: 300,
        borderWidth: 1,
        paddingHorizontal: 16
    },
    inputWrapper: {
        marginTop: 80,
        flexDirection: 'row'
    }
})
 