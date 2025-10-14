
const API_KEY = "98b6cfc6cbad9fd04dd9b0744fa856d5"; 
const BASE_URL = "https://api.themoviedb.org/3"; 
const POPULAR_MOVIES_ENDPOINT = "/movie/popular"; 
const JS_CORE_NAMES = [
    "Promise", "Async/Await", "fetch()", "map()",
    "forEach()", "Class/OOP", "API", "DOM/Events"
];
class APIService {

    constructor(apiKey, baseUrl) {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
        console.log("APIService object successfully created.");
    }

    async fetchPopularMovies() {
        const url = `${this.baseUrl}${POPULAR_MOVIES_ENDPOINT}?api_key=${this.apiKey}&language=en-US`;
        try {
            console.log("Sending data fetch request...");
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Connection failed: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            console.log("Data successfully fetched.");
            return data.results;
        } catch (error) {
            console.error('APIService Error:', error.message);
            document.getElementById('loadingStatus').textContent = `Data loading failed. Reason: ${error.message}`;
            return [];
        }
    }
}
class Planet {


    constructor(data, index) {


        this.conceptName = JS_CORE_NAMES[index - 1] || `Planet ${index}`;

        // Properties fetched from API
        this.name = data.title;
        this.id = data.id;
        this.overview = data.overview;


        this.index = index;

        this.orbitRadius = 100 + (index * 30);
        this.diameter = 20 + (index % 5) * 4;
        this.speed = (0.5 + (index % 3) * 0.1) * 0.01;
        this.direction = (index % 2 === 0) ? 1 : -1;
        this.currentAngle = Math.random() * 360;


        this.element = this.createElement();
        this.orbitElement = this.createOrbitElement();


        this.addClickListener();
    }
    addClickListener() {

        this.element.addEventListener('click', () => {

            displayPlanetDetails(this.name, this.overview, this.conceptName);
        });
    }

    createElement() {
        const planetDiv = document.createElement('div');
        planetDiv.className = 'planet';
        planetDiv.id = `planet-${this.id}`;
        planetDiv.style.width = `${this.diameter}px`;
        planetDiv.style.height = `${this.diameter}px`;
        planetDiv.style.backgroundColor = `hsl(${this.index * 40}, 80%, 50%)`;


        planetDiv.setAttribute('title', `${this.conceptName}: ${this.name}`);

        return planetDiv;
    }


    createOrbitElement() {
        const orbitDiv = document.createElement('div');
        orbitDiv.className = 'orbit';
        orbitDiv.id = `orbit-${this.id}`;
        const size = this.orbitRadius * 2;
        orbitDiv.style.width = `${size}px`;
        orbitDiv.style.height = `${size}px`;
        return orbitDiv;
    }


    addClickListener() {
        this.element.addEventListener('click', () => {

            displayPlanetDetails(this.name, this.overview, this.conceptName);
        });
    }


    updateSpecialEffect() {
        const isGlowingZone = (this.currentAngle % 360 > 80 && this.currentAngle % 360 < 120);
        if (isGlowingZone) {
            this.orbitElement.classList.add('glowing-segment');
        } else {
            this.orbitElement.classList.remove('glowing-segment');
        }
    }


    update(deltaTime) {
        this.currentAngle += (this.speed * this.direction * deltaTime);
        if (this.currentAngle >= 360) this.currentAngle -= 360;
        if (this.currentAngle < 0) this.currentAngle += 360;
        this.updateSpecialEffect();
        this.element.style.transform = `rotate(${this.currentAngle}deg) translateX(${this.orbitRadius}px) rotate(-${this.currentAngle}deg)`;
    }
}
const planets = [];
const mainContent = document.getElementById('mainContent');
let lastFrameTime = performance.now();
function animate(currentTime) {
    const deltaTime = currentTime - lastFrameTime;
    planets.forEach(planet => planet.update(deltaTime));
    lastFrameTime = currentTime;
    requestAnimationFrame(animate);
}
const detailContainer = document.getElementById('planetDetails');
const detailTitle = document.getElementById('detailTitle');
const detailOverview = document.getElementById('detailOverview');
function displayPlanetDetails(name, overview, conceptName) {

    detailTitle.textContent = `${conceptName} (${name})`;
    detailOverview.textContent = overview;


    detailContainer.classList.remove('hidden');
}
const apiService = new APIService(API_KEY, BASE_URL);

async function initializeApp() {
    const movies = await apiService.fetchPopularMovies();
    const statusElement = document.getElementById('loadingStatus');

    if (movies && movies.length > 0) {
        statusElement.textContent = ` Successfully fetched ${movies.length} Planets. Starting the Solar System `;

        movies.slice(0, 8).forEach((movieData, index) => {

            const planet = new Planet(movieData, index + 1);
            planets.push(planet);

            mainContent.appendChild(planet.orbitElement);
            mainContent.appendChild(planet.element);


            planet.element.addEventListener('click', () => {
                displayPlanetDetails(planet.name, planet.overview, planet.conceptName);
            });
        });

        requestAnimationFrame(animate);
    } else {
        statusElement.textContent = ' Failed to fetch Planets. Check console for errors.';
    }
}
initializeApp();



