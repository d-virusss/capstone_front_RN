import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import React, {Component, useState} from 'react';
import {View, Image, Alert, StyleSheet} from 'react-native';
import { Text, Form, Icon, Textarea, Item, Input, Button, 
  Container, Content, Header, Body, Title, Left, Right,
} from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Calendar } from 'react-native-calendario';
import api from '../shared/server_address'
import { ScreenStackHeaderBackButtonImage } from 'react-native-screens';

//let token;
let dateNumber = 0;

class bookingScreen extends Component{
  post_info = this.props.route.params.post_info;
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
    token: 0,
    booked : false,
    post_title : "",
    post_price : "",
    booking_id:0,
    image_info:'',
  };

  componentDidMount() {
    console.log('screen load!');
    this.getToken();
    console.log(this.post_info)
    if (this.state.flag === 0) {
      this.setState({
        post_id : this.post_info.id,
        flag : 1,
        post_title : this.post_info.title,
        image_info : this.post_info.image
      }, () => { console.log(this.state) })
    }
    setTimeout(this.isBooked, 50);
    setTimeout(this.getPostInfo, 200);
  }

  getToken = async () => {
    let value = await AsyncStorage.getItem("token")
    this.state.token = value
    console.log(this.state.token);
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
        Alert.alert("예약 신청 완료", "예약 신청이 완료되었습니다.",[{text:"확인", style:'cancel'}])
        this.props.route.params.onGoBack();
        this.props.navigation.goBack();
      })
      .catch((err) => {
        console.log("err : ", err)
        Alert.alert("예약 오류", err.response.data.error,[{text:"확인", style:'cancel'}])
      })
      console.log(this.state.booked);
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
    this.state.totalPrice = (this.state.dateNumber * this.state.post_price)
    console.log(this.state)
    this.forceUpdate();
  }

  isBookedCalculate = () => {
    this.state.totalPrice = ((this.state.endDate-this.state.startDate) * this.state.post_price)
    console.log(this.state)
    //this.forceUpdate();
  }

  getPostInfo = async () => {
    await api
      .get(`/posts/${this.state.post_id}`,{
        headers : {
        'Authorization': this.state.token
        }
      })
      .then((response) => {
        console.log(response)
        this.state.post_title = response.data.post_info.title;
        this.state.image_info = response.data.post_info.image;
        this.setState({post_price: response.data.post_info.price});
      })
      .catch((error) => {
        console.log(error)
        Alert.alert("요청 실패", error.response.data.error,[{text:'확인', style:'cancel'}])
      })
  }

  isBooked = async () => {
    await api
      .get(`/bookings/new?post_id=${this.state.post_id}`,{ 
        headers : {
        'Authorization': this.state.token
        }
      })
      .then((response)=>{
        console.log(response.data)
        if(response.data === null) this.state.booked = false;
        else {
          this.state.booked = true;
          this.state.booking_id = response.data.booking_info.id;
          this.state.startDate = new Date(response.data.booking_info.start_at);
          this.state.endDate = new Date(response.data.booking_info.end_at);
          this.state.post_price = response.data.booking_info.price;
          this.state.totalPrice = ((this.state.endDate - this.state.startDate) / (1000 * 3600 * 24) + 1) * this.state.post_price
        }
      })
      .catch((error) => {
        console.log(error)
        Alert.alert("요청 실패", error.response.data.error,[{text:'확인', style:'cancel'}])
      })
  }

  removeBooking = async() => {
    await api
      .delete(`/bookings/${this.state.booking_id}`,{
        headers : {
          'Authorization' : this.state.token
        },
        data:{
          foo: 'bar'
        }
      })
      .then(()=>{
        console.log(this.state.token)
        Alert.alert("예약 취소", "예약을 취소하였습니다.",[{text:"확인", style:'cancel'}])
        this.props.route.params.onGoBack();
        this.props.navigation.goBack();
      })
      .catch((error) => {
        console.log(error)
        Alert.alert("예약 실패", error.response.data.error,[{text:'확인', style:'cancel'}])
      })
      console.log(this.state.booked);
  }

  render(){
    return(
      <Container>
        <Header>
          <Left style={{flex: 1}}>
            <TouchableOpacity transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name='chevron-back' type='Ionicons' />
            </TouchableOpacity>
          </Left>
          <Body style={{flex:8}}><Title>{this.state.post_title}</Title></Body>
          <Right style={{flex:1}}></Right>
        </Header>
        <Header style = {{height: 100}}>
          <View style = {{width : '30%', justifyContent : 'center', alignItems: 'flex-start'}}>
          <Image source={{ uri : this.state.image_info || "empty" }} style={{width: 100, height: 100}} />
          </View>
          <View style = {{width : '70%', justifyContent : 'center'}}>
            <Text style = {styles.priceTitle}>대여가격</Text>
            <Text style = {styles.priceText}>
              {this.state.totalPrice.toLocaleString() + ' 원'}
            </Text>
          </View>
        </Header>
        {this.state.booked == false && (<Calendar
          onChange={(range) => { 
            console.log(range); 
            if(typeof(range.endDate) != "undefined"){
              this.calculateDate(range); 
              this.calculatePrice();
            }
          }} 
          startDate = {new Date(this.state.startYear, this.state.startMonth, this.state.startDay)}
          endDate = {new Date(this.state.endYear, this.state.endMonth, this.state.endDay)}
          numberOfMonths = {3}
          theme={ theme }
        />)}
        {this.state.booked == true && (<Calendar
          onChange = {(range)=>{console.log}}
          startDate = {new Date(this.state.startDate.getFullYear(),this.state.startDate.getMonth(),this.state.startDate.getDate())}
          endDate = {new Date(this.state.endDate.getFullYear(),this.state.endDate.getMonth(),this.state.endDate.getDate())}
          numberOfMonths = {3}
          theme={ theme }
        />)}
        <View style = {{
          backgroundColor : '#ff3377',
          justifyContent : 'center',
          alignItems:'center',
          width : '100%',
          height : '8%'
        }}>
          {this.state.booked == false && (
            <Button transparent style = {{
                alignSelf : 'center',
                padding : 4,
                marginBottom : '3%',
                height: 80,
              }}
              onPress = {() => {
                  Alert.alert("예약 신청", "예약을 신청하시겠습니까?", [
                    {
                      text: '취소',
                      style: 'cancel'
                    },
                    {
                      text: '확인',
                      onPress: () => this.bookingCreateRequest(),
                    },
                  ])
                }
              }
            >
              <Text style = {{color : 'white', fontSize:20, fontWeight: 'bold'}}>예약 신청하기</Text>
            </Button>
          )}
          {this.state.booked == true && (
            <Button transparent style = {{
                alignSelf : 'center',
                padding : 4,
                margin : '1%',
              }}
              onPress = {() => {
                Alert.alert("예약 취소", "예약을 취소하시겠습니까?", [
                  {
                    text: '취소',
                    style: 'cancel',
                  },
                  {
                    text: '확인',
                    onPress: () => this.removeBooking(),
                  }
                ])
              }}
            >
              <Text style = {{color : 'white', fontSize: 20, fontWeight: 'bold'}}>예약 취소하기</Text>
            </Button>
          )}
        </View>
      </Container>
    );
  };
};

const styles = StyleSheet.create({
  productTitle : {
    margin : '2%',
    fontSize : 17,
  },
  productPrice :{
    margin : '2%',
    fontSize : 15,
    color : '#5c5b5b',
    alignSelf : 'center'
  },
  priceTitle : {
    margin : '2%',
    fontSize : 15,
    alignSelf : 'center'
  },
  priceText : {
    margin : '2%',
    fontSize : 17,
    fontWeight : '600',
    alignSelf : 'center'
  }
})

let theme = {
  activeDayColor: {},
  monthTitleTextStyle: {
    color: '#ff3377',
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
    color: '#ff3377',
  },
  activeDayContainerStyle: {
    backgroundColor: '#ff3377',
  },
  activeDayTextStyle: {
    color: 'white',
  },
  nonTouchableLastMonthDayTextStyle: {},
}
export default bookingScreen;