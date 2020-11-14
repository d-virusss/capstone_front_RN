import React, { Component } from 'react';
import {Text,View,StyleSheet, Alert} from 'react-native';
import { Button, Icon, Right } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Popover from 'react-native-popover-view';
import IconF from 'react-native-vector-icons/FontAwesome'
import IconI from 'react-native-vector-icons/Ionicons'
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../shared/server_address'
IconF.loadFont();
IconI.loadFont();
IconM.loadFont();

class categoryScreen extends Component {
  constructor() {
    super();
    this.state = {
      visibility: false,
      show_popover : false,
      token:'',
    };
  }

  showOption(){
    this.setState({ show_popover: true })
  }

  sendIndexRequest(id) {
    this.setState({ show_popover: false });

    if(id == 0){ // all
      api
      .get('/posts?post_type=provide', {
        headers: {
          Authorization: this.state.token,
        }, // no params
      })
      .then((res) => {
        console.log('all index send success!');
      })
      .catch(function (e) {
        console.log('all item request failed!!!!' + e);
      });
    }
    else{
      api
      .get('/posts?post_type=provide', {
        headers: {
          Authorization: this.state.token,
        },
        params: {
          "q[category_id_eq]" : id,
        },
      })
      .then((res) => {
        console.log('index send success!');
      })
      .catch(function (e) {
        console.log('category request failed!!!!' + e);
      });
    }
   
  }

  getToken = async () => {
    let value = await AsyncStorage.getItem('token');
    this.state.token = value;
  };

  render() {
    this.getToken();
    return (
      <View style = { styles.container }>
        <Popover
          isVisible = {this.state.show_popover}
          onRequestClose = {() => this.setState({ show_popover: false })}
          from={(
            <TouchableOpacity onPress={() => this.showOption()}
            style={{ flexDirection: 'row'}} >
              <Icon name="menu" style={styles.item}>
              <Text> 카테고리</Text>
              </Icon>
              <Icon type="FontAwesome" name="sort" style={styles.item} >
              <Text> 정렬</Text>
              </Icon>
            </TouchableOpacity>
          )}>
          
          <View style = {{flexDirection: 'row'}}>
          <TouchableOpacity
              onPress={() => this.sendIndexRequest(5)}>
              <Icon type="FontAwesome" name="soccer-ball-o" style={styles.item}>
                <Text style={styles.popoverel}> 레저용품</Text>
              </Icon>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.sendIndexRequest(2)}>
              <Icon type="MaterialCommunityIcons" name="tshirt-crew" style={styles.item}>
              <Text style={styles.popoverel}> 의류</Text>
              </Icon>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.sendIndexRequest(3)}>
                <Icon type="MaterialCommunityIcons" name="lipstick" style={styles.item}>
                <Text style={styles.popoverel}> 뷰티</Text>
              </Icon>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.sendIndexRequest(4)}>
              <Icon type="MaterialCommunityIcons" name="microwave" style={styles.item}>
                <Text style={styles.popoverel}> 전자제품</Text>
              </Icon>
            </TouchableOpacity>
          </View>

          <View style = {{flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() => this.sendIndexRequest(6)}>
              <Icon type="MaterialCommunityIcons" name="wallet-giftcard" style={styles.item}>
                <Text style={styles.popoverel}> 생활용품</Text>
              </Icon>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.sendIndexRequest(7)}>
              <Icon type="MaterialCommunityIcons" name="silverware-fork-knife" style={styles.item}>
                <Text style={styles.popoverel}> 요리</Text>
              </Icon>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.sendIndexRequest(8)}>
              <Icon type="MaterialCommunityIcons" name="car" style={styles.item}>
                <Text style={styles.popoverel}> 자동차</Text>
              </Icon>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.sendIndexRequest(9)}>
              <Icon type="MaterialCommunityIcons" name="baby-buggy" style={styles.item}>
                <Text style={styles.popoverel}> 유아용품</Text>
              </Icon>
            </TouchableOpacity>
          </View>

          <View style = {{flexDirection: 'row'}}>
          <TouchableOpacity
                onPress={() => this.sendIndexRequest(1)}>
              <Icon type="FontAwesome" name="shopping-bag" style={styles.item}>
              <Text style={styles.popoverel}> 잡화</Text>
              </Icon>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.sendIndexRequest(0)}>
              <Icon type="MaterialCommunityIcons" name="select-all" style={styles.item}>
                <Text style={styles.popoverel}> 전체 </Text>
              </Icon>
            </TouchableOpacity>
          </View>

        </Popover>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  popoverel : {
    paddingVertical : 10,
    paddingHorizontal : 15,
    margin : 5,
  },
  container : {
    paddingVertical : 10,
    backgroundColor : '#ffffff',
    alignItems : 'center',
  },
  fontconfing : {
    fontSize : 15,
    alignSelf : 'center',
  },
  item : {
    margin: 7,
    fontSize: 17,
  }
})

export default categoryScreen;