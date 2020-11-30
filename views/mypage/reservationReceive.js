import AsyncStorage from '@react-native-community/async-storage';
import React, {Component} from 'react';
import {View, StyleSheet, Alert, DeviceEventEmitter, Dimensions} from 'react-native';
import {Text, Header, Thumbnail, FooterTab, Body, Container, 
  Content, ListItem, Spinner, Button, Footer, Badge, Right} from 'native-base';
import {Calendar, } from 'react-native-calendars'
import api from '../shared/server_address'
import moment from 'moment';
import IconM from 'react-native-vector-icons/Ionicons'
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
  };

  componentDidMount() {
    //init var
    reservation_info.item_id=''

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
        console.log(res)
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
      Alert.alert("요청 실패", err.response.data.error,[{text:'확인', style:'cancel'}])
    })
  }

  reject() {
    reservation_info.booking.acceptance='rejected'
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
      Alert.alert("요청 실패", err.response.data.error,[{text:'확인', style:'cancel'}])
    })
  }

  showOptionButton(){
    if(reservation_info.item_id){
      if(reservation_info.booking.acceptance === 'waiting'){
        return (
          <View style={styles.footer}>
            <Button transparent style={styles.bottomButtons}
              onPress={() => { this.accept() }}>
              <Text style={styles.footerText}>승인</Text>
            </Button>
            <Button transparent style={styles.bottomButtons}
              onPress={() => { this.reject() }}>
              <Text style={styles.footerText}>거절</Text>
            </Button>
          </View>
        )
      }
      else if(reservation_info.booking.acceptance === 'accepted'){
        return (
          <View style={styles.footer}>
            <Button transparent style={styles.bottomButtons}
              onPress={() => { this.props.navigation.navigate("Sign", 
              { booking_info: booking_info, who: 'provider' });
            }}>
              <Text style={styles.footerText}>서명하기</Text>
            </Button>
          </View>
        )
      }
      else if(reservation_info.booking.acceptance === 'rejected'){
        return (
          <View style={styles.disabledfooter}>
            <Button disabled transparent style={styles.bottomButtons} >
              <Text style={styles.footerText}>거절된 예약입니다.</Text>
            </Button>
          </View>
        )
      }
    }else{
      return null
    }
  }

  _onRefresh(){
    console.log('refresh screen --------------')
    this.setState({ refreshing : true })
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
  showBookingDate(id, post_id, startDate, endDate, acceptance, booking) {
    nextDay = [];

    const start = moment(startDate);
    const end = moment(endDate);

    for (let m = moment(start); m.diff(end, 'days') <= 0; m.add(1, 'days')) {
      nextDay.push(m.format('YYYY-MM-DD'));
    }
    booking_info = booking;

    reservation_info.item_id = id;
    reservation_info.booking.post_id = post_id;
    reservation_info.booking.acceptance = acceptance;
    this.markingDate();
  }

  makeList() {
    return reservation_list.map((ele) => {
      return (
        <ListItem key={ele.booking_info.id}
          button onPress={() => this.showBookingDate(ele.booking_info.id, ele.booking_info.post_id, 
          ele.booking_info.start_at, ele.booking_info.end_at, ele.booking_info.acceptance, ele.booking_info)}>
          <Thumbnail source={{ uri: ele.booking_info.post_image }} />
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
      );
    });
  }

  render(){
    if(this.state.loading) {
      return (
        <Container>
          <Header />
          <Content>
            <Spinner color='#ff3377' />
          </Content>
        </Container>
      )
    }
    else{
      return(
        <Container>
          <View>
            <Calendar
            markedDates={this.state.marked}
            markingType={'period'}
            />
          </View>
          <Content>
          {this.makeList()}
          </Content>
          {this.showOptionButton()}
        </Container>
        
      )
    } 
  };
};

let {height, width} = Dimensions.get('window');
const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    flex:0.1,
    left: 0,
    right: 0,
    top:height*0.75,
    backgroundColor:'#ff3377',
    flexDirection:'row',
    height:80,
    alignItems:'center',
    paddingTop: 7
  },
  bottomButtons: {
    alignItems:'center',
    justifyContent: 'center',
    flex:1,
  },
  footerText: {
    color:'white',
    fontWeight:'bold',
    alignItems:'center',
    fontSize:18,
  },
  disabledfooter: {
    position: 'absolute',
    flex: 0.1,
    left: 0,
    right: 0,
    top: height * 0.75,
    backgroundColor: '#dddddd',
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
  }
 });

export default receiveScreen;