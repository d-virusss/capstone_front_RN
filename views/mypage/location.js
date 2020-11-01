import axios from 'axios';
import React, {useState, useEffect} from 'react';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {StyleSheet, Dimensions, View, Platform} from 'react-native';
import {Button} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from 'react-native-geolocation-service';
import {Text} from 'native-base';
const kakaoApi = axios.create({baseURL: 'https://dapi.kakao.com/v2/local/'});
const api = axios.create({baseURL: 'http://3.35.9.144'});
var token_value = '';
var my_coords = '';
var user_addr = {
  location: {
    title: '',
  },
};

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

async function getToken() {
  token_value = await AsyncStorage.getItem('token');
}

async function requestKakao(coords) {
  kakaoApi
    .get('geo/coord2address.json', {
      params: {
        x: coords.longitude,
        y: coords.latitude,
      },
      headers: {
        Authorization: 'KakaoAK ecce46f96915fbabc5b95a19f9a64ea7',
      },
    })
    .then(function (response) {
      console.log('kakao request success!!');
      putRequest(response.data.documents[0].address.region_3depth_name);
      user_addr.location.title =
        response.data.documents[0].address.region_3depth_name;
    })
    .catch(function (error) {
      console.log('failed: ' + error);
    });
}

async function putRequest(addr) {
  console.log('call put request');
  getToken().then(() => {
    api
      .put('/locations/certificate', user_addr, {
        headers: {
          Authorization: token_value,
        },
      })
      .then(() => {
        console.log('put request success');
      })
      .catch((err) => {
        console.log('put request fail');
        console.log(err);
      });
  });
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
            my_coords = pos.coords;
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
        Geolocation.watchPosition((pos) => {
          console.log('watching current pos');
          setLocation(pos.coords);
        });
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
    <View>
      <Button
        block
        info
        onPress={() => {
          requestKakao(my_coords);
        }}>
        <Text>현재 위치에서 동네 인증하기</Text>
      </Button>
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          showsUserLocation={true}
          followsUserLocation={true}
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
    </View>
  );
};

let {height, width} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    zIndex: 0,
    top: 2,
    height: height,
    width: width,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
export default MypageScreen;
