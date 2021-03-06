import AsyncStorage from '@react-native-community/async-storage';
import React, {Component} from 'react';
import {View, StyleSheet, Alert, DeviceEventEmitter, ScrollView} from 'react-native';
import {Text, Thumbnail, List, Body, Content, ListItem, Button, Footer, Badge, Right} from 'native-base';
import {Calendar, } from 'react-native-calendars'
import Spinner from 'react-native-loading-spinner-overlay';
import api from '../shared/server_address'
import moment from 'moment';
import IconM from 'react-native-vector-icons/Ionicons'
import { TouchableOpacity } from 'react-native-gesture-handler';
IconM.loadFont()

var reservation_list = [];
var nextDay =[];
var reservation_info = {
  item_id : '',
  booking: {
    post_id: '',
    acceptance: '',
  },
  refreshing : false
};
var booking_info = {};

class receiveScreen extends Component{

  state = {
    marked: null,
    token: 0,
    loading: true,
    refreshing: '',
    focused : false,
  };

  componentDidMount() {
    //have to init 
    this.state.focused = false

    this.getToken();
    this.eventListener = DeviceEventEmitter.addListener('refreshList', this.handleEvent);
  }

  componentWillUnmount(){
    //remove listener
    this.eventListener.remove();
}

  handleEvent = (e) => {
    console.log("event handler")
    this.setState({refreshing : true})
    this.getReservationList();
    this.setState({refreshing : false})
  }

  getToken = async () => {
    let value = await AsyncStorage.getItem("token")
    this.state.token = value
    this.getReservationList()
  }

  getReservationList () {
    api.get('/bookings?received=true&status=before', {
        headers: {Authorization: this.state.token},
    }).then((res) => {
        reservation_list = res.data;
        this.setState({loading: false});
    }).catch((err) => {
        console.log("reservation page err")
        console.log(err)
        Alert.alert("요청 실패", err.response.data.error,[{text:'확인', style:'cancel'}])
    })
  }

  markingDate() {
    var obj = nextDay.reduce((c, v) => Object.assign(c, {[v]: {selected: true, color: '#ff3377', startingDay: true, endingDay: true}}), {});
    this.setState({ marked : obj});
  }

  accept (){
    console.log("승인 request ---------")
    this.setState({ loading: true })
    reservation_info.booking.acceptance='accepted'
    api.put(`/bookings/${reservation_info.item_id}/accept`, reservation_info, {
      headers: {
        Authorization: this.state.token,
      },
    }).then((res) => {
      console.log(res)
      Alert.alert("예약 승인", "예약을 승인하였습니다.", [
        { text: '확인', style: 'cancel', onPress: () => { this._onRefresh() } }
      ])
    }).catch((err) => {
      console.log(err)
      Alert.alert("요청 실패", err.response.data.error,[{text:'확인', style:'cancel',
        onPress: () => {this.setState({ loading: false })} }])
    })
  }

  reject() {
    console.log("거절 request ---------")
    this.setState({ loading: true })
    reservation_info.booking.acceptance ='rejected'
    api.put(`/bookings/${reservation_info.item_id}/accept`, reservation_info, {
      headers: {
        Authorization: this.state.token,
      },
    }).then((res) => {
      console.log(res)
      Alert.alert("예약 거절", "예약을 거절하였습니다.",[
        {text:'확인', style:'cancel', onPress: () => { this._onRefresh()  }}
      ])
    }).catch((err) => {
      Alert.alert("요청 실패", err.response.data.error,[{text:'확인', style:'cancel',
        onPress: () => this.setState({ loading: false }) }])
    })
  }

  getUserInfo = () => {
    this.setState({ loading: true })
    api.get(`/users/mypage`, {
      headers: {
        Authorization: this.state.token,
      },
    })
      .then((res) => {
        console.log("reservationReceive ---- getUserInfo")
        console.log(res)
        if(res.data.user_info.name === "" ||
          res.data.user_info.birthday === "" ||
          res.data.user_info.number === ""){
          Alert.alert("정보 누락", "본인 프로필에 실명, 전화번호, 생년월일이 있어야 인증이 가능합니다.", [{ text: '확인', style: 'cancel',
            onPress: () => { this.setState({ loading: false }) }
        }])
          console.log("본인 프로필에 정보 없음 못가")
          return
        }
        else if(booking_info.consumer.name == "" ||
          booking_info.provider.name == ""){
          Alert.alert("정보 누락", "상대 프로필에 실명이 있어야 계약서가 작성됩니다.", [{ text: '확인', style: 'cancel',
            onPress: () => { this.setState({ loading: false }) }
        }])
          console.log('상대 프로필에 실명 없어서 계약서 작성 불가')
          return
        }
        else{
          this.props.navigation.navigate("Sign", { booking_info: booking_info, who: 'provider' });
        }
          

        this.setState({ loading: false })
      })
      .catch((err) => {
        console.log("catch error")
        console.log(err.response)
        Alert.alert("요청 실패", err.response.data.error, [{ text: '확인', style: 'cancel' }])
      })
  }

