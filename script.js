/* =========================================================
   PROJECT 4 — NEON CIRCUIT
   3D RACING GAME — CIRCUIT UPDATE
========================================================= */

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x101722);

scene.fog = new THREE.Fog(
    0x101722,
    90,
    260
);


/* =========================================================
   CAMERA
========================================================= */

const camera = new THREE.PerspectiveCamera(
    68,
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

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type =
    THREE.PCFSoftShadowMap;

document
    .getElementById("game-container")
    .appendChild(renderer.domElement);


/* =========================================================
   LIGHTING
========================================================= */

const skyLight =
    new THREE.HemisphereLight(
        0xa9c8ff,
        0x172018,
        1.8
    );

scene.add(skyLight);


const sun =
    new THREE.DirectionalLight(
        0xffffff,
        2.2
    );

sun.position.set(
    50,
    90,
    30
);

sun.castShadow = true;

sun.shadow.mapSize.width = 2048;
sun.shadow.mapSize.height = 2048;

sun.shadow.camera.left = -120;
sun.shadow.camera.right = 120;
sun.shadow.camera.top = 120;
sun.shadow.camera.bottom = -120;

scene.add(sun);


/* =========================================================
   WORLD
========================================================= */

const world = new THREE.Group();

scene.add(world);


/* =========================================================
   GROUND
========================================================= */

const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(
        600,
        600
    ),
    new THREE.MeshStandardMaterial({
        color: 0x253329,
        roughness: 1
    })
);

ground.rotation.x = -Math.PI / 2;

ground.receiveShadow = true;

world.add(ground);


/* =========================================================
   TRACK
========================================================= */

/*
    TRACK SHAPE

        ┌───────────────┐
        │               │
        │               ▼
        │          ┌─────────┐
        │          │         │
        │          │         │
        │          └─────┐   │
        │                │   │
        └────────────────┘   │
                 START ──────┘
*/


const roadMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x25272b,
        roughness: 0.9
    });


const roadSegments = [];


/* ---------------------------------------------------------
   Straight road helper
--------------------------------------------------------- */

function createRoad(
    x,
    z,
    width,
    length,
    rotation = 0
) {

    const road = new THREE.Mesh(
        new THREE.BoxGeometry(
            width,
            0.12,
            length
        ),
        roadMaterial
    );

    road.position.set(
        x,
        0.04,
        z
    );

    road.rotation.y =
        rotation;

    road.receiveShadow = true;

    world.add(road);

    roadSegments.push(road);

    return road;
}


/* =========================================================
   MAIN CIRCUIT
========================================================= */

/* Start / finish straight */

createRoad(
    0,
    90,
    18,
    55
);


/* Top straight */

createRoad(
    0,
    10,
    18,
    100
);


/* Left vertical */

createRoad(
    -55,
    -30,
    18,
    65
);


/* Bottom straight */

createRoad(
    0,
    -70,
    18,
    100
);


/* Right vertical */

createRoad(
    55,
    10,
    18,
    120
);


/* Top connecting section */

createRoad(
    28,
    55,
    18,
    55,
    Math.PI / 2
);


/* Lower connecting section */

createRoad(
    -28,
    -50,
    18,
    55,
    Math.PI / 2
);


/* =========================================================
   CORNER PLATFORMS
========================================================= */

const cornerMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x25272b
    });


function createCorner(
    x,
    z
) {

    const corner =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                9,
                9,
                0.12,
                32,
                1,
                false,
                0,
                Math.PI / 2
            ),
            cornerMaterial
        );

    corner.rotation.x =
        -Math.PI / 2;

    corner.position.set(
        x,
        0.04,
        z
    );

    world.add(corner);
}


/* corners */

createCorner(
    28,
    55
);

createCorner(
    -28,
    -50
);


/* =========================================================
   ROAD MARKINGS
========================================================= */

