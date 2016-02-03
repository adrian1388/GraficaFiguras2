var scene;
var camera, splineCamera;
var renderer;
var Top, Group;
var controls;

var tube, tubeMesh, pointLight;
var scale = 2;
var targetRotation = 0;
var binormal = new THREE.Vector3();
var normal = new THREE.Vector3();

var sampleSpline = new THREE.SplineCurve3([
  new THREE.Vector3(80, 0, 80),
  new THREE.Vector3(80, 0, -80),
  new THREE.Vector3(-80, 80, -80),
  new THREE.Vector3(-80, 80, 80),
  new THREE.Vector3(-80, 0, 80),
]);
var sampleSpline2 = new THREE.SplineCurve3([
  new THREE.Vector3(-90, 80, 30),
  new THREE.Vector3(-60, 80, 60),
  new THREE.Vector3(-30, 80, 30),
  new THREE.Vector3(  0, 80, 60),
  new THREE.Vector3( 30, 80, 30),
  new THREE.Vector3( 60, 80, 60),
  new THREE.Vector3( 90, 80, 30),
]);
var bezierCurve = new THREE.CubicBezierCurve3(
  new THREE.Vector3( -90, 0, 0 ),
  new THREE.Vector3( -45, 135, 0 ),
  new THREE.Vector3( 180, 135, 0 ),
  new THREE.Vector3( 90, 0, 0 )
);

//var cubic = new CustomCubicCurve(90);
var trayectorias = {
	CubicCurve: new CustomCubicCurve(90),
	Sinusoidal: sampleSpline2,
	SplineCurve: sampleSpline,
	BezierCurve: bezierCurve
};
var closed2 = false;

var dropdownTrayect = '<select id="trayectoria" onchange="addTube()">';
var s;
for ( s in trayectorias ) {
	dropdownTrayect += '<option value="' + s + '"';
	dropdownTrayect += '>' + s + '</option>';
}
dropdownTrayect += '</select>';

window.addEventListener("load", init, false);
animate();

function init(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(90, window.innerWidth/window.innerHeight, 1, 1000); // PerspectiveCamera(fov, aspect, near, far)
	splineCamera = new THREE.PerspectiveCamera( 84, window.innerWidth / window.innerHeight, 0.01, 1000 );
	scene.add( splineCamera );
    camera.position.set(0, 75, 200);

	addHtml();
    addElements();
    addLights();
	
	addTube();

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Add a resize event listener
    window.addEventListener('resize', onWindowResize, false);

    // Add Orbit controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target = new THREE.Vector3(0, 40, 0);
}

function addElements(){
    dibujarCofre();
    dibujarEsfera();
    dibujarCubo();
    dibujarPiramide();
}

function dibujarCofre(){
    // Geometría del cofre
    var front_back = new THREE.BoxGeometry(150,3,70); //(ancho,grosor,alto)
    var sides = new THREE.BoxGeometry(90,3,70);
    var top_geom = new THREE.BoxGeometry(150,3,92);
    var bottom_geom = new THREE.BoxGeometry(150,3,92);

    // Definiendo las texturas de las caras
    var text_sides = new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture('materiales/sides.jpg') });
    var text_front = new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture('materiales/front.jpg') });
    var text_top = new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture('materiales/top.jpg') });
    var text_bottom = new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture('materiales/bottom.jpg') });
    var text_back = new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture('materiales/back.jpg') });


    // piso
    var floor = new THREE.Mesh(bottom_geom, text_bottom);
    floor.position.set(0,16,0)
    scene.add(floor);

    // cara trasera
    var backWall = new THREE.Mesh(front_back, text_back);
    backWall.rotation.x = Math.PI/180 * 90;
    backWall.position.set(0,50,-45);
    scene.add(backWall);

    // cara frontal
    var frontWall = new THREE.Mesh(front_back, text_front);
    frontWall.rotation.x = Math.PI/180 * 90;
    frontWall.position.set(0,50,45);
    scene.add(frontWall);

    // cara izquierda
    var leftWall = new THREE.Mesh(sides, text_sides);
    leftWall.rotation.x = Math.PI/180 * 90;
    leftWall.rotation.z = Math.PI/180 * 90;
    leftWall.position.set(-74,50,0);
    scene.add(leftWall);

    // cara derecha
    var rightWall = new THREE.Mesh(sides, text_sides);
    rightWall.rotation.x = Math.PI/180 * 90;
    rightWall.rotation.z = Math.PI/180 * 90;
    rightWall.position.set(74,50,0);
    scene.add(rightWall);  

    // tapa
    Top = new THREE.Mesh(top_geom, text_top);
    Top.position.set(0,0,-45);

    Group = new THREE.Object3D();
    Group.position.set(0,0,45);
    Group.add(Top);
    Group.position.set(0,85,-45);
    Group.rotation.x=Math.PI/4;
    scene.add(Group);
}

