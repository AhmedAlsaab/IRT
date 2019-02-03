import React, { Component } from 'react'
import { TextInput, Platform, StatusBar, StyleSheet, View, Picker } from 'react-native'
import { Content, Container, Header, Body, Title, Right, Left, Button, Text } from 'native-base';
import { Ionicons } from '@expo/vector-icons';

class RegistrationScreen extends Component {

  state = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    password: '',
    passwordConfirm: '',
    type: 'passenger'
  }

  onSubmit = () => {
    //Check if fields are valid

    //Send data to the server
  
    //Go to Login Screen
    console.log('send data to server')
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
          <View style={styles.inputContainer}>
            <Ionicons name="md-person" size={32} style={styles.inputIcons}></Ionicons>
            <TextInput placeholder='First Name' style={styles.input} onChangeText={(text) => this.setState({firstName: text})} value={this.state.firstName}></TextInput>
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="md-person" size={32} style={styles.inputIcons}></Ionicons>
            <TextInput placeholder='Last Name' style={styles.input} onChangeText={(text) => this.setState({lastName: text})}></TextInput>
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="md-phone-portrait" size={32} style={styles.inputIcons}></Ionicons>
            <TextInput placeholder='Phone Number' style={styles.input} onChangeText={(text) => this.setState({phoneNumber: text})}></TextInput>
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="md-mail" size={32} style={styles.inputIcons}></Ionicons>
            <TextInput placeholder='Email' style={styles.input} onChangeText={(text) => this.setState({email: text})}></TextInput>
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="md-lock" size={32} style={styles.inputIcons}></Ionicons>
            <TextInput placeholder='Password' secureTextEntry={true} style={styles.input} onChangeText={(text) => this.setState({password: text})}></TextInput>
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="md-lock" size={32} style={styles.inputIcons}></Ionicons>
            <TextInput placeholder='Password Confirm' secureTextEntry={true} style={styles.input} onChangeText={(text) => this.setState({passwordConfirm: text})}></TextInput>
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="md-person" size={32} style={styles.inputIcons}></Ionicons>
            <View style={styles.inputContainerPicker}>
              <Text>I am a </Text>
              <Picker name="type" style={styles.inputPicker} selectedValue={this.state.type} onValueChange={(itemValue, itemIndex) => this.setState({type: itemValue}) }>
                <Picker.Item label="Passenger" value="passenger" />
                <Picker.Item label="Driver" value="driver" />
              </Picker>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <Button danger style={styles.button} onPress={this.onSubmit}>
              <Text>REGISTER</Text>
            </Button>
          </View>
        </Content>
      </Container>
    )
  }
}

const width = '80%'
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
    padding: 10
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