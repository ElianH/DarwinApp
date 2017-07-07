import React, { Component } from 'react';
import { Text, TouchableHighlight, View, StyleSheet, Alert, Image, ListView, ActivityIndicator, StatusBar, AsyncStorage, ViewPropTypes } from 'react-native';
import { Actions } from 'react-native-router-flux';

export default class LogoView extends Component {
 
	jsonEngUrl = 'https://s3-sa-east-1.amazonaws.com/wirestorage/jsons/JSON_ENG.json';
	jsonEspUrl = 'https://s3-sa-east-1.amazonaws.com/wirestorage/jsons/JSON_ESP.json';
	usingRemoteJson = true;
 
	constructor(props) {
		super(props);	
		
		this.state = this.getInitialState();
	}
	
	getInitialState() {
		return {
			isLoading: true
		};
	}
	
	componentDidMount() {
		this.changeLanguageENG = this.changeLanguageENG.bind(this);
		this.changeLanguageESP = this.changeLanguageESP.bind(this);
		
		const localizationENG = require('./localization_ENG.js');
		this.setState({
		  localizedStrings: localizationENG.ENG,
		  isLoading: false
		});

		AsyncStorage.getItem('language', (err, result)=> {
			if (err != null && err != 'undefined' && err != ''){
				Alert('no language');
			}
			else {
				if (result == 'ENG'){
					this.changeLanguageENG((localizedStrings, citiesJson) => 
										this.goToCitiesPage(localizedStrings, citiesJson));
				}
				else if (result == 'ESP'){
					this.changeLanguageESP((localizedStrings, citiesJson) => 
										this.goToCitiesPage(localizedStrings, citiesJson));
				}
				else {
					// No language loaded yet, do nothing
				}
			}
		});
	}

	changeLanguage(language, postLoadAction){
		if (language == 'ENG'){
			this.changeLanguageENG(postLoadAction);
		}
		else if (language == 'ESP'){
			this.changeLanguageESP(postLoadAction);
		}
		else {
			// No language loaded yet, do nothing
		}
	}
	
	saveLanguageInStorage(language){
		// set language in storage for next login
		try {
			AsyncStorage.setItem('language', language);
		} catch (error) {
			console.error('Error saving language: ' + error);
		}
	}
	
	changeLanguageENG(postLoadAction){
		// load english localizations
		const localizationENG = require('./localization_ENG.js');
		this.setState({
			localizedStrings: localizationENG.ENG,
			isLoading: true
		});

		this.saveLanguageInStorage('ENG');
		this.getJsonENG(postLoadAction);
	}	

	changeLanguageESP(postLoadAction){
		// load spanish localizations
		const localizationESP = require('./localization_ESP.js');
		this.setState({
			localizedStrings: localizationESP.ESP,
			isLoading: true
		});
		
		this.saveLanguageInStorage('ESP');
		this.getJsonESP(postLoadAction);
	}	
	
	getJsonENG(postLoadAction) {
		if (this.usingRemoteJson){
			this.getJsonAsync(this.jsonEngUrl, postLoadAction);
		}
		else {
			var json = require('./jsons/JSON_ENG.json');
			this.setState({
				citiesJson: json
			});
		}
	}
	
	getJsonESP(postLoadAction) {
		if (this.usingRemoteJson){
			this.getJsonAsync(this.jsonEspUrl, postLoadAction);
		}
		else {
			var json = require('./jsons/JSON_ESP.json');
			this.setState({
				citiesJson: json
			});
		}
	}
	
	prefetchImages(citiesJson){
		var uris = [];

		citiesJson.slice().map((city)=> {
			// load city images
			uris.push(city.mainImageSrc);
			if (city.otherImages != null){
				city.otherImages.slice().map((otherImage)=>uris.push(otherImage.imageSrc));
			}
			// load city menu images
			city.cityMenus.map((cityMenu)=> {
				if (uris.indexOf(cityMenu.imageSrc)<0){
					uris.push(cityMenu.imageSrc);
					uris.push(cityMenu.backgroundImageSrc);
				}
				// load city menu item images
				cityMenu.items.slice().map((item)=>{
					uris.push(item.mainImageSrc);
					if (item.otherImages != null){
						item.otherImages.slice().map((otherImage)=>uris.push(otherImage.imageSrc));
					}
				});
			});
		});
		
		var imagePrefetch = [];
		for (let uri of uris) {
			if (uri != null && uri != 'undefined'){
				Image.prefetch(uri);
				//Alert.alert('Prefetching image', uri);
			}
			//imagePrefetch.push(Image.prefetch(uri));
		}
		
		//Alert.alert('Done loading images: ' + uris.length);
		
		/*
		Promise.all(imagePrefetch).then(results => {
			isLoading: false
			console.log("All images prefetched in parallel");
			Alert.alert('Done loading images: ' + uris.length);
		});*/
	}

