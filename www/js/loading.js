
var loadingItem = function(outerSelector,innerParts) {
    this.outerSelector = outerSelector;
    this.innerSelector = innerParts;
    this.loadingTimmer = null;
    this.loadingCounter = 0;
    
    this.addLoading = function() { 
        if(this.loadingCounter < 1)
        {
            this.start();
        }
        this.loadingCounter++;
    };
    
    this.removeLoading = function() { 
        this.loadingCounter--;
        if(this.loadingCounter<1)
        {
            this.end();
        }
    };
    
    this.start = function() {
        console.log("loading start");
        jQuery(this.outerSelector).css("opacity",1);
        jQuery(this.innerSelector).toggleClass("animate-loading");
        this.loadingTimmer = setInterval(function() {
            window.loaderSelect.toogleAnimation();
        },1000);
    };
    
    this.toogleAnimation = function() {
        jQuery(this.innerSelector).toggleClass("animate-loading");
    };
    
    this.end = function() { 
        console.log("loading end");
        jQuery(this.outerSelector).css("opacity",0);
        clearInterval(this.loadingTimmer);
        this.loadingTimmer = null;
    };
};