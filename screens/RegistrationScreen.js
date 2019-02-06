import React, { Component } from 'react';
import { TextInput, Platform, StatusBar, StyleSheet, View, Picker, Image, Dimensions } from 'react-native';
import { Content, Container, Button, Text, Accordion } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { validateAll } from 'indicative';

class RegistrationScreen extends Component {

  state = {
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
    passwordConfirm: "",
    type: 1,
    errors: null,
    error: null
  }

  componentDidUpdate() {
    if (this.state.error != null) setTimeout(() => this.setState({ error: null }), 3000);
  }

  onSubmit = () => {

    const messages = {
      'required': '{{ field }} is required',
      'min': 'Minimum of {{ argument.0 }} characters',
      'max': 'Maximum of {{ argument.0 }} characters',
      'same': 'Password must match'
    }

    //Check input fields are correct
    const rules = {
      firstName: 'required|min:1|max:45',
      lastName: 'required|min:1|max:45',
      phoneNumber: 'required|min:5|max:45',
      email: 'required|email|max:100',
      password: 'required|min:8|max:45',
      passwordConfirm: 'same:password',
    }

    //Send data to the server
    const data = {
      "firstName": this.state.firstName,
      "lastName": this.state.lastName,
      "phoneNumber": this.state.phoneNumber,
      "email": this.state.email,
      "password": this.state.password,
      "type": this.state.type
    }

    validateAll(data, rules, messages)
      .then(() => {
        fetch("http://10.22.201.102:3000/register", {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        })
          .then((response) => response.json())
          .then((responseJSON) => {
            console.log(responseJSON)
            if (responseJSON.status != 1) {
              //Throw error
              //Account already exists
              this.setState({
                error: "Account already exists"
              })

              return;
            }

            this.props.navigation.navigate("Login")
          })
          .catch(error => console.log(error))
      })
      .catch((messageErrors) => {
        this.setState({
          errors: this.parseErrors(messageErrors)
        })
      })
  }


  parseErrors = (errorList) => {
    var errors = {
      title: 'Errors',
      content: ''
    }

    for (var i = 0; i < errorList.length; i++) {
      errors.content += errorList[i].message + "\n"
    }

    return [errors]
  }

  // findElement = (stateName) => {
  //   const { errors } = this.state;

  //   for (var i = 0; i < errors.length; i++) {
  //     if (errors[i]["field"] == stateName) {
  //       return errors[i];
  //     }
  //   }

  //   return null;
  // }

