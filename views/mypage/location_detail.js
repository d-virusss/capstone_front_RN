import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity,} from 'react-native';
import {ListItem, Container, Content, Left, Header, Body, Title, Icon, Text, Right} from 'native-base';

var titleList=[];
var num;

class LocationDetailScreen extends Component{

    makeList(){
       return titleList.map((ele)=>{
            return (
            <ListItem>
            <Text>{ele}</Text>
            </ListItem>
            )
       })
    }

    render(){
        titleList = this.props.route.params.list;
        num = this.props.route.params.num;
        console.log(this.props.route.params.num)
        return (
            <Container>
            <Header style={{
                height: 60,
                backgroundColor: '#f8f8f8',
                justifyContent:'space-between'}}
                androidStatusBarColor='#000'
            >
                <Left>
                  <TouchableOpacity transparent onPress = {() => this.props.navigation.goBack()}>
                    <Icon name = 'chevron-back' type = 'Ionicons'/>
                  </TouchableOpacity>
                </Left>
                    <Body><Title style={{ color: 'black', alignSelf: 'center', fontSize: 20}}>근처 동네 {num}개</Title></Body>
                <Right/>
            </Header>
            <Content>
            {this.makeList()}
            </Content>
        </Container>
        )
    }
}

const styles = StyleSheet.create({
 
});

export default LocationDetailScreen;
