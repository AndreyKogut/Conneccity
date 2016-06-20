"use strict";var GOOGLE_IP="http://46.63.90.181:8080/",app=angular.module("conneccityApp",["ngScrollbar","ngResource","ui.router","signIn","signUp","conneccityMap","users","userProfile","meetings","events","dataFormatter","ngCookies","angular-oauth2","chatList","chat","eventProfile","meetingProfile","geolocation","createMeeting"]);app.run(["$rootScope","$state","OAuth","$location",function(e,t,n,o){n.isAuthenticated()||"/signUp"==o.path()||o.path("/signIn");var r=btoa("clientapp:123456");e.$on("oauth:error",function(e,a){return"invalid_grant"!==a.data.error?"invalid_token"===a.data.error?n.getRefreshToken({},{headers:{Authorization:"Basic "+r,"Content-Type":"application/x-www-form-urlencoded;charset=utf-8"}}).then(function(){t.reload()},function(){t.go("authorization")}):(o.path("/signIn"),o.path("/signIn")):void 0}),e.$on("$locationChangeStart",function(e,t,r){n.isAuthenticated()||"/signUp"==o.path()||o.path("/signIn")})}]),app.config(["$stateProvider","$urlRouterProvider","$locationProvider","OAuthProvider","OAuthTokenProvider",function(e,t,n,o,r){e.state("authorization",{url:"/signIn",templateUrl:"views/signin.html",controller:"signInController"}).state("registration",{url:"/signUp",templateUrl:"views/signup.html",controller:"signUpController"}).state("app",{url:"/",views:{"":{templateUrl:"views/app.html",controller:"appController"},"content@app":{templateUrl:"views/map.html"}}}).state("app.profile",{url:"profile",views:{"content@app":{templateUrl:"views/userProfile.html",controller:"signedUserProfile"}}}).state("app.users",{url:"users",views:{"content@app":{templateUrl:"views/users.html",controller:"usersController"}}}).state("app.users.id",{url:"/{id:int}",views:{"content@app":{templateUrl:"views/userProfile.html",controller:"userProfileController"}}}).state("app.events",{url:"events",views:{"content@app":{templateUrl:"views/events.html",controller:"eventsController"}}}).state("app.events.id",{url:"/{id:int}",views:{"content@app":{templateUrl:"views/eventProfile.html",controller:"eventProfileController"}}}).state("app.meetings",{url:"meetings",views:{"content@app":{templateUrl:"views/meetings.html",controller:"meetingsController"}}}).state("app.meetingCreate",{url:"createmeeting",views:{"content@app":{templateUrl:"views/createMeeting.html",controller:"createMeetingController"}}}).state("app.meetings.id",{url:"/{id:int}",views:{"content@app":{templateUrl:"views/meetingProfile.html",controller:"meetingProfileController"}}}).state("app.chat",{url:"chat",views:{"content@app":{templateUrl:"views/chatList.html",controller:"chatListController"}}}).state("app.chat.id",{url:"/{id:int}",views:{"chat@app.chat":{templateUrl:"views/chat.html",controller:"chatController"}}}),t.otherwise("/"),o.configure({baseUrl:GOOGLE_IP,clientId:"clientapp",clientSecret:"123456",grantPath:"/oauth/token",revokePath:"/oauth/token"}),r.configure({name:"token",options:{secure:!1}})}]),app.controller("appController",["$scope","getSignedUserInfo","OAuthToken","formatter","$cookies",function(e,t,n,o,r){t.get().then(function(t){e.user=t.data,r.putObject("currentUser",e.user),console.log(r.getObject("currentUser"))}),e.logout=function(){n.removeToken()},e.scrollBuild=function(){e.$broadcast("rebuild:me")},e.getUserImgUrl=function(e){return o.getUserImg(e)}}]),app.factory("getSignedUserInfo",["$http",function(e){return{get:function(){return e({url:GOOGLE_IP+"profile",method:"GET"})}}}]);var signInModule=angular.module("signIn",["ui.router","ngCookies"]);signInModule.controller("signInController",["$scope","$http","$state","OAuth",function(e,t,n,o){e.login=function(t){t.scope="",e.encoded=btoa("clientapp:123456"),o.getAccessToken(t,{headers:{Authorization:"Basic "+e.encoded,"Content-Type":"application/x-www-form-urlencoded;charset=utf-8"}}).then(function(){n.go("app")})}}]);var signUpModule=angular.module("signUp",["ngResource","ui.router"]);signUpModule.factory("addUser",["$http",function(e){return{create:function(t){return e({url:GOOGLE_IP+"signup",method:"POST",data:t,headers:{"Content-Type":"application/json"}})}}}]),signUpModule.controller("signUpController",["$scope","addUser","OAuthToken","$state","$cookies","getUserLocation",function(e,t,n,o,r,a){e.signUp=function(i){e.userInfo={email:i.email,name:i.firstName,surname:i.lastName,dateBirthday:"1997-12-20",gender:i.genderMale?"1":"2",password:i.password,passwordConfirm:i.passwordConfirm},t.create(e.userInfo).then(function(e){n.setToken(e.data),console.log(e),r.putObject(i),a.get()}).then(function(){o.go("app")})}}]);var mapModule=angular.module("conneccityMap",["ngResource","ui.router"]);mapModule.directive("conneccityMap",function(){return{templateUrl:"views/_map.html",controller:"mapCreateController"}}),mapModule.controller("mapCreateController",["$scope","mapCreate","getMapInfo","formatter","$q",function(e,t,n,o,r){e.filterState=!1,e.toggleState=function(){e.filterState=!e.filterState},e.peopleState=!1,e.togglePeople=function(){e.peopleState=!e.peopleState,e.eventState=!1,e.meetingState=!1},e.meetingState=!1,e.toggleMeeting=function(){e.meetingState=!e.meetingState,e.eventState=!1,e.peopleState=!1},e.eventState=!1,e.toggleEvent=function(){e.meetingState=!1,e.peopleState=!1,e.eventState=!e.eventState},e.cardVisible=!1,e.cardCounter=0,e.toggleCard=function(){e.cardVisible=!1},e.getPreviousCard=function(){e.cardCounter>0&&e.cardCounter--},e.getNextCard=function(){e.cardCounter<e.cardInfo.length-1&&e.cardCounter++},e.getFormattedDistance=function(e){return o.getDistance(e)},e.setAllInfo=function(){console.log("setting"),n.getAll().then(function(e){console.log(e.data),t.clearMap(),t.setData(e.data)})},e.parseDate=function(e){return o.formatDate(e)},e.coordinates=new Map,e.getAddress=function(e,t){return o.getAddress(e,t)},e.$watchGroup([function(){return t.cardsArray},function(){return t.coordinatesMap}],function(n,o){"undefined"!=n[0]&&n[0]!=o[0]&&(e.cardVisible=!0,e.cardInfo=t.cardsArray,e.cardCounter=0),"undefined"!=n[1]&&(e.coordinates=t.coordinatesMap)}),e.zoomIn=function(){t.zoomIn()},e.zoomOut=function(){t.zoomOut()},t.initMap(),e.setAllInfo(),e.filterMap=function(){var r={meetingStartAtFrom:o.getUnixTime(e.meetingTimeFrom),meetingStartAtTo:o.getUnixTime(e.meetingTimeTo),meetingMembersCountFrom:e.meetingMembersFrom,meetingMembersCountTo:e.meetingMembersTo,eventStartAtFrom:o.getUnixTime(e.eventTimeFrom),eventStartAtTo:o.getUnixTime(e.eventTimeTo),eventMembersCountFrom:e.eventMembersFrom,eventMembersCountTo:e.eventMembersTo,userGender:e.getGender(e.genderMale,e.genderFemale),userAgeFrom:e.ageFrom,userAgeTo:e.ageTo};n.getFilteredInfo(r).then(function(e){t.clearMap(),t.setData(e.data)})},e.centerMap=function(){t.centerMapToUser()},e.getGender=function(e,t){return o.getGender(e,t)}}]),mapModule.service("mapCreate",["$rootScope","$q","$cookies",function(e,t,n){var o=this;o.map=null,o.cluster=null,o.markersMap=new Map,o.coordinatesMap=new Map,o.cardsArray=[],o.geocoder=new google.maps.Geocoder,o.centerMapToUser=function(){o.map.setCenter(new google.maps.LatLng(n.getObject("currentUser").latitude,n.getObject("currentUser").longitude)),o.map.setZoom(10)},o.liteMapInit=function(e,t){o.map=new google.maps.Map(document.getElementById("map"),{center:{lat:e.latitude,lng:e.longitude+.005},zoom:16,maxZoom:16,minZoom:16,clickableIcons:!1,rotateControl:!1,disableDefaultUI:!0,draggable:!1}),o.markerCluster=new MarkerClusterer(o.map,[],[]);var n={};n[t]={0:e},console.log(n),o.setMarkers(n)},o.initMap=function(){o.map=new google.maps.Map(document.getElementById("map"),{center:{lat:49,lng:26},zoom:8,disableDefaultUI:!0,minZoom:2}),o.markerCluster=new MarkerClusterer(o.map,[],{gridSize:70,zoomOnClick:!1,styles:[{height:51,url:"img/cluster.png",width:54,fontFamily:"Roboto",textSize:14,textColor:"#898989"},{height:51,url:"img/cluster-favorite.png",width:54,fontFamily:"Roboto",textSize:14,textColor:"#ffffff"}]}),o.markerCluster.setCalculator(r),google.maps.event.addListener(o.markerCluster,"clusterclick",function(t){var n=t.getMarkers();o.cardsArray=[];for(var r=0;r<n.length;r++)o.cardsArray.push(o.markersMap.get(n[r]));e.$digest()})};var r=function(e,t){for(var n in e)if(o.markersMap.get(e[n]).hasPonchesMatches)return{text:e.length,index:2};return{text:e.length,index:1}};o.setData=function(e){o.setMarkers(e)},o.setMarkers=function(e){console.log("mark");for(var t in e){console.log(e[t]);for(var n in e[t]){var r=e[t][n];switch(t){case"meetings":console.log("met"),r.eventtype="meeting";break;case"events":r.eventtype="event";break;case"people":r.eventtype=""}o.drawMarker(r.photos?r.photos.photo200px:"img/test/pin.png","img/test/cluster.png",r)}}},o.drawMarker=function(e,t,n){function r(){l++,2==l&&(c.width=400,c.height=600,u.drawImage(d,0,3,300,420),u.arc(150,160,110,0,2*Math.PI,!0),u.clip(),u.drawImage(m,20,40,250,250),u.clip(),o.createMarker(c.toDataURL(),n,new google.maps.Size(60,85)))}function a(){l++,2==l&&(c.width=400,c.height=400,u.drawImage(d,0,0,400,400),u.arc(200,190,140,0,2*Math.PI,!0),u.clip(),u.drawImage(m,45,35,310,310),u.clip(),o.createMarker(c.toDataURL(),n,new google.maps.Size(50,50)))}function i(){l++,2==l&&(c.width=400,c.height=600,u.drawImage(d,0,0,400,430),s(75,60,250,250,0),u.clip(),u.drawImage(m,50,30,300,300),o.createMarker(c.toDataURL(),n,new google.maps.Size(50,70)))}function s(e,t,n,o,r){u.beginPath(),u.moveTo(e+r,t),u.lineTo(e+n-r,t),u.quadraticCurveTo(e+n,t,e+n,t+r),u.lineTo(e+n,t+o-r),u.quadraticCurveTo(e+n,t+o,e+n-r,t+o),u.lineTo(e+r,t+o),u.quadraticCurveTo(e,t+o,e,t+o-r),u.lineTo(e,t+r),u.quadraticCurveTo(e,t,e+r,t),u.closePath()}console.log("draw");var c=void 0,u=void 0,l=0,g=void 0;c=document.createElement("canvas"),u=c.getContext("2d");var m=new Image,d=new Image;"meeting"===n.eventtype?(d.src="img/meeting-marker.png",g=r,console.log("create meeting")):"event"===n.eventtype?(d.src=n.hasPonchesMatches?"img/event-marker-favorite.png":"img/event-marker.png",g=i,console.log("create event")):(d.src=n.hasPonchesMatches?"img/user-marker-favorite.png":"img/user-marker.png",g=a,console.log("create user")),m.onload=g,m.src=e,m.crossOrigin="anonymous",d.onload=g,d.crossOrigin="anonymous"},o.createMarker=function(t,n,r){console.log("create marker");var a=new google.maps.Marker({position:new google.maps.LatLng(n.latitude,n.longitude),icon:{url:t,size:r,scaledSize:r},animation:google.maps.Animation.DROP});o.markersMap.set(a,n),a.addListener("click",function(){console.log(o.markersMap.get(a)),o.cardsArray=[],o.cardsArray.push(o.markersMap.get(a)),e.$digest()}),o.markerCluster.addMarker(a)},o.getAddress=function(t){o.geocoder.geocode({latLng:new google.maps.LatLng(t[0],t[1])},function(n,r){console.log("getting address"),r===google.maps.GeocoderStatus.OK&&n[0]&&(o.coordinatesMap.set(t.join("|"),n[0].address_components[1].short_name+","+n[0].address_components[0].short_name),e.$digest())})},o.clearMap=function(){o.markerCluster.clearMarkers()},o.zoomIn=function(){o.map.setZoom(o.map.getZoom()+1)},o.zoomOut=function(){o.map.setZoom(o.map.getZoom()-1)}}]),mapModule.factory("getMapInfo",["$http",function(e){return{getAll:function(){return e({url:GOOGLE_IP+"map",method:"GET",params:{}})},getFilteredInfo:function(t){function n(e){var n=GOOGLE_IP+"map?";for(t in e)e[t]&&(n+=t+"="+e[t]+"&");return n=n.slice(0,-1),console.log(n),n}return e({url:n(t),method:"GET",params:{}})}}}]),mapModule.directive("conneccityMapLite",function(){return{templateUrl:"views/_map.html"}});var geolocationModule=angular.module("geolocation",[]);geolocationModule.factory("getUserLocation",["setLocation",function(e){return{get:function(){navigator.geolocation?navigator.geolocation.getCurrentPosition(function(t){console.log(t),e.set({latitude:t.coords.latitude,longitude:t.coords.longitude})},function(){handleNoGeolocation(!0)}):e.set({latitude:45,longitude:45})}}}]),geolocationModule.factory("setLocation",["$http",function(e){return{set:function(t){return e({url:GOOGLE_IP+"map",method:"POST",data:t,headers:{"Content-Type":"application/json"}})}}}]),mapModule.directive("mapResize",[function(){return{templateUrl:"views/mapResize.html"}}]),mapModule.directive("mapFilter",[function(){return{templateUrl:"views/mapFilter.html"}}]),mapModule.directive("mapUserPosition",[function(){return{templateUrl:"views/mapCUP.html"}}]),mapModule.directive("card",function(){return{templateUrl:"views/mapCard.html"}});var usersModule=angular.module("users",["ngScrollbar"]);usersModule.controller("usersController",["$scope","getUsers","formatter",function(e,t,n){t.get().then(function(t){e.users=t.data}),e.getEventImg=function(e){return n.getEventListImg(e)},e.parseDate=function(e){return n.formatDate(e)},e.getFormattedDistance=function(e){return n.getDistance(e)},e.$watch(function(){e.$broadcast("scrollRebuild")}),e.getUserImgUrl=function(e){return n.getUserListImg(e)}}]),usersModule.factory("getUsers",["$http",function(e){return{get:function(){return e({url:GOOGLE_IP+"users?count=50",method:"GET"})}}}]);var userProfileModule=angular.module("userProfile",["ngScrollbar"]);userProfileModule.controller("userProfileController",["$scope","getUserData","$stateParams","formatter",function(e,t,n,o){t.get(n.id).then(function(n){e.user=n.data,console.log(e.user),t.getEvents(e.user.id).then(function(t){e.events=t.data,console.log(e.events)})}),t.getChatId(n.id).then(function(t){console.log(t),e.chatId=t.data.id}),e.getFilteredEventsList=function(n){t.getEvents(e.user.id,n).then(function(t){e.events=t.data})},e.getEventImg=function(e){return o.getEventListImg(e)},e.parseDate=function(e){return o.formatDate(e)},e.aboutBox=!1,e.toggleAbout=function(){e.aboutBox=!e.aboutBox},e.getAge=function(e){return o.getAge(e)},e.getAddress=function(e,t){return o.getAddress(e,t)},e.getFormattedDistance=function(e){return o.getDistance(e)},e.lastSeenFormatted=function(e){return o.getLastSeenTime(e)},e.getUserImgUrl=function(e){return o.getUserImg(e)},e.$watch(function(){e.$broadcast("scrollRebuild")})}]),userProfileModule.factory("getUserData",["$http",function(e){return{get:function(t){return e({url:GOOGLE_IP+"users/"+t,method:"GET"})},getEvents:function(t){var n=arguments.length<=1||void 0===arguments[1]?"":arguments[1];return console.log(n),e({url:GOOGLE_IP+"users/"+t+"/events/"+n,method:"GET"})},getChatId:function(t){return e({url:GOOGLE_IP+"users/"+t+"/chat",method:"GET"})}}}]),userProfileModule.controller("signedUserProfile",["$scope","getUserData","formatter","$cookies",function(e,t,n,o){e.user=o.getObject("currentUser"),t.getEvents(e.user.id).then(function(t){e.events=t.data,console.log(e.events)}),e.getEventImg=function(e){return n.getEventListImg(e)},e.parseDate=function(e){return n.formatDate(e)},e.getFilteredEventsList=function(n){t.getEvents(e.user.id,n).then(function(t){e.events=t.data})},e.isProfile=!0,e.aboutBox=!1,e.toggleAbout=function(){e.aboutBox=!e.aboutBox},e.lastSeenFormatted=function(e){return n.getLastSeenTime(e)},e.getAge=function(e){return n.getAge(e)},e.getAddress=function(e,t){return n.getAddress(e,t)},e.getUserImgUrl=function(e){return n.getUserImg(e)},e.$watch(function(){e.$broadcast("scrollRebuild")})}]);var meetingsModule=angular.module("meetings",[]);meetingsModule.controller("meetingsController",["$scope","getMeetings","formatter","getMeetingInfo",function(e,t,n,o){t.get().then(function(t){e.meetings=t.data,console.log(e.meetings)}),e.getAddress=function(e,t){return n.getAddress(e,t)},e.getDistance=function(e){return n.getDistance(e)},e.getTime=function(e){return n.formatDate(e)},e.getFilteredMeetings=function(n){t.get(n).then(function(t){e.meetings=t.data,console.log(e.meetings)})},e.accept=function(e){o.join(e)},e.decline=function(e){o.leave(e)},e.getStatusStile=function(e){return n.getMeetingStatusIconStyle(e)},e.$watch(function(){e.$broadcast("rebuild:me")})}]),meetingsModule.factory("getMeetings",["$http",function(e){return{get:function(){var t=arguments.length<=0||void 0===arguments[0]?"":arguments[0];return e({url:GOOGLE_IP+"meetings/"+t,method:"GET"})}}}]);var meetingProfileModule=angular.module("meetingProfile",[]);meetingProfileModule.controller("meetingProfileController",["$scope","formatter","getMeetingInfo","$stateParams","mapCreate","$state",function(e,t,n,o,r,a){n.get(o.id).then(function(t){e.meeting=t.data,console.log(e.meeting),r.liteMapInit(e.meeting,"meetings")}),e.getAddress=function(e,n){return t.getAddress(e,n)},e.parseDate=function(e){return t.formatDate(e)},e.getUserImg=function(e){return t.getUserImg(e)},e.$watch(function(){e.$broadcast("scrollRebuild")}),e.join=function(e){n.join(e)},e.leave=function(e){n.leave(e).success(function(){a.go("app.meetings")})},n.sendMessage(o.id).then(function(t){console.log(t),e.chatId=t.data.id}),e.getStatusStile=function(e){return t.getMeetingStatusIconStyle(e)}}]),meetingProfileModule.factory("getMeetingInfo",["$http",function(e){return{get:function(t){return e({url:GOOGLE_IP+"meetings/"+t,method:"GET"})},getMembers:function(t){return e({url:GOOGLE_IP+"meetings/"+t+"/members",method:"GET"})},join:function(t){return e({url:GOOGLE_IP+"meetings/"+t+"/members",method:"POST"})},leave:function(t){return e({url:GOOGLE_IP+"meetings/"+t+"/members",method:"DELETE"})},sendMessage:function(t){return e({url:GOOGLE_IP+"meetings/"+t+"/chat",method:"GET"})}}}]);var createMeetingModule=angular.module("createMeeting",[]);createMeetingModule.controller("createMeetingController",["$scope","createMeeting",function(e,t){}]),createMeetingModule.factory("createMeeting",["$http",function(e){return{create:function(t){return e({url:GOOGLE_IP+"meetings/",method:"POST",data:t})}}}]);var eventsModule=angular.module("events",[]),eventsModule=angular.module("events",[]);eventsModule.controller("eventsController",["$scope","getEvents","formatter","$cookies",function(e,t,n,o){t.get().then(function(t){e.events=t.data}),e.getCurrentUserId=function(){return o.getObject("currentUser").id},e.getFilteredEvents=function(n){t.get(n).then(function(t){e.events=t.data})},e.getFormattedDistance=function(e){return n.getDistance(e)},e.parseDate=function(e){return n.formatDate(e)},e.getAddress=function(e,t){return n.getAddress(e,t)},e.getEventImg=function(e){return n.getEventListImg(e)},e.$watch(function(){e.$broadcast("rebuild:me")})}]),eventsModule.factory("getEvents",["$http",function(e){return{get:function(){var t=arguments.length<=0||void 0===arguments[0]?"":arguments[0];return e({url:GOOGLE_IP+"events/"+t,method:"GET"})}}}]);var eventProfile=angular.module("eventProfile",[]);eventProfile.factory("getEventInfo",["$http",function(e){return{get:function(t){return e({url:GOOGLE_IP+"events/"+t,method:"GET"})},getMembers:function(t){return e({url:GOOGLE_IP+"events/"+t+"/members",method:"GET"})},join:function(t){return e({url:GOOGLE_IP+"events/"+t+"/members",method:"POST"})},leave:function(t){return e({url:GOOGLE_IP+"events/"+t+"/members",method:"DELETE"})},sendMessage:function(t){return e({url:GOOGLE_IP+"events/"+t+"/chat",method:"GET"})}}}]),eventProfile.controller("eventProfileController",["$scope","getEventInfo","$stateParams","formatter","$cookies",function(e,t,n,o,r){t.get(n.id).then(function(t){e.event=t.data,console.log(e.event)}),t.getMembers(n.id).then(function(t){e.members=t.data,console.log(e.members)}),e.getAddress=function(e,t){return o.getAddress(e,t)},e.parseDate=function(e){return o.formatDate(e)},e.getUserImg=function(e){return o.getUserImg(e)},e.$watch(function(){e.$broadcast("scrollRebuild")}),e.join=function(n){t.join(n).success(function(){e.toggleMember()})},e.leave=function(n){t.leave(n).success(function(){e.toggleMember()})},e.toggleMember=function(){e.event.isMember?(e.event.isMember=!1,e.members.shift()):(e.members.unshift(r.getObject("currentUser")),e.event.isMember=!0)},t.sendMessage(n.id).then(function(t){console.log(t),e.chatId=t.data.id})}]);var chatListModule=angular.module("chatList",["ngWebSocket"]);chatListModule.factory("getSocketData",["OAuthToken",function(e){var t={};return t.connect=function(){if(!t.ws){var e=new WebSocket("ws://api.conneccity.net/notifications");e.onopen=function(){console.log("Succeeded to open a conection")},e.onerror=function(){console.log("Failed to open a connection")},e.onmessage=function(e){},t.ws=e}},t.subscribe=function(e){t.callback=e},t}]),chatListModule.factory("getChats",["$http",function(e){return{get:function(){return e({url:GOOGLE_IP+"chats/",method:"GET"})}}}]),chatListModule.controller("chatListController",["$scope","getSocketData","formatter","getChats","getUserData",function(e,t,n,o,r){t.connect(),o.get().then(function(t){e.chats=t.data,console.log(t)}).then(function(){console.log(e.chats)}),e.getUserImg=function(e){return n.getUserImgUrl(e)},e.getLastSeenTime=function(e){return n.getLastSeenTime(e)},e.$watch(function(){e.$broadcast("rebuild:me")})}]);var chatModule=angular.module("chat",["ngWebSocket"]);chatModule.factory("getChat",["$http",function(e){return{get:function(t){return e({url:GOOGLE_IP+"chats/"+t,method:"GET"})},getMessages:function(t){return e({url:GOOGLE_IP+"chats/"+t+"/messages",method:"GET"})},send:function(t,n){return e({url:GOOGLE_IP+"chats/"+t+"/messages",data:{message:n},method:"POST"})}}}]),chatModule.controller("chatController",["$scope","getSocketData","formatter","getChat","$stateParams","$cookies","$interval",function(e,t,n,o,r,a,i){e.currentUserId=a.getObject("currentUser").id,o.get(r.id).then(function(t){e.chat=t.data,console.log(t)}).then(function(){o.getMessages(r.id).then(function(t){e.messages=t.data,console.log(t)})}),i(function(){o.getMessages(r.id).then(function(t){e.messages!=t.data&&e.messages!=t.data})},5e3),e.getTime=function(e){return n.getTime(e)},e.getUserImg=function(e){return n.getUserImgUrl(e)},e.getLastSeenTime=function(e){return n.getTime(e)},e.checkSender=function(t){return t==e.currentUserId},e.sendMessage=function(t){console.log(t),o.send(r.id,t).then(function(n){e.messages.unshift({message:t,date:new Date,sender:{id:e.currentUserId}}),e.message=""})}}]),chatModule.directive("schrollBottom",function(){return{scope:{schrollBottom:"="},link:function(e,t){e.$watchCollection("schrollBottom",function(e){e&&(t[0].scrollTop=t[0].scrollHeight)})}}});var dataFormatterModule=angular.module("dataFormatter",[]);dataFormatterModule.factory("formatter",["mapCreate",function(e){return{formatDate:function(e){var t=new Date(e),n="en-us",o=t.getDay(),r=t.toLocaleString(n,{month:"short"}),a=t.toLocaleTimeString(n,{hour:"2-digit",minute:"2-digit",hour12:!1});return o+" "+r+", "+a},getAddress:function(t,n){var o=e.coordinatesMap.get([t,n].join("|"));return!o&&t&&n&&e.getAddress([t,n]),o},getDistance:function(e){return 1e3>e?e+"m":(e/1e3).toFixed(1)+"km"},getGender:function(e,t){return e&&t?null:e?1:t?2:null},getUnixTime:function(e){return new Date(e).getTime()/1e3|0},getAge:function(e){var t=new Date,n=new Date(e);return t.getYear()-n.getYear()-!!(t.getMonth()-n.getMonth())},getLastSeenTime:function(e){var t=6e4,n=60*t,o=24*n,r="en-us",a=new Date,i=new Date(e),s=new Date(a-i);return s>o?i.toLocaleDateString(r):s>n?(s/n).toFixed(0)+" hours ago":s>t?(s/t).toFixed(0)+" minutes ago":t>s?(s/1e3).toFixed(0)+" seconds ago":void 0},getUserListImg:function(e){return e?e:"img/test/user-list-img.jpg"},getUserImg:function(e){return e?e:"img/test/user-icon.jpg"},getEventListImg:function(e){return e?e:"img/test/profile-card-bg.jpg"},getMeetingStatusIconStyle:function(e){return"DECLINED"==e?"meeting-status-icon_declined":"INVITED"==e?"meeting-status-icon_invited":"meeting-status-icon_accepted"},getTime:function(e){var t=new Date(e);return t.getHours()+":"+t.getMinutes()}}}]);