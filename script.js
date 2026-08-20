/* =========================================================
   PROJECT 4 — NEON CIRCUIT
   3D RACING GAME
   MATCHED TO YOUR CURRENT INDEX.HTML
========================================================= */

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x101722);

scene.fog = new THREE.Fog(
    0x101722,
    80,
    320
);


/* =========================================================
   CAMERA
========================================================= */

const camera = new THREE.PerspectiveCamera(
    65,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 6, 12);


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
   LIGHTS
========================================================= */

scene.add(
    new THREE.HemisphereLight(
        0xbfdcff,
        0x1b241c,
        2
    )
);


const sun =
    new THREE.DirectionalLight(
        0xffffff,
        2.5
    );

sun.position.set(
    80,
    120,
    60
);

sun.castShadow = true;

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
            color: 0x26382c,
            roughness: 1
        })
    );

ground.rotation.x =
    -Math.PI / 2;

ground.receiveShadow = true;

world.add(ground);


/* =========================================================
   RACE TRACK
========================================================= */

const trackPoints = [

    new THREE.Vector3(0, 0, 110),

    new THREE.Vector3(55, 0, 105),

    new THREE.Vector3(92, 0, 75),

    new THREE.Vector3(102, 0, 15),

    new THREE.Vector3(90, 0, -45),

    new THREE.Vector3(52, 0, -87),

    new THREE.Vector3(0, 0, -108),

    new THREE.Vector3(-52, 0, -87),

    new THREE.Vector3(-90, 0, -45),

    new THREE.Vector3(-102, 0, 15),

    new THREE.Vector3(-92, 0, 75),

    new THREE.Vector3(-55, 0, 105)

];


const track =
    new THREE.CatmullRomCurve3(
        trackPoints,
        true,
        "catmullrom",
        0.45
    );


const TRACK_WIDTH = 18;

const SEGMENTS = 400;


/* =========================================================
   CREATE ROAD
========================================================= */

const roadVertices = [];
const roadIndices = [];


for (
    let i = 0;
    i <= SEGMENTS;
    i++
) {

    const t =
        i / SEGMENTS;


    const point =
        track.getPointAt(t);


    const tangent =
        track
            .getTangentAt(t)
            .normalize();


    const side =
        new THREE.Vector3(
            -tangent.z,
            0,
            tangent.x
        )
        .normalize();


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


    left.y = 0.05;

    right.y = 0.05;


    roadVertices.push(
        left.x,
        left.y,
        left.z,

        right.x,
        right.y,
        right.z
    );
}


for (
    let i = 0;
    i < SEGMENTS;
    i++
) {

    const a =
        i * 2;

    const b =
        a + 1;

    const c =
        a + 2;

    const d =
        a + 3;


    roadIndices.push(
        a, b, c,
        b, d, c
    );
}


const roadGeometry =
    new THREE.BufferGeometry();


roadGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(
        roadVertices,
        3
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
            color: 0x24272c,
            roughness: 0.9
        })
    );


road.receiveShadow = true;

world.add(road);


/* =========================================================
   ROAD CENTER MARKINGS
========================================================= */

const lineMaterial =
    new THREE.MeshBasicMaterial({
        color: 0xffffff
    });


for (
    let i = 0;
    i < 200;
    i++
) {

    if (i % 2 === 0)
        continue;


    const t =
        i / 200;


    const point =
        track.getPointAt(t);


    const tangent =
        track
            .getTangentAt(t)
            .normalize();


    const line =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                0.3,
                0.06,
                3.5
            ),
            lineMaterial
        );


    line.position.copy(
        point
    );


    line.position.y =
        0.12;


    /*
       The road and car use -Z
       as their forward direction.
    */

    line.rotation.y =
        Math.atan2(
            -tangent.x,
            -tangent.z
        );


    world.add(line);
}


/* =========================================================
   CURBS
========================================================= */

const curbRed =
    new THREE.MeshStandardMaterial({
        color: 0xe32945
    });


const curbWhite =
    new THREE.MeshStandardMaterial({
        color: 0xffffff
    });


