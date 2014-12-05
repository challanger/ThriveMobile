$(document).ready(function(){
    $('body').on('touchmove', function (e) {
         if (!$('.scrollable').has($(e.target)).length) e.preventDefault();
    });
});


function convertTimeDuration(input)
{
    var seconds = parseInt(input);
    
    if(seconds < 60)
        return "00:" + formatTo2Digits(seconds);
    else if(seconds < 3600)
    {
        var min = parseInt(seconds / 60);
        var secondsLeft = seconds % 60;
        return min + ":" + formatTo2Digits(secondsLeft);
    }
    else 
    {
        var hours = parseInt(seconds / 3600);
        var min = parseInt((seconds % 3600) / 60);
        var secondsLeft = seconds % 60;
        return hours + ":" + formatTo2Digits(min) + ":" + formatTo2Digits(secondsLeft);
    }
    
}

function formatTo2Digits(input)
{
    return ("0" + input).slice(-2);
    
}