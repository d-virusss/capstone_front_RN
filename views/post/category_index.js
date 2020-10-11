import React, {Component} from 'react';
import { Content, List, ListItem, Thumbnail, Text, Left, Body, Right, Button } from 'native-base';
import {
    View, 
  } from "react-native";

  class C_I extends Component{
    render(){
      return(
        <View style={{flex : 1}}>
          <Content>
            <List>
              <ListItem thumbnail>
                <Left>
                  <Thumbnail square source={{ uri: '/Users/kenny/desktop/folders/ajou/capstone/capstone_front_RN/assets/p1.jpg' }} />
                </Left>
                <Body>
                  <Text>Sankhadeep</Text>
                  <Text note numberOfLines={1}>Its time to build a difference . .</Text>
                </Body>
                <Right>
                  <Button transparent>
                    <Text>View</Text>
                  </Button>
                </Right>
              </ListItem>
              <ListItem thumbnail>
                <Left>
                  <Thumbnail square source={{ uri: '/Users/kenny/desktop/folders/ajou/capstone/capstone_front_RN/assets' }} />
                </Left>
                <Body>
                  <Text>Sankhadeep</Text>
                  <Text note numberOfLines={1}>Its time to build a difference . .</Text>
                </Body>
                <Right>
                  <Button transparent>
                    <Text>View</Text>
                  </Button>
                </Right>
              </ListItem>
            </List>
          </Content>
        </View>
      );
    }
  }

  export default C_I;