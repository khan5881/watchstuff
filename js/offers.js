(function() {
  // attempted to make heart rate work but it failed miserably
  // tried to control heart rate and change its value but it never worked
  var HRMrawsensor = tizen.sensorservice.getDefaultSensor("HRM_RAW");

  function onGetSuccessCB(sensorData) {
    var data = sensorData.lightIntensity;
    alert("HRMRaw light intensity: " + data);
    document.querySelector("#hr").innerHTML = data;
  }

  function onerrorCB(error) {
    console.log("Error occured");
  }

  function onsuccessCB() {
    console.log("HRMRaw sensor start");
    HRMrawsensor.getHRMRawSensorData(onGetSuccessCB, onerrorCB);
  }

  HRMrawsensor.start(onsuccessCB);
});
