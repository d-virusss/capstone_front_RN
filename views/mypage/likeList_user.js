import React, {Component} from 'react';
import {Text, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Header, ListItem, View, Left, Thumbnail, Body, Right, Container, Content, Badge
} from 'native-base';
import api from '../shared/server_address'
import Spinner from 'react-native-loading-spinner-overlay';

var like_user = [];

class LikeListUserScreen extends Component {
  state = {
    token: '',
    user_id: '',
    loading: true,
  };

  makeList() {
    return like_user.map((ele) => {
      return (
        <ListItem thumbnail key = {ele.like_info.id} button
        onPress = {() => this.props.navigation.push("ProfileShow", { user_id: ele.like_info.target_id})}
        // onPress={() => console.log(ele.like_info.target_id)}
        >
          <Left>
            <Thumbnail square source={ele.like_info.image=='/image/default.png' ? require('../../assets/default.png') : {uri: ele.like_info.image}} />
          </Left>
          <Body>
            <Text>{ele.like_info.name}</Text>
            <Text note numberOfLines={1}>
              {ele.like_info.group}
            </Text>
          </Body>
          <Right>
            <Badge style={{ backgroundColor: '#ff3377', width: 50 }}>
              <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>보기</Text>
            </Badge>
          </Right>
        </ListItem>
      );
    });
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
        .get(`/users/${this.state.user_id}/likes?target_type=user`, {
          headers: {
            Authorization: this.state.token,
          },
        })
        .then((response)=>{
            console.log('request success!!');
            console.log(response)
            like_user = response.data;
            this.setState({loading: false});
          } // for this.setState
        )
        .catch((error) => {
          console.log('failed: ' + error);
          Alert.alert("요청 실패", error.response.data.error,[{text:'확인', style:'cancel'}])
        });
    });
  };

  render() {
    if (this.state.loading) {
      return (
        <Container>
          <Header />
            <Content>
            <Spinner visible={this.state.loading} color="#ff3377" />
            </Content>
      </Container>
      );
    } else {
      return <ScrollView>{this.makeList()}</ScrollView>;
    }
  }
}

export default LikeListUserScreen;
