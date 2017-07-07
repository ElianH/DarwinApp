import React, { Component } from 'react';
import { Text, TouchableHighlight, View, StyleSheet, ListView, Alert, Image, TextInput, TouchableWithoutFeedback, StatusBar} from 'react-native';
import { Actions } from 'react-native-router-flux';

export default class NavBarView extends Component {
	
  constructor(props) {
    super(props);
  }

  isSearching = false;
  text = '';

  render() {
	
	// navigation	
	const goToGeneralMapPage = () => { Actions.generalMapPage({localizedStrings: this.props.localizedStrings, citiesJson: this.props.citiesJson}); };  
	const goToConfigPage = () => { Actions.configPage({
		localizedStrings: this.props.localizedStrings,
		onLanguageChanged: this.props.onLanguageChanged
	}); };  

	// nav bar
	const configkButtonImageSource = require('./img/Icons/icon_config.png');
	const backButtonImageSource = require('./img/Icons/arrow_back/android/drawable-xhdpi/ic_arrow_back_black_24dp.png');
	const searchButtonImageSource = require('./img/Icons/search/android/drawable-xhdpi/ic_search_black_48dp.png');
	const mapButtonImageSource = require('./img/Icons/map/android/drawable-xhdpi/ic_map_black_48dp.png');
	const listButtonImageSource = require('./img/Icons/list.png');
	const navBarCloseSearchButtonImageSource = require('./img/Icons/varios.png');
	const filterButtonImageSource = require('./img/Icons/filter.png');
	const infoButtonImageSource = require('./img/Icons/icon_info.png');
	var navTitle = this.props.title;
	var backgroundColor = this.props.backgroundColor;

    return (
	
		<View style={styles.navBarBackground}>
			<StatusBar backgroundColor="#000" barStyle="light-content" />
			{
				(!this.isSearching) &&
				<View style={[styles.navBarStyle,{backgroundColor:backgroundColor}]}>
					
					{
						(this.props.enableConfigButton != null && this.props.enableConfigButton != 'undefined' && this.props.enableConfigButton) &&
						<TouchableHighlight style={styles.navBarConfigButton} onPress={() => { goToConfigPage() } }>
							<Image style={styles.navBarConfigButtonImage} source={configkButtonImageSource}/>
						</TouchableHighlight>
					}
					{
						(this.props.enableBackButton == null || this.props.enableBackButton == 'undefined' || this.props.enableBackButton) &&
						<TouchableHighlight style={styles.navBarBackButton} onPress={() => {
								this.text = '';
								this.isSearching = false;
								Actions.pop();
						}}>
							<Image style={styles.navBarBackButtonImage} source={backButtonImageSource}/>
						</TouchableHighlight>
					}
					<Text style={styles.navBarText}>{navTitle}</Text>
					{
						(this.props.onFilterButtonClick) &&
						<TouchableHighlight style={styles.navBarFilterButton} onPress={() => { this.props.onFilterButtonClick(); }}>
							<Image style={styles.navBarFilterButtonImage} source={filterButtonImageSource}/>
						</TouchableHighlight>
					}
					{
						(this.props.onInfoButtonClick) &&
						<TouchableHighlight style={styles.navBarInfoButton} onPress={() => { this.props.onInfoButtonClick(); }}>
							<Image style={styles.navBarInfoButtonImage} source={infoButtonImageSource}/>
						</TouchableHighlight>
					}
					{
						(this.props.enableSearch) &&
						<TouchableHighlight style={styles.navBarSearchButton} onPress={() => {
								this.isSearching = true;
								this.props.onSearchChanged(this.isSearching, this.text);
								Actions.refresh();
							}}>
							<Image style={styles.navBarSearchButtonImage} source={searchButtonImageSource}/>
						</TouchableHighlight>
					}
					{
						(this.props.onMapButtonClick) &&
						<TouchableHighlight style={styles.navBarMapButton} onPress={() => { this.props.onMapButtonClick(); }}>
							<Image style={styles.navBarMapButtonImage} source={mapButtonImageSource}/>
						</TouchableHighlight>
					}
					{
						(this.props.onListButtonClick) &&
						<TouchableHighlight style={styles.navBarMapButton} onPress={() => { this.props.onListButtonClick(this.props.localizedStrings, this.props.listItems); }}>
							<Image style={styles.navBarMapButtonImage} source={listButtonImageSource}/>
						</TouchableHighlight>
					}
					{
						(!this.props.onMapButtonClick && !this.props.onListButtonClick && !this.props.enableSearch) &&
						<View style={styles.navBarBackButton}>
						</View>
					}
				</View>
			}
			{
				this.isSearching &&
				<View style={[styles.navBarStyle,{backgroundColor:backgroundColor}]}>
					<TouchableHighlight style={styles.navBarBackButton} onPress={() => {
								this.text = '';
								this.isSearching = false;
								this.props.onSearchChanged(this.isSearching, this.text);
								Actions.refresh();
							}}>
						<Image style={styles.navBarBackButtonImage} source={backButtonImageSource}/>
					</TouchableHighlight>
					<TextInput
						style={styles.navBarSearchTextInput}
						onChangeText={(t) => {
							this.text = t;
							this.props.onSearchChanged(this.isSearching, this.text);
							Actions.refresh();
						}}
						autoFocus={true}
						value={this.text}
						placeholderTextColor='#888'
						underlineColorAndroid='#888'
						selectionColor='#555'
						placeholder={this.props.localizedStrings.search}
						onEndEditing={this.clearFocus}
						returnKeyType={"next"}
						onSubmitEditing={this.clearFocus}
					/>

					<TouchableHighlight style={styles.navBarCloseSearchButton} onPress={() => {
							this.text = '';
							this.props.onSearchChanged(this.isSearching, this.text);
							Actions.refresh();
						}}>
						<View>
						{
							this.text !== '' &&
							<Image style={styles.navBarCloseSearchButtonImage} tintColor='#EEEEEE' source={navBarCloseSearchButtonImageSource}/>
						}
						</View>
					</TouchableHighlight>

				</View>
			}
		</View>
    )
  }
}