const whiteMaterial =
    new THREE.MeshBasicMaterial({
        color: 0xffffff
    });


function createRoadLine(
    x,
    z,
    rotation = 0
) {

    const line =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                0.35,
                0.04,
                5
            ),
            whiteMaterial
        );

    line.position.set(
        x,
        0.11,
        z
    );

    line.rotation.y =
        rotation;

    world.add(line);
}


/* center markings */

for (
    let z = 105;
    z > -110;
    z -= 10
) {

    createRoadLine(
        0,
        z
    );
}


/* horizontal markings */

for (
    let x = -90;
    x < 90;
    x += 10
) {

    createRoadLine(
        x,
        -70,
        Math.PI / 2
    );
}


/* =========================================================
   CURB SYSTEM
========================================================= */

const curbRed =
    new THREE.MeshStandardMaterial({
        color: 0xd92d3f
    });

const curbWhite =
    new THREE.MeshStandardMaterial({
        color: 0xf0f0f0
    });


function createCurb(
    x,
    z,
    rotation = 0
) {

    const group =
        new THREE.Group();

    const size = 2;

    for (
        let i = -4;
        i <= 4;
        i++
    ) {

        const material =
            i % 2 === 0
                ? curbRed
                : curbWhite;

        const block =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    1.2,
                    0.25,
                    size
                ),
                material
            );

        block.position.x =
            i * 1.2;

        block.position.y =
            0.15;

        block.castShadow = true;

        group.add(block);
    }

    group.position.set(
        x,
        0,
        z
    );

    group.rotation.y =
        rotation;

    world.add(group);
}


/* =========================================================
   TRACK BARRIERS
========================================================= */

const barrierMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x383c44,
        metalness: 0.4,
        roughness: 0.5
    });


function createBarrier(
    x,
    z,
    width,
    rotation = 0
) {

    const barrier =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                width,
                0.9,
                0.5
            ),
            barrierMaterial
        );

    barrier.position.set(
        x,
        0.45,
        z
    );

    barrier.rotation.y =
        rotation;

    barrier.castShadow = true;

    world.add(barrier);
}


/* outer barriers */

createBarrier(
    -10,
    90,
    55
);

createBarrier(
    10,
    90,
    55
);

createBarrier(
    -10,
    -70,
    100
);

createBarrier(
    10,
    -70,
    100
);

createBarrier(
    -55,
    -65,
    60,
    Math.PI / 2
);

createBarrier(
    55,
    -30,
    100,
    Math.PI / 2
);


/* =========================================================
   BUILDINGS
========================================================= */

const buildingMaterials = [

    new THREE.MeshStandardMaterial({
        color: 0x303641
    }),

    new THREE.MeshStandardMaterial({
        color: 0x3c414d
    }),

    new THREE.MeshStandardMaterial({
        color: 0x272c35
    }),

    new THREE.MeshStandardMaterial({
        color: 0x474c57
    })
];


function createBuilding(
    x,
    z
) {

    const height =
        8 + Math.random() * 25;

    const width =
        5 + Math.random() * 8;

    const building =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                width,
                height,
                width
            ),
            buildingMaterials[
                Math.floor(
                    Math.random() *
                    buildingMaterials.length
                )
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


/* city blocks */

for (
    let i = 0;
    i < 80;
    i++
) {

    const side =
        Math.random() > 0.5
            ? 1
            : -1;

    const x =
        side *
        (85 + Math.random() * 45);

    const z =
        -120 +
        Math.random() * 240;

    createBuilding(
        x,
        z
    );
}


/* =========================================================
   TREES
========================================================= */

function createTree(
    x,
    z
) {

    const tree =
        new THREE.Group();


    const trunk =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.3,
                0.5,
                3
            ),
            new THREE.MeshStandardMaterial({
                color: 0x5b3c26
            })
        );

    trunk.position.y =
        1.5;


    const leaves =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                2.3,
                12,
                12
            ),
            new THREE.MeshStandardMaterial({
                color: 0x1b5a3a
            })
        );

    leaves.position.y =
        4;


    trunk.castShadow = true;
    leaves.castShadow = true;


    tree.add(trunk);
    tree.add(leaves);


    tree.position.set(
        x,
        0,
        z
    );


    world.add(tree);
}


