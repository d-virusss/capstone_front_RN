import AsyncStorage from '@react-native-community/async-storage';
import React, {Component} from 'react';
import {TouchableOpacity, View, StyleSheet} from 'react-native';
import {Text, Left, Thumbnail,Body,Right,Container, Content, ListItem,} from 'native-base';
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
  };

  makeList() {
    return reservation_list.map((ele) => {
      //console.log(ele)
      return (
        <ListItem>
          <Left>
            <Thumbnail source={{uri: ele.booking_info.image}} />
          </Left>
          <Body>
            <Text>{ele.booking_info.title}</Text>
            <Text note numberOfLines={1}>
              {ele.booking_info.acceptance}
            </Text>
          </Body>
          <Right>
            <TouchableOpacity 
            onPress = {() => this.showBookingDate(ele.booking_info.start_at, ele.booking_info.end_at)}>
              <Text>보기</Text>
            </TouchableOpacity>
          </Right>
        </ListItem>
      );
    });
  }

  showBookingDate(startDate, endDate) {
    nextDay = [];
    console.log("show button press")
    const start = moment(startDate);
    const end = moment(endDate);
    for (let m = moment(start); m.diff(end, 'days') <= 0; m.add(1, 'days')) {
      nextDay.push(m.format('YYYY-MM-DD'));
    }
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


  render(){
    if(this.state.loading) return null
    else{
    return(
      <Container>
        <Content>
        <Calendar
        //  markedDates={{
        //   '2020-11-22': {selected: true, startingDay: true, color: '#50cebb'},
        //   '2020-11-23': {selected: true, endingDay: true, color: '#50cebb'},
        //   '2020-11-24': {selected: true, startingDay: true, color: '#50cebb', endingDay: true}
        // }}
        markedDates={this.state.marked}
        markingType={'period'}
        />
        </Content>
        <Content>
            {this.makeList()}
        </Content>
      </Container>
    )
    } 
    };
  };


const styles = StyleSheet.create({

 });

export default reservationScreen;