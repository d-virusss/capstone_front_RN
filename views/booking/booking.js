import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import React, {Component, useState} from 'react';
import {View, Dimensions} from 'react-native';
import {
  Text, Form, Icon, Textarea, Item, Input, Button, 
  Container, Content, Header
} from 'native-base';
import { Calendar } from 'react-native-calendario';
import api from '../shared/server_address'
import { ScreenStackHeaderBackButtonImage } from 'react-native-screens';

//let token;
let dateNumber = 0;

class bookingScreen extends Component{
  params = this.props.route.params;
  state = {
    totalPrice : 0,
    dateNumber : 0,
    startYear : 0,
    startMonth : 0,
    startDay : 0,
    endYear : 0,
    endMonth : 0,
    endDay : 0,
    post_id : 0,
    flag : 0,
    startDate: "",
    endDate: "",
    token: 0
  };

  getToken = async () => {
    let value = await AsyncStorage.getItem("token")
    this.state.token = value
    this.sendIndexRequest()
  }

  bookingCreateRequest = () => {
    api
      .post(`/bookings`, {
        booking : {
          post_id: this.state.post_id,
          start_at : this.state.startDate,
          end_at : this.state.endDate
        }
      },{ headers : {
        'Authorization': this.state.token
      }})
      .then((response) => {
        console.log('success');
        console.log(this.state.token);
        console.log(response);
        this.props.navigation.goBack();
      })
      .catch((err) => console.log("err : ", err))
  }

  calculateDate = (data) => {
    this.state.startYear = data.startDate.getFullYear();
    this.state.startMonth = data.startDate.getMonth();
    this.state.startDay = data.startDate.getDate();
    this.state.endYear = data.endDate.getFullYear();
    this.state.endMonth = data.endDate.getMonth();
    this.state.endDay = data.endDate.getDate();
    this.state.startDate = data.startDate;
    this.state.endDate = data.endDate;
    this.state.dateNumber = ((data.endDate - data.startDate) / (1000 * 3600 * 24) + 1)
  }

  calculatePrice = () => {
    // this.setState({totalPrice : (this.state.dateNumber * 10000)});
    this.state.totalPrice = (this.state.dateNumber * 10000)
    console.log(this.state)
    this.forceUpdate();
  }

  componentDidMount(){
    console.log('screen load!');
    this.getToken();
    const {post_id} = this.props.route.params;
    if(this.state.flag === 0) {
      this.state.post_id = post_id;
      this.state.flag = 1;
      console.log("post_id: "+ post_id);
    }
  }

  render(){
    return(
      <Container>
        <Header style = {{height: 100}}>
          <View style = {{width : '30%', justifyContent : 'center'}}>
            <Icon name = 'person' style = {{fontSize : 80, margin : '1%'}}/>
          </View>
          <View style = {{width : '40%', justifyContent : 'center'}}>
            <Text style = {{margin : '1%', fontSize : 25}}>화이트채플</Text>
            <Text style = {{margin : '1%', fontSize : 20}}>10000원</Text>
          </View>
          <View style = {{width : '30%', justifyContent : 'center'}}>
            <Text style = {{margin : '1%', fontSize : 25}}>대여가격</Text>
    <Text style = {{margin : '1%', fontSize : 20}}>{this.state.totalPrice + ' 원'}</Text>
          </View>
        </Header>
        <Calendar
          onChange={(range) => { console.log(range); if(typeof(range.endDate) != "undefined"){
            this.calculateDate(range); this.calculatePrice()
          }}} 
          startDate = {new Date(this.state.startYear, this.state.startMonth, this.state.startDay)}
          endDate = {new Date(this.state.endYear, this.state.endMonth, this.state.endDay)}
          numberOfMonths = {3}
          theme={ theme }
        />
        <View style = {{
          backgroundColor : 'orange',
          justifyContent : 'center'
        }}>
          <Button style = {{
              alignSelf : 'center', marginTop : '3%',
              padding : 4,
              margin : '1%',
              backgroundColor : 'white'
            }}
            onPress = {() => this.bookingCreateRequest()}
          >
            <Text style = {{color : 'black'}}>예약 신청하기</Text>
          </Button>
        </View>
      </Container>
    );
  };
};

let theme = {
  activeDayColor: {},
  monthTitleTextStyle: {
    color: '#3264ff',
    fontWeight: '300',
    fontSize: 16,
  },
  emptyMonthContainerStyle: {},
  emptyMonthTextStyle: {
    fontWeight: '200',
  },
  weekColumnsContainerStyle: {},
  weekColumnStyle: {
    paddingVertical: 10,
  },
  weekColumnTextStyle: {
    color: '#000',
    fontSize: 13,
  },
  nonTouchableDayContainerStyle: {},
  nonTouchableDayTextStyle: {},
  startDateContainerStyle: {},
  endDateContainerStyle: {},
  dayContainerStyle: {},
  dayTextStyle: {
    color: '#000',
    fontWeight: '200',
    fontSize: 15,
  },
  dayOutOfRangeContainerStyle: {},
  dayOutOfRangeTextStyle: {},
  todayContainerStyle: {},
  todayTextStyle: {
    color: '#6d95da',
  },
  activeDayContainerStyle: {
    backgroundColor: '#6d95da',
  },
  activeDayTextStyle: {
    color: 'white',
  },
  nonTouchableLastMonthDayTextStyle: {},
}

export default bookingScreen;