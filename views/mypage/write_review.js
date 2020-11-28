import React, {Component} from 'react';
import {Text, TouchableOpacity, Alert, StyleSheet, View} from 'react-native';
import {Container, Button, ListItem, Thumbnail, Content,
     Header, Left, Right, Icon, Body, Title, Textarea, Spinner, Form} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../shared/server_address'
import {AirbnbRating, } from 'react-native-elements'

var reviewForm = {
    review : {
        body : '',
        rating : '',
        booking_id : '',
    }
}

class WriteReviewScreen extends Component {
    params = this.props.route.params;

    state = {
        token : '',
        post_image: '',
        post_title: '',
        //
    }

    getToken = async() => {
        let value = await AsyncStorage.getItem("token")
        this.state.token = value
    }

    putWriteReviewRequest(){ 
        console.log(reviewForm)
        this.getToken().then(() => {
            api.post(`/reviews`, reviewForm, {
                headers: {
                    Authorization: this.state.token,
                },
            }).then((res)=> {
                Alert.alert("작성 완료", "리뷰가 정상적으로 등록됐습니다",[
                    {
                        text: '확인',
                        onPress: () => this.props.navigation.goBack()
                    },
                    {
                        text: '취소',
                        style: 'cancel',
                    }
                ]) 
            }).catch((err) => {
                Alert.alert("요청 실패", err.response.data.error,[{text:'확인', style:'cancel'}]) 
            })
        })
        
    }

    raitingCompleted(rate){
        reviewForm.review.rating = rate;
    }

    initParams() {
        this.state.post_title = this.params.posts.title;
        this.state.post_image = this.params.posts.image;
        reviewForm.review.booking_id = this.params.posts.id;
    }

    render(){
        this.initParams();
        return(
            <Container>
                <Header>
                    <Left>
                        <TouchableOpacity transparent onPress = {() => this.props.navigation.goBack()}>
                        <Icon name = 'chevron-back' type = 'Ionicons'/>
                        </TouchableOpacity>
                    </Left>
                    <Body><Title>리뷰 작성</Title></Body>
                    <Right></Right>
                </Header>
                
                <Content style={{marginTop : '5%'}}>
               
                    <ListItem thumbnail key={reviewForm.review.booking_id}>
                        <Left>
                        <Thumbnail square source={{ uri: this.state.post_image }} />
                        </Left>
                        <Body>
                        <Text>{this.state.post_title}</Text>
                        </Body>
                    </ListItem>

                    <AirbnbRating
                        reviews={[]}
                        count={5}
                        size={30}
                        onFinishRating={this.raitingCompleted}/>
                    <Textarea rowSpan={8} placeholder="이 물품의 리뷰를 남겨주세요." autoCapitalize='none'
                      style={styles.textAreaContainer} 
                      onChangeText={(text) => {reviewForm.review.body = text;}}
                      />
               
                </Content>

                <View style = {styles.footer}>
                    <Button transparent style = {styles.footerbutton} onPress={() => {this.putWriteReviewRequest()}}>
                        <Text style={styles.footerText}>작성하기</Text>
                    </Button>
                </View>
            </Container>
        )
        
    }
}

const styles = StyleSheet.create({
    footer: {
        position: 'absolute',
        flex:0.1,
        left: 0,
        right: 0,
        bottom: -5,
        backgroundColor:'#ff3377',
        flexDirection:'row',
        height:80,
        alignItems:'center',
        paddingTop: 7
      },
    footerbutton: {
        alignItems:'center',
        justifyContent: 'center',
        flex:1,
    },
    footerText: {
        color:'white',
        fontWeight:'bold',
        alignItems:'center',
        fontSize: 20,
    },
    textAreaContainer: {
        marginHorizontal: '2%',
        marginTop: '5%'
    },
})
export default WriteReviewScreen;