/* =========================================================
   PROJECT 4 — NEON CIRCUIT
   CURVED TRACK + KEYBOARD CONTROLS
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

scene.add(
    new THREE.HemisphereLight(
        0xb9d7ff,
        0x182016,
        1.7
    )
);


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
   TRACK
========================================================= */

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


const TRACK_WIDTH = 18;

const TRACK_SEGMENTS = 360;


/* =========================================================
   ROAD
========================================================= */

const roadGeometry =
    new THREE.BufferGeometry();

const vertices = [];
const indices = [];
const uvs = [];


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


    vertices.push(
        left.x,
        left.y,
        left.z,

        right.x,
        right.y,
        right.z
    );


    uvs.push(
        0,
        i / 10,

        1,
        i / 10
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


    indices.push(
        a, b, c,
        b, d, c
    );
}


roadGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(
        vertices,
        3
    )
);

roadGeometry.setAttribute(
    "uv",
    new THREE.Float32BufferAttribute(
        uvs,
        2
    )
);

roadGeometry.setIndex(indices);

roadGeometry.computeVertexNormals();


const road =
    new THREE.Mesh(
        roadGeometry,
        new THREE.MeshStandardMaterial({
            color: 0x25272b,
            roughness: 0.92
        })
    );

road.receiveShadow = true;

world.add(road);


/* =========================================================
   CENTER ROAD MARKINGS
========================================================= */

const markingMaterial =
    new THREE.MeshBasicMaterial({
        color: 0xffffff
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


    const marking =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                0.35,
                0.05,
                4
            ),
            markingMaterial
        );


    marking.position.copy(point);

    marking.position.y =
        0.14;


    marking.rotation.y =
        Math.atan2(
            tangent.x,
            tangent.z
        );


    world.add(marking);
}


/* =========================================================
   CURBS
========================================================= */

const redCurb =
    new THREE.MeshStandardMaterial({
        color: 0xd82e43
    });

const whiteCurb =
    new THREE.MeshStandardMaterial({
        color: 0xffffff
    });


function createCurb(
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
                0.2,
                2.8
            ),
            index % 2 === 0
                ? redCurb
                : whiteCurb
        );


    curb.position.copy(point);

    curb.position.y =
        0.16;


    curb.rotation.y =
        Math.atan2(
            tangent.x,
            tangent.z
        );


    world.add(curb);
}


for (
    let i = 0;
    i < 180;
    i++
) {

    const t =
        i / 180;


    createCurb(
        t,
        1,
        i
    );

    createCurb(
        t,
        -1,
        i
    );
}


/* =========================================================
   BARRIERS
========================================================= */

const barrierMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x3d434d,
        metalness: 0.5,
        roughness: 0.5
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
        (TRACK_WIDTH / 2 + 2.2)
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
    i < 180;
    i++
) {

    const t =
        i / 180;

    createBarrier(t, 1);
    createBarrier(t, -1);
}


/* =========================================================
   START / FINISH
========================================================= */

const startPoint =
    trackCurve.getPointAt(0);


const startTangent =
    trackCurve
        .getTangentAt(0)
        .normalize();


const finishLine =
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


finishLine.position.copy(
    startPoint
);

finishLine.position.y =
    0.17;


finishLine.rotation.y =
    Math.atan2(
        startTangent.x,
        startTangent.z
    );


world.add(finishLine);


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

    world.add(building);
}


