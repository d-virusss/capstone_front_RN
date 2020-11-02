import axios from 'axios';
import React, {Component} from 'react';
import {Text, Icon, Button} from 'native-base';
import {View, StyleSheet} from 'react-native';
import IconA from 'react-native-vector-icons/MaterialCommunityIcons';
IconA.loadFont();
const api = axios.create({baseURL: 'http://3.35.9.144'});

class SubButton extends Component {
  render() {
    return (
      <View
        style={{
          flexDirection: 'row',
        }}>
        <Icon type="MaterialCommunityIcons" name="heart-plus" size={2} />

        <Icon type="MaterialCommunityIcons" name="bell-alert" size={2} />

        <Icon type="MaterialCommunityIcons" name="heart-outline" size={2} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  btn: {
    flex: 1,
    flexDirection: 'column',
  },
});

export default SubButton;
