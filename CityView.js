import React, { Component } from 'react';
import { Text, TouchableHighlight, View, StyleSheet, ListView, Image, Dimensions, Alert, Linking} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Carousel from 'react-native-carousel';
import ViewPager from 'react-native-viewpager';
import NavBar from './NavBar';
import LinearGradient from 'react-native-linear-gradient';

var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

export default class CityView extends Component {
	
	text = '';
	isSearching = false;
	drawStickyHeader = false;
	
	constructor(props) {
		super(props);
	}

	render() {
		
		// flat map all items for all menues (this will be passed to th map later)
		var arrays = this.props.selectedCity.cityMenus.slice().map((cityMenu)=> { 
			return cityMenu.items.slice().map((item)=>{
				item.typeName = cityMenu.cityMenuName;
				item.typeImageSrc = cityMenu.imageSrc;
				return item;
			}) 
		});
		var allMarkers = [].concat.apply([], arrays);
	
		// navigation	
		const goToCityMenuPage = (selectedCityMenu) => Actions.cityMenuPage({
			localizedStrings: this.props.localizedStrings, 
			selectedCity: this.props.selectedCity,
			selectedCityMenu: selectedCityMenu}); 
		const goToInfoPage = (item) => { Actions.infoPage({
			localizedStrings: this.props.localizedStrings, 
			selectedItem: item}); 
		};  
		const goToGeneralMapPage = (showNearMe) => { Actions.generalMapPage({
				localizedStrings: this.props.localizedStrings, 
				markers: allMarkers,
				showFilters: true,
				onMarkerClick: (localizedStrings, item)=>goToInfoPage(item),
				showNearMe : showNearMe,
			}); 
		};
	
		// filtered results
		var filterText = this.text.toLowerCase();
		const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		var newFilter = this.props.selectedCity.cityMenus.slice().filter((cityMenu)=> { return (filterText === '' || cityMenu.cityMenuName.toLowerCase().indexOf(filterText) !== -1) });
		var filteredDataSource = ds.cloneWithRows(newFilter);
		
		// nav bar title
		var upperCaseCityName = this.props.selectedCity.name.toUpperCase();
			
		// city images (for view pager)
		var citiImages = [];
		if (this.props.selectedCity.otherImages != null){
			citiImages = this.props.selectedCity.otherImages;
		}
		const vpds = new ViewPager.DataSource({pageHasChanged: (p1, p2) => p1 !== p2});
		var cityImagesDataSource = vpds.cloneWithPages(citiImages);
		
		const iconNearMeImageSource = require('./img/Icons/icon_near.png');
		
		return (

			<View style={{flex:1,alignSelf:'stretch',backgroundColor: '#000'}}>
				<NavBar style={{height:50}} 
					title={upperCaseCityName} 
					localizedStrings={this.props.localizedStrings} 
					enableSearch={true}
					onSearchChanged={(isSearching, text) => { 
						this.isSearching = isSearching;  
						this.text = text;
					}}
					onInfoButtonClick={()=> goToInfoPage(this.props.selectedCity) }
					onMapButtonClick={()=> goToGeneralMapPage(false)}
				/>
				<View style={styles.cityBackground}>
					<ListView contentContainerStyle={styles.cityMenusListView}
						dataSource={filteredDataSource}
						renderHeader={() => 
							<View style={styles.cityListViewHeader}>
								<TouchableHighlight style={styles.aroundMeButton} onPress={() => goToGeneralMapPage(true) }>
									<Image style={styles.aroundMeButtonBackgroundImage} borderRadius={6} source={{uri: this.props.selectedCity.mainImageSrc}}>
										<LinearGradient 
											start={{x: 0.0, y: 0.0}} 
											end={{x: 0.0, y: 1.0}} 
											borderRadius={6} 
											colors={["#0007", "#000D"]} 
											locations={[-0.5,1.3]} 
											style={styles.linearGradient}
											>
											<View style={styles.aroundMeButtonTextView}>
												<Text style={styles.aroundMeButtonText}>{this.props.localizedStrings.nearMe.toUpperCase()}</Text>
												<Image style={styles.cityMenuIconImage} resizeMode='contain' source={iconNearMeImageSource}/>
											</View>
										</LinearGradient>
									</Image>
								</TouchableHighlight>
							</View>
						}
						renderRow={(cityMenu) => {
							return (
								<TouchableHighlight style={styles.cityMenuButton} onPress={() => { goToCityMenuPage(cityMenu) }}>
									<Image style={styles.aroundMeButtonBackgroundImage} borderRadius={6} source={{uri: cityMenu.backgroundImageSrc}}>
										<View style={styles.cityMenuButtonView}>
											<Image style={styles.cityMenuIconImage} resizeMode='contain' source={{uri: cityMenu.imageSrc}}/>
											<Text style={styles.cityMenuButtonText}>{cityMenu.cityMenuName.toUpperCase()}</Text>
										</View>
									</Image>
								</TouchableHighlight>
							)
						}}>
					</ListView>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	
	cityBackground: {
		flex: 1,
		backgroundColor: '#000',
		alignSelf: 'stretch',
		flexDirection: 'column',
	},		
	cityMenusListView: {
		justifyContent: 'center',
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginLeft: 2,
		marginRight: 2,
	},
	cityListViewHeader: {
		alignSelf: 'flex-start',
		flexDirection:'row',
		height: 100,
		width: deviceWidth,
	},
	aroundMeButton: {
		borderRadius: 6,
		margin: 2,
		marginLeft: 4,
		marginRight: 4,
		flex: 1,
	},
	aroundMeButtonBackgroundImage:{
		flex: 1
	},
	linearGradient: {
        flex: 1,
		backgroundColor: "transparent",
        position: "absolute",
		borderRadius: 6,
		flexDirection:'column',
		justifyContent: 'center',
		alignItems: 'stretch',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
	},
	aroundMeButtonTextView: {
		flex: 1,
		flexDirection:'column',
		alignSelf: 'center',
		justifyContent: 'center',
	},
	aroundMeButtonText:{
		fontSize: 15,
		marginLeft: 10,
		alignSelf: 'center',
		fontFamily: 'OpenSans-Bold',
		color: '#F4F4F4'
	},
	cityMenuButton:{
		width: (deviceWidth/2) - 8,
		height: (deviceWidth/2) - 8,
		borderRadius: 6,
		margin:2,
	},
	cityMenuButtonView: {
		flex: 1,
		flexDirection:'column',
		alignSelf: 'center',
		justifyContent: 'center',
		marginBottom: 0,
	},
	cityMenuIconImage: {
		width: 30,
		height: 30,
		margin: 10,
		alignSelf: 'center',
	},
	cityMenuButtonText:{
		fontSize: 15,
		marginLeft: 10,
		alignSelf: 'center',
		fontFamily: 'OpenSans-Bold',
		color: '#F4F4F4'
	},
});