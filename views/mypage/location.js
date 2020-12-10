import axios from 'axios' // for kakao
import React, {Component} from 'react';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {StyleSheet, Dimensions, View, Platform, TouchableOpacity, Alert, DeviceEventEmitter} from 'react-native';
import {Button, Container, Content, Left, Right, Header, Body, Title, Icon, FooterTab, Footer} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from 'react-native-geolocation-service';
import {Text} from 'native-base';
import api from '../shared/server_address'
import IconM from 'react-native-vector-icons/Ionicons'
import Slider from '@react-native-community/slider'
import Spinner from 'react-native-loading-spinner-overlay';
import KAKAO_API_KEY from '../../key'

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

var bodyContent = ["내 동네만", "옆 동네도", "먼 동네도", "모두"]

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
  }
  
  requestKakao = async(coords) => {
    kakaoApi
      .get('geo/coord2address.json', {
        params: {
          x: coords.longitude,
          y: coords.latitude,
        },
        headers: {
          Authorization: `KakaoAK ${KAKAO_API_KEY}`,
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
          {text:'확인', style:'cancel', onPress: ()=> { this.props.navigation.navigate("Main") } }])
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
    console.log("puterquest-------------------------")
    api.put('/locations/certificate', user_addr, {
        headers: {
          Authorization: token_value,
        },
      })
      .then(() => {
        Alert.alert("동네 인증 완료", "동네 인증이 완료되었습니다.",[{text:'확인', style:'cancel'}])
        DeviceEventEmitter.emit('updateMypage', {location : user_addr.location.title});
 
        AsyncStorage.setItem('my_location', user_addr.location.title);
        if(myLocation == "null"){ // first location auth
          this.props.navigation.push('Main')
        }else{ //already has location
          this.props.navigation.goBack();
        }
      })
      .catch((err) => {
        console.log(err);
        Alert.alert("동네 인증 실패", err.response.data.error,[{text:'확인', style:'cancel'}])
      });

  }

  componentDidMount () {
    this.requestPermission().then((res) => {
      console.log("checking permission..............")
      console.log(res)
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
      }else{
        Alert.alert("요청 실패", "위치 접근 권한이 없습니다.",[
          {
              text: '확인',
              onPress: () => this.props.navigation.goBack()
          },
          {
              text: '취소',
              style: 'cancel',
              onPress: () => this.props.navigation.goBack()
          }
      ]) 
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

  /*
  renderHeader(){
    if(myLocation == "null"){
      return(
        <Header style={{
          height: 60,
          backgroundColor: '#f8f8f8',
          justifyContent:'space-between'}}
          androidStatusBarColor='#000'
        >
          <Left>
          </Left>
          <Body><Title style={{color:'black',alignSelf:'center'}}>동네 인증</Title></Body>
          <Right></Right>
        </Header>
      )
    }else{ // already has location
      return(
        <Header style={{
          height: 60,
          backgroundColor: '#f8f8f8',
          justifyContent:'space-between'}}
          androidStatusBarColor='#000'
        >
          <Left>
            <TouchableOpacity transparent onPress = {() => this.props.navigation.goBack()}>
            <Icon name = 'chevron-back' type = 'Ionicons'/>
            </TouchableOpacity>
          </Left>
          <Body><Title style={{color:'black',alignItems:'center'}}>동네 인증</Title></Body>
          <Right></Right>
        </Header>
      )
    }
  }
*/
  render(){
    console.log("enter location setting")
    if (this.state.loading == true) {
      return (
        <Container>
          <Header />
          <Content>
            <Spinner visible={this.state.loading} color="#ff3377" />
          </Content>
        </Container>
      );
    } //else
    return (
      <Container>
         <Header style={{
          height: 60,
          backgroundColor: '#f8f8f8',
          justifyContent:'space-between'}}
          androidStatusBarColor='#000'
        >
          <Left>
            <TouchableOpacity transparent onPress = {() => this.props.navigation.goBack()}>
            <Icon name = 'chevron-back' type = 'Ionicons'/>
            </TouchableOpacity>
          </Left>
          <Body><Title style={{color:'black',alignItems:'center'}}>동네 인증</Title></Body>
          <Right></Right>
        </Header>

        <Content scrollEnabled={false}>
          <View style={{alignItems:'center', textAlign:'center'}}>
            <Text/>
            <Title style={{color:'black',alignSelf:'center'}}>현재 위치는 "{user_addr.location.title}" 입니다.</Title>
            <Text/>
            <Text onPress={() => this.showNearLocationList()} style={{textDecorationLine: 'underline'}}>
              {bodyContent[this.state.value]} {locationList[this.state.value].count}개</Text>
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
      </Content>

       <View style = {styles.footer}>
         <Button transparent style = {styles.footerbutton} onPress={() => {this.putRequest();}}>
            <Text style={styles.footerText}>현재 위치에서 동네 인증하기</Text>
          </Button>
        </View>
        
      </Container>
    )
  }
}

let {height, width} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    top: 2,
    height: height*0.7,
    width: width,
  },
  footer: {
    backgroundColor: '#ff3377',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '9%',
    position: 'absolute',
    bottom: -5,
  },
  footerbutton: {
    alignSelf: 'center',
    padding: 4,
    marginBottom: '3%',
    height: 80,
    width: '100%',
    justifyContent: 'center',
  },
  footerText: {
    color:'white',
    fontWeight:'bold',
    fontSize: 20,
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
