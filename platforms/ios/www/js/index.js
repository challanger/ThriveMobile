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
var app = {
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
};

$(document).ready(function(){
    initSlideShow();
    loadTemplates();
    initPage();
    
     
    
    jQuery(".tab-item").click(function() {
        var id = jQuery(this).attr("id");
        var main_tab = jQuery(this).attr("data-main");
        
        jQuery(".main").removeClass("main-active");
        jQuery(".tab-item").removeClass("tab-active");
        
        jQuery("#"+id).addClass("tab-active");
        jQuery("#"+main_tab).addClass("main-active");
        
        initPage();
    });
});

function loadMessage(id)
{
    jQuery(".main").removeClass("main-active");
    jQuery("#main-message").addClass("main-active");
    
    initPageMessageDetailed(id);
}

function initSlideShow()
{
    $('.news-slides').slick({
        centerMode: true,
        centerPadding: '250px',
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        arrows: false,
        responsive: [
          {
            breakpoint: 1000,
            settings: {
              centerPadding: '80px',
            }
          },
          {
            breakpoint: 480,
            settings: {
              centerPadding: '40px',
            }
          }
        ]
    });
    jQuery(".news-slides").slickNext();
}

function loadTemplates()
{
    $.get('templates/news-slide-inner.html', function(template) {
        templates["news-slide-inner"]= template;
    });
    
    $.get('templates/media-category.html', function(template) {
        templates["media-category"]= template;
    });
    
    $.get('templates/media-message.html', function(template) {
        templates["media-message"]= template;
    });
    
    $.get('templates/media-message-full.html', function(template) {
        templates["media-message-full"]= template;
    });
}

function initPage()
{
    //jQuery(".news-slides").unslick();
    var activeMain = jQuery(".main-active").attr("id");
    
    if(activeMain === "main-home")
    {
        initPageMain();
    }
    else if(activeMain === "main-media")
    {
        initPageMedia();
    }
}

function initPageMain()
{
    jQuery.ajax({ 
            url: domain+"index.php/mobile/slides/",
            jsonpCallback: 'jsonCallback',
            dataType: "jsonp"
    })
    .done(function(data) {
        if(data.length>0)
        {
            jQuery(".news-slides").slickRemove(0);
            jQuery(".news-slides").slickRemove(0);
        }

        for(slideID in data)
        {
            var slideData = data[slideID];
            jQuery(".news-slides").slickAdd( Mustache.render(templates["news-slide-inner"], {IMAGE: slideData.imageurl, CAPTION: slideData.caption}));
            //slides = slides + Mustache.render(templates["news-slide-inner"], {IMAGE: slideData.imageurl, CAPTION: slideData.caption});
        }
    })
    .fail(function() {
        //TODO do something on failure 
        var test = "";
    });
}

function initPageMedia()
{
    jQuery.ajax({ 
            url: domain+"index.php/mobile/media/",
            jsonpCallback: 'jsonCallback',
            dataType: "jsonp"
    })
    .done(function(data) {
        var media= "";
        var mediaData = Object();

        for(mediaID in data.media)
        {
            var categoryID = data.media[mediaID]["id"];
            mediaData[categoryID] = data.media[mediaID];
            mediaData[categoryID]["messages"] = Object(); 
        }
        
        for(dataID in data.messages)
        {
            var categoryID = data.messages[dataID]["catID"];
            var messageID = data.messages[dataID]["id"];
            if(typeof mediaData[categoryID] !== "undefined")
            {
                mediaData[categoryID]["messages"][messageID]=data.messages[dataID];
            }
        }
        
        var sortedMedia = [];
        
        for(mediaID in mediaData)
        {
            sortedMedia.push(mediaData[mediaID]);
        }
        
        sortedMedia.sort(function(a, b){return b.date-a.date});
        
        for(mediaID in sortedMedia)
        {
            var messages = Array();
            for(messageID in sortedMedia[mediaID]["messages"])
            {
                var messageData = sortedMedia[mediaID]["messages"][messageID];
                var message = Object();
                message.NAME = messageData["title"];
                var date = new Date();
                date.setTime(messageData["date"] * 100);
                message.DATE = date.getDate()+"/"+date.getMonth()+"/"+date.getYear();;
                message.ID = messageData["id"];
                messages.push(message);
                //messages = messages + Mustache.render(templates["media-message"], {NAME: messageData["title"], DATE: messageData["date"],ID : messageData["id"]});
            }
            
            media = media + Mustache.render(templates["media-category"], {NAME: sortedMedia[mediaID]["title"], AUTHORS: sortedMedia[mediaID]["author"],MESSAGES : messages, IMAGE: sortedMedia[mediaID]["imageurl"]});
            //jQuery(".news-slides").slickAdd( Mustache.render(templates["news-slide-inner"], {IMAGE: slideData.imageurl, CAPTION: slideData.caption}));
            //slides = slides + Mustache.render(templates["news-slide-inner"], {IMAGE: slideData.imageurl, CAPTION: slideData.caption});
        }
        
        jQuery("#main-media .content").html(media);
        
        jQuery(".media-message a").click(function(){
           var messageID = jQuery(this).attr("data-id");
           loadMessage(messageID);
        });
    })
    .fail(function() {
        //TODO do something on failure 
    });
}

function initPageMessageDetailed(id)
{
    jQuery.ajax({ 
            url: domain+"index.php/mobile/messageDetail/"+id,
            jsonpCallback: 'jsonCallback',
            dataType: "jsonp"
    })
    .done(function(data) {
        jQuery("#main-message .content").html("");
        
        var messageName = "";
        var messageCategoryName = "";
        var messageCategoryAuthors = "";
        var messageCateogryImage = "";
        var messageAudio = "";
            
        if(typeof data.message.id !== "undefied")
        {
            messageName = data.message.title;
            messageAudio = data.message.url;
        }
        
        if(typeof data.category.id !== "undefied")
        {
            messageCategoryName = data.category.title;
            messageCategoryAuthors = data.category.author;
            messageCateogryImage = data.category.imageurl;
        }

        jQuery("#main-message .content").html( Mustache.render(templates["media-message-full"], {NAME: messageName, CATEOGRYNAME: messageCategoryName, CATEOGRYAUTHORS:messageCategoryAuthors, IMAGE:messageCateogryImage, AUDIOMP3:messageAudio}));

    })
    .fail(function() {
        //TODO do something on failure 
        var test = "";
    });
}