import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Container, Content, Text } from 'native-base';
import GlobalHeader from '../../components/GlobalHeader';
import colors from '../../constants/Colors';

export default class AccountsScreen extends Component {
	static navigationOptions = {
		header: null
	};

	logout = () => {
		this.props.navigation.navigate('Login');
	};

	navigateTo = () => {
		this.props.navigation.navigate('');
	};

	render() {
		return (
			<Container>
				<GlobalHeader type={1} navigateTo={this.navigateTo} />
				<Content contentContainerStyle={styles.contentContainer}>
					<View>
						<Button style={styles.logoutButton} onPress={this.logout}>
							<Text>Log Out</Text>
						</Button>
					</View>
				</Content>
			</Container>
		);
	}
}

const styles = StyleSheet.create({
	contentContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	logoutButton: {
		backgroundColor: colors.brandColor
	}
});