for (
    let i = 0;
    i < 200;
    i++
) {

    const t =
        i / 200;


    const point =
        track.getPointAt(t);


    const tangent =
        track
            .getTangentAt(t)
            .normalize();


    const side =
        new THREE.Vector3(
            -tangent.z,
            0,
            tangent.x
        )
        .normalize();


    for (
        let s = -1;
        s <= 1;
        s += 2
    ) {

        const curb =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    1.5,
                    0.18,
                    2.5
                ),
                i % 2 === 0
                    ? curbRed
                    : curbWhite
            );


        curb.position.copy(
            point
        );


        curb.position.addScaledVector(
            side,
            s *
            (TRACK_WIDTH / 2 + 0.8)
        );


        curb.position.y =
            0.14;


        curb.rotation.y =
            Math.atan2(
                -tangent.x,
                -tangent.z
            );


        world.add(curb);
    }
}


/* =========================================================
   START / FINISH
========================================================= */

const startPoint =
    track.getPointAt(0);


const startTangent =
    track
        .getTangentAt(0)
        .normalize();


const startLine =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            TRACK_WIDTH,
            0.08,
            5
        ),
        new THREE.MeshBasicMaterial({
            color: 0xffffff
        })
    );


startLine.position.copy(
    startPoint
);


startLine.position.y =
    0.18;


startLine.rotation.y =
    Math.atan2(
        -startTangent.x,
        -startTangent.z
    );


world.add(startLine);


/* =========================================================
   CAR CREATOR
========================================================= */

function createCar(color) {

    const car =
        new THREE.Group();


    /* BODY */

    const body =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                2.3,
                0.7,
                4.3
            ),
            new THREE.MeshStandardMaterial({
                color: color,
                metalness: 0.55,
                roughness: 0.25
            })
        );


    body.position.y =
        0.7;


    body.castShadow = true;

    car.add(body);


    /* CABIN */

    const cabin =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                1.55,
                0.6,
                1.9
            ),
            new THREE.MeshStandardMaterial({
                color: 0x080d14,
                metalness: 0.3,
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


    /* WHEELS */

    const wheelMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x050505,
            roughness: 0.9
        });


    const wheelPositions = [

        [-1.08, 0.45, -1.35],
        [1.08, 0.45, -1.35],

        [-1.08, 0.45, 1.35],
        [1.08, 0.45, 1.35]

    ];


    wheelPositions.forEach(
        p => {

            const wheel =
                new THREE.Mesh(
                    new THREE.CylinderGeometry(
                        0.45,
                        0.45,
                        0.34,
                        20
                    ),
                    wheelMaterial
                );


            wheel.rotation.z =
                Math.PI / 2;


            wheel.position.set(
                p[0],
                p[1],
                p[2]
            );


            wheel.castShadow = true;

            car.add(wheel);
        }
    );


    /* WINDOWS */

    const windshield =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                1.45,
                0.4,
                0.12
            ),
            new THREE.MeshStandardMaterial({
                color: 0x304b62,
                metalness: 0.6,
                roughness: 0.1
            })
        );


    windshield.position.set(
        0,
        1.22,
        -0.85
    );


    windshield.rotation.x =
        -0.25;


    car.add(windshield);


    /* HEADLIGHTS */

    const lights =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                1.8,
                0.18,
                0.2
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
        -2.17
    );


    car.add(lights);


    /* SPOILER */

    const spoiler =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                2.4,
                0.15,
                0.45
            ),
            new THREE.MeshStandardMaterial({
                color: color,
                metalness: 0.5
            })
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


/* =========================================================
   PLAYER STATE
========================================================= */

/*
   This is the player's location
   around the track.

   0 = start line
   0.5 = halfway
   1 = one complete lap
*/

let playerProgress = 0;


/*
   Position across the road.
*/

let playerOffset = 0;


/*
   Actual speed.
*/

let speed = 0;


/* =========================================================
   DRIVING SETTINGS
========================================================= */

const MAX_SPEED = 1.0;

const ACCELERATION = 0.035;

const BRAKE_POWER = 0.065;

const FRICTION = 0.012;

const STEERING = 0.075;


/*
   THIS IS THE IMPORTANT VALUE.

   Higher = faster movement around
   the track.
*/

const TRACK_MOVEMENT = 0.020;


/* =========================================================
   GAME STATE
========================================================= */

let raceStarted = false;

let raceFinished = false;

let paused = false;

let lap = 1;

let raceTime = 0;


/* =========================================================
   KEYBOARD
========================================================= */

const keys = {

    accelerate: false,

    brake: false,

    left: false,

    right: false,

    nitro: false

};


