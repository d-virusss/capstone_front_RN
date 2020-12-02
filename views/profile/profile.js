import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, RefreshControl, ScrollView, Alert } from 'react-native';
import {
  Container, Header, Left, Body, Right, Button, Icon, Title, Text, Thumbnail,
  Footer, FooterTab, Content, ListItem, List, Separator
} from 'native-base';
import { CommonActions, StackActions } from '@react-navigation/native';
import Popover from 'react-native-popover-view';
import api from '../shared/server_address';
import Fire from '../shared/Fire';
import Spinner from 'react-native-loading-spinner-overlay';
import IconM from 'react-native-vector-icons/MaterialIcons';
import { Rating } from 'react-native-elements'

IconM.loadFont();

var posts = [];

class ProfileShow extends Component {
  profile_id = this.props.route.params.user_id
  state = {
    my_id: '',
    token: '',
    nickname: '',
    location: '',
    group: '',
    profile_image: '',
    loading: true,
    refreshing: '',
    show_popover: false,
    isCompany: false,
    company_id: -1,
    avg_rating : undefined,
    received_reviews_count : undefined,
    is_my_profile : undefined,
    like_check : undefined,
  };

  getToken = async () => {
    let value = await AsyncStorage.getItem("token")
    let id = await AsyncStorage.getItem('user_id')
    this.state.my_id = parseInt(id)
    this.state.token = value

    this.setState({ is_my_profile : (this.profile_id === this.state.my_id ? true : false) }, () => console.log(this.state))
    this.getMyInfo();
  }

  componentDidMount() {
    console.log("profile show--------------------")
    console.log(this.profile_id)
    this.getToken();
  }

  getMyInfo = () => {
    api
      .get(`/users/${this.profile_id}`, {
        headers: {
          Authorization: this.state.token,
        },
      })
      .then((res) => {
        console.log(res)
        this.state.nickname = res.data.user_info.nickname
        this.state.location = res.data.user_info.location_title
        this.state.group = res.data.user_info.group || "소속 없음"
        this.state.profile_image = res.data.user_info.image
        this.state.isCompany = res.data.user_info.is_company
        this.state.avg_rating = res.data.user_info.avg
        this.state.received_reviews_count = res.data.user_info.received_reviews_count
        this.state.like_check = res.data.user_info.like_check
        this.setState({ loading: false })
      })
      .catch((err) => {
        console.log("my page err")
        Alert.alert("요청 실패", err.response.data.error || err.response.data.message, [
          { text: '확인', style: 'cancel' }])
      })
  }

  renderPopover() {
    return (
      <Popover
        isVisible={this.state.show_popover}
        onRequestClose={() => this.setState({ show_popover: false })}
        from={(
          <TouchableOpacity onPress={() => this.setState({ show_popover: true })}>
            <Icon name="menu" />
          </TouchableOpacity>
        )}>
        {!this.state.is_my_profile && <TouchableOpacity
          onPress={() => this.setState({ show_popover: false }, () => {
            // this.props.navigation.navigate("SettingMyInfo", { post: posts })
          })}>
          <Text style={styles.popoverel}>신고하기</Text>
        </TouchableOpacity>}
        {this.state.is_my_profile && <TouchableOpacity
          onPress={() => this.setState({ show_popover: false }, () => {
            // this.props.navigation.navigate("SettingMyInfo", { post: posts })
          })}>
          <Text style={styles.popoverel}>회원탈퇴</Text>
        </TouchableOpacity>}
      </Popover>
    )
  }

  userLikeRequest(){
    if(this.state.like_check) this.setState({ like_check: false, loading: true })
    else this.setState({ like_check: true })
    api
      .post('/users/like', {
        like:{
          target_id: this.profile_id,
          target_type: 'user'
        }
      },{
        headers: {
          'Authorization': this.state.token
        }
      })
      .then((res) => {
        this.setState({ loading: false })
        console.log('click 좋아요--------')
        console.log(res)
      })
      .catch((e) => {
        this.setState({ loading: false })
        console.log(e.response)
      })
  }

  renderFollowButton(){
    if(this.state.my_id === this.profile_id){
      return
    }
    else{
      if(this.state.like_check){
        return(
          <Button small bordered style={{
            position: 'absolute', right: '10%', backgroundColor: 'white', borderColor: 'black',
            width:100, justifyContent:'center'}}
            onPress={() => {this.userLikeRequest()}}
          >
            <Text style={{ color: 'black', fontWeight: 'bold',  }}>팔로우 취소</Text>
          </Button>
        )
      }
      else {
        return (
          <Button small style={{
            position: 'absolute', right: '10%', backgroundColor: '#ff3377', borderColor: 'black',
            width: 100, justifyContent: 'center'}}
            onPress={() => {this.userLikeRequest()}}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>팔로우</Text>
          </Button>
        )
      }
    }
  }

