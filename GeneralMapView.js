import React, { Component } from 'react';
import { Text, View, Dimensions, TouchableHighlight, Alert, StyleSheet, ListView, Animated, Easing, ActivityIndicator } from 'react-native';
import { Image as Image1 } from 'react-native';
import { Actions } from 'react-native-router-flux';
import MapView from 'react-native-maps';
import LinearGradient from 'react-native-linear-gradient';
import NavBar from './NavBar';
import ViewPager from './ViewPager';
import Image from './ImageProgress';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;

export default class GeneralMapView extends Component {
	
	selectedMarker = null;
	distinctMarkerTypes = [];
	uniqueMarkerTypes = {};
	markers = [];
	
	constructor(props) {
		super(props);
				
		this.onRegionChange = this.onRegionChange.bind(this);
		this.showFooter = this.showFooter.bind(this);
		
		if (this.props.showNearMe){
			this.state = ({isMapLoading : true});
			navigator.geolocation.getCurrentPosition( 
				(position) => { 
					var initialPosition = JSON.stringify(position);
					const delta = 0.015;
					var latitudePos = position.coords.latitude-(delta/10);
					var longitudePos = position.coords.longitude;
					var latitudeDelta = delta;
					var longitudeDelta = delta * ASPECT_RATIO;
					this.setRegionState(latitudePos, longitudePos, latitudeDelta, longitudeDelta);
				}, 
				(error) => {
					Alert.alert('Error while getting position', error);
				},
				{
					enableHighAccuracy: false, 
					timeout: 5000, 
					maximumAge: 500000
				}
			);
		}
		else {
			// Zoom to show all visible Markers only
			var markers = this.props.markers;
			if (this.props.selectedType != null){
				markers = markers.slice().filter(marker => marker.typeName == this.props.selectedType);
			}
			
			var latitudesArray = markers.slice().map((marker)=>{ return marker.coordinate.latitude });
			var longitudesArray = markers.slice().map((marker)=>{ return marker.coordinate.longitude });
			
			var maxLatitude = Math.max.apply(Math, latitudesArray); 
			var maxLongitude = Math.max.apply(Math, longitudesArray);
			var minLatitude = Math.min.apply(Math, latitudesArray);
			var minLongitude = Math.min.apply(Math, longitudesArray);
			
			var midLatitude = (maxLatitude-minLatitude)/2.0;
			var midLongitude = (maxLongitude-minLongitude)/2.0;
			
			var latitudePos = minLatitude + midLatitude;
			var longitudePos = minLongitude + midLongitude;
			
			var delta = 6;
			var latitudeDelta = midLatitude * delta;
			var longitudeDelta = midLongitude * (delta * ASPECT_RATIO);
			
			if (markers.length == 1 && 
				markers[0].coordinate.delta != null && 
				markers[0].coordinate.delta != "" && 
				markers[0].coordinate.delta != "undefined"){
				
				latitudeDelta = markers[0].coordinate.delta;
				longitudeDelta = (markers[0].coordinate.delta * ASPECT_RATIO);
			}
			
			this.setRegionState(latitudePos, longitudePos, latitudeDelta, longitudeDelta);
		}
	}
	
	setRegionState(latitudePos, longitudePos, latitudeDelta, longitudeDelta){
		
		/*
		Alert.alert('pos', 
			'latitudePos: ' + latitudePos + 
			'  longitudePos: ' +  longitudePos + 
			'  latitudeDelta: ' + latitudeDelta + 
			'  longitudeDelta: ' + longitudeDelta);*/
		this.state = {
			region: {
				latitude: latitudePos,
				longitude: longitudePos,
				latitudeDelta: latitudeDelta,
				longitudeDelta: longitudeDelta,
			},
			coordinate: {
				latitude: latitudePos,
				longitude: longitudePos,
			},
			currentPage : 0,
			prevPage : 0,
			animatedCurrentPage : new Animated.Value(0),
			isMapLoading : false,
		};
		Actions.refresh();
	}

