import AsyncStorage from '@react-native-community/async-storage';
import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, ScrollView, View} from 'react-native';
import {Container, Content, Header, Left, Right, Body, Icon,
  Title, Text, List, ListItem, Tabs, Tab, TabHeading,
  Thumbnail,
} from 'native-base';
import api from '../shared/server_address'
import IconM from 'react-native-vector-icons/Ionicons'
IconM.loadFont()

class myItemListScreen extends Component{
  state = {
    token : '',
    myId:'',
    posts1 : [], //user's providing list
    posts2 : [], //user's asking list
  }

  makeIndexList(posts){
    return posts.map((post) => {
      console.log(post.title)
      return(
        <ListItem thumbnail key={post.post_info.id} button
        onPress={() => this.showPostRequset(post.post_info.id)}>
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

  showPostRequset(id){
    console.log("show request")
    api
      .get(`/posts/${id}`, { headers : {
        'Authorization': this.state.token
      }})
      .then(function(response) {
        this.props.navigation.navigate('PostShow', { post: response.data })
      }.bind(this))
      .catch((err) => {
        console.log("err : ", err)
        Alert.alert("요청 실패", err.response.data.error,[{text:'확인', style:'cancel'}])
      })
  }

  sendProvideIndexRequest() {
    api
      .get(`/users/${this.state.myId}/list?post_type=provide`, {
        headers: {
          'Authorization': this.state.token
        }
      })
      .then((res) => {
        this.setState({posts1:res.data}, ()=> { })
      })
      .catch(function (e) {
        console.log('send post failed!!!!' + e)
        Alert.alert("요청 실패", e.response.data.error,[{text:'확인', style:'cancel'}])
      })
  }

  sendAskIndexRequest() {
    api
      .get(`/users/${this.state.myId}/list?post_type=ask`, {
        headers: {
          'Authorization': this.state.token
        }
      })
      .then((res) => {
        this.setState({posts2:res.data}, ()=> { })
      })
      .catch(function (e) {
        console.log('send post failed!!!!' + e)
        Alert.alert("요청 실패", e.response.data.error,[{text:'확인', style:'cancel'}])
      })
  }

  getToken = async () => {
    const value = await AsyncStorage.getItem("token")
    const id =  await AsyncStorage.getItem("user_id")
    this.state.token = value
    this.state.myId = id
    this.sendProvideIndexRequest();
    this.sendAskIndexRequest();
  }

  componentDidMount(){
    this.getToken()
  }

  render(){
    return(
      <View>
         <Header>
          <Left>
            <TouchableOpacity transparent onPress = {() => this.props.navigation.goBack()}>
              <Icon name = 'chevron-back' type = 'Ionicons'/>
            </TouchableOpacity>
          </Left>
          <Body><Title>글 관리</Title></Body>
          <Right></Right>
        </Header>

        <ScrollView>
        <Content>
        <Tabs>
          <Tab heading={ <TabHeading transparent><Text>제공</Text></TabHeading>}>
              <Content>
              <List>
                {this.makeIndexList(this.state.posts1)}
              </List>
              </Content>
          </Tab>
          <Tab heading={ <TabHeading transparent><Text>대여</Text></TabHeading>}>
           <Content>
            <List>
              {this.makeIndexList(this.state.posts2)}
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
  footer: {
    position: 'absolute',
    flex:0.1,
    left: 0,
    right: 0,
    bottom: -5,
    backgroundColor:'#50cebb',
    flexDirection:'row',
    height:80,
    alignItems:'center',
  },
  bottomButtons: {
    alignItems:'center',
    justifyContent: 'center',
    flex:1,
  },
  footerText: {
    color:'white',
    fontWeight:'bold',
    alignItems:'center',
    fontSize:18,
  },
 });

export default myItemListScreen;