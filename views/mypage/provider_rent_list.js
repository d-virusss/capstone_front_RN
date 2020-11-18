import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, View, Alert } from 'react-native';
import { Container, Content, Header, Left, Right, Body, Icon,
  Title, Text, List, ListItem, Tabs, Tab, TabHeading, Thumbnail,
} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../shared/server_address'

class ProviderRentList extends Component {
  state = {
    token: '',
    myId: '',
    after_booking : [],
  }

  makeRentList(bookings) {
    return bookings.map((booking) => {
      console.log('in rent list------')
      console.log(booking.booking_info.title)
      if(booking.booking_info.acceptance === "rent"){
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
                <Text style={styles.returnbutton}>반납확인</Text>
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
              <Thumbnail square source={{ uri: booking.booking_info.post_image }} />
            </Left>
            <Body>
              <Text>{booking.booking_info.title}</Text>
              <Text note numberOfLines={1} style={{ paddingVertical : '1%'}}>
                {booking.booking_info.start_at.split('T')[0]} ~ { booking.booking_info.end_at.split('T')[0]}
              </Text>
              <Text note numberOfLines={1}>{booking.booking_info.price.toLocaleString()} 원</Text>
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
        console.log(res)
        this.setState({ after_booking: res.data }, () => { })
      })
      .catch(function (e) {
        console.log('send post failed!!!!' + e)
        Alert.alert("요청 실패", e.response.data.error, [{ text: '확인', style: 'cancel' }])
      })
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

  render() {
    return (
      <View>
        <Header>
          <Left>
            <TouchableOpacity transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name='chevron-back' type='Ionicons' />
            </TouchableOpacity>
          </Left>
          <Body><Title>제공 목록</Title></Body>
          <Right></Right>
        </Header>

        <ScrollView>
          <Content>
            <Tabs>
              <Tab heading={<TabHeading transparent><Text>대여 중</Text></TabHeading>}>
                <Content>
                  <List>
                    {this.makeRentList(this.state.after_booking)}
                  </List>
                </Content>
              </Tab>
              <Tab heading={<TabHeading transparent><Text>지난 대여</Text></TabHeading>}>
                <Content>
                  <List>
                    {this.makeCompletedList(this.state.after_booking)}
                  </List>
                </Content>
              </Tab>
            </Tabs>
          </Content>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  returnbutton : {
    fontSize : 15,
    fontWeight : '500'
  }
});

export default ProviderRentList;