import AsyncStorage from '@react-native-community/async-storage';
import React, {Component} from 'react';
import {Container, Content, Header, Left, Right, Body, Icon,
  Button, Text, View, List, ListItem, Tabs, Tab, TabHeading,
  Thumbnail
} from 'native-base';
import IconA from 'react-native-vector-icons/Ionicons';
import IconFe from 'react-native-vector-icons/Feather';
import { TouchableOpacity } from 'react-native-gesture-handler';
import api from '../shared/server_address'

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
            <Thumbnail square source={post.image.url=='/image/default.png' ? require('../../assets/default.png') : { uri: post.image.url }} />
          </Left>
          <Body>
            <Text>{post.title}</Text>
            <Text note numberOfLines={1}>{post.body}</Text>
          </Body>
          <Right>
            <Button transparent onPress={() => this.showPostRequset(post.id)}>
              <Text>보기</Text>
            </Button>
          </Right>
        </ListItem>
      )
    })
  }

  showPostRequset(id){
    console.log("show request")
    api
      .get(`/posts/${id}`, { headers : {
        'Authorization': this.state.token
      }})
      .then(function(response) {
        console.log('success');
        this.props.navigation.push('PostShow', { post: response.data })
      }.bind(this))
      .catch((err) => {
        console.log("err : ", err)
        Alert.alert("요청 실패", err.response.data.error,[{text:'확인', style:'cancel'}])
      })
  }

  sendProvideIndexRequest() {
    api
      .get(`/users/${this.props.profile_id}/list?post_type=provide`, {
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
        Alert.alert("요청 실패", e.response.data.error,[{text:'확인', style:'cancel'}])
      })
  }

  sendAskIndexRequest() {
    api
      .get(`/users/${this.props.profile_id}/list?post_type=ask`, {
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
        Alert.alert("요청 실패", e.response.data.error,[{text:'확인', style:'cancel'}])
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
  const {profile_id, profile_nickname} = route.params;
  return(
    <Container>
      <Header style = {{height : 40}}>
        <Left>
          <Button transparent onPress = {() => navigation.goBack()}>
            <Icon name = 'chevron-back' type = 'Ionicons'/>
          </Button>
        </Left>
        <Body>
          <Text style = {{fontSize : 20}}>글 목록</Text>
        </Body>
        <Right>
        </Right>
      </Header>
      <UserListIndex profile_id = {profile_id} profile_nickname = {profile_nickname}  navigation = {navigation}/>
    </Container>
  );
}

export default profileShowList;