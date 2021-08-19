var savebtn = document.querySelector("#save");
let brewMap = document.querySelector(".map")
var eventcontEl = document.querySelector(".container");
var brewId = document.location.href.split('b/')[1]




var generateBreweries = function () {
    var apiUrl = "https://api.openbrewerydb.org/breweries/" + brewId;
    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {

                    var brewCall = document.querySelector(".brew-name")
                    brewCall.textContent = data.name;

                    var brewAddress = document.querySelector(".brew-address");
                    brewAddress.textContent = data.street + " " + data.city + ", " + data.state;

                    // get formatted phone number

                    var phoneNumFormatted = formatPhoneNum(data.phone);

                    var brewPhone = document.querySelector(".phone");
                    brewPhone.textContent = phoneNumFormatted;

                    var brewURL = document.createElement("a");
                    brewURL.setAttribute("href", data.website_url)
                    var URLEl = document.querySelector(".url");
                    brewURL.textContent = data.website_url;
                    URLEl.appendChild(brewURL);
                    getMap(data)
                })
            }
        })
};

var formatPhoneNum = function (PhoneNumber) {
    var phoneNum = PhoneNumber.split("", 4)
    if (PhoneNumber === null) {

    }
    if (phoneNum[4] === ")" || phoneNum[3] === "-") {
        return PhoneNumber
    }
    else {
        var phoneNum = PhoneNumber.split("", 10);

        var areaCode = "(" + phoneNum[0] + phoneNum[1] + phoneNum[2] + (")-");
        var restNum = phoneNum[3] + phoneNum[4] + phoneNum[5] + "-" + phoneNum[6] + phoneNum[7] + phoneNum[8] + phoneNum[9];
        return areaCode + restNum;
    }
}


var getMap = function (data) {
    var mapScript = document.createElement("script");
    mapScript.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDWNRir9crnRheNJT0Z8f2mlpDIbV_43Ak&callback=initMap"
    mapScript.async = true;

    var latitude = data.latitude - 0;
    var longitude = data.longitude - 0;
    if (latitude === 0 || longitude === 0) {
        return;
    } else {
        window.initMap = function () {
            map = new google.maps.Map(document.getElementById("map"), {
                center: { lat: latitude, lng: longitude },
                zoom: 10,
            });
            marker = new google.maps.Marker({
                position: { lat: latitude, lng: longitude },
                map: map
            })
        }
    }
    brewMap.appendChild(mapScript)
}

async function createComment(event) {
    event.preventDefault();

    const commentText = document.querySelector('#comment-text').textContent

    const response = await fetch(['api/comments/'], {
        method: 'post',
        body: JSON.stringify({
            comment_text: commentText,
            pub_id: brewId
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })


    console.log(response)
}

async function loadComments(data) {

    const brewId = data.id;

    const response = await fetch('api/users/comments/' + brewId)

    console.log(response);
}

generateBreweries();

document.querySelector('#comment-text').addEventListener('submit', createComment)