/* =========================================================
   PROJECT 4
   NEON CIRCUIT
   3D RACING GAME
========================================================= */

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x101722);
scene.fog = new THREE.Fog(0x101722, 70, 240);


/* =========================================================
   CAMERA
========================================================= */

const camera = new THREE.PerspectiveCamera(
    65,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 5, 10);


/* =========================================================
   RENDERER
========================================================= */

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document
    .getElementById("game-container")
    .appendChild(renderer.domElement);


/* =========================================================
   LIGHTING
========================================================= */

const ambientLight = new THREE.HemisphereLight(
    0x9bb8ff,
    0x202020,
    1.5
);

scene.add(ambientLight);

const sun = new THREE.DirectionalLight(
    0xffffff,
    2
);

sun.position.set(40, 80, 20);
sun.castShadow = true;

sun.shadow.mapSize.width = 2048;
sun.shadow.mapSize.height = 2048;

sun.shadow.camera.left = -100;
sun.shadow.camera.right = 100;
sun.shadow.camera.top = 100;
sun.shadow.camera.bottom = -100;

scene.add(sun);


/* =========================================================
   WORLD
========================================================= */

const world = new THREE.Group();

scene.add(world);


/* =========================================================
   GROUND
========================================================= */

const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x263328,
    roughness: 1
});

const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(500, 500),
    groundMaterial
);

ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;

world.add(ground);


/* =========================================================
   ROAD
========================================================= */

const roadWidth = 18;
const roadLength = 260;

const roadMaterial = new THREE.MeshStandardMaterial({
    color: 0x24262a,
    roughness: 0.9
});

const road = new THREE.Mesh(
    new THREE.PlaneGeometry(roadWidth, roadLength),
    roadMaterial
);

road.rotation.x = -Math.PI / 2;
road.position.y = 0.02;

road.receiveShadow = true;

world.add(road);


/* =========================================================
   ROAD LINES
========================================================= */

const lineMaterial = new THREE.MeshBasicMaterial({
    color: 0xf3f3f3
});

for (let z = -125; z < 125; z += 12) {

    const line = new THREE.Mesh(
        new THREE.BoxGeometry(0.35, 0.04, 6),
        lineMaterial
    );

    line.position.set(0, 0.08, z);

    world.add(line);
}


/* =========================================================
   ROAD EDGES
========================================================= */

const edgeMaterial = new THREE.MeshStandardMaterial({
    color: 0x34383d
});

for (const x of [-10, 10]) {

    const edge = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 0.3, roadLength),
        edgeMaterial
    );

    edge.position.set(x, 0.15, 0);

    edge.castShadow = true;
    edge.receiveShadow = true;

    world.add(edge);
}


/* =========================================================
   TRACK CURVES
========================================================= */

const curveRoads = [];

function createCurveRoad(x, z, rotation) {

    const curve = new THREE.Mesh(
        new THREE.BoxGeometry(roadWidth, 0.12, 35),
        roadMaterial
    );

    curve.position.set(x, 0.04, z);
    curve.rotation.y = rotation;

    curve.receiveShadow = true;

    world.add(curve);
    curveRoads.push(curve);
}


/* =========================================================
   TRACK DECORATION
========================================================= */

const buildingMaterials = [
    new THREE.MeshStandardMaterial({ color: 0x30343d }),
    new THREE.MeshStandardMaterial({ color: 0x3d414c }),
    new THREE.MeshStandardMaterial({ color: 0x262b34 }),
    new THREE.MeshStandardMaterial({ color: 0x454a56 })
];

function createBuilding(x, z) {

    const height = 8 + Math.random() * 25;
    const width = 5 + Math.random() * 7;

    const building = new THREE.Mesh(
        new THREE.BoxGeometry(width, height, width),
        buildingMaterials[
            Math.floor(Math.random() * buildingMaterials.length)
        ]
    );

    building.position.set(
        x,
        height / 2,
        z
    );

    building.castShadow = true;
    building.receiveShadow = true;

    world.add(building);
}


/* =========================================================
   BUILDINGS
========================================================= */

for (let z = -120; z <= 120; z += 14) {

    createBuilding(
        -22 - Math.random() * 10,
        z
    );

    createBuilding(
        22 + Math.random() * 10,
        z
    );
}


/* =========================================================
   TREES
========================================================= */

