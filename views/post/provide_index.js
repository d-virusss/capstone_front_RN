import React, {Component} from 'react';
import { Content, List, ListItem, Thumbnail, Text, Left, Body, Right, Button, Icon } from 'native-base';
import { ScrollView, RefreshControl,} from "react-native";
import {TouchableOpacity} from 'react-native-gesture-handler'
import AsyncStorage from '@react-native-community/async-storage';
import api from '../shared/server_address';
import number_delimiter from '../shared/number_delimiter'
import { DeviceEventEmitter } from 'react-native';

class ProvideIndex extends Component {
  constructor(props){
    super(props)
    this.state={
      token: '',
      posts: [],
      refreshing: '',
      id :0,
    }
  }

  _onRefresh = () => {
   
    console.log("제공 게시물 refresh")
    
    this.setState({refreshing: true});
    this.sendIndexRequest(this.state.id);
    this.setState({refreshing: false});
  }

  makeIndexList() {
    console.log("make index list")
    return this.state.posts.map((post) => {
      return(
        <TouchableOpacity onPress={() =>{this.props.navigation.navigate('PostShow', { post: post }) }}>
          <ListItem thumbnail key = {post.post_info.id}>
            <Left>
              <Thumbnail square source={{ uri: post.post_info.image }} />
            </Left>
            <Body>
              <Text style={{ marginBottom : 5 }}>{post.post_info.title}</Text>
              <Text note numberOfLines={1}>{post.location_info.title}  {post.post_info.created_at_ago}</Text>
              <Text style={{ marginTop : 10 }}>{number_delimiter(post.post_info.price)}원 / 일</Text>
            </Body>
            <Right style={{ flexDirection:'row'}}>
              <Icon name='heart-outline' type='MaterialCommunityIcons' style={{ fontSize:20 }}/>
              <Text style={{ marginLeft : 5 }}>
                {post.post_info.likes_count}
              </Text>
            </Right>
          </ListItem>
        </TouchableOpacity>
      )
    })
  }

  sendIndexRequest(id) {
    if(id == 0){ //for all
      api
      .get('/posts?post_type=provide', {
        headers: {
          Authorization: this.state.token,
        },
      })
      .then((res) => {
        console.log(res);
        this.setState({posts: res.data});
      })
      .catch(function (e) {
        console.log('send post failed!!!!' + e);
        Alert.alert("요청 실패", e.response.data.error,[{text:'확인', style:'cancel'}])
      });
    }else{
      api
      .get('/posts?post_type=provide', {
        headers: {
          Authorization: this.state.token,
        },
        params: {
          "q[category_id_eq]" : id,
        },
      })
      .then((res) => {
        console.log(res)
        this.setState({posts: res.data});
      })
      .catch(function (e) {
        console.log('category request failed!!!!' + e);
        Alert.alert("요청 실패", e.response.data.error,[{text:'확인', style:'cancel'}])
      });
    }
   
  }

  getToken = async () => {
    let value = await AsyncStorage.getItem('token');
    this.state.token = value;
    this.sendIndexRequest(this.state.id);
  };

  componentDidMount(){
    this.getToken()
    this.eventListener = DeviceEventEmitter.addListener('categoryId', this.handleEvent);
  }

  componentWillUnmount(){
    //remove listener
    this.eventListener.remove();
}

  handleEvent = (e) => {
    console.log("event handler")
    this.state.id = e.id;
    this.sendIndexRequest(this.state.id);
  }

  render() {
    console.log("render")
    console.log(this.props)
    return (
      <ScrollView style={{flex: 1}}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}/>}
      >
        <Content>
          <List>{this.makeIndexList()}</List>
        </Content>
      </ScrollView>
    );
  }
}


export default ProvideIndex;
