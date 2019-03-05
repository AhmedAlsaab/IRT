import React, { Component } from 'react';
import { Image, Platform, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Container, Header, Left, Body, Right, Button, Icon, Title, H1 } from 'native-base';

export default class GlobalHeader extends Component {
	state = {
		title: null,
		visible: true
	};

	componentDidMount() {
		this.setState({
			title: this.props.navigateTo.toString()
		});
	}

	heightAdjuster = function() {
		if (this.props.type == 2) {
			return {
				...Platform.select({
					android: {
						marginTop: StatusBar.currentHeight,
						backgroundColor: '#ff0000',
						height: 180
					}
				})
			};
		}
		if (this.props.type == 3) {
			return {
				...Platform.select({
					android: {
						marginTop: StatusBar.currentHeight,
						backgroundColor: '#ff0000',
						height: 50
					}
				})
			};
		} else {
			return {
				...Platform.select({
					android: {
						marginTop: StatusBar.currentHeight,
						backgroundColor: '#ff0000',
						height: 75
					}
				})
			};
		}
	};

	render() {
		return (
			<Header style={this.heightAdjuster()}>
				{this.props.type == 1 && (
					<Image
						source={require('../branding/logos/two_line_version/TFW_two_line_mono_negative_rgb.png')}
						style={{ height: 70, width: 300 }}
					/>
				)}
				{this.props.type == 2 && (
					<Image
						source={require('../branding/logos/four_line_version/TFW_four_line_mono_negative_rgb.png')}
						style={{ height: 140, width: 300 }}
					/>
				)}
				{this.props.type == 3 && (
					<View style={styles.contentRow}>
						<View>
							{this.props.isBackButtonActive == 1 && (
								<Button transparent onPress={() => this.props.navigateTo()}>
									<Icon name="arrow-back" />
								</Button>
							)}
						</View>
						<View>
							<H1 style={styles.titleText}>{this.props.header}</H1>
						</View>
						<View>
							<View>
								<Text style={styles.invisbleText}>Cancel</Text>
							</View>
						</View>
					</View>
				)}
			</Header>
		);
	}
}

const styles = StyleSheet.create({
	flex_1: {
		flex: 1,
		alignItems: 'center'
	},
	contentRow: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	innerView: {
		textAlign: 'center'
	},
	titleText: {
		marginTop: 5,
		color: 'white'
	},
	invisbleText: {
		color: '#ff0000'
	}
});
