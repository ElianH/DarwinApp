import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableHighlight, ActivityIndicator} from 'react-native';
import { Actions } from 'react-native-router-flux';

export default class StatusModal extends Component {

	constructor(props) {
		super(props)
		// set state with passed in props
		this.state = {
		  message: props.error,
		  hide: props.hide,
		  loading: props.loading,
		}
		// bind functions
		this.dismissModal = this.dismissModal.bind(this)
	}

	dismissModal() {
		this.setState({hide: true, loading: false});
		Actions.pop();
	}

	// show or hide Modal based on 'hide' prop
	render() {
		
		if(this.state.loading){
			return (
				<View style={styles.mainContainer}>
					<ActivityIndicator style={styles.loading} size="large" color='#333' />
				</View>
			)
		} else if(this.state.hide){
			return (
				<View>
				</View>
			)
		} else {
			return (
				<TouchableHighlight style={styles.mainContainer} onPress={this.dismissModal}>
					<View style={styles.mainContainer} >
						<Text style={styles.text}>{this.state.message}</Text>
					</View>
				</TouchableHighlight>
			)
		  }
	}
}

const styles = StyleSheet.create({
	mainContainer: {
		height: 70,
		padding: 10,
		backgroundColor: '#EEE',
		justifyContent: 'center',
		alignItems: 'center',
		alignSelf: 'stretch',
	},
	text: {
		fontSize: 18,
		textAlign: 'center',
		color: '#333'
	},
	textDismiss: {
		fontSize: 12,
		textAlign: 'center',
		color: '#666'
	},
  	loading:{
		alignSelf: 'stretch',
		height: 40,
		justifyContent: 'center',
	},
});