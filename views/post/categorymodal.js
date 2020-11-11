import React, { Component } from 'react';
import {Text,View,StyleSheet,} from 'react-native';
import { Button, Icon, Right } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Popover from 'react-native-popover-view';

class categoryScreen extends Component {
  constructor() {
    super();
    this.state = {
      visibility: false,
      show_popover : false,
    };
  }

  showOption(){
    this.setState({ show_popover: true })
  }

  render() {
    return (
      <View style = {{backgroundColor : '#fffff'}}>
        <Popover
          isVisible = {this.state.show_popover}
          onRequestClose = {() => this.setState({ show_popover: false })}
          from={(
            <TouchableOpacity onPress={() => this.showOption()}>
              <Icon name="menu" />
              <Text>카테고리</Text>
            </TouchableOpacity>
          )}>
          <View style = {{flexDirection: 'row'}}>
            <TouchableOpacity
                onPress={() => this.setState({ show_popover: false})}>
              <Text style={styles.popoverel}>잡화</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.setState({ show_popover: false })}>
              <Text style={styles.popoverel}>의류</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Alert.alert("집에가고 싶나?")}>
              <Text style={styles.popoverel}>뷰티</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Alert.alert("히히 못가")}>
              <Text style={styles.popoverel}>전자제품</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Alert.alert("히히 못가")}>
              <Text style={styles.popoverel}>레저용품</Text>
            </TouchableOpacity>
          </View>
          <View style = {{flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() => Alert.alert("히히 못가")}>
              <Text style={styles.popoverel}>생활용품</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Alert.alert("히히 못가")}>
              <Text style={styles.popoverel}>요리</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Alert.alert("히히 못가")}>
              <Text style={styles.popoverel}>자동차</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Alert.alert("히히 못가")}>
              <Text style={styles.popoverel}>유아용품</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Alert.alert("히히 못가")}>
              <Text style={styles.popoverel}>전체</Text>
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
})

export default categoryScreen;