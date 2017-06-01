
function calculateItemDistance(position, item){	
	if ((position != null)&&(position.coords != null)){
		var newDistance = calculateItemDistanceNumber(position, item);
		newDistance = formatDistanceString(newDistance)
		return newDistance + ' km';
	}	
	return '?';
}

function calculateItemDistanceNumber(position, item){	
	if ((position != null)&&(position.coords != null)){
		var myLat = position.coords.latitude;
		var myLong = position.coords.longitude;
		
		var newDistance = kmDistanceBetweenPoints(
			myLat,
			myLong,
			item.coordinate.latitude,
			item.coordinate.longitude);

		return newDistance;
	}	
	return null;
}

function formatDistanceString(distanceStr){	
	if (distanceStr > 100){
		distanceStr = distanceStr.toFixed(0);
	}
	else if (distanceStr > 1){
		distanceStr = distanceStr.toFixed(1);
	}
	else {
		distanceStr = distanceStr.toFixed(2);
	}
	return distanceStr;
}

function kmDistanceBetweenPoints(lat_a, lng_a, lat_b, lng_b) {
	var pk = 180.0 / Math.PI;
	var a1 = lat_a / pk;
	var a2 = lng_a / pk;
	var b1 = lat_b / pk;
	var b2 = lng_b / pk;
	var t1 = Math.cos(a1)*Math.cos(a2)*Math.cos(b1)*Math.cos(b2);
	var t2 = Math.cos(a1)*Math.sin(a2)*Math.cos(b1)*Math.sin(b2);
	var t3 = Math.sin(a1)*Math.sin(b1);
	var tt = Math.acos(t1 + t2 + t3);
	return 6366*tt;
}

module.exports = { calculateItemDistance, calculateItemDistanceNumber }
	

// Another version
/*
getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
	var R = 6371; // Radius of the earth in km
	var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
	var dLon = this.deg2rad(lon2-lon1); 
	var a = 
		Math.sin(dLat/2) * Math.sin(dLat/2) +
			Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
			Math.sin(dLon/2) * Math.sin(dLon/2); 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c; // Distance in km
	return d;
};

deg2rad(deg) {
	return deg * (Math.PI/180)
};*/

	
