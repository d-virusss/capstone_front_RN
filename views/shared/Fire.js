import * as firebase from 'firebase';
import 'firebase/firestore';
import dbS from './chat_db'; //database Sqlite
import SQLite from 'react-native-sqlite-storage';

class Fire{
  state = {
    chat_id:0,
    sender_id:0,
    avatar:'',
    other_id:-1,
  }

  constructor(){
    this.init();
    this.grantAuth();
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

  grantAuth = async()=>{
    if(!firebase.auth().currentUser)
      await firebase.auth().signInAnonymously();
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
    if(this.state.sender_id === sender){
      user._id = 1;
    }
    else {
      user._id = 2;
      this.state.other_id = sender;
      user.avatar = this.state.avatar=="/image/default.png" ? require("../../assets/default.png") : this.state.avatar;
    }
    if(chat === this.state.chat_id){
      /*dbS.transaction((tx)=>{
        tx.executeSql(`insert into table chat${this.state.chat_id} (id, text, timestamp, user) VALUE(${_id},${text},${createdAt},${user._id})`)
      })*/
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

  getOtherId = ()=>{
    return this.state.other_id;
  }

  get = callback => {
    this.db.on('child_added', snapshot => {
      callback(this.parse(snapshot))
    });
  }

  off(){
    this.db.off()
  }

  dropDBS(){
    SQLite.deleteDatabase(
      {name: 'test.db', location: '~www/test.db'},  
      () => { console.log('second db deleted');  },
      error => {
          console.log("ERROR: " + error); 
      }
  );
  }

  get db(){
    /*dbS.transaction((tx)=>{
      tx.executeSql(`create table if not exists chat${this.state.chat_id} (id,text,timestamp,user)`)
    })*/
    return firebase.database().ref(`chat${this.state.chat_id}/messages`);
  }

  get uid(){
    return(firebase.auth().currentUser || {}).uid
  }
}

export default new Fire();