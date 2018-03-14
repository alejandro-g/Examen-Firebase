webpackJsonp([0],{

/***/ 143:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 143;

/***/ }),

/***/ 186:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 186;

/***/ }),

/***/ 230:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_angularfire2_database__ = __webpack_require__(231);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_angularfire2_auth__ = __webpack_require__(279);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_firebase_app__ = __webpack_require__(437);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_firebase_app___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_firebase_app__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var HomePage = (function () {
    function HomePage(navCtrl, alertCtrl, actionSheetCtrl, afDatabase, afAuth) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.alertCtrl = alertCtrl;
        this.actionSheetCtrl = actionSheetCtrl;
        this.afDatabase = afDatabase;
        this.afAuth = afAuth;
        this.messagesRef = afDatabase.list('mensajes', function (ref) {
            return ref.orderByChild('order');
        });
        //despliegue de usuarios
        this.usersRef = afDatabase.list('users');
        this.users = this.usersRef.valueChanges();
        //despliegue de mensajes
        this.messages = this.messagesRef.valueChanges();
        console.log(this.messagesRef.valueChanges());
        //searchbar
        this.listUsersRef = __WEBPACK_IMPORTED_MODULE_4_firebase_app__["database"]().ref('/users');
        this.listUsersRef.on('value', function (userList) {
            var usuarios = [];
            userList.forEach(function (user) {
                usuarios.push(user.val());
                return false;
            });
            //traer usuarios existentes de firebase
            _this.userList = usuarios;
            _this.loadedUserList = usuarios;
        });
        // this.messages = this.messagesRef.orderByChild('numLikes').valueChanges();
        // firebase.database().ref('mensajes').orderByChild('numLikes').once('value').then(function(snapshot) {
        // });
        afAuth.authState.subscribe(function (user) {
            if (!user) {
                _this.currentUser = null;
                return;
            }
            _this.currentUser = { uid: user.uid, photoURL: user.photoURL, displayName: user.displayName };
        });
    }
    HomePage.prototype.addMessage = function () {
        var _this = this;
        var prompt = this.alertCtrl.create({
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
                    handler: function (data) {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Post',
                    handler: function (data) {
                        // radioPrompt.present();
                        var newMessageRef = _this.messagesRef.push({});
                        var numLikes = 0;
                        var authorName = '';
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
                            uid: _this.currentUser.uid,
                            postMode: _this.postMode,
                            author: {
                                name: _this.currentUser.displayName,
                                uid: _this.currentUser.uid
                            }
                        });
                    }
                }
            ]
        });
        var radioPrompt = this.alertCtrl.create();
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
            handler: function (getPostMode) {
                console.log(getPostMode);
                _this.postMode = getPostMode;
                prompt.present();
            }
        });
        radioPrompt.present();
    };
    HomePage.prototype.showOptions = function (messageId, messageTitle, messageLikes, messageAuthor) {
        var _this = this;
        var numlikes = parseInt(messageLikes);
        var actionSheet = this.actionSheetCtrl.create({
            title: 'What do you want to do?',
            buttons: [
                {
                    text: 'Follow this user',
                    handler: function () {
                        _this.followUser(messageAuthor);
                    }
                }, {
                    text: 'Delete Message',
                    role: 'destructive',
                    handler: function () {
                        _this.removeMessage(messageId);
                    }
                }, {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: function () {
                        console.log('Cancel clicked');
                    }
                },
            ]
        });
        actionSheet.present();
    };
    HomePage.prototype.removeMessage = function (messageId) {
        this.messagesRef.remove(messageId);
    };
    HomePage.prototype.followUser = function (author) {
        if (author.name === this.currentUser.displayName) {
            alert('You cannot follow yourself!');
        }
        else {
            __WEBPACK_IMPORTED_MODULE_4_firebase_app__["database"]().ref('users/' + author.uid).child('followers').push({
                name: this.currentUser.displayName,
                uid: this.currentUser.uid
            });
            alert('You have followed ' + author.name);
        }
    };
    HomePage.prototype.login = function () {
        var _this = this;
        this.afAuth.auth.signInWithPopup(new __WEBPACK_IMPORTED_MODULE_4_firebase_app__["auth"].GoogleAuthProvider())
            .then(function (response) {
            console.log('resultado login google:', response);
            var userRef = _this.afDatabase.list('users');
            userRef.update(response.user.uid, {
                userId: response.user.uid,
                displayName: response.user.displayName,
                photoURL: response.user.photoURL
            });
            //userRef.push({userId: xx.user.uid, displayName: xx.user.displayName}).then((xx)=>{
            //});
        });
    };
    HomePage.prototype.loginWithEmail = function () {
        this.afAuth.auth.signInWithPopup(new __WEBPACK_IMPORTED_MODULE_4_firebase_app__["auth"].EmailAuthProvider()).then(function (xx) {
        });
    };
    HomePage.prototype.logout = function () {
        this.afAuth.auth.signOut();
    };
    HomePage.prototype.presentFaveAlert = function (id, title, likes, orden) {
        __WEBPACK_IMPORTED_MODULE_4_firebase_app__["database"]().ref('mensajes/' + id).child('numLikes').set(likes + 1);
        __WEBPACK_IMPORTED_MODULE_4_firebase_app__["database"]().ref('mensajes/' + id).child('order').set(orden - 1);
        //console.log(firebase.database().ref('mensajes/' + id).child('order'));
        var alert = this.alertCtrl.create({
            title: 'Alert',
            subTitle: "Message liked!",
            buttons: ['Dismiss']
        });
        alert.present();
    };
    HomePage.prototype.presentDislikeAlert = function (id, title, dislikes, orden) {
        __WEBPACK_IMPORTED_MODULE_4_firebase_app__["database"]().ref('mensajes/' + id).child('numDislikes').set(dislikes + 1);
        __WEBPACK_IMPORTED_MODULE_4_firebase_app__["database"]().ref('mensajes/' + id).child('order').set(orden + 1);
        var alert = this.alertCtrl.create({
            title: 'Alert',
            subTitle: "Message Disliked!",
            buttons: ['Dismiss']
        });
        alert.present();
    };
    HomePage.prototype.updateMessagesList = function (mode) {
        this.messagesRef = this.afDatabase.list('/mensajes', function (ref) {
            return ref.orderByChild('postMode').equalTo(mode);
        });
        this.messages = this.messagesRef.valueChanges();
    };
    HomePage.prototype.initializeItems = function () {
        this.userList = this.loadedUserList;
    };
    HomePage.prototype.getItems = function (searchbar) {
        // Reset items back to all of the items
        this.initializeItems();
        // set q to the value of the searchbar
        var q = searchbar.srcElement.value;
        // if the value is an empty string don't filter the items
        if (!q) {
            return;
        }
        this.userList = this.userList.filter(function (v) {
            if (v.displayName && q) {
                if (v.displayName.toLowerCase().indexOf(q.toLowerCase()) > -1) {
                    return true;
                }
                return false;
            }
        });
        console.log(q, this.userList.length);
    };
    HomePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-home',template:/*ion-inline-start:"C:\Users\Diego\Documents\Universidad\Experiencia\uxClass\ionic\crudApp\src\pages\home\home.html"*/'<ion-header>\n\n  <ion-navbar>\n\n  <!--ion-buttons end *ngIf="afAuth.authState | async">\n\n          <button color="primary" ion-button icon-only (click)="addSong()">\n\n            <ion-icon name="add-circle"></ion-icon>\n\n          </button>\n\n        </ion-buttons-->\n\n        \n\n    <ion-title>\n\n      <ion-item class="item item-trns text-center">\n\n          Message Board\n\n        <ion-avatar item-end *ngIf="afAuth.authState | async">\n\n          <img src={{currentUser.photoURL}}>\n\n        </ion-avatar>\n\n      </ion-item>\n\n    </ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n    \n\n    <div *ngIf="afAuth.authState | async as user; else showLogin">\n\n        <button ion-button color="primary" full (click)="logout()">Logout</button>\n\n\n\n        <ion-searchbar (ionInput)="getItems($event)"></ion-searchbar>\n\n        <ion-list>\n\n          <ion-item *ngFor="let user of userList">\n\n            {{ user.displayName }}\n\n          </ion-item>\n\n        </ion-list>\n\n\n\n        <ion-list>\n\n          <ion-item>                  \n\n            <ion-card *ngFor="let user of users | async">\n\n              <label>{{user.displayName}} has logged in!</label>\n\n                <ion-avatar item-end *ngIf="afAuth.authState | async">\n\n                <img src={{user.photoURL}}></ion-avatar>\n\n            </ion-card>\n\n          </ion-item>\n\n          <ion-row>\n\n            <ion-col>\n\n                <ion-list radio-group col-sm>\n\n                    <ion-item>\n\n                      <ion-label>Privado</ion-label>\n\n                      <ion-radio (click) = "updateMessagesList(\'privado\')"></ion-radio>\n\n                    </ion-item>\n\n                    <ion-item>\n\n                      <ion-label>Mis amigos</ion-label>\n\n                      <ion-radio (click) = "updateMessagesList(\'misAmigos\')"></ion-radio>\n\n                    </ion-item>\n\n                    <ion-item>\n\n                      <ion-label>Publico</ion-label>\n\n                      <ion-radio (click) = "updateMessagesList(\'publico\')" checked></ion-radio>\n\n                    </ion-item>\n\n                  </ion-list>\n\n            </ion-col>\n\n            <ion-col></ion-col>\n\n            <ion-col></ion-col>\n\n            <ion-col></ion-col>\n\n          </ion-row>\n\n\n\n          <ion-row>\n\n            <ion-col>\n\n              <ion-card *ngFor="let message of messages | async">\n\n                  \n\n                <label (click)="showOptions(message.id, message.title, message.numLikes, message.author)">{{message.author.name}} says: {{message.title}}</label>\n\n                  <br><br>\n\n\n\n                  <button ion-button icon-left clear small (click) ="presentFaveAlert(message.id, message.title, message.numLikes, message.order)">\n\n                    <ion-icon name="thumbs-up"></ion-icon>\n\n                    <div>Likes ({{message.numLikes}})</div>\n\n                  </button>\n\n\n\n                  <button ion-button icon-left clear small (click) = "presentDislikeAlert(message.id, message.title, message.numDislikes, message.order)">\n\n                    <ion-icon name="thumbs-down"></ion-icon>\n\n                    <div>Dislikes ({{message.numDislikes}})</div>\n\n                  </button>\n\n\n\n              </ion-card>\n\n            </ion-col>\n\n          </ion-row>\n\n        </ion-list>\n\n        <ion-fab right bottom>\n\n          <button ion-fab  (click)="addMessage()">\n\n            <ion-icon name="add" ></ion-icon>\n\n          </button>\n\n        </ion-fab>\n\n\n\n      </div>\n\n      <ng-template #showLogin>\n\n        <p>Please login.</p>\n\n        <button ion-button color="danger"  full (click)="login()" icon-right>\n\n          <ion-icon name="logo-googleplus"></ion-icon>\n\n          Login with Google\n\n        </button>\n\n      </ng-template>\n\n\n\n</ion-content>\n\n'/*ion-inline-end:"C:\Users\Diego\Documents\Universidad\Experiencia\uxClass\ionic\crudApp\src\pages\home\home.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* ActionSheetController */],
            __WEBPACK_IMPORTED_MODULE_2_angularfire2_database__["a" /* AngularFireDatabase */],
            __WEBPACK_IMPORTED_MODULE_3_angularfire2_auth__["a" /* AngularFireAuth */]])
    ], HomePage);
    return HomePage;
}());

