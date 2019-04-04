import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Container, Content } from 'native-base';
import GlobalHeader from '../../components/GlobalHeader';

import WalletBalance from '../../components/WalletBalance';
import WalletTransaction from '../../components/WalletTransaction';

export default class WalletScreen extends React.Component {
	static navigationOptions = {
		header: null
	};

	// WalletBalance props to redirect to AddFunds when a button is pressed
	onSubmit = () => {
		this.props.navigation.navigate('AddFunds');
	};

	// Default method for the global header
	navigateTo = () => {
		this.props.navigation.navigate('');
	};

	render() {
		return (
			<Container>
				<View style={styles.header}>
					<GlobalHeader type={1} navigateTo={this.navigateTo} />
					<WalletBalance type={1} onSubmit={this.onSubmit} />
				</View>
				<Content>
					<WalletTransaction />
				</Content>
			</Container>
		);
	}
}

const styles = StyleSheet.create({
	header: {
		height: 275,
	}
});