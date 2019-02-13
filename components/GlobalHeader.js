import React, { Component } from 'react'
import { Image, Platform, StatusBar, StyleSheet, Text, View } from 'react-native'
import { Container, Header, Body, Title, Right, Left } from 'native-base';

export default class GlobalHeader extends Component {

  heightAdjuster = function () {
    if (this.props.type == 2) {
      return {
        ...Platform.select({
          android: {
            marginTop: StatusBar.currentHeight,
            backgroundColor: '#ff0000',
            height: 230,
          }
        })
      }
    }
    else {
      return {
        ...Platform.select({
          android: {
            marginTop: StatusBar.currentHeight,
            backgroundColor: '#ff0000',
            height: 75,
          }
        }),
      }
    }
  }

  render() {
    return (
      <Header style={this.heightAdjuster()}>
        <Left style={styles.flex_1} />
        <Body style={styles.flex_1}>
        {this.props.type == 1 && <Image
            source={require('../branding/logos/two_line_version/TFW_two_line_mono_negative_rgb.png')}
            style={{height: 50, width: 230}}
        />}
        {this.props.type == 2 && <Image
            source={require('../branding/logos/four_line_version/TFW_four_line_mono_negative_rgb.png')}
            style={{height: 140, width: 300}}
        />}
        </Body>
        <Right style={styles.flex_1} />
      </Header>

    )
  }
}

const styles = StyleSheet.create({
  // container: {
  //   ...Platform.select({
  //     android: {
  //       marginTop: StatusBar.currentHeight,
  //       backgroundColor: '#ff0000',
  //       height: 65,
  //     }
  //   }),
  // },
  flex_1: {
    flex: 1,
    alignItems: 'center'
  }
});