	getJsonAsync(url, postLoadAction) {

		fetch(url)
      		.then((response) => response.json())
      		.then((responseJson) => {
        		var citiesJsonString = JSON.stringify(responseJson);
        		this.processJson(citiesJsonString, postLoadAction);
      		})
      		.catch((error) => {
        		console.error(error);
      		});
  		return;



		return fetch(url)
			.then((responseJson) => {
				var citiesJsonString = responseJson._bodyInit;

				console.error(responseJson._bodyInit);
				Alert.alert('json 123:',responseJson._bodyInit.cities);

				this.processJson(citiesJsonString, postLoadAction);
			})
			.catch((error) => { 
				
				//Alert.alert('error', error); 
				//return;

				Alert.alert(this.state.localizedStrings.offlineMode, this.state.localizedStrings.offlineModeAlertText);
			
				try {
					AsyncStorage.getItem('citiesJson', (err, citiesJsonString)=> {
						if (err != null && err != 'undefined' && err != ''){
							Alert.alert(this.state.localizedStrings.offlineMode, err);
						}
						else {					
							this.processJson(citiesJsonString,postLoadAction);
						}
					});
				} catch (error) {

					Alert.alert(this.state.localizedStrings.offlineMode, 'Error loading data');
				}
			});
	}
	
	processJson(citiesJsonString, postLoadAction){

		var citiesJson = JSON.parse(citiesJsonString);

		this.setState({
			citiesJson: citiesJson,
			isLoading: false
		});
		this.saveCitiesJsonInStorage(citiesJsonString);
		this.prefetchImages(citiesJson);
		postLoadAction(this.state.localizedStrings, citiesJson);
	}
  
	saveCitiesJsonInStorage(citiesJsonString){
		try {
			AsyncStorage.setItem('citiesJson', citiesJsonString);
		} catch (error) {
			console.error('Error saving citiesJson: ' + error);
		}
	}

	goToCityPage(localizedStrings, selectedCity){ 
		Actions.cityPage({localizedStrings: localizedStrings, selectedCity: selectedCity}); 
	}
	
	goToCitiesPage(localizedStrings, citiesJson){
		Actions.citiesPage({
			localizedStrings: localizedStrings, 
			citiesJson: citiesJson,
			changeLanguage: this.changeLanguage
		});
	}
	
	goToGeneralMapPage(localizedStrings, citiesJson){ 
		Actions.generalMapPage({
			localizedStrings: localizedStrings, 
			markers: citiesJson,
			showFilters: false,
			onMarkerClick: this.goToCityPage,
			onListButtonClick: this.goToCitiesPage,
			changeLanguage: this.changeLanguage
		}); 
	}
 
	render() {

		const logoBackgroundImageSource = require('./img/JPGs/background_grey.jpg');
		const logoImageSource = require('./img/LOGO2.png');

		//<StatusBar hidden={false} backgroundColor='#000' />
		
		return (
			<View style={styles.logoView}>

				<Image style={styles.logoBackgroundImage} source={logoBackgroundImageSource}>
					
					<View style={styles.logoBackground}>
						<Image style={styles.logoImage} resizeMode='contain' source={logoImageSource}/>
					</View>
					{
						(this.state.isLoading) &&
						<View style={styles.languages}>
							<ActivityIndicator style={styles.loading} size="large" color='#EEE' />
						</View>
					}
					{
						(!this.state.isLoading) &&
						<View style={styles.languages}>
							<TouchableHighlight style={styles.languageButton} underlayColor='#175389' 
								onPress={() => 
									this.changeLanguageENG((localizedStrings, citiesJson) => 
										this.goToGeneralMapPage(localizedStrings, citiesJson))}>
								<Text style={styles.languageButtonText}>ENGLISH</Text>
							</TouchableHighlight>
							<TouchableHighlight style={styles.languageButton} underlayColor='#175389' 
								onPress={() => 
									this.changeLanguageESP((localizedStrings, citiesJson) => 
										this.goToGeneralMapPage(localizedStrings, citiesJson))}>
								<Text style={styles.languageButtonText}>ESPAÑOL</Text>
							</TouchableHighlight>
						</View>
					}
				</Image>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	
	logoView: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between'
	},
	logoBackgroundImage: {
		flex: 1,
		resizeMode: 'cover',
		width: null,
		height: null,
	},
	logoImage: {
		marginTop:80,
		height: 80,
		alignSelf: 'center',
	},
	languages: {
		flex: 1,
		paddingTop: 10,
		alignSelf: 'stretch',
		alignItems: 'stretch',
		justifyContent: 'center',
		flexDirection: 'row'
	},	
	languageButton: {
		marginLeft: 5,
		marginRight: 5,
		borderRadius: 1,
		width: 150,
		height: 40,
		justifyContent: 'center',
		alignItems: 'center'
	},
	languageButtonText: {
		fontSize: 14,
		fontFamily: 'OpenSans-Bold',
		textAlign: 'center',
		color: '#EEE'
	},
	logoBackground: {
		flex: 4,
		justifyContent: 'center',
	},
	loading:{
		alignSelf: 'stretch',
		height: 40,
		justifyContent: 'center',
	},
});
