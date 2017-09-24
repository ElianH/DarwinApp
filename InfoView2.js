import React, { Component } from 'react';
import { Dimensions, ListView, PixelRatio, StyleSheet, Text, View, StatusBar, Alert, TouchableHighlight, Linking, Animated, Easing, Share} from 'react-native';
import ViewPager from './ViewPager';
import { Actions } from 'react-native-router-flux';
import NavBar from './NavBar';
import MapView from 'react-native-maps';
import Image from './ImageProgress';

export default class InfoView extends Component {

	shareMore : Function;
	showShareResult : Function;
	state: any;

	constructor(props) {
		super(props);

		this.shareMore = this.shareMore.bind(this);
		this.showShareResult = this.showShareResult.bind(this);
		this.onScroll = this.onScroll.bind(this);
		this.renderRow = this.renderRow.bind(this);
		this.animatedScrollValue = new Animated.Value(0);
		this.state = { result: '' };
	}

	handleClick = (url) => {
		Linking.canOpenURL(url).then(supported => {
			if (supported) {
				Linking.openURL(url);
			} else {
				console.log('Don\'t know how to open URI: ' + url);
			}
		});
	};

	renderRow(row) {

		const selectedMarkerImageSource = require('./img/Icons/marker/marker_on_shadow_01.png');
		const facebookIconImageSource = require('./img/Icons/facebook_black.png');
		const phoneIconImageSource = require('./img/Icons/phone.png');
		const webIconImageSource = require('./img/Icons/web.png');
		const emailIconImageSource = require('./img/Icons/email.png');
		const weatherIconImageSource = require('./img/Icons/weather.png');
		const instagramIconImageSource = require('./img/Icons/instagram_black.png');
		const whatsappIconImageSource = require('./img/Icons/whatsapp_black.png');

		// Can be ('auto', 'left', 'right', 'center', 'justify')
		var rowTextAlign = 'auto'
		if (row.textAlign != null)
			rowTextAlign = row.textAlign;

		if ((row != null)&&(row.itemType != null)){
			switch (row.itemType.toUpperCase()) {
				case 'TITLE':
					return (
						<View style={styles.rowView}>
							<Text style={{flex:1, fontSize:18, textAlign: rowTextAlign}}>{row.text}</Text>
						</View>
					);
				case 'LINE':
					return (
						<View style={{ backgroundColor:'#EEE' }}>
							<View style={{margin:10, height:2, backgroundColor:'#CCC'}}/>
						</View>
					);
				case 'TEXT':
					return (
						<View style={styles.rowView}>
							<Text style={{flex:1, fontSize:16, fontFamily:'OpenSans-Regular', textAlign: rowTextAlign}}>{row.text}</Text>
						</View>
					);
				case 'BOLD_TEXT':
					return (
						<View style={styles.rowView}>
							<Text style={{flex:1, fontSize:16, fontFamily:'OpenSans-Bold', textAlign: rowTextAlign}}>{row.text}</Text>
						</View>
					);
				case 'DOUBLE_COLUMN_TEXT':
					return (
						<View style={[styles.rowView, {justifyContent:'space-between', flexDirection:'row'}]}>
							<Text style={{fontSize:16, fontFamily:'OpenSans-Regular'}}>{row.textColumnLeft}</Text>
							<Text style={{fontSize:16, fontFamily:'OpenSans-Regular'}}>{row.textColumnRight}</Text>
						</View>
					);
				case 'PHONE':
					return (
						<TouchableHighlight underlayColor='#BBB' style={styles.rowViewTouchable} onPress={() => { this.handleClick(row.number); }}>
							<View style={{flexDirection:'row'}}>
								<Image resizeMode='contain' style={{width: 25, height: 25, marginRight: 5}} source={phoneIconImageSource} />
								<Text style={styles.rowViewTouchableText}>{row.text}</Text>
							</View>
						</TouchableHighlight>
					);
				case 'WEBSITE':
					return (
						<TouchableHighlight underlayColor='#BBB' style={styles.rowViewTouchable} onPress={() => { this.handleClick(row.url); }}>
							<View style={{flexDirection:'row'}}>
								<Image resizeMode='contain' style={{width: 25, height: 25, marginRight: 5}} source={webIconImageSource} />
								<Text style={styles.rowViewTouchableText}>{row.text}</Text>
							</View>
						</TouchableHighlight>
					);
				case 'EMAIL':
					return (
						<TouchableHighlight underlayColor='#BBB' style={styles.rowViewTouchable} onPress={() => { this.handleClick(row.email); }}>
							<View style={{flexDirection:'row'}}>
								<Image resizeMode='contain' style={{width: 25, height: 25, marginRight: 5}} source={emailIconImageSource} />
								<Text style={styles.rowViewTouchableText}>{row.text}</Text>
							</View>
						</TouchableHighlight>
					);
				case 'WEATHER':
					return (
						<TouchableHighlight underlayColor='#BBB' style={styles.rowViewTouchable} onPress={() => { this.handleClick(row.url); }}>
							<View style={{flexDirection:'row'}}>
								<Image resizeMode='contain' style={{width: 25, height: 25, marginRight: 5}} source={weatherIconImageSource} />
								<Text style={styles.rowViewTouchableText}>{row.text}</Text>
							</View>
						</TouchableHighlight>
					);
				case 'MAP':
					return (
						row.latitude != null && row.longitude != null && row.delta != null &&
						<View>
							<MapView
								style={styles.rowViewMap}
								cacheEnabled={true}
								zoomEnabled={false}
								rotateEnabled={false}
								scrollEnabled={false}
								pitchEnabled={false}
								showsPointsOfInterest={false}
								showsBuildings={false}
								showsTraffic={false}
								customMapStyle={[
											{
												featureType: "poi",
												elementType: "labels",
												stylers: [{
													visibility: "off"
												}]
											}
										]}
								region={{
									latitude: row.latitude,
									longitude: row.longitude,
									latitudeDelta: row.delta,
									longitudeDelta: row.delta,
								}}>
								<MapView.Marker
									image={selectedMarkerImageSource}
									style={{ height: 22, width: 22 }}
									centerOffset={{x: 0, y: -22}}
									coordinate={{ latitude: row.latitude, longitude: row.longitude }}/>
							</MapView>
						</View>
					);
				case 'SHARE':
					return (
						<View>
							<Text>SHARE Not supported yet</Text>
						</View>
					);
				case 'FACEBOOK_PAGE':
					return (
						<TouchableHighlight underlayColor='#BBB' style={styles.rowViewTouchable} onPress={() => { this.handleClick(row.url); }}>
							<View style={{flexDirection:'row'}}>
								<Image style={{width: 25, height: 25, marginRight: 5}} source={facebookIconImageSource} />
								<Text style={styles.rowViewTouchableText}>{row.text}</Text>
							</View>
						</TouchableHighlight>
					);
				case 'INSTAGRAM':
					return (
						<TouchableHighlight underlayColor='#BBB' style={styles.rowViewTouchable} onPress={() => { this.handleClick(row.url); }}>
							<View style={{flexDirection:'row'}}>
								<Image style={{width: 25, height: 25, marginRight: 5}} source={instagramIconImageSource} />
								<Text style={styles.rowViewTouchableText}>{row.text}</Text>
							</View>
						</TouchableHighlight>
					);
				case 'WHATSAPP':
					return (
						<TouchableHighlight underlayColor='#BBB' style={styles.rowViewTouchable} onPress={() => { this.handleClick(row.url); }}>
							<View style={{flexDirection:'row'}}>
								<Image style={{width: 25, height: 25, marginRight: 5}} source={whatsappIconImageSource} />
								<Text style={styles.rowViewTouchableText}>{row.text}</Text>
							</View>
						</TouchableHighlight>
					);
				case 'IMAGE':
					return (
						<View>
							<Image resizeMode='contain' style={{ marginTop: 3,  marginBottom: 3, width: window.width - 10, height: row.imageHeight}} source={{uri: row.imageSrc}} />
						</View>
					);
				case 'IMAGE_LINK':
					return (
						<TouchableHighlight underlayColor='#BBB' style={styles.rowViewImageTouchable} onPress={() => { this.handleClick(row.url); }}>
							<View>
								<Image resizeMode='contain' style={{ marginTop: 3,  marginBottom: 3, width: window.width - 10, height: row.imageHeight}} source={{uri: row.imageSrc}} />
							</View>
						</TouchableHighlight>
					);
				case 'SPACE':
					return (
						<View style={{ width: window.width - 10, height: row.height}} />
					);
			}
		}
		return ( <View/> );
	}

