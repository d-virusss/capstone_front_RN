import AsyncStorage from '@react-native-community/async-storage';
import React, {Component} from 'react';
import {TouchableOpacity, View, StyleSheet} from 'react-native';
import {Text, Left, Thumbnail,Body,Right,Container, Content, ListItem,} from 'native-base';
import  {Calendar, DayType}  from 'react-native-calendario';
import api from '../shared/server_address'

var reservation_list = [];

// DayType = {
//   date: Date;
//   id: string;
//   isActive: boolean;
//   isEndDate: boolean;
//   isHidden: boolean;
//   isMonthDate: boolean;
//   isOutOfRange: boolean;
//   isStartDate: boolean;
//   isToday: boolean;
//   isVisible: boolean;
// };

class reservationScreen extends Component{
  //params = this.props.route.params;
  state = {
    startYear : 2020,
    startMonth : 11,
    startDay : 9,
    startDate: "",
    endDate: "",
    endYear : 2020,
    endMonth : 11,
    endDay : 19,
    token: 0,
    loading: true,
    personal: false,
  };

  makeList() {
    return reservation_list.map((ele) => {
      console.log(ele)
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
            onPress = {() => this.selectDay(ele.booking_info.start_at, ele.booking_info.end_at)}>
              <Text>보기</Text>
            </TouchableOpacity>
          </Right>
        </ListItem>
      );
    });
  }

  selectDay(start, end) {
    console.log("selectDay")
    let startYear = start.substring(0,4);
    let startMonth = start.substring(5,7);
    let startDay = start.substring(8,10);
    let endYear = end.substring(0,4);
    let endMonth = end.substring(5, 7);
    let endDay = end.substring(8, 10);
    this.state.startDate = new Date(startYear, startMonth, startDay);
    this.state.endDate = new Date(endYear, endMonth, endDay)
    console.log(this.state.startDate)
    console.log(this.state.endDate)
    this.setState({personal: true});
  }

  getToken = async () => {
    let value = await AsyncStorage.getItem("token")
    this.state.token = value
    this.getReservationList()
  }

  renderDayContent = (e) => {
    var {isActive, date} = e;
    console.log(e)
    if(e == this.state.startDate)
      console.log("start date");
    if(e == this.state.endDate)
      console.log("end Date")
    
    // if(10 <= Number(String(e.date).substring(8,10)) && Number(String(e.date).substring(8,10)) <= 13){
    //   isActive = true;
    // }

    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={[isActive? styles.selStyle : styles.defaultStyle]}>
          {date.getDate()}
        </Text>
      </View>
    );
  };

  getReservationList = async() => {
    api.get('/bookings?received=true', {
        headers: {Authorization: this.state.token},
    }).then((res) => {
        console.log(res)
        reservation_list = res.data;
        this.setState({loading: false});
    }).catch((err) => {
        console.log("reservation page err")
    })
  }

  componentDidMount(){
    this.getToken();
  }

  render(){
    console.log(this.state.startYear)
    if(this.state.loading) return null;
    else {
      if(!this.state.personal){
        console.log("render default")
        return(
          <Container>
            <Content>
            <Calendar
              onChange={(range) => {}} 
              //renderDayContent={this.renderDayContent}
              numberOfMonths = {2}
              theme={theme}
            />
            </Content>
            <Content>
                {this.makeList()}
            </Content>
          </Container>
        )
      }
      else{
        console.log("render personal")
        return(
          <Container>
            <Content>
            <Calendar
              onChange={(range) => {}} 
              renderDayContent={this.renderDayContent}
              numberOfMonths = {2}
              theme={theme}
            />
            </Content>
            <Content>
                {this.makeList()}
            </Content>
          </Container>
          );
        }
    };
  };
}
let theme = {
  activeDayColor: {
    backgroundColor: '#6d95da',
  },
  monthTitleTextStyle: {
    color: '#3264ff',
    fontSize: 23,
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
    fontSize: 18,
  },
  nonTouchableDayContainerStyle: {},
  nonTouchableDayTextStyle: {},
  startDateContainerStyle: {
  },
  endDateContainerStyle: {
  },
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

const styles = StyleSheet.create({
  selStyle :{
    borderWidth:3,
    borderRadius:5,
    borderColor: '#6d95da',
    overflow: 'hidden',
    backgroundColor:'#6d95da',
    color: 'white'
  },

  defaultStyle:{
   color: 'grey'
  }
 });

export default reservationScreen;