//# sourceMappingURL=home.js.map

/***/ }),

/***/ 281:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(282);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(302);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 302:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export firebaseConfig */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(226);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_status_bar__ = __webpack_require__(229);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__app_component__ = __webpack_require__(351);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_home_home__ = __webpack_require__(230);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_angularfire2__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_angularfire2_database__ = __webpack_require__(231);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_angularfire2_auth__ = __webpack_require__(279);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};







// Import the AF2 Module



// AF2 Settings
var firebaseConfig = {
    apiKey: "AIzaSyBOnxFk37VQFl9St6wVC5t2j5Iv5t5WKpY",
    authDomain: "examen1-b5587.firebaseapp.com",
    databaseURL: "https://examen1-b5587.firebaseio.com",
    projectId: "examen1-b5587",
    storageBucket: "",
    messagingSenderId: "241109683590"
};
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_5__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_6__pages_home_home__["a" /* HomePage */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["e" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_5__app_component__["a" /* MyApp */], {}, {
                    links: []
                }),
                __WEBPACK_IMPORTED_MODULE_7_angularfire2__["a" /* AngularFireModule */].initializeApp(firebaseConfig),
                __WEBPACK_IMPORTED_MODULE_8_angularfire2_database__["b" /* AngularFireDatabaseModule */],
                __WEBPACK_IMPORTED_MODULE_9_angularfire2_auth__["b" /* AngularFireAuthModule */]
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["c" /* IonicApp */]],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_5__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_6__pages_home_home__["a" /* HomePage */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_4__ionic_native_status_bar__["a" /* StatusBar */],
                __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */],
                { provide: __WEBPACK_IMPORTED_MODULE_1__angular_core__["u" /* ErrorHandler */], useClass: __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["d" /* IonicErrorHandler */] }
            ]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 351:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(229);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(226);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_home_home__ = __webpack_require__(230);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var MyApp = (function () {
    function MyApp(platform, statusBar, splashScreen) {
        this.rootPage = __WEBPACK_IMPORTED_MODULE_4__pages_home_home__["a" /* HomePage */];
        platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();
        });
    }
    MyApp = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"C:\Users\Diego\Documents\Universidad\Experiencia\uxClass\ionic\crudApp\src\app\app.html"*/'<ion-nav [root]="rootPage"></ion-nav>\n\n'/*ion-inline-end:"C:\Users\Diego\Documents\Universidad\Experiencia\uxClass\ionic\crudApp\src\app\app.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* Platform */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */]])
    ], MyApp);
    return MyApp;
}());

//# sourceMappingURL=app.component.js.map

/***/ })

},[281]);
//# sourceMappingURL=main.js.map