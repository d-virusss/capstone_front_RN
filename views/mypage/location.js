import React, {Component} from 'react';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {StyleSheet, Dimensions, View} from 'react-native';

class MypageScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: 37.283056,
            longitude: 127.04366,
            latitudeDelta: 0.001,
            longitudeDelta: 0.01,
          }}>
          <Marker
            coordinate={{latitude: 37.283056, longitude: 127.04366}}
            title="this is a marker"
            description="this is a marker example"
          />
        </MapView>
      </View>
    );
  }
}
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
