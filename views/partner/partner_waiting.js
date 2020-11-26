import React, {Component} from 'react';
import {
  View, Container, Header, Content, Form, Item, Button, Text, Left, Right, 
  Body, Icon
} from 'native-base';

class Partner_waiting extends Component{
  constructor(props){
    super(props);
    this.state.token = AsyncStorage.getItem('token');
  }
  state={
    name: '',
    title: '',
    business_registration: '',
    business_address: '',
    phone:'',
    category:'',
    biz_type: '',
    message: '',
    description: '',
  }
  render(){
    return(
      <Container>
        <Header>
          <Left>
            <TouchableOpacity transparent onPress = {() => this.props.navigation.goBack()}>
              <Icon name = 'chevron-back' type = 'Ionicons'/>
            </TouchableOpacity>
          </Left>
          <Body><Title>파트너 인증</Title></Body>
          <Right></Right>
        </Header>
        <View style = {{justifyContent:'center',alignContent:'center'}}>
          <Button transparent bordered dark>
            <Text>{'파트너 승인 대기중입니다'}</Text>
          </Button>
        </View>
        <Content>
          <Text style={{fontSize:'17',}}>파트너 신청 정보</Text>
          <Form>
            <Item floatingLabel>
              <Label>대표자 이름</Label>
              <Text>{this.state.name}</Text>
            </Item>

              {/* 회사명 */}
            <Item floatingLabel>
              <Label>회사명</Label>
              <Text>{this.state.title}</Text>
            </Item>

            <Item floatingLabel>
              <Label>사업자 번호</Label>
              <Text>{this.state.business_registration}</Text>
            </Item>

            <Item floatingLabel>
              <Label>사업자 주소</Label>
              <Text>{this.state.business_address}</Text>
            </Item>

            {/* phone */}
            <Item floatingLabel>
              <Label>연락처 ex) 01012345678</Label>
              <Text>{this.state.phone}</Text>
            </Item>

            {/* 카테고리 */}
            <Item floatingLabel>
              <Label>종목</Label>
              <Text>{this.state.category}</Text>
            </Item>
            {/* biz_type */}
            <Item floatingLabel>
              <Label>업태</Label>
              <Text>{this.state.biz_type}</Text>
            </Item>
            {/* biz_type */}
            <Item floatingLabel>
              <Label>한줄 소개</Label>
              <Text>{this.state.message}</Text>
            </Item>

            {/* Description */}
            <Item floatingLabel>
              <Label>상세정보</Label>
              <Text>{this.state.description}</Text>
            </Item>
          </Form>
        </Content>
      </Container>

    )
  }
}

export default Partner_waiting