var scene;
var camera;
var renderer;

window.addEventListener("load", init, false);
animate();

function init(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(90, window.innerWidth/window.innerHeight, 1, 1000); // PerspectiveCamera(fov, aspect, near, far)
	splineCamera = new THREE.PerspectiveCamera( 84, window.innerWidth / window.innerHeight, 0.01, 1000 );
	scene.add( camera );
    camera.position.set(0, 75, 200);

	addHtml();
 //    addElements();
 //    addLights();
	
	// addTube();

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth*0.69, window.innerHeight*0.99);
    document.body.appendChild(renderer.domElement);

    // Add a resize event listener
    //window.addEventListener('resize', onWindowResize, false);

    // Add Orbit controls
    //controls = new THREE.OrbitControls(camera, renderer.domElement);
    //controls.target = new THREE.Vector3(0, 40, 0);
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

    // info.innerHTML += '<br/>Recorrido: <input id="t" />';
    // info.innerHTML += '<br/>Seleccione una cámara: <select id="camara" onchange="selectCam()"><option value="1">Cámara frontal</option><option value="2">Cámara Trayectorias</option></select>';
    // info.innerHTML += '<br/>Seleccione una trayectoria: ';

//    info.innerHTML += dropdownTrayect;

    container.appendChild(info);
}






function animate() {
   requestAnimationFrame(animate);
   render();
}

function render() {
    renderer.render( scene,  camera );
   //renderCam();
   //controls.update();
}

function onWindowResize() {

    // Update aspect ratio
    camera.aspect = window.innerWidth / window.innerHeight;

    // Update Projector
    camera.updateProjectionMatrix();

    // Set the new rendering size
    renderer.setSize( window.innerWidth, window.innerHeight );
}
