import React, {Component} from 'react';
import { Content, List, ListItem, Thumbnail, Text, Left, Body, Right, Button } from 'native-base';
import { ScrollView } from "react-native";
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../shared/server_address';
class ProvideIndex extends Component {
  state = {
    token: '',
    posts: [],
  };

  makeIndexList() {
    console.log(this.state.posts);
    return this.state.posts.map((post) => {
      return(
        <TouchableOpacity onPress={() => this.props.navigation.navigate('PostShow', { post: post }) } key={post.post_info.id}>
          <ListItem thumbnail>
            <Left>
              <Thumbnail square source={{ uri: post.post_info.image }} />
            </Left>
            <Body>
              <Text>{post.post_info.title}</Text>
              <Text note numberOfLines={1}>{post.post_info.body}</Text>
            </Body>
            <Right>
            </Right>
          </ListItem>
        </TouchableOpacity>
      )
    })
  }

  sendIndexRequest() {
    api
      .get('/posts?post_type=provide', {
        headers: {
          Authorization: this.state.token,
        },
      })
      .then((res) => {
        console.log('index send success!');
        console.log(res);
        this.setState({posts: res.data}, () => {});
      })
      .catch(function (e) {
        console.log('send post failed!!!!' + e);
      });
  }

  getToken = async () => {
    let value = await AsyncStorage.getItem('token');
    this.state.token = value;
    this.sendIndexRequest();
  };

  componentDidMount(){
    this.getToken()
  }

  render() {
    return (
      <ScrollView style={{flex: 1}}>
        <Content>
          <List>{this.makeIndexList()}</List>
        </Content>
      </ScrollView>
    );
  }
}

function ProvideIndexScreen({navigation}) {
  return <ProvideIndex navigation={navigation} />;
}

export default ProvideIndexScreen;
