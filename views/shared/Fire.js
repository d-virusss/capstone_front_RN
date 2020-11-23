import * as firebase from 'firebase';
import 'firebase/firestore';

class Fire{
  state = {
    chat_id:0,
    sender_id:0,
    avatar:''
  }

  constructor(){
    this.init();
  }

  getChatID = (chatID) => {
    this.state.chat_id = chatID;
  }

  getSenderID = (senderID) => {
    this.state.sender_id = senderID;
  }

  getAvatar = (avatarURI) => {
    this.state.avatar = avatarURI;
  }

  init = async () => {
    if(firebase.app.length == 1){
      console.log("fb initializing");
      firebase.initializeApp({
        apiKey : 'AIzaSyB_Wg-w1GigtelVYbmqPc9yPpsmNB01KWg',
        databaseURL:'https://applepink-37bde.firebaseio.com', 
        projectId : 'applepink-37bde'
      });
    }
  }

  signIn = async (user) => {
    try{
      await firebase.auth().signInWithEmailAndPassword(user.email, user.password);
    }
    catch(err) {console.log(err);}
  }

  createUser = async user => {
    try {
      await firebase.auth().createUserWithEmailAndPassword(user.email, user.password)

      let db = firebase.database().ref('users')
      db.set({
        name: user.name,
        email: user.email,
        avatar: null
      })
  
    } catch(error){
      console.log(error);
      alert("Error: "+ error);
    }
  }
  send = (messages) => {
    messages.forEach(item=>{
      const message = {
        sender: this.state.sender_id,
        chat: this.state.chat_id,
        text: item.text,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        user: item.user
      }
      this.db.push(message)
    })
  }

  parse = message => {
    let {user, text, timestamp, sender, chat} = message.val()
    const {key: _id} = message;
    const createdAt = new Date(timestamp);
    if(sender === this.state.sender_id){
      user._id = 1;
    }
    else {
      user._id = 2;
      user.avatar = this.state.avatar;
    }
    if(chat === this.state.chat_id){
      return{
        _id,
        createdAt,
        text,
        user,
      }
    }
    else{
      return{};
    }
  }

  get = callback => {
    this.db.on('child_added', snapshot => {
      callback(this.parse(snapshot))
    });
  }

  off(){
    this.db.off()
  }

  get db(){
    return firebase.database().ref(`chat${this.state.chat_id}/messages`);
  }

  get uid(){
    return(firebase.auth().currentUser || {}).uid
  }
}

export default new Fire();