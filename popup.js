$(document).ready(function () {
    console.log("ready");

    // check whether shop is open
    function getStatus(shopOpenTime) {
        if (shopOpenTime.length === 1) {
            if (shopOpenTime[0] === '24小時') {
                return 'shopOpen';
            } else if (shopOpenTime[0] === '休') {
                return 'shopClose';
            }
            if ((timeHM >= shopOpenTime[0].split("-")[0]) && (timeHM <= shopOpenTime[0].split("-")[1])) {
                return 'shopOpen';
            }
        } else {
            if (((timeHM >= shopOpenTime[0].split("-")[0]) && (timeHM <= shopOpenTime[0].split("-")[1])) || ((timeHM >= shopOpenTime[1].split("-")[0]) && (timeHM <= shopOpenTime[1].split("-")[1]))) {
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
        catch (e) {
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

    jQuery.ajaxSetup({ async: false });
    $.get('list.json', function (data) {
        console.log(data);
        dataObject = data;
        for (var shop in data) {
            dataObject[shop]['週一至週五'] = data[shop]['週一至週五'].split(' ');
            dataObject[shop]["週六"] = data[shop]["週六"].split(' ');
            dataObject[shop]["週日"] = data[shop]["週日"].split(' ');
        }
        console.log('done');
    })
    //
    // $.get('newList.csv', function(data) {
    //     console.log("read file..");
    //     console.log(data);
    //     dataObject = $.csv.toObjects(data);       
    //     for (var i = 0; i < dataObject.length; i++) {
    //         var tmp = [];
    //         for(var a of dataObject[i].週一至週五.split(' ')) {
    //                 tmp.push(a);  
    //         }
    //         dataObject[i].週一至週五 = tmp;
    //         tmp = [];
    //         for(var a of dataObject[i].週六.split(' ')) {
    //             tmp.push(a);  
    //         }
    //         dataObject[i].週六 = tmp;
    //         tmp = [];
    //         for(var a of dataObject[i].週日.split(' ')) {
    //             tmp.push(a);  
    //         }
    //         dataObject[i].週日 = tmp;
    //     }

    //     console.log(dataObject);
    // })

    // num of shop

    // generate column element
    for (var i = 0; i < 4; i += 1) {
        var div = $("<div></div>").addClass("col-3 inline-block").attr("id", i);
        $(".row").append(div);
    }

    // set current time
    var time = new Date();
    var timeHM = '';
    var timeH = time.getHours();
    var timeM = time.getMinutes();

    // fix time format when hour or minute < 10
    if (timeH < 10) {
        timeHM = '0' + timeH + ':';
    } else {
        timeHM = timeH + ':';
    }
    if (timeM < 10) {
        timeHM = timeHM + '0' + timeM;
    } else {
        timeHM = timeHM + timeM;
    }
    var UTCday = time.getUTCDay();        // day of the week 
    console.log(timeHM);
    console.log(UTCday);


    // generate shops html element
    var cnt = 0;
    for(var shop in dataObject) {
        var tmp = '';

        switch (UTCday) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                var shopOpenTime =  dataObject[shop]["週一至週五"]
                tmp = getStatus(shopOpenTime);
                break;

            case 6:
                var shopOpenTime =  dataObject[shop]["週六"]
                tmp = getStatus(shopOpenTime);
                break;

            case 0:
                var shopOpenTime =  dataObject[shop]["週日"]
                tmp = getStatus(shopOpenTime);
                break;

            default:
                break;
        }
        var remark = '';
        if (dataObject[shop]["備註"] != '') {
            remark = `<span data-toggle="tooltip" data-placement="top" title=${dataObject[shop]["備註"]}>&#9888;</apan>`
        }
        var col = $("<div></div>").append($("<div></div>").addClass("card " + tmp).append(`<p class="card-title">  ${shop + remark} </p>` + `<p class="card-text"> ${dataObject[shop]['備註']} </p>`));

        console.log(timeHM);
        $("#" + cnt%4).append(col);

        cnt += 1;
    }

    // for (var i = 0; i <= num / 4; i++) {
    //     for (var j = 0; j < 4; j++) {
    //         if (i * 4 + j >= num) {
    //             break;
    //         }
    //         var tmp = '';
    //         let currentShop = dataObject[i * 4 + j];

    //         switch (UTCday) {
    //             case 1:
    //             case 2:
    //             case 3:
    //             case 4:
    //             case 5:
    //                 var shopOpenTime = currentShop["週一至週五"]
    //                 tmp = getStatus(shopOpenTime);

    //                 break;

    //             case 6:
    //                 var shopOpenTime = currentShop["週六"]
    //                 tmp = getStatus(shopOpenTime);
    //                 break;

    //             case 0:
    //                 var shopOpenTime = currentShop["週日"]
    //                 tmp = getStatus(shopOpenTime);
    //                 break;

    //             default:
    //                 break;
    //         }
    //         var remark = '';
    //         if (currentShop.備註 != '') {
    //             remark = `<span data-toggle="tooltip" data-placement="top" title=${currentShop.備註}>&#9888;</apan>`
    //         }
    //         var card = $("<div></div>").addClass("col-3").append($("<div></div>").addClass("card " + tmp).append(`<p class="card-title">  ${currentShop.name + remark} </p>`));

    //         console.log(timeHM);
    //         $("#" + i/4).append(card);
    //     }
    // }

    // set color

    var colorObj = {
        SO: 'rgba(184,187,38,1)',
        SOH: 'rgba(152,151,26,1)',
        SC: 'rgba(251,73,52,1)',
        SCH: '	rgba(204,36,29,1)',
    }
    initColorLocalStorage('SO', 'rgba(184,187,38,1)', colorObj);
    initColorLocalStorage('SOH', 'rgba(152,151,26,1)', colorObj);
    initColorLocalStorage('SC', 'rgba(251,73,52,1)', colorObj);
    initColorLocalStorage('SCH', '	rgba(204,36,29,1)', colorObj);


    $(".shopOpen").css("background-color", colorObj.SO);
    $(".shopClose").css("background-color", colorObj.SC);
    $(".shopOpen").hover(function () {
        $(this).css("background-color", colorObj.SOH);
    }, function () {
        $(this).css("background-color", colorObj.SO);
    });
    $(".shopClose").hover(function () {
        $(this).css("background-color", colorObj.SCH);
    }, function () {
        $(this).css("background-color", colorObj.SC);
    });

    $('.card').hover(function() {
        $(this).click(function(){
            $(this).css('z-index', '2');
            $(this).children('.card-text').show();
            $(this).css('width', '180px');
           // $(this).animate({left:"+30px"})
            //$(this).parent().css('z-index', '2');

        })
        },function() {
            $(this).children('.card-text').hide();
            $(this).css('width', '');
            $(this).css('z-index', '');
           // $(this).animate({left:"0px"})
    }) 
    
    // $(".card").click(function(event) {
    //     alert($(event.currentTarget.p).text());
    // });

});
