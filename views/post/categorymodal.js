import React, { Component } from 'react';
import {
  Text,
  View,
} from 'react-native';
import { Button } from 'native-base';
import Modal from 'react-native-modal';
import { TouchableOpacity } from 'react-native-gesture-handler';

class Example extends Component {
  constructor() {
    super();
    this.state = {
      visibility: false,
    };
  }


  setModalVisibility(visible) {
    this.setState({
      visibility: visible,
    });
  }

  render() {
    return (
      <View>
        <Modal
          animationType={'fade'}
          isVisible={this.state.visibility}
          hasBackdrop
          style = {{flex : 1,  margin : 0,}}
          onBackdropPress={() => this.setModalVisibility(!this.state.visibility)}
        >
          <View style = {{flex : 1, justifyContent : 'center', alignItems : 'center'}}>
            <View style = {{
              width : '70%',
              backgroundColor: "white",
              borderRadius: 20,
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5
            }}>
              <Text style = {{fontSize : 25, margin : '3%'}}>카테고리</Text>
              <Button
                transparent
                color="#000"
                onPress={() => this.setModalVisibility(!this.state.visibility)}
                style = {{justifyContent : 'center', width : '100%'}}
              >
                <Text>
                  캠핑용품
                </Text>
              </Button>
              <Button
                transparent
                color="#000"
                onPress={() => this.setModalVisibility(!this.state.visibility)}
                style = {{justifyContent : 'center', width : '100%'}}
              >
                <Text>
                  낚시용품
                </Text>
              </Button>
              <Button
                transparent
                color="#000"
                onPress={() => this.setModalVisibility(!this.state.visibility)}
                style = {{justifyContent : 'center', width : '100%'}}
              >
                <Text>
                  카메라
                </Text>
              </Button>
              <Button
                transparent
                color="#000"
                onPress={() => this.setModalVisibility(!this.state.visibility)}
                style = {{justifyContent : 'center', width : '100%'}}
              >
                <Text>
                  게임기
                </Text>
              </Button>
              <Button 
                transparent
                color="#000"
                onPress={() => this.setModalVisibility(!this.state.visibility)}
                style = {{justifyContent : 'center', width : '100%'}}
              >
                <Text>
                  숨기기
                </Text>
              </Button>
            </View>
          </View>
        </Modal>

        <Button
          transparent
          onPress={() => this.setModalVisibility(true)}
          style = {{width : '100%', justifyContent : 'center'}}
        >
          <Text
            style = {{
              textAlign : 'center',
              fontSize : 25,
              color : '#00bcd4'
            }}
          >
            카테고리
          </Text>
        </Button>
      </View>
    );
  }
}

export default Example;