	onRegionChange(region) {	
		this.setState({ 
			region : region, 
			coordinate: {
				latitude: region.latitude,
				longitude: region.longitude,
			},
			selectedMarker : this.selectedMarker
		  });
	}
	
	showFooter(markers, marker) {
		if (this.selectedMarker == marker) return;
		var page = markers.indexOf(marker);
		this.selectedMarker = marker;
		this.setState({ selectedMarker : marker, currentPage : page}); 
		setTimeout(() => { this.viewpager.goToPage(page) },1);
	}
	
	onChangeFooterPage(markers, pageNumber){
		var marker = this.markers[pageNumber];
		var page = markers.indexOf(marker);
		this.selectedMarker = marker;
		this.state.selectedMarker = marker;
		this.state.animatedCurrentPage.setValue(pageNumber);
		this.setState({ selectedMarker : marker, currentPage : page}); 
	}
	
	isMarkerNearMe(marker){
		return marker.coordinate.latitude < this.state.region.latitude + this.state.region.latitudeDelta
				&& marker.coordinate.latitude > this.state.region.latitude - this.state.region.latitudeDelta
				&& marker.coordinate.longitude < this.state.region.longitude + this.state.region.longitudeDelta
				&& marker.coordinate.longitude > this.state.region.longitude - this.state.region.longitudeDelta;
	}

