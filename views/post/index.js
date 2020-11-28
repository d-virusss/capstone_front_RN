import React, { Component} from "react";
import { View, StyleSheet} from "react-native";
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import SearchBar from './search_bar';
import ActionButton from 'react-native-action-button';
import {Icon} from 'native-base';
IconM.loadFont();

class PostIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ flex: 1 }} >
          <SearchBar navigation={this.props.navigation}></SearchBar>
        </View>
        <ActionButton buttonColor="#ff3377" onPress={() => {  }}>
          <ActionButton.Item buttonColor='#9b59b6' title="물품 등록" onPress={() => {this.props.navigation.navigate('P_W_p');}}>
            <Icon name="md-create" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#1abc9c' title="물품 요청" onPress={() => {this.props.navigation.navigate('P_W_c');}}>
            <Icon name="bell-ring" type="MaterialCommunityIcons" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});

export default PostIndex;