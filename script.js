import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.179/build/three.module.js';


// =========================
// VARIÁVEIS DO THREE.JS
// =========================

let scene;
let camera;
let renderer;


// =========================
// CONTROLE DO JOGADOR
// =========================

let keys = {};

let moveSpeed = 0.15;

let yaw = 0;
let pitch = 0;

let mouseSensitivity = 0.002;


// =========================
// INICIAR
// =========================

function init() {


    // =========================
    // CENA
    // =========================

    scene = new THREE.Scene();


    // =========================
    // CHÃO
    // =========================

    const groundGeometry = new THREE.PlaneGeometry(
        500,
        500
    );

    const groundMaterial = new THREE.MeshBasicMaterial({
        color: 0x777777
    });

    const ground = new THREE.Mesh(
        groundGeometry,
        groundMaterial
    );

    ground.rotation.x = -Math.PI / 2;

    scene.add(ground);


    // =========================
    // CÂMERA
    // =========================

    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        10000
    );

    camera.position.set(
        0,
        2,
        5
    );


    // =========================
    // RENDERIZADOR
    // =========================

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    document.body.appendChild(
        renderer.domElement
    );


    // =========================
    // SKYBOX
    // =========================

    let materialArray = [];

    let loader = new THREE.TextureLoader();


    let texture_ft = loader.load(
        'skybox/arid_ft.jpg'
    );

    let texture_bk = loader.load(
        'skybox/arid_bk.jpg'
    );

    let texture_up = loader.load(
        'skybox/arid_up.jpg'
    );

    let texture_dn = loader.load(
        'skybox/arid_dn.jpg'
    );

    let texture_rt = loader.load(
        'skybox/arid_rt.jpg'
    );

    let texture_lf = loader.load(
        'skybox/arid_lf.jpg'
    );


    // =========================
    // MATERIAIS DO SKYBOX
    // =========================

    materialArray.push(
        new THREE.MeshBasicMaterial({
            map: texture_ft
        })
    );

    materialArray.push(
        new THREE.MeshBasicMaterial({
            map: texture_bk
        })
    );

    materialArray.push(
        new THREE.MeshBasicMaterial({
            map: texture_up
        })
    );

    materialArray.push(
        new THREE.MeshBasicMaterial({
            map: texture_dn
        })
    );

    materialArray.push(
        new THREE.MeshBasicMaterial({
            map: texture_rt
        })
    );

    materialArray.push(
        new THREE.MeshBasicMaterial({
            map: texture_lf
        })
    );


    // =========================
    // SKYBOX VISÍVEL POR DENTRO
    // =========================

    for (let i = 0; i < 6; i++) {

        materialArray[i].side =
            THREE.BackSide;

    }


    // =========================
    // CUBO DO SKYBOX
    // =========================

    let skyboxGeo =
        new THREE.BoxGeometry(
            10000,
            10000,
            10000
        );

    let skybox =
        new THREE.Mesh(
            skyboxGeo,
            materialArray
        );

    scene.add(skybox);


// =========================
// TECLADO
// =========================

window.addEventListener('keydown', function(event) {

    console.log('TECLA PRESSIONADA:', event.code);

    keys[event.code] = true;

});

window.addEventListener('keyup', function(event) {

    keys[event.code] = false;

});

    // =========================
    // MOUSE
    // =========================

    document.body.addEventListener(
        'click',
        function() {

            document.body.requestPointerLock();

        }
    );


    document.addEventListener(
        'mousemove',
        function(event) {

            if (
                document.pointerLockElement ===
                document.body
            ) {

                yaw -=
                    event.movementX *
                    mouseSensitivity;

                pitch -=
                    event.movementY *
                    mouseSensitivity;


                // =========================
                // LIMITA OLHAR PARA CIMA/BAIXO
                // =========================

                pitch = Math.max(
                    -Math.PI / 2,
                    Math.min(
                        Math.PI / 2,
                        pitch
                    )
                );

            }

        }
    );


    // =========================
    // COMEÇA O JOGO
    // =========================

    animate();

}


// =========================
// MOVIMENTAÇÃO
// =========================

function updateMovement() {

    let direction =
        new THREE.Vector3();


    // =========================
    // DIREÇÃO PARA FRENTE
    // =========================

    let forward =
        new THREE.Vector3(
            -Math.sin(yaw),
            0,
            -Math.cos(yaw)
        );


    // =========================
    // DIREÇÃO PARA DIREITA
    // =========================

    let right =
        new THREE.Vector3(
            Math.cos(yaw),
            0,
            -Math.sin(yaw)
        );


    // =========================
    // W - FRENTE
    // =========================

    if (keys['KeyW']) {

        direction.add(forward);

    }


    // =========================
    // S - TRÁS
    // =========================

    if (keys['KeyS']) {

        direction.sub(forward);

    }


    // =========================
    // D - DIREITA
    // =========================

    if (keys['KeyD']) {

        direction.add(right);

    }


    // =========================
    // A - ESQUERDA
    // =========================

    if (keys['KeyA']) {

        direction.sub(right);

    }


    // =========================
    // MOVIMENTA O JOGADOR
    // =========================

    if (direction.length() > 0) {

        direction.normalize();

        direction.multiplyScalar(
            moveSpeed
        );

        camera.position.add(
            direction
        );

    }


    // =========================
    // ROTAÇÃO DA CÂMERA
    // =========================

    camera.rotation.order = 'YXZ';

    camera.rotation.y = yaw;

    camera.rotation.x = pitch;

}


// =========================
// ANIMAÇÃO
// =========================

function animate() {

    requestAnimationFrame(
        animate
    );


    // Atualiza movimento
    updateMovement();


    // Renderiza o mundo
    renderer.render(
        scene,
        camera
    );

}


// =========================
// REDIMENSIONAMENTO
// =========================

window.addEventListener(
    'resize',
    function() {

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


// =========================
// INICIA O PROJETO
// =========================

init();