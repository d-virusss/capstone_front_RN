import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import React, {Component} from 'react';
import {Container, Content, Header, Left, Right, Body, Icon,
  Button, Text, View, List, ListItem, Tabs, Tab, TabHeading,
  Thumbnail
} from 'native-base';
import IconA from 'react-native-vector-icons/Ionicons';
import IconFe from 'react-native-vector-icons/Feather';
import { TouchableOpacity } from 'react-native-gesture-handler';

const api = axios.create({ baseURL: 'http://3.35.9.144' });

class UserListIndex extends Component{
  state = {
    token : '',
    posts1 : [], //user's providing list
    posts2 : [], //user's asking list
  }

  makeIndexList(posts){
    return posts.map((post) => {
      return(
        <ListItem thumbnail key={post.id}>
          <Left>
            <Thumbnail square source={{ uri: post.image.url }} />
          </Left>
          <Body>
            <Text>{post.title}</Text>
            <Text note numberOfLines={1}>{post.body}</Text>
          </Body>
          <Right>
            <Button transparent onPress={() => this.props.navigation.navigate('ProfilePostShow')}>
              <Text>보기</Text>
            </Button>
          </Right>
        </ListItem>
      )
    })
  }

  sendProvideIndexRequest() {
    api
      .get(`/users/${this.props.other_id}/list?post_type=provide`, {
        headers: {
          'Authorization': this.state.token
        }
      })
      .then((res) => {
        console.log("index send success!")
        this.setState({posts1:res.data.posts}, ()=> { })
      })
      .catch(function (e) {
        console.log('send post failed!!!!' + e)
      })
  }

  sendAskIndexRequest() {
    api
      .get(`/users/${this.props.other_id}/list?post_type=ask`, {
        headers: {
          'Authorization': this.state.token
        }
      })
      .then((res) => {
        console.log("index send success!")
        this.setState({posts2:res.data.posts}, ()=> { })
      })
      .catch(function (e) {
        console.log('send post failed!!!!' + e)
      })
  }

  getToken = async () => {
    const value = await AsyncStorage.getItem("token")
    this.state.token = value
    this.sendProvideIndexRequest();
    this.sendAskIndexRequest();
  }

  componentDidMount(){
    this.getToken()
  }

  render(){
    return(
      <Tabs>
        <Tab heading={ <TabHeading transparent><Text>제공</Text></TabHeading>}>
          <Content>
            <List>
              {this.makeIndexList(this.state.posts1)}
            </List>
          </Content>
        </Tab>
        <Tab heading={ <TabHeading transparent><Text>대여</Text></TabHeading>}>
          <List>
            {this.makeIndexList(this.state.posts2)}
          </List>
        </Tab>
        </Tabs>
    );
  }
}

function profileShowList({route, navigation}){
  const {other_id, other_nickname} = route.params;
  return(
    <Container>
      <Header style = {{height : 40}}>
        <Left>
          <Button transparent onPress = {() => navigation.goBack()}>
            <Icon name = 'chevron-back' type = 'Ionicons'/>
          </Button>
        </Left>
        <Body>
          <Text style = {{fontSize : 17}}>상대방 프로필</Text>
        </Body>
        <Right>
        </Right>
      </Header>
      <UserListIndex other_id = {other_id} other_nickname = {other_nickname}  navigation = {navigation}/>
    </Container>
  );
}

export default profileShowList;