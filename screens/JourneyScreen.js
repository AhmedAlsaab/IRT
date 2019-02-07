import React, { Component } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  TouchableHighlight,
  Keyboard,
  ScrollView, Platform, StatusBar,
  Animated,
  Image,
} from "react-native";
import Collapsible from 'react-native-collapsible';
import apiKey from "../google_api_key";
import _ from "lodash";
import { Content, Container, Button, Text, DatePicker, Item, Input } from 'native-base';

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
      locationPredictions: [],
      chosenDate: new Date(),
      isCollapsed: true,
    };
    this.startPositionDebounced = _.debounce(
      this.startPosition,
      1000
    );
  }

  toggleAdvanced = () => {
    this.setState({
      isCollapsed: !this.state.isCollapsed
    })
  }

  // Set the date state when user selects a day.
  setDate = (newDate) => {
    this.setState({ chosenDate: newDate });
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
    const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${apiKey}&input={${destination}}&location=${
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
        <Container style={styles.contentContainer}>
          <Content>
            <View style={styles.secondaryButtonContainer}>
              <Button bordered light style={styles.secondaryButton}>
                <Text style={styles.secondaryButtontext}>
                  FAVOUITE/RECENT JOURNEYS
              </Text>
              </Button>
            </View>
            <Item>
              <Input
                placeholder="Enter location.."
                placeholderTextColor="#d3d3d3"
                onChangeText={destination => {
                  this.setState({ destination });
                  this.startPositionDebounced(destination);
                }}
                value={this.state.destination}
                style={styles.input}
              />
            </Item>
            {locationPredictions}
            <Item>
              <Input
                placeholder="From"
                placeholderTextColor="#d3d3d3"
                style={styles.input}
              />
            </Item>
            <Item>
              <Input
                placeholder="To"
                placeholderTextColor="#d3d3d3"
                style={styles.input}
              />
            </Item>
            <DatePicker
              placeHolderText="Date"
              placeHolderTextStyle={{ color: "#d3d3d3" }}
              onDateChange={this.setDate}
              style={styles.input}
            />

            {/* Advanced search fields, expands on button click. */}
            <Collapsible collapsed={this.state.isCollapsed}>
              <View>
                <Item>
                  <Input
                    placeholder="Number of passengers"
                    placeholderTextColor="#d3d3d3"
                    style={styles.input}
                  />
                </Item>
                <Item>
                  <Input
                    placeholder="Number of wheelchairs"
                    placeholderTextColor="#d3d3d3"
                    style={styles.input}
                  />
                </Item>
              </View>
            </Collapsible>

            {/* Advanced search button, toggles advanced fields */}
            <View style={styles.secondaryButtonContainer}>
              <Button bordered light
                style={styles.secondaryButton}
                onPress={this.toggleAdvanced}
              >
                <Text style={styles.secondaryButtontext}>
                  {this.state.isCollapsed? 'ADVANCED SEARCH' : 'BASIC SEARCH'}
                </Text>
              </Button>
            </View>
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

const styles = StyleSheet.create({
  input: {
    fontSize: 16,
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
    width: '80%',
    flex: 1,
    flexDirection: 'column',
    alignSelf: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  buttonContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 15,
    alignItems: 'center',
  },
  button: {
    width: '100%',
    justifyContent: 'center',
    color: '#ff6666'
  },
  buttontext: {
    color: '#000000'
  },
  secondaryButtonContainer: {
    flexDirection: 'row',
    marginTop: 15
  },
  secondaryButton: {
    width: '100%',
    justifyContent: 'center',
    borderColor: '#ff0000',
  },
  secondaryButtontext: {
    color: '#ff0000',
  },
  placeholderStyle: {
    color: '#d3d3d3',
  },
});