	shareMore() {
		Share.share({
			message: this.props.selectedItem.shareText,
			url: this.props.selectedItem.mainImageSrc,
			title: this.props.selectedItem.name
		}, {
			dialogTitle: this.props.localizedStrings.share,
			excludedActivityTypes: [],
			tintColor: 'green'
		})
		.then(this.showShareResult)
		.catch((error) => this.setState({result: 'error: ' + error.message}));
	}

	showShareResult(result) {
		if (result.action === Share.sharedAction) {
			if (result.activityType) {
				this.setState({result: 'shared with an activityType: ' + result.activityType});
			} else {
				this.setState({result: 'shared'});
			}
		} else if (result.action === Share.dismissedAction) {
			this.setState({result: 'dismissed'});
		}
	}

	onScroll(event) {
		var currentOffset = event.nativeEvent.contentOffset.y;
		this.animatedScrollValue.setValue(currentOffset);
	}

	render() {

		const shareMoreIconImageSource = require('./img/Icons/shareMore.png');

		// navigation
		const goToInfoPage = (item) => { Actions.infoPage({
			localizedStrings: this.props.localizedStrings,
			selectedItem: this.props.selectedItem});
		};
		const goToGeneralMapPage = () => { Actions.generalMapPage({
				localizedStrings: this.props.localizedStrings,
				markers: [ this.props.selectedItem ],
				showFilters: false,
				onMarkerClick: (localizedStrings,item)=>goToInfoPage(item)
			});
		};

		// city images (for view pager)
		const vpds = new ViewPager.DataSource({pageHasChanged: (p1, p2) => p1 !== p2});
		var otherImages = [];
		if (this.props.selectedItem.otherImages != null){
			otherImages = this.props.selectedItem.otherImages;
		}
		var cityImagesDataSource = vpds.cloneWithPages(otherImages);

		// info items
		const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		var infoItems = [];
		if (this.props.selectedItem.infoItems != null){
			infoItems = this.props.selectedItem.infoItems;
		}
		var infoItemsDataSource = ds.cloneWithRows(infoItems);

		// share panel animated value
		shareButtonImage = require('./img/Icons/share.png');

		const stickyHeaderOpacity = this.animatedScrollValue.interpolate({
			inputRange: [PARALLAX_HEADER_HEIGHT-50, PARALLAX_HEADER_HEIGHT+50],
			outputRange: [0, 1]
		})

		const parallaxHeaderMarginBottom =  this.animatedScrollValue.interpolate({
			inputRange: [0, PARALLAX_HEADER_HEIGHT],
			outputRange: [0, PARALLAX_HEADER_HEIGHT/3]
		})

		// nav bar header text
		const maxTitleLength = 25;
		var navBarText = this.props.selectedItem.name.toUpperCase();
		if (navBarText.length > maxTitleLength){
			navBarText = navBarText.substring(0, maxTitleLength-1) + "...";
		}

		return (
			<View style={{flex:1, flexDirection:'column'}}>

				<StatusBar hidden={false} backgroundColor='#000' />

				<ListView
					ref="ListView"
					style={styles.container}
					dataSource={ infoItemsDataSource }
					renderRow={this.renderRow}
					initialListSize={300}
					removeClippedSubviews={false}
					onScroll={this.onScroll}
					bounces="false"
					renderHeader={() =>
						<View style={{ flexDirection:'column'}}>
							<View style={{width: window.width, height: PARALLAX_HEADER_HEIGHT }}>
								<ViewPager
									isLoop={true}
									dataSource={cityImagesDataSource}
									renderPage={(cityImage) =>
										<Animated.View style={{backgroundColor:'#000', marginTop: parallaxHeaderMarginBottom }}>
											<View style={styles.cityBackgroundImageView}>
												<Image style={{ width: window.width, height: PARALLAX_HEADER_HEIGHT}}
													source={{uri: cityImage.imageSrc}}>
												</Image>
											</View>
										</Animated.View>
									}/>
							</View>
							<View style={{backgroundColor: '#000', flexDirection:'column'}}>
								<View style={{ flexDirection:'row', justifyContent: 'space-between', marginLeft:25, marginRight:25, marginTop:8}}>
									<Text style={{ color:'#EEE', fontSize:29, fontFamily:'Brandon_blk', width:window.width-80}}>{this.props.selectedItem.name.toUpperCase()}</Text>
									{/* Not used yet, commenting it out for now. 
									<TouchableHighlight style={styles.openSharePanelButton} onPress={this.shareMore}>
										<Image style={styles.openSharePanelButtonImage} resizeMode='contain' source={shareButtonImage} />
									</TouchableHighlight> */}
								</View>
								<Text style={styles.headerShortDescription}>{this.props.selectedItem.shortDescription}</Text>
							</View>
						</View>
					}
				/>

				<Animated.View style={{height:50,
									backgroundColor:'#000',
									alignSelf:'stretch',
									alignItems:'center',
									flexDirection:'row',
									justifyContent:'center',
									...StyleSheet.absoluteFillObject,
									position: 'absolute',
									top: 0,
									opacity: stickyHeaderOpacity}}>
					<Text style={styles.navBarText}>{navBarText}</Text>
				</Animated.View>

				<View style={styles.navBarView}>
					<NavBar
						title=''
						style={styles.navBar}
						backgroundColor='transparent'
						localizedStrings={this.props.localizedStrings}
						enableSearch={false}
						onMapButtonClick={goToGeneralMapPage}/>
				</View>

			</View>
		);
	}
}

