import AsyncStorage from '@react-native-community/async-storage';
import React, {Component} from 'react';
import {View, StyleSheet, TouchableOpacity, RefreshControl, ScrollView, Alert} from 'react-native';
import BottomTab from '../shared/bottom_tab';
import { Container, Header, Left, Body, Right, Button, Icon, Title, Text, Thumbnail,
       Footer, FooterTab, Content, ListItem, List, Separator } from 'native-base';
import { CommonActions, StackActions } from '@react-navigation/native';
import Popover from 'react-native-popover-view';
import api from '../shared/server_address';


class MypageScreen extends Component {
  state = {
    token:'',
    myName:'',
    myLocation:'',
    myGroup:'',
    myImage:'',
    loading: false,
    refreshing : '',
    show_popover : false,
  };

  _onRefresh = () => {
  
    console.log("refresh")
    this.setState({refreshing: true});
    this.getMyInfo();
    this.setState({refreshing: false});
  }

  goToSetLocation() {
    this.props.navigation.push('MyPage_Location');
  }

  Logout() {
    this.dropFCMToken();
    this.props.navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{ name: 'Logins' },],
      })
    );
    //this.props.navigation.dispatch(StackActions.popToTop())

    // pop everything in stack navigation
  }

  ShowLikeList() {
    this.props.navigation.navigate('Like_List');
  }

  SettingGroup(){
    this.props.navigation.navigate('SettingGroup')
  }

  componentDidMount() {
    this.getMyInfo();
  }

  providerRentList() {
    this.props.navigation.navigate('ProviderRentList')
  } 
  
  consumerRentList() {
    this.props.navigation.navigate('ConsumerRentList')
  }

  showReservation(){
    this.props.navigation.navigate('Reservation')
  }

  showMyItemList(){
    this.props.navigation.navigate('MyItemList')
  }

  BookingList(){
   
  }

  getToken = async () => {
    let value = await AsyncStorage.getItem("token")
    this.state.token = value
  }

  getMyInfo = () => {
    this.getToken().then(() => {

      api.get(`/users/mypage`,{
        headers: {
          Authorization: this.state.token,
        },
      })
      .then((res) => {
        this.state.myName = res.data.user_info.nickname;
        this.state.myLocation = res.data.user_info.location_title;
        this.state.myImage = res.data.user_info.image;
        this.state.myGroup = "ajou"
        this.setState({loading: true})

      })
      .catch((err) => {
        console.log("my page err")
        Alert.alert("요청 실패", err.response.data.error,[{text:'확인', style:'cancel'}])
      })
    })
  }

  getFCMToken = async() =>{
    let fcmToken = await AsyncStorage.getItem('fcmToken')
    await api
      .post('/users/add_device',
        {
          user:{
            device_token: fcmToken
          }
        },
        {
          headers:{
            'Authorization': this.state.token
          }
        }
      )
      .then((response)=>console.log(response))
      .then((error)=>console.log(error))
  }
  
  dropFCMToken = async() =>{
    let fcmToken = await AsyncStorage.getItem('fcmToken')
    await api
      .post('/users/remove_device',
      {
        user:{
          device_token: fcmToken
        }
      },
      {
        headers:{
          'Authorization': this.state.token
        }
      }
    )
    .then((response)=>console.log(response))
    .then((error)=>console.log(error))
  }

  renderPopover(){
    return(
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
            console.log("menu popover pressed! --------")
          })}>
          <Text style={styles.popoverel}>내 정보 수정</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.setState({ show_popover: false }, () => {
            console.log("menu popover pressed! --------")
          })}>
          <Text style={styles.popoverel}>키워드 알림</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.setState({ show_popover: false }, () => {
            this.Logout()
          })}>
          <Text style={styles.popoverel}>로그아웃</Text>
        </TouchableOpacity>
      </Popover>
    )
  }

  render() {
    if(!this.state.loading) return null
    else{
    return (
      <Container>
        <Header>
          <Body>
            <Title>My Page</Title>
          </Body>
          <Right>
            {this.renderPopover()}
          </Right>
        </Header>

        <ScrollView refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh}/>}>
        <Content>
          <List>
            <ListItem
              thumbnail
              style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', marginLeft: '5%', paddingTop:'3%'}}>
              <Thumbnail source={{uri: this.state.myImage}} />
              <View>
                <Body>
                  <Text>{this.state.myName}</Text>
                  <Text note numberOfLines={1}>
                    {this.state.myGroup}
                  </Text>
                  <Text note numberOfLines={2}>
                    {this.state.myLocation}
                  </Text>
                </Body>
              </View>
              <View></View>
            </ListItem>

            <ListItem
              style={{flexDirection: 'row', justifyContent: 'center', height: 100}}>
              <Button light style={styles.btn}
                onPress={() => {this.providerRentList()}}>
                <Icon type="MaterialCommunityIcons" name="receipt" />
                <Text style={{ paddingVertical : '8%', marginBottom: '4%' }}> 제공 목록</Text>
              </Button>

              <Button light style={styles.btn}
                onPress={() => {this.consumerRentList()}}>
                <Icon type="Ionicons" name="basket-sharp" />
                <Text style={{ paddingVertical : '8%', marginBottom: '4%' }}> 대여 목록</Text>
              </Button>

              <Button light style={styles.btn} onPress={() => {this.ShowLikeList();}}>
                <Icon type="Feather" name="heart" />
                <Text style={{ paddingVertical : '8%', marginBottom: '4%' }}> 관심 목록</Text>
              </Button>
            </ListItem>

            <Separator bordered></Separator>

            <ListItem button onPress={() => { this.goToSetLocation(); }}>
              <Left>
                <Icon type="Ionicons" name="location-sharp" />
                <Text style={styles.listText}> 동네 인증하기</Text>
              </Left>
              <Right>
                <Icon type="AntDesign" name="right" />
              </Right>
            </ListItem>

            <ListItem button onPress = {()=>{this.getFCMToken();}}>
              <Left>
                <Icon type="AntDesign" name="addusergroup" />
                <Text style={ styles.listText }> 기기 인증</Text>
              </Left>
              <Right>
                <Icon type="AntDesign" name="right" />
              </Right>
            </ListItem>

            <ListItem button onPress={()=>{this.SettingGroup()}}>
              <Left>
                <Icon type="AntDesign" name="addusergroup" />
                <Text style={ styles.listText }> 소속 인증</Text>
              </Left>
              <Right>
                <Icon type="AntDesign" name="right" />
              </Right>
            </ListItem>

            <ListItem button onPress={() => {this.showMyItemList();}}>
              <Left>
                <Icon type="Ionicons" name="file-tray-stacked-outline" />
                <Text style={ styles.listText }> 내 글 관리</Text>
              </Left>
              <Right>
                <Icon type="AntDesign" name="right" />
              </Right>
            </ListItem>

            <ListItem>
              <Left>
                <Icon type="EvilIcons" name="comment" />
                <Text style={ styles.listText }> 받은 리뷰</Text>
              </Left>
              <Right>
                <Icon type="AntDesign" name="right" />
              </Right>
            </ListItem>

            <ListItem button onPress={() => {this.showReservation();}}>
              <Left>
                <Icon type="AntDesign" name="calendar" />
                <Text style={ styles.listText }> 예약 관리</Text>
              </Left>
              <Right>
                <Icon type="AntDesign" name="right" />
              </Right>
            </ListItem>

          </List>
        </Content>
        </ScrollView>

        <Footer>
          <FooterTab>
            <View style={{flex: 1, backgroundColor: 'white'}}>
              <BottomTab navigation={this.props.navigation}></BottomTab>
            </View>
          </FooterTab>
        </Footer>
      </Container>
    );}
  }
}

const styles = StyleSheet.create({
  btn: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'transparent',
  },
  listText : {
    marginLeft: '3%',
  },
  popoverel: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    margin: 5,
  },
});
export default MypageScreen;
