import AsyncStorage from '@react-native-community/async-storage';
import React, { useEffect, useState } from 'react';
import {Container, Content, Header, Left, Right, Body, Icon,
  Button, Text, View, List, ListItem, Item
} from 'native-base';
import IconA from 'react-native-vector-icons/Ionicons';
import IconFe from 'react-native-vector-icons/Feather';
import IconMa from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import api from '../shared/server_address'

IconA.loadFont();
IconFe.loadFont();
IconMa.loadFont();
let token;


function profileShow({route, navigation}){
  const post = route.params;
  const [likenum, setLikenum] = useState([]);

  console.log(route.params)
  getToken = async () => {
    const value = await AsyncStorage.getItem("token")
    token = value
  }

  getLikes = async () => {
    await api
      .get(`/users/${profile_id}/likes`, {
        headers: {
          'Authorization': token
        }
      })
      .then((response) => {
        console.log("likes load")
        console.log(response)
        setLikenum(response.data.length);
      })
      .catch(function (e) {
        console.log('load failed!!!!' + e)
        Alert.alert("요청 실패", e.response.data.error,[{text:'확인', style:'cancel'}])
      })
  }

  getToken();
  getLikes();

  return(
    <Container>
      <Header style = {{height : 40}}>
        <Left>
          <Button transparent onPress = {() => navigation.goBack()}>
            <Icon name = 'chevron-back' type = 'Ionicons'/>
          </Button>
        </Left>
        <Body>
          <Text style = {{fontSize : 17}}>상대방 프로필</Text>
        </Body>
        <Right>
          <Button dark transparent>
            <Icon name = 'dots-vertical' type = 'MaterialCommunityIcons'
            />
          </Button>
        </Right>
      </Header>
      <Content>
       <List>
         <ListItem style = {{flexDirection : 'column'}}>
           <View style = {{flexDirection : 'row', width : '100%'}}>
            <Icon name = 'ios-person-outline' type = 'Ionicons'
              style = {{
                fontSize : 60
              }}
            />
            <View style = {{margin : '3%'}}>
            <Text style = {{fontSize : 20}}>{profile_nickname}</Text>
              <Text>매너 평가하기?</Text>
            </View>
          </View>
          <View style = {{flexDirection : 'row', width : '100%', margin : '3%'}}>
            <Text style = {{width : '50%'}}>좋아요 {likenum}</Text>
            <Text style = {{width : '50%'}}>소속: 삼성</Text>
          </View>
         </ListItem>
         <View style = {{
           alignItems : 'center',
           justifyContent : 'center',
           backgroundColor : '#EEEEEE',

         }}>
           <Text style = {{
             width : '100%',
             marginTop : 10,
             marginLeft : 30,
             height : 50
           }}>{profile_location} 인증됨
           </Text>
          </View>
          <TouchableOpacity onPress = {() => navigation.navigate('ProfileShowList',
            {
              profile_id : profile_id, profile_nickname: profile_nickname,
            }
          )}
          >
            <ListItem noIndent style={{}}>
              <Left>
                <Icon type="Feather" name="list" />
                <Text> 나눔 목록</Text>
              </Left>
              <Right>
                <Icon type="AntDesign" name="right" />
              </Right>
            </ListItem>
          </TouchableOpacity>
          <ListItem noIndent style={{}}>
            <Left>
              <Icon type="Feather" name="list" />
              <Text> 받은 평가</Text>
            </Left>
            <Right>
              <Icon type="AntDesign" name="right" />
            </Right>
          </ListItem>
          <Item style = {{flexDirection : 'column', alignItems : 'flex-start'}}>
            <Text style = {{margin : '3%'}}>후기 작성자 이름</Text>
            <Text
              style = {{
                width : '50%',
                margin : '3%'
              }}
            >
              내용내용내용내용내용내용내용내용 많은 내용 암튼 좋음</Text>
          </Item>
          <Item style = {{flexDirection : 'column', alignItems : 'flex-start'}}>
            <Text style = {{margin : '3%'}}>후기 작성자 이름</Text>
            <Text
              style = {{
                width : '50%',
                margin : '3%'
              }}
            >
              내용내용내용내용내용내용내용내용 많은 내용 암튼 좋음</Text>
          </Item>
       </List>
      </Content>
    </Container>
  );
}

export default profileShow;