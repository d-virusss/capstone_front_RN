import React, {Component} from 'react';
import { Content, List, ListItem, Thumbnail, Text, Left, Body, Right, Button, Icon } from 'native-base';
import { ScrollView, RefreshControl, DeviceEventEmitter, View } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import { TouchableOpacity } from 'react-native-gesture-handler';
import api from '../shared/server_address'
import number_delimiter from '../shared/number_delimiter'

var searchModel= {
  id : '', // category_id (default 0)
  content : '',
}

class AskIndex extends Component{
  state = {
    token : '',
    posts : [],
    refreshing: false,
    id:0,
  }

  _onRefresh = () => {

    console.log("요청 게시물 refresh")

    this.setState({ refreshing: true });
    this.sendIndexRequest();
    this.setState({ refreshing: false });
  }

  //category_id = this.props.

  makeIndexList() {
    return this.state.posts.map((post) => {
      return (
        <TouchableOpacity onPress={() => this.props.navigation.navigate('PostShow', { post: post })} key={post.post_info.id}>
          <ListItem thumbnail>
            <Left>
              <Thumbnail square source={{ uri: post.post_info.image }} />
            </Left>
            <Body>
              <Text style={{ marginBottom: 5, fontWeight: 'bold' }}>{post.post_info.title}</Text>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 15, fontWeight: '300' }}>{post.user.user_info.nickname}</Text>
                <Text note numberOfLines={1}>{post.location_info.title}  {post.post_info.created_at_ago}</Text>
              </View>
              <Text style={{ marginTop: 10 }}>{number_delimiter(post.post_info.price)}원 / 일</Text>
            </Body>
            <Right style={{ flexDirection: 'row' }}>
              <Icon name='heart-outline' type='MaterialCommunityIcons' style={{ fontSize: 20 }} />
              <Text style={{ marginLeft: 5 }}>
                {post.post_info.likes_count}
              </Text>
            </Right>
          </ListItem>
        </TouchableOpacity>
      )
    })
  }

  sendIndexRequest() {
    if(searchModel.id == 0){
      api
      .get('/posts?post_type=ask', {
        headers: {
          Authorization: this.state.token,
        },
        params: {
          "q[title_or_body_cont]" : searchModel.content,
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

      return;
    }
    api
      .get('/posts?post_type=ask', {
        headers: {
          Authorization: this.state.token,
        },
        params: {
          "q[category_id_eq]" : searchModel.id,
          "q[title_or_body_cont]" : searchModel.content,
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
  }

  getToken = async () => {
    let value = await AsyncStorage.getItem("token")
    this.state.token = value
    this.sendIndexRequest()
  }

  componentDidMount() {
    this.getToken()
    this.eventListener = DeviceEventEmitter.addListener('categoryId', this.catetoryEventHandler);
    this.eventListener = DeviceEventEmitter.addListener('searchContent', this.searchEventHandler)
  }

  componentWillUnmount(){
    this.eventListener.remove();
}

  catetoryEventHandler = (e) => {
    console.log("category event handler_ask")
    searchModel.id = e.id;
    this.sendIndexRequest();
  }

  searchEventHandler = (e) => {
    console.log("search event handler_ask");
    searchModel.content = e.search;
    this.sendIndexRequest();
  }

  render(){
    return(
      <ScrollView style={{ flex: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh} />}
      >
        <Content>
          <List>{this.makeIndexList()}</List>
        </Content>
      </ScrollView>
    );
  }
}

function AskIndexScreen({ navigation }) {
  return <AskIndex navigation={navigation} />;
}

export default AskIndexScreen;