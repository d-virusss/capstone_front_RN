import axios from 'axios' // for kakao
import React, {Component} from 'react';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {StyleSheet, Dimensions, View, Platform, TouchableOpacity, Alert} from 'react-native';
import {Button, Container, Content, Left, Right, Header, Body, Title, Icon, Spinner} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from 'react-native-geolocation-service';
import {Text} from 'native-base';
import api from '../shared/server_address'
import IconM from 'react-native-vector-icons/Ionicons'
import Slider from '@react-native-community/slider'
import symbolicateStackTrace from 'react-native/Libraries/Core/Devtools/symbolicateStackTrace';
import { CommonActions } from '@react-navigation/native';

IconM.loadFont()

const kakaoApi = axios.create({baseURL: 'https://dapi.kakao.com/v2/local/'});

var locationList = []
var myLocation = ''
var token_value = '';
var user_addr = {
  location: {
    title: '',
    range: '',
  },
};

// const resetAction = StackActions.reset({
//   index : 0,
//   actions: [NavigationActions.navigate({routeName: 'Mypage',})]
// });

class MypageScreen extends Component{
  constructor(props) {
    super(props);
    this.state = {
      location:'',
      title:'',
      loading: true,
      value:0,
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
    myLocation = await AsyncStorage.getItem('my_location');
    console.log("gettoken")
    console.log(myLocation)
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
        console.log(response)
        user_addr.location.title =
          response.data.documents[0].address.region_3depth_name;
        this.getNearLocation();
        this.state.title = user_addr.location.title;
      }.bind(this))
      .catch(function (error) {
        console.log('failed: ' + error);
        Alert.alert("지역 인증 실패", "법정동을 읽어올 수 없습니다",[
          {text:'확인', style:'cancel', onPress: ()=> { this.props.navigation.navigate("MyPage") } }])
      }.bind(this));
  }
  
  getNearLocation() {
    this.getToken().then(() => {
      api.get('/locations/display', {
        params: {
          title: user_addr.location.title
        },
        headers: {
          Authorization: token_value,
        }
      }).then((res) => {
        locationList = res.data.location_info.range;
        this.state.value = res.data.location_info.user_range;
        this.setState({loading: false})
      }).catch((err) => {
        console.log(err)
        Alert.alert("요청 실패", err.response.data.error,[{text:'확인', style:'cancel'}])
      })
    })
  }

  putRequest = async() =>  {  
    user_addr.location.range = this.state.value;
    console.log("puterquest")
    api
      .put('/locations/certificate', user_addr, {
        headers: {
          Authorization: token_value,
        },
      })
      .then(() => {
        Alert.alert("동네 인증 완료", "동네 인증이 완료되었습니다.",[{text:'확인', style:'cancel'}])
        console.log("-------------------------")
        console.log("myLocation is")
        console.log(myLocation == "null")
        AsyncStorage.setItem('my_location', user_addr.location.title);
        if(myLocation == "null"){
          this.props.navigation.navigate('postIndex')
        }else{
          this.props.navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [{ name: 'MyPage' },],
            })
          );
        }
      })
      .catch((err) => {
        console.log(err);
        Alert.alert("동네 인증 실패", err.response.data.error,[{text:'확인', style:'cancel'}])
      });

  }

  componentDidMount () {
    console.log('component did mount ---------')
    console.log(this)
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

  showNearLocation(value) {
    this.setState({value : value})
  }

  showNearLocationList(){
    this.props.navigation.navigate('LocationDetail', 
    { list: locationList[this.state.value].title, num : locationList[this.state.value].count })
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
        <View style={{alignItems:'center', textAlign:'center'}}>
        <Text/>
        <Title>현재 위치는 "{user_addr.location.title}" 입니다.</Title>
        <Text/>
        <Text onPress={() => this.showNearLocationList()} style={{textDecorationLine: 'underline'}}>근처 동네 {locationList[this.state.value].count}개</Text>
        <Slider
          style={styles.slider}
          onValueChange={(value)=>{this.showNearLocation(value)}}
          minimumValue={0} //0:alone, 1: near, 2: normal, 3: far
          maximumValue={3}
          minimumTrackTintColor="#ff3377"
          maximumTrackTintColor="#f4c2c2"
          step={1}
          value = {this.state.value}
        />
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
    height: height*0.65,
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
  slider: {
    alignItems:'center',
    justifyContent: 'center',
    flex:1,
    width: 200, 
    height: 40,
  }
});

export default MypageScreen;
