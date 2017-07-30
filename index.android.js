import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { Router, Scene, ActionConst, Modal } from 'react-native-router-flux';

import LogoView from './LogoView';
import CitiesView from './CitiesView';
import CityView from './CityView';
import CityMenuView from './CityMenuView';
import GeneralMapView from './GeneralMapView';
import InfoView from './InfoView2';
import DealsView from './DealsView';
import PlanYourTripView from './PlanYourTripView';
import ConfigView from './ConfigView';
import StatusModal from './StatusModal';

export default class DarwinApp extends Component {
  render() {
    return (
		<Router style={{backgroundColor:'#000'}} >
			<Scene style={{backgroundColor:'#000'}} hideNavBar={true} key="modal" component={Modal}>
				<Scene style={{backgroundColor:'#000'}} key="root" hideNavBar={true}>
					<Scene key="logoPage" component={LogoView} title="Logo" hideNavBar={true} initial={true} />
					<Scene key="configPage" component={ConfigView} title="Config" hideNavBar={true} />
					<Scene key="citiesPage" component={CitiesView} hideNavBar={true} title="Cities" type={ActionConst.RESET} />
					<Scene key="cityPage" component={CityView} hideNavBar={true} title="City" />
					<Scene key="cityMenuPage" component={CityMenuView} hideNavBar={true} title="City Menu" />
					<Scene key="generalMapPage" component={GeneralMapView} hideNavBar={true} title="Map" />
					<Scene key="infoPage" component={InfoView} hideNavBar={true} title="Info" />
					<Scene key="dealsPage" component={DealsView} hideNavBar={true} title="Deals" />
					<Scene key="planYourTripPage" component={PlanYourTripView} hideNavBar={true} title="PlanYourTrip" />
					<Scene key="weatherPage" component={InfoView} hideNavBar={true} title="Weather" />
				</Scene>
				<Scene key="statusModal" component={StatusModal} hideNavBar={true} />
			</Scene>
		</Router>
    );
  }
}

AppRegistry.registerComponent('DarwinApp', () => DarwinApp);
