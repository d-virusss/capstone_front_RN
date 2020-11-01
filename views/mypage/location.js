import React, {useState, useEffect} from 'react';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {StyleSheet, Dimensions, View, Platform} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Geolocation from 'react-native-geolocation-service';
import {Text} from 'native-base';

async function requestPermission() {
  try {
    if (Platform.OS === 'ios') {
      return await Geolocation.requestAuthorization('always');
    }
  } catch (e) {
    console.log('request Permission error');
    console.log(e);
  }
}

const MypageScreen = () => {
  const [location, setLocation] = useState();

  useEffect(() => {
    requestPermission().then((res) => {
      if (res === 'granted') {
        Geolocation.getCurrentPosition(
          (pos) => {
            console.log('move current pos');
            setLocation(pos.coords);
            console.log(pos);
          },
          (err) => {
            console.log('fail to move current pos');
            console.log(err);
          },
          {
            enableHighAccuraacy: true,
            timeout: 3600,
            maximunAge: 3600,
          },
        );
      }
    });
  }, []);

  if (!location) {
    return (
      <View>
        <Text>read Location...</Text>
      </View>
    );
  } //else
  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}>
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="this is a marker"
          description="this is a marker example"
        />
      </MapView>
    </View>
  );
};

let {height, width} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    height: height,
    width: width,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
export default MypageScreen;
