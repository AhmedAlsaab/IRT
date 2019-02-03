import React, { Component } from 'react'
import { ScrollView, Platform, StatusBar, StyleSheet, View, Picker } from 'react-native'
import { Content, Container, Header, Body, Title, Right, Left, Button, Text } from 'native-base';
import { Ionicons } from '@expo/vector-icons';

//Custom Components
import CustomInput from '../components/CustomInput';

class JourneyScreen extends Component {
  static navigationOptions = {
    header: null,
  };
  state = {
    type: 'passenger'
  }

  render() {
    return (
      <ScrollView> 
      <Container>
        <Content contentContainerStyle={styles.contentContainer}>
          
          <CustomInput icon="md-pin" placeholder="From" />
          <CustomInput icon="md-flag" placeholder="To" />
          <CustomInput icon="md-calendar" placeholder="dd/mm/yyyy" />
          <CustomInput icon="md-time" placeholder="Time" />
        
          
          <View style={styles.buttonContainer}>
          
            <Button danger style={styles.button}>
              <Text>SEARCH</Text>
            </Button>
          </View>
        </Content>
      </Container>
      </ScrollView>
    )
  }
}

const width = '80%';
const buttonWidth = '50%';

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      android: {
        marginTop: StatusBar.currentHeight,
      }
    }),
  },
  inputContainer: {
    flexDirection: 'row',
    borderBottomWidth: 2,
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
  title: {
    textAlign: 'left',
    paddingTop: 20,
    paddingBottom: 5,
    width
  },
  inputPicker: {
    borderWidth: 2,
    borderColor: '#ff0000',
  },
  inputContainerPicker: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  inputPicker: {
    height: 50,
    width: 350
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

export default JourneyScreen;