"use strict";var _slicedToArray=function(){function e(e,t){var n=[],r=!0,o=!1,a=void 0;try{for(var i,c=e[Symbol.iterator]();!(r=(i=c.next()).done)&&(n.push(i.value),!t||n.length!==t);r=!0);}catch(s){o=!0,a=s}finally{try{!r&&c["return"]&&c["return"]()}finally{if(o)throw a}}return n}return function(t,n){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),GOOGLE_IP="http://api.conneccity.net/dev/",app=angular.module("conneccityApp",["ngAnimate","ngScrollbar","ngResource","ui.router","signIn","signUp","conneccityMap","users","userProfile","meetings","events","dataFormatter","ngCookies","angular-oauth2","chatList","chat","eventProfile","meetingProfile","geolocation","createMeeting","createEvent","websocket","placePicker","ponchPicker"]);app.run(["$rootScope","$state","OAuth","$location","getUserLocation",function(e,t,n,r,o){n.isAuthenticated()||"/signUp"==r.path()||r.path("/signIn");var a=btoa("clientapp:123456");e.$on("oauth:error",function(e,o){return"invalid_grant"!==o.data.error?"invalid_token"===o.data.error?n.getRefreshToken({},{headers:{Authorization:"Basic "+a,"Content-Type":"application/x-www-form-urlencoded;charset=utf-8"}}).then(function(){t.reload()},function(){t.go("authorization")}):(r.path("/signIn"),r.path("/signIn")):void 0}),e.$on("$locationChangeStart",function(e,t,o){n.isAuthenticated()||"/signUp"==r.path()||r.path("/signIn")})}]),app.config(["$stateProvider","$urlRouterProvider","$locationProvider","OAuthProvider","OAuthTokenProvider",function(e,t,n,r,o){e.state("authorization",{url:"/signIn",templateUrl:"views/signin.html",controller:"signInController"}).state("registration",{url:"/signUp",templateUrl:"views/signup.html",controller:"signUpController"}).state("app",{url:"/",views:{"":{templateUrl:"views/app.html",controller:"appController"},"content@app":{templateUrl:"views/map.html"}}}).state("app.profile",{url:"profile",views:{"content@app":{templateUrl:"views/userProfile.html",controller:"signedUserProfile"}}}).state("app.users",{url:"users",views:{"content@app":{templateUrl:"views/users.html",controller:"usersController"}}}).state("app.users.id",{url:"/{id:int}",views:{"content@app":{templateUrl:"views/userProfile.html",controller:"userProfileController"}}}).state("app.events",{url:"events",views:{"content@app":{templateUrl:"views/events.html",controller:"eventsController"}}}).state("app.eventCreate",{url:"createevent",views:{"content@app":{templateUrl:"views/createEvent.html",controller:"createEventController"}}}).state("app.eventEdit",{url:"{{id:int}/eventedit}",views:{"content@app":{templateUrl:"views/createEvent.html",controller:"createEventController"}}}).state("app.events.id",{url:"/{id:int}",views:{"content@app":{templateUrl:"views/eventProfile.html",controller:"eventProfileController"}}}).state("app.meetings",{url:"meetings",views:{"content@app":{templateUrl:"views/meetings.html",controller:"meetingsController"}}}).state("app.meetingCreate",{url:"create-meeting",views:{"content@app":{templateUrl:"views/createMeeting.html",controller:"createMeetingController"}}}).state("app.meetingEdit",{url:"{{id:int}/meeting-edit}",views:{"content@app":{templateUrl:"views/createMeeting.html",controller:"createMeetingController"}}}).state("app.meetings.id",{url:"/{id:int}",views:{"content@app":{templateUrl:"views/meetingProfile.html",controller:"meetingProfileController"}}}).state("app.chat",{url:"chat",views:{"content@app":{templateUrl:"views/chatList.html",controller:"chatListController"}}}).state("app.chat.id",{url:"/{id:int}",views:{"chat@app.chat":{templateUrl:"views/chat.html",controller:"chatController"}}}),t.otherwise("/"),r.configure({baseUrl:GOOGLE_IP,clientId:"clientapp",clientSecret:"123456",grantPath:"/oauth/token",revokePath:"/oauth/token"}),o.configure({name:"token",options:{secure:!1}})}]),app.controller("appController",["$scope","getSignedUserInfo","OAuthToken","formatter","$cookies","socketFactory","$stateParams","$interval","getUserLocation",function(e,t,n,r,o,a,i,c,s){s.get(),c(function(){s.get()},3e5);var u=function(){t.get().then(function(t){e.user=t.data,o.putObject("currentUser",e.user),e.ponchesList=[];for(var n in e.user.ponches)e.ponchesList.push(e.user.ponches[n].name)}),t.getInterests().then(function(t){e.related=[];for(var n in t.data)e.related.push(t.data[n].name)})};e.hidePicker=function(){e.show=!1},u(),n.isAuthenticated||a.connect(),t.getCounter().then(function(t){e.counter=new Set(t.data.unreadChatsIds),a.counter=e.counter}),e.logout=function(){n.removeToken()},e.scrollBuild=function(){e.$broadcast("rebuild:me")},e.getUserImgUrl=function(e){return r.getUserImg(e)},e.getCounter=function(){return e.counter?e.counter.size:0},e.submitPonches=function(n){t.putPonches(n).then(function(){e.show=!1,u()})}}]),app.factory("getSignedUserInfo",["$http",function(e){return{get:function(){return e({url:GOOGLE_IP+"profile",method:"GET"})},getInterests:function(){return e({url:GOOGLE_IP+"ponches",method:"GET"})},putPonches:function(t){return console.log(t),e({url:GOOGLE_IP+"profile/ponches",method:"PUT",data:{ponches:t}})},getCounter:function(){return e({url:GOOGLE_IP+"profile/counters",method:"GET"})}}}]);var signInModule=angular.module("signIn",["ui.router","ngCookies"]);signInModule.controller("signInController",["$scope","$http","$state","OAuth","$timeout","$animate",function(e,t,n,r,o,a){e.isValid=!0,e.conncction=!0,e.login=function(t){e.encoded=btoa("clientapp:123456"),r.getAccessToken(t,{headers:{Authorization:"Basic "+e.encoded,"Content-Type":"application/x-www-form-urlencoded;charset=utf-8"}}).then(function(){n.go("app")},function(t){"401"==t.status?e.isValid=!1:e.conncction=!1,o(function(){e.isValid=!0,e.conncction=!0},5e3)})}}]);var signUpModule=angular.module("signUp",["geolocation","ui.router"]);signUpModule.factory("addUser",["$http",function(e){return{create:function(t){return e({url:GOOGLE_IP+"signup",method:"POST",data:t,headers:{"Content-Type":"application/json"}})}}}]),signUpModule.controller("signUpController",["$scope","addUser","OAuthToken","$state","$cookies","getUserLocation",function(e,t,n,r,o,a){e.signUp=function(i){e.userInfo={email:i.email,name:i.firstName,surname:i.lastName,dateBirthday:"1997-12-20",gender:i.genderMale?"1":"2",password:i.password,passwordConfirm:i.passwordConfirm},t.create(e.userInfo).then(function(e){n.setToken(e.data),o.putObject(i),a.get()}).then(function(){r.go("app")})}}]);var mapModule=angular.module("conneccityMap",["ngResource","ui.router"]);mapModule.directive("conneccityMap",["mapCreate",function(e){return{compile:function(t,n){e.initMap(t[0])}}}]),mapModule.directive("conneccityMarker",["mapCreate",function(e){return{scope:{marker:"=data"},link:function(t,n,r){e.drawMarker(t.marker,r.type)}}}]),mapModule.controller("mapCreateController",["$scope","mapCreate","getMapInfo","formatter","$q","$state",function(e,t,n,r,o,a){n.getAll().then(function(t){e.markers=t.data}),e.filterState=!1,e.toggleState=function(){e.filterState=!e.filterState},e.peopleState=!1,e.togglePeople=function(){e.peopleState=!e.peopleState,e.eventState=!1,e.meetingState=!1},e.meetingState=!1,e.toggleMeeting=function(){e.meetingState=!e.meetingState,e.eventState=!1,e.peopleState=!1},e.eventState=!1,e.toggleEvent=function(){e.meetingState=!1,e.peopleState=!1,e.eventState=!e.eventState},e.cardVisible=!1,e.cardCounter=0,e.toggleCard=function(){e.cardVisible=!1},e.getPreviousCard=function(){e.cardCounter>0&&e.cardCounter--},e.getNextCard=function(){e.cardCounter<e.cardInfo.length-1&&e.cardCounter++},e.getFormattedDistance=function(e){return r.getDistance(e)},e.parseDate=function(e){return r.formatDate(e)},e.coordinates=new Map,e.getAddress=function(e,t){return r.getAddress(e,t)},e.$watchGroup([function(){return t.cardsArray},function(){return t.coordinatesMap}],function(n,r){"undefined"!=n[0]&&n[0]!=r[0]&&(e.cardVisible=!0,e.cardInfo=t.cardsArray,e.cardCounter=0),"undefined"!=n[1]&&(e.coordinates=t.coordinatesMap)}),e.zoomIn=function(){t.zoomIn()},e.zoomOut=function(){t.zoomOut()},e.filterMap=function(){var o={meetingStartAtFrom:r.getUnixTime(e.meetingTimeFrom),meetingStartAtTo:r.getUnixTime(e.meetingTimeTo),meetingMembersCountFrom:e.meetingMembersFrom,meetingMembersCountTo:e.meetingMembersTo,eventStartAtFrom:r.getUnixTime(e.eventTimeFrom),eventStartAtTo:r.getUnixTime(e.eventTimeTo),eventMembersCountFrom:e.eventMembersFrom,eventMembersCountTo:e.eventMembersTo,userGender:e.getGender(e.genderMale,e.genderFemale),userAgeFrom:e.ageFrom,userAgeTo:e.ageTo};n.getFilteredInfo(o).then(function(n){t.clearMap(),e.markers=n.data})},e.centerMap=function(){t.centerMapToUser()},e.getGender=function(e,t){return r.getGender(e,t)}}]),mapModule.service("mapCreate",["$rootScope","$q","$cookies",function(e,t,n){var r=this;r.map=null,r.cluster=null,r.markersMap=new Map,r.coordinatesMap=new Map,r.cardsArray=[],r.geocoder=new google.maps.Geocoder,r.centerMapToUser=function(){r.map.setCenter(new google.maps.LatLng(n.getObject("currentUser").latitude,n.getObject("currentUser").longitude)),r.map.setZoom(10)},r.initMap=function(t){r.map=new google.maps.Map(t,{center:{lat:49,lng:26},zoom:8,disableDefaultUI:!0,minZoom:2}),r.markerCluster=new MarkerClusterer(r.map,[],{gridSize:70,zoomOnClick:!1,styles:[{height:51,url:"img/cluster.png",width:54,fontFamily:"Roboto",textSize:14,textColor:"#898989"},{height:51,url:"img/cluster-favorite.png",width:54,fontFamily:"Roboto",textSize:14,textColor:"#ffffff"}]}),r.markerCluster.setCalculator(o),google.maps.event.addListener(r.markerCluster,"clusterclick",function(t){var n=t.getMarkers();r.cardsArray=[];for(var o=0;o<n.length;o++)r.cardsArray.push(r.markersMap.get(n[o]));e.$digest()})};var o=function(e,t){for(var n in e)if(r.markersMap.get(e[n]).hasPonchesMatches)return{text:e.length,index:2};return{text:e.length,index:1}};r.drawMarker=function(e,t){function n(){u++,2==u&&(c.width=400,c.height=600,s.drawImage(d,0,3,300,420),s.arc(150,160,110,0,2*Math.PI,!0),s.clip(),s.drawImage(g,20,40,250,250),s.clip(),r.createMarker(c.toDataURL(),e,new google.maps.Size(60,85)))}function o(){u++,2==u&&(c.width=400,c.height=400,s.drawImage(d,0,0,400,400),s.arc(200,190,140,0,2*Math.PI,!0),s.clip(),s.drawImage(g,45,35,310,310),s.clip(),r.createMarker(c.toDataURL(),e,new google.maps.Size(50,50)))}function a(){u++,2==u&&(c.width=400,c.height=600,s.drawImage(d,0,0,400,430),i(75,60,250,250,0),s.clip(),s.drawImage(g,50,30,300,300),r.createMarker(c.toDataURL(),e,new google.maps.Size(50,70)))}function i(e,t,n,r,o){s.beginPath(),s.moveTo(e+o,t),s.lineTo(e+n-o,t),s.quadraticCurveTo(e+n,t,e+n,t+o),s.lineTo(e+n,t+r-o),s.quadraticCurveTo(e+n,t+r,e+n-o,t+r),s.lineTo(e+o,t+r),s.quadraticCurveTo(e,t+r,e,t+r-o),s.lineTo(e,t+o),s.quadraticCurveTo(e,t,e+o,t),s.closePath()}var c=void 0,s=void 0,u=0,l=void 0;c=document.createElement("canvas"),s=c.getContext("2d");var g=new Image,d=new Image;"meeting"===t?(d.src="img/meeting-marker.png",g.src=e.photos?e.photos.photo200px:"img/test/meeting_icon.png",l=n):"event"===t?(g.src=e.photos?e.photos.photo200px:"img/test/event_icon.png",d.src=e.hasPonchesMatches?"img/event-marker-favorite.png":"img/event-marker.png",l=a):(g.src=e.photos?e.photos.photo200px:"img/test/user_icon.png",d.src=e.hasPonchesMatches?"img/user-marker-favorite.png":"img/user-marker.png",l=o),g.onload=l,g.crossOrigin="anonymous",d.onload=l,d.crossOrigin="anonymous"},r.createMarker=function(t,n,o){var a=new google.maps.Marker({position:new google.maps.LatLng(n.latitude,n.longitude),icon:{url:t,size:o,scaledSize:o},animation:google.maps.Animation.DROP});r.markersMap.set(a,n),a.addListener("click",function(){console.log(r.markersMap.get(a)),r.cardsArray=[],r.cardsArray.push(r.markersMap.get(a)),e.$digest()}),r.markerCluster.addMarker(a)},r.drawDefaultMarker=function(e){new google.maps.Marker({map:r.map,position:new google.maps.LatLng(e.latitude,e.longitude),animation:google.maps.Animation.DROP});r.map.setCenter({lat:e.latitude,lng:e.longitude+.005})},r.getAddress=function(t){r.geocoder.geocode({latLng:new google.maps.LatLng(t[0],t[1])},function(n,o){console.log("getting address"),o===google.maps.GeocoderStatus.OK&&n[0]&&(r.coordinatesMap.set(t.join("|"),n[0].address_components[1].short_name+","+n[0].address_components[0].short_name),e.$digest())})},r.clearMap=function(){r.markerCluster.clearMarkers()},r.zoomIn=function(){r.map.setZoom(r.map.getZoom()+1)},r.zoomOut=function(){r.map.setZoom(r.map.getZoom()-1)}}]),mapModule.factory("getMapInfo",["$http",function(e){return{getAll:function(){return e({url:GOOGLE_IP+"map",method:"GET",params:{}})},getFilteredInfo:function(t){function n(e){var n=GOOGLE_IP+"map?";for(t in e)e[t]&&(n+=t+"="+e[t]+"&");return n=n.slice(0,-1),console.log(n),n}return e({url:n(t),method:"GET",params:{}})}}}]);var geolocationModule=angular.module("geolocation",[]);geolocationModule.factory("getUserLocation",["setLocation",function(e){return{get:function(){navigator.geolocation?navigator.geolocation.getCurrentPosition(function(t){console.log(t),e.set({latitude:t.coords.latitude,longitude:t.coords.longitude})},function(){}):e.set({latitude:45,longitude:45})}}}]),geolocationModule.factory("setLocation",["$http",function(e){return{set:function(t){return e({url:GOOGLE_IP+"map",method:"POST",data:t,headers:{"Content-Type":"application/json"}})}}}]);var websocket=angular.module("websocket",[]);websocket.service("socketFactory",["OAuthToken","$rootScope","$cookies",function(e,t,n){var r=this,o=new WebSocket("ws://api.conneccity.net/dev/notifications?token="+e.getToken().access_token);r.counter=new Set,r.chatMessage={},r.message={},r.connect=function(){o.onopen=function(e){},o.onclose=function(e){console.log("close")},o.onmessage=function(e){var o=JSON.parse(e.data);console.log(o),r.message=o.payload,r.message.sender.id!=n.getObject("currentUser").id&&r.counter.add(o.payload.chatId),"MESSAGE_READ"==o.type?r.counter["delete"](o.payload.chatId):r.chatMessage[o.payload.chatId]=o.payload.id,t.$digest()},o.onerror=function(e){console.log(e)}}}]);var placePicker=angular.module("placePicker",["conneccityMap"]);placePicker.directive("placePicker",["mapCreate",function(e){return{template:"<conneccity-map class='map'></conneccity-map>",link:function(t,n,r){var o,a;google.maps.event.addListener(e.map,"click",function(n){o&&o.setMap(null),o=new google.maps.Marker({position:n.latLng,draggable:!0,map:e.map}),a={lat:o.position.lat(),lng:o.position.lng()},a&&(t.placePicker=a)})}}}]);var ponchPicker=angular.module("ponchPicker",[]);ponchPicker.controller("ponchPickerController",["$scope",function(e){var t=!1;e.add=function(n){if(e.my.length<5&&n){for(var r=0;r<e.my.length;r++)if(e.my[r]==n)return;e.my.push(n),e.item=""}t=!0},e["delete"]=function(n){for(var r=0;r<e.my.length;r++)e.my[r]==n&&(e.my.splice(r,1),t=!0)},e.submit=function(){t?e.submitFunc({ponches:e.my}):e.hideFunc()}}]),ponchPicker.directive("ponchPicker",[function(){return{scope:{my:"=my",related:"=related",hideFunc:"&",submitFunc:"&"},templateUrl:"views/ponchPicker.html",controller:"ponchPickerController"}}]),mapModule.directive("mapResize",[function(){return{templateUrl:"views/mapResize.html"}}]),mapModule.directive("mapFilter",[function(){return{templateUrl:"views/mapFilter.html"}}]),mapModule.directive("mapUserPosition",[function(){return{templateUrl:"views/mapCUP.html"}}]),mapModule.directive("card",function(){return{templateUrl:"views/mapCard.html"}});var usersModule=angular.module("users",["ngScrollbar"]);usersModule.controller("usersController",["$scope","getUsers","formatter",function(e,t,n){t.get().then(function(t){e.users=t.data}),e.getEventImg=function(e){return n.getEventListImg(e)},e.parseDate=function(e){return n.formatDate(e)},e.getFormattedDistance=function(e){return n.getDistance(e)},e.$watch(function(){e.$broadcast("scrollRebuild")}),e.getUserImgUrl=function(e){return n.getUserListImg(e)}}]),usersModule.factory("getUsers",["$http",function(e){return{get:function(){return e({url:GOOGLE_IP+"users?count=50",method:"GET"})}}}]);var userProfileModule=angular.module("userProfile",["ngScrollbar"]);userProfileModule.controller("userProfileController",["$scope","getUserData","$stateParams","formatter","$cookies",function(e,t,n,r,o){t.get(n.id).then(function(n){e.user=n.data,console.log(e.user),t.getEvents(e.user.id).then(function(t){e.events=t.data,console.log(e.events)})}),t.getChatId(n.id).then(function(t){console.log(t),e.chatId=t.data.id}),e.getFilteredEventsList=function(n){t.getEvents(e.user.id,n).then(function(t){e.events=t.data})},e.getEventImg=function(e){return r.getEventListImg(e)},e.parseDate=function(e){return r.formatDate(e)},e.aboutBox=!1,e.toggleAbout=function(){e.aboutBox=!e.aboutBox},e.getAge=function(e){return r.getAge(e)},e.getAddress=function(e,t){return r.getAddress(e,t)},e.getFormattedDistance=function(e){return r.getDistance(e)},e.lastSeenFormatted=function(e){return r.getLastSeenTime(e)},e.getUserImgUrl=function(e){return r.getUserImg(e)},e.$watch(function(){e.$broadcast("scrollRebuild")}),e.setUser=function(){o.userId=e.user.id}}]),userProfileModule.factory("getUserData",["$http",function(e){return{get:function(t){return e({url:GOOGLE_IP+"users/"+t,method:"GET"})},getEvents:function(t){var n=arguments.length<=1||void 0===arguments[1]?"":arguments[1];return console.log(n),e({url:GOOGLE_IP+"users/"+t+"/events/"+n,method:"GET"})},getChatId:function(t){return e({url:GOOGLE_IP+"users/"+t+"/chat",method:"GET"})}}}]),userProfileModule.controller("signedUserProfile",["$scope","getUserData","formatter","$cookies",function(e,t,n,r){console.log("relodad"),e.user=r.getObject("currentUser"),t.getEvents(e.user.id).then(function(t){e.events=t.data,console.log(e.events)}),e.getEventImg=function(e){return n.getEventListImg(e)},e.parseDate=function(e){return n.formatDate(e)},e.getFilteredEventsList=function(n){t.getEvents(e.user.id,n).then(function(t){e.events=t.data})},e.isProfile=!0,e.aboutBox=!1,e.toggleAbout=function(){e.aboutBox=!e.aboutBox},e.lastSeenFormatted=function(e){return n.getLastSeenTime(e)},e.getAge=function(e){return n.getAge(e)},e.getAddress=function(e,t){return n.getAddress(e,t)},e.getUserImgUrl=function(e){return n.getUserImg(e)},e.$watch(function(){e.$broadcast("scrollRebuild")})}]);var meetingsModule=angular.module("meetings",[]);meetingsModule.controller("meetingsController",["$scope","getMeetings","formatter","getMeetingInfo","$state",function(e,t,n,r,o){t.get().then(function(t){e.meetings=t.data,console.log(e.meetings)}),e.getAddress=function(e,t){return n.getAddress(e,t)},e.getDistance=function(e){return n.getDistance(e)},e.getTime=function(e){return n.formatDate(e)},e.getFilteredMeetings=function(n){t.get(n).then(function(t){e.meetings=t.data,console.log(e.meetings)})},e.accept=function(e){r.join(e).then(function(){o.reload()})},e.decline=function(e){r.leave(e),o.reload()},e.getStatusStile=function(e){return n.getMeetingStatusIconStyle(e)},e.$watch(function(){e.$broadcast("rebuild:me")})}]),meetingsModule.factory("getMeetings",["$http",function(e){return{get:function(){var t=arguments.length<=0||void 0===arguments[0]?"":arguments[0];return e({url:GOOGLE_IP+"meetings/"+t,method:"GET"})}}}]);var meetingProfileModule=angular.module("meetingProfile",["conneccityMap"]);meetingProfileModule.controller("meetingProfileController",["$scope","formatter","getMeetingInfo","$stateParams","$state","$cookies","mapCreate",function(e,t,n,r,o,a,i){n.get(r.id).then(function(t){e.meeting=t.data,i.drawDefaultMarker(e.meeting)}),e.getAddress=function(e,n){return t.getAddress(e,n)},e.parseDate=function(e){return t.formatDate(e)},e.getUserImg=function(e){return t.getUserImg(e)},e.$watch(function(){e.$broadcast("scrollRebuild")}),e.join=function(e){n.join(e)},e.leave=function(e){n.leave(e).success(function(){o.go("app.meetings")})},n.sendMessage(r.id).then(function(t){console.log(t),e.chatId=t.data.id}),e.getStatusStile=function(e){return t.getMeetingStatusIconStyle(e)},e.checkPermition=function(e){return a.getObject("currentUser").id==e}}]),meetingProfileModule.factory("getMeetingInfo",["$http",function(e){return{get:function(t){return e({url:GOOGLE_IP+"meetings/"+t,method:"GET"})},getMembers:function(t){return e({url:GOOGLE_IP+"meetings/"+t+"/members",method:"GET"})},join:function(t){return e({url:GOOGLE_IP+"meetings/"+t+"/members",method:"POST"})},leave:function(t){return e({url:GOOGLE_IP+"meetings/"+t+"/members",method:"DELETE"})},sendMessage:function(t){return e({url:GOOGLE_IP+"meetings/"+t+"/chat",method:"GET"})}}}]);var createMeetingModule=angular.module("createMeeting",[]);createMeetingModule.controller("createMeetingController",["$scope","createMeeting","formatter","$cookies","$state","getMeetingInfo","$stateParams",function(e,t,n,r,o,a,i){e.user=r.getObject("currentUser"),e.getMapSrc=function(){return n.getGoogleMapsSrc([e.user.latitude,e.user.latitude])},e.meeting={},a.get(i.id).then(function(t){var n=t.data;e.meeting.invitedIds=[],e.meeting.startAt=new Date(n.startAt),e.meeting.latitude=n.latitude,e.meeting.longitude=n.longitude;for(var o in n.members)n.members[o].id!=r.getObject("currentUser").id&&(e.meeting.invitedIds.push(n.members[o].id),console.log(n.members[o].id));e.meeting.description=n.description}),e.create=function(n){console.log(r.userId),i.id?t.update({startAt:n.startAt,latitude:e.placePicker.lat,longitude:e.placePicker.lng,description:n.description,invitedIds:r.userId?[r.userId]:e.meeting.invitedIds},i.id).then(function(e){o.go("app.meetings"),console.log(e),r.userId=""}):t.create({startAt:n.startAt,latitude:e.placePicker.lat,longitude:e.placePicker.lng,description:n.description,invitedIds:r.userId?[r.userId]:e.meeting.invitedIds}).then(function(e){o.go("app.meetings"),console.log(e),r.userId=""})}}]),createMeetingModule.factory("createMeeting",["$http",function(e){return{create:function(t){return e({url:GOOGLE_IP+"meetings/",method:"POST",data:t})},update:function(t,n){return e({url:GOOGLE_IP+"meetings/"+n,method:"PUT",data:t})}}}]);var eventsModule=angular.module("events",[]),eventsModule=angular.module("events",[]);eventsModule.controller("eventsController",["$scope","getEvents","formatter","$cookies",function(e,t,n,r){t.get().then(function(t){e.events=t.data}),e.getCurrentUserId=function(){return r.getObject("currentUser").id},e.getFilteredEvents=function(n){t.get(n).then(function(t){e.events=t.data})},e.getFormattedDistance=function(e){return n.getDistance(e)},e.parseDate=function(e){return n.formatDate(e)},e.getAddress=function(e,t){return n.getAddress(e,t)},e.getEventImg=function(e){return n.getEventListImg(e)},e.$watch(function(){e.$broadcast("rebuild:me")})}]),eventsModule.factory("getEvents",["$http",function(e){return{get:function(){var t=arguments.length<=0||void 0===arguments[0]?"":arguments[0];return e({url:GOOGLE_IP+"events/"+t,method:"GET"})}}}]);var eventProfile=angular.module("eventProfile",[]);eventProfile.factory("getEventInfo",["$http",function(e){return{get:function(t){return e({url:GOOGLE_IP+"events/"+t,method:"GET"})},getMembers:function(t){return e({url:GOOGLE_IP+"events/"+t+"/members",method:"GET"})},join:function(t){return e({url:GOOGLE_IP+"events/"+t+"/members",method:"POST"})},leave:function(t){return e({url:GOOGLE_IP+"events/"+t+"/members",method:"DELETE"})},sendMessage:function(t){return e({url:GOOGLE_IP+"events/"+t+"/chat",method:"GET"})}}}]),eventProfile.controller("eventProfileController",["$scope","getEventInfo","$stateParams","formatter","$cookies",function(e,t,n,r,o){t.get(n.id).then(function(t){e.event=t.data,console.log(e.event)}),t.getMembers(n.id).then(function(t){e.members=t.data,console.log(e.members)}),e.getAddress=function(e,t){return r.getAddress(e,t)},e.parseDate=function(e){return r.formatDate(e)},e.getUserImg=function(e){return r.getUserImg(e)},e.$watch(function(){e.$broadcast("scrollRebuild")}),e.join=function(n){t.join(n).success(function(){e.toggleMember()})},e.leave=function(n){t.leave(n).success(function(){e.toggleMember()})},e.toggleMember=function(){e.event.isMember?(e.event.isMember=!1,e.members.shift()):(e.members.unshift(o.getObject("currentUser")),e.event.isMember=!0)},e.checkPermition=function(e){return o.getObject("currentUser").id==e},t.sendMessage(n.id).then(function(t){console.log(t),e.chatId=t.data.id})}]);var createMeetingModule=angular.module("createEvent",[]);createMeetingModule.controller("createEventController",["$scope","createEvent","formatter","$cookies","$state","$stateParams","getEventInfo",function(e,t,n,r,o,a,i){e.user=r.getObject("currentUser"),e.getMapSrc=function(){return n.getGoogleMapsSrc([e.user.latitude,e.user.latitude])},e.pickerVisible=!1,e.event={},i.get(a.id).then(function(t){var n=t.data;console.log(n),e.event.name=n.name,e.event.startAt=new Date(n.startAt),e.event.latitude=n.latitude,e.event.longitude=n.longitude,e.event.description=n.description,e.event.price=n.priceFrom}),e.create=function(n){console.log(r.userId),a.id?t.update({name:n.name,startAt:n.startAt,latitude:e.placePicker.lat,longitude:e.placePicker.lng,description:n.description,priceFrom:n.price},a.id).then(function(e){o.go("app.events"),console.log(e)}):t.create({name:n.name,startAt:n.startAt,latitude:e.placePicker.lat,longitude:e.placePicker.lng,description:n.description,priceFrom:n.price}).then(function(e){o.go("app.events"),console.log(e)})}}]),createMeetingModule.factory("createEvent",["$http",function(e){return{create:function(t){return e({url:GOOGLE_IP+"events/",method:"POST",data:t})},update:function(t,n){return e({url:GOOGLE_IP+"events/"+n,method:"PUT",data:t})}}}]);var chatListModule=angular.module("chatList",[]);chatListModule.factory("getChats",["$http",function(e){return{get:function(){return e({url:GOOGLE_IP+"chats/",method:"GET"})}}}]),chatListModule.controller("chatListController",["$scope","formatter","getChats","getUserData","socketFactory",function(e,t,n,r,o){n.get().then(function(t){e.chats=t.data}),e.getUserImg=function(e){return t.getUserImgUrl(e)},e.getLastSeenTime=function(e){return t.getLastSeenTime(e)},e.getState=function(e){return o.counter.has(e)}}]);var chatModule=angular.module("chat",["websocket"]);chatModule.factory("getChat",["$http",function(e){return{get:function(t){return e({url:GOOGLE_IP+"chats/"+t,method:"GET"})},getMessages:function(t){return e({url:GOOGLE_IP+"chats/"+t+"/messages",method:"GET"})},send:function(t,n){return e({url:GOOGLE_IP+"chats/"+t+"/messages",data:{message:n},method:"POST"})},read:function(t){return e({url:GOOGLE_IP+"chats/"+t+"/messages",method:"PUT"})}}}]),chatModule.controller("chatController",["$scope","socketFactory","formatter","getChat","$stateParams","$cookies","$rootScope",function(e,t,n,r,o,a,i){e.currentUserId=a.getObject("currentUser").id,e.messages=[],r.get(o.id).then(function(t){e.chat=t.data}).then(function(){r.getMessages(o.id).then(function(t){e.messages=t.data})}),e.getTime=function(e){return n.getTime(e)},e.getUserImg=function(e){return n.getUserImgUrl(e)},e.getLastSeenTime=function(e){return n.getTime(e)},e.checkSender=function(t){return t==e.currentUserId},e.sendMessage=function(n){r.read(o.id).then(function(e){}),n&&r.send(o.id,n).then(function(n){e.message="",t.counter["delete"](o.id)},function(e){console.log(e)})},e.getStatus=function(e){return!e.readState&&a.getObject("currentUser").id!=e.sender.id},e.$watch(function(){return t.message},function(n,r){if("undefined"!=n&&n!=r){if(n.chatId==o.id&&e.messages.unshift(n),console.log(n.chatId==o.id),n.chatId==o.id){var a=1;do console.log(t.chatMessage[n.chatId]),t.chatMessage[n.chatId]>=e.messages[a].id&&(e.messages[a].readState=1,console.log(e.messages[a].readState)),console.log(a),a++;while(!e.messages[a].readState)}e.message="",n.sender.id!=e.currentUserId&&t.counter.add(n.chatId)}})}]),chatModule.directive("schrollBottom",function(){return{scope:{schrollBottom:"="},link:function(e,t){e.$watchCollection("schrollBottom",function(e){e&&(t[0].scrollTop=t[0].scrollHeight)})}}});var dataFormatterModule=angular.module("dataFormatter",[]);dataFormatterModule.factory("formatter",["mapCreate",function(e){return{formatDate:function(e){var t=new Date(e);t.getDay(),t.getMonth()+1,t.getHours();return t.toDateString()},getAddress:function(t,n){var r=e.coordinatesMap.get([t,n].join("|"));return!r&&t&&n&&e.getAddress([t,n]),r},getDistance:function(e){return 1e3>e?e+"m":(e/1e3).toFixed(1)+"km"},getGender:function(e,t){return e&&t?null:e?1:t?2:null},getUnixTime:function(e){return new Date(e).getTime()/1e3|0},getAge:function(e){var t=new Date,n=new Date(e);return t.getYear()-n.getYear()-!!(t.getMonth()-n.getMonth())},getLastSeenTime:function(e){var t=6e4,n=60*t,r=24*n,o="en-us",a=new Date,i=new Date(e),c=new Date(a-i);return c>r?i.toLocaleDateString(o):c>n?(c/n).toFixed(0)+" hours ago":c>t?(c/t).toFixed(0)+" minutes ago":t>c?(c/1e3).toFixed(0)+" seconds ago":void 0},getUserListImg:function(e){return e?e:"img/test/user_icon.png"},getUserImg:function(e){return e?e:"img/test/user_icon.png"},getEventListImg:function(e){return e?e:"img/test/profile-card-bg.jpg"},getMeetingStatusIconStyle:function(e){return"DECLINED"==e?"meeting-status-icon_declined":"INVITED"==e?"meeting-status-icon_invited":"meeting-status-icon_accepted"},getTime:function(e){var t=new Date(e),n=t.getHours();n=10>n?"0"+n:n;var r=t.getMinutes();return r=10>r?"0"+r:r,n+":"+r},getGoogleMapsSrc:function(e){var t=_slicedToArray(e,2),n=t[0],r=t[1];return"https://www.google.com.ua/maps/@"+n+","+r+",12z"}}}]);