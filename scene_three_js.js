



/* ----------------------------------------------------------------------------------------------------------------------------------------------------*/




var scene;
var camera, splineCamera;
var renderer;
var Top, Group;
var controls;



window.addEventListener("load", init, false);
animate();

function init(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(90, (window.innerWidth*0.69) / (window.innerHeight*0.99), 1, 1000); // PerspectiveCamera(fov, aspect, near, far)
    scene.add( camera );
    camera.position.set(0, 0, 100);

    addHtml();
    addElements();
    addLights();
    

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth*0.69 , window.innerHeight*0.99);
    document.getElementById("resultado").appendChild(renderer.domElement);

    // Add a resize event listener
    window.addEventListener('resize', onWindowResize, false);

    // Add Orbit controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target = new THREE.Vector3(0, 0, 0);
}

function addElements(){
    dibujarPiramide();
}


function dibujarPiramide(){
    material = new THREE.MeshLambertMaterial({ map: THREE.TextureLoader('glass.jpg') }); 
    piramide = new THREE.Mesh(new THREE.TetrahedronGeometry(25,0),material);
    piramide.rotation.z = Math.PI/180 * 45;
    piramide.rotation.x = Math.PI/180 * -35;
    piramide.position.set(0,0,10);
    scene.add(piramide);
}

function addLights(){
    
    // Setup the point lighting ion the middle of the roonm
    var pointLight = new THREE.PointLight(0xffffff, 1, 150);
    pointLight.position.set(0, 70, 0);
    scene.add(pointLight);
    //scene.add(new THREE.PointLightHelper(bluePoint, 3));

    // Setup ambient lighting for the room
    var hemLight = new THREE.HemisphereLight(0xffe5bb, 0xFFBF00, .40);
    scene.add(hemLight);

}

function addHtml(){
    container = document.createElement('div');
    escena = document.getElementById("resultado")
    document.getElementById("resultado").appendChild(container);

    var info = document.createElement('div');
    info.style.position = 'absolute';
    info.style.top = '10px';
    info.style.width = '100%';
    info.style.textAlign = 'left';
    info.style.color = 'white';

    container.appendChild(info);
}

function onWindowResize() {

    // Update aspect ratio
    camera.aspect = (window.innerWidth*0.69) / (window.innerHeight*0.99);

    // Update Projector
    camera.updateProjectionMatrix();

    // Set the new rendering size
    renderer.setSize(window.innerWidth*0.69 , window.innerHeight*0.99);
}

function animate() {
   requestAnimationFrame(animate);
   render();
}

function render() {
   renderCam();
   controls.update();
}


function renderCam() {

    var res;
    res = parseInt( document.getElementById('resultado').value  );
    renderer.render( scene,  camera );
}