window.addEventListener(
    "keydown",
    event => {

        const key =
            event.key.toLowerCase();


        /*
           Stop arrow keys from
           scrolling the page.
        */

        if (
            event.key.startsWith(
                "Arrow"
            ) ||
            event.code === "Space"
        ) {

            event.preventDefault();
        }


        /* W / UP */

        if (
            key === "w" ||
            event.key === "ArrowUp"
        ) {

            keys.accelerate = true;

            /*
               Pressing W automatically
               starts the race.
            */

            if (!raceStarted)
                startRace();
        }


        /* S / DOWN */

        if (
            key === "s" ||
            event.key === "ArrowDown"
        ) {

            keys.brake = true;
        }


        /* A / LEFT */

        if (
            key === "a" ||
            event.key === "ArrowLeft"
        ) {

            keys.left = true;
        }


        /* D / RIGHT */

        if (
            key === "d" ||
            event.key === "ArrowRight"
        ) {

            keys.right = true;
        }


        /* SPACE */

        if (
            event.code === "Space"
        ) {

            keys.nitro = true;
        }


        /* R */

        if (
            key === "r"
        ) {

            location.reload();
        }


        /* P */

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
   START BUTTON
========================================================= */

document
    .getElementById("start-button")
    .addEventListener(
        "click",
        startRace
    );


function startRace() {

    if (raceStarted)
        return;


    document
        .getElementById(
            "start-screen"
        )
        .classList
        .add("hidden");


    raceStarted = true;


    /*
       Short countdown.
    */

    const countdown =
        document.getElementById(
            "countdown"
        );


    let number = 3;


    countdown.textContent =
        number;


    const interval =
        setInterval(
            () => {

                number--;


                if (number > 0) {

                    countdown.textContent =
                        number;

                } else {

                    countdown.textContent =
                        "GO!";


                    setTimeout(
                        () => {

                            countdown.textContent =
                                "";

                        },
                        600
                    );


                    clearInterval(
                        interval
                    );
                }

            },
            700
        );
}


/* =========================================================
   MOBILE BUTTONS
========================================================= */

function mobileControl(
    id,
    property
) {

    const button =
        document.getElementById(id);


    if (!button)
        return;


    button.addEventListener(
        "touchstart",
        e => {

            e.preventDefault();

            if (!raceStarted)
                startRace();

            keys[property] = true;

        },
        {
            passive: false
        }
    );


    button.addEventListener(
        "touchend",
        e => {

            e.preventDefault();

            keys[property] = false;

        },
        {
            passive: false
        }
    );


    button.addEventListener(
        "touchcancel",
        () => {

            keys[property] = false;

        }
    );
}


mobileControl(
    "left-btn",
    "left"
);


mobileControl(
    "right-btn",
    "right"
);


mobileControl(
    "accelerate-btn",
    "accelerate"
);


mobileControl(
    "brake-btn",
    "brake"
);


mobileControl(
    "nitro-btn",
    "nitro"
);


/* =========================================================
   UPDATE PLAYER
========================================================= */

function updatePlayer(delta) {

    if (
        !raceStarted ||
        raceFinished ||
        paused
    )
        return;


    /* =====================================================
       ACCELERATION
    ===================================================== */

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


    /* =====================================================
       BRAKING
    ===================================================== */

    if (keys.brake) {

        speed -=
            BRAKE_POWER *
            delta *
            60;
    }


    /* =====================================================
       NITRO
    ===================================================== */

    if (
        keys.nitro &&
        nitro > 0 &&
        speed > 0.1
    ) {

        speed +=
            0.055 *
            delta *
            60;


        nitro -=
            1.0 *
            delta *
            60;

    } else {

        nitro +=
            0.2 *
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

    const steeringAmount =
        STEERING *
        delta *
        60 *
        Math.max(
            speed,
            0.25
        );


    if (keys.left) {

        playerOffset -=
            steeringAmount;
    }


    if (keys.right) {

        playerOffset +=
            steeringAmount;
    }


    playerOffset =
        THREE.MathUtils.clamp(
            playerOffset,
            -6.5,
            6.5
        );


    /* =====================================================
       ACTUAL FORWARD MOVEMENT
    ===================================================== */

    playerProgress +=
        speed *
        TRACK_MOVEMENT *
        delta *
        60;


    /*
       COMPLETE LAP
    */

    if (
        playerProgress >= 1
    ) {

        playerProgress -= 1;

        lap++;


        if (lap > 3) {

            finishRace();

            return;
        }
    }


    updatePlayerPosition();


    raceTime +=
        delta;
}


/* =========================================================
   PLAYER POSITION
========================================================= */

function updatePlayerPosition() {

    const point =
        track.getPointAt(
            playerProgress
        );


    const tangent =
        track
            .getTangentAt(
                playerProgress
            )
            .normalize();


    const side =
        new THREE.Vector3(
            -tangent.z,
            0,
            tangent.x
        )
        .normalize();


    /*
       Put car on track.
    */

    player.position.copy(
        point
    );


    player.position.addScaledVector(
        side,
        playerOffset
    );


    player.position.y =
        0.08;


    /*
       IMPORTANT:
       The car's front is -Z.
    */

    player.rotation.y =
        Math.atan2(
            -tangent.x,
            -tangent.z
        );
}


/* =========================================================
   AI CARS
========================================================= */

const aiCars = [];

const aiSettings = [

    {
        color: 0xff304f,
        progress: 0.97,
        offset: -3.2,
        speed: 0.00055
    },

    {
        color: 0xffb52e,
        progress: 0.94,
        offset: 3.2,
        speed: 0.00052
    },

    {
        color: 0xa855f7,
        progress: 0.91,
        offset: -3.2,
        speed: 0.00050
    }

];


aiSettings.forEach(
    setting => {

        const car =
            createCar(
                setting.color
            );


        world.add(car);


        aiCars.push({
            mesh: car,
            progress: setting.progress,
            offset: setting.offset,
            speed: setting.speed
        });

    }
);


/* =========================================================
   AI UPDATE
========================================================= */

function updateAI(delta) {

    if (
        !raceStarted ||
        raceFinished ||
        paused
    )
        return;


    aiCars.forEach(
        ai => {

            ai.progress +=
                ai.speed *
                delta *
                60;


            if (
                ai.progress >= 1
            ) {

                ai.progress -= 1;
            }


            const point =
                track.getPointAt(
                    ai.progress
                );


            const tangent =
                track
                    .getTangentAt(
                        ai.progress
                    )
                    .normalize();


            const side =
                new THREE.Vector3(
                    -tangent.z,
                    0,
                    tangent.x
                )
                .normalize();


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
                    -tangent.x,
                    -tangent.z
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
        track
            .getTangentAt(
                playerProgress
            )
            .normalize();


    /*
       Behind car.
    */

    desiredCamera
        .copy(
            player.position
        );


    desiredCamera.addScaledVector(
        tangent,
        -12
    );


    desiredCamera.y =
        5.5;


    camera.position.lerp(
        desiredCamera,
        0.1
    );


    /*
       Look ahead.
    */

    cameraTarget
        .copy(
            player.position
        );


    cameraTarget.addScaledVector(
        tangent,
        14
    );


    cameraTarget.y =
        1.0;


    camera.lookAt(
        cameraTarget
    );
}


/* =========================================================
   POSITION
========================================================= */

function updateRacePosition() {

    let position = 1;


    aiCars.forEach(
        ai => {

            if (
                ai.progress >
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
        `${position} / 4`;
}


/* =========================================================
   HUD
========================================================= */

function updateHUD() {

    const kmh =
        Math.round(
            speed * 220
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
            kmh / 220 * 100,
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
   PAUSE
========================================================= */

function togglePause() {

    if (!raceStarted)
        return;


    paused =
        !paused;
}


/* =========================================================
   FINISH
========================================================= */

function finishRace() {

    raceFinished = true;

    raceStarted = false;


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
        ordinal(
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


function ordinal(n) {

    if (n === 1)
        return "1ST";

    if (n === 2)
        return "2ND";

    if (n === 3)
        return "3RD";

    return n + "TH";
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
   INITIALIZE
========================================================= */

let nitro = 100;


/*
   Put player on start line.
*/

updatePlayerPosition();


/* =========================================================
   GAME LOOP
========================================================= */

let lastTime =
    performance.now();


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

    updateRacePosition();

    updateHUD();


    /*
       Small camera vibration
       at high speed.
    */

    if (
        speed > 0.75 &&
        raceStarted &&
        !paused
    ) {

        camera.position.y +=
            Math.sin(
                now * 0.04
            ) * 0.025;
    }


    renderer.render(
        scene,
        camera
    );
}


animate(
    performance.now()
);
