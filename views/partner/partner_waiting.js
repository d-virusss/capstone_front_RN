import AsyncStorage from '@react-native-community/async-storage';
import React, {Component} from 'react';
import {
  View, Container, Header, Content, Form, Item, Button, Text, Left, Right, 
  Body, Icon, Title, Label, ListItem
} from 'native-base';
import {TouchableOpacity} from 'react-native-gesture-handler';
import api from '../shared/server_address';

class Partner_waiting extends Component{
  constructor(props){
    super(props);
    this.state.company_id = this.props.route.params.company_id;
  }
  state={
    token: AsyncStorage.getItem('token'),
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

  getCompanyInfo = async() =>{
    this.state.token = await AsyncStorage.getItem('token');
    await api
            .get(`companies/${this.state.company_id}`,
            {
              headers:{'Authorization': this.state.token}
            })
            .then((response)=>{
              console.log(response.data.company_info)
              this.setState({
                name:response.data.company_info.name,
                title:response.data.company_info.title,
                business_registration:response.data.company_info.business_registration,
                business_address:response.data.company_info.business_address,
                phone:response.data.company_info.phone,
                category:response.data.company_info.category,
                biz_type:response.data.company_info.biz_type,
                message:response.data.company_info.message,
                description:response.data.company_info.description,
              })
            })
            .catch(error=>console.log(error))
  }

  componentDidMount(){
    this.getCompanyInfo()
  }

  render(){
    return(
      <Container>
        <Header style = {{
            backgroundColor: '#f8f8f8',
            alignItems: 'center',
            justifyContent: 'space-between',
          }} androidStatusBarColor='#000'
        >
          <Left>
            <TouchableOpacity transparent onPress = {() => this.props.navigation.goBack()}>
              <Icon name = 'chevron-back' type = 'Ionicons'/>
            </TouchableOpacity>
          </Left>
          <Body><Title style={{color:'black',alignSelf:'center'}}>파트너 신청</Title></Body>
          <Right></Right>
        </Header>
        <Button transparent bordered dark
          style={{
            alignSelf:'center',
            margin : '4%',
            width : '80%',
            height : '7%',
            justifyContent:'center'
          }}
        >
          <Text>{'파트너 승인 대기중입니다.'}</Text>
        </Button>
        <Text style={{fontSize:20,marginLeft:15, marginTop:'3%'}}>파트너 신청 정보</Text>
        <Content>
          <Form>
            <ListItem floatingLabel style={{flexDirection:'column'}}>
              <Label>대표자 이름</Label>
              <Text style={{fontszie:20, padding:'1%',}}>{this.state.name}</Text>
            </ListItem>

              {/* 회사명 */}
            <ListItem floatingLabel style={{flexDirection:'column'}}>
              <Label>회사명</Label>
              <Text style={{fontszie:20, padding:'1%', }}>{this.state.title}</Text>
            </ListItem>

            <ListItem floatingLabel style={{flexDirection:'column'}}>
              <Label>사업자 번호</Label>
              <Text style={{fontszie:20, padding:'1%',}}>{this.state.business_registration}</Text>
            </ListItem>

            <ListItem floatingLabel style={{flexDirection:'column'}}>
              <Label>사업자 주소</Label>
              <Text style={{fontszie:20, padding:'1%', }}>{this.state.business_address}</Text>
            </ListItem>

            {/* phone */}
            <ListItem floatingLabel style={{flexDirection:'column'}}>
              <Label>연락처</Label>
              <Text style={{fontszie:20, padding:'1%', }}>{this.state.phone}</Text>
            </ListItem>

            {/* 카테고리 */}
            <ListItem floatingLabel style={{flexDirection:'column'}}>
              <Label>종목</Label>
              <Text style={{fontszie:20, padding:'1%', }}>{this.state.category}</Text>
            </ListItem>
            {/* biz_type */}
            <ListItem floatingLabel style={{flexDirection:'column'}}>
              <Label>업태</Label>
              <Text style={{fontszie:20, padding:'1%', }}>{this.state.biz_type}</Text>
            </ListItem>
            {/* biz_type */}
            <ListItem floatingLabel style={{flexDirection:'column'}}>
              <Label>한줄 소개</Label>
              <Text style={{fontszie:20, padding:'1%',}}>{this.state.message}</Text>
            </ListItem>

            {/* Description */}
            <ListItem floatingLabel style={{flexDirection:'column'}}>
              <Label>상세정보</Label>
            </ListItem>
            <Text style={{fontszie:20, padding:'1%', marginHorizontal:'5%'}}>{this.state.description}</Text>
          </Form>
        </Content>
      </Container>

    )
  }
}

export default Partner_waiting