function createTree(x, z) {

    const tree = new THREE.Group();

    const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(
            0.35,
            0.5,
            3
        ),
        new THREE.MeshStandardMaterial({
            color: 0x5a3c27
        })
    );

    trunk.position.y = 1.5;

    const leaves = new THREE.Mesh(
        new THREE.SphereGeometry(2.2, 12, 12),
        new THREE.MeshStandardMaterial({
            color: 0x1b5b3a
        })
    );

    leaves.position.y = 4;

    trunk.castShadow = true;
    leaves.castShadow = true;

    tree.add(trunk);
    tree.add(leaves);

    tree.position.set(x, 0, z);

    world.add(tree);
}

for (let z = -120; z <= 120; z += 20) {

    if (Math.random() > 0.35) {
        createTree(-16 - Math.random() * 8, z);
    }

    if (Math.random() > 0.35) {
        createTree(16 + Math.random() * 8, z);
    }
}


/* =========================================================
   CAR CREATION
========================================================= */

function createCar(color) {

    const car = new THREE.Group();

    /* BODY */

    const bodyMaterial = new THREE.MeshStandardMaterial({
        color: color,
        metalness: 0.45,
        roughness: 0.35
    });

    const body = new THREE.Mesh(
        new THREE.BoxGeometry(2.2, 0.65, 4.2),
        bodyMaterial
    );

    body.position.y = 0.7;

    body.castShadow = true;

    car.add(body);


    /* CABIN */

    const cabinMaterial = new THREE.MeshStandardMaterial({
        color: 0x11161d,
        metalness: 0.2,
        roughness: 0.2
    });

    const cabin = new THREE.Mesh(
        new THREE.BoxGeometry(1.55, 0.55, 1.9),
        cabinMaterial
    );

    cabin.position.set(
        0,
        1.15,
        0.15
    );

    cabin.castShadow = true;

    car.add(cabin);


    /* FRONT */

    const front = new THREE.Mesh(
        new THREE.BoxGeometry(2, 0.2, 0.35),
        new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0xffffff,
            emissiveIntensity: 1
        })
    );

    front.position.set(
        0,
        0.72,
        -2.05
    );

    car.add(front);


    /* WHEELS */

    const wheelMaterial = new THREE.MeshStandardMaterial({
        color: 0x080808,
        roughness: 0.9
    });

    const wheelPositions = [
        [-1.05, 0.45, -1.35],
        [1.05, 0.45, -1.35],
        [-1.05, 0.45, 1.35],
        [1.05, 0.45, 1.35]
    ];

    wheelPositions.forEach(pos => {

        const wheel = new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.45,
                0.45,
                0.3,
                16
            ),
            wheelMaterial
        );

        wheel.rotation.z = Math.PI / 2;

        wheel.position.set(
            pos[0],
            pos[1],
            pos[2]
        );

        wheel.castShadow = true;

        car.add(wheel);
    });


    /* REAR SPOILER */

    const spoiler = new THREE.Mesh(
        new THREE.BoxGeometry(2.3, 0.15, 0.45),
        bodyMaterial
    );

    spoiler.position.set(
        0,
        1.35,
        1.8
    );

    car.add(spoiler);


    return car;
}


/* =========================================================
   PLAYER
========================================================= */

const player = createCar(0x1d9cff);

player.position.set(
    0,
    0,
    100
);

world.add(player);


/* =========================================================
   AI CARS
========================================================= */

const aiCars = [];

const aiColors = [
    0xff304f,
    0xffb52e,
    0xa855f7
];

const aiStartPositions = [
    [-3.5, 94],
    [3.5, 88],
    [-3.5, 82]
];

aiColors.forEach((color, index) => {

    const car = createCar(color);

    car.position.set(
        aiStartPositions[index][0],
        0,
        aiStartPositions[index][1]
    );

    world.add(car);

    aiCars.push({
        mesh: car,
        speed: 0.18 + Math.random() * 0.04,
        progress: 0
    });
});


/* =========================================================
   START / FINISH LINE
========================================================= */

const finishLine = new THREE.Mesh(
    new THREE.BoxGeometry(
        roadWidth,
        0.05,
        3
    ),
    new THREE.MeshBasicMaterial({
        color: 0xffffff
    })
);

finishLine.position.set(
    0,
    0.09,
    100
);

world.add(finishLine);


/* =========================================================
   GAME VARIABLES
========================================================= */

let gameStarted = false;
let raceFinished = false;

let countdownActive = false;

let speed = 0;
let nitro = 100;

let lap = 1;

let raceTime = 0;

let lastTime = performance.now();

const maxSpeed = 1.05;
const acceleration = 0.025;
const braking = 0.055;
const friction = 0.012;

