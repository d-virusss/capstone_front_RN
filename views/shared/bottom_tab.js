import React, { Component, } from "react";
import { Footer, FooterTab, Badge, Button, Text, Icon, ActionSheet, Root } from 'native-base';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
IconM.loadFont();

var BUTTONS = ["제공 글쓰기", "대여요청 글쓰기", "취소"];
var CANCEL_INDEX = 2;

class PostListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Footer>
        <FooterTab>
          <Button vertical onPress={() => this.props.navigation.navigate('PLScreen')}>
            <Icon name="newspaper" />
            <Text>홈</Text>
          </Button>
          <Root>
            <Button
              transparent vertical onPress={() => ActionSheet.show(
                  {
                    options: BUTTONS,
                    cancelButtonIndex: CANCEL_INDEX,
                    title: "Testing ActionSheet"
                  },
                  buttonIndex => {
                    if (buttonIndex === 0) {
                      console.
                      this.props.navigation.navigate('P_W_p');
                    }
                    if (buttonIndex === 1) {
                      this.props.navigation.navigate('P_W_c');
                    }
                  },
                )}
            >
              <Icon name="pencil" />
              <Text>글쓰기</Text>
            </Button>
          </Root>
          <Button badge vertical onPress={() => {
            this.props.navigation.navigate('Chats')
          }
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

export default PostListScreen;