	render() {
		
		const navBarBackButtonImageSource = require('./img/Icons/arrow_back/android/drawable-xhdpi/ic_arrow_back_black_24dp.png');
		const markerImageSource = require('./img/Icons/marker_off_shadow-03.png');
		const selectedMarkerImageSource = require('./img/Icons/marker_on_shadow-03.png');
		var upperCaseDestinations = this.props.localizedStrings.destinations.toUpperCase();
		
		if ((this.selectedMarker == null)&&(this.props.markers != null)&&(this.props.markers.length > 0))
		{
			this.selectedMarker = this.props.markers[0];
			this.setState({ selectedMarker : this.selectedMarker });
		}
		
		// Get the list of distinct marker types for the filters		
		if (this.distinctMarkerTypes.length == 0){
			this.props.markers.slice().map((marker)=> {  
				var isEnabled = (this.props.selectedType == null) || (marker.typeName == this.props.selectedType);
				var type = { typeName:marker.typeName, imageSrc:marker.typeImageSrc, isEnabled: isEnabled };
				if( typeof(this.uniqueMarkerTypes[type.typeName]) == "undefined"){
					this.distinctMarkerTypes.push(type);
				}
				this.uniqueMarkerTypes[type.typeName] = type;
				return type;
			});
		}
		const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		var filteredMarkerTypesDataSource = ds.cloneWithRows(this.distinctMarkerTypes);
		
		// Markers for the map (filter disabled types)
		this.markers = this.props.markers.slice().filter((marker)=> { 
			if (!this.props.showNearMe){
				return this.uniqueMarkerTypes[marker.typeName].isEnabled; 
			}
			else if (!this.state.isMapLoading) {
				return this.uniqueMarkerTypes[marker.typeName].isEnabled && this.isMarkerNearMe(marker);	
			}
		});
		
		// Markers for view pager
		const vpds = new ViewPager.DataSource({pageHasChanged: (p1, p2) => p1 !== p2});
		var markersViewPagerDataSource = vpds.cloneWithPages(this.markers);

		return (
			<View style={{flex:1}}>
			
				{
					(this.state.isMapLoading) &&
					<View style={styles.mapLoadingView}>
						<ActivityIndicator style={styles.loading} size="large" color='#333' />	
					</View>
				}
				{
					(!this.state.isMapLoading) &&
					<MapView.Animated
						moveOnMarkerPress={false}
						style={styles.map}
						showsUserLocation={true}
						showsPointsOfInterest={false}
						showsBuildings={false}
						showsTraffic={false}
						region={this.state.region}
						customMapStyle={[ 
											{
												featureType: "poi",
												elementType: "labels",
												stylers: [{ 
													visibility: "off" 
												}]
											}
										]}
						onRegionChange={this.onRegionChange}>
							{this.markers.map(marker => {
								//Alert.alert('Page' + this.state.animatedCurrentPage);
								if (this.selectedMarker != null && this.selectedMarker == marker)
								{
									return (
										<MapView.Marker
											key={marker.mapKey}
											onPress={() => { this.showFooter(this.markers, marker); }}
											image={selectedMarkerImageSource}
											coordinate={marker.coordinate}>									
										</MapView.Marker>
										
									);
								}
								else
								{
									return (
										<MapView.Marker
											key={marker.mapKey}
											onPress={() => { this.showFooter(this.markers, marker); }}
											image={markerImageSource}
											coordinate={marker.coordinate}>									
										</MapView.Marker>
									);
								}
							}
							)}
					</MapView.Animated>
				}
				{
					(this.props.showFilters) &&
					<View style={styles.filterBackground}>
						<ListView 
							horizontal={true}
							dataSource={filteredMarkerTypesDataSource}
							renderRow={(markerType) => {
								
								return (
									<TouchableHighlight style={styles.filterButton} onPress={() => {  
											this.uniqueMarkerTypes[markerType.typeName].isEnabled = !this.uniqueMarkerTypes[markerType.typeName].isEnabled;
											Actions.refresh();
										}}>
										{
											(this.uniqueMarkerTypes[markerType.typeName].isEnabled &&
											<View style={{flexDirection: 'column'}}>
												<Image1 resizeMode='contain'
													style={[styles.filterButtonImage]}
													source={{ uri: markerType.imageSrc }}/>
												<View style={{backgroundColor:'#555', height:6, flexDirection:'row', justifyContent: 'space-between', borderRadius:3}}>
													<View style={{backgroundColor:'#555', height:6, width:10, borderRadius:3}}/>
													<View style={{backgroundColor:'#080', height:6, width:10, borderRadius:3}}/>
												</View>
											</View>)
											||	
											(!this.uniqueMarkerTypes[markerType.typeName].isEnabled &&
											<View style={{flexDirection: 'column'}}>
												<Image1 resizeMode='contain'
													style={[styles.filterButtonImage,{ tintColor:'#555'}]}
													source={{ uri: markerType.imageSrc }}/> 
												<View style={{backgroundColor:'#555', height:6, flexDirection:'row', justifyContent: 'space-between', borderRadius:3}}>
													<View style={{backgroundColor:'#800', height:6, width:10, borderRadius:3}}/>
													<View style={{backgroundColor:'#555', height:6, width:10, borderRadius:3}}/>
												</View>
											</View>)
										}
									</TouchableHighlight >
								)
							}}>
						</ListView>
					</View>
				}		
				{
					(!this.state.isMapLoading) && (this.selectedMarker != null) && (this.markers.length > 0) &&
					<View style={styles.footerViewPagerStyle}>
						<ViewPager 
							ref={(viewpager) => {this.viewpager = viewpager}}
							dataSource={markersViewPagerDataSource}
							animation={(animate, toValue, gs)=> {
										return Animated.timing(animate,
											{
												toValue: toValue,
												duration: 250,
												easing: Easing.inOut(Easing.ease),
												delay: 0,
											}
										)
									  }}
							onChangePage={(pageNumber) => this.onChangeFooterPage(this.markers, pageNumber)}
							renderPage={(selectedMarker) =>
								<TouchableHighlight activeOpacity={0.2} style={styles.footerBackground} onPress={() => { this.props.onMarkerClick(this.props.localizedStrings, selectedMarker); }}>
									<View style={styles.footerView}>
										{
											selectedMarker.mainImageSrc != null &&
											<Image style={styles.footerImage} source={{uri: selectedMarker.mainImageSrc}}>
												<LinearGradient start={{x: 0.0, y: 0.0}} end={{x: 0.0, y: 1.0}} colors={["transparent", "#000D"]} locations={[-0.5,1.3]} style={styles.linearGradient}>
												</LinearGradient>
											</Image>
										}
										<View style={styles.footerRightView}>
											<Text style={styles.footerTitleText}>{selectedMarker.name.toUpperCase()}</Text>
											<Text style={styles.footerShortDescriptionText}>{selectedMarker.shortDescription}</Text>
										</View>
									</View>
								</TouchableHighlight>
							}
							isLoop={false}
							autoPlay={false}
							/>
					</View>
				}
				
				<NavBar style={{height:50}} 
					title={upperCaseDestinations} 
					localizedStrings={this.props.localizedStrings}
					listItems={this.props.markers}
					enableSearch={false}
					onListButtonClick={this.props.onListButtonClick}
					onSearchChanged={(isSearching, text) => { 
						this.isSearching = isSearching;  
						this.text = text;
					}} />		
				
			</View>
		);
	}
}

