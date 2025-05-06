import { apiKey } from "./Keys/key.js";

const greeting = document.getElementById("greeting-message");
//weather elements
const weatherForm = document.getElementById("weather-form");
const cityInput = document.getElementById("weather-city-input");
const weatherDisplay = document.getElementById("display-weather-info");
//to-do list elements
const toDoForm = document.getElementById("to-do-form");
const taskInput = document.getElementById("task-input");
const toDoList = document.getElementById("to-do-list");
//notes elements
const notesContent = document.getElementById("notes-content");

//gets current hour of day (24 hour format)
const dateObj = new Date();
const currentTime = dateObj.toLocaleTimeString("en-US", {hour12:false, hour:'numeric'});

//display different welcome messaage depending on time of day

//morning
if (currentTime >= 5 && currentTime < 12) {
    greeting.textContent = "Good Morning";
    
}
//afternoon
else if (currentTime >= 12  && currentTime < 18) {
    greeting.textContent = "Good Afternoon";
}
//nighttime
else {
    greeting.textContent = "Good Evening";
}


weatherForm.addEventListener("submit", async (event) => {
    //so the page does not refresh
    event.preventDefault();

    //get city info
    const city = cityInput.value

    //if city input is not blank search for the city's weather info
    if (city != "") {
        try {
            //clear previous weather content
            weatherDisplay.innerHTML = "";
            //search weather info based on city
            const weatherInfo = await getWeatherInfo(city);
            displayWeatherInfo(weatherInfo);
        }
        catch (error) {
            console.log(error);   
        }
    }
    else {
        weatherDisplay.innerHTML = "";
    }
});

async function getWeatherInfo(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    const response = await fetch(url);

    if(!response.ok) {
        throw new Error("Unable to fetch weather data")
    }

    return await response.json();
}

function displayWeatherInfo(info) {
    //city name
    const cityHeader = document.createElement("p");
    cityHeader.textContent = `${info["name"]}, ${info["sys"]["country"]}`;
    weatherDisplay.append(cityHeader);
    //temperature info
    const celsius = Math.round(info["main"]["temp"] - 273.15);
    const fahrenheit = Math.round(celsius * 1.8 + 32);
    const temperature = document.createElement("p");
    temperature.textContent = `${celsius} °C | °F ${fahrenheit}`;
    weatherDisplay.append(temperature);
    //wind
    const wind = document.createElement("p");
    wind.textContent = `Wind: ${info["wind"]["speed"]} m/s | ${Math.round(info["wind"]["speed"] * 2.2369362921)} mph`
    weatherDisplay.append(wind);
    //humidity
    const humidity = document.createElement("p");
    humidity.textContent = `Humidity: ${info["main"]["humidity"]}%`;
    weatherDisplay.append(humidity);
    //current weather description
    const currentDescription = document.createElement("p");
    currentDescription.textContent = `${info["weather"][0]["description"]}`;
    weatherDisplay.append(currentDescription);
}

//to-do list
toDoForm.addEventListener("submit", (event) => {
    //prevents page refresh
    event.preventDefault();

    //add task
    if (taskInput.value === "") {
        console.error("no task inputted");
    }
    else {
        addTask(taskInput.value);
    }
});

function addTask(task) {
    taskInput.value = "";
    //if no tasks in local storage, set to an empty array
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    //add new task and save to locaal storage
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    //display tasks
    displayTasks();
}

function displayTasks() {
    toDoList.innerHTML = "";
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    //create list element and delete button for each value
    tasks.forEach((element, index) => {
        //add task
        let task = document.createElement("li");
        task.classList.add("task");
        task.innerHTML = element;
        //add remove button
        let removeBtn = document.createElement("button");
        removeBtn.classList.add("remove-button");
        removeBtn.textContent = "Remove";
        task.append(removeBtn);

        //add task to the list
        toDoList.appendChild(task);  
        
        //add event listener to each button to remove task when clicked
        removeBtn.addEventListener("click", () => removeTask(index));
    });
}

function removeTask(index) {
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayTasks();
}

//load to-do list on page load
displayTasks();

//notes

//add notes to local storage on change
notesContent.addEventListener("change", () => {
    localStorage.setItem("notes", JSON.stringify(notesContent.value)); 
});

//load notes
let notes = JSON.parse(localStorage.getItem("notes")) || "";
notesContent.value = notes

