import AsyncStorage from '@react-native-community/async-storage';
import React, {Component} from 'react';
import {View, StyleSheet, Alert, DeviceEventEmitter, Dimensions, ScrollView} from 'react-native';
import {Text, Header, Thumbnail, Body, Container, Content, ListItem, Button, Right, Footer, FooterTab, Badge, List} from 'native-base';
import {Calendar, } from 'react-native-calendars'
import api from '../shared/server_address'
import moment from 'moment';
import IconM from 'react-native-vector-icons/Ionicons'
import { TouchableOpacity } from 'react-native-gesture-handler';
import Spinner from 'react-native-loading-spinner-overlay';
import { registerVersion } from 'firebase';
IconM.loadFont()

var reservation_list = [];
var nextDay =[];
var reservation_info = {
  item_id : '',
  booking: {
    post_id: '',
    acceptance: null,
  },
};
var booking_data;
class receiveScreen extends Component{
  state = {
    marked: null,
    token: 0,
    loading: true,
    refreshing: '',
  };

  componentDidMount() {
    reservation_info.item_id = '' //init
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

  showBookingDate(info) {
    nextDay = [];
    booking_data = info; //for sign

    const start = moment(info.start_at);
    const end = moment(info.end_at);
    
    for (let m = moment(start); m.diff(end, 'days') <= 0; m.add(1, 'days')) {
      nextDay.push(m.format('YYYY-MM-DD'));
    }
    reservation_info.item_id = info.id;
    reservation_info.booking.post_id = info.post_id;
    if(info.acceptance === "accepted"){
      reservation_info.booking.acceptance = true
    }
    else reservation_info.booking.acceptance = false

    this.markingDate();
  }

  getReservationList () {
    api.get('/bookings?status=before', {
        headers: {Authorization: this.state.token},
    }).then((res) => {
        reservation_list = res.data;
        console.log(res)
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

  showOptionButton(){
    console.log('showoption button ---------- ')
    console.log(reservation_info)
    if(reservation_info.item_id){
      if(reservation_info.booking.acceptance){
        return(
          <Footer style = {styles.footer}>
            <Button transparent style = {styles.footerbutton}
              onPress={() => { this.props.navigation.navigate("Sign", 
              { booking_info: booking_data, who: 'consumer' });
            }}>
              <Text style={styles.footerText}>서명하기</Text>
           </Button>
         </Footer>
         
        )
      }
      else if(reservation_info.booking.acceptance === false){
        return(
          <Footer style = {styles.disabledfooter}>
            <Button transparent style = {styles.footerbutton} >
              <Text style={styles.footerText}>서명하기</Text>
            </Button>
         </Footer>
        )
      }
    }
    else{
      return null
    }
  }

  setBadgeColor(result){
    if(result === "대기 중"){
      return 'black'
    }
    else if(result === '승인'){
      return 'green'
    }
    else if(result === '거절'){
      return '#a1282c'
    }
  }

  makeList() {
    return reservation_list.map((ele) => {
      console.log(ele)
      return (
        <TouchableOpacity onPress={() => this.showBookingDate(ele.booking_info)}>
          <ListItem key={ele.booking_info.id}>
            <Thumbnail source={{ uri: ele.booking_info.post_image }} />
            <Body>
              <Text>{ele.booking_info.title}</Text>
              <View style={{ flexDirection: 'row' }}>
                <Text note numberOfLines={1} style={{ paddingTop : '2%' }}>
                  {ele.booking_info.result}
                </Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
              <Text note numberOfLines={1} style={{ paddingTop: '2%' }}>{ele.booking_info.price.toLocaleString() + '원 ('}{ele.booking_info.lent_day + "일)"}</Text>
              </View>
            </Body>
            <Right>
              <Badge style={{ backgroundColor : this.setBadgeColor(ele.booking_info.result) }}>{/* 승인 success, 대기 회색, 거절 진홍색 */}
                <Text style={{ fontWeight: 'bold' }}>{ele.booking_info.result}</Text>
              </Badge>
            </Right>
          </ListItem>
        </TouchableOpacity>
      );
    });
  }

  render(){
    if(this.state.loading) {
      return (
        <Container>
          <Header />
          <Content>
          <Spinner visible={this.state.loading} color="#ff3377" />
          </Content>
        </Container>
      )
    }
    else{
      return(
        <View style={styles.container}>
          <ScrollView style={{flex: 1}}>
            <Calendar
            markedDates={this.state.marked}
            markingType={'period'}
            />
            <Content>
              <List>{this.makeList()}</List>
            </Content>
          </ScrollView>
          {this.showOptionButton()}
        </View>
      )
    } 
  };
};

let {height, width} = Dimensions.get('window');
const styles = StyleSheet.create({
  container:{
    width : width,
  },
  footer: {
    backgroundColor: '#ff3377',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    height: '6%',
    flexDirection: 'row',
  },
  footerbutton: {
    marginTop: '2%',
    width: '100%',
    justifyContent: 'center',
  },
  footerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  disabledfooter: {
    backgroundColor: '#dddddd',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    height: '6%',
    flexDirection: 'row',
  }
 });

export default receiveScreen;