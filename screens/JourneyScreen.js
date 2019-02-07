import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TouchableHighlight,
  Keyboard,
  ScrollView,
  TouchableOpacity
} from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import Collapsible from 'react-native-collapsible';
import DateTimePicker from 'react-native-modal-datetime-picker';
import apiKey from "../google_api_key";
import _ from "lodash";
import { Content, Container, Button, Text, Item, Input, StyleProvider, Row } from 'native-base';
import getTheme from '../native-base-theme/components';
import platform from '../native-base-theme/variables/platform';

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

      isCollapsed: true,
      isDatePickerVisible: false,
      isTimePickerVisible: false,

      from: null,
      to: null,
      date: null,
      time: null,
      numPassenger: null,
      numWheelchair: null,
    };
    this.startPositionDebounced = _.debounce(
      this.startPosition,
      1000
    );
  }

  // Sets the state when each input is changed
  handleFromChange = (event) => {
    this.setState({from: event.target.value})
  }

  handleToChange = (event) => {
    this.setState({to: event.target.value})
  }

  handleNumPassengersChange = (event) => {
    this.setState({numPassenger: event.target.value})
  }

  handleNumWheelchairChange = (event) => {
    this.setState({numWheelchair: event.target.value})
  }

  // Functionality to show/hide the date picker and to set the state
  _showDatePicker = () => this.setState({ isDatePickerVisible: true });
  _hideDatePicker = () => this.setState({ isDatePickerVisible: false });

  _handleDatePicked = (newDate) => {
    this.setState({ date: newDate });
    console.log(this.state.date)
    this._hideDatePicker();
  };

  // Functionality to show/hide the time picker and to set the state
  _showTimePicker = () => this.setState({ isTimePickerVisible: true });
  _hideTimePicker = () => this.setState({ isTimePickerVisible: false });

  _handleTimePicked = (newTime) => {
    this.setState({ time: newTime });
    console.log(this.state.time)
    this._hideTimePicker();
  };

  // Toggles advanced search inputs
  toggleAdvanced = () => {
    this.setState({
      isCollapsed: !this.state.isCollapsed
    })
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
      <StyleProvider style={getTheme(platform)}>
        <ScrollView>
          <Container style={styles.contentContainer}>
            <Content>

              {/* Favourite recent journeys button */}
              <View style={styles.secondaryButtonContainer}>
                <Button bordered danger style={styles.secondaryButton}>
                  <Text style={styles.secondaryButtontext}>
                    Favourite/Recent Journeys
              </Text>
                </Button>
              </View>

              <Item style={styles.iconWithInput}>
                <Input
                  placeholder="Enter location.."
                  placeholderTextColor="#bcbcbc"
                  onChangeText={destination => {
                    this.setState({ destination });
                    this.startPositionDebounced(destination);
                  }}
                  value={this.state.destination}
                />
              </Item>

              {locationPredictions}

              {/* Starting location field */}
              <Item style={styles.iconWithInput}>
                <Icon name="my-location" size={20} color="#bcbcbc" />
                <Input
                  placeholder="From"
                  placeholderTextColor="#bcbcbc"
                  onChange={this.handleFromChange}
                />
              </Item>

              {/* Destination field */}
              <Item style={styles.iconWithInput}>
                <Icon name="location-on" size={20} color="#bcbcbc" />
                <Input
                  placeholder="To"
                  placeholderTextColor="#bcbcbc"
                  onChange={this.handleToChange}
                />
              </Item>

              {/* Date picker */}
              <TouchableOpacity onPress={this._showDatePicker}>
                <View style={styles.dateTimeContainer}>
                  <Icon name="date-range" size={20} color="#bcbcbc" />
                  {this.state.date
                    ? <Text style={[styles.dateTime, { color: '#000' }]}>{this.state.date.toString().slice(4, 15)}</Text>
                    : <Text style={styles.dateTime} >Date</Text>
                  }
                </View>
              </TouchableOpacity>
              <DateTimePicker
                isVisible={this.state.isDatePickerVisible}
                onConfirm={this._handleDatePicked}
                onCancel={this._hideDatePicker}
                mode='date'
              />

              {/* Time picker */}
              <TouchableOpacity onPress={this._showTimePicker}>
                <View style={styles.dateTimeContainer}>
                  <Icon name="access-time" size={20} color="#bcbcbc" />
                  {this.state.time
                    ? <Text style={[styles.dateTime, { color: '#000' }]}>{this.state.time.toString().slice(16, 21)}</Text>
                    : <Text style={styles.dateTime} >Time</Text>
                  }
                </View>
              </TouchableOpacity>
              <DateTimePicker
                isVisible={this.state.isTimePickerVisible}
                onConfirm={this._handleTimePicked}
                onCancel={this._hideTimePicker}
                mode='time'
              />

              {/* Advanced search fields, expands and collapses on button click. */}
              <Collapsible collapsed={this.state.isCollapsed}>
                <View>
                  <Item style={styles.iconWithInput}>
                    <Icon name="people" size={20} color="#bcbcbc" />
                    <Input
                      placeholder="Group size"
                      placeholderTextColor="#bcbcbc"
                      onChange={this.handleNumPassengersChange}
                    />
                  </Item>

                  <Item style={styles.iconWithInput}>
                    <Icon name="accessible" size={20} color="#bcbcbc" />
                    <Input
                      placeholder="No. of wheelchairs"
                      placeholderTextColor="#bcbcbc"
                      onChange={this.handleNumWheelchairChange}
                    />
                  </Item>
                </View>
              </Collapsible>

              {/* Advanced search button, toggles advanced fields */}
              <View style={styles.secondaryButtonContainer}>
                <Button bordered danger
                  style={styles.secondaryButton}
                  onPress={this.toggleAdvanced}
                >
                  <Text style={styles.secondaryButtontext}>
                    {this.state.isCollapsed ? 'Advanced Search' : 'Basic Search'}
                  </Text>
                </Button>
              </View>

              {/* Submit search */}
              <View style={styles.buttonContainer}>
                <Button danger style={styles.button}>
                  <Text>Search</Text>
                </Button>
              </View>
            </Content>
          </Container>
        </ScrollView>
      </StyleProvider >
    );
  }
}

const styles = StyleSheet.create({
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#d3d3d3',
    height: 50,
  },
  dateTime: {
    marginLeft: 6,
    color: '#bcbcbc',
    fontSize: 17,
  },
  iconWithInput: {
    marginTop: 10,
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
    marginTop: 25,
  },
  secondaryButton: {
    width: '100%',
    justifyContent: 'center',
  },
  secondaryButtontext: {
    color: '#ff0000',
  },
});