const window = Dimensions.get('window');
const ROW_HEIGHT = 60;
const PARALLAX_HEADER_HEIGHT = 350;

const styles = StyleSheet.create({

	navBarView: {
		...StyleSheet.absoluteFillObject,
		position: 'absolute',
		top: 0,
		height: 50,
	},
	navBar: {
		width: window.width,
	},
	navBarText: {
		fontSize: 15,
		fontFamily: 'Brandon_bld',
		color: '#EEE',
		justifyContent:'center',
		alignSelf:'center',
	},
	cityBackgroundImageView: {
		flexDirection:'column',
	},
	container: {
		...StyleSheet.absoluteFillObject,
		position: 'absolute',
		backgroundColor: '#EEE',
		top: 0
	},
	row: {
		overflow: 'hidden',
		paddingHorizontal: 10,
		height: ROW_HEIGHT,
		backgroundColor: 'white',
		borderColor: '#ccc',
		borderBottomWidth: 1,
		justifyContent: 'center'
	},
	rowText: {
		fontSize: 20
	},
	rowView: {
		backgroundColor: '#EEE',
		paddingTop: 10,
		paddingLeft: 25,
		paddingRight: 25,
	},
	rowViewTouchable: {
		marginTop: 2,
		padding:5,
		marginBottom: 2,
		marginLeft: 15,
		marginRight: 15,
		backgroundColor: '#DDD',
	},
	rowViewTouchableText: {
		fontSize: 18,
		marginRight: 10,
		fontFamily: 'OpenSans-Regular',
		color: '#888'
	},
	rowViewImageTouchable: {
		marginTop: 2,
		padding:5,
		marginBottom: 2,
		marginLeft: 15,
		marginRight: 15,
	},
	rowViewMap: {
		height:200,
		margin: 15,
		opacity: 0.8,
	},
	headerShortDescription:{
		color:'#888',
		fontSize:16,
		fontFamily:'OpenSans-Regular',
		marginTop:-3,
		marginLeft:26,
		marginRight:26,
		marginBottom:12,
	},
	openSharePanelButton:{
		width:30,
		marginTop:5
	},
	openSharePanelButtonImage:{
		width: 30,
		height: 30,
		tintColor: '#EEE',
	},
});