NavBarView.defaultProps = {
	backgroundColor: '#000',
};

const styles = StyleSheet.create({
	
	navBarBackground: {
		height: 50, 
		flexDirection: 'column'
	},
	navBarStyle: {
		backgroundColor:'#000',
		flexDirection: 'row',		
		flex:1,
	},
	navBarBackButton: {
		width:40,
		height:50,
		flexDirection: 'column',
		justifyContent: 'center',
        alignItems: 'center',
	},
	navBarConfigButton: {
		width:40,
		height:50,
		flexDirection: 'column',
		justifyContent: 'center',
        alignItems: 'center',
	},
	navBarBackButtonImage: {
		width:25,
		height:25,
		alignSelf:'center',
		tintColor:'#EEE',
	},	
	navBarConfigButtonImage: {
		width:23,
		height:23,
		alignSelf:'center',
		tintColor:'#EEE',
	},	
	navBarText: {
		flex:1,
		fontSize: 15,
		fontFamily: 'Brandon_bld',
		color: '#EEE',
		justifyContent:'center',
		alignSelf:'center',
		textAlign: 'center',
	},	
	navBarSearchButton: {
		width:40,
		height:50,
		flexDirection: 'column',
		justifyContent: 'center',
        alignItems: 'center',
	},
	navBarSearchButtonImage: {
		width:27,
		height:27,
		tintColor:'#EEE',
	},		
	navBarMapButton: {
		width:40,
		height:50,
		flexDirection: 'column',
		justifyContent: 'center',
        alignItems: 'center',
	},
	navBarMapButtonImage: {
		width:25,
		height:25,
		tintColor:'#EEE',
	},
	navBarFilterButton: {
		width:40,
		height:50,
		flexDirection: 'column',
		justifyContent: 'center',
        alignItems: 'center',
	},
	navBarFilterButtonImage: {
		width:25,
		height:25,
		tintColor:'#EEE',
	},
	navBarInfoButton: {
		width:40,
		height:50,
		flexDirection: 'column',
		justifyContent: 'center',
        alignItems: 'center',
	},
	navBarInfoButtonImage: {
		width:22,
		height:22,
		tintColor:'#EEE',
	},
	navBarSearchTextInput: {
		height: 50, 
		flex:1, 
		fontSize:18, 
		color:'#EEE'
	},
	navBarCloseSearchButton: {
		width:40,
		height:50,
		flexDirection: 'column',
		justifyContent: 'center',
        alignItems: 'center',
	},
	navBarCloseSearchButtonImage: {
		width:20,
		height:20,
		tintColor:'#EEE',
	},
});