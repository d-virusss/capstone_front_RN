import React, {Component} from 'react';
import {Text} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { List, ListItem, View, Left, Thumbnail, Body, Right, Button } from 'native-base';
import api from '../shared/server_address'

var like_item = [];

class LikeListItemScreen extends Component {
  state = {
    token: '',
    user_id: '',
    loading: true,
  };

  makeList() {
    return like_item.map((ele) => {
      console.log(ele.like_info.target_id);
      return (
        <ListItem thumbnail key>
          <Body>
            <Text>{ele.like_info.title}</Text>
          </Body>
          <Right>
            <Button transparent 
            onPress = {() => this.showPostRequset(ele.like_info.target_id)}>
              <Text>보기</Text>
            </Button>
          </Right>
        </ListItem>
      );
    });
  }

  showPostRequset(id){
    console.log("show request")
    api
      .get(`/posts/${id}`, { headers : {
        'Authorization': this.state.token
      }})
      .then(function(response) {
        console.log('success');
        console.log(response)
        this.props.navigation.navigate('PostShow', { post: response.data })
      }.bind(this))
      .catch((err) => console.log("err : ", err))
  }

  getToken = async () => {
    let token_value = AsyncStorage.getItem('token');
    let id_value = AsyncStorage.getItem('user_id');
    this.state.token = await token_value;
    this.state.user_id = await id_value;
    console.log(this.state.token);
  };

  componentDidMount() {
    console.log('component did mount ---');
    this.GetRequest();
  }

  GetRequest = () => {
    this.getToken().then(() => {
      console.log('Sending likeListGetRequest ...');
      api
        .get(`/users/${this.state.user_id}/likes?target_type=post`, {
          headers: {
            Authorization: this.state.token,
          },
        })
        .then(
          function (response) {
            console.log('request success!!');
            like_item = response.data;
            this.setState({loading: false});
            console.log(like_item);
          }.bind(this), // for this.setState
        )
        .catch(function (error) {
          console.log('failed: ' + error);
        });
    });
  };

  render() {
    if (this.state.loading) {
      console.log('loading...');
      return null;
    } else {
      console.log('show');
      return <View>{this.makeList()}</View>;
    }
  }
}

export default LikeListItemScreen;
