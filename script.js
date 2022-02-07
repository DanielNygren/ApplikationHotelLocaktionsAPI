const api = 'https://localhost:44323/api';

const hotelList = document.querySelector('#hotels-list');
const orderBy = document.querySelector('#orderBy');
const formOrderBy = document.querySelector('#form-orderBy');

var lat = null;
var log = null;

function start()
{
    if(lat == null){
        getLocation();
    }
}

async function getLocation()
{
    //Check if browser supports W3C Geolocation API
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successFunction);
    }
}

//Get latitude and longitude;
async function successFunction(position) {
    lat = position.coords.latitude;
    log = position.coords.longitude;

    getJSON();
}

//Get JSON from API
async function getJSON(){

    //Send Request
    const sendHttpRequest = (method, url, data) =>{
        return fetch(url, {
            method: method,
            body: JSON.stringify(data),
            headers: data ? {'Content-Type': 'application/json'} : {}
        }).then(response =>{
            //If Error kod >= 400 return error data
            if(response.status >= 400){
                return response.json().then(errResData =>{
                    const error = new Error ('Somthing went wrong');
                    error.data = errResData;
                    throw error;
                }) 
            }
            return response.json();
        });
    };

    console.log(api + '/hotels/'+ lat +'/'+ log + '/' + orderBy.value)

    //Get Data from API
    const getData = () =>{
        sendHttpRequest('GET', api + '/hotels/'+ lat +'/'+ log + '/' + orderBy.value).then(responseData =>{
            console.log(responseData);
            showHotels(responseData);
        });
    };
    getData();
};
//Onsubmit
formOrderBy.onsubmit = async event => {
    event.preventDefault();
    getJSON();
};

//Create list of Hotels
function showHotels(results){

    //Removes old list if it exists
    if(hotelList.children.length > 0){
        var x = hotelList.children.length;
        for(i=0; i < x;i++){
            hotelList.removeChild(document.querySelector('#hotel-container'));
        }
    }

    results.forEach(result => 
        {
            let hotelContainer = document.createElement("tr");
            hotelList.appendChild(hotelContainer);
            hotelContainer.id = "hotel-container";
            let cell0 = document.createElement("td");
            let cell1 = document.createElement("td");
            let cell2 = document.createElement("td");
            let cell3 = document.createElement("td");
            let cell4 = document.createElement("td");
            let name = document.createElement("th");
            let distance = document.createElement("th");
            let roomsAvaiable = document.createElement("th");
            let rating = document.createElement("th");
            let link = document.createElement("th");
            
            let hotelLink = document.createElement("a");
            hotelLink.textContent = "Go to Hotel"
            hotelLink.href = result.webLink
            link.appendChild(hotelLink);
            
            name.textContent = result.name;
            distance.textContent = (result.distance / 1000).toFixed(2) + " km away";
            roomsAvaiable.textContent = "    | Rooms available today: " + result.rooms + " |    "
            rating.textContent = result.rating + "/5" + " ⭐ "

            name.style.fontSize = "22px";
            name.style.fontWeight = "bold";
            distance.style.fontSize = "14px";
            distance.style.color = "#DAAD86";
            distance.style.fontStyle = "bold";
            distance.style.fontWeight = "normal";
            roomsAvaiable.style.fontSize = "14px";
            roomsAvaiable.style.color = "#DAAD86";
            roomsAvaiable.style.fontWeight = "normal";
            roomsAvaiable.style.fontStyle = "normal";
            rating.style.fontSize = "14px";
            rating.style.color = "#DAAD86";
            distance.style.fontStyle = "rating";
            distance.style.fontWeight = "bold";

            cell0.appendChild(name);
            cell1.appendChild(distance);
            cell2.appendChild(roomsAvaiable);
            cell3.appendChild(rating);
            cell4.appendChild(link);

            cell0.style.borderBottom = "thin solid #B6986A";
            cell1.style.borderBottom = "thin solid #B6986A";
            cell2.style.borderBottom = "thin solid #B6986A";
            cell3.style.borderBottom = "thin solid #B6986A";
            cell4.style.borderBottom = "thin solid #B6986A";

            hotelContainer.appendChild(cell0);
            hotelContainer.appendChild(cell1);
            hotelContainer.appendChild(cell2);
            hotelContainer.appendChild(cell3);
            hotelContainer.appendChild(cell4);

    });
}

start();