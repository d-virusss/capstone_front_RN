import React, {Component} from 'react';
import {Text, TouchableOpacity, Alert, StyleSheet, View, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard} from 'react-native';
import {Container, Button, ListItem, Thumbnail, Content,
     Header, Left, Right, Icon, Body, Title, Textarea, CardItem, Card} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../shared/server_address'
import {AirbnbRating,Rating } from 'react-native-elements'
import Popover from 'react-native-popover-view';
import _ from 'lodash';
import { ScrollView } from 'react-native-gesture-handler';
import ImageSelect from '../post/imageselect';
import FormData from 'form-data'
import Spinner from 'react-native-loading-spinner-overlay';


const thumb_image = {
	uri: '',
	type: '',
	name: '',
}

var multi_images = []
var formdata = new FormData();
var rating =''; //for rating component

class UpdateReviewScreen extends Component {
	params = this.props.route.params;
	state = {
		token : '',
		post_image: '',
		post_title: '',
		body : '',
		rate : '',
		review_id : 0,
		booking_id : '',
		loading : true,
		show_popover : false,
		//for multi image
		images: [],

	}

	getToken = async() => {
		let value = await AsyncStorage.getItem("token")
		this.state.token = value
		this.setState({loading : false})
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
		console.log(formdata)
	}

	putWriteReviewRequest(){ 
		this.setState({loading : true})
		this.setInfo();
		api.put(`/reviews/${this.state.review_id}`, formdata, {
			headers: {
				Authorization: this.state.token,
			},
		}).then((res)=> {

			Alert.alert("수정 완료", "리뷰가 정상적으로 수정되었습니다",[
				{
					text: '확인',
					onPress: () => this.props.navigation.goBack()
				},
				{
					style: 'cancel',
				}
			]) 
		}).catch((err) => {
			Alert.alert("요청 실패", err.response.data.error,[{text:'확인', style:'cancel'}]) 
		})
	}

	raitingCompleted(rate){
		rating = rate;
	}

	changeImage = (data) => {

		this.setState({images: data})

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

	componentDidMount(){
		//init params
		this.state.body = this.params.posts.body;
		this.state.rate = this.params.posts.rating;
		this.state.review_id = this.params.posts.review_id;
		this.state.post_title = this.params.posts.title;
		this.state.post_image = this.params.posts.image;
		this.state.booking_id = this.params.posts.id;
		this.state.images = this.params.posts.review_images;
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
			Alert.alert("삭제 완료", "리뷰가 정상적으로 삭제되었습니다.",[
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
	}

	render(){
		if(this.state.loading){
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
						<Body><Title style={{color:'black', alignSelf:'center'}}>리뷰 수정</Title></Body>
						<Right></Right>
					</Header>
				<Content>
					<Spinner visible={this.state.loading}/>
				</Content>
				</Container>
				</TouchableWithoutFeedback>
			)
		}
		else{
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
						<Body><Title style={{color:'black', alignSelf:'center'}}>리뷰 수정</Title></Body>
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
					<Content>
					<Spinner visible={this.state.loading}/>

					<ListItem thumbnail key={this.state.booking_id} style={{height : 100}}>
							<Left>
								<Thumbnail square source={{ uri: this.state.post_image }} />
							</Left>
							<Body>
								<Text>{this.state.post_title}</Text>
							</Body>
					</ListItem>
					<ImageSelect stateBus={this.changeImage} existing_image={this.state.images}/>
				
					<Rating
						fractions={1}
						ratingCount={5}
						imageSize={30}
						onFinishRating={this.raitingCompleted}
						style={{ paddingVertical: 10 }}
						startingValue={0}/>

					<Card>
							<CardItem>
									<ScrollView>
											<Body>
													<Textarea rowSpan={8} autoCapitalize='none'
													onChangeText={(text) => {this.setState({body : text}, () =>{})}}
													value={this.state.body}
													style={styles.textAreaContainer}
													/>
											</Body>
									</ScrollView>
							</CardItem>
					</Card>
					</Content>
					<View style = {styles.footer}>
							<Button transparent style = {styles.footerbutton} onPress={() => {this.putWriteReviewRequest()}}>
									<Text style={styles.footerText}>수정하기</Text>
							</Button>
					</View>
				</Container>
				</TouchableWithoutFeedback>
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
	textAreaContainer: {
		marginHorizontal: '2%',
		marginTop: '5%'
	},
})
export default UpdateReviewScreen;