for (
    let i = 0;
    i < 55;
    i++
) {

    const side =
        Math.random() > 0.5
            ? 1
            : -1;

    createTree(
        side *
        (16 + Math.random() * 15),

        -110 +
        Math.random() * 220
    );
}


/* =========================================================
   STREET LIGHTS
========================================================= */

function createStreetLight(
    x,
    z
) {

    const pole =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.12,
                0.18,
                6
            ),
            new THREE.MeshStandardMaterial({
                color: 0x555b65,
                metalness: 0.8
            })
        );

    pole.position.set(
        x,
        3,
        z
    );


    const lamp =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.35,
                12,
                12
            ),
            new THREE.MeshStandardMaterial({
                color: 0xbdeeff,
                emissive: 0x5ddfff,
                emissiveIntensity: 3
            })
        );

    lamp.position.set(
        x,
        6,
        z
    );


    world.add(pole);
    world.add(lamp);
}


for (
    let z = -105;
    z <= 105;
    z += 20
) {

    createStreetLight(
        -13,
        z
    );

    createStreetLight(
        13,
        z
    );
}


/* =========================================================
   CAR CREATION
========================================================= */

function createCar(
    color
) {

    const car =
        new THREE.Group();


    /* body */

    const bodyMaterial =
        new THREE.MeshStandardMaterial({
            color: color,
            metalness: 0.5,
            roughness: 0.3
        });


    const body =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                2.2,
                0.65,
                4.2
            ),
            bodyMaterial
        );

    body.position.y =
        0.7;

    body.castShadow = true;

    car.add(body);


    /* cabin */

    const cabin =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                1.55,
                0.55,
                1.9
            ),
            new THREE.MeshStandardMaterial({
                color: 0x10151c,
                metalness: 0.2,
                roughness: 0.15
            })
        );

    cabin.position.set(
        0,
        1.15,
        0.15
    );

    cabin.castShadow = true;

    car.add(cabin);


    /* headlights */

    const lights =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                1.8,
                0.18,
                0.25
            ),
            new THREE.MeshStandardMaterial({
                color: 0xffffff,
                emissive: 0xffffff,
                emissiveIntensity: 2
            })
        );

    lights.position.set(
        0,
        0.72,
        -2.08
    );

    car.add(lights);


    /* wheels */

    const wheelMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x070707,
            roughness: 0.9
        });


    const wheels = [
        [-1.05, 0.45, -1.35],
        [1.05, 0.45, -1.35],
        [-1.05, 0.45, 1.35],
        [1.05, 0.45, 1.35]
    ];


    wheels.forEach(
        position => {

            const wheel =
                new THREE.Mesh(
                    new THREE.CylinderGeometry(
                        0.45,
                        0.45,
                        0.3,
                        16
                    ),
                    wheelMaterial
                );

            wheel.rotation.z =
                Math.PI / 2;

            wheel.position.set(
                position[0],
                position[1],
                position[2]
            );

            wheel.castShadow = true;

            car.add(wheel);
        }
    );


    /* spoiler */

    const spoiler =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                2.3,
                0.15,
                0.45
            ),
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

const player =
    createCar(0x168fff);


/*
   Start line.
   Car faces toward negative Z.
*/

player.position.set(
    0,
    0,
    108
);

player.rotation.y =
    0;

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


const aiPositions = [
    [-3.5, 102],
    [3.5, 96],
    [-3.5, 90]
];


