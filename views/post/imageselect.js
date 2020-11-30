import React, {Component} from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-crop-picker';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import Swiper from 'react-native-swiper';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import { Container, Text, ScrollView } from 'native-base';
import { SliderBox } from "react-native-image-slider-box";
import _ from 'lodash'
IconM.loadFont();

const windowHeight = Dimensions.get('window').height;
class ImageSelect extends Component{
  constructor(props){
    super(props)
    this.state={
      images: this.props.existing_image === undefined ? [] : this.props.existing_image,
      isImage : this.props.existing_image === undefined ? false : true,
      isProfile : this.props.isProfile === undefined ? false : this.props.isProfile,
    }
  }
  
  componentDidMount(){
    console.log('in imageselect ----------------')
    console.log(this.state)
    console.log(this.props)
  }

  doPickImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      multiple: true,
      sortOrder : 'desc',
      maxFiles : this.state.isProfile ? 1 : 5,
      compressImageQuality : 0.1,
      
    }).then(images => {
      this.state.images = []
      _.each(images, (image) => {
        this.state.images.push(`${image.sourceURL}`)
      })
      this.setState({ isImage: true })
      this.props.stateBus(images)
    });
  }

  render(){
    return(
      <View>
        <SliderBox style={styles.swiper}
          images={this.state.images}
          onCurrentImagePressed={ () => this.doPickImage() }
          sliderBoxHeight={300}
          inactiveDotColor="#ffccdd"
          dotColor="#ff3377" />
        
        {!this.state.isImage &&
          <TouchableOpacity style={styles.imageArea}
          onPress = { () => this.doPickImage() } >
          {this.state.images.length === 0 && (
            <IconM name = 'image-multiple' size = {100}/>
          )}
        </TouchableOpacity>}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  imageArea: {
    width: '70%',
    alignItems: 'center',
    alignSelf : 'center',
    marginVertical : '15%'
  }, 
  swiper :{
    width : 300,
    height : 300,
    justifyContent : 'center',
    alignSelf : 'center',
  },
})

export default ImageSelect;