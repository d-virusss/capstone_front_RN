import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, View } from 'react-native';
import {
  Container, Content, Header, Left, Right, Body, Icon,
  Title, Text, List, ListItem, Tabs, Tab, TabHeading,
  Thumbnail, Card, CardItem,
} from 'native-base';
import { Rating } from 'react-native-elements'
import api from '../shared/server_address'
import IconM from 'react-native-vector-icons/Ionicons'
IconM.loadFont()

class ReceivedReview extends Component {
  state = {
    token: '',
    myId: this.props.route.params.user_id,
    reviews : [],
  }

  componentDidMount() {
    this.getToken()
  }

  getToken = async () => {
    const value = await AsyncStorage.getItem("token")
    this.state.token = value
    this.receivedReviewRequest();
  }

  receivedReviewRequest() {
    api
      .get(`reviews?user_id=${this.state.myId}&received=true`, {
        headers: { 'Authorization': this.state.token }
      })
      .then((res) => {
        console.log(res)
        this.setState({ reviews: res.data })
      })
      .catch((err) => {
        console.log(err)
      })
  }

  renderReviews() {
    if (this.state.reviews.length == 0)
      return (<Card><CardItem><Title>등록된 리뷰가 없습니다.</Title></CardItem></Card>)
    return this.state.reviews.map((ele) => {
      let year = ele.review_info.created_at.substr(0, 4);
      let month = ele.review_info.created_at.substr(6, 2);
      let day = ele.review_info.created_at.substr(10, 2);
      let date = year + "." + month + "." + day
      return (
        <Card style={{ marginTop: '3%' }}>
          <CardItem style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', paddingTop: '3%' }}
            button onPress={() => { /*link to user profile show*/ }}>
            <TouchableOpacity onPress={() => { this.props.navigation.navigate("ProfileShow", {}) }}>
              <Thumbnail source={{ uri: ele.review_info.user_image }} />
            </TouchableOpacity>
            <Body style={{ marginLeft: '5%' }} >
              <View style={{ flexDirection: 'row' }}>
                <Rating readonly
                  startingValue={ele.review_info.rating}
                  ratingCount={5}
                  imageSize={18}
                  style={{ paddingVertical: 10 }} />
                <Title style={{ margin: '3%' }}> {ele.review_info.rating}</Title>
              </View>
              <View>
                <Text style={styles.post_category}>{ele.review_info.user_nickname} / {date}</Text>
              </View>
            </Body>
          </CardItem>

          <CardItem>
            <Body>
              <Text>{ele.review_info.body}</Text>
            </Body>
          </CardItem>
        </Card>
      );
    });
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
          <Body><Title>받은 리뷰</Title></Body>
          <Right></Right>
        </Header>

        <Content style={{ paddingHorizontal : '3%'}}>
          <List>
            {this.renderReviews()}
          </List>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
});

export default ReceivedReview;