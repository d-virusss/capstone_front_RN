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
import IconM from 'react-native-vector-icons/MaterialIcons';

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
    loading: false,
    refreshing: '',
    show_popover: false,
    isCompany: false,
    company_id: -1,
    avg_rating : undefined,
    review_count : undefined
  };

  getToken = async () => {
    let value = await AsyncStorage.getItem("token")
    let id = await AsyncStorage.getItem('user_id')
    this.state.my_id = id
    this.state.token = value
    console.log(this.state)
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
        this.state.group = res.data.user_info.group || "ajou"
        this.state.profile_image = res.data.user_info.image
        this.state.isCompany = res.data.user_info.is_company
        this.state.avg_rating = res.data.user_info.avg
        this.setState({ loading: true })
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
        <TouchableOpacity
          onPress={() => this.setState({ show_popover: false }, () => {
            // this.props.navigation.navigate("SettingMyInfo", { post: posts })
          })}>
          <Text style={styles.popoverel}>신고하기</Text>
        </TouchableOpacity>
      </Popover>
    )
  }

  renderFollowButton(){
    if(this.state.my_id === this.profile_id){
      return
    }
    else{
      <Button bordered style={{
        position: 'absolute', right: '10%', backgroundColor: 'white',
        borderColor: 'black'
      }}>
        <Text style={{ fontWeight: 'bold', color: 'black' }}>관심유저 등록</Text>
      </Button>
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

        <ScrollView refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh} />}>
          <Content>
            <List>
              <ListItem
                thumbnail
                style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', marginLeft: '5%', paddingTop: '3%' }}>
                <TouchableOpacity style={{ flexDirection: 'row' }}
                  onPress={() => { this.props.navigation.navigate('ProfileShow'), { post: posts } }}>
                  <Thumbnail source={{ uri: this.state.profile_image }} />
                  <Body style={{ marginLeft: '5%' }}>
                    <View style={{ flexDirection: 'row' }}>
                      <Text>{this.state.nickname}</Text>
                      <Text note numberOfLines={1}>
                        {this.state.group}
                      </Text>
                    </View>
                    <View sylte={{ flexDirection: 'row' }}>
                      <Text note numberOfLines={2} style={{ paddingTop: '2%' }}>
                        {this.state.location}
                      </Text>
                    </View>
                  </Body>
                </TouchableOpacity>
              </ListItem>

              <ListItem
                style={{ flexDirection: 'column', justifyContent: 'center', height: 100, marginTop: '3%' }}>
                  <Text>사용자 리뷰 평점{'\n'}</Text>
                  <Text>dfa</Text>
              </ListItem>

              <Separator bordered style={{ height: '1%' }}></Separator>

              <ListItem button style={{ height: 75 }}
                onPress={() => { { this.props.navigation.navigate('MyPage_Location') } }}>
                <Left>
                  <Icon type="Ionicons" name="location-sharp" />
                  <Text style={styles.listText}> 제공 상품</Text>
                </Left>
                <Right>
                  <Icon type="AntDesign" name="right" />
                </Right>
              </ListItem>

              <ListItem button onPress={() => { this.partnerCheckNavigate() }}>
                <Left>
                  <Icon type="AntDesign" name="addusergroup" />
                  <Text style={styles.listText}>요청 상품</Text>
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
  }
});
export default ProfileShow;