function dibujarEsfera(){
    material = new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture('materiales/tierra.jpg') });
    sphere = new THREE.Mesh(new THREE.SphereGeometry( 17, 32, 32), material);
    sphere.position.set(-25,34,-20);
    scene.add(sphere);
}

function dibujarCubo(){
    material = new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture('materiales/rubik.jpg') }); 
    cube = new THREE.Mesh(new THREE.BoxGeometry(25,25,25),material);
    cube.position.set(30,28,-25);
    scene.add(cube);
}

function dibujarPiramide(){
    material = new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture('materiales/glass.jpg') }); 
    piramide = new THREE.Mesh(new THREE.TetrahedronGeometry(25,0),material);
    piramide.rotation.z = Math.PI/180 * 45;
    piramide.rotation.x = Math.PI/180 * -35;
    piramide.position.set(0,26,18);
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
	document.body.appendChild(container);

	var info = document.createElement('div');
	info.style.position = 'absolute';
	info.style.top = '10px';
	info.style.width = '100%';
	info.style.textAlign = 'left';
	info.style.color = 'white';

	info.innerHTML += '<br/>Recorrido: <input id="t" />';
	info.innerHTML += '<br/>Seleccione una cámara: <select id="camara" onchange="selectCam()"><option value="1">Cámara frontal</option><option value="2">Cámara Trayectorias</option></select>';
	info.innerHTML += '<br/>Seleccione una trayectoria: ';

	info.innerHTML += dropdownTrayect;

	container.appendChild(info);
}

function addTube() {

	var segments = 50;
	var radiusSegments = 12;
	var value = document.getElementById('trayectoria').value;

	if (tubeMesh) scene.remove(tubeMesh);

	extrudePath = trayectorias[value];//cubic;//bezierCurve;//sampleSpline2;

	tube = new THREE.TubeGeometry(extrudePath, segments, 2, radiusSegments, closed2);

	tubeMesh = THREE.SceneUtils.createMultiMaterialObject( tube, [
	  new THREE.MeshLambertMaterial({
		color: 0xff00ff
	  }),
	  new THREE.MeshBasicMaterial({
		color: 0x000000,
		opacity: 0.3,
		wireframe: true,
		transparent: true
	})]);

	//scene.add( tubeMesh );
	tubeMesh.scale.set( scale, scale, scale );

}

function selectCam(){
	var cam
	cam = parseInt( document.getElementById('camara').value );
	switch (cam) {
		case 1:
		renderer.render( scene,  camera );
		break;
		case 2:
		renderer.render( scene,  splineCamera );
		break;
	}
}

function renderCam() {

	// Try Animate Camera Along Spline
	var time = Date.now();
	var looptime = 20 * 1000;
	var t = ( time % looptime ) / looptime;
	document.getElementById('t').value = t;
	var pos = tube.parameters.path.getPointAt( t );
	pos.multiplyScalar( scale );

	//muestra del recorrido
	var cam
	cam = parseInt( document.getElementById('camara').value );
	switch (cam) {
	case 1:
		document.getElementById('t').value = 0;
		Group.rotation.x = Group.rotation.x + t/100;
		if (Group.rotation.x >= Math.PI) {
		    Group.rotation.x = Math.PI/4;//Group.rotation.x - t/100;
	    }
		break;
	case 2:
		document.getElementById('t').value = t;
		break;
	}

	// interpolation
	var segments = tube.tangents.length;
	var pickt = t * segments;
	var pick = Math.floor( pickt );
	var pickNext = ( pick + 1 ) % segments;

	binormal.subVectors( tube.binormals[ pickNext ], tube.binormals[ pick ] );
	binormal.multiplyScalar( pickt - pick ).add( tube.binormals[ pick ] );


	var dir = tube.parameters.path.getTangentAt( t );

	var offset = 15;

	normal.copy( binormal ).cross( dir );

	// We move on a offset on its binormal
	pos.add( normal.clone().multiplyScalar( offset ) );

	splineCamera.position.copy( pos );
	var value = document.getElementById('trayectoria').value;
    if (value == "Sinusoidal") {
		normal = new THREE.Vector3(0, 0, -20);
    }
    else {
		normal = tube.normals[ pick ];
		var lookAt = normal;
		
		splineCamera.matrix.lookAt(splineCamera.position, lookAt, camera.up);
		splineCamera.rotation.setFromRotationMatrix( splineCamera.matrix, splineCamera.rotation.order );

    }
	selectCam();
	// var i = 0;
	// do{
       // Group.rotation.x = Group.rotation.x + 0.01;
	   // i = Group.rotation.x;
	   // if (i == Math.PI) {
		   // Group.rotation.x = Math.PI/4;
	   // }
    // }while(i>Math.PI);

	}

function animate() {
   requestAnimationFrame(animate);
   render();
}

function render() {
   renderCam();
   controls.update();
}

function onWindowResize() {

    // Update aspect ratio
    camera.aspect = window.innerWidth / window.innerHeight;

    // Update Projector
    camera.updateProjectionMatrix();

    // Set the new rendering size
    renderer.setSize( window.innerWidth, window.innerHeight );
}

