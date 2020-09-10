// original setting
var originColor = {};
originColor.SO = localStorage.getItem('SO');
originColor.SOH = localStorage.getItem('SOH');
originColor.SC = localStorage.getItem('SC');
originColor.SCH = localStorage.getItem('SCH');
originColor.BG = localStorage.getItem('BG');

// this will change with color picker
var eOriginColor = {};
eOriginColor.SO = localStorage.getItem('SO');
eOriginColor.SOH = localStorage.getItem('SOH');
eOriginColor.SC = localStorage.getItem('SC');
eOriginColor.SCH = localStorage.getItem('SCH');
eOriginColor.BG = localStorage.getItem('BG');

// refresh eOriginColor according color picker
function displayColor (str, color, target){
    eOriginColor[str] = color;
    if(target !== 0) {
        $(target).css('background-color', eOriginColor[str]);
    }
}

$('.shopOpen').css('background-color', eOriginColor['SO']);
$('.shopClose').css('background-color', eOriginColor['SC']);

// set the preset of color picker
jscolor.presets.eSO = {
    format: 'rgba', 
    backgroundColor: 'rgba(204,204,204,1)',
    value: originColor.SO,      // init the color picker value with the setting stored in local storage
    onInput: 'displayColor("SO", this.toRGBAString(), ".shopOpen")'
};
jscolor.presets.eSOH = {
    format: 'rgba', 
    backgroundColor: 'rgba(204,204,204,1)',
    value: originColor.SOH,
    onInput: 'displayColor("SOH", this.toRGBAString(), 0)'
};
jscolor.presets.eSC = {
    format: 'rgba', 
    backgroundColor: 'rgba(204,204,204,1)',
    value: originColor.SC,
    onInput: 'displayColor("SC", this.toRGBAString(), ".shopClose")'
};
jscolor.presets.eSCH = {
    format: 'rgba', 
    backgroundColor: 'rgba(204,204,204,1)',
    value: originColor.SCH,
    onInput: 'displayColor("SCH", this.toRGBAString(), 0)'
};
jscolor.presets.eSCHBG = {
    format: 'rgba', 
    backgroundColor: 'rgba(204,204,204,1)',
    value: originColor.BG,
    onInput: 'displayColor("BG", this.toRGBAString(), "body")'
};




$('.shopOpen').hover(function() {
    $(this).css('background-color', eOriginColor.SOH);
    }, function() {
    $(this).css('background-color', eOriginColor.SO);
})
$('.shopClose').hover(function() {
    $(this).css('background-color', eOriginColor.SCH);
    }, function() {
    $(this).css('background-color', eOriginColor.SC);
})
$('.save').click(function() {
    localStorage.setItem('SO', eOriginColor.SO);
    localStorage.setItem('SOH', eOriginColor.SOH);
    localStorage.setItem('SC', eOriginColor.SC);
    localStorage.setItem('SCH', eOriginColor.SCH);
    localStorage.setItem('BG', eOriginColor.BG);
    window.location.href = "popup.html";
})
