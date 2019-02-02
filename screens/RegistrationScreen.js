import React, { Component } from 'react'
import { TextInput, Platform, StatusBar, StyleSheet, View, Picker } from 'react-native'
import { Content, Container, Header, Body, Title, Right, Left, Button, Text } from 'native-base';
import { Ionicons } from '@expo/vector-icons';

//Custom Components
import CustomInput from '../components/CustomInput';

class RegistrationScreen extends Component {

  state = {
    type: 'passenger'
  }

  render() {
    return (
      <Container>
        <Header style={styles.container}>
          <Left style={styles.flex_1} />
          <Body style={styles.flex_1}>
            <Title>Registration</Title>
          </Body>
          <Right style={styles.flex_1} />
        </Header>
        <Content contentContainerStyle={styles.contentContainer}>
          <View style={styles.title}>
            <Text style={styles.title}>CREATE ACCOUNT</Text>
          </View>
          <CustomInput icon="md-person" placeholder="First Name" />
          <CustomInput icon="md-person" placeholder="Last Name" />
          <CustomInput icon="md-phone-portrait" placeholder="Phone Number" />
          <CustomInput icon="md-mail" placeholder="Email" />
          <CustomInput icon="md-lock" placeholder="Password" />
          <CustomInput icon="md-lock" placeholder="Password Confirm" />
          <View style={styles.inputContainer}>
            <Ionicons name="md-person" size={32} style={styles.inputIcons}></Ionicons>
            <View style={styles.inputContainerPicker}>
              <Text>I am a </Text>
              <Picker style={styles.inputPicker} selectedValue={this.state.language} onValueChange={(itemValue, itemIndex) => this.setState({ language: itemValue })}>
                <Picker.Item label="Passenger" value="passenger" />
                <Picker.Item label="Driver" value="driver" />
              </Picker>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <Button danger style={styles.button}>
              <Text>REGISTER</Text>
            </Button>
          </View>
        </Content>
      </Container>
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
    borderBottomColor: '#ff0000',
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
    justifyContent: 'center'
  },
  buttontext: {
    color: '#000000'
  }
});

export default RegistrationScreen;