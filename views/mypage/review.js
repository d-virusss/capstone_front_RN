import React, {Component} from 'react';
import {Text, TouchableOpacity, Alert} from 'react-native';
import {Container, Card, CardItem, Thumbnail, Content,
     Header, Left, Right, Icon, Body, Title, Image, Spinner} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../shared/server_address'

var reviewList = []

class ReviewScreen extends Component {
    state = {
        token : '',
        id : '',
        loading : true,

    }

    componentDidMount(){
        this.getReviewRequest();
    }

    getToken = async () => {
        let value = await AsyncStorage.getItem("token")
        let id = await AsyncStorage.getItem("user_id");
        this.state.token = value
        this.state.id = id;
    }

    getReviewRequest(){
        this.getToken().then(() => {
            api.get(`/reviews?user_id=${this.state.id}`, {
                headers: {
                    Authorization: this.state.token,
                },
            }).then((res)=> {
                console.log(res);
                reviewList = res.data;
                this.setState({loading : false})
            }).catch((err) => {
                Alert.alert("요청 실패", err.response.data.error,[{text:'확인', style:'cancel'}]) 
            })
        })
    }

    makeReviewList() {
        return reviewList.map((ele) => {
            console.log(ele);
            return(
                <Card style={{flex: 0}}>
                    <CardItem>
                        <Thumbnail source={{uri: '../../assets/chichken.jpeg'}} />
                        <Body>
                            <Text>글제목</Text>
                            <Text note numberOfLines={2}>
                                리뷰 작성ㅇ일
                            </Text>
                        </Body>
                    </CardItem>
                    <CardItem>
                        <Body>
                            {/* <Image source={{uri: '../assets/chichken.jpeg'}} style={{height: 200, width: 200, flex: 1}}/> */}
                            <Text>내가 작성한 리뷰 내용
                            </Text>
                        </Body>
                    </CardItem>
                </Card>
            );
        });
    }

    render(){
        if(this.state.loading){
            return(
                <Container>
                    <Header />
                    <Content>
                        <Spinner color='#ff3377' />
                    </Content>
                </Container>
            )
        }else{
            return(
                <Container>
                    <Header>
                        <Left>
                            <TouchableOpacity transparent onPress = {() => this.props.navigation.goBack()}>
                            <Icon name = 'chevron-back' type = 'Ionicons'/>
                            </TouchableOpacity>
                        </Left>
                        <Body><Title>작성한 리뷰</Title></Body>
                        <Right></Right>
                    </Header>
    
                    <Content>
                       {this.makeReviewList()}
                    </Content>
                </Container>
            )
        }
    }
}

export default ReviewScreen;