  renderReviewScore(){
    if(this.state.received_reviews_count === 0){
      return(
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon type="MaterialIcons" name="sick" style={{ marginTop: '3%' }}></Icon>
          <Text style={styles.no_review_text}>{"  "}받은 리뷰가 없습니다.</Text>
        </View>
      )
    }
    else{
      return(
        <View>
          <Text style={{ fontSize:20, fontWeight: 'bold', marginVertical: '1%' }}>{this.state.avg_rating}</Text>
          <Rating
            readonly
            fractions={1}
            startingValue={this.state.avg_rating}
            ratingCount={5}
            imageSize={20} />
        </View>
      )
    }
  }

  render() {
    return (
      <Container>
        <Header>
          <Left>
            <TouchableOpacity transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name='chevron-back' type='Ionicons' />
            </TouchableOpacity>
          </Left>
          <Body>
            <Title>프로필</Title>
          </Body>
          <Right>
            {this.renderPopover()}
          </Right>
        </Header>
        <Spinner visible={this.state.loading} />
        <ScrollView refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh} />}>
          <Content>
            <List>
              <ListItem
                thumbnail
                style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', marginLeft: '5%', paddingTop: '3%' }}>
                <Thumbnail source={{ uri: this.state.profile_image }} />
                <Body style={{ marginLeft: '5%' }}>
                  <View style={{ flexDirection: 'row', width: '80%' }}>
                    <Text numberOfLines={1}>{this.state.nickname}</Text>
                    {this.renderFollowButton()}
                  </View>
                  <Text note numberOfLines={1} style={{ marginTop: '1%' }}>
                    {this.state.group}
                  </Text>
                  <View sylte={{ flexDirection: 'row' }}>
                    <Text note numberOfLines={2} style={{ paddingTop: '2%' }}>
                      {this.state.location}
                    </Text>
                  </View>
                </Body>
              </ListItem>

              <ListItem
                style={{ flexDirection: 'column', justifyContent: 'center', height: 100, marginTop: '1%' }}>
                  <Text style={{ marginBottom : '1%' }}>받은 리뷰 평점</Text>
                  {this.renderReviewScore()}
              </ListItem>

              <Separator bordered style={{ height: '1%' }}></Separator>

              <ListItem onPress={() => { { this.props.navigation.navigate('ProfileProvide', {user_id: this.profile_id}) } }}>
                <Left>
                  <Icon type="MaterialCommunityIcons" name="receipt" />
                  <Text style={styles.listText}>등록 상품</Text>
                </Left>
                <Right>
                  <Icon type="AntDesign" name="right" />
                </Right>
              </ListItem>

              <ListItem onPress={() => { this.props.navigation.navigate('ProfileAsk', { user_id: this.profile_id }) }}>
                <Left>
                  <Icon type="Ionicons" name="hand-left-outline" />
                  <Text style={styles.listText}>요청 상품</Text>
                </Left>
                <Right>
                  <Icon type="AntDesign" name="right" />
                </Right>
              </ListItem>

              <ListItem onPress={() => { this.props.navigation.navigate('ReceivedReview', {user_id: this.profile_id}) }}>
                <Left>
                  <Icon type="MaterialCommunityIcons" name="comment-text-multiple-outline" />
                  <Text style={styles.listText}>받은 리뷰 확인하기</Text>
                </Left>
                <Right>
                  <Icon type="AntDesign" name="right" />
                </Right>
              </ListItem>
            </List>
          </Content>
        </ScrollView>
      </Container>
    );
  }
}


const styles = StyleSheet.create({
  btn: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'transparent',
  },
  listText: {
    marginLeft: '3%',
    marginVertical : '1%',
    fontSize : 16,
  },
  popoverel: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    margin: 5,
  },
  buttonFollow :{
    position: 'absolute', 
    right: '10%', 
    backgroundColor: 'white',
    borderColor: 'black',
  },
  buttonFollowed : {
    position: 'absolute',
    right: '10%',
    backgroundColor: '#ff3377',
  },
  textFollow : {
    fontWeight: 'bold', 
    color: 'black',
  },
  textFollowed : {
    fontWeight : 'bold',
    color: 'white',
  },
  no_review_text : {
    fontSize : 20,
    fontWeight : 'bold',
    marginTop : '3%',
  }
});
export default ProfileShow;