const steeringStrength = 0.045;

let distance = 0;

let keys = {
    up: false,
    down: false,
    left: false,
    right: false,
    nitro: false
};


/* =========================================================
   INPUT
========================================================= */

window.addEventListener("keydown", e => {

    if (
        e.key === "ArrowUp" ||
        e.key.toLowerCase() === "w"
    ) keys.up = true;

    if (
        e.key === "ArrowDown" ||
        e.key.toLowerCase() === "s"
    ) keys.down = true;

    if (
        e.key === "ArrowLeft" ||
        e.key.toLowerCase() === "a"
    ) keys.left = true;

    if (
        e.key === "ArrowRight" ||
        e.key.toLowerCase() === "d"
    ) keys.right = true;

    if (e.code === "Space") {
        keys.nitro = true;
        e.preventDefault();
    }
});


window.addEventListener("keyup", e => {

    if (
        e.key === "ArrowUp" ||
        e.key.toLowerCase() === "w"
    ) keys.up = false;

    if (
        e.key === "ArrowDown" ||
        e.key.toLowerCase() === "s"
    ) keys.down = false;

    if (
        e.key === "ArrowLeft" ||
        e.key.toLowerCase() === "a"
    ) keys.left = false;

    if (
        e.key === "ArrowRight" ||
        e.key.toLowerCase() === "d"
    ) keys.right = false;

    if (e.code === "Space") {
        keys.nitro = false;
    }
});


/* =========================================================
   MOBILE BUTTONS
========================================================= */

function mobileButton(id, property) {

    const button = document.getElementById(id);

    button.addEventListener("touchstart", e => {
        e.preventDefault();
        keys[property] = true;
    });

    button.addEventListener("touchend", e => {
        e.preventDefault();
        keys[property] = false;
    });

    button.addEventListener("touchcancel", () => {
        keys[property] = false;
    });
}

mobileButton("left-btn", "left");
mobileButton("right-btn", "right");
mobileButton("accelerate-btn", "up");
mobileButton("brake-btn", "down");
mobileButton("nitro-btn", "nitro");


/* =========================================================
   START GAME
========================================================= */

document
    .getElementById("start-button")
    .addEventListener("click", startRace);

document
    .getElementById("restart-button")
    .addEventListener("click", () => {
        location.reload();
    });


function startRace() {

    document
        .getElementById("start-screen")
        .classList.add("hidden");

    countdownActive = true;

    runCountdown();
}


/* =========================================================
   COUNTDOWN
========================================================= */

function runCountdown() {

    const element = document.getElementById("countdown");

    let count = 3;

    element.textContent = count;

    const interval = setInterval(() => {

        count--;

        if (count > 0) {

            element.textContent = count;

        } else {

            element.textContent = "GO!";

            setTimeout(() => {
                element.textContent = "";
                countdownActive = false;
                gameStarted = true;
            }, 700);

            clearInterval(interval);
        }

    }, 1000);
}


/* =========================================================
   PLAYER UPDATE
========================================================= */

function updatePlayer(delta) {

    if (!gameStarted || raceFinished || countdownActive)
        return;


    /* ACCELERATION */

    if (keys.up) {

        speed += acceleration * delta * 60;

    } else {

        speed -= friction * delta * 60;

    }


    /* BRAKE */

    if (keys.down) {

        speed -= braking * delta * 60;

    }


    /* NITRO */

    if (keys.nitro && nitro > 0 && speed > 0.2) {

        speed += 0.045 * delta * 60;

        nitro -= 0.7 * delta * 60;

    } else {

        nitro += 0.15 * delta * 60;

    }


    nitro = THREE.MathUtils.clamp(
        nitro,
        0,
        100
    );


    speed = THREE.MathUtils.clamp(
        speed,
        0,
        maxSpeed
    );


    /* STEERING */

    if (keys.left) {

        player.rotation.y +=
            steeringStrength *
            speed *
            delta *
            60;

    }

    if (keys.right) {

        player.rotation.y -=
            steeringStrength *
            speed *
            delta *
            60;

    }


    /* FORWARD MOVEMENT */

    const forward = new THREE.Vector3(
        Math.sin(player.rotation.y),
        0,
        -Math.cos(player.rotation.y)
    );

    player.position.addScaledVector(
        forward,
        speed * delta * 60
    );


    /* ROAD LIMIT */

    player.position.x = THREE.MathUtils.clamp(
        player.position.x,
        -7.8,
        7.8
    );


    /* TRACK WRAP */

    if (player.position.z < -130) {

        player.position.z = 100;

        lap++;

        if (lap > 3) {
            finishRace();
        }
    }


    distance += speed * delta * 60;

    raceTime += delta;
}


