import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, View, Alert } from 'react-native';
import {
  Container, Content, Header, Left, Right, Body, Icon, Badge,
  Title, Text, List, ListItem, Tabs, Tab, TabHeading, Thumbnail,
} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../shared/server_address'

class ProviderRentList extends Component {
  state = {
    token: '',
    myId: '',
    after_booking: [],
    visible : false,
  }

  makeRentList(bookings) {
    return bookings.map((booking) => {
      console.log('in rent list------')
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
            <Right>
              <TouchableOpacity onPress={() => {Alert.alert("리뷰 작성", "리뷰를 작성하시겠습니까?", [
                {
                  text: '확인',
                  onPress: () => { this.writeReviewRequest(booking.booking_info.post_id, booking.booking_info.post_image, 
                    booking.booking_info.title, booking.booking_info.id) }
                    //post_id, image, title, booking_id
                },
                {
                  text: '취소',
                  style: 'cancel'
                }
              ])}}>
                <Badge style={{ backgroundColor: '#fcf11e', height : 30}}>
                  <Text style={styles.returnbutton}>리뷰 작성</Text>
                </Badge>
              </TouchableOpacity>
            </Right>
          </ListItem>
        )
      }
    })
  }

  writeReviewRequest(post_id, image, title, booking_id){
    let posts = {
      id :booking_id,
      image : image,
      title : title,
    }//for review request

    api.get(`/reviews?post_id=${post_id}`, {
      headers: {
        'Authorization': this.state.token
      }
    }).then((res) => {
      console.log(res);
      this.props.navigation.navigate('WriteReview', {posts : posts})
    }).catch((err) => {
      Alert.alert("요청 실패", e.response.data.error, [{ text: '확인', style: 'cancel' }])
    })
  }

  onrentRequest() {
    api
      .get(`/bookings?status=after`, {
        headers: {
          'Authorization': this.state.token
        }
      })
      .then((res) => {
        console.log(res)
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
        <Header>
          <Left>
            <TouchableOpacity transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name='chevron-back' type='Ionicons' />
            </TouchableOpacity>
          </Left>
          <Body><Title>대여 목록</Title></Body>
          <Right></Right>
        </Header>

        <Tabs>
          <Tab heading={<TabHeading transparent><Text>대여 중</Text></TabHeading>}>
            <ScrollView>
              <List>
                {this.makeRentList(this.state.after_booking)}
              </List>
            </ScrollView>
          </Tab>
          <Tab heading={<TabHeading transparent><Text>지난 대여</Text></TabHeading>}>
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