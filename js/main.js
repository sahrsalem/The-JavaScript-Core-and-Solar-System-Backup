const HARDCODED_PLANET_DATA = [
    { id: 101, title: "Mercury - The Promise", overview: "The promises developers make to colleagues, the foundation for handling asynchronous operations to ensure application responsiveness. Mercury, being fast and close, represents this commitment." },
    { id: 102, title: "Venus - The Async/Await", overview: "The elegant simplification of Promises, making asynchronous code look and read like synchronous code. Venus, the brightest, represents the clarity and simplicity of this structure." },
    { id: 103, title: "Earth - The fetch()", overview: "The tool for sending requests to the API, the basis for connecting to the outside world. Earth represents the foundation upon which the application lives and communicates." },
    { id: 104, title: "Mars - The map()", overview: "The array transformation tool, where each element in the array is processed to create a new array. Mars, with its complex terrain, represents the need for data transformation." },
    { id: 105, title: "Jupiter - The forEach()", overview: "The tool for iterating over array elements to execute a task on each element, without necessarily creating a new array. Massive Jupiter represents the need to process large amounts of data." },
    { id: 106, title: "Saturn - The Class/OOP", overview: "A structure for creating distinct objects with specific properties and functions, facilitating the construction of complex systems. Saturn, with its organized rings, represents code organization." },
    { id: 107, title: "Uranus - The DOM/Events", overview: "The page's skeleton (DOM) and the user interaction mechanism (Events) with this structure. Uranus represents the remote interface the user interacts with." },
    { id: 108, title: "Neptune - The API", overview: "The connection point between the application and external servers, the gateway for fetching data and functions. Distant Neptune represents the final and important connection point." }
];

// JS concepts (used for naming the planets conceptually)
const JS_CORE_NAMES = [
    "Promise", "Async/Await", "fetch()", "map()",
    "forEach()", "Class/OOP", "DOM/Events", "API"
];

// *** APIService class has been removed ***

class Planet {
    constructor(data, index) {
        // Properties are now taken from the static array
        this.conceptName = JS_CORE_NAMES[index - 1] || `Planet ${index}`;
        this.name = data.title; // e.g., "Mercury - The Promise"
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
            // Extract the planet name part for the title display
            const planetPart = this.name.split(' - ')[0].trim(); 
            displayPlanetDetails(this.name, this.overview, planetPart);
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
    // Format title: "Mercury - The Promise"
    const concept = name.split(' - ')[1].trim(); 
    detailTitle.textContent = `${conceptName} - ${concept}`;
    detailOverview.textContent = overview;
    detailContainer.classList.remove('hidden');
}

// Replaced the API call with static data processing
async function initializeApp() {
    const planetsData = HARDCODED_PLANET_DATA;
    const statusElement = document.getElementById('loadingStatus');

    if (planetsData && planetsData.length > 0) {
        statusElement.textContent = `Successfully loaded ${planetsData.length} Planets. Starting the Solar System.`;

        planetsData.slice(0, 8).forEach((data, index) => {
            const planet = new Planet(data, index + 1);
            planets.push(planet);

            mainContent.appendChild(planet.orbitElement);
            mainContent.appendChild(planet.element);
        });

        requestAnimationFrame(animate);
    } else {
        statusElement.textContent = 'Failed to load planets data. Static data is empty.';
    }
}

initializeApp();

