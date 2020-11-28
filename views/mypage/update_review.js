import React, {Component} from 'react';
import {Text, TouchableOpacity, Alert, StyleSheet, View} from 'react-native';
import {Container, Button, ListItem, Thumbnail, Content,
     Header, Left, Right, Icon, Body, Title, Textarea, Spinner, Form} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../shared/server_address'
import {AirbnbRating, } from 'react-native-elements'
import Popover from 'react-native-popover-view';


var reviewForm = {
    review : {
        body : '',
        rating : '',
        booking_id : '',
    }
}

class UpdateReviewScreen extends Component {
    params = this.props.route.params;

    state = {
        token : '',
        post_image: '',
        post_title: '',
        body : '',
        rate : '',
        review_id : 0,
        loading : true,
        show_popover : false,
    }

    getToken = async() => {
        let value = await AsyncStorage.getItem("token")
        this.state.token = value
        this.setState({loading : false})
    }

    putWriteReviewRequest(){ 
        reviewForm.review.body = this.state.body;
        api.put(`/reviews/${this.state.review_id}`, reviewForm, {
            headers: {
                Authorization: this.state.token,
            },
        }).then((res)=> {
            console.log(res)
            Alert.alert("수정 완료", "리뷰가 정상적으로 수정됐습니다",[
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
    }

    raitingCompleted(rate){
        reviewForm.review.rating = rate;
    }

    componentDidMount(){
        //init params
        this.state.body = this.params.posts.body;
        this.state.rate = this.params.posts.rating;
        this.state.review_id = this.params.posts.review_id;
        this.state.post_title = this.params.posts.title;
        this.state.post_image = this.params.posts.image;
        reviewForm.review.booking_id = this.params.posts.id;
        this.getToken();
    }

    renderDelete() {
        return(
            <View>
                <TouchableOpacity
                    onPress={() => this.setState({ show_popover: false },
                    () => { this.deleteRequest()})}>
                    <Text style={styles.popoverel}>삭제</Text>
                </TouchableOpacity>
            </View>
        )
    }

    deleteRequest() {
        api.delete(`/reviews/${this.state.review_id}`, {
            headers : {
                Authorization : this.state.token
            }
        }).then(()=> {
            Alert.alert("삭제 완료", "리뷰가 정상적으로 삭제됐습니다",[
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
    }

    render(){
        if(this.state.loading){
            return(
                <Container>
                <Header>
                    <Left>
                        <TouchableOpacity transparent onPress = {() => this.props.navigation.goBack()}>
                        <Icon name = 'chevron-back' type = 'Ionicons'/>
                        </TouchableOpacity>
                    </Left>
                    <Body><Title>리뷰 수정</Title></Body>
                    <Right></Right>
                </Header>
                <Content>
                <Spinner color='#ff3377' />
              </Content>
              </Container>
            )
        }
        else{
        return(
            <Container>
                <Header>
                    <Left>
                        <TouchableOpacity transparent onPress = {() => this.props.navigation.goBack()}>
                        <Icon name = 'chevron-back' type = 'Ionicons'/>
                        </TouchableOpacity>
                    </Left>
                    <Body><Title>리뷰 수정</Title></Body>
                    <Right>
                    <Popover
                    isVisible = {this.state.show_popover}
                    onRequestClose = {() => this.setState({ show_popover: false })}
                    from={(
                        <TouchableOpacity onPress={() => this.setState({ show_popover: true })}>
                        <Icon name="menu" />
                        </TouchableOpacity>
                    )}>
                    {this.renderDelete()}
                    </Popover>
                    </Right>
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
                        onFinishRating={this.raitingCompleted}
                        defaultRating={this.state.rate}/>

                    <Textarea rowSpan={8} autoCapitalize='none'
                    onChangeText={(text) => {this.setState({body : text}, () =>{})}}
                    value={this.state.body}
                    style={styles.textAreaContainer}
                   />
               
                </Content>

                <View style = {styles.footer}>
                    <Button transparent style = {styles.footerbutton} onPress={() => {this.putWriteReviewRequest()}}>
                        <Text style={styles.footerText}>수정하기</Text>
                    </Button>
                </View>
            </Container>
        )
        }
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
    popoverel : {
        paddingVertical : 10,
        paddingHorizontal : 15,
        margin : 5,
      },
})
export default UpdateReviewScreen;