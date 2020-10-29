import axios from 'axios';
import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import BottomTab from '../shared/bottom_tab';
import {
  Container,
  Tabs,
  Tab,
  TabHeading,
  Content,
  Header,
  Footer,
  Body,
  Right,
  Button,
  Icon,
  Title,
  FooterTab,
} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
const api = axios.create({ baseURL: 'http://53.35.9.144'});

let like_list = {
  post: {
    type: '',
    item: '',
  },
};

class LikeListScreen extends Component {
  state = {
    token: '',
  };

  getToken = async () => {
    console.log(this);
    let value = AsyncStorage.getItem('token');
    this.state.token = await value;
    console.log(this.state.token);
    this.likeListGetRequest();
  };

  componentDidMount() {
    console.log('component did mount ---');
    this.getToken();
  }

  likeListGetRequest() {
    console.log('Sending likeListGetRequest ...');
    api
      .get(`/users/${1}/likes`, {
        headers: {
          Authorization: this.state.token,
        },
      })
      .then(function (response) {
        console.log('request success!!');
        console.log(response);
      })
      .catch(function (error) {
        console.log('failed: ' + error);
      });
  }

  render() {
    return (
      <Container>
        <Content>
          <Tabs style={{marginTop: '0%'}}>
            <Tab
              heading={
                <TabHeading transparent>
                  <Text>전체</Text>
                </TabHeading>
              }
            />

            <Tab
              heading={
                <TabHeading transparent>
                  <Text>게시글</Text>
                </TabHeading>
              }
            />

            <Tab
              heading={
                <TabHeading transparent>
                  <Text>유저</Text>
                </TabHeading>
              }
            />

            <Tab
              heading={
                <TabHeading transparent>
                  <Text>지역</Text>
                </TabHeading>
              }
            />
          </Tabs>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  btn: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'transparent',
  },
});

export default LikeListScreen;
