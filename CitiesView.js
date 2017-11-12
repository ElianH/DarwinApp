import React, { Component } from 'react';
import { Text, TouchableHighlight, View, StyleSheet, ListView, Alert, Image, TextInput, TouchableWithoutFeedback, StatusBar} from 'react-native';
import { Actions } from 'react-native-router-flux';
import NavBar from './NavBar';
import LinearGradient from 'react-native-linear-gradient';

export default class CitiesView extends Component {

  isSearching = false;
  text = '';

  constructor(props) {
	super(props);
  }

  	goToCitiesPage(localizedStrings, citiesJson){
		Actions.citiesPage({
			localizedStrings: localizedStrings,
			citiesJson: citiesJson,
		});
	}

	goToGeneralMapPage(localizedStrings, citiesJson){
		Actions.generalMapPage({
			localizedStrings: localizedStrings,
			markers: citiesJson,
			showFilters: false,
			onMarkerClick: this.goToCityPage,
			onListButtonClick: this.goToCitiesPage
		});
	}

	goToCityPage(localizedStrings, selectedCity){
		if (selectedCity.isEnabled != null && (selectedCity.isEnabled == 'false' || !selectedCity.isEnabled))
		  return;

		Actions.cityPage({localizedStrings: localizedStrings, selectedCity: selectedCity});
	}

	goToInfoPage(localizedStrings, city){
		Actions.infoPage({ localizedStrings: localizedStrings, selectedItem: city});
	}

	onLanguageChanged(localizedStrings, citiesJson){
		this.setState({
			localizedStrings: localizedStrings,
			citiesJson: citiesJson
		});
	}

  render() {

	// localized strings
    var localizedStrings = null;
	if (this.state != null && this.state.localizedStrings != null){
		localizedStrings = this.state.localizedStrings;
	}
	else {
		localizedStrings = this.props.localizedStrings;
	}

	// citiesJson
    var citiesJson = null;
	if (this.state != null && this.state.citiesJson != null){
		citiesJson = this.state.citiesJson;
	}
	else {
		citiesJson = this.props.citiesJson;
	}

	// filtered cities
	var filterText = this.text.toLowerCase();
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
	var newFilter = citiesJson.slice().filter((item)=> { return (filterText === '' || item.name.toLowerCase().indexOf(filterText) !== -1) });
	var filteredDataSource = ds.cloneWithRows(newFilter);

	// nav bar title
	var upperCaseDestinations = localizedStrings.destinations.toUpperCase();

	const infoIconImageSource = require('./img/Icons/info.png');

    return (

		<View style={styles.citiesBackground}>
			<NavBar style={{height:50}}
				title={upperCaseDestinations}
				localizedStrings={localizedStrings}
				enableSearch={true}
				enableBackButton={false}
				enableConfigButton={true}
				onSearchChanged={(isSearching, text) => {
					this.isSearching = isSearching;
					this.text = text;
				}}
				onLanguageChanged= { (localizedStrings, citiesJson) => { this.onLanguageChanged(localizedStrings, citiesJson); }}
				onMapButtonClick={() => { this.goToGeneralMapPage(localizedStrings, citiesJson); }}/>
			<ListView style={styles.citiesListView}
				keyboardShouldPersistTaps="always"
				dataSource={filteredDataSource}
				renderRow={(city) => {
					return (
						<TouchableHighlight style={styles.cityButton} onPress={() => { this.goToCityPage(localizedStrings, city) }}>
							<Image style={styles.cityButtonBackgroundImage} borderRadius={6} source={{uri: city.mainImageSrc}}>
								<View  style={styles.cityButtonBackgroundImageView}>
									<View style={styles.cityButtonTextView}>
										<Text style={styles.cityButtonText}>{city.name.toUpperCase()}</Text>
									</View>
									<Text style={styles.cityButtonShortDescriptionText}>{city.shortDescription}</Text>
									<TouchableHighlight style={styles.cityButtonIconsView} onPress={() => { this.goToInfoPage(localizedStrings, city) }}>
										<Image style={styles.cityButtonInfoIconImage} source={infoIconImageSource}/>
									</TouchableHighlight>
								</View>
							</Image>
						</TouchableHighlight>
					)
				}}
			/>
		</View>
    )
  }
}

const styles = StyleSheet.create({

	citiesBackground: {
		flex: 1,
		backgroundColor: '#000',
		alignSelf: 'stretch',
		flexDirection: 'column'
	},
	citiesListView: {
		flex: 1,
		alignSelf: 'stretch',
		flexDirection: 'column',
		backgroundColor: '#000',
	},
	cityButton: {
		marginBottom: 5,
		marginTop: 5,
		marginLeft: 7,
		marginRight: 7,
		alignSelf: 'stretch',
		height: 250,
	},
	cityButtonBackgroundImage: {
		justifyContent: 'flex-end',
		alignItems: 'center',
		flex: 1,
	},
	cityButtonBackgroundImageView: {
		alignSelf: 'stretch',
		justifyContent: 'flex-end',
		alignItems: 'center',
		flexDirection: 'column',
	},
	cityButtonTextView: {
		alignSelf: 'stretch',
	},
	cityButtonShortDescriptionText: {
		fontSize: 20,
		marginLeft: 10,
		marginTop: -10,
		marginBottom: 10,
		alignSelf: 'flex-start',
		fontFamily: 'OpenSans-Regular',
		color: '#EEE'
	},
	cityButtonText: {
		fontSize: 40,
		marginLeft: 10,
		alignSelf: 'flex-start',
		fontFamily: 'Brandon_blk',
		color: '#EEE'
	},
	cityButtonIconsView: {
		height:40,
		flexDirection: 'row',
		alignSelf: 'flex-end',
	},
	cityButtonInfoIconImage: {
		width: 25,
		height: 25,
		margin: 10,
		alignSelf: 'flex-end',
		tintColor: '#EEE',
	},
	linearGradient: {
        backgroundColor: "transparent",
        position: "absolute",
		borderRadius: 6,
		justifyContent: 'flex-end',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
	}
});
