/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var domain = "http://challengernet.com/mobile/ithrive/";
//var domain = "http://localhost/mobile/ithrive/";
var templates = Array();
/*var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};*/

(function() {
    window.loaderSelect = new loadingItem(".loading-bar",".loading-bar-inner");
    //loadTemplates();
    //initPage();
    
    var thriveMobileApp = angular.module('thriveMobileApp', []);
    
    thriveMobileApp.directive('onLastRepeat', function() {
        return function(scope, element, attrs) {
            if (scope.$last) setTimeout(function(){
                scope.$emit('onRepeatLast', element, attrs);
            }, 1);
        };
    });
    
    thriveMobileApp.controller('tabController',function() {
       this.activeSlide = 0;
       
       this.setActiveSlide = function(index){
           this.activeSlide = index;
       };
       
       this.isSet = function (index){
         if(this.activeSlide === index)
             return true;
         else 
             return false;
       };
    });
    
    thriveMobileApp.controller('SlidesController',['$scope','$http','$log',function($scope,$http,$log) {
       var store = this;
       
       if((typeof localStorage.slides === "undefined") || (typeof localStorage.slides.length === 0))
       {
            store.slides = [
                {'id':0,'imageurl':'/img/slides/Welcome.png','caption':''}
            ];
        }
        else 
        {
            store.slides = JSON.parse(localStorage.slides);
        }
        
        $scope.$on('onRepeatLast',function(scope,element, attrs){
            newsSlides.setSlidesSizes();
            newsSlides.jumpToCurrent();
        });
        
       window.loaderSelect.addLoading();
       $http.jsonp(domain+"index.php/mobile/slides/?callback=JSON_CALLBACK").
               success(function(data, status) {
                   store.slides = data;
                   localStorage.slides = JSON.stringify(data);
                   //$log.log(data);
                   window.loaderSelect.removeLoading();
               }).
               error(function(data, status) {
                   $log.log('Error: failed to pull the slides');
                   window.loaderSelect.removeLoading();
               });
    }]);

    thriveMobileApp.controller('MediaController',['$http','$log',function($http,$log) {
       var store = this;
       
       if((typeof localStorage.media === "undefined") || (typeof localStorage.media.length === 0))
       {
            store.media = [
                {'id':0,'imageurl':'/img/message_category_default_100_100.png','title':'Loading','author':'','date':1,'active':1}
            ];
        }
        else 
        {
            store.media = JSON.parse(localStorage.media);
        }
       
       //window.loaderSelect.addLoading();
       $http.jsonp(domain+"index.php/mobile/mediaAll/?callback=JSON_CALLBACK").
               success(function(data, status) {
                   for(var i=0; i< data.length; i++)
                   {
                       data[i].date = data[i].date * 1000;
                       for(var j=0; j< data[i].messages.length; j++)
                       {
                           data[i].messages[j].date = data[i].messages[j].date * 1000;
                       }
                   }
                   store.media = data;
                   localStorage.media = JSON.stringify(data);
                   //$log.log(data);
                   //window.loaderSelect.removeLoading();
               }).
               error(function(data, status) {
                   $log.log('Error: failed to pull the media');
                   //window.loaderSelect.removeLoading();
               });
        this.openMessage = function(messageID) {
          //tabController.setActiveSlide(3);
          
        };
    }]);

    thriveMobileApp.controller('MessageController',['$scope','$http','$log','$interval',function($scope,$http,$log,$interval) {
        var store = this;

        store.message = {'category': { 'imageurl': "img/message_category_default_100_100.png",'title':"",'author':''},'message':{'title':"Loading..."} };
        store.mediaPlayer = null;
        store.mediaInfo = { 'duration' : "00.00", 'curPose' : "00.00", 'curPer' : 0, 'curStatus':0};
        store.mediaControlIcon = "img/message_tab_play.png";
        store.tracker = null;
        
        this.playMedia = function()
        {
            if(store.mediaInfo['curStatus'] < Media.MEDIA_RUNNING)
            {
                console.log("Error the media file is not loaded yet");
            }
            else if(store.mediaInfo['curStatus'] === Media.MEDIA_RUNNING)
            {
                store.mediaControlIcon = "img/message_tab_play.png";
                store.mediaPlayer.pause();
                store.stopTracker();
            }
            else if(store.mediaInfo['curStatus'] === Media.MEDIA_PAUSED)
            {
                store.mediaControlIcon = "img/message_tab_pause.png";
                store.mediaPlayer.play();
                store.startTracker();
            }
            else if(store.mediaInfo['curStatus'] === Media.MEDIA_STOPPED)
            {
                store.mediaControlIcon = "img/message_tab_pause.png";
                store.mediaPlayer.seekTo(0);
                store.mediaPlayer.play();
                store.startTracker();
            }
        },
        
        this.stopMedia = function () 
        {
            store.mediaPlayer.stop();
            store.stopTracker();
        },
        
        this.getCurrentPossition = function()
        {
            if(store.mediaPlayer !== null)
            {
                
                store.mediaInfo['duration'] = convertTimeDuration(store.mediaPlayer.getDuration());
                //console.log("current media status : "+ store.mediaInfo['curStatus']);
                store.mediaPlayer.getCurrentPosition(
                    // success callback
                    function (position) {
                        if (position > -1) {
                            store.mediaInfo['curPose'] = convertTimeDuration(position);
                            store.mediaInfo['curPer'] =  parseInt((position / store.mediaPlayer.getDuration()) * 100);
                        }
                    },
                    // error callback
                    function (e) {
                        console.log("Error getting pos=" + e);
                    }
                );
            }
        },
       
        this.getMessage = function(messageID)
        {
            window.loaderSelect.addLoading();
            $http.jsonp(domain+"index.php/mobile/messageDetail/"+messageID+"?callback=JSON_CALLBACK").
               success(function(data, status) {
                   store.message = data;
                   //$log.log(data);
                   console.log("trying to load " + data.message.url);
                   if(store.mediaPlayer !== null)
                   {
                       store.mediaPlayer.release();
                   }
                   window.loaderSelect.removeLoading();
                   //window.loaderSelect.addLoading();
                   
                    store.mediaPlayer = new Media(data.message.url,
                        function(){
                            console.log("loaded audio");
                            window.loaderSelect.removeLoading();
                        },
                        function (err) {    //Failed to load the mesage 
                            alert("Faield to load the message");
                            console.log("playAudio():Audio Error: " + err);
                            //window.loaderSelect.removeLoading();
                         },
                         function (status) {
                            if((store.mediaInfo['curStatus']< Media.MEDIA_RUNNING) && (status === Media.MEDIA_RUNNING))
                                store.mediaControlIcon = "img/message_tab_pause.png";
                            else if(status === Media.MEDIA_STOPPED)
                                store.stopTracker();
                            
                             store.mediaInfo['curStatus'] = status;
                         }
                    );
                    store.mediaPlayer.play();
                    store.startTracker();
               }).
               error(function(data, status) {
                   $log.log('Error: failed to pull the message');
               });
           },
           
           this.stopTracker = function() {
               if(store.tracker != null)
                {
                    $interval.cancel(store.tracker);
                    store.tracker = null;
                }
           },
           
           this.startTracker = function() {
               if(store.tracker === null)
               {
                   store.tracker = $interval(function(){
                        store.getCurrentPossition();
                    },500);
               }
           },
           
            $scope.$on('$destroy', function() {
                // Make sure that the interval is destroyed too
                
            });
    }]);
    
})();
