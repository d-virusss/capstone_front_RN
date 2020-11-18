import React, {Component} from 'react';
import {View, StyleSheet, TouchableOpacity } from 'react-native';
import BottomTab from '../shared/bottom_tab';
import { Container, Header, Left, Body, Right, Button, Icon, Title, 
  Text, Thumbnail, Footer, FooterTab, Content, ListItem, List, Separator, 
  Card, CardItem, 
} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../shared/server_address'
import FormData from 'form-data'

class PostReportScreen extends Component {
  post = this.props.route.params

  getToken = async () => {
    let value = await AsyncStorage.getItem("token")
    this.state.token = value
    console.log(this.state.token)
  }

  componentDidMount() {
    this.getToken()
    console.log(post)
    console.log("component did mount --- report")
  }
  
  goToSetLocation() {
    this.props.navigation.navigate('MyPage_Location');
    console.log('Navigation router run...');
  }

  Logout() {
    console.log(this.props)
    this.props.navigation.navigate('Logins');
  }

  ShowLikeList() {
    this.props.navigation.navigate('Like_List');
  }

  SettingGroup(){
    this.props.navigation.navigate('SettingGroup')
  }

  render() {
    const uri =
      'https://facebook.github.io/react-native/docs/assets/favicon.png';

    return (
      <Container>

        <Header>
          <Left>
            <TouchableOpacity transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name='chevron-back' type='Ionicons' />
            </TouchableOpacity>
          </Left>
          <Body><Title>신고하기</Title></Body>
          <Right></Right>
        </Header>

        <Content>
          <List>
          <ListItem
              button
              onPress={()=>{this.SettingGroup()}}>
              <Left>
                <Icon type="AntDesign" name="addusergroup" />
                <Text> 사용자 신고</Text>
              </Left>
              <Right>
                <Icon type="AntDesign" name="right" />
              </Right>
            </ListItem>

            <Separator bordered></Separator>

            <ListItem
              button
              onPress={()=>{this.SettingGroup()}}>
              <Left>
                <Icon type="AntDesign" name="addusergroup" />
                <Text> 신고 이유1</Text>
              </Left>
              <Right>
                <Icon type="AntDesign" name="right" />
              </Right>
            </ListItem>

            <ListItem noIndent style={{backgroundColor: '#cde1f9'}}>
              <Left>
                <Icon type="Feather" name="bell" />
                <Text> 이유2</Text>
              </Left>
              <Right>
                <Icon type="AntDesign" name="right" />
              </Right>
            </ListItem>

            <ListItem>
              <Left>
                <Icon type="Feather" name="list" />
                <Text> 이유3</Text>
              </Left>
              <Right>
                <Icon type="AntDesign" name="right" />
              </Right>
            </ListItem>

            <ListItem
              button
              onPress={() => {
                this.Logout();
              }}>
              <Left>
                <Icon type="AntDesign" name="logout" />
                <Text> 이유4</Text>
              </Left>
              <Right>
                <Icon type="AntDesign" name="right" />
              </Right>
            </ListItem>
          </List>
        </Content>

        <Footer>
          <FooterTab>
            <View style={{flex: 1, backgroundColor: 'white'}}>
              <BottomTab navigation={this.props.navigation}></BottomTab>
            </View>
          </FooterTab>
        </Footer>
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
export default PostReportScreen;
