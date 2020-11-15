import React, {Component} from 'react';
import {Text} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Header, ListItem, View, Left, Thumbnail, Body, Right, Spinner, Container, Content} from 'native-base';
import api from '../shared/server_address'

var like_user = [];

class LikeListUserScreen extends Component {
  state = {
    token: '',
    user_id: '',
    loading: true,
  };

  makeList() {
    return like_user.map((ele) => {
      console.log(ele)
      return (
        <ListItem thumbnail key = {ele.like_info.id} button
        onPress = {() => this.props.navigation.navigate("ProfileShow", { other_id: ele.like_info.target_id})}>
          <Left>
            <Thumbnail square source={{uri: ele.like_info.image}} />
          </Left>
          <Body>
            <Text>{ele.like_info.name}</Text>
            <Text note numberOfLines={1}>
              {ele.like_info.group}
            </Text>
          </Body>
          <Right>
            <Text>보기</Text>
          </Right>
        </ListItem>
      );
    });
  }

  getToken = async () => {
    console.log(this);
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
        .get(`/users/${this.state.user_id}/likes?target_type=user`, {
          headers: {
            Authorization: this.state.token,
          },
        })
        .then(
          function (response) {
            console.log('request success!!');
            like_user = response.data;
            this.setState({loading: false});
          }.bind(this), // for this.setState
        )
        .catch(function (error) {
          console.log('failed: ' + error);
        });
    });
  };

  render() {
    if (this.state.loading) {
      return (
        <Container>
        <Header />
        <Content>
          <Spinner color='green' />
        </Content>
      </Container>
      );
    } else {
      return <View>{this.makeList()}</View>;
    }
  }
}

export default LikeListUserScreen;
