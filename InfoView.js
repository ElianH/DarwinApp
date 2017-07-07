import React, { Component } from 'react';
import { Dimensions, Image, ListView, PixelRatio, StyleSheet, Text, View, StatusBar, Alert, TouchableHighlight, Linking, Animated, Easing, Share} from 'react-native';
import ViewPager from './ViewPager';
import { Actions } from 'react-native-router-flux';
import ParallaxScrollView from './ParallaxScrollView'
import NavBar from './NavBar'
import MapView from 'react-native-maps';

export default class InfoView extends Component {

	shareOnFacebook : Function;
	shareOnTwitter : Function;
	shareOnWhatsApp : Function;
	shareOnInstagram : Function;
	shareMore : Function;
	showShareResult : Function;
	
	state: any;

	constructor(props) {
		super(props);
				
		this.shareOnFacebook = this.shareOnFacebook.bind(this);
		this.shareOnTwitter = this.shareOnTwitter.bind(this);
		this.shareOnWhatsApp = this.shareOnWhatsApp.bind(this);
		this.shareOnInstagram = this.shareOnInstagram.bind(this);
		this.shareMore = this.shareMore.bind(this);
		this.showShareResult = this.showShareResult.bind(this);

		this.renderRow = this.renderRow.bind(this);
		this.animatedValue = new Animated.Value(0);
		this.state = { sharePanelVisible: false, result: '' };
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
		
		const selectedMarkerImageSource = require('./img/Icons/selected_marker_city2.png');
		const facebookIconImageSource = require('./img/Icons/facebook.png');
		const phoneIconImageSource = require('./img/Icons/phone.png');
		const webIconImageSource = require('./img/Icons/web.png');
		const emailIconImageSource = require('./img/Icons/email.png');
		const weatherIconImageSource = require('./img/Icons/weather.png');
		
		if ((row != null)&&(row.itemType != null)){
			switch (row.itemType.toUpperCase()) {
				case 'TITLE':
					return (
						<View style={styles.rowView}>
							<Text style={{flex:1, fontSize:18}}>{row.text}</Text>
						</View>
					);
				case 'LINE':
					return (
						<View style={{margin:10, height:2, backgroundColor:'#CCC'}}/>
					);
				case 'TEXT':
					return (
						<View style={styles.rowView}>
							<Text style={{flex:1, fontSize:16, fontFamily:'OpenSans-Regular'}}>{row.text}</Text>
						</View>
					);
				case 'BOLD_TEXT':
					return (
						<View style={styles.rowView}>
							<Text style={{flex:1, fontSize:16, fontFamily:'OpenSans-Bold'}}>{row.text}</Text>
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
						<TouchableHighlight style={styles.rowViewTouchable} onPress={() => { this.handleClick(row.number); }}>
							<View style={{flexDirection:'row'}}>
								<Image resizeMode='contain' style={{width: 25, height: 25, marginRight: 5}} source={phoneIconImageSource} />
								<Text style={styles.rowViewTouchableText}>{row.text}</Text>
							</View>
						</TouchableHighlight>
					);
				case 'WEBSITE':
					return (
						<TouchableHighlight style={styles.rowViewTouchable} onPress={() => { this.handleClick(row.url); }}>
							<View style={{flexDirection:'row'}}>
								<Image resizeMode='contain' style={{width: 25, height: 25, marginRight: 5}} source={webIconImageSource} />
								<Text style={styles.rowViewTouchableText}>{row.text}</Text>
							</View>
						</TouchableHighlight>
					);
				case 'EMAIL':
					return (
						<TouchableHighlight style={styles.rowViewTouchable} onPress={() => { this.handleClick(row.email); }}>
							<View style={{flexDirection:'row'}}>
								<Image resizeMode='contain' style={{width: 25, height: 25, marginRight: 5}} source={emailIconImageSource} />
								<Text style={styles.rowViewTouchableText}>{row.text}</Text>
							</View>
						</TouchableHighlight>
					);
				case 'WEATHER':
					return (
						<TouchableHighlight style={styles.rowViewTouchable} onPress={() => { this.handleClick(row.url); }}>
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
								region={{
									latitude: row.latitude,
									longitude: row.longitude,
									latitudeDelta: row.delta,
									longitudeDelta: row.delta,
								}}>
								<MapView.Marker
									image={selectedMarkerImageSource}
									style={{height:15, width:15}}
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
						<TouchableHighlight style={styles.rowViewTouchable} onPress={() => { this.handleClick(row.url); }}>
							<View style={{flexDirection:'row'}}>
								<Image style={{width: 25, height: 25, marginRight: 5}} source={facebookIconImageSource} />
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
						<TouchableHighlight style={styles.rowViewImageTouchable} onPress={() => { this.handleClick(row.url); }}>
							<View>
								<Image resizeMode='contain' style={{ marginTop: 3,  marginBottom: 3, width: window.width - 10, height: row.imageHeight}} source={{uri: row.imageSrc}} />
							</View>
						</TouchableHighlight>
					);
			}
		}
		return ( <View/> );
	}
	
