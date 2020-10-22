import React, { Component, } from "react";
import { ActionSheetIOS } from 'react-native';
import { Footer, FooterTab, Badge, Button, Text, Icon, Root } from 'native-base';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
IconM.loadFont();

var BUTTONS = ["물품 등록", "대여요청하기", "취소"];
var CANCEL_INDEX = 2;

class BottomTab extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Footer>
          <FooterTab>
            <Button vertical onPress={() => this.props.navigation.navigate('postIndex')}>
              <Icon name="home"/>
              <Text>홈</Text>
            </Button>
            <Root vertical transparent>
              <Button 
                transparent
                vertical 
                style = {{alignSelf : 'center'}}
                onPress = {() =>
                ActionSheetIOS.showActionSheetWithOptions(
                  {
                    options: BUTTONS,
                    cancelButtonIndex: CANCEL_INDEX,
                    title: "글쓰기"
                  },
                  buttonIndex => {
                    if (buttonIndex === 0) {
                        this.props.navigation.navigate('P_W_p');
                    }
                    if (buttonIndex === 1) {
                      this.props.navigation.navigate('P_W_c');
                    }
                  },
                )}
              >
                <Icon name="pencil" style = {{color : '#6b6b6b'}}/>
                <Text style = {{fontSize : 14, color : '#6b6b6b'}}>글쓰기</Text>
              </Button>
            </Root>
            <Button badge vertical onPress = {() => {
              this.props.navigation.navigate('Chats')}
            }>
              <Badge ><Text>51</Text></Badge>
              <Icon name="chatbubble" />
              <Text>채팅</Text>
            </Button>
            <Button vertical onPress={() => this.props.navigation.navigate('Logins')}>
              <Icon name="person" />
              <Text>Mypage</Text>
            </Button>
          </FooterTab>
        </Footer>
    );
  }
}

export default BottomTab;