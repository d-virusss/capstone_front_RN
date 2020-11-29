import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, View, Alert } from 'react-native';
import {
  Container, Content, Header, Left, Right, Body, Icon,
  Title, Text, List, ListItem, Tabs, Tab, TabHeading, Thumbnail, Badge,
  FooterTab, Footer
} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../shared/server_address'
import ReceiveList from '../mypage/reservationReceive'

class ProfileProvide extends Component {
  state = {
    token: '',
    myId: this.props.route.params.user_id,
    after_booking: [],
    posts : [],
  }

  getToken = async () => {
    const value = await AsyncStorage.getItem("token")
    this.state.token = value
    console.log(value)
    this.providePostRequest();
    this.afterRequest();
  }

  componentDidMount() {
    this.getToken()
    console.log('component did mount -------------')
  }

  makeRentList(bookings) {
    return bookings.map((booking) => {
      console.log('in rent list------')
      if (booking.booking_info.acceptance === "rent") {
        return (
          <ListItem thumbnail key={booking.booking_info.id} button
            onPress={() => { console.log('not already exist booking_show') }}>
            <Left>
              <Thumbnail square source={{ uri: booking.booking_info.post_image }} />
            </Left>
            <Body>
              <Text>{booking.booking_info.title}</Text>
              <Text note numberOfLines={1} style={{ paddingVertical: 4 }}>
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
              <Text note numberOfLines={1} style={{ paddingVertical: 4 }}>
                {booking.booking_info.start_at.split('T')[0]} ~ {booking.booking_info.end_at.split('T')[0]}
              </Text>
              <Text note numberOfLines={1}>{booking.booking_info.price.toLocaleString()} 원</Text>
            </Body>
          </ListItem>
        )
      }
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
        console.log(res)
        this.setState({ after_booking: res.data }, () => { })
      })
      .catch(function (e) {
        console.log('send post failed!!!!' + e)
        Alert.alert("요청 실패", e.response.data.error, [{ text: '확인', style: 'cancel' }])
      })
  } 
  
  providePostRequest() {
    api
      .get(`/users/${this.state.myId}/list?post_type=provide`, {
        headers: {
          'Authorization': this.state.token
        }
      })
      .then((res) => {
        this.setState({ posts: res.data })
      })
      .catch(function (e) {
        console.log('send post failed!!!!' + e)
        Alert.alert("요청 실패", e.response.data.error, [{ text: '확인', style: 'cancel' }])
      })
  }


  renderPost(posts) {
    return posts.map((post) => {
      console.log(post)
      return (
        <ListItem thumbnail key={post.post_info.id} button
          onPress={() => this.props.navigation.push('PostShow', { post_id: post.post_info.id })}>
          <Left>
            <Thumbnail square source={{ uri: post.post_info.image }} />
          </Left>
          <Body>
            <Text>{post.post_info.title}</Text>
            <Text note numberOfLines={1}>{post.post_info.body}</Text>
          </Body>
        </ListItem>
      )
    })
  }

  render() {
    return (
      <Container>
        <Header style={{
          height: 60,
          backgroundColor: '#f8f8f8',
          justifyContent: 'space-between'
        }}
          androidStatusBarColor='#000'
        >
          <Left>
            <TouchableOpacity transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name='chevron-back' type='Ionicons' />
            </TouchableOpacity>
          </Left>
          <Body><Title>등록한 물품</Title></Body>
          <Right></Right>
        </Header>

        <Tabs tabBarUnderlineStyle={{ backgroundColor: '#ff3377' }}>
          <Tab heading="등록 상품" activeTextStyle={{ color: '#ff3377' }}>
            <Content>
              <List>
                {this.renderPost(this.state.posts)}
              </List>
            </Content>
          </Tab>
          <Tab heading="대여 중" activeTextStyle={{ color: '#ff3377' }}>
            <Content>
              <List>
                {this.makeRentList(this.state.after_booking)}
              </List>
            </Content>
          </Tab>
          <Tab heading="지난 대여" activeTextStyle={{ color: '#ff3377' }}>
            <Content>
              <List>
                {this.makeCompletedList(this.state.after_booking)}
              </List>
            </Content>
          </Tab>
        </Tabs>

      </Container>
    );
  }
}

const styles = StyleSheet.create({
  returnbutton: {
    fontSize: 13,
    fontWeight: '400',
    color: 'black'
  }
});

export default ProfileProvide;