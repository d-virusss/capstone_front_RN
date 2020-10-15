import React, { Component } from 'react';
import {
  Text,
  View,
} from 'react-native';
import { Button, Icon, Right } from 'native-base';
import Modal from 'react-native-modal';
import { TouchableOpacity } from 'react-native-gesture-handler';

a = '전체';

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
      <View style = {{backgroundColor : '#fffff'}}>
        <Modal
          animationIn={'fadeIn'}
          animationOut={'fadeOut'}
          isVisible={this.state.visibility}
          style = {{flex : 1,  margin : 0,}}
          onPress={() => this.setModalVisibility(!this.state.visibility)}
        >
          <View style = {{flex : 1, justifyContent : 'center', alignItems : 'center',}}>
            <View style = {{ opacity : 0.5, zIndex : 0}}>
              <TouchableOpacity
                style = {{width : '100%', height : '100%'}}
                onPress={() => this.setModalVisibility(!this.state.visibility)}
              >
                <Text style = {{opacity : 0}}>asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasa</Text>
              </TouchableOpacity>
            </View>
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
              elevation: 5,
              zIndex : 10,
              position : 'absolute'
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
          onPress={() => this.setModalVisibility(true)}
          bordered dark
          style = {{
            width : '80%', 
            justifyContent : 'center',
            alignSelf : 'center',
            backgroundColor : 'white',
            borderRadius : 0,
            margin : 10,
            zIndex : 0
          }}
        >
          <Text
            style = {{
              textAlign : 'center',
              fontSize : 20,
              color : '#000',
              alignSelf : 'center'
            }}
          >
            {a}
          </Text>
          <Icon name = 'arrow-down'
            
            style={{
              zIndex : 1,
              position : 'absolute',
              right : '2%'
            }}
          />
        </Button>
      </View>
    );
  }
}

export default Example;