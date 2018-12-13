(function() {
  console.log("app.js running...");

  //selecting all the element ids from the html file and then storing them in variables that will be used later
  var liSettings = document.querySelector("#liSettings");
  var liOffers = document.querySelector("#liOffers");
  var activityDisplay = document.querySelector("#activityDisplay");

  var indicatorValue = 0; // this is the variable that will be holding the calculated sensor data
  var page = document.getElementById("main"),
    listHelper,
    elScroller;
  var macAddress; // variable MACADDRESS that will be storing the watch's mac address

  // initally run an MQTT client to subscribe to check if in range of
  // billboard

  var wsbroker = "broker.mqttdashboard.com"; // mqtt server for socket
  var wsport = 8000; // port for above server

  var client = new Paho.MQTT.Client(
    wsbroker,
    wsport,
    "clientId-firstrandomstuff"
  );
  // in the above, we are creating a client variable that will be connecting to the
  // MQTT broker (websocket)

  var options = {
    timeout: 3, // 3s before timeout
    onSuccess: function() {
      // if we are able to connect to MQTT
      console.log("mqtt connected");

      var macAddress; // create macaddress variable again (its local for this func only)
      tizen.systeminfo.getPropertyValue("WIFI_NETWORK", function(e) {
        macAddress = e.macAddress; //get the macAddress

        //subscribe to macAddress based on that
        // alert(macAddress); // this is used to check the macaddress for the watch
        // for debugging purposes only

        client.subscribe("BLEconnected/" + macAddress);
        // subscribe to the mqtt client with the topic BLEconnected/macaddress of watch
      });

      client.subscribe("BLEconnected/" + macAddress);
      // subscribe to the mqtt client with the topic BLEconnected/macaddress of watch
    },
    onFailure: function(message) {
      // in the event that we are unable to connect to mqtt
      console.log("Connection failed: " + message.errorMessage);
    }
  };

  client.connect(options); //establishing connection to mqtt

  client.onConnectionLost = function(responseObject) {
    //in the event that the tizen watch loses connection to mqtt for any reasonj
    console.log("connection lost: " + responseObject.errorMessage);
  };

  // when there is a message that is recieved
  client.onMessageArrived = function onMessageArrived(message) {
    console.log("onMessageArrived:" + message.payloadString);
    // outputting the recieved message onto the console log

    tizen.systeminfo.getPropertyValue("WIFI_NETWORK", function(e) {
      var macAddress = e.macAddress; // storing mac address

      console.log(macAddress);

      // when message destination is the same as BLEconnected/macaddress
      if (message.destinationName == "BLEconnected/" + macAddress) {
        alert("Billboard detected!"); // will display an alert on the tizen watch stating that
        //mqtt message is recieved and the watch user is next to a billboard

        // creating another mqtt websocket
        var wsbroker = "broker.mqttdashboard.com";
        var wsport = 8000;
        var client = new Paho.MQTT.Client(
          wsbroker,
          wsport,
          "clientId-randomstuff"
        );

        var options = {
          timeout: 3, // timeout of 3s
          onSuccess: function() {
            // if mqtt is connected
            console.log("mqtt connected");

            console.log("IndicatorValue = " + indicatorValue);
            // console logging the indicator value that is recieved and displayed

            msg = new Paho.MQTT.Message(
              JSON.stringify({
                activityRate: indicatorValue
              })
            ); // we are stringifying the mqtt value and storing it in the msg variable

            msg.destinationName = "watch/" + macAddress; // selecting message destination  as watch/blablabla
            client.send(msg); // mqtt publishes indicator value to server
          },
          onFailure: function(message) {
            // in the event that the message is not sent
            console.log("Connection failed: " + message.errorMessage);
          }
        };

        client.connect(options); // connect to the mqtt client and send data

        client.onConnectionLost = function(responseObject) {
          // in the event that mqtt connection is lost for any reason
          console.log("connection lost: " + responseObject.errorMessage);
        };
      }
    });
  };

  //changing the value of the display in HTML file
  activityDisplay.innerHTML = indicatorValue;

  //add event listener for going back to prev. page
  window.addEventListener("tizenhwkey", function(ev) {
    if (ev.keyName === "back") {
      var page = document.getElementsByClassName("ui-page-active")[0],
        pageid = page ? page.id : "";
      if (pageid === "main") {
        try {
          tizen.application.getCurrentApplication().exit();
        } catch (ignore) {}
      } else {
        window.history.back();
      }
    }
  });

  //add more even listener
  page.addEventListener("pagebeforeshow", function(e) {
    var list;

    elScroller = page.querySelector(".ui-scroller");
    if (elScroller) {
      list = elScroller.querySelector(".ui-listview");
    }

    if (elScroller && list) {
      listHelper = tau.helper.SnapListStyle.create(list, {
        animate: "scale"
      });

      elScroller.setAttribute("tizen-circular-scrollbar", "");
    }
  });

  //another one!!!!!
  page.addEventListener("pagebeforehide", function(e) {
    if (listHelper) {
      listHelper.destroy();

      listHelper = null;

      if (elScroller) {
        elScroller.removeAttribute("tizen-circular-scrollbar");
      }
    }
  });

  //another one!!!!!
  liSettings.addEventListener("click", function() {
    console.log("click event: liSettings");
    window.location.href = "settings.html";
  });

  //and another one!!!!! (credits DJ khaled)
  liOffers.addEventListener("click", function() {
    console.log("click event: liOffers");
    window.location.href = "offers.html";
  });

  //this is used for calculating the sensor values. Unfortunately due to sensors not
  //working, we decided to throw random values to simulate the sensors
  setInterval(function(client) {
    indicatorValue = parseInt(Math.random() * 200);
    activityDisplay.innerHTML = indicatorValue; // displaying the sensor value every 2s
  }, 2000);
})();
