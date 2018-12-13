(function () { // this file basically deals with enabling the user to send data from watch. can be toggled on or off
	
	console.log('settings.js running...');
	
	var btnSensorData = document.querySelector("#btnSensorData");
// getting the btnSensorData element and storing it in btnSensorData. 

    var page = document.getElementById("main"),
        listHelper,
        elScroller;


    window.addEventListener('tizenhwkey', function (ev) {
        if (ev.keyName === "back") {
            var page = document.getElementsByClassName('ui-page-active')[0],
                pageid = page ? page.id : "";
            if (pageid === "main") {
                try {
                    tizen.application.getCurrentApplication().exit();
                } catch (ignore) {
                }
            } else {
                window.history.back();
            }
        }
    });

    page.addEventListener("pagebeforeshow", function (e) {
        var list;

        elScroller = page.querySelector(".ui-scroller");
        if (elScroller) {
            list = elScroller.querySelector(".ui-listview");
        }

        if (elScroller && list) {
            listHelper = tau.helper.SnapListStyle.create(list, { animate: "scale" });

            elScroller.setAttribute("tizen-circular-scrollbar", "");
        }
    });

    page.addEventListener("pagebeforehide", function (e) {
        if (listHelper) {
            listHelper.destroy();

            listHelper = null;

            if (elScroller) {
                elScroller.removeAttribute("tizen-circular-scrollbar");
            }
        }
    });
    
    btnSensorData.addEventListener("click", function() {
    	console.log('click event: btnSensorData');
    });
}());