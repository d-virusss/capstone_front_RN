import React, {Component} from 'react';
import {Text, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Header, ListItem, List, Container, Content, Body, Right,Thumbnail, Left, Badge
} from 'native-base';
import number_delimiter from '../shared/number_delimiter'
import api from '../shared/server_address'
import Spinner from 'react-native-loading-spinner-overlay';

var like_item = [];

class LikeListItemScreen extends Component {
  state = {
    token: '',
    user_id: '',
    loading_item: true,
  };

  showPostRequset(id){
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
        .then((res)=>{
          console.log('request success!!');
          console.log(res)
          like_item = res.data;
          this.setState({loading_item: false});
        }// for this.setState
        )
        .catch((error)=>{
          console.log('failed: ' + error);
          Alert.alert("요청 실패", error.response.data.error,[{text:'확인', style:'cancel'}])
        });
    });
  };


  makeList() {
    return like_item.map((ele) => {
      return (
        <ListItem thumbnail key={ele.like_info.id} button
          onPress={() => this.props.navigation.push('PostShow', { post_id : ele.like_info.target_id })}>
          <Left>
            <Thumbnail square source={{ uri: ele.like_info.post_image }} />
          </Left>
          <Body>
            <Text>{ele.like_info.title}</Text>
            <Text note numberOfLines={1}>{number_delimiter(ele.like_info.price)}원 / 일 </Text>
          </Body>
          <Right>
            <Badge style={{ backgroundColor : '#ff3377', width: 50 }}>
              <Text style={{ color:'white', textAlign: 'center', fontWeight: 'bold' }}>보기</Text>
            </Badge>
          </Right>
        </ListItem>
      );
    });
  }

  render() {
    if (this.state.loading_item) {
      return (
        <Container>
          <Header />
          <Content>
            <Spinner visible={this.state.loading} color="#ff3377"/>
          </Content>
        </Container>
      );
    } else {
      return <ScrollView>{this.makeList()}</ScrollView>
    }
  }
}

export default LikeListItemScreen;
