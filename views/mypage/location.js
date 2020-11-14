import axios from 'axios' // for kakao
import React, {Component} from 'react';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {StyleSheet, Dimensions, View, Platform, TouchableOpacity,} from 'react-native';
import {Button, Container, Content, Left, Right, Header, Body, Title, Icon, Spinner} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from 'react-native-geolocation-service';
import {Text} from 'native-base';
import api from '../shared/server_address'
import IconM from 'react-native-vector-icons/Ionicons'
import symbolicateStackTrace from 'react-native/Libraries/Core/Devtools/symbolicateStackTrace';
IconM.loadFont()

const kakaoApi = axios.create({baseURL: 'https://dapi.kakao.com/v2/local/'});

var myLocation = ''
var token_value = '';
var user_addr = {
  location: {
    title: '',
  },
};

class MypageScreen extends Component{
  constructor() {
    super();
    this.state = {
      location:'',
      title:'',
      loading: true,
    };
  }

  requestPermission = async() => {
    try {
      if (Platform.OS === 'ios') {
        return await Geolocation.requestAuthorization('always');
      }
    } catch (e) {
      console.log('request Permission error');
      console.log(e);
    }
  }
  
 getToken = async() =>  {
    token_value = await AsyncStorage.getItem('token');
    myLocation = await AsyncStorage.getItem('myLocation');
  }
  
  requestKakao = async(coords) => {
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
        user_addr.location.title =
          response.data.documents[0].address.region_3depth_name;
        console.log(user_addr.location.title)
        this.setState({title : user_addr.location.title});
        this.setState({loading: false})
      }.bind(this))
      .catch(function (error) {
        console.log('failed: ' + error);
      });
  }
  
  putRequest = async() =>  {
    console.log('call put request');
    
    this.getToken().then(() => {
      api
        .put('/locations/certificate', user_addr, {
          headers: {
            Authorization: token_value,
          },
        })
        .then(() => {
          console.log('put request success');
          alert("현재 내 위치는 '" + user_addr.location.title + "'입니다.")
          AsyncStorage.setItem('myLocation', user_addr.location.title);
          if(myLocation == null){
            this.props.navigation.navigate('postIndex')
          }else{
            this.props.navigation.navigate('MyPage')
          }
        })
        .catch((err) => {
          console.log('put request fail');
          console.log(err);
        });
    });
  }

  componentDidMount () {
    this.requestPermission().then((res) => {
      if (res === 'granted') {
        Geolocation.getCurrentPosition(
          (pos) => {
            console.log('move current pos');
            this.setState({location : pos.coords});
            this.requestKakao(pos.coords);
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
          this.setState({location:pos.coords});
        });
      }
    });
  }

  render(){
    if (this.state.loading == true) {
      return (
        <Container>
          <Header />
          <Content>
            <Spinner color='#ff3377' />
          </Content>
        </Container>
      );
    } //else
    return (
      <Container>
        <Header>
            <Left>
              <TouchableOpacity transparent onPress = {() => this.props.navigation.goBack()}>
                <Icon name = 'chevron-back' type = 'Ionicons'/>
              </TouchableOpacity>
            </Left>
            <Body><Title>동네 설정</Title></Body>
            <Right></Right>
          </Header>
        <Content>
        <View style={{alignItems:'center', flexDirection:'row'}}>
        <Button transparent style={styles.bottomButtons}>
          <Text>현재 위치는 "{user_addr.location.title}" 입니다.</Text>
        </Button>
        </View>
        <View style={styles.container}>
          <MapView
            ref={(map) => {this.map = map}}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            showsUserLocation={true}
            followsUserLocation={true}
            initialRegion={{
              latitude: this.state.location.latitude,
              longitude: this.state.location.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}>
            <Marker
              coordinate={{
                latitude: this.state.location.latitude,
                longitude: this.state.location.longitude,
              }}
              title="this is a marker"
            />
          </MapView>
        </View>
        <Button style={styles.footer} onPress={() => {this.putRequest();}}>
          <Text style={{textAlign:'center'}}>현재 위치에서 동네 인증하기</Text>
        </Button>
        </Content>
      </Container>
    )
  }
}

let {height, width} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    zIndex: 0,
    top: 2,
    height: height*0.7,
    width: width,
  },
  footer: {
    flex:1,
    zIndex: 3,
    backgroundColor:'#ff3377',
    height:50,
    width: width,
    alignItems:'center',
    justifyContent: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bottomButtons: {
    alignItems:'center',
    justifyContent: 'center',
    flex:1,
  },
});

export default MypageScreen;
