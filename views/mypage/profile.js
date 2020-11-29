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
  state = {
    token: '',
    myName: '',
    myLocation: '',
    myGroup: '',
    myImage: '',
    loading: false,
    refreshing: '',
    show_popover: false,
    isCompany: false,
    company_id: -1,
  };

  getToken = async () => {
    let value = await AsyncStorage.getItem("token")
    this.state.token = value
    // this.getMyInfo();
  }

  componentDidMount() {
    console.log("profile show--------------------")
    console.log(this.props.route.params)
    console.log(this)
    this.getToken();
  }

  getMyInfo = () => {
    api.get(`/users/`, {
      headers: {
        Authorization: this.state.token,
      },
    })
      .then((res) => {
        //console.log(res)
        this.state.myName = res.data.user_info.nickname;
        this.state.myLocation = res.data.user_info.location_title;
        this.state.myImage = res.data.user_info.image;
        this.state.myGroup = "ajou"
        posts = res.data.user_info;
        if (res.data.user_info.company_id)
          this.state.company_id = res.data.user_info.company_id;
        this.state.isCompany = res.data.user_info.is_company;
        this.setState({ loading: true })
      })
      .catch((err) => {
        console.log("my page err")
        Alert.alert("요청 실패", err.response.data.error, [{ text: '확인', style: 'cancel' }])
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
                  <Thumbnail source={{ uri: this.state.myImage }} />
                  <Body style={{ marginLeft: '5%' }}>
                    <View style={{ flexDirection: 'row' }}>
                      <Text>{this.state.myName}</Text>
                      <Text note numberOfLines={1}>
                        {this.state.myGroup}
                      </Text>
                      <Button style={{ position : 'absolute', right: '10%' }}>
                        <Text>관심유저 등록</Text>
                      </Button>
                    </View>
                    <View sylte={{ flexDirection: 'row' }}>
                      <Text note numberOfLines={2} style={{ paddingTop: '2%' }}>
                        {this.state.myLocation}
                      </Text>
                    </View>
                  </Body>
                </TouchableOpacity>
              </ListItem>

              <ListItem
                style={{ flexDirection: 'row', justifyContent: 'center', height: 100, marginTop: '3%' }}>
                  <Text>사용자 리뷰 평점</Text>
              </ListItem>

              <Separator bordered style={{ height: '1%' }}></Separator>

              <ListItem button onPress={() => { { this.props.navigation.navigate('MyPage_Location') } }}>
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
});
export default ProfileShow;
