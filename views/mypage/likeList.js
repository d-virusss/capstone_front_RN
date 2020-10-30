import React, {Component} from 'react';
import {Text, StyleSheet} from 'react-native';
import {Container, Tabs, Tab, TabHeading, Content} from 'native-base';
import LikeListUserScreen from './likeList_user';
import LikeList_Item from './likeList_item';

class LikeListScreen extends Component {
  render() {
    return (
      <Container>
        <Content>
          <Tabs style={{marginTop: '0%'}}>
            <Tab
              heading={
                <TabHeading transparent>
                  <Text>품목</Text>
                </TabHeading>
              }>
              <LikeList_Item></LikeList_Item>
            </Tab>

            <Tab
              heading={
                <TabHeading transparent>
                  <Text>유저</Text>
                </TabHeading>
              }>
              <LikeListUserScreen></LikeListUserScreen>
            </Tab>
          </Tabs>
        </Content>
      </Container>
    );
  }
}

export default LikeListScreen;
