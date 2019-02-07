import React, { Component } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  TouchableHighlight,
  Keyboard,
  ScrollView, Platform, StatusBar,
} from "react-native";
import API_KEY from "../google_api_key";
import _ from "lodash";
import { Content, Container, Button, Text } from 'native-base';

export default class JourneyScreen extends Component {
    static navigationOptions = {
        header: null,
      };

  // Temporary states --> These should be in app.js
  constructor(props) {
    super(props);
    this.state = {
      error: "",
      //StartLocation
      locationPredictions: [],
      placeID: "",
      street:"",
      city:"",
      country:"",

      //EndLocation
      endLocationPredictions: [],
      endPlaceID: "",
      endStreet: "",
      endCity: "",
      endCountry: ""
    };
    this.startPositionDebounced = _.debounce(
      this.startPosition,
      1000
    );
    this.endLocationDebounced = _.debounce(
      this.endLocation,
      1000
    )
  }

  // Not working atm
  // componentDidMount() {
  //   //Get current location and set initial region to this
  //   navigator.geolocation.getCurrentPosition(
  //     position => {
  //       this.setState({
  //         latitude: position.coords.latitude,
  //         longitude: position.coords.longitude
  //       });
  //     },
  //     error => this.setState({ error: error.message }),
  //     { enableHighAccuracy: true, maximumAge: 2000, timeout: 20000 }
  //   );
  // }

// `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${API_KEY}&input=${destination}&location=${this.state.latitude},${this.state.longitude}&radius=2000`

//  https://maps.googleapis.com/maps/api/place/autocomplete/xml?input=Amoeba&types=establishment&location=37.76999,-122.44696&radius=500&strictbounds&key=YOUR_API_KEY

// https://maps.googleapis.com/maps/api/place/autocomplete/json?input=Stop&types=geocode&location=51.481583,-3.179090&radius=3000&key={API_KEY}


// Restricited search to cardiff - Check Coords
// Radius of search is 3000 meters from location coords
// Strictbounds ensures that no suggestions appear that are not within these paramaters


// Get Start Location
  async startPosition(destination) {
    this.setState({ destination });
    const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${destination}
    &types=geocode&location=51.481583,-3.179090&radius=3000&key=${API_KEY}&strictbounds`;
    const result = await fetch(apiUrl);
    const jsonResult = await result.json();
    this.setState({
      locationPredictions: jsonResult.predictions
    });
    console.log(jsonResult);
  }

  // Get End Location
  async endLocation(endDestination) {
    this.setState({ endDestination });
    const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${endDestination}
    &types=geocode&location=51.481583,-3.179090&radius=3000&key=${API_KEY}&strictbounds`;
    const result = await fetch(apiUrl);
    const jsonResult = await result.json();
    this.setState({
      endLocationPredictions: jsonResult.predictions
    });
    console.log(jsonResult);
  }
// Populate the input field with selected prediction
// Start Location Prediction
  pressedPrediction(
    prediction, 
    selectedPredictionID, 
    selectedPredictionStreet,
    selectedPredictionCity,
    selectedPredictionCountry
    ) {
      console.log(prediction.description)
      console.log(prediction.place_id)
    Keyboard.dismiss();
    this.setState({
      locationPredictions: [],
      destination: prediction.description,
      placeID: selectedPredictionID,
      street: selectedPredictionStreet,
      city: selectedPredictionCity,
      country: selectedPredictionCountry
    });
    Keyboard;
  }
// Populate the input field with selected prediction
// End Location Prediction
  pressedEndPrediction(
    prediction, 
    selectedEndPredictionID, 
    selectedEndPredictionStreet,
    selectedEndPredictionCity,
    selectedEndPredictionCountry
    ) {
      console.log(prediction.description)
      console.log(prediction.place_id)
    Keyboard.dismiss();
    this.setState({
      endLocationPredictions: [],
      endDestination: prediction.description,
      endPlaceID: selectedEndPredictionID,
      endStreet: selectedEndPredictionStreet,
      endCity: selectedEndPredictionCity,
      endCountry: selectedEndPredictionCountry
    });
    Keyboard;
  }

  onSubmit = () => {

    const data = {
      "place_id": this.state.placeID,
      "street": this.state.street,
      "city": this.state.city,
      "country": this.state.country,
      "endPlaceID": this.state.endPlaceID,
      "endStreet": this.state.endStreet,
      "endCity": this.state.endCity,
      "endCountry": this.state.endCountry,
    }

    fetch('http://192.168.0.33:3000/booking/temp',
    {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
    console.log(data)
  } 

  render() {
    // Start Location Predictions - Suggestion List
    const locationPredictions = this.state.locationPredictions.map(
      prediction => (
        <TouchableHighlight         
          onPress={() => this.pressedPrediction(
            prediction,
            prediction.place_id,
            prediction.terms[0].value,
            prediction.terms[1].value,
            prediction.terms[2].value
            )
          }
          key={prediction.id}
        >
          <Text style={styles.locationSuggestion}>
            {prediction.description}
          </Text>
        </TouchableHighlight>
      )
    );
    // End Location Predictions - Suggestion List
    const endLocationPredictions = this.state.endLocationPredictions.map(
      prediction => (
        <TouchableHighlight
          onPress={() => this.pressedEndPrediction(
            prediction,
            prediction.place_id,
            prediction.terms[0].value,
            prediction.terms[1].value,
            prediction.terms[2].value
            )
          }
          key={prediction.id}
          > 
          <Text style={styles.locationSuggestion}>
          {prediction.description}
          </Text>
          </TouchableHighlight>
      )
    );
// Search box 
// Start Location Input Box
// End Location Input Box

    return (
    <ScrollView> 
        <Container>        
            <TextInput
            placeholder="Enter start location.."
            style={styles.destinationInput}
            onChangeText={destination => {
            this.setState({ destination });
            this.startPositionDebounced(destination);
            }}
            value={this.state.destination}
        />
        {locationPredictions}
       
        <TextInput
        placeholder="Enter end location.."
        style={styles.destinationInput}
        onChangeText={endDestination => {
        this.setState({ endDestination });
        this.endLocationDebounced(endDestination);
        }}
        value={this.state.endDestination}
        />
        {endLocationPredictions}
        <Content contentContainerStyle={styles.contentContainer}>
          <View style={styles.buttonContainer}>
            <Button danger style={styles.button} onPress={this.onSubmit}>
              <Text>BOOK</Text>
            </Button>
          </View>
        </Content>
      </Container>
      </ScrollView>
    );
  }
}

const width = '80%';
const buttonWidth = '50%';


const styles = StyleSheet.create({
  destinationInput: {
    borderWidth: 0.5,
    borderColor: "grey",
    height: 40,
    marginTop: 50,
    marginLeft: 5,
    marginRight: 5,
    padding: 5,
    backgroundColor: "white"
  },
  locationSuggestion: {
    backgroundColor: "white",
    padding: 5,
    fontSize: 18,
    borderWidth: 0.5
  },
  flex_1: {
    flex: 1,
    alignItems: 'center'
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center'
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15
  },
  button: {
    width: buttonWidth,
    justifyContent: 'center',
    color: '#ff6666'
  },
  buttontext: {
    color: '#000000'
  }
});