  showOptionButton(){
    if(this.state.focused == true){
      console.log(booking_info)
      if(reservation_info.booking.acceptance === 'waiting'){
        return (
          <Footer style = {styles.footer}>
            <Button transparent style={styles.acceptButton}
              onPress={() => { this.accept() }}>
              <Text style={styles.footerText}>승인</Text>
            </Button>
            <Button transparent style={styles.rejectButton}
              onPress={() => { this.reject() }}>
              <Text style={styles.footerText}>거절</Text>
            </Button>
          </Footer>
        )
      }
      else if(reservation_info.booking.acceptance === 'accepted'){
        return (
          <Footer style={styles.footer}>
            <Button transparent style={styles.bottomButtons}
              onPress={() => { this.getUserInfo() }}>
              <Text style={styles.footerText}>서명하기</Text>
            </Button>
          </Footer>
        )
      }
      else if(reservation_info.booking.acceptance === 'rejected'){
        return (
          <Footer style={styles.disabledfooter}>
            <Button disabled transparent style={styles.bottomButtons} >
              <Text style={styles.footerText}>거절된 예약입니다.</Text>
            </Button>
          </Footer>
        )
      }
    }else{
      return null
    }
  }

  _onRefresh(){
    console.log('refresh screen --------------')
    this.setState({ refreshing : true, loading: false })
    this.getReservationList()
    this.setState({ refreshing : false })
  }

  setBadgeColor(result) {
    if (result === "대기 중") {
      return 'black'
    }
    else if (result === '승인') {
      return '#29850b'
    }
    else if (result === '거절') {
      return '#a1282c'
    }
  }
  
  showBookingDate(info) {
    nextDay = [];
    const start = moment(info.start_at);
    const end = moment(info.end_at);

    for (let m = moment(start); m.diff(end, 'days') <= 0; m.add(1, 'days')) {
      nextDay.push(m.format('YYYY-MM-DD'));
    }
    booking_info = info;

    this.setState({focused: true});
    reservation_info.item_id = info.id;
    reservation_info.booking.post_id = info.post_id;
    reservation_info.booking.acceptance = info.acceptance;
    this.markingDate();
  }

  makeList() {
    return reservation_list.map((ele) => {
      //console.log(ele)
      return (
        <TouchableOpacity onPress={() => this.showBookingDate(ele.booking_info)}>
          <ListItem key={ele.booking_info.id}>
            <Thumbnail source={ele.booking_info.post_image=='/image/default.png' ? require('../../assets/default.png') : { uri: ele.booking_info.post_image }} />
            <Body>
              <Text>{ele.booking_info.title}</Text>
              <View style={{ flexDirection: 'row' }}>
                <Text note numberOfLines={1} style={{ paddingTop : '2%' }}>{ele.booking_info.consumer.nickname}</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text note numberOfLines={1} style={{ paddingTop: '2%' }}>{ele.booking_info.price.toLocaleString() + '원 ('}{ele.booking_info.lent_day + "일)"}</Text>
              </View>
            </Body>
            <Right>
              <Badge style={{ backgroundColor : this.setBadgeColor(ele.booking_info.result) }}>
                <Text numberOfLines={1} style={{ fontWeight: 'bold' }} >
                  {ele.booking_info.result}
                </Text>
              </Badge>
            </Right>
          </ListItem>
        </TouchableOpacity>
      );
    });
  }

  render(){
    if(this.state.focused == false){
      return(
        <View style={styles.container}>
          <ScrollView style={{flex: 1}}>
              <Calendar
              markedDates={this.state.marked}
              markingType={'period'}
              />
            <Spinner visible={this.state.loading} color="#ff3377"/>
            <Content>
              <List>{this.makeList()}</List>
            </Content>
          </ScrollView>
        </View>
        
      )
    }else{ //when item focused
      console.log("focused")
      return(
        <View style={styles.container}>
          <ScrollView style={{flex: 1}}>
              <Calendar
              markedDates={this.state.marked}
              markingType={'period'}
              />
            <Spinner visible={this.state.loading} color="#ff3377"/>
            <Content>
              <List>{this.makeList()}</List>
            </Content>
          </ScrollView>
          <View style = {styles.footer_area}>
          {this.showOptionButton()}
          </View>
        </View>
        
      )
    }
  }
};

const styles = StyleSheet.create({
  container : {
    width : '100%',
  },
  footer_area : {
    height : '10%'
  },
  footer: {
    backgroundColor: '#ff3377',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    flexDirection: 'row',
  },
  bottomButtons: {
    marginTop: '2%',
    width: '100%',
    justifyContent: 'center',
  },
  footerText: {
    color:'white',
    fontWeight:'bold',
    fontSize: 20,
  },
  disabledfooter: {
    backgroundColor: '#999999',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    flexDirection: 'row',
  },
  acceptButton: {
    marginTop: '2%',
    width: '50%',
    justifyContent: 'center',
  },
  rejectButton: {
    marginTop: '2%',
    width: '50%',
    justifyContent: 'center',
  }
 });

export default receiveScreen;