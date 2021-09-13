api.setRestToken();
const client = new StringeeClient();
var callNgheMay;
client.on("incomingcall", function (incomingcall) {
  console.log("incomingcall", incomingcall);

  document.getElementById("cuoc-goi").style.display = "block";
     settingCallEvent(incomingcall);
  callNgheMay = incomingcall;
});
async function ketnoi() {
  var userId = document.getElementById("nameUser").value;

  const userToken = await api.getUserToken(userId);
  // console.log('token',userToken);

  client.on("authen", function (res) {
    console.log("on authen: ", res.userId);
  });
  client.connect(userToken);

  client.on("connect", function () {
    console.log("connected");
    $(".login").html('');
    $("#name-user").text(userId);
  });
}

function call() {
  var userName = $("#name-user").text();
  var nameFriend = document.getElementById("name-fiend").value;
  var call = new StringeeCall(client, userName, nameFriend, true);
  callNgheMay = call;
  document.getElementById('btn-tat-may').style.display = 'block';
  settingCallEvent(call);
  call.makeCall(function (res) {
    console.log("make call callback: " + JSON.stringify(res));
  });
}

function ngheMay() {

    // settingCallEvent(callNgheMay);
    callNgheMay.answer(function (res) {
    // 
    console.log("answer res", res);
  });
}
function tuChoi() {
    callNgheMay.reject(function (res) {
        console.log('reject res', res);
    });
}
function tatMay() {
    callNgheMay.hangup(function (res) {
        console.log('hangup res', res);
    });
}
function settingCallEvent(call1) {
  call1.on("addremotestream", function (stream) {
    // reset srcObject to work around minor bugs in Chrome and Edge.
    console.log("addremotestream");
    remoteVideo.srcObject = null;
    remoteVideo.srcObject = stream;
  });

  call1.on("addlocalstream", function (stream) {
    // reset srcObject to work around minor bugs in Chrome and Edge.
    console.log("addlocalstream");
    localVideo.srcObject = null;
    localVideo.srcObject = stream;
  });

  call1.on("signalingstate", function (state) {
    console.log("signalingstate ", state);
    var reason = state.reason;
    $("#callStatus").html(reason);
  });

  call1.on("mediastate", function (state) {
    console.log("mediastate ", state);
  });

  call1.on("info", function (info) {
    console.log("on info:" + JSON.stringify(info));
  });
}
