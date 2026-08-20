/* =========================================================
   PROJECT 4 — NEON CIRCUIT
   REAL CURVED 3D TRACK
========================================================= */

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x101722);

scene.fog = new THREE.Fog(
    0x101722,
    90,
    300
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

const ambient =
    new THREE.HemisphereLight(
        0xb9d7ff,
        0x182016,
        1.7
    );

scene.add(ambient);


const sun =
    new THREE.DirectionalLight(
        0xffffff,
        2.3
    );

sun.position.set(
    60,
    100,
    40
);

sun.castShadow = true;

sun.shadow.mapSize.width = 2048;
sun.shadow.mapSize.height = 2048;

scene.add(sun);


/* =========================================================
   WORLD
========================================================= */

const world =
    new THREE.Group();

scene.add(world);


/* =========================================================
   GROUND
========================================================= */

const ground =
    new THREE.Mesh(
        new THREE.PlaneGeometry(
            700,
            700
        ),
        new THREE.MeshStandardMaterial({
            color: 0x26362b,
            roughness: 1
        })
    );

ground.rotation.x =
    -Math.PI / 2;

ground.receiveShadow = true;

world.add(ground);


/* =========================================================
   TRACK CURVE
========================================================= */

/*
                 ┌───────────────┐
              ┌──┘               └──┐
            /                         \
           /                           \
          │                             │
          │                             │
          │                             │
           \                           /
            └──┐                   ┌──┘
               └───────START──────┘

       A proper closed racing circuit.
*/

const trackPoints = [

    new THREE.Vector3(0, 0, 110),

    new THREE.Vector3(55, 0, 105),

    new THREE.Vector3(92, 0, 75),

    new THREE.Vector3(100, 0, 15),

    new THREE.Vector3(88, 0, -45),

    new THREE.Vector3(50, 0, -85),

    new THREE.Vector3(0, 0, -105),

    new THREE.Vector3(-50, 0, -85),

    new THREE.Vector3(-88, 0, -45),

    new THREE.Vector3(-100, 0, 15),

    new THREE.Vector3(-92, 0, 75),

    new THREE.Vector3(-55, 0, 105)
];


const trackCurve =
    new THREE.CatmullRomCurve3(
        trackPoints,
        true,
        "catmullrom",
        0.45
    );


/* =========================================================
   TRACK PARAMETERS
========================================================= */

const TRACK_WIDTH = 18;

const TRACK_SEGMENTS = 320;


/* =========================================================
   TRACK ROAD MESH
========================================================= */

const roadGeometry =
    new THREE.BufferGeometry();

const roadVertices = [];
const roadIndices = [];
const roadUVs = [];


for (
    let i = 0;
    i <= TRACK_SEGMENTS;
    i++
) {

    const t =
        i / TRACK_SEGMENTS;

    const point =
        trackCurve.getPointAt(t);

    const tangent =
        trackCurve
            .getTangentAt(t)
            .normalize();


    /*
       Perpendicular vector
       on the XZ plane.
    */

    const side =
        new THREE.Vector3(
            -tangent.z,
            0,
            tangent.x
        ).normalize();


    const left =
        point.clone()
            .addScaledVector(
                side,
                TRACK_WIDTH / 2
            );


    const right =
        point.clone()
            .addScaledVector(
                side,
                -TRACK_WIDTH / 2
            );


    left.y = 0.08;
    right.y = 0.08;


    roadVertices.push(
        left.x,
        left.y,
        left.z,

        right.x,
        right.y,
        right.z
    );


    roadUVs.push(
        0,
        t * 30,

        1,
        t * 30
    );
}


for (
    let i = 0;
    i < TRACK_SEGMENTS;
    i++
) {

    const a = i * 2;
    const b = a + 1;
    const c = a + 2;
    const d = a + 3;


    roadIndices.push(
        a, b, c,
        b, d, c
    );
}


roadGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(
        roadVertices,
        3
    )
);

roadGeometry.setAttribute(
    "uv",
    new THREE.Float32BufferAttribute(
        roadUVs,
        2
    )
);