aiColors.forEach(
    (color, index) => {

        const car =
            createCar(color);

        car.position.set(
            aiPositions[index][0],
            0,
            aiPositions[index][1]
        );

        world.add(car);

        aiCars.push({
            mesh: car,
            speed:
                0.16 +
                Math.random() * 0.035,
            progress: 0
        });
    }
);


/* =========================================================
   START / FINISH
========================================================= */

const finishMaterial =
    new THREE.MeshBasicMaterial({
        color: 0xffffff
    });


const finishLine =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            18,
            0.05,
            3
        ),
        finishMaterial
    );

finishLine.position.set(
    0,
    0.11,
    108
);

world.add(finishLine);


/* =========================================================
   CHECKPOINTS
========================================================= */

const checkpoints = [
    { x: 0, z: 30 },
    { x: 55, z: 0 },
    { x: 0, z: -70 },
    { x: -55, z: 0 }
];

let currentCheckpoint = 0;


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

let lastTime =
    performance.now();


const maxSpeed = 1.05;

const acceleration =
    0.025;

const braking =
    0.055;

const friction =
    0.012;

const steeringStrength =
    0.045;


let keys = {
    up: false,
    down: false,
    left: false,
    right: false,
    nitro: false
};


/* =========================================================
   KEYBOARD
========================================================= */

window.addEventListener(
    "keydown",
    event => {

        const key =
            event.key.toLowerCase();


        if (
            key === "arrowup" ||
            key === "w"
        )
            keys.up = true;


        if (
            key === "arrowdown" ||
            key === "s"
        )
            keys.down = true;


        if (
            key === "arrowleft" ||
            key === "a"
        )
            keys.left = true;


        if (
            key === "arrowright" ||
            key === "d"
        )
            keys.right = true;


        if (event.code === "Space") {

            keys.nitro = true;

            event.preventDefault();
        }
    }
);


window.addEventListener(
    "keyup",
    event => {

        const key =
            event.key.toLowerCase();


        if (
            key === "arrowup" ||
            key === "w"
        )
            keys.up = false;


        if (
            key === "arrowdown" ||
            key === "s"
        )
            keys.down = false;


        if (
            key === "arrowleft" ||
            key === "a"
        )
            keys.left = false;


        if (
            key === "arrowright" ||
            key === "d"
        )
            keys.right = false;


        if (event.code === "Space")
            keys.nitro = false;
    }
);


/* =========================================================
   MOBILE
========================================================= */

function mobileButton(
    id,
    property
) {

    const button =
        document.getElementById(id);


    button.addEventListener(
        "touchstart",
        event => {

            event.preventDefault();

            keys[property] = true;
        },
        { passive: false }
    );


    button.addEventListener(
        "touchend",
        event => {

            event.preventDefault();

            keys[property] = false;
        },
        { passive: false }
    );


    button.addEventListener(
        "touchcancel",
        () => {

            keys[property] = false;
        }
    );
}


mobileButton(
    "left-btn",
    "left"
);

mobileButton(
    "right-btn",
    "right"
);

mobileButton(
    "accelerate-btn",
    "up"
);

mobileButton(
    "brake-btn",
    "down"
);

mobileButton(
    "nitro-btn",
    "nitro"
);


/* =========================================================
   START
========================================================= */

document
    .getElementById("start-button")
    .addEventListener(
        "click",
        startRace
    );


document
    .getElementById("restart-button")
    .addEventListener(
        "click",
        () => location.reload()
    );


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

    const element =
        document.getElementById(
            "countdown"
        );

    let count = 3;

    element.textContent =
        count;


    const interval =
        setInterval(
            () => {

                count--;


                if (count > 0) {

                    element.textContent =
                        count;

                } else {

                    element.textContent =
                        "GO!";


                    setTimeout(
                        () => {

                            element.textContent =
                                "";

                            countdownActive =
                                false;

                            gameStarted =
                                true;

                        },
                        700
                    );


                    clearInterval(
                        interval
                    );
                }

            },
            1000
        );
}


