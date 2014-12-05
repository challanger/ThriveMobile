$(document).ready(function(){
    window.newsSlides = new slider("#main-home .content",".news-slides",".news-slide",2);
    
    newsSlides.setSlidesSizes();
    newsSlides.initSlides(0);
    setInterval(function(){ newsSlides.advanceSlide(); }, 5 * 1000);
    
    $( window ).resize(function() {
        newsSlides.setSlidesSizes();
    });
    
    $(".news-slides").swipe( {
        //Generic swipe handler for all directions
        swipeLeft:function(event, direction, distance, duration, fingerCount, fingerData) {
            if(fingerCount === 1)
            {
                newsSlides.rightSlide();
            }
        },
        swipeRight:function(event, direction, distance, duration, fingerCount, fingerData) {
            if(fingerCount === 1)
            {
                newsSlides.leftSlide();
            }
        }
        
        //Default is 75px, set to 0 for demo so any distance triggers swipe
         //threshold:0
      });
});
var slider = function(rootElement,containerElement,slideElement,interval)
{
    this.captionOffset = 40,
    this.sideOffsetTotal = 40,
    this.marginSideOffset = 20,
    this.imageRaito = 625/650;
    
    this.SlidesRoot = rootElement,
    this.SlidesContainer = containerElement,
    this.SlideElement = slideElement;
    this.slideInterval = interval;
    
    
    this.initSlides = function() {  
        jQuery(this.SlidesRoot + " " + this.SlidesContainer).attr("data-current-slide",0);
        jQuery(this.SlidesRoot + " " + this.SlidesContainer).attr("data-slider-reverse",false);
    };
    
    this.setSlidesSizes = function(){
        var containerHeight = jQuery(this.SlidesRoot).height();
        var containerWidth = jQuery(this.SlidesRoot).width();
        

        var itemWidth = parseInt((containerHeight - this.captionOffset) * this.imageRaito);
        if((itemWidth - this.sideOffsetTotal) < containerWidth)
        {
            jQuery(this.SlidesRoot + " " + this.SlideElement).width(itemWidth - this.sideOffsetTotal);
            jQuery(this.SlidesRoot + " " + this.SlideElement).height(containerHeight);

            jQuery(this.SlidesRoot + " " + this.SlidesContainer).width((itemWidth + this.marginSideOffset) * jQuery(this.SlidesRoot + " " + this.SlideElement).length);
        }
        else 
        {
            var imageHeight = parseInt(containerWidth - this.sideOffsetTotal / this.imageRatio);
            jQuery(this.SlidesRoot + " " + this.SlideElement).width(containerWidth - this.sideOffsetTotal);
            jQuery(this.SlidesRoot + " " + this.SlideElement).height(imageHeight);

            jQuery(this.SlidesRoot + " " + this.SlidesContainer).width((containerWidth) * jQuery(this.SlidesRoot + " " + this.SlideElement).length);
        }
    };
    
    this.switchToSlide = function(index) { 
        index = parseInt(index);
        //console.log("Switch to " + index);
        var containerWidth = jQuery(this.SlidesRoot).width();
        var middle = containerWidth / 2;
        var slideWidth = (jQuery(this.SlidesRoot + " " + this.SlideElement).width() + this.marginSideOffset);
        var slideOffset = (slideWidth / 2);
        
        if((index >= 0) && (index < jQuery(this.SlidesRoot + " " + this.SlideElement).length))
        {
            var shiftAmmount = middle - (slideWidth * index) - slideOffset;
            //console.log(shiftAmmount);
            jQuery(this.SlidesRoot + " " + this.SlidesContainer).css("transform", "translateX(" + shiftAmmount + "px)");
            jQuery(this.SlidesRoot + " " + this.SlidesContainer).css("transform", "-webkit-transform(" + shiftAmmount + "px)");
            jQuery(this.SlidesRoot + " " + this.SlidesContainer).css("transform", "-ms-transform(" + shiftAmmount + "px)");
            
            jQuery(this.SlidesRoot + " " + this.SlidesContainer).attr("data-current-slide",index);
        }
        else 
        {
            console.log("Error invalid index");
        }
    };
    
    this.advanceSlide = function() {
        var reverse = jQuery(this.SlidesRoot + " " + this.SlidesContainer).attr("data-slider-reverse");
        var current = parseInt(jQuery(this.SlidesRoot + " " + this.SlidesContainer).attr("data-current-slide"));
        var length = jQuery(this.SlidesRoot + " " + this.SlideElement).length;
        var nextSlide = 0;
        
        if(String(reverse) === "false" )
        {
            nextSlide = current + 1;
            if(nextSlide < length)
            {
                this.switchToSlide(nextSlide);
            }
            else 
            {
                nextSlide = current - 1;
                this.switchToSlide(nextSlide);
                jQuery(this.SlidesRoot + " " + this.SlidesContainer).attr("data-slider-reverse",true);
            }      
        }
        else 
        {
            nextSlide = current - 1;
            if(nextSlide >= 0)
            {
                this.switchToSlide(nextSlide);
            }
            else 
            {
                nextSlide = current + 1;
                this.switchToSlide(nextSlide);
                jQuery(this.SlidesRoot + " " + this.SlidesContainer).attr("data-slider-reverse",false);
            }
        }
    };
    
    this.rightSlide = function() {
        var current = parseInt(jQuery(this.SlidesRoot + " " + this.SlidesContainer).attr("data-current-slide"));
        var length = jQuery(this.SlidesRoot + " " + this.SlideElement).length;
        
        var nextSlide = current + 1;
        if(nextSlide < length)
        {
            this.switchToSlide(nextSlide);
            jQuery(this.SlidesRoot + " " + this.SlidesContainer).attr("data-slider-reverse",false);
        }    
    };
    
    this.leftSlide = function() {
        var current = parseInt(jQuery(this.SlidesRoot + " " + this.SlidesContainer).attr("data-current-slide"));

        var nextSlide = current - 1;
        if(nextSlide >= 0)
        {
            this.switchToSlide(nextSlide);
            jQuery(this.SlidesRoot + " " + this.SlidesContainer).attr("data-slider-reverse",true);
        }
    };
    
    this.jumpToCurrent = function()
    {
        var current = jQuery(this.SlidesRoot + " " + this.SlidesContainer).attr("data-current-slide");
        var length = jQuery(this.SlidesRoot + " " + this.SlideElement).length;
        if(current < length)
            this.switchToSlide(current);
        else 
        {
            if(length > 0)
                this.switchToSlide(length - 1);
        }
    };
};