const styles = StyleSheet.create({
	
	navBarStyle: {
		...StyleSheet.absoluteFillObject,
		zIndex: 10,
		position : 'absolute',
		top: 0,
		alignSelf:'stretch',
		height: 50, 
		backgroundColor:'#000',
		flexDirection: 'row',		
	},
	navBarBackButton: {
		width:50,
		height:50,
		flexDirection: 'column',
		justifyContent: 'center',
        alignItems: 'center',
	},
	navBarBackButtonImage: {
		width:25,
		height:25,
		alignSelf:'center',
	},	
	navBarText: {
		flex:1,
		fontSize: 18,
		marginLeft: 10,
		fontFamily: 'Roboto',
		color: '#EEE',
		justifyContent:'center',
		alignSelf:'center',
	},	
	map: {
		...StyleSheet.absoluteFillObject,
	},
	marker: {
		width:42,
		height:52,
	},
	footerViewPagerStyle: {
	   ...StyleSheet.absoluteFillObject,
	   justifyContent: 'flex-end',
	   flexDirection: 'column',
	   height: 180,
	   width: width,
	   top:height-200,
	   backgroundColor:'#000'
	},
	footerBackground: {
	   justifyContent: 'flex-end',
	   flexDirection: 'column',
	   height: 180,
	   width: width,
	},
	footerView: {
		flex:1,
		flexDirection:'row'
	},
	footerImage:{
		flex:1,
		marginBottom:25
	},
	footerRightView:{
		flex:1,
		margin:10,
		marginTop:0,
		flexDirection:'column',
		alignItems:'center',
		justifyContent: 'center',
		alignSelf: 'center',
	},
	footerTitleText: {
		fontSize: 22,
		fontFamily: 'Brandon_bld',
		fontWeight: 'bold',
		justifyContent: 'center',
		textAlign: 'center',
		color: '#EEE',
	},
	footerTypeText:{
		color: '#EEE',
	},
	footerShortDescriptionText:{
		color: '#EEE',
		textAlign: 'center',
	},
	filterBackground: {
		...StyleSheet.absoluteFillObject,
	   justifyContent: 'flex-end',
	   alignItems: 'center',
	   flexDirection: 'column',
	   height: 50,
	   top:50,
	   backgroundColor:'#000'
	},
	filterButton: {
		width:45,
		height:45,
		backgroundColor:'#444',
		borderRadius: 5,
		justifyContent: 'center',
		alignItems: 'center',
		margin:2,
	},
	filterButtonImage: {
		width:30,
		height:30,
	},
	linearGradient: {
        backgroundColor: "transparent",
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
	},
	mapLoadingView:{
		backgroundColor: '#F0EDE5',
		...StyleSheet.absoluteFillObject,
		alignItems:'center',
		justifyContent:'center',
	},
	loading:{
		alignSelf: 'stretch',
		height: 40,
		justifyContent: 'center',
	},
	
});