roadGeometry.setIndex(
    roadIndices
);

roadGeometry.computeVertexNormals();


const road =
    new THREE.Mesh(
        roadGeometry,
        new THREE.MeshStandardMaterial({
            color: 0x24272b,
            roughness: 0.92,
            metalness: 0.05
        })
    );

road.receiveShadow = true;

world.add(road);


/* =========================================================
   TRACK CENTER DASHES
========================================================= */

const dashMaterial =
    new THREE.MeshBasicMaterial({
        color: 0xf2f2f2
    });


for (
    let i = 0;
    i < 160;
    i++
) {

    if (i % 2 === 0)
        continue;


    const t =
        i / 160;


    const point =
        trackCurve.getPointAt(t);


    const tangent =
        trackCurve
            .getTangentAt(t)
            .normalize();


    const dash =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                0.35,
                0.045,
                4
            ),
            dashMaterial
        );


    dash.position.copy(point);

    dash.position.y =
        0.13;


    dash.rotation.y =
        Math.atan2(
            tangent.x,
            tangent.z
        );


    world.add(dash);
}


/* =========================================================
   CURBS
========================================================= */

const curbRed =
    new THREE.MeshStandardMaterial({
        color: 0xd82e43,
        roughness: 0.8
    });


const curbWhite =
    new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.8
    });


function createCurbSegment(
    t,
    sideSign,
    index
) {

    const point =
        trackCurve.getPointAt(t);


    const tangent =
        trackCurve
            .getTangentAt(t)
            .normalize();


    const side =
        new THREE.Vector3(
            -tangent.z,
            0,
            tangent.x
        ).normalize();


    point.addScaledVector(
        side,
        sideSign *
        (TRACK_WIDTH / 2 + 0.8)
    );


    const curb =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                1.4,
                0.18,
                2.8
            ),
            index % 2 === 0
                ? curbRed
                : curbWhite
        );


    curb.position.copy(point);

    curb.position.y =
        0.15;


    curb.rotation.y =
        Math.atan2(
            tangent.x,
            tangent.z
        );


    curb.castShadow = true;

    world.add(curb);
}


for (
    let i = 0;
    i < 160;
    i++
) {

    const t =
        i / 160;

    createCurbSegment(
        t,
        1,
        i
    );

    createCurbSegment(
        t,
        -1,
        i
    );
}


/* =========================================================
   OUTER BARRIERS
========================================================= */

const barrierMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x3c424b,
        metalness: 0.5,
        roughness: 0.45
    });


function createBarrier(
    t,
    sideSign
) {

    const point =
        trackCurve.getPointAt(t);


    const tangent =
        trackCurve
            .getTangentAt(t)
            .normalize();


    const side =
        new THREE.Vector3(
            -tangent.z,
            0,
            tangent.x
        ).normalize();


    point.addScaledVector(
        side,
        sideSign *
        (TRACK_WIDTH / 2 + 2.1)
    );


    const barrier =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                0.45,
                0.9,
                3
            ),
            barrierMaterial
        );


    barrier.position.copy(point);

    barrier.position.y =
        0.45;


    barrier.rotation.y =
        Math.atan2(
            tangent.x,
            tangent.z
        );


    barrier.castShadow = true;

    world.add(barrier);
}


for (
    let i = 0;
    i < 160;
    i++
) {

    const t =
        i / 160;

    createBarrier(t, 1);
    createBarrier(t, -1);
}


/* =========================================================
   START / FINISH LINE
========================================================= */

const startLine =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            TRACK_WIDTH,
            0.06,
            5
        ),
        new THREE.MeshBasicMaterial({
            color: 0xffffff
        })
    );


const startPoint =
    trackCurve.getPointAt(0);


const startTangent =
    trackCurve
        .getTangentAt(0)
        .normalize();


startLine.position.copy(
    startPoint
);

startLine.position.y =
    0.16;


startLine.rotation.y =
    Math.atan2(
        startTangent.x,
        startTangent.z
    );


world.add(startLine);


/* =========================================================
   CHECKERED START LINE
========================================================= */

