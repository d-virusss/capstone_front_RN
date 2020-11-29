import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, View, Alert } from 'react-native';
import {
  Container, Content, Header, Left, Right, Body, Icon, Badge,
  Title, Text, List, ListItem, Tabs, Tab, TabHeading, Thumbnail,
  Footer
} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../shared/server_address'
import SendList from './reservationSend'

class ProviderRentList extends Component {
  state = {
    token: '',
    myId: '',
    after_booking: [],
    visible : false,
  }

  makeRentList(bookings) {
    return bookings.map((booking) => {
      console.log("----------make")
      console.log(booking.booking_info)
      if (booking.booking_info.acceptance === "rent") {
        return (
          <ListItem thumbnail key={booking.booking_info.id} button
            onPress={() => { console.log('not already exist booking_show') }}>
            <Left>
              <Thumbnail square source={{ uri: booking.booking_info.post_image }} />
            </Left>
            <Body>
              <Text>{booking.booking_info.title}</Text>
              <Text note numberOfLines={1}>
                {booking.booking_info.start_at.split('T')[0]} ~
                {booking.booking_info.end_at.split('T')[0]}
              </Text>
              <Text note numberOfLines={1}>{booking.booking_info.price.toLocaleString()} 원</Text>
            </Body>
          </ListItem>
        )
      }
    })
  }

  makeCompletedList(bookings) {
    return bookings.map((booking) => {
      console.log('in completed list --------')
      console.log(booking.booking_info.title)
      if (booking.booking_info.acceptance === "completed") {
        return (
          <ListItem thumbnail key={booking.booking_info.id}>
            <Left>
              <Thumbnail square source={{ uri: booking.booking_info.post_image }} />
            </Left>
            <Body>
              <Text>{booking.booking_info.title}</Text>
              <Text note numberOfLines={1}>
                {booking.booking_info.start_at.split('T')[0]} ~
              {booking.booking_info.end_at.split('T')[0]}
              </Text>
              <Text note numberOfLines={1}>{booking.booking_info.price.toLocaleString()} 원</Text>
            </Body>
            <Right>
              <TouchableOpacity //for debug
              onPress={() => { if(booking.booking_info.has_review){Alert.alert("리뷰 관리에서 수정해 주세요")}
                else{Alert.alert("리뷰 작성", "리뷰를 작성하시겠습니까?", [
                {
                  text: '확인',
                  onPress: () => { this.writeReviewRequest(booking.booking_info.post_image, 
                    booking.booking_info.title, booking.booking_info.id) }
                    //post_id, image, title, booking_id
                },
                {
                  text: '취소',
                  style: 'cancel'
                }])
              }}}>
                <Badge style={{ backgroundColor: booking.booking_info.has_review  ? '#dddddd' : '#fcf11e', height : 30}}>
                  <Text style={styles.returnbutton}>{booking.booking_info.has_review ? "작성 완료" : "리뷰 작성"}</Text>
                </Badge>
              </TouchableOpacity>
            </Right>
          </ListItem>
        )
      }
    })
  }

  writeReviewRequest(image, title, booking_id){
    let posts = {
      id :booking_id,
      image : image,
      title : title,
    }//for review request

    this.props.navigation.navigate('WriteReview', {posts : posts})
  }

  onrentRequest() {
    api
      .get(`/bookings?status=after`, {
        headers: {
          'Authorization': this.state.token
        }
      })
      .then((res) => {
        this.setState({ after_booking: res.data }, () => { })
      })
      .catch(function (e) {
        Alert.alert("요청 실패", e.response.data.error, [{ text: '확인', style: 'cancel' }])
      })
  }

  getToken = async () => {
    const value = await AsyncStorage.getItem("token")
    this.state.token = value
    this.onrentRequest();
  }

  componentDidMount() {
    this.getToken()
  }

  render() {
    return (
      <Container>
        <Header style={{
            height: 60,
            backgroundColor: '#f8f8f8',
            justifyContent:'space-between'}}
            androidStatusBarColor='#000'
        >
          <Left>
            <TouchableOpacity transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name='chevron-back' type='Ionicons' />
            </TouchableOpacity>
          </Left>
          <Body><Title>빌린 물품</Title></Body>
          <Right></Right>
        </Header>

        <Tabs tabBarUnderlineStyle={{ backgroundColor: '#ff3377' }}>
          <Tab heading="신청한 예약" activeTextStyle={{ color: '#ff3377' }}>
            <Footer>
              <SendList navigation={this.props.navigation}></SendList>
            </Footer>
          </Tab>
          <Tab heading="대여 중" activeTextStyle={{ color: '#ff3377' }}>
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
    fontWeight : '400',
    color : 'black'
  }
});

export default ProviderRentList;