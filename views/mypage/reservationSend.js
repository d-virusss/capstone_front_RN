import AsyncStorage from '@react-native-community/async-storage';
import React, {Component} from 'react';
import {Dimensions, View, StyleSheet, Alert} from 'react-native';
import {Text, Header, Thumbnail, Icon, Body, Container, Content, ListItem, Spinner, Button, Left, 
  Right, Title,} from 'native-base';
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
};

class sendScreen extends Component{
  state = {
    marked: null,
    token: 0,
    loading: true,
    refreshing: '',
  };

  componentDidMount() {
    this.getToken();
  }

  getToken = async () => {
    let value = await AsyncStorage.getItem("token")
    this.state.token = value
    this.getSendReservationList()
  }

  showBookingDate(id, post_id, startDate, endDate) {
    nextDay = [];
    const start = moment(startDate);
    const end = moment(endDate);
    for (let m = moment(start); m.diff(end, 'days') <= 0; m.add(1, 'days')) {
      nextDay.push(m.format('YYYY-MM-DD'));
    }
    reservation_info.item_id = id;
    reservation_info.booking.post_id = post_id;
    this.markingDate();
  }

  getSendReservationList() {
    api.get('/bookings', {
      headers: {Authorization: this.state.token},
  }).then((res) => {
      reservation_list = res.data;
      this.setState({loading: false});
  }).catch((err) => {
      console.log("reservation page err")
      console.log(err)
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
      console.log("승인되었습니다.")
      console.log(res)
      Alert.alert("승인되었습니다", "",[{text:'확인', style:'cancel'}])
      this.props.navigation.navigate("Contract");
    }).catch((err) => {
      console.log(err)
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
      Alert.alert("거절되었습니다", "",[{text:'확인', style:'cancel'}])
    }).catch((err) => {
      console.log(err)
    })
  }

  showOptionButton(){
    if(reservation_info.item_id){
      return(
        <View style={styles.footer}>
          <Button transparent style={styles.bottomButtons}
           onPress={() => {this.accept()}}>
            <Text style = {styles.footerText}>승인</Text>
          </Button>
          <Button transparent style={styles.bottomButtons}
          onPress= {() => {this.reject()}}>
            <Text style = {styles.footerText}>거절</Text>
          </Button>
        </View>
      )
    }else{
      return null
    }
  }

  makeList() {
    return reservation_list.map((ele) => {
      console.log(ele)
      return (
        <ListItem key={ele.booking_info.id}
          button onPress={() => this.showBookingDate(ele.booking_info.id, ele.booking_info.post_id, ele.booking_info.start_at, ele.booking_info.end_at)}>
          <Thumbnail source={{ uri: ele.booking_info.image }} />
          <Body>
            <Text>{ele.booking_info.title}</Text>
            <Text note numberOfLines={1}>
              {ele.booking_info.result}
            </Text>
          </Body>
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
          <Content style={styles.container}>
          <Calendar 
          markedDates={this.state.marked}
          markingType={'period'}
          />
          </Content>
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
    container: {
        height: height*0.65,
        width: width,
      },

  footer: {
    position: 'absolute',
    flex:0.1,
    left: 0,
    right: 0,
    bottom: -5,
    backgroundColor:'#ff3377',
    flexDirection:'row',
    height:80,
    alignItems:'center',
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
 });

export default sendScreen;