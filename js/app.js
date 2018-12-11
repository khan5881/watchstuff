(function() {

	console.log('app.js running...');

	var liSettings = document.querySelector("#liSettings");
	var liOffers = document.querySelector("#liOffers");

	var indicatorValue = 0; // calculated through the sensor data
	var activityDisplay = document.querySelector("#activityDisplay");
	var page = document.getElementById("main"), listHelper, elScroller;
	var macAddress;
	// initally run an MQTT client to subscribe to check if in range of
	// billboard
	var wsbroker = "broker.mqttdashboard.com"; // mqtt websocket
	// enabled broker
	var wsport = 8000; // port for above
	var client = new Paho.MQTT.Client(wsbroker, wsport,
			"clientId-firstrandomstuff");

	var options = {
		timeout : 3,
		onSuccess : function() { //when connected subscibe to a topic
			console.log("mqtt connected");
			var macAddress;
			 tizen.systeminfo.getPropertyValue("WIFI_NETWORK", function(e) {
			 macAddress = e.macAddress; //get the macAddress
			 //subscribe to macAddress based on that
			 alert(macAddress);
			 client.subscribe('BLEconnected/' + macAddress);
			 })
			client.subscribe('BLEconnected/' + macAddress);
		},
		onFailure : function(message) {
			//incase MQTT fails
			console.log("Connection failed: " + message.errorMessage);
		}
	};
	//connect the client
	client.connect(options);

	client.onConnectionLost = function(responseObject) {
		//incase connection is lost
		console.log("connection lost: " + responseObject.errorMessage);
	};
	//function called when message received
	client.onMessageArrived = function onMessageArrived(message) {
		console.log("onMessageArrived:" + message.payloadString);
		tizen.systeminfo.getPropertyValue("WIFI_NETWORK", function(e) {
		var macAddress = e.macAddress;
		console.log(macAddress);
		// this will be implemented when integrated with the watch
		// when mobile detects beacon/billboard then publish my data
		if (message.destinationName == 'BLEconnected/' + macAddress) {
			alert("Billboard detected!");
			var wsbroker = "broker.mqttdashboard.com"; // mqtt websocket
			// enabled broker
			var wsport = 8000; // port for above
			var client = new Paho.MQTT.Client(wsbroker, wsport,
					"clientId-randomstuff");

			var options = {
				timeout : 3,
				onSuccess : function() {
					console.log("mqtt connected");
					console.log('IndicatorValue = ' + indicatorValue);
					msg = new Paho.MQTT.Message(JSON.stringify({
						activityRate : indicatorValue
					}));
					msg.destinationName = "watch/" + macAddress;
					client.send(msg);
				},
				onFailure : function(message) {
					console.log("Connection failed: " + message.errorMessage);
				}
			};

			client.connect(options);

			client.onConnectionLost = function(responseObject) {
				console.log("connection lost: " + responseObject.errorMessage);
			};

		}
		})
	}
	//changing the value of the display 
	activityDisplay.innerHTML = indicatorValue;

	//add event listener for going back a page
	window.addEventListener(
					'tizenhwkey',
					function(ev) {
						if (ev.keyName === "back") {
							var page = document
									.getElementsByClassName('ui-page-active')[0], pageid = page ? page.id
									: "";
							if (pageid === "main") {
								try {
									tizen.application.getCurrentApplication()
											.exit();
								} catch (ignore) {
								}
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
				animate : "scale"
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
		console.log('click event: liSettings');
		window.location.href = "settings.html";
	});

	//another one!!!!!
	liOffers.addEventListener("click", function() {
		console.log('click event: liOffers');
		window.location.href = "offers.html";
	});

	//and another one!!!!! (credits DJ khaled)
	setInterval(function(client) {
		indicatorValue = parseInt(Math.random() * 200);
		activityDisplay.innerHTML = indicatorValue;
	}, 2000);
}());