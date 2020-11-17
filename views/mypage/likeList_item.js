import React, {Component} from 'react';
import {Text} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Header, ListItem, View, Container, Content, Body, Right, Spinner, Thumbnail, Left } from 'native-base';
import api from '../shared/server_address'

var like_item = [];

class LikeListItemScreen extends Component {
  state = {
    token: '',
    user_id: '',
    loading_item: true,
  };

  makeList() {
    return like_item.map((ele) => {
      return (
        <ListItem thumbnail key = {ele.like_info.id} button
        onPress = {() => this.showPostRequset(ele.like_info.target_id)}>
          <Body>
            <Text>{ele.like_info.title}</Text>
          </Body>
          <Right>
            <Text>보기</Text>
          </Right>
        </ListItem>
      );
    });
  }

  showPostRequset(id){
    api
      .get(`/posts/${id}`, { headers : {
        'Authorization': this.state.token
      }})
      .then(function(response) {
        console.log('success');
        this.props.navigation.navigate('PostShow', { post: response.data })
      }.bind(this))
      .catch((err) => {
        console.log("err : ", err)
        Alert.alert("요청 실패", err.response.data.error,[{text:'확인', style:'cancel'}])
      })
  }

  getToken = async () => {
    let token_value = AsyncStorage.getItem('token');
    let id_value = AsyncStorage.getItem('user_id');
    this.state.token = await token_value;
    this.state.user_id = await id_value;
  };

  componentDidMount() {
    this.GetRequest();
  }

  GetRequest = () => {
    this.getToken().then(() => {
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
            this.setState({loading_item: false});
          }.bind(this), // for this.setState
        )
        .catch(function (error) {
          console.log('failed: ' + error);
          Alert.alert("요청 실패", error.response.data.error,[{text:'확인', style:'cancel'}])
        });
    });
  };

  render() {
    if (this.state.loading_item) {
      return (
        <Container>
        <Header />
        <Content>
          <Spinner color='#ff3377' />
        </Content>
      </Container>
      );
    } else {
      return <View>{this.makeList()}</View>;
    }
  }
}

export default LikeListItemScreen;
