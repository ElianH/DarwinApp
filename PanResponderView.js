import React, { Component } from 'react';
import { View, PanResponder, Animated } from 'react-native';

export default class InfoView extends Component {

	constructor(props) {
		super(props);
	}
  
	componentWillMount() {
		this._panResponder = PanResponder.create({
			// Always claim responder
			onMoveShouldSetPanResponder: (e, gestureState) => {
				return true;
			},
			onPanResponderGrant: (e, gestureState) => {
			},
			onPanResponderMove: Animated.event([
			]),
			onPanResponderRelease: (e, {vx, vy}) => {
			}
		});
	}

	render() {
		return (
			<Animated.View style={{margin:10}} {...this.props} {...this._panResponder.panHandlers}>
				{this.props.children}
			</Animated.View>
		)
	}
};