	toggleSharePanel(){
		if (!this.sharePanelVisible){
			Animated.spring(
				this.animatedValue,
				{
				  toValue: 1,
				  friction: 5
				}
			).start();
			this.sharePanelVisible = true;
			Actions.refresh();
		}
		else {
			this.hideSharePanel();
		}
	}
	
	hideSharePanel(){
		if (this.sharePanelVisible){
			Animated.timing(
					this.animatedValue,
					{
					  toValue: 0,
						duration: 250,
						easing: Easing.inOut(Easing.ease),
						delay: 0,
					}
				).start();
				this.sharePanelVisible = false;
		}
	}

	shareOnFacebook() {
	}
	
	shareOnTwitter() {
	}
	
	shareOnInstagram() {
	}
	
	shareOnWhatsApp() {
		var urlEncodedString = encodeURIComponent(this.props.selectedItem.shareText);
		this.handleClick('whatsapp://send?text='+urlEncodedString);
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
	
	render() {
	  
		const { onScroll = () => { this.hideSharePanel(); } } = this.props;
		const twitterIconImageSource = require('./img/Icons/twitter.png');
		const facebookIconImageSource = require('./img/Icons/facebook.png');
		const whatsappIconImageSource = require('./img/Icons/whatsapp.png');
		const instagramIconImageSource = require('./img/Icons/instagram.png');
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
		const activityDetailsViewHeight = this.animatedValue.interpolate({
			inputRange: [0, 1],
			outputRange: [0, 100]
		});
		
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
					renderHeader={() => 
						<View style={{ backgroundColor:'#000', flexDirection:'column'}}>			
							<View style={{flexDirection:'row', justifyContent: 'space-between', marginLeft:25, marginRight:25, marginTop:8}}>
								<Text style={{ color:'#EEE', fontSize:29, fontFamily:'Brandon_blk', width:window.width-80}}>{this.props.selectedItem.name.toUpperCase()}</Text>
								<TouchableHighlight style={styles.openSharePanelButton} onPress={() => { this.toggleSharePanel(); }}>
									<Image style={styles.openSharePanelButtonImage} resizeMode='contain' source={shareButtonImage} />
								</TouchableHighlight>
							</View>
							<Text style={styles.headerShortDescription}>{this.props.selectedItem.shortDescription}</Text>
						</View>
					}

					renderScrollComponent={props => (
					  <ParallaxScrollView
						onScroll={onScroll}
						headerBackgroundColor="#333"
						fadeOutForeground={false}
						stickyHeaderHeight={ STICKY_HEADER_HEIGHT }
						parallaxHeaderHeight={ PARALLAX_HEADER_HEIGHT }
						backgroundSpeed={10}
						
						renderForeground={() => (
							<View key="background" style={{ width: window.width, height: PARALLAX_HEADER_HEIGHT}}>
								<ViewPager
									dataSource={cityImagesDataSource}
									renderPage={(cityImage) =>
										<View style={styles.cityBackgroundImageView}>
											<Image style={styles.cityBackgroundImage}
												source={{uri: cityImage.imageSrc}}>
											</Image>
										</View>
									}/>

							</View>
						)}

						renderStickyHeader={() => (
							<View style={{height:50, backgroundColor:'#000', alignSelf:'stretch', alignItems:'center', flexDirection:'row', justifyContent:'center'}}>
								<Text style={styles.navBarText}>{navBarText}</Text>
							</View>
						)}/>
					)}
				/>
				<View style={styles.navBarView}>
					<NavBar
						title='' 
						style={styles.navBar}
						backgroundColor='transparent'
						localizedStrings={this.props.localizedStrings}
						enableSearch={false}
						onMapButtonClick={goToGeneralMapPage}/>
				</View>
				{
					this.sharePanelVisible &&
					<Animated.View style={styles.sharePanelView}>
						<Animated.View style={{height: activityDetailsViewHeight, backgroundColor:'#000' }}>
							<View style={styles.sharePanelInnerView}>
								<TouchableHighlight style={styles.shareButton} onPress={this.shareOnTwitter}>
									<Image style={styles.shareButtonImage} resizeMode='contain' borderRadius={35} source={twitterIconImageSource} />
								</TouchableHighlight>
								<TouchableHighlight style={styles.shareButton} onPress={this.shareOnFacebook}>
									<Image style={styles.shareButtonImage} resizeMode='contain' borderRadius={35} source={facebookIconImageSource} />
								</TouchableHighlight>
								<TouchableHighlight style={styles.shareButton} onPress={this.shareOnWhatsApp}>
									<Image style={styles.shareButtonImage} resizeMode='contain' borderRadius={35} source={whatsappIconImageSource} />
								</TouchableHighlight>
								<TouchableHighlight style={styles.shareButton} onPress={this.shareOnInstagram}>
									<Image style={styles.shareButtonImage} resizeMode='contain' borderRadius={35} source={instagramIconImageSource} />
								</TouchableHighlight>
								<TouchableHighlight style={styles.shareButton} onPress={this.shareMore}>
									<Image style={[styles.shareButtonImage,{tintColor:'#EEE'}]} resizeMode='contain' borderRadius={35} source={shareMoreIconImageSource} />
								</TouchableHighlight>
							</View>
						</Animated.View>
					</Animated.View>
				}
			</View>
		);
	}
}