const tileSize = 1.5;

for (
    let row = 0;
    row < 2;
    row++
) {

    for (
        let col = -6;
        col < 6;
        col++
    ) {

        const tile =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    tileSize,
                    0.065,
                    2.5
                ),
                new THREE.MeshBasicMaterial({
                    color:
                        (row + col) % 2 === 0
                            ? 0xffffff
                            : 0x111111
                })
            );


        const side =
            new THREE.Vector3(
                -startTangent.z,
                0,
                startTangent.x
            ).normalize();


        tile.position.copy(
            startPoint
        );


        tile.position.addScaledVector(
            side,
            col * tileSize
        );


        tile.position.y =
            0.18;


        tile.rotation.y =
            Math.atan2(
                startTangent.x,
                startTangent.z
            );


        world.add(tile);
    }
}


/* =========================================================
   BUILDINGS
========================================================= */

const buildingMaterials = [

    new THREE.MeshStandardMaterial({
        color: 0x303641
    }),

    new THREE.MeshStandardMaterial({
        color: 0x3e4450
    }),

    new THREE.MeshStandardMaterial({
        color: 0x242a33
    }),

    new THREE.MeshStandardMaterial({
        color: 0x4a505b
    })
];


function createBuilding(
    x,
    z
) {

    const height =
        8 +
        Math.random() * 28;


    const width =
        6 +
        Math.random() * 9;


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


/*
   Buildings are placed
   outside the circuit.
*/

for (
    let i = 0;
    i < 90;
    i++
) {

    const angle =
        Math.random() *
        Math.PI * 2;


    const radius =
        125 +
        Math.random() * 80;


    createBuilding(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius
    );
}


/* =========================================================
   TREES
========================================================= */

function createTree(
    x,
    z
) {

    const group =
        new THREE.Group();


    const trunk =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.3,
                0.45,
                3
            ),
            new THREE.MeshStandardMaterial({
                color: 0x5a3b25
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
                color: 0x19563a
            })
        );


    leaves.position.y =
        4;


    trunk.castShadow = true;
    leaves.castShadow = true;


    group.add(trunk);
    group.add(leaves);


    group.position.set(
        x,
        0,
        z
    );


    world.add(group);
}


for (
    let i = 0;
    i < 70;
    i++
) {

    const angle =
        Math.random() *
        Math.PI * 2;


    const radius =
        55 +
        Math.random() * 60;


    createTree(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius
    );
}


/* =========================================================
   STREET LIGHTS
========================================================= */

function createStreetLight(
    t
) {

    const point =
        trackCurve.getPointAt(t);


    const tangent =
        trackCurve
            .getTangentAt(t)
            .normalize();


    const side =
        new THREE.Vector3(
            -tangent.z,
            0,
            tangent.x
        ).normalize();


    point.addScaledVector(
        side,
        13
    );


    const pole =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.12,
                0.18,
                6
            ),
            new THREE.MeshStandardMaterial({
                color: 0x555b64,
                metalness: 0.8
            })
        );


    pole.position.copy(point);

    pole.position.y =
        3;


    const lamp =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.35,
                12,
                12
            ),
            new THREE.MeshStandardMaterial({
                color: 0xbef4ff,
                emissive: 0x5edfff,
                emissiveIntensity: 3
            })
        );


    lamp.position.copy(point);

    lamp.position.y =
        6;


    world.add(pole);
    world.add(lamp);
}


for (
    let i = 0;
    i < 24;
    i++
) {

    createStreetLight(
        i / 24
    );
}


/* =========================================================
   CAR
========================================================= */

