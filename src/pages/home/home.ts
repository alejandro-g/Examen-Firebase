import { Component } from '@angular/core';
import { NavController, 
  AlertController, // To Add Button
  ActionSheetController // To delete
 } from 'ionic-angular';

import { AngularFireDatabase, AngularFireList, snapshotChanges } from 'angularfire2/database';
import { AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from '@firebase/util';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  currentUser:any;
  messagesRef:any;
  messages: AngularFireList<any>;
  currentAuthor:any;
  users: AngularFireList<any>;
  usersRef: any;
  userList: Array<any>;
  loadedUserList: Array<any>;
  listUsersRef: firebase.database.Reference;
  postMode: string[];
  status: string[];


  constructor(
    public navCtrl: NavController, 
    public alertCtrl: AlertController,
    public actionSheetCtrl: ActionSheetController,
    public afDatabase: AngularFireDatabase,
    public afAuth: AngularFireAuth
  ) {
    this.messagesRef = afDatabase.list('mensajes', ref => {
      return ref.orderByChild('order')
    });
    
    //despliegue de usuarios
    this.usersRef = afDatabase.list('users');
    this.users = this.usersRef.valueChanges();

    //despliegue de mensajes
    this.messages = this.messagesRef.valueChanges();
    console.log(this.messagesRef.valueChanges());
    
    //searchbar
    this.listUsersRef = firebase.database().ref('/users');
    this.listUsersRef.on('value', userList => {
      let usuarios = [];
      userList.forEach( user => {
        usuarios.push(user.val());
        return false;
      });
    
      //traer usuarios existentes de firebase
      this.userList = usuarios;
      this.loadedUserList = usuarios;
    });

    // this.messages = this.messagesRef.orderByChild('numLikes').valueChanges();

    // firebase.database().ref('mensajes').orderByChild('numLikes').once('value').then(function(snapshot) {
    // });

    afAuth.authState.subscribe(user => {
      if (!user) {
        this.currentUser = null;
        return;
      }
      this.currentUser = {uid:user.uid, photoURL: user.photoURL, displayName: user.displayName};
      
    });
  }

  addMessage(){
    let prompt = this.alertCtrl.create({
      title: 'Contenido del mensaje',
      message: "Por favor entre contenido del mensaje que desea publicar ",
      inputs: [
        {
          name: 'title',
          placeholder: 'Mensaje'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Post',
          handler: data => {
            // radioPrompt.present();
            const newMessageRef = this.messagesRef.push({});
            var numLikes: number = 0;
            let authorName = '';
            //console.log(data);
            // firebase.database().ref('users/' + this.currentUser.uid).once('value').then(function(snapshot){
            //   this.currentAuthor = snapshot.val().displayName;
            // });
            //console.log(this.currentAuthor);
            newMessageRef.set({
              id: newMessageRef.key,
              title: data.title,
              numLikes: 0,
              numDislikes: 0,
              order: 100000000,
              uid: this.currentUser.uid,
              postMode: this.postMode,
              author: {
                name: this.currentUser.displayName,
                uid: this.currentUser.uid
              }
            });
          }
        }
      ]
    });
    let radioPrompt = this.alertCtrl.create();
    radioPrompt.addInput({
      type: 'radio',
      label: 'Privado',
      value: 'privado',
      checked: true
    });
    radioPrompt.addInput({
      type: 'radio',
      label: 'Mis  Amigos',
      value: 'misAmigos'
    });
    radioPrompt.addInput({
      type: 'radio',
      label: 'Publico',
      value: 'publico'
    });
    radioPrompt.addButton('Cancel');
    radioPrompt.addButton({
      text: 'OK',
      handler: getPostMode => {
        console.log(getPostMode);
        this.postMode = getPostMode; 
        prompt.present();
      }
    });
    radioPrompt.present();
  }

  showOptions(messageId, messageTitle, messageLikes, messageAuthor) {
    var numlikes: number = parseInt(messageLikes);
    let actionSheet = this.actionSheetCtrl.create({
      title: 'What do you want to do?',
      buttons: [
        {
          text: 'Follow this user',
          handler: () => {
            this.followUser(messageAuthor);
          }
        }, {
          text: 'Delete Message',
          role: 'destructive',
          handler: () => {
            this.removeMessage(messageId);
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
      ]
    });
    actionSheet.present();
  }

  removeMessage(messageId: string){
    this.messagesRef.remove(messageId);
  }

  followUser(author) {
    if (author.name === this.currentUser.displayName){
      alert('You cannot follow yourself!');
    } else {
      firebase.database().ref('users/' + author.uid).child('followers').push({
        name: this.currentUser.displayName,
        uid: this.currentUser.uid
      });
      alert('You have followed ' + author.name);
    }
  }

  login() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .then((response)=>{
      console.log('resultado login google:', response);
      
      const userRef = this.afDatabase.list('users');

      userRef.update(response.user.uid, 
        {
          userId: response.user.uid, 
          displayName: response.user.displayName,
          photoURL: response.user.photoURL
        });
      //userRef.push({userId: xx.user.uid, displayName: xx.user.displayName}).then((xx)=>{
      //});
    });
  }

  loginWithEmail() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.EmailAuthProvider()).then((xx)=>{

    });
  }
  logout() {
    this.afAuth.auth.signOut();
  }

  presentFaveAlert(id, title, likes, orden){
    firebase.database().ref('mensajes/' + id).child('numLikes').set(likes + 1);
    firebase.database().ref('mensajes/' + id).child('order').set(orden - 1);

    //console.log(firebase.database().ref('mensajes/' + id).child('order'));
    let alert = this.alertCtrl.create({
      title: 'Alert',
      subTitle: "Message liked!",
      buttons: ['Dismiss']
    });
    alert.present();
  }

  presentDislikeAlert(id, title, dislikes, orden){
    firebase.database().ref('mensajes/' + id).child('numDislikes').set(dislikes + 1);
    firebase.database().ref('mensajes/' + id).child('order').set(orden + 1);
    let alert = this.alertCtrl.create({
      title: 'Alert',
      subTitle: "Message Disliked!",
      buttons: ['Dismiss']
    });
    alert.present();
  }

  updateMessagesList(mode){
    this.messagesRef = this.afDatabase.list('/mensajes', ref => {
      return ref.orderByChild('postMode').equalTo(mode);
    });
    this.messages = this.messagesRef.valueChanges();
  }

  initializeItems(): void {
    this.userList = this.loadedUserList;
  }

  getItems(searchbar) {
    // Reset items back to all of the items
    this.initializeItems();
  
    // set q to the value of the searchbar
    var q = searchbar.srcElement.value;
  
  
    // if the value is an empty string don't filter the items
    if (!q) {
      return;
    }
  
    this.userList = this.userList.filter((v) => {
      if(v.displayName && q) {
        if (v.displayName.toLowerCase().indexOf(q.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
  
    console.log(q, this.userList.length);
  
  }
}