const window = Dimensions.get('window');
const AVATAR_SIZE = 120;
const ROW_HEIGHT = 60;
const PARALLAX_HEADER_HEIGHT = 350;
const STICKY_HEADER_HEIGHT = 50;

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
		flex: 1,
		flexDirection:'column',
	},
	cityBackgroundImage:{
		flex: 1,
	},
	container: {
		...StyleSheet.absoluteFillObject,
		position: 'absolute',
		top: 0,
		backgroundColor: 'black'
	},
	background: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: window.width,
		height: PARALLAX_HEADER_HEIGHT
	},
	stickySection: {
		height: STICKY_HEADER_HEIGHT,
		width: 300,
		justifyContent: 'flex-end'
	},
	stickySectionText: {
		color: 'white',
		fontSize: 20,
		margin: 10
	},
	fixedSection: {
		position: 'absolute',
		bottom: 10,
		right: 10
	},
	fixedSectionText: {
		color: '#999',
		fontSize: 20
	},
	parallaxHeader: {
		alignItems: 'center',
		flex: 1,
		flexDirection: 'column',
		paddingTop: 100
	},
	avatar: {
		marginBottom: 10,
		borderRadius: AVATAR_SIZE / 2
	},
	sectionSpeakerText: {
		color: 'white',
		fontSize: 24,
		paddingVertical: 5
	},
	sectionTitleText: {
		color: 'white',
		fontSize: 18,
		paddingVertical: 5
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
		marginTop: 10,
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
	shareButton:{
		width: 70,
		height: 70,
		borderRadius: 35,
	},
	shareButtonImage:{
		width: 60,
		height: 60,
	},
	sharePanelView:{
		...StyleSheet.absoluteFillObject,
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'flex-end',
		position: 'absolute',
		top:0
	},
	sharePanelInnerView:{
		flexDirection: 'row',
		margin: 15,
		justifyContent:'space-between',
		alignSelf: 'stretch',
	}
});