  render() {
    return (
      <Container style={styles.container}>
        <Content>

          <View style={styles.imageContainer}>
            <Image resizeMode={'contain'} style={styles.image} source={require('../assets/images/two_line/TFW_two_line_mono_negative_rgb.png')} />
          </View>

          {this.state.errors && !!this.state.errors.length && <Accordion dataArray={this.state.errors} icon="add" expandedIcon="remove" contentStyle={styles.errorStyle} expanded={0}/>}

          <View style={styles.contentContainer}>
            <View style={styles.title}>
              <Text style={styles.title}>CREATE ACCOUNT</Text>
            </View>

            {this.state.error && <Text style={styles.error}>{this.state.error}</Text>}
            <View style={styles.inputWrapper}>
              <View style={styles.inputContainer}>
                <Ionicons name="md-person" size={32} style={styles.inputIcons}></Ionicons>
                <TextInput placeholder='First Name' style={styles.input} onChangeText={(text) => this.setState({ firstName: text })} value={this.state.firstName} value={this.state.firstName}></TextInput>
              </View>
              {/* {this.findElement('firstName') && <Text style={styles.error}>{this.findElement('firstName').message}</Text>} */}
            </View>

            <View style={styles.inputWrapper}>
              <View style={styles.inputContainer}>
                <Ionicons name="md-person" size={32} style={styles.inputIcons}></Ionicons>
                <TextInput placeholder='Last Name' style={styles.input} onChangeText={(text) => this.setState({ lastName: text })} value={this.state.lastName}></TextInput>
              </View>
              {/* {this.findElement('lastName') && <Text style={styles.error}>{this.findElement('lastName').message}</Text>} */}
            </View>

            <View style={styles.inputWrapper}>
              <View style={styles.inputContainer}>
                <Ionicons name="md-phone-portrait" size={32} style={styles.inputIcons}></Ionicons>
                <TextInput placeholder='Phone Number' style={styles.input} onChangeText={(text) => this.setState({ phoneNumber: text })} value={this.state.phoneNumber}></TextInput>
              </View>
              {/* {this.findElement('phoneNumber') && <Text style={styles.error}>{this.findElement('phoneNumber').message}</Text>} */}
            </View>

            <View style={styles.inputWrapper}>
              <View style={styles.inputContainer}>
                <Ionicons name="md-mail" size={32} style={styles.inputIcons}></Ionicons>
                <TextInput placeholder='Email' style={styles.input} onChangeText={(text) => this.setState({ email: text })} value={this.state.email}></TextInput>
              </View>
              {/* {this.findElement('email') && <Text style={styles.error}>{this.findElement('email').message}</Text>} */}
            </View>

            <View style={styles.inputWrapper}>
              <View style={styles.inputContainer}>
                <Ionicons name="md-lock" size={32} style={styles.inputIcons}></Ionicons>
                <TextInput placeholder='Password' secureTextEntry={true} style={styles.input} onChangeText={(text) => this.setState({ password: text })} value={this.state.password}></TextInput>
              </View>
              {/* {this.findElement('password') && <Text style={styles.error}>{this.findElement('password').message}</Text>} */}
            </View>

            <View style={styles.inputWrapper}>
              <View style={styles.inputContainer}>
                <Ionicons name="md-lock" size={32} style={styles.inputIcons}></Ionicons>
                <TextInput placeholder='Password Confirm' secureTextEntry={true} style={styles.input} onChangeText={(text) => this.setState({ passwordConfirm: text })} value={this.state.passwordConfirm}></TextInput>
              </View>
              {/* {this.findElement('passwordConfirm') && <Text style={styles.error}>{this.findElement('passwordConfirm').message}</Text>} */}
            </View>

            <View style={styles.inputWrapper}>
              <View style={styles.inputContainer}>
                <Ionicons name="md-person" size={32} style={styles.inputIcons}></Ionicons>
                <View style={styles.inputContainerPicker}>
                  <Text>I am a </Text>
                  <Picker name="type" style={styles.inputPicker} selectedValue={this.state.type} onValueChange={(itemValue, itemIndex) => this.setState({ type: parseint(itemValue) })}>
                    <Picker.Item label="Passenger" value="1" />
                    <Picker.Item label="Driver" value="2" />
                  </Picker>
                </View>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <Button danger style={styles.button} onPress={this.onSubmit}>
                <Text>REGISTER</Text>
              </Button>
            </View>
          </View>

        </Content>
      </Container>
    )
  }
}

const width = '80%';
const buttonWidth = '40%';
const window = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      android: {
        marginTop: StatusBar.currentHeight,
      }
    }),
  },
  inputWrapper: {
    flexDirection: 'column',
    width
  },
  inputContainer: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#ff0000',
    alignItems: 'center'
  },
  errorStyle:{
    fontWeight: 'bold',
    backgroundColor: '#f4f4f4'
  },
  input: {
    flex: 1,
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
    marginTop: 30
  },
  button: {
    width: buttonWidth,
    justifyContent: 'center',
    backgroundColor: '#ff0000'
  },
  buttontext: {
    color: '#000000'
  },
  error: {
    color: '#ff0000'
  },
  imageContainer: {
    height: 120,
    backgroundColor: '#ff0000',
    width: window.width,
    alignItems: 'center',
  },
  image: {
    flex: 1,
    alignSelf: 'stretch',
    width: window.width,
    height: window.height,
  }
});

export default RegistrationScreen;