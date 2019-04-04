import { Container, Content, List, ListItem } from 'native-base';
import React from 'react';
import { StyleSheet, View, FlatList, Text } from 'react-native';
import GlobalHeader from '../../components/GlobalHeader';
import colors from '../../constants/Colors';


export default class MakeSelect extends React.Component {
	static navigationOptions = {
		header: null
	};
	state = {
		dividers: [],
		models: []
	};

	componentWillMount() {
		// If the component is about to mount decide whether alphabetical dividers are required
		const data = this.props.navigation.state.params.data;
		if (data.dividers === true) {
			this.setDividers();
		}
	}

	// Determine which divider letters are required.
	setDividers = () => {
		const data = this.props.navigation.state.params.data.vehicleData;
		var previousDivider = '';
		data.forEach(item => {
			let firstCharacter = item.make.substring(0, 1)
			if (firstCharacter !== previousDivider) {
				previousDivider = firstCharacter;
				this.state.dividers.push(item.make);
			}
		});
	}

	render() {
		const props = this.props.navigation.state.params;
		return (
			<Container>
				<GlobalHeader type={3} navigateTo={props.onNavigateBack} header={props.data.header} isBackButtonActive={1} />
				<Content>
					<Content style={styles.content}>
						<View style={styles.contentContainer}>
							<List
								dataArray={props.data.vehicleData}
								renderRow={(item) =>
									<>
										{/* If dividers are required generate a separate list item for each letter */}
										{props.data.dividers === true && this.state.dividers.includes(item.make) &&
											<ListItem itemDivider>
												<Text>{item.make.substring(0, 1)}</Text>
											</ListItem>
										}
										{/* List make or model depending on the selectType */}
										<ListItem
											noIndent
											onPress={() => {
												props.data.selectType === "make" ?
													props.onMakeSelect(item.make_id, item.make) :
													props.onModelSelect(item.model)
											}}
										>
											<Text>
												{
													props.data.selectType === "make" ?
														item.make :
														item.model
												}
											</Text>
										</ListItem>
									</>
								}
							/>
						</View>
					</Content>
				</Content>
			</Container >
		);
	}
}

const styles = StyleSheet.create({
	content: {
		flex: 1,
	},
	inputContainer: {
		flexDirection: 'row',
		borderBottomWidth: 0.75,
		alignItems: 'center',
	},
	contentContainer: {
		width: '100%',
		flex: 1,
		flexDirection: 'column',
		alignSelf: 'center',
		justifyContent: "flex-end",
	},
});