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

    // generate shops html element
    function generateCardList(list, listName) {
        var collapseHtml = `<div class="container-fluid  collapse-bar rounded " target=#${listName}>` +
                                listName +
                            '</div>'+
                            `<div id=${listName} class="collapse border ">` +
                                '<div class="container-fluid  shop-list">'+
                                '</div>' +
                            '</div>';
        $('.main').append(collapseHtml);
        var cnt = 0;
        for (const shop of list) {
            var tmp = '';
            if (cnt % 4 == 0) {
                var div = $("<div></div>").addClass('row').attr('id', `row-${cnt / 4}`);
                $(`#${listName}>.shop-list`).append(div);
            }
            switch (UTCday) {
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                    var shopOpenTime = dataObject[shop]["週一至週五"]
                    tmp = getStatus(shopOpenTime);
                    break;

                case 6:
                    var shopOpenTime = dataObject[shop]["週六"]
                    tmp = getStatus(shopOpenTime);
                    break;

                case 0:
                    var shopOpenTime = dataObject[shop]["週日"]
                    tmp = getStatus(shopOpenTime);
                    break;

                default:
                    break;
            }
            var remark = '';
            if (dataObject[shop]["備註"] != '') {
                remark = `<span data-toggle="tooltip" data-placement="top" title=${dataObject[shop]["備註"]}>&#9888;</apan>`
            }
            var col = $('<div></div>').addClass('col-3').append($('<div></div>').addClass('card ' + tmp).append(`<p class="card-title">${shop + remark}</p>` + `<p class="card-text">${dataObject[shop]['備註']}</p>`));

            console.log(timeHM);
            $(`#${listName}>.shop-list>#row-${parseInt(cnt / 4)}`).append(col);

            cnt += 1;
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


    var list = ["麥當勞", "比司多", "李記小館", "麻吉牛排", "就是愛壽司", "大洪食堂", "海盜滷味", "鑫鴻(珈名鮮茶)", "堤兒小店(小吃部)", "7-11"];
    var list2 = ["八方雲集", "和風風味屋", "羹飯大叔", "酷雞雞排飯", "金展自助餐", "三顧茅廬", "利竫和食", "弘謙食堂", "晨光早午餐", "小木屋鬆餅", "全家便利商店", "管理部", "眼鏡部", "洗衣部", "水木百貨", "胖達咖啡", "Moment Caf'e", "理髮部", "利捷打字行"];
    var list3 = ["堤兒小店(風雲)", "水木書苑", "Straighta", "越好食堂", "紅燒如意坊", "蔬適圈", "淳在幸福", "友記麵食館", "帕森義大利麵", "漢城異國美食", "家味燒臘", "喜番咖哩", "牛肉先生", "墨尼捲餅", "珍御品粥麵館", "倆小食", "鳴野食蘋早午餐", "胖老爹美式炸雞", "The Loft"];
    var list4 = ["清華水漾餐廳", "人社院餐廳", "第二招待所中餐廳",  "教職員餐廳", "日安餐坊", "果子咖啡"]
     
    generateCardList(list, '小吃部_清大');
    generateCardList(list2, '水木_清大');
    generateCardList(list3, '風雲_清大');
    generateCardList(list4, '其他_清大');
    


    // set color
    var colorObj = {
        SO: 'rgba(152,151,26,1)',
        SOH: 'rgba(184,187,38,1)',
        SC: 'rgba(204,36,29,1)',
        SCH: 'rgba(204,36,29,1)',
        BG: 'rgba(40,40,40,1)'
    }
    initColorLocalStorage('SO', 'rgba(152,151,26,1)', colorObj);
    initColorLocalStorage('SOH', 'rgba(184,187,38,1)', colorObj);
    initColorLocalStorage('SC', 'rgba(251,73,52,1)', colorObj);
    initColorLocalStorage('SCH', 'rgba(251,73,52,1)', colorObj);
    initColorLocalStorage('BG', 'rgba(40,40,40,1)', colorObj);


    $("body").css("background-color", colorObj.BG);
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

    $('.card').click(function () {
        var target = $(this).children('.card-title').text().replace('⚠', '');
        console.log(typeof (target));
        console.log(target);
        $('#shopModalLabel').text(target);
        $('#modalP').children('span').text(dataObject[target]['place']);
        $('#modalMTF').children('span').text(dataObject[target]['週一至週五']);
        $('#modalSAT').children('span').text(dataObject[target]['週六']);
        $('#modalSUN').children('span').text(dataObject[target]['週日']);
        $('#modalPS').hide();
        if(dataObject[target]['備註'] !== "") {
            $('#modalPS').children('span').text(dataObject[target]['備註']);
            $('#modalPS').show();
        }
        $('#exampleModal').modal('show');
    });
    $('.collapse-bar').click(function() {
        console.log('click')
        $($(this).attr('target')).collapse('toggle');
    });


    /* testing below */
    
});
