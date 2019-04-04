import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import {
	Button,
	Container,
	Text,
	Header,
	Content,
	List,
	ListItem,
	Left,
	Right,
	Icon,
	Accordion
} from 'native-base';
import GlobalHeader from './GlobalHeader';
const dataArray = [
	{title: "City of Cardiff Council", content: "Website: www.cardiff.gov.uk" + '\n' + "Contact Number:029 2087 2087"},
	{title: "Bridgeend County Borough Council", content: "Website: www.bridgend.gov.uk" + '\n' + "Contact Number:01656 643643"},
	{title: "Blaenau Gwent Council", content: "Website: www.blaenau-gwent.gov.uk" + '\n' + "Contact Number:01495 311556"},
	{title: "Carmarthenshire Council", content: "Website: www.carmarthenshire.gov.wales" + '\n' + "Contact Number:01267 234567"},
];



export default class EmergencyContact extends Component {
	static navigationOptions = {
		header: null
    };
    
    navigateTo = () => {
		this.props.navigation.navigate('');
	};

    settings = () => {
		this.props.navigation.navigate('Account');
	};

	render() {
		return (
			<Container>
				<GlobalHeader type={1} navigateTo={this.navigateTo} />
			<Content style={styles.contentContainer} padder>
					
					<View style={styles.secondaryButtonContainer}>
								<Button bordered danger style={styles.secondaryButton} onPress={this.settings}>
									<Text style={styles.secondaryButtontext}>Settings</Text>
								</Button>
							</View>	

                             <Accordion 
					dataArray={dataArray}
					icon="add"
					expandedIcon="remove"
					iconStyle={{ color: "green" }}
					expandedIconStyle={{ color: "red" }}
					headerStyle={{backgroundColor: "#fe0b1b"}}
					contentStyle={{ backgroundColor: "#e5dddd" }}
					/>	 	 
							
										
					
					</Content>

			</Container>
		);
	}
}

const styles = StyleSheet.create({
	contentContainer: {
		width: '80%',
		flex: 1,
		flexDirection: 'column',
		alignSelf: 'center'
	},
	logoutButton: {
		backgroundColor: '#ff0000',
		justifyContent: 'center',
		marginTop: 25,
		alignSelf: 'center'
	},
	secondaryButtonContainer: {
		flexDirection: 'row',
        marginTop: 25,
        marginBottom: 25
	},
	secondaryButton: {
		width: '100%',
		justifyContent: 'center',
		backgroundColor: '#fff'
	},
	secondaryButtontext: {
		color: '#ff0000'
	}
});