/* =========================================================
   PLAYER UPDATE
========================================================= */

function updatePlayer(delta) {

    if (
        !gameStarted ||
        raceFinished ||
        countdownActive
    )
        return;


    /* acceleration */

    if (keys.up) {

        speed +=
            acceleration *
            delta *
            60;

    } else {

        speed -=
            friction *
            delta *
            60;
    }


    /* brake */

    if (keys.down) {

        speed -=
            braking *
            delta *
            60;
    }


    /* nitro */

    if (
        keys.nitro &&
        nitro > 0 &&
        speed > 0.2
    ) {

        speed +=
            0.045 *
            delta *
            60;

        nitro -=
            0.7 *
            delta *
            60;

    } else {

        nitro +=
            0.15 *
            delta *
            60;
    }


    nitro =
        THREE.MathUtils.clamp(
            nitro,
            0,
            100
        );


    speed =
        THREE.MathUtils.clamp(
            speed,
            0,
            maxSpeed
        );


    /* steering */

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


    /* movement */

    const forward =
        new THREE.Vector3(
            Math.sin(
                player.rotation.y
            ),
            0,
            -Math.cos(
                player.rotation.y
            )
        );


    player.position.addScaledVector(
        forward,
        speed *
        delta *
        60
    );


    /*
       Keep the player within
       the general circuit area.
    */

    player.position.x =
        THREE.MathUtils.clamp(
            player.position.x,
            -72,
            72
        );


    player.position.z =
        THREE.MathUtils.clamp(
            player.position.z,
            -125,
            115
        );


    raceTime += delta;


    checkLap();
}


/* =========================================================
   LAP / CHECKPOINT SYSTEM
========================================================= */

function checkLap() {

    const checkpoint =
        checkpoints[
            currentCheckpoint
        ];


    const distance =
        Math.hypot(
            player.position.x -
                checkpoint.x,

            player.position.z -
                checkpoint.z
        );


    if (distance < 12) {

        currentCheckpoint++;


        if (
            currentCheckpoint >=
            checkpoints.length
        ) {

            currentCheckpoint = 0;

            lap++;


            if (lap > 3) {

                finishRace();
            }
        }
    }
}


/* =========================================================
   AI
========================================================= */

function updateAI(delta) {

    if (
        !gameStarted ||
        raceFinished
    )
        return;


    aiCars.forEach(
        (ai, index) => {

            ai.progress +=
                ai.speed *
                delta *
                60;


            /*
               Approximate circuit movement.
            */

            const t =
                ai.progress;


            if (t < 130) {

                ai.mesh.position.z =
                    105 - t;

                ai.mesh.position.x =
                    index % 2 === 0
                        ? -3.5
                        : 3.5;

                ai.mesh.rotation.y =
                    0;

            } else if (t < 230) {

                const p =
                    t - 130;

                ai.mesh.position.x =
                    3.5 +
                    p * 0.52;

                ai.mesh.position.z =
                    -25;

                ai.mesh.rotation.y =
                    -Math.PI / 2;

            } else if (t < 350) {

                const p =
                    t - 230;

                ai.mesh.position.x =
                    55;

                ai.mesh.position.z =
                    -25 +
                    p * 0.65;

                ai.mesh.rotation.y =
                    Math.PI;

            } else {

                ai.progress = 0;
            }
        }
    );
}


/* =========================================================
   CHASE CAMERA
========================================================= */

const cameraTarget =
    new THREE.Vector3();


function updateCamera(delta) {

    /*
       Direction the car is facing.
    */

    const forward =
        new THREE.Vector3(
            Math.sin(
                player.rotation.y
            ),
            0,
            -Math.cos(
                player.rotation.y
            )
        );


    /*
       Camera sits behind
       and above the car.
    */

    const desired =
        player.position
            .clone()
            .addScaledVector(
                forward,
                -10
            );


    desired.y += 5.2;


    /*
       Smooth camera movement.
    */

    camera.position.lerp(
        desired,
        0.075
    );


    /*
       Camera looks ahead
       of the car.
    */

    cameraTarget.copy(
        player.position
    );

    cameraTarget.addScaledVector(
        forward,
        10
    );

    cameraTarget.y += 1;


    camera.lookAt(
        cameraTarget
    );
}


