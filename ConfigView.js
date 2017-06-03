import React, { Component } from 'react';
import { Text, TouchableHighlight, View, StyleSheet, ListView, Alert, Image, AsyncStorage} from 'react-native';
import { Actions } from 'react-native-router-flux';
import NavBar from './NavBar';

export default class ConfigView extends Component {
  
  	jsonEngUrl = 'https://s3-sa-east-1.amazonaws.com/wirestorage/jsons/JSON_ENG.json';
	jsonEspUrl = 'https://s3-sa-east-1.amazonaws.com/wirestorage/jsons/JSON_ESP.json';
	
	constructor(props) {
		super(props);
	}

	changeLanguage(language, postLoadAction){
		
		/*
		var postLoadAction2 = () => {
			postLoadAction();
			Actions.refresh();
		}*/
		
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
		this.getJsonAsync(this.jsonEngUrl, postLoadAction);
	}
	
	getJsonESP(postLoadAction) {
		this.getJsonAsync(this.jsonEspUrl, postLoadAction);
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
		return fetch(url)
			.then((responseJson) => {
				var citiesJsonString = responseJson._bodyInit;
				this.processJson(citiesJsonString, postLoadAction);
			})
			.catch((error) => { 
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
		
		if (postLoadAction != null){
			postLoadAction(this.state.localizedStrings, citiesJson);
		}
	}
  
	saveCitiesJsonInStorage(citiesJsonString){
		try {
			AsyncStorage.setItem('citiesJson', citiesJsonString);
		} catch (error) {
			console.error('Error saving citiesJson: ' + error);
		}
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

	// menu items
	var items = [];
	if(this.props.items == null || this.props.items == 'undefined'){
		
		var changeLanguageItems = [];
		
		var englishChangeLanguageItem = ({ name : this.props.localizedStrings.english });
		englishChangeLanguageItem.action = () =>  {
			Actions.statusModal({ loading: true});
			this.changeLanguage('ENG', () => { 
				this.props.onLanguageChanged(this.state.localizedStrings, this.state.citiesJson);
				Actions.pop();
				Actions.refresh();
				Actions.pop();
				//Actions.statusModal({ error: this.props.localizedStrings.languageChanged, hide: false, loading: false});
			});
		}
		changeLanguageItems.push(englishChangeLanguageItem);
		
		var spanishChangeLanguageItem = ({ name : localizedStrings.spanish });
		spanishChangeLanguageItem.action = () =>  {
			Actions.statusModal({ loading: true});
			this.changeLanguage('ESP', () => {
				this.props.onLanguageChanged(this.state.localizedStrings, this.state.citiesJson);
				Actions.pop();
				Actions.refresh();
				Actions.pop();
				//Actions.statusModal({ error: this.props.localizedStrings.languageChanged, hide: false, loading: false});
			});
		}
		changeLanguageItems.push(spanishChangeLanguageItem);
		
		var changeLanguageItem = ({ name : localizedStrings.changeLanguage });
		changeLanguageItem.action = () =>  {
			Actions.configPage({ 
				navBarTitle: localizedStrings.changeLanguage, 
				localizedStrings: localizedStrings,
				items: changeLanguageItems})
		}
		items.push(changeLanguageItem);
		
		var aboutDarwinItem = ({ name : localizedStrings.aboutDarwin });
		aboutDarwinItem.action = () => Alert.alert('', aboutDarwinItem.name);
		items.push(aboutDarwinItem);
		
		var termsAndConditionsItem = ({ name : localizedStrings.termsAndConditions });
		termsAndConditionsItem.action = () => Alert.alert('', termsAndConditionsItem.name);
		items.push(termsAndConditionsItem);
		
		var privacyPolicyItem = ({ name : localizedStrings.privacyPolicy });
		privacyPolicyItem.action = () => Alert.alert('', privacyPolicyItem.name);
		items.push(privacyPolicyItem);
		
		var followUsOnFacebookItem = ({ name : localizedStrings.followUsOnFacebook });
		followUsOnFacebookItem.action = () => Alert.alert('', followUsOnFacebookItem.name);
		items.push(followUsOnFacebookItem);
		
		var emailUsItem = ({ name : localizedStrings.emailUs });
		emailUsItem.action = () => Alert.alert('', emailUsItem.name);
		items.push(emailUsItem);
	}
	else {
		items = this.props.items;
	}
	const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
	const dataSource = ds.cloneWithRows(items.slice());
	  
	// nav bar title
	var navBarTitle = '';
	if (this.props.navBarTitle == null){
		navBarTitle = localizedStrings.settings.toUpperCase();
	}
	else {
		navBarTitle = this.props.navBarTitle.toUpperCase();;
	}

	return (

		<View style={styles.configBackground}>
			<NavBar style={{height:50}} 
				title={navBarTitle} 
				localizedStrings={localizedStrings}
				enableSearch={false}/>	
			<ListView style={styles.configListView}
				keyboardShouldPersistTaps={true}
				dataSource={dataSource}
				renderRow={(item) => {
					return (
						<TouchableHighlight underlayColor={'#888'} style={styles.configButton} onPress={() => { item.action(); }}>
							<Text style={styles.configButtonText}>{item.name}</Text>
						</TouchableHighlight>
					)
				}}
			/>
		</View>
	)
  }
}

const styles = StyleSheet.create({
	
	configBackground: {
		flex: 1,
		backgroundColor: '#AAA',
		alignSelf: 'stretch',
		flexDirection: 'column'
	},
	configButton: {
		marginBottom: 1,
		marginTop: 1,
		marginLeft: 2,
		marginRight: 2,
		backgroundColor: '#EEE',
		alignSelf: 'stretch',
		flexDirection: 'row',
		height: 50,
	},
	configButtonText: {
		marginLeft:10,
		color:'#333',
		fontFamily:'OpenSans-Regular',
		alignSelf:'center',
		fontSize: 16,
	},
});