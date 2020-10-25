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

const api = axios.create({baseURL: 'http://52.79.179.211'});

class LikeListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
    };
  }

  likeListGetRequest() {
    console.log('Sending likeListGetRequest ...');
    // api
    //   .get('/users//likes', user)
    //   .then(function (response) {
    //     console.log('success : ' + response);
    //   })
    //   .catch(function (error) {
    //     console.log('failed: ' + error);
    //   });
  }

  render() {
    this.likeListGetRequest();
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