/* =========================================================
   POSITION
========================================================= */

function getPlayerProgress() {

    return (
        lap * 1000 -
        player.position.z
    );
}


function updatePosition() {

    const playerProgress =
        getPlayerProgress();


    let position = 1;


    aiCars.forEach(
        ai => {

            const aiProgress =
                ai.progress;


            if (
                aiProgress >
                playerProgress
            ) {

                position++;
            }
        }
    );


    document
        .getElementById(
            "position"
        )
        .textContent =
        `${position} / ${aiCars.length + 1}`;
}


/* =========================================================
   HUD
========================================================= */

function updateHUD() {

    const kmh =
        Math.round(
            speed * 210
        );


    document
        .getElementById(
            "speed-number"
        )
        .textContent =
        kmh;


    document
        .getElementById(
            "speed-fill"
        )
        .style.width =
        `${Math.min(
            kmh / 210 * 100,
            100
        )}%`;


    document
        .getElementById(
            "nitro-fill"
        )
        .style.width =
        `${nitro}%`;


    document
        .getElementById(
            "nitro-percent"
        )
        .textContent =
        `${Math.round(nitro)}%`;


    document
        .getElementById(
            "lap"
        )
        .textContent =
        `${Math.min(lap, 3)} / 3`;


    document
        .getElementById(
            "timer"
        )
        .textContent =
        formatTime(raceTime);
}


/* =========================================================
   TIME
========================================================= */

function formatTime(
    seconds
) {

    const minutes =
        Math.floor(
            seconds / 60
        );

    const secs =
        Math.floor(
            seconds % 60
        );

    const milliseconds =
        Math.floor(
            (seconds % 1) * 1000
        );


    return (
        String(minutes)
            .padStart(2, "0") +

        ":" +

        String(secs)
            .padStart(2, "0") +

        "." +

        String(milliseconds)
            .padStart(3, "0")
    );
}


/* =========================================================
   FINISH
========================================================= */

function finishRace() {

    raceFinished = true;

    gameStarted = false;


    const position =
        document
            .getElementById(
                "position"
            )
            .textContent
            .split("/")[0]
            .trim();


    document
        .getElementById(
            "final-position"
        )
        .textContent =
        getOrdinal(
            parseInt(position)
        );


    document
        .getElementById(
            "final-time"
        )
        .textContent =
        formatTime(
            raceTime
        );


    document
        .getElementById(
            "finish-screen"
        )
        .classList
        .remove("hidden");
}


function getOrdinal(
    number
) {

    if (number === 1)
        return "1ST";

    if (number === 2)
        return "2ND";

    if (number === 3)
        return "3RD";

    return number + "TH";
}


/* =========================================================
   RESIZE
========================================================= */

window.addEventListener(
    "resize",
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        camera.updateProjectionMatrix();


        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );
    }
);


/* =========================================================
   GAME LOOP
========================================================= */

function animate(now) {

    requestAnimationFrame(
        animate
    );


    const delta =
        Math.min(
            (now - lastTime) /
                1000,
            0.05
        );


    lastTime = now;


    updatePlayer(delta);

    updateAI(delta);

    updateCamera(delta);

    updatePosition();

    updateHUD();


    /*
       Small camera vibration
       at high speed.
    */

    if (speed > 0.75) {

        camera.position.y +=
            Math.sin(
                now * 0.025
            ) * 0.018;
    }


    renderer.render(
        scene,
        camera
    );
}


/* =========================================================
   START
========================================================= */

animate(
    performance.now()
);