for (
    let i = 0;
    i < 80;
    i++
) {

    const angle =
        Math.random() *
        Math.PI * 2;


    const radius =
        125 +
        Math.random() * 70;


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

    const tree =
        new THREE.Group();


    const trunk =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.3,
                0.45,
                3
            ),
            new THREE.MeshStandardMaterial({
                color: 0x593b25
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


    tree.add(
        trunk,
        leaves
    );


    tree.position.set(
        x,
        0,
        z
    );


    world.add(tree);
}


for (
    let i = 0;
    i < 60;
    i++
) {

    const angle =
        Math.random() *
        Math.PI * 2;


    const radius =
        45 +
        Math.random() * 65;


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


    world.add(
        pole,
        lamp
    );
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


    const bodyMaterial =
        new THREE.MeshStandardMaterial({
            color: color,
            metalness: 0.55,
            roughness: 0.28
        });


    /* body */

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
                metalness: 0.25,
                roughness: 0.15
            })
        );


    cabin.position.set(
        0,
        1.15,
        0.1
    );


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


    const wheelPositions = [

        [-1.05, 0.45, -1.35],
        [1.05, 0.45, -1.35],

        [-1.05, 0.45, 1.35],
        [1.05, 0.45, 1.35]

    ];


    wheelPositions.forEach(
        position => {

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


    return car;
}


/* =========================================================
   PLAYER
========================================================= */

const player =
    createCar(0x168fff);

world.add(player);


let playerT = 0;

let lateralOffset = 0;


/* =========================================================
   AI
========================================================= */

const aiCars = [];

const aiColors = [
    0xff304f,
    0xffb52e,
    0xa855f7
];


const aiData = [
    {
        t: 0.975,
        offset: -3.3,
        speed: 0.00055
    },

    {
        t: 0.955,
        offset: 3.3,
        speed: 0.00052
    },

    {
        t: 0.935,
        offset: -3.3,
        speed: 0.00050
    }
];


aiColors.forEach(
    (color, index) => {

        const car =
            createCar(color);

        world.add(car);

        aiCars.push({
            mesh: car,
            ...aiData[index]
        });
    }
);


/* =========================================================
   GAME VARIABLES
========================================================= */

let gameStarted = false;

let raceFinished = false;

let countdownActive = false;

let paused = false;

let speed = 0;

let nitro = 100;

let lap = 1;

let raceTime = 0;

let lastTime =
    performance.now();


const MAX_SPEED = 1.05;

const ACCELERATION = 0.040;

const BRAKE = 0.070;

const FRICTION = 0.018;


/*
   IMPORTANT:
   This controls how quickly
   the car travels around
   the actual track.
*/

const TRACK_SPEED = 0.055;


/*
   Steering speed.
*/

const STEERING_SPEED = 0.095;


/* =========================================================
   KEYBOARD STATE
========================================================= */

const keys = {
    accelerate: false,
    brake: false,
    left: false,
    right: false,
    nitro: false
};


/* =========================================================
   KEYBOARD CONTROL
========================================================= */

window.addEventListener(
    "keydown",
    event => {

        /*
           Prevent browser scrolling
           when using arrow keys.
        */

        if (
            [
                "ArrowUp",
                "ArrowDown",
                "ArrowLeft",
                "ArrowRight",
                " "
            ].includes(event.key)
        ) {

            event.preventDefault();
        }


        const key =
            event.key.toLowerCase();


        /* ACCELERATE */

        if (
            key === "w" ||
            event.key === "ArrowUp"
        ) {

            keys.accelerate = true;
        }


        /* BRAKE */

        if (
            key === "s" ||
            event.key === "ArrowDown"
        ) {

            keys.brake = true;
        }


        /* LEFT */

        if (
            key === "a" ||
            event.key === "ArrowLeft"
        ) {

            keys.left = true;
        }


        /* RIGHT */

        if (
            key === "d" ||
            event.key === "ArrowRight"
        ) {

            keys.right = true;
        }


        /* NITRO */

        if (
            event.code === "Space"
        ) {

            keys.nitro = true;
        }


        /* RESTART */

        if (
            key === "r"
        ) {

            location.reload();
        }


        /* PAUSE */

        if (
            key === "p"
        ) {

            togglePause();
        }
    }
);


window.addEventListener(
    "keyup",
    event => {

        const key =
            event.key.toLowerCase();


        if (
            key === "w" ||
            event.key === "ArrowUp"
        ) {

            keys.accelerate = false;
        }


        if (
            key === "s" ||
            event.key === "ArrowDown"
        ) {

            keys.brake = false;
        }


        if (
            key === "a" ||
            event.key === "ArrowLeft"
        ) {

            keys.left = false;
        }


        if (
            key === "d" ||
            event.key === "ArrowRight"
        ) {

            keys.right = false;
        }


        if (
            event.code === "Space"
        ) {

            keys.nitro = false;
        }
    }
);


/* =========================================================
   MOBILE CONTROLS
========================================================= */

function setupMobileButton(
    id,
    property
) {

    const button =
        document.getElementById(id);


    if (!button)
        return;


    const start =
        event => {

            event.preventDefault();

            keys[property] = true;
        };


    const end =
        event => {

            event.preventDefault();

            keys[property] = false;
        };


    button.addEventListener(
        "touchstart",
        start,
        { passive: false }
    );


    button.addEventListener(
        "touchend",
        end,
        { passive: false }
    );


    button.addEventListener(
        "touchcancel",
        end,
        { passive: false }
    );
}


setupMobileButton(
    "left-btn",
    "left"
);

setupMobileButton(
    "right-btn",
    "right"
);

setupMobileButton(
    "accelerate-btn",
    "accelerate"
);

setupMobileButton(
    "brake-btn",
    "brake"
);

setupMobileButton(
    "nitro-btn",
    "nitro"
);


/* =========================================================
   START
========================================================= */

const startButton =
    document.getElementById(
        "start-button"
    );


if (startButton) {

    startButton.addEventListener(
        "click",
        startRace
    );
}


const restartButton =
    document.getElementById(
        "restart-button"
    );


if (restartButton) {

    restartButton.addEventListener(
        "click",
        () => location.reload()
    );
}


function startRace() {

    const startScreen =
        document.getElementById(
            "start-screen"
        );


    if (startScreen) {

        startScreen.classList.add(
            "hidden"
        );
    }


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


    if (!display) {

        countdownActive = false;
        gameStarted = true;

        return;
    }


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
   PAUSE
========================================================= */

function togglePause() {

    if (!gameStarted)
        return;


    paused = !paused;


    if (paused) {

        const pauseText =
            document.createElement(
                "div"
            );


        pauseText.id =
            "pause-message";


        pauseText.textContent =
            "PAUSED";


        pauseText.style.position =
            "fixed";

        pauseText.style.left =
            "50%";

        pauseText.style.top =
            "50%";

        pauseText.style.transform =
            "translate(-50%, -50%)";

        pauseText.style.zIndex =
            "9999";

        pauseText.style.color =
            "white";

        pauseText.style.fontSize =
            "42px";

        pauseText.style.fontWeight =
            "900";

        pauseText.style.fontFamily =
            "Arial";


        document.body.appendChild(
            pauseText
        );

    } else {

        const pauseText =
            document.getElementById(
                "pause-message"
            );


        if (pauseText)
            pauseText.remove();
    }
}


/* =========================================================
   PLAYER UPDATE
========================================================= */

function updatePlayer(delta) {

    if (
        !gameStarted ||
        raceFinished ||
        countdownActive ||
        paused
    )
        return;


    /* ACCELERATION */

    if (keys.accelerate) {

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


    /* BRAKE */

    if (keys.brake) {

        speed -=
            BRAKE *
            delta *
            60;
    }


    /* NITRO */

    if (
        keys.nitro &&
        nitro > 0 &&
        speed > 0.2
    ) {

        speed +=
            0.060 *
            delta *
            60;

        nitro -=
            0.9 *
            delta *
            60;

    } else {

        nitro +=
            0.16 *
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


    /* =====================================================
       STEERING
    ===================================================== */

    const steering =
        STEERING_SPEED *
        Math.max(
            speed,
            0.15
        ) *
        delta *
        60;


    if (keys.left) {

        lateralOffset -=
            steering;
    }


    if (keys.right) {

        lateralOffset +=
            steering;
    }


    /*
       Keep the car on the road.
    */

    lateralOffset =
        THREE.MathUtils.clamp(
            lateralOffset,
            -6.4,
            6.4
        );


    /* =====================================================
       MOVE AROUND THE ACTUAL TRACK
    ===================================================== */

    playerT +=
        speed *
        TRACK_SPEED *
        delta *
        60;


    /* LAP */

    if (playerT >= 1) {

        playerT -= 1;

        lap++;


        if (lap > 3) {

            finishRace();

            return;
        }
    }


    positionPlayer();


    raceTime +=
        delta;
}


/* =========================================================
   POSITION PLAYER
========================================================= */

function positionPlayer() {

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


    player.position.copy(
        point
    );


    player.position.addScaledVector(
        side,
        lateralOffset
    );


    player.position.y =
        0.08;


    player.rotation.y =
        Math.atan2(
            tangent.x,
            tangent.z
        );
}


/* =========================================================
   AI
========================================================= */

function updateAI(delta) {

    if (
        !gameStarted ||
        raceFinished ||
        paused
    )
        return;


    aiCars.forEach(
        ai => {

            ai.t +=
                ai.speed *
                delta *
                60;


            if (ai.t >= 1) {

                ai.t -= 1;
            }


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
                0.08;


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

const desiredCamera =
    new THREE.Vector3();

const cameraTarget =
    new THREE.Vector3();


function updateCamera() {

    const tangent =
        trackCurve
            .getTangentAt(playerT)
            .normalize();


    desiredCamera
        .copy(player.position)
        .addScaledVector(
            tangent,
            -11
        );


    desiredCamera.y =
        5.5;


    camera.position.lerp(
        desiredCamera,
        0.09
    );


    cameraTarget
        .copy(player.position)
        .addScaledVector(
            tangent,
            13
        );


    cameraTarget.y =
        1.1;


    camera.lookAt(
        cameraTarget
    );
}


/* =========================================================
   POSITION
========================================================= */

function updatePosition() {

    let position = 1;


    aiCars.forEach(
        ai => {

            if (
                ai.t >
                playerT
            ) {

                position++;
            }
        }
    );


    const element =
        document.getElementById(
            "position"
        );


    if (element) {

        element.textContent =
            `${position} / ${aiCars.length + 1}`;
    }
}


/* =========================================================
   HUD
========================================================= */

function updateHUD() {

    const kmh =
        Math.round(
            speed * 210
        );


    const speedNumber =
        document.getElementById(
            "speed-number"
        );


    if (speedNumber)
        speedNumber.textContent =
            kmh;


    const speedFill =
        document.getElementById(
            "speed-fill"
        );


    if (speedFill) {

        speedFill.style.width =
            `${Math.min(
                kmh / 210 * 100,
                100
            )}%`;
    }


    const nitroFill =
        document.getElementById(
            "nitro-fill"
        );


    if (nitroFill) {

        nitroFill.style.width =
            `${nitro}%`;
    }


    const nitroPercent =
        document.getElementById(
            "nitro-percent"
        );


    if (nitroPercent) {

        nitroPercent.textContent =
            `${Math.round(nitro)}%`;
    }


    const lapElement =
        document.getElementById(
            "lap"
        );


    if (lapElement) {

        lapElement.textContent =
            `${Math.min(lap, 3)} / 3`;
    }


    const timer =
        document.getElementById(
            "timer"
        );


    if (timer) {

        timer.textContent =
            formatTime(
                raceTime
            );
    }
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


    const positionElement =
        document.getElementById(
            "position"
        );


    let position = 1;


    if (positionElement) {

        position =
            parseInt(
                positionElement
                    .textContent
                    .split("/")[0]
            );
    }


    const finalPosition =
        document.getElementById(
            "final-position"
        );


    if (finalPosition) {

        finalPosition.textContent =
            getOrdinal(position);
    }


    const finalTime =
        document.getElementById(
            "final-time"
        );


    if (finalTime) {

        finalTime.textContent =
            formatTime(
                raceTime
            );
    }


    const finishScreen =
        document.getElementById(
            "finish-screen"
        );


    if (finishScreen) {

        finishScreen
            .classList
            .remove("hidden");
    }
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
   INITIAL POSITION
========================================================= */

positionPlayer();


/* =========================================================
   GAME LOOP
========================================================= */

function animate(now) {

    requestAnimationFrame(
        animate
    );


    const delta =
        Math.min(
            (now - lastTime) / 1000,
            0.05
        );


    lastTime = now;


    updatePlayer(delta);

    updateAI(delta);

    updateCamera();

    updatePosition();

    updateHUD();


    /* speed camera shake */

    if (
        speed > 0.8 &&
        gameStarted &&
        !paused
    ) {

        camera.position.y +=
            Math.sin(
                now * 0.03
            ) * 0.025;
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
