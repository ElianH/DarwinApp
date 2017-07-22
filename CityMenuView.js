import React, { Component } from 'react';
import { Text, TouchableHighlight, View, StyleSheet, ListView, Alert, Dimensions} from 'react-native';
import { Actions } from 'react-native-router-flux';
import NavBar from './NavBar';
import { calculateItemDistance, calculateItemDistanceNumber } from './DistanceView';
import Drawer from 'react-native-drawer';
import LinearGradient from 'react-native-linear-gradient';
import Image from './ImageProgress';

var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

export default class CityMenuView extends Component {
	
	text = '';
	isSearching = false;
	openDrawer = false;
	sortBy = '';
	distinctItemTypes = [];
	itemTypesMap = {};
	lastMenuName = "none";
	
	state = { 
		lastPosition: '-'
	};

	constructor(props) {
		super(props);
		
		this.formatPrice = this.formatPrice.bind(this);
		this.sortingStyle = this.sortingStyle.bind(this);
		this.sortingTextStyle = this.sortingTextStyle.bind(this);
	}
	
	componentDidMount() {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				this.setState({lastPosition : position});
			},
			(error) => 
			{ 
				this.setState({lastPosition : '-'});
			},
			{
				enableHighAccuracy: false, 
				timeout: 20000, 
				maximumAge: 30000
			}
		);
	}
	
	formatPrice(price){
		var formattedPrice = '';
		if (price != null)
		{
			for (i = 0; i < price; i++) {
				formattedPrice = formattedPrice + "$";
			}
		}
		return formattedPrice;
	}
	
	sortingStyle(thisButton){
		var color = '#EEE0';
		if (this.sortBy == thisButton){
			color = '#EEE';
		}
		return {
			flex:1,
			height:35,
			justifyContent:'center',
			alignItems:'center',
			flexDirection:'row',
			backgroundColor:color,
		}
	}
	
	sortingTextStyle(thisButton){
		var color = '#DDD';
		if (this.sortBy == thisButton){
			color = '#222';
		}
		return {
			fontSize: 14,
			color:color,
			fontFamily:'OpenSans-Regular',
		}
	}
  
	render() {
	  
        // needed to fix a bug when switching screens fast
		if (this.lastMenuName != this.props.selectedCityMenu.cityMenuName){
			this.text = '';
			this.isSearching = false;
			this.openDrawer = false;
			this.sortBy = '';
			this.distinctItemTypes = [];
			this.itemTypesMap = {};
			this.lastMenuName = this.props.selectedCityMenu.cityMenuName;
		}
	  
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
		const goToInfoPage = (item) => { Actions.infoPage({
			localizedStrings: this.props.localizedStrings, 
			selectedItem: item}); 
		};  
		const goToGeneralMapPage = () => { Actions.generalMapPage({
				localizedStrings: this.props.localizedStrings, 
				markers: allMarkers,
				showFilters: true,
				selectedType: this.props.selectedCityMenu.cityMenuName,
				onMarkerClick: (localizedStrings, item)=>goToInfoPage(item)
			}); 
		};
		
		// get filter buttons based on the current items. Populate list and map for future use
		const checkmarkImageSource = require('./img/Icons/checkmark.png');

		const ds2 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		if (this.distinctItemTypes.length == 0)
		{
			this.props.selectedCityMenu.items.slice().map((item)=>{ 
				var filterItem = { name:item.itemType, isSelected:true };
				if (typeof(this.itemTypesMap[filterItem.name]) == "undefined"){
					this.distinctItemTypes.push(filterItem);
				} 
				this.itemTypesMap[filterItem.name] = filterItem;
			})
		}
		var filterTypes = ds2.cloneWithRows(this.distinctItemTypes);
		
		// drawer
		const toggleDrawer = () => { this.openDrawer = !this.openDrawer; Actions.refresh(); }
		const closeFilterDrawer = () => { this.openDrawer = false; Actions.refresh(); }
		
		// filter and sorting results. First by search, then by type (filters), then apply sorting
		const removeFilters = () => { 
			this.distinctItemTypes.slice().map((item)=> this.itemTypesMap[item.name].isSelected = true); 
			Actions.refresh();
			setTimeout(closeFilterDrawer, 500);
		}
		const toggleFilter = (filterItem) => { this.itemTypesMap[filterItem.name].isSelected = !this.itemTypesMap[filterItem.name].isSelected; Actions.refresh(); }
		const sortByDistance = () => { this.sortBy = 'distance'; Actions.refresh(); }
		const sortByNameAsc = () => { this.sortBy = 'nameAsc'; Actions.refresh(); }
		const sortByNameDesc = () => { this.sortBy = 'nameDesc'; Actions.refresh(); }
		var filterText = this.text.toLowerCase();
		const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		var newFilter = this.props.selectedCityMenu.items.slice().filter((item)=> { 
			return (filterText === '' || item.name.toLowerCase().indexOf(filterText) !== -1) 
		});
		var newFilter = newFilter.slice().filter((item)=> { 
			var itemType = this.itemTypesMap[item.itemType];
			if (itemType != null){
				return itemType.isSelected;
			}
			else {
				// This should never happen
				return false;
			};
		});
		if (this.sortBy != ''){
			newFilter = newFilter.slice().sort((item1, item2)=> { 
				switch(this.sortBy){
					case 'nameAsc':
						if(item1.name < item2.name) return -1;
						if(item1.name > item2.name) return 1;
						return 0;
					case 'nameDesc':
						if(item1.name > item2.name) return -1;
						if(item1.name < item2.name) return 1;
						return 0;
					case 'distance':
						var distItem1 = calculateItemDistanceNumber(this.state.lastPosition, item1);
						var distItem2 = calculateItemDistanceNumber(this.state.lastPosition, item2);
						if (distItem1 != null && distItem2 != null){
							return distItem1-distItem2;
						}
						return 0;
				}
				return 0;
			});
		}
		var filteredDataSource = ds.cloneWithRows(newFilter);
		var hasFilters = false;
		this.distinctItemTypes.slice().map((item)=> hasFilters = hasFilters || !this.itemTypesMap[item.name].isSelected);
		
		// nav bar title
		var upperCaseCityMenuName = this.props.selectedCityMenu.cityMenuName.toUpperCase();
		
		return (
			<View style={{flex:1,alignSelf:'stretch',backgroundColor: '#000'}}>
				<NavBar style={{height:50}} 
					title={upperCaseCityMenuName} 
					localizedStrings={this.props.localizedStrings} 
					enableSearch={true}
					onSearchChanged={(isSearching, text) => { 
						this.isSearching = isSearching;  
						this.text = text;
					}}
					onFilterButtonClick={toggleDrawer}
					onMapButtonClick={goToGeneralMapPage}
				/>

				<Drawer
					type="overlay"
					openDrawerOffset={80}
					tweenDuration={100}
					side="right"
					styles={drawerStyles}
					open={this.openDrawer}
					onOpen={()=> { this.openDrawer = true; Actions.refresh(); }}
					onClose={()=> { this.openDrawer = false; Actions.refresh(); }}
					tapToClose={true}
					content={
						<View style={{backgroundColor:'#151515EE', padding:25, flex:1}}>
						
							<Text style={styles.filterTitleText}>{this.props.localizedStrings.sortBy.toUpperCase()}</Text>
							
							<View style={styles.sortByView}>
								<TouchableHighlight style={this.sortingStyle('distance')} onPress={sortByDistance}>
									<View style={styles.sortByButtonView}>	
										<Text style={this.sortingTextStyle('distance')}>{this.props.localizedStrings.shortestDistance.toUpperCase()}</Text>
									</View>
								</TouchableHighlight>
								<View style={styles.sortByMiddleLine} />
								<TouchableHighlight style={this.sortingStyle('nameAsc')} onPress={sortByNameAsc}>
									<View style={styles.sortByButtonView}>
										<Text style={this.sortingTextStyle('nameAsc')}>{this.props.localizedStrings.sortByNameAsc.toUpperCase()}</Text>
									</View>
								</TouchableHighlight>
								<View style={styles.sortByMiddleLine} />
								<TouchableHighlight style={this.sortingStyle('nameDesc')} onPress={sortByNameDesc}>
									<View style={styles.sortByButtonView}>
										<Text style={this.sortingTextStyle('nameDesc')}>{this.props.localizedStrings.sortByNameDesc.toUpperCase()}</Text>
									</View>
								</TouchableHighlight>
							</View>
							
							<Text style={styles.filterTitleText}>{this.props.localizedStrings.showOnly.toUpperCase()}</Text>
							
							<ListView contentContainerStyle={styles.filterListView}
								dataSource={filterTypes}
								renderRow={(filterItem) => {
									return (
									<TouchableHighlight style={styles.filterButton} onPress={() => { toggleFilter(filterItem); }}>
										<View style={styles.filterButtonView}>
											<Text style={styles.filterButtonText}>{filterItem.name.toUpperCase()}</Text>
											{
												this.itemTypesMap[filterItem.name].isSelected &&
												<Image style={styles.filterCheckmarkImage} resizeMode='contain' source={checkmarkImageSource}/>				
											}
										</View>
									</TouchableHighlight>
									)
								}}>
							</ListView>
							
						</View>
					}>
					<View style={styles.itemsMenuBackground}>
						<ListView contentContainerStyle={styles.itemsMenuListView}
							dataSource={filteredDataSource}
							renderRow={(item) => {
								return (

								<TouchableHighlight style={styles.itemButton} onPress={() => { goToInfoPage(item) }}>
									<Image style={styles.itemButtonImage} borderRadius={6} source={{uri: item.mainImageSrc}}>
										<LinearGradient 
											start={{x: 0.0, y: 0.0}} 
											end={{x: 0.0, y: 1.0}} 
											borderRadius={6} 
											colors={["transparent", "#000D"]} 
											locations={[-0.5,1.3]} 
											style={styles.linearGradient}
											>
											<View  style={styles.itemButtonView}>
												<Text style={styles.itemButtonText}>{item.name.toUpperCase()}</Text>
												<View style={styles.itemButtonSecondLineView}>
													<Text style={styles.itemButtonTypeText}>{item.itemType.toUpperCase()}</Text>
													<Text style={styles.itemButtonDistanceText}>{calculateItemDistance(this.state.lastPosition, item)}</Text>
												</View>
											</View>
										</LinearGradient>
									</Image>
								</TouchableHighlight>
								
								)
							}}>
						</ListView>
					</View>
				</Drawer>
				
			</View>
    )
  }
}