function createCar(
    color
) {

    const car =
        new THREE.Group();


    /* body */

    const bodyMaterial =
        new THREE.MeshStandardMaterial({
            color,
            metalness: 0.55,
            roughness: 0.28
        });


    const body =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                2.25,
                0.65,
                4.25
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
                1.85
            ),
            new THREE.MeshStandardMaterial({
                color: 0x0b1119,
                metalness: 0.2,
                roughness: 0.15
            })
        );


    cabin.position.set(
        0,
        1.15,
        0.1
    );


    cabin.castShadow = true;

    car.add(cabin);


    /* headlights */

    const headlights =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                1.85,
                0.18,
                0.22
            ),
            new THREE.MeshStandardMaterial({
                color: 0xffffff,
                emissive: 0xffffff,
                emissiveIntensity: 2
            })
        );


    headlights.position.set(
        0,
        0.72,
        -2.12
    );


    car.add(headlights);


    /* wheels */

    const wheelMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x050505,
            roughness: 0.9
        });


    const wheels = [

        [-1.05, 0.45, -1.35],
        [1.05, 0.45, -1.35],

        [-1.05, 0.45, 1.35],
        [1.05, 0.45, 1.35]

    ];


    wheels.forEach(
        pos => {

            const wheel =
                new THREE.Mesh(
                    new THREE.CylinderGeometry(
                        0.45,
                        0.45,
                        0.32,
                        18
                    ),
                    wheelMaterial
                );


            wheel.rotation.z =
                Math.PI / 2;


            wheel.position.set(
                pos[0],
                pos[1],
                pos[2]
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
                0.16,
                0.45
            ),
            bodyMaterial
        );


    spoiler.position.set(
        0,
        1.35,
        1.75
    );


    car.add(spoiler);


    /* exhaust */

    const exhaust =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.14,
                0.14,
                0.35,
                12
            ),
            new THREE.MeshStandardMaterial({
                color: 0x111111,
                metalness: 0.8
            })
        );


    exhaust.rotation.x =
        Math.PI / 2;


    exhaust.position.set(
        0,
        0.55,
        2.12
    );


    car.add(exhaust);


    return car;
}


/* =========================================================
   PLAYER
========================================================= */

const player =
    createCar(0x168fff);

world.add(player);


/* =========================================================
   AI
========================================================= */

const aiCars = [];

const aiColors = [
    0xff304f,
    0xffb52e,
    0xa855f7
];


const aiOffsets = [
    -3.2,
    3.2,
    -3.2
];


const aiStartT = [
    0.985,
    0.965,
    0.945
];


aiColors.forEach(
    (color, index) => {

        const car =
            createCar(color);


        world.add(car);


        aiCars.push({
            mesh: car,
            t: aiStartT[index],
            speed:
                0.00014 +
                Math.random() * 0.000025,
            offset:
                aiOffsets[index]
        });
    }
);


/* =========================================================
   PLAYER TRACK POSITION
========================================================= */

let playerT = 0;


/*
   Lateral position from
   center of track.
*/

let lateralOffset = 0;


/* =========================================================
   GAME STATE
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


const MAX_SPEED = 1.05;

const ACCELERATION = 0.025;

const BRAKE = 0.055;

const FRICTION = 0.012;

const STEERING = 0.08;


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


        if (
            event.code === "Space"
        ) {

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


        if (
            event.code === "Space"
        )
            keys.nitro = false;
    }
);


/* =========================================================
   MOBILE INPUT
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
   START BUTTON
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
        .classList
        .add("hidden");


    countdownActive = true;

    runCountdown();
}


/* =========================================================
   COUNTDOWN
========================================================= */

function runCountdown() {

    const display =
        document.getElementById(
            "countdown"
        );


    let count = 3;

    display.textContent =
        count;


    const timer =
        setInterval(
            () => {

                count--;


                if (count > 0) {

                    display.textContent =
                        count;

                } else {

                    display.textContent =
                        "GO!";


                    setTimeout(
                        () => {

                            display.textContent =
                                "";

                            countdownActive =
                                false;

                            gameStarted =
                                true;

                        },
                        700
                    );


                    clearInterval(timer);
                }

            },
            1000
        );
}


