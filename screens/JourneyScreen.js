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
      latitude: 0,
      longitude: 0,
      locationPredictions: []
    };
    this.startPositionDebounced = _.debounce(
      this.startPosition,
      1000
    );
  }

  // Not working atm
  componentDidMount() {
    //Get current location and set initial region to this
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      error => this.setState({ error: error.message }),
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 20000 }
    );
  }

  async startPosition(destination) {
    this.setState({ destination });
    const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${API_KEY}&input={${destination}}&location=${
      this.state.latitude
    },${this.state.longitude}&radius=2000`;
    const result = await fetch(apiUrl);
    const jsonResult = await result.json();
    this.setState({
      locationPredictions: jsonResult.predictions
    });
    console.log(jsonResult);
  }
// Populate the input field with selected prediction
  pressedPrediction(prediction) {
    console.log(prediction);
    Keyboard.dismiss();
    this.setState({
      locationPredictions: [],
      destination: prediction.description
    });
    Keyboard;
  }

  render() {
    const locationPredictions = this.state.locationPredictions.map(
      prediction => (
        <TouchableHighlight
          key={prediction.id}
          onPress={() => this.pressedPrediction(prediction)}
        >
          <Text style={styles.locationSuggestion}>
            {prediction.description}
          </Text>
        </TouchableHighlight>
      )
    );

    return (
    <ScrollView> 
        <Container>        
            <TextInput
            placeholder="Enter location.."
            style={styles.destinationInput}
            onChangeText={destination => {
            this.setState({ destination });
            this.startPositionDebounced(destination);
            }}
            value={this.state.destination}
        />
        {locationPredictions}
        <Content contentContainerStyle={styles.contentContainer}>
          <View style={styles.buttonContainer}>
            <Button danger style={styles.button}>
              <Text>SEARCH</Text>
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