const drawerStyles = {
  drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3},
  main: {paddingLeft: 0},
}

const styles = StyleSheet.create({
	
	itemsMenuBackground:{
		flex: 1,
		alignSelf: 'stretch',
		flexDirection: 'column',
		backgroundColor: '#000',
	},
	itemsMenuListView:{
		justifyContent: 'center',
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginLeft: 2,
		marginRight: 2,
	},
	itemButton:{
		marginBottom: 4,
		marginTop: 4,
		alignSelf: 'stretch',
		height: 250,
		width: deviceWidth-10,
	},
	itemButtonImage: {
		justifyContent: 'flex-end',
		alignItems: 'center',
		flex: 1,
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
	},
	itemButtonView: {
		alignSelf: 'stretch',
		justifyContent: 'flex-end',
		alignItems: 'flex-start',
		flexDirection: 'column',
	},
	itemButtonText: {
		fontSize: 26,
		margin:10,
		marginBottom:28,
		color:'#EEE',
		fontFamily: 'Brandon_blk',
	},
	itemButtonSecondLineView: {
        flexDirection: 'row',
        alignSelf: 'flex-end'
	},
	itemButtonTypeText: {
		fontSize: 14,
		margin:5,
		color:'#EEE',
		fontFamily: 'OpenSans-Regular',
	},
	itemButtonDistanceText: {
		fontSize: 14,
		margin:5,
		color:'#EEE',
		fontFamily: 'OpenSans-Regular',
	},
	removeFiltersButton: {
		flexDirection:'row',
		borderColor: '#EEE',
		borderWidth: 2,	
		borderRadius: 3,
		marginRight:15,
	},
	removeFiltersButtonText: {
		fontSize: 15,
		margin:5,
		color:'#EEEEEE',
		fontFamily: 'Brandon_bld',
	},
	filterTitleText: {
		fontSize: 16,
		margin:5,
		marginTop:10,
		fontWeight:'bold',
		color:'#EEEEEE',
		fontFamily: 'Brandon_bld',
	},
	filterImage: {
		marginRight:10,
		width:25,
		height:25,
		alignSelf:'center',
	},	
	sortByView: {
		flexDirection:'row',
		borderColor: '#EEE',
		borderWidth: 2,	
		borderRadius: 3,
	},
	sortByMiddleLine: {
		width: 2,
		backgroundColor: '#EEE',
	},
	sortByButton: {
		flex:1,
		height:35,
		justifyContent:'center',
		alignItems:'center',
		flexDirection:'row',
	},
	sortByButtonView: {
		flexDirection:'column',
		alignItems:'center',
		alignSelf:'center',
	},
	sortByButtonText: {
		fontSize: 16,
		color:'#DDD',
		fontFamily: 'Brandon_bld',
	},
	filterButtonText: {
		fontSize: 16,
		margin:5,
		color:'#DDD',
		fontFamily: 'Brandon_bld',
	},
	filterListView:{
		flexDirection: 'column',
	},
	filterButton:{
		marginRight:30,
	},
	filterButtonView: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	filterCheckmarkImage:{
		width: 30,
		height: 30,
		alignSelf:'stretch',
		justifyContent: 'center',
		tintColor: '#EEE',
	}
});