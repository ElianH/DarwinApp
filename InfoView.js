import React, { Component } from 'react';
import { Dimensions, Image, ListView, PixelRatio, StyleSheet, Text, View, StatusBar, Alert, TouchableHighlight, Linking, Animated, Easing, Share} from 'react-native';
import ViewPager from 'react-native-viewpager';
import { Actions } from 'react-native-router-flux';
import ParallaxScrollView from './ParallaxScrollView'
import NavBar from './NavBar'
import MapView from 'react-native-maps';

export default class InfoView extends Component {

	_shareMessage: Function;
	_shareText: Function;
	_showResult: Function;
	state: any;

	constructor(props) {
		super(props);
				
		this._shareMessage = this._shareMessage.bind(this);
		this._shareText = this._shareText.bind(this);
		this._showResult = this._showResult.bind(this);

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
							<View>
								<Text style={styles.rowViewTouchableText}>{row.text}</Text>
							</View>
						</TouchableHighlight>
					);
				case 'WEBSITE':
					return (
						<TouchableHighlight style={styles.rowViewTouchable} onPress={() => { this.handleClick(row.url); }}>
							<View>
								<Text style={styles.rowViewTouchableText}>{row.text}</Text>
							</View>
						</TouchableHighlight>
					);
				case 'EMAIL':
					return (
						<TouchableHighlight style={styles.rowViewTouchable} onPress={() => { this.handleClick(row.email); }}>
							<View>
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
				case 'DEALS':
					return (
						<View>
							<Text>DEALS Not supported yet</Text>
						</View>
					);
				case 'BOOKING':
					return (
						<View>
							<Text>BOOKING Not supported yet</Text>
						</View>
					);
				case 'SPACE':
					return (
						<View style={{height:100}}>
						</View>
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

	_shareMessage() {
		Share.share({
			message: 'React Native | A framework for building native apps using React'
		})
		.then(this._showResult)
		.catch((error) => this.setState({result: 'error: ' + error.message}));
	}

	_shareText() {
		const instagramIconImageSource = require('./img/Icons/instagram.png');
		
		Share.share({
			message: 'A framework for building native apps using React https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Norskfolkemuseum_1.jpg/640px-Norskfolkemuseum_1.jpg',
			url: instagramIconImageSource,
			title: 'React Native'
		}, {
			dialogTitle: 'Share React Native website',
			excludedActivityTypes: [
				'com.apple.UIKit.activity.PostToTwitter'
			],
			tintColor: 'green'
		})
		.then(this._showResult)
		.catch((error) => this.setState({result: 'error: ' + error.message}));
	}

	_showResult(result) {
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
	
/*
class ShareMessageExample extends React.Component {
  
  render() {
    return (
      <View>
        <TouchableHighlight style={styles.wrapper}
          onPress={this._shareMessage}>
          <View style={styles.button}>
            <Text>Click to share message</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight style={styles.wrapper}
          onPress={this._shareText}>
          <View style={styles.button}>
            <Text>Click to share message, URL and title</Text>
          </View>
        </TouchableHighlight>
        <Text>{this.state.result}</Text>
      </View>
    );
  }
}
	*/
	
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
					<View style={{ backgroundColor:'#000', flexDirection:'column', justifyContent: 'space-between', padding:15}}>			
						<Text style={{ color:'#F4F4F4', fontSize:27, fontFamily:'Brandon_blk'}}>{this.props.selectedItem.name.toUpperCase()}</Text>
						<View style={{flexDirection:'row', justifyContent: 'space-between'}}>
							<Text style={{ color:'#888', fontSize:16, fontFamily:'OpenSans-Regular'}}>{this.props.selectedItem.shortDescription}</Text>
							<TouchableHighlight style={styles.openSharePanelButton} onPress={() => { this.toggleSharePanel(); }}>
								<Image style={styles.openSharePanelButtonImage} resizeMode='contain' source={shareButtonImage} />
							</TouchableHighlight>
						</View>
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
							<TouchableHighlight style={styles.shareButton} onPress={this._shareText}>
								<Image style={styles.shareButtonImage} resizeMode='contain' borderRadius={35} source={twitterIconImageSource} />
							</TouchableHighlight>
							<TouchableHighlight style={styles.shareButton} onPress={() => { this.handleClick('whatsapp://send?text=Hello%20World!'); }}>
								<Image style={styles.shareButtonImage} resizeMode='contain' borderRadius={35} source={facebookIconImageSource} />
							</TouchableHighlight>
							<TouchableHighlight style={styles.shareButton} onPress={() => { Alert.alert('WhatsApp'); }}>
								<Image style={styles.shareButtonImage} resizeMode='contain' borderRadius={35} source={whatsappIconImageSource} />
							</TouchableHighlight>
							<TouchableHighlight style={styles.shareButton} onPress={() => { Alert.alert('Instagram'); }}>
								<Image style={styles.shareButtonImage} resizeMode='contain' borderRadius={35} source={instagramIconImageSource} />
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
		paddingLeft: 15,
		paddingRight: 15,
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
	rowViewMap: {
		height:200,
		margin: 15,
		opacity: 0.8,
	},
	openSharePanelButton:{
		margin:2,
		alignSelf:'flex-end',
	},
	openSharePanelButtonImage:{
		width: 30,
		height: 30,
		tintColor: '#F4F4F4', 
	},
	shareButton:{
		width: 70,
		height: 70,
		borderRadius: 35,
	},
	shareButtonImage:{
		width: 70,
		height: 70,
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