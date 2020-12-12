import React, {Component} from 'react';
import {Text, TouchableOpacity, Alert, StyleSheet, View, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView} from 'react-native';
import {Container, Button, ListItem, Thumbnail, Content, Card, CardItem,
     Header, Left, Right, Icon, Body, Title, Textarea, Form} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../shared/server_address'
import {AirbnbRating, Rating} from 'react-native-elements'
import ImageSelect from '../post/imageselect';
import { ScrollView } from 'react-native-gesture-handler';
import _ from 'lodash';
import Spinner from 'react-native-loading-spinner-overlay';
import FormData from 'form-data'

const thumb_image = {
	uri: '',
	type: '',
	name: '',
}

var multi_images = []
var formdata = new FormData();
var rating =''; //for rating component

class WriteReviewScreen extends Component {
	params = this.props.route.params;

	state = {
		token : '',
		post_image: '',
		post_title: '',
		images : '',
		body : '',
		booking_id : '',
		loading : false,
	}

	getToken = async() => {
		let value = await AsyncStorage.getItem("token")
		this.state.token = value
	}

	setInfo = () => {
		formdata = new FormData()
		formdata.append('review[body]', this.state.body)
		formdata.append('review[rating]', rating)
		formdata.append('review[booking_id]', this.state.booking_id)
	
		if (thumb_image.uri != '') {
			_.each(multi_images, (image, index) => {
				formdata.append(`review[images_attributes][${index}][image]`, image)
			})
			formdata.append('review[image]', thumb_image)
		}
	}

	putWriteReviewRequest(){ 
		this.setState({loading : true})
		this.setInfo();
		this.getToken().then(() => {
			api.post(`/reviews`, formdata, {
				headers: {
					Authorization: this.state.token,
				},
			}).then((res)=> {
				Alert.alert("작성 완료", "리뷰가 정상적으로 등록되었습니다.",[
					{
						text: '확인',
						onPress: () => this.props.navigation.goBack(),
					},
					{
						style: 'cancel',
					}
				]) 
			}).catch((err) => {
				Alert.alert("요청 실패", err.response.data.error,[{text:'확인', style:'cancel'}]) 
			})
		})
	}

  changeImage = (data) => {
    this.setState({images: data})
	multi_images=[]
    _.each(this.state.images, (image, index) => {
      multi_images.push(new Object)
      multi_images[index].uri = image.sourceURL
      multi_images[index].type = image.mime
      multi_images[index].name = image.filename
    })

    thumb_image.uri = data[0].sourceURL;
    thumb_image.type = data[0].mime;
    thumb_image.name = data[0].filename;
  }

	raitingCompleted(rate){
		console.log(rate)
		rating = rate;
	}

	initParams() {
		this.state.post_title = this.params.posts.title;
		this.state.post_image = this.params.posts.image;
		this.state.booking_id = this.params.posts.id;
	}

  render(){
    this.initParams();
    	return(
		<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <Container>
          <Header style={{
						height: 60,
						backgroundColor: '#f8f8f8',
						justifyContent:'space-between'}}
						androidStatusBarColor='#000'>
						<Left>
							<TouchableOpacity transparent onPress = {() => this.props.navigation.goBack()}>
							<Icon name = 'chevron-back' type = 'Ionicons'/>
							</TouchableOpacity>
						</Left>
						<Body><Title style={{color:'black',alignSelf:'center'}}>리뷰 작성</Title></Body>
						<Right></Right>
          </Header>
            <Content>
          <Spinner visible={this.state.loading} color="#ff3377"/>

					<ListItem thumbnail key={this.state.booking_id} style={{height : 100}}>
						<Left>
							<Thumbnail square source={{ uri: this.state.post_image }}/>
						</Left>
						<Body>
							<Title style={{fontSize : 17}}>{this.state.post_title}</Title>
						</Body>
					</ListItem>

					<ImageSelect stateBus={this.changeImage}></ImageSelect>
			
					<Rating
						fractions={1}
						ratingCount={5}
						imageSize={30}
						startingValue={0}
						onFinishRating={this.raitingCompleted}
						style={{ paddingVertical: 10 }}/>

					<Card>
						<CardItem>
							<ScrollView>
								<Body>
									<Textarea rowSpan={8} placeholder="물품의 후기를 작성해주세요." autoCapitalize='none'
										style={styles.textAreaContainer} 
										onChangeText={(text) => {this.state.body = text;}}/>
								</Body>
							</ScrollView>
						</CardItem>
					</Card>
				</Content>
				<View style = {styles.footer}>
					<Button transparent style = {styles.footerbutton} onPress={() => {this.putWriteReviewRequest()}}>
						<Text style={styles.footerText}>작성하기</Text>
					</Button>
				</View>
      </Container>
	  </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
	footer: {
		backgroundColor: '#ff3377',
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		height: '9%',
		position: 'absolute',
		bottom: -5,
	},
	footerbutton: {
		alignSelf: 'center',
		padding: 4,
		marginBottom: '3%',
		height: 80,
		width: '100%',
		justifyContent: 'center',
	},
	footerText: {
		color: 'white',
		fontWeight: 'bold',
		fontSize: 20,
	},
	textAreaContainer: {
		marginHorizontal: '2%',
		marginTop: '5%'
	},
	title: {
		paddingVertical : '5%',
		paddingHorizontal : '5%',
		flexDirection: 'column',
		alignItems : 'flex-start'
	},
})
export default WriteReviewScreen;