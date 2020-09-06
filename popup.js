$(document).ready(function() {
    console.log("ready");

    // check whether shop is open
    function getStatus(shopOpenTime) {
        if(shopOpenTime.length === 1) {
            if(shopOpenTime[0] === '24小時') {
                return 'shopOpen';
            } else if(shopOpenTime[0] === '休') {
                return 'shopClose';
            }
            if((timeHM >= shopOpenTime[0].split("-")[0]) && (timeHM <=shopOpenTime[0].split("-")[1])) {
                return 'shopOpen'; 
            }
        } else {
            if(((timeHM >= shopOpenTime[0].split("-")[0]) && (timeHM <=shopOpenTime[0].split("-")[1])) || ((timeHM >= shopOpenTime[1].split("-")[0]) && (timeHM <=shopOpenTime[1].split("-")[1]))) {
                return 'shopOpen'; 
            }
        }
        return 'shopClose';
    }
    // from https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
    function storageAvailable(type) {
        var storage;
        try {
            storage = window[type];
            var x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        }
        catch(e) {
            return e instanceof DOMException && (
                // everything except Firefox
                e.code === 22 ||
                // Firefox
                e.code === 1014 ||
                // test name field too, because code might not be present
                // everything except Firefox
                e.name === 'QuotaExceededError' ||
                // Firefox
                e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
                // acknowledge QuotaExceededError only if there's something already stored
                (storage && storage.length !== 0);
        }
    }
    // init color local storage
    function initColorLocalStorage(key, value, colorObj) {
        if (localStorage.getItem(key) === null) {
            localStorage.setItem(key, value);
        } else {
            colorObj[key] = localStorage.getItem(key);
        }
    }

    jQuery.ajaxSetup({async:false});
    $.get('newList.csv', function(data) {
        console.log("read file..");
        console.log(data);
        dataObject = $.csv.toObjects(data);       
        for (var i = 0; i < dataObject.length; i++) {
            var tmp = [];
            for(var a of dataObject[i].週一至週五.split(' ')) {
                    tmp.push(a);  
            }
            dataObject[i].週一至週五 = tmp;
            tmp = [];
            for(var a of dataObject[i].週六.split(' ')) {
                tmp.push(a);  
            }
            dataObject[i].週六 = tmp;
            tmp = [];
            for(var a of dataObject[i].週日.split(' ')) {
                tmp.push(a);  
            }
            dataObject[i].週日 = tmp;
        }
        
        console.log(dataObject);
    })
    
    // num of shop
    var num = dataObject.length;
    console.log("num = ", num); 

    // generate row element
    for (var i = 0; i < num; i = i + 4) {
        var div = $("<div></div>").addClass("row").attr("id", i/4);
        $(".shop-list").append(div);
    }

    // set current time
    var time = new Date();
    var timeHM = '';
    var timeH = time.getHours();
    var timeM = time.getMinutes();

    // fix time format when hour or minute < 10
    if(timeH < 10) {
        timeHM = '0' + timeH + ':';
    } else {
        timeHM = timeH + ':';
    }
    if(timeM < 10) {
        timeHM = timeHM + '0' + timeM;
    } else {
        timeHM = timeHM + timeM;
    }
    var UTCday = time.getUTCDay();        // day of the week 
    console.log(timeHM);
    console.log(UTCday);


    // generate shops html element
    for(var i = 0; i <= num/4; i++) {
        for(var j = 0; j < 4; j++) {
            if(i*4+j >= num) {          
                break;
            }
            var tmp = '';
            let currentShop = dataObject[i*4+j];

            switch (UTCday) {
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                    var shopOpenTime = currentShop["週一至週五"]
                    tmp = getStatus(shopOpenTime);
                    /*
                    if(shopOpenTime.length === 1) {
                        if((timeHM >= shopOpenTime[0].split("-")[0]) && (timeHM <=shopOpenTime[0].split("-")[1])) {
                            tmp = 'shopOpen'; 
                        }
                    } else {
                        if((timeHM >= shopOpenTime[0].split("-")[0]) && (timeHM <=shopOpenTime[0].split("-")[1]) && (timeHM >= shopOpenTime[1].split("-")[0]) && (timeHM <=shopOpenTime[1].split("-")[1])) {
                            tmp = 'shopOpen'; 
                        }
                    }
                    */
                    break;
                
                case 6:
                    var shopOpenTime = currentShop["週六"]
                    tmp = getStatus(shopOpenTime);
                    break;
                
                case 0:
                    var shopOpenTime = currentShop["週日"]
                    tmp = getStatus(shopOpenTime);
                    break;

                default:
                    break;
            }

            var col = $("<div></div>").addClass("col-3").append($("<div></div>").addClass("card " + tmp).append(`<p class="card-title">  ${dataObject[i*4+j]['name']} </p>`));
            
            console.log(timeHM);
            $("#"+i).append(col);
        }
    }

    // set color
    
    var colorObj = {
        SO : 'rgba(33, 236, 84,0.1)',
        SOH : 'rgba(39, 116, 58, 0.4)',
        SC : 'rgba(214, 34, 34, 0.1)',
        SCH : 'rgba(214, 34, 34, 0.4)',
    }
    initColorLocalStorage('SO', 'rgba(33, 236, 84,0.1)', colorObj);
    initColorLocalStorage('SOH', 'rgba(33, 236, 84,0.4)', colorObj);
    initColorLocalStorage('SC', 'rgba(214, 34, 34, 0.1)', colorObj);
    initColorLocalStorage('SCH', 'rgba(214, 34, 34, 0.4)', colorObj);

    // if (storageAvailable('localStorage')) {
    //     if (localStorage.getItem('SO') === null) {
    //     
    //     }
    // }
    $(".shopOpen").css("background-color", colorObj.SO);
    $(".shopClose").css("background-color", colorObj.SC);
    $(".shopOpen").hover(function() {
        $(this).css("background-color", colorObj.SOH);
        }, function() {
        $(this).css("background-color", colorObj.SO);
    });
    $(".shopClose").hover(function() {
        $(this).css("background-color", colorObj.SCH);
        }, function() {
        $(this).css("background-color", colorObj.SC);
    });
    
    // $(".card").click(function(event) {
    //     alert($(event.currentTarget.p).text());
    // });

});