/* =========================================================
   PLAYER MOVEMENT
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
            ACCELERATION *
            delta *
            60;

    } else {

        speed -=
            FRICTION *
            delta *
            60;
    }


    /* braking */

    if (keys.down) {

        speed -=
            BRAKE *
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
            0.75 *
            delta *
            60;

    } else {

        nitro +=
            0.14 *
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
            MAX_SPEED
        );


    /*
       Steering changes
       lateral position.
    */

    if (keys.left) {

        lateralOffset -=
            STEERING *
            speed *
            delta *
            60;
    }


    if (keys.right) {

        lateralOffset +=
            STEERING *
            speed *
            delta *
            60;
    }


    lateralOffset =
        THREE.MathUtils.clamp(
            lateralOffset,
            -6.2,
            6.2
        );


    /*
       Move around track.
    */

    playerT +=
        speed *
        delta *
        0.00095;


    /*
       Lap complete.
    */

    if (playerT >= 1) {

        playerT -= 1;

        lap++;


        if (lap > 3) {

            finishRace();

            return;
        }
    }


    /*
       Position car on track.
    */

    positionPlayerOnTrack();


    raceTime += delta;
}


/* =========================================================
   POSITION PLAYER ON TRACK
========================================================= */

function positionPlayerOnTrack() {

    const point =
        trackCurve.getPointAt(
            playerT
        );


    const tangent =
        trackCurve
            .getTangentAt(playerT)
            .normalize();


    const side =
        new THREE.Vector3(
            -tangent.z,
            0,
            tangent.x
        ).normalize();


    player.position.copy(point);


    player.position.addScaledVector(
        side,
        lateralOffset
    );


    player.position.y =
        0.05;


    /*
       Car faces forward
       along the track.
    */

    player.rotation.y =
        Math.atan2(
            tangent.x,
            tangent.z
        );
}


/* =========================================================
   AI UPDATE
========================================================= */

function updateAI(delta) {

    if (
        !gameStarted ||
        raceFinished
    )
        return;


    aiCars.forEach(
        ai => {

            ai.t +=
                ai.speed *
                delta *
                60;


            if (ai.t >= 1)
                ai.t -= 1;


            const point =
                trackCurve.getPointAt(
                    ai.t
                );


            const tangent =
                trackCurve
                    .getTangentAt(ai.t)
                    .normalize();


            const side =
                new THREE.Vector3(
                    -tangent.z,
                    0,
                    tangent.x
                ).normalize();


            ai.mesh.position.copy(
                point
            );


            ai.mesh.position
                .addScaledVector(
                    side,
                    ai.offset
                );


            ai.mesh.position.y =
                0.05;


            ai.mesh.rotation.y =
                Math.atan2(
                    tangent.x,
                    tangent.z
                );
        }
    );
}


/* =========================================================
   CAMERA
========================================================= */

const cameraPosition =
    new THREE.Vector3();


const cameraLookAt =
    new THREE.Vector3();


function updateCamera(delta) {

    const tangent =
        trackCurve
            .getTangentAt(playerT)
            .normalize();


    /*
       Camera behind the car.
    */

    cameraPosition
        .copy(player.position)
        .addScaledVector(
            tangent,
            -11
        );


    /*
       Camera height.
    */

    cameraPosition.y +=
        5.5;


    /*
       Smooth movement.
    */

    camera.position.lerp(
        cameraPosition,
        0.09
    );


    /*
       Look ahead.
    */

    cameraLookAt
        .copy(player.position)
        .addScaledVector(
            tangent,
            12
        );


    cameraLookAt.y +=
        1.1;


    camera.lookAt(
        cameraLookAt
    );
}


/* =========================================================
   POSITION / RANK
========================================================= */

function getProgress(
    t
) {

    return t;
}


function updatePosition() {

    let position = 1;


    aiCars.forEach(
        ai => {

            if (
                getProgress(ai.t) >
                getProgress(playerT)
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
        formatTime(
            raceTime
        );
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
            (seconds % 1) *
            1000
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
       Speed vibration.
    */

    if (speed > 0.75) {

        camera.position.y +=
            Math.sin(
                now * 0.03
            ) * 0.018;
    }


    renderer.render(
        scene,
        camera
    );
}


/* =========================================================
   INITIAL POSITION
========================================================= */

positionPlayerOnTrack();


/* =========================================================
   START ENGINE
========================================================= */

animate(
    performance.now()
);
