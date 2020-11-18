import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, View } from 'react-native';
import { Container, Content, Header, Left, Right, Body, Icon,
  Title, Text, List, ListItem, Tabs, Tab, TabHeading, Thumbnail,
  
} from 'native-base';
import api from '../shared/server_address'
import IconM from 'react-native-vector-icons/Ionicons'
IconM.loadFont()

class RentList extends Component {
  state = {
    token: '',
    myId: '',
    onrent: [], //user's providing list
    completedrent: [], //user's asking list
  }

  makeIndexList(posts) {
    return posts.map((post) => {
      console.log(post.title)
      return (
        <ListItem thumbnail key={post.post_info.id} button
          onPress={() => {console.log('not already exist booking_show') } }>
          <Left>
            <Thumbnail square source={{ uri: post.post_info.image }} />
          </Left>
          <Body>
            <Text>{post.post_info.title}</Text> {/* 예약한 product title*/ }
            <Text note numberOfLines={1}>{post.post_info.body}</Text> {/* 대여기간 및 대여가격 */}
          </Body>
        </ListItem>
      )
    })
  }

  onrentRequest() {
    api
      .get(`/bookings?type=rent`, {
        headers: {
          'Authorization': this.state.token
        }
      })
      .then((res) => {
        this.setState({ posts1: res.data }, () => { })
      })
      .catch(function (e) {
        console.log('send post failed!!!!' + e)
        Alert.alert("요청 실패", e.response.data.error, [{ text: '확인', style: 'cancel' }])
      })
  }

  completedrentRequest() {
    api
      .get(`/bookings?type=completed`, {
        headers: {
          'Authorization': this.state.token
        }
      })
      .then((res) => {
        this.setState({ posts2: res.data }, () => { })
      })
      .catch(function (e) {
        console.log('send post failed!!!!' + e)
        Alert.alert("요청 실패", e.response.data.error, [{ text: '확인', style: 'cancel' }])
      })
  }

  getToken = async () => {
    const value = await AsyncStorage.getItem("token")
    this.state.token = value
    this.onrentRequest();
    this.completedrentRequest();
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
          <Body><Title>대여 목록</Title></Body>
          <Right></Right>
        </Header>

        <ScrollView>
          <Content>
            <Tabs>
              <Tab heading={<TabHeading transparent><Text>대여 중</Text></TabHeading>}>
                <Content>
                  <List>
                    {this.makeIndexList(this.state.onrent)}
                  </List>
                </Content>
              </Tab>
              <Tab heading={<TabHeading transparent><Text>지난 대여</Text></TabHeading>}>
                <Content>
                  <List>
                    {this.makeIndexList(this.state.completedrent)}
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
});

export default RentList;