/* =========================================================
   AI UPDATE
========================================================= */

function updateAI(delta) {

    if (!gameStarted || raceFinished)
        return;

    aiCars.forEach((ai, index) => {

        ai.mesh.position.z -=
            ai.speed * delta * 60;

        ai.progress +=
            ai.speed * delta * 60;


        /* small movement */

        ai.mesh.position.x =
            Math.sin(ai.progress * 0.015 + index) * 3;


        if (ai.mesh.position.z < -130) {

            ai.mesh.position.z = 100;

            ai.mesh.position.x =
                index % 2 === 0 ? -3.5 : 3.5;
        }
    });
}


/* =========================================================
   CAMERA
========================================================= */

function updateCamera(delta) {

    const forward = new THREE.Vector3(
        Math.sin(player.rotation.y),
        0,
        -Math.cos(player.rotation.y)
    );


    const desiredPosition =
        player.position.clone()
            .addScaledVector(forward, -9);

    desiredPosition.y += 4.5;


    camera.position.lerp(
        desiredPosition,
        0.08
    );


    const lookTarget =
        player.position.clone()
            .addScaledVector(forward, 8);

    lookTarget.y += 1;


    camera.lookAt(lookTarget);
}


/* =========================================================
   POSITION
========================================================= */

function updatePosition() {

    const playerProgress =
        -player.position.z +
        (lap - 1) * 230;

    let position = 1;

    aiCars.forEach(ai => {

        const aiProgress =
            -ai.mesh.position.z;

        if (aiProgress > playerProgress) {
            position++;
        }
    });

    document.getElementById("position")
        .textContent =
        `${position} / ${aiCars.length + 1}`;
}


/* =========================================================
   HUD
========================================================= */

function updateHUD() {

    const kmh = Math.round(
        speed * 210
    );

    document.getElementById("speed-number")
        .textContent = kmh;

    document.getElementById("speed-fill")
        .style.width =
        `${Math.min(kmh / 210 * 100, 100)}%`;

    document.getElementById("nitro-fill")
        .style.width =
        `${nitro}%`;

    document.getElementById("nitro-percent")
        .textContent =
        `${Math.round(nitro)}%`;

    document.getElementById("lap")
        .textContent =
        `${Math.min(lap, 3)} / 3`;

    document.getElementById("timer")
        .textContent =
        formatTime(raceTime);
}


/* =========================================================
   TIME FORMAT
========================================================= */

function formatTime(seconds) {

    const minutes =
        Math.floor(seconds / 60);

    const secs =
        Math.floor(seconds % 60);

    const milliseconds =
        Math.floor(
            (seconds % 1) * 1000
        );

    return (
        String(minutes).padStart(2, "0") +
        ":" +
        String(secs).padStart(2, "0") +
        "." +
        String(milliseconds).padStart(3, "0")
    );
}


/* =========================================================
   FINISH
========================================================= */

function finishRace() {

    raceFinished = true;

    gameStarted = false;

    const finalPosition =
        document.getElementById("position")
            .textContent
            .split("/")[0]
            .trim();

    document.getElementById("final-position")
        .textContent =
        getOrdinal(parseInt(finalPosition));

    document.getElementById("final-time")
        .textContent =
        formatTime(raceTime);

    document
        .getElementById("finish-screen")
        .classList.remove("hidden");
}


function getOrdinal(number) {

    if (number === 1) return "1ST";
    if (number === 2) return "2ND";
    if (number === 3) return "3RD";

    return number + "TH";
}


/* =========================================================
   RESIZE
========================================================= */

window.addEventListener("resize", () => {

    camera.aspect =
        window.innerWidth /
        window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );
});


/* =========================================================
   GAME LOOP
========================================================= */

function animate(now) {

    requestAnimationFrame(animate);

    const delta =
        Math.min(
            (now - lastTime) / 1000,
            0.05
        );

    lastTime = now;


    updatePlayer(delta);
    updateAI(delta);
    updateCamera(delta);

    updatePosition();
    updateHUD();


    /* subtle camera shake with speed */

    if (speed > 0.7) {

        camera.position.y +=
            Math.sin(now * 0.025) *
            0.015;
    }


    renderer.render(
        scene,
        camera
    );
}


/* =========================================================
   START RENDER LOOP
========================================================= */

animate(performance.now());
