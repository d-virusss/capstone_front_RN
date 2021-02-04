import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Container, Header, Left, Right, Body, Icon,
  Title, Text, List, ListItem, Tabs, Tab, Thumbnail, Badge,FooterTab
} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../shared/server_address'
import ReceiveList from './reservationReceive'

class ProviderRentList extends Component {
  state = {
    token: '',
    myId: '',
    after_booking : [],
  }

  getToken = async () => {
    const value = await AsyncStorage.getItem("token")
    this.state.token = value
    console.log(value)
    
    this.afterRequest();
  }

  componentDidMount() {
    this.getToken()
    console.log('component did mount -------------')
  }

  makeRentList(bookings) {
    return bookings.map((booking) => {
      console.log('in rent list------')
      console.log(booking)
      if(booking.booking_info.acceptance === "rent"){
        return (
          <ListItem thumbnail key={booking.booking_info.id} button
            onPress={() => { console.log('not already exist booking_show') }}>
            <Left>
              <Thumbnail square source={{ uri: booking.booking_info.post_image }} />
            </Left>
            <Body>
              <Text>{booking.booking_info.title}</Text>
              <Text note numberOfLines={1} style={{ paddingVertical : 4}}>
                {booking.booking_info.start_at.split('T')[0]} ~
                {booking.booking_info.end_at.split('T')[0]}
              </Text>
              <Text note numberOfLines={1}>{booking.booking_info.price.toLocaleString()} 원 by {booking.booking_info.consumer.nickname}</Text>
            </Body>
            <Right>
              <TouchableOpacity onPress={() => {Alert.alert("반납 완료", "반납 완료 상태로 수정하시겠습니까?", [
                {
                  text: '확인',
                  onPress: () => { this.changeToCompletedRequest(booking.booking_info.id) }
                },
                {
                  text: '취소',
                  style: 'cancel'
                }
              ])}}>
                <Badge style={{ backgroundColor: '#ffe812', height : 30}}>
                  <Text style={styles.returnbutton}>반납 확인</Text>
                </Badge>
              </TouchableOpacity>
            </Right>
          </ListItem>
        )
      }
    })
  }
  
  makeCompletedList(bookings) {
    return bookings.map((booking) => {
      console.log('in completed list --------')
      console.log(booking.booking_info.title)
      if(booking.booking_info.acceptance === "completed"){
        return (
          <ListItem thumbnail key={booking.booking_info.id} button
            onPress={() => { console.log('not already exist booking_show') }}>
            <Left>
              <Thumbnail square source={booking.booking_info=='/image/default.png' ? require('../../assets/default.png') : { uri: booking.booking_info.post_image }} />
            </Left>
            <Body>
              <Text>{booking.booking_info.title}</Text>
              <Text note numberOfLines={1} style={{ paddingVertical : 4}}>
                {booking.booking_info.start_at.split('T')[0]} ~ { booking.booking_info.end_at.split('T')[0]}
              </Text>
              <Text note numberOfLines={1}>{booking.booking_info.price.toLocaleString()} 원 by {booking.booking_info.consumer.nickname}</Text>
            </Body>
          </ListItem>
        )
      }
    })
  }

  changeToCompletedRequest(id){
    api
      .put(`/bookings/${id}/complete`,(""), {
        headers: {
          'Authorization': this.state.token
        }
      })
      .then((res) => {
        console.log(res)
        Alert.alert("반납 완료", "반납이 완료되었습니다.", [{
          text: '확인', style: 'cancel'
        }])
        this.afterRequest()
      })
      .catch(function (e) {
        console.log('send post failed!!!!' + e)
        Alert.alert("요청 실패", e.response.data.error, [{ text: '확인', style: 'cancel' }])
      })
  }

  afterRequest() {
    api
      .get(`/bookings?received=true&status=after`, {
        headers: {
          'Authorization': this.state.token
        }
      })
      .then((res) => {
        console.log("---------------afterrequest--------------")
        console.log(res)
        this.setState({ after_booking: res.data }, () => { })
      })
      .catch(function (e) {
        console.log('send post failed!!!!' + e)
        Alert.alert("요청 실패", e.response.data.error, [{ text: '확인', style: 'cancel' }])
      })
  }

  render() {
    return (
      <Container>
        <Header style={styles.headerStyle} androidStatusBarColor='#000' >
          <Left>
            <TouchableOpacity transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name='chevron-back' type='Ionicons' />
            </TouchableOpacity>
          </Left>
          <Body><Title style={{ fontSize: 20 }}>등록한 물품</Title></Body>
          <Right></Right>
        </Header>

        <Tabs tabBarUnderlineStyle={{ backgroundColor: '#ff3377' }}>
          <Tab heading="받은 예약" activeTextStyle={{ color: '#ff3377' }}>
            <FooterTab scrollEnabled={false}>
              <ReceiveList navigation={this.props.navigation}></ReceiveList>
            </FooterTab>
          </Tab>
          <Tab heading="대여 중" activeTextStyle={{ color : '#ff3377' }}>
            <ScrollView>
              <List>
                {this.makeRentList(this.state.after_booking)}
              </List>
            </ScrollView>
          </Tab>
          <Tab heading="지난 대여" activeTextStyle={{ color: '#ff3377' }}>
            <ScrollView>
              <List>
                {this.makeCompletedList(this.state.after_booking)}
              </List>
            </ScrollView>
          </Tab>
        </Tabs>
    
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  returnbutton : {
    fontSize : 13,
    fontWeight : 'bold',
    color : 'black'
  },
  headerStyle : {
    height: 60,
    backgroundColor: '#f8f8f8',
    justifyContent:'space-between'
  }
});

export default ProviderRentList;