import AsyncStorage from '@react-native-community/async-storage';
import React, {Component} from 'react';
import {TouchableOpacity, View, StyleSheet, TouchableHighlight} from 'react-native';
import {Text, Header, Thumbnail,Body,Right,Container, Content, ListItem, Spinner, Button, Toast} from 'native-base';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars'
import api from '../shared/server_address'
import moment from 'moment';
import _ from 'lodash';

var reservation_list = [];
var nextDay =[];

class reservationScreen extends Component{
  //params = this.props.route.params;
  state = {
    marked: null,
    token: 0,
    loading: true,
    showToast: false,
  };
  makeList() {
    return reservation_list.map((ele) => {
      console.log(ele)
      return (
        <ListItem button onPress = {() => this.showBookingDate(ele.booking_info.id, ele.booking_info.start_at, ele.booking_info.end_at)}>
           <Thumbnail source={{uri: ele.booking_info.image}} />
          <Body>
            <Text>{ele.booking_info.title}</Text>
            <Text note numberOfLines={1}>
              {ele.booking_info.acceptance}
            </Text>
          </Body>
        </ListItem>
      );
    });
  }

  showBookingDate(id, startDate, endDate) {
    nextDay = [];
    const start = moment(startDate);
    const end = moment(endDate);
    for (let m = moment(start); m.diff(end, 'days') <= 0; m.add(1, 'days')) {
      nextDay.push(m.format('YYYY-MM-DD'));
    }
    this.item_id = id;
    this.markingDate();
  }

  getToken = async () => {
    let value = await AsyncStorage.getItem("token")
    this.state.token = value
    this.getReservationList()
  }

  getReservationList = async() => {
    api.get('/bookings?received=true', {
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
    var obj = nextDay.reduce((c, v) => Object.assign(c, {[v]: {selected: true, color: '#50cebb', startingDay: true, endingDay: true}}), {});
    this.setState({ marked : obj});
  }

  componentDidMount(){
    this.getToken();
    //this.markingDate();
  }

  showReservationContent = async(id) => {
    api.get(`/bookings/${id}`, {
      headers: {Authorization: this.state.token},
    }).then((res) => {
      console.log(res)
    }).catch((err) => {
      console.log("reservation item show err")
      console.log(err)
    })
  }

  showOptionButton(){
    if(this.item_id){
      console.log("show option button")
      return(
        <View style={styles.footer}>
          <Button transparent style={styles.bottomButtons}
          >
            <Text style = {styles.footerText}>승인</Text>
          </Button>
          <Button transparent style={styles.bottomButtons}>
            <Text style = {styles.footerText}>거절</Text>
          </Button>
        </View>
      )
    }else{
      return null
    }
  }

  render(){
    if(this.state.loading) {
      return (
        <Container>
        <Header />
        <Content>
          <Spinner color='green' />
        </Content>
      </Container>
      )
    }
    else{
    return(
      <Container>
        <Content>
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


const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    flex:0.1,
    left: 0,
    right: 0,
    bottom: -5,
    backgroundColor:'#50cebb',
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

export default reservationScreen;