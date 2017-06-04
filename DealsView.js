import React, { Component } from 'react';
import { Text, TouchableHighlight, View, StyleSheet, ListView, Image} from 'react-native';
import { Actions } from 'react-native-router-flux';
import NavBar from './NavBar';
import { calculateItemDistance } from './DistanceView';

export default class CityMenuView extends Component {
	
	text = '';
	isSearching = false;
	
	state = { 
		lastPosition: '-'
	};
	
	constructor(props) {
		super(props);
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
  
	render() {
	  
		// navigation
		const goToInfoPage = (item) => { Actions.infoPage({
			localizedStrings: this.props.localizedStrings, 
			selectedItem: item}); 
		};  
		const goToGeneralMapPage = () => { Actions.generalMapPage({
				localizedStrings: this.props.localizedStrings, 
				markers: this.props.items,
				showFilters: true,
				onMarkerClick: (localizedStrings, item)=>goToInfoPage(item)
			}); 
		};
	  
		// filtered results
		var filterText = this.text.toLowerCase();
		const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		var newFilter = this.props.items.slice().filter((item)=> { return (filterText === '' || item.name.toLowerCase().indexOf(filterText) !== -1) });
		var filteredDataSource = ds.cloneWithRows(newFilter);
		
		// nav bar title
		var navBarTitle = this.props.localizedStrings.deals.toUpperCase();

		return (
			<View style={{flex:1,alignSelf:'stretch'}}>
				<NavBar style={{height:50}} 
					title={navBarTitle} 
					localizedStrings={this.props.localizedStrings} 
					enableSearch={true}
					onSearchChanged={(isSearching, text) => { 
						this.isSearching = isSearching;  
						this.text = text;
					}}
					onMapButtonClick={goToGeneralMapPage}
				/>
				<View style={styles.itemsMenuBackground}>
					<ListView contentContainerStyle={styles.itemsMenuListView}
						dataSource={filteredDataSource}
						renderRow={(item) => {
							return (
							<TouchableHighlight style={styles.itemButton} underlayColor="#E83D0133" onPress={() => { goToInfoPage(item) }}>
								<Image style={styles.itemButtonImage} source={{ uri: item.mainImageSrc }}>																
									<View style={styles.itemButtonView}>
										<View style={styles.itemButtonSecondLineView}>
											<Text style={styles.itemButtonTypeText}>{item.name}</Text>
											<Image resizeMode='contain' style={styles.itemButtonTypeImage} source={{ uri: item.menuImageSrc }}></Image>
										</View>
										<Text style={styles.itemButtonTypeText}>{item.dealsText}</Text>
										<View style={styles.itemButtonSecondLineView}>
											<Text style={styles.itemButtonTypeText}>{item.itemType.toUpperCase()}</Text>
											<Text style={styles.itemButtonDistanceText}>{calculateItemDistance(this.state.lastPosition, item)}</Text>
										</View>
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
	
	itemsMenuBackground:{
		flex: 1,
		backgroundColor: '#000',
		alignSelf: 'stretch',
		flexDirection: 'column',
	},
	itemsMenuListView:{
		justifyContent: 'center',
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	itemButton:{
		width: 150,
		height: 170,
		backgroundColor:'#232323',
		alignSelf:'stretch',
		alignItems:'center',
		flexDirection:'row',
		justifyContent: 'center',
		flex:1,
		margin:1,
	},
	itemButtonImage: {
		width: 150,
		height: 170,
		backgroundColor:'#232323',
		justifyContent: 'flex-end',
		alignSelf:'stretch',
		alignItems:'flex-end',
		flexDirection:'column',
		flex:1,
		margin:1,
	},
	itemButtonTypeImage: {
		width: 30,
		height: 30,
		margin: 5,
	},
	itemButtonView: {
		alignSelf: 'stretch',
		backgroundColor: '#222222BB',
		flexDirection:'column',
	},
	itemButtonText: {
		fontSize: 20,
		margin:5,
		color:'#EEEEEE',
		fontFamily:'OpenSans-Regular',
	},
	itemButtonSecondLineView: {
		flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
	},
	itemButtonTypeText: {
		fontSize: 12,
		margin:5,
		color:'#EEEEEE',
		fontFamily:'OpenSans-Regular',
	},
	itemButtonDistanceText: {
		fontSize: 14,
		margin:5,
		color:'#EEEEEE',
		fontFamily:'OpenSans-Regular',
	},
});