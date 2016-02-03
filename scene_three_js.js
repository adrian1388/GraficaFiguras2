//
        // Startup
        //
        var _isDown, _points, _r, _g, _rc;
        var b_circulo = false;
        var b_triangulo = false;
        var b_rectangulo = false;
        var objetoDibujado;
        var circulo,triangulo,cubo,brazoDer,piernaIzq,piernaDer;
        var i = 0;
        
        function getCanvasRect(canvas)
        {
            var w = canvas.width;
            var h = canvas.height;

            var cx = canvas.offsetLeft;
            var cy = canvas.offsetTop;
            while (canvas.offsetParent != null)
            {
                canvas = canvas.offsetParent;
                cx += canvas.offsetLeft;
                cy += canvas.offsetTop;
            }
            return {x: cx, y: cy, width: w, height: h};
        }
        function getScrollY()
        {
            var scrollY = 0;
            if (typeof(document.body.parentElement) != 'undefined')
            {
                scrollY = document.body.parentElement.scrollTop; // IE
            }
            else if (typeof(window.pageYOffset) != 'undefined')
            {
                scrollY = window.pageYOffset; // FF
            }
            return scrollY;
        }
        //
        // Mouse Events
        //
        function mouseDownEvent(x, y)
        {
            document.onselectstart = function() { return false; } // disable drag-select
            document.onmousedown = function() { return false; } // disable drag-select
            _isDown = true;
            x -= _rc.x;
            y -= _rc.y - getScrollY();
            if (_points.length > 0)
                onClickLimpiar();
            //  _g.clearRect(0, 0, _rc.width, _rc.height);
            
            _points.length = 1; // clear
            _points[0] = new Point(x, y);
            drawText("Recording unistroke...");
            //_g.fillRect(x - 4, y - 3, 9, 9);

            //document.getElementById('objetoDibujado').value = x + ", " + y;
            //document.getElementById('objetoDibujado').value = "new Point( " + x + ", " + y + ")";
            objetoDibujado.length = 0;
            objetoDibujado[0] = new Point(x,y);
        }
        function mouseMoveEvent(x, y)
        {
            if (_isDown)
            {
                x -= _rc.x;
                y -= _rc.y - getScrollY();
                _points[_points.length] = new Point(x, y); // append
                coloRear("rgb(0,0,2)",3);
                drawConnectedPoint(_points.length - 2, _points.length - 1);
                //document.getElementById('objetoDibujado').value = document.getElementById('objetoDibujado').value + " - " + x + ", " + y;
                //objetoDibujaPuntos(x,y);
                objetoDibujado.push(new Point(x,y));
            }
        }
        function mouseUpEvent(x, y)
        {
            var bandTronCab = false;
            var bandBrazo = false;
            var bandPierna = false;
            
            document.onselectstart = function() { return true; } // enable drag-select
            document.onmousedown = function() { return true; } // enable drag-select
            if (_isDown)
            {
                x -= _rc.x;
                y -= _rc.y - getScrollY();
                _isDown = false;
                if (_points.length >= 10)
                {
                    var result = _r.Recognize(_points, document.getElementById('useProtractor').checked);
                    if (result.Score > 1.0){
                        drawText("Result: " + result.Name + " (" + round(result.Score,2) + ").");
                        //drawText("Result: " + result.Name);
                        if (result.Name == "circle") {
                            b_circulo = true;
                            addElements();
                            for ( i = 0; i < objetoDibujado.length; i++) {
                                circulo[i] = objetoDibujado[i];
                            }
                            coloRear("rgb(255,0,0)",3);
                            for ( i = 0; i < circulo.length - 1; i++) {
                                drawTrazo(i, i+1);
                            }
                            
                        } else if (result.Name == "triangle") {
                            b_triangulo = true;
                            addElements();
                            
                            for ( i = 0; i < objetoDibujado.length; i++) {
                                triangulo[i] = objetoDibujado[i];
                            }
                            
                            coloRear("rgb(0,0,255)",3);
                            for ( i = 0; i < triangulo.length - 1; i++) {
                                drawTrazo(i, i+1);
                            }
                        
                        } else if (result.Name == "rectangle") {
                            b_rectangulo = true;
                            addElements();
                            
                            for ( i = 0; i < objetoDibujado.length; i++) {
                                cubo[i] = objetoDibujado[i];
                            }
                            
                            coloRear("rgb(190,190,50)",3);
                            for ( i = 0; i < cubo.length - 1; i++) {
                                drawTrazo(i, i+1);
                            }
                        
                        } 
                        objetoDibujado.length = 1;

                    }
                    else{
                        drawText("Result: Trazo no reconocido. ¡Inténtalo de nuevo!");

                        coloRear("#dddddd",5);
                        for ( i = 0; i < objetoDibujado.length; i++) {
                            drawTrazo(i, i+1);
                        }

                        //document.getElementById('objetoDibujado').value = "";
                        objetoDibujado.length = 0;
                    }
                    
                }
                else // fewer than 10 points were inputted
                {
                    drawText("Too few points made. Please try again.");
                    coloRear("#dddddd",5);
                    for ( i = 0; i < objetoDibujado.length; i++) {
                        drawTrazo(i, i+1);
                    }
                }
            }
        }
        /* Gráficos: HM-ini */
        function drawTrazo(desde, hasta)
        {
            
            _g.beginPath();
            _g.moveTo(objetoDibujado[desde].X, objetoDibujado[desde].Y);
            _g.lineTo(objetoDibujado[hasta].X, objetoDibujado[hasta].Y);
            _g.closePath();
            _g.stroke();
        }
        function coloRear(miColor,miAnchoLinea){
            _g.strokeStyle = miColor;
            _g.lineWidth = miAnchoLinea;
        }
        function onClickLimpiar()
        {
            _g.clearRect(0, 0, _rc.width, _rc.height);
            b_circulo = false;
            b_triangulo = false;
            b_rectangulo = false;
            circulo.length = 0;
            triangulo.length = 0;
            cubo.length = 0;

        }
        function objetoDibujaPuntos(x,y){
            document.getElementById('objetoDibujado').value = document.getElementById('objetoDibujado').value + ", new Point( " + x + ", " + y + ")";
        }
        function drawText(str)
        {
            _g.fillStyle = "rgb(255,255,136)";
            _g.fillRect(0, 0, _rc.width, 20);
            _g.fillStyle = "rgb(0,0,255)";
            _g.fillText(str, 1, 14);
        }
        function drawConnectedPoint(from, to)
        {
            _g.stroke();
            _g.beginPath();
            _g.moveTo(_points[from].X, _points[from].Y);
            _g.lineTo(_points[to].X, _points[to].Y);
            _g.closePath();
            _g.stroke();
        }
        function round(n, d) // round 'n' to 'd' decimals
        {
            d = Math.pow(10, d);
            return Math.round(n * d) / d
        }
        //
        // Unistroke Adding and Clearing
        //
        function onClickAddExisting()
        {
            if (_points.length >= 10)
            {
                var unistrokes = document.getElementById('unistrokes');
                var name = unistrokes[unistrokes.selectedIndex].value;
                var num = _r.AddGesture(name, _points);
                drawText("\"" + name + "\" added. Number of \"" + name + "\"s defined: " + num + ".");
            }
        }
        function onClickAddCustom()
        {
            var name = document.getElementById('custom').value;
            if (_points.length >= 10 && name.length > 0)
            {
                var num = _r.AddGesture(name, _points);
                drawText("\"" + name + "\" added. Number of \"" + name + "\"s defined: " + num + ".");
            }
        }
        function onClickCustom()
        {
            document.getElementById('custom').select();
        }
        function onClickDelete()
        {
            var num = _r.DeleteUserGestures(); // deletes any user-defined unistrokes
            alert("All user-defined gestures have been deleted. Only the 1 predefined gesture remains for each of the " + num + " types.");
        }
        

        



/* ----------------------------------------------------------------------------------------------------------------------------------------------------*/




var scene;
var camera, splineCamera;
var renderer;
var Top, Group;
var shininess = 50, specular = 0x333333, bumpScale = 1, shading = THREE.SmoothShading;
var controls;



window.addEventListener("load", init, false);
animate();

function init(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(50, (window.innerWidth*0.70) / (window.innerHeight*0.99), 1, 10000); // PerspectiveCamera(fov, aspect, near, far)
    scene.add( camera );
    camera.position.set(0, 0, 100);

    addHtml();
    addElements();
    addLights();
    

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth*0.70 , window.innerHeight*0.99);
    document.getElementById("resultado").appendChild(renderer.domElement);

    // Add a resize event listener
    window.addEventListener('resize', onWindowResize, false);

    // Add Orbit controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target = new THREE.Vector3(0, 0, 0);
	var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
	var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x9999ff, side: THREE.BackSide } );
	var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
	scene.add(skyBox);
	//scene.fog = new THREE.FogExp2( 0x9999ff, 0.00025 );

    /* --------------------------------------------------------------------*/


            _points = new Array();
            objetoDibujado = new Array();
            circulo = new Array();
            triangulo = new Array();
            cubo = new Array();
            brazoDer = new Array();
            piernaIzq = new Array();
            piernaDer = new Array();
            _r = new DollarRecognizer();

            var canvas = document.getElementById('myCanvas');
            canvas.width = window.innerWidth*0.29;
            canvas.height = window.innerHeight*0.49;
            _g = canvas.getContext('2d');
            _g.fillStyle = "rgb(0,0,225)";
            _g.strokeStyle = "rgb(0,0,225)";
            _g.lineWidth = 3;
            _g.font = "16px Gentilis";
            _rc = getCanvasRect(canvas); // canvas rect on page
            _g.fillStyle = "rgb(255,255,136)";
            _g.fillRect(0, 0, _rc.width, 20);

            _isDown = false;

}

function addElements(){

    containerOpciones = document.createElement('div');
    containerOpciones.id = 'containerOpciones';
    var opciones = document.getElementById("opciones");
    while (opciones.hasChildNodes()) {
        opciones.removeChild(opciones.firstChild);
    }
    opciones.appendChild(containerOpciones);
    
    if (b_circulo){

        b_circulo = false;
        material = new THREE.MeshPhongMaterial({ bumpScale: 1, color: 0xff3300, specular: 0xffaa00, shininess: 50, metal: true, shading: shading } );
        
        var info = document.createElement('img');
        var source = 'esfera.png';
        addImgOpciones(info,source);
        containerOpciones = document.getElementById('containerOpciones');
        opciones.replaceChild(info,containerOpciones);
        
        info = document.createElement('img');
        source = 'piramide_cilindrica.png';
        addImgOpciones(info,source);
        opciones.appendChild(info);
        
        info = document.createElement('img');
        source = 'cilindro.png';
        addImgOpciones(info,source);
        opciones.appendChild(info);
        
        info = document.createElement('img');
        source = 'torus.png';
        addImgOpciones(info,source);
        opciones.appendChild(info);
    }
    if (b_triangulo){
        b_triangulo = false;
        material = new THREE.MeshPhongMaterial({ bumpScale: 1, color: 0x33ff33, specular: 0xffaa00, shininess: 50, metal: true, shading: shading } );
        var info = document.createElement('img');
        var source = 'piramide.png';
        addImgOpciones(info,source);
        containerOpciones = document.getElementById('containerOpciones');
        document.getElementById("opciones").replaceChild(info,containerOpciones);
    }
    if (b_rectangulo){
        b_rectangulo = false;
        material = new THREE.MeshPhongMaterial({ bumpScale: 1, color: 0xbbbb33, specular: 0xffaa00, shininess: 50, metal: true, shading: shading } );
        var info = document.createElement('img');
        var source = 'cubo.png';
        addImgOpciones(info,source);
        containerOpciones = document.getElementById('containerOpciones');
        document.getElementById("opciones").replaceChild(info,containerOpciones);
        
        info = document.createElement('img');
        source = 'octaedro.png';
        addImgOpciones(info,source);
        opciones.appendChild(info);
    }


}


function dibujarEsfera(){
    sphere = new THREE.Mesh(new THREE.SphereGeometry( 17, 32, 32), material);
    sphere.position.set(-25,34,-20);
    scene.add(sphere);
}

function dibujarPiramide(){
    piramide = new THREE.Mesh(new THREE.TetrahedronGeometry(25,0),material);
    piramide.rotation.z = Math.PI/180 * 45;
    piramide.rotation.x = Math.PI/180 * -35;
    piramide.position.set(0,0,10);
    scene.add(piramide);
}

function dibujarPiramideCilindrica(){
    
    var piramideCilindrica = new THREE.Mesh( new THREE.CylinderGeometry( 0, 10, 30, 50 ), material );
    scene.add( piramideCilindrica );
}

function dibujarCubo(){
    cube = new THREE.Mesh(new THREE.BoxGeometry(25,25,25),material);
    cube.position.set(30,28,-25);
    scene.add(cube);
}

function dibujarOctaedro(){
    
    var geometry = new THREE.OctahedronGeometry( 40, 0 );
    var octaedro = new THREE.Mesh( geometry, material );
    scene.add( octaedro );
}

function dibujarCilindro(){
    
    var geometry = new THREE.CylinderGeometry( 10, 10, 30, 50 );
    var cylinder = new THREE.Mesh( geometry, material );
    scene.add( cylinder );
}

function dibujarTorus() {
    	var darkMaterial = new THREE.MeshBasicMaterial( { color: 0xffffcc } );
	var wireframeMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true, transparent: true } ); 
	var multiMaterial = [ darkMaterial, wireframeMaterial ]; 
    	var torus = THREE.SceneUtils.createMultiMaterialObject( 
	    // radius of entire torus, diameter of tube (less than total radius), 
		// sides per cylinder segment, cylinders around torus ("sides")
		new THREE.TorusGeometry( 30, 20, 16, 40 ),
		multiMaterial );
	torus.position.set(10, 10, -50);
	scene.add( torus );
}

function addImgOpciones(nodo,file) {
    var nombreFile = file.substring(0,file.length-4);
    nodo.style.margin = '0 auto';
    nodo.style.top = '1em';
    nodo.style.width = '5em';
    nodo.style.height = 'auto';
    nodo.style.color = 'white';
    nodo.src = file;
    nodo.alt = nombreFile;
    nodo.onclick = function (){
        if (nombreFile == 'esfera'){
            dibujarEsfera();
        }
        if (nombreFile == 'piramide_cilindrica'){
            dibujarPiramideCilindrica();
        }
        if (nombreFile == 'cubo'){
            dibujarCubo();
        }
        if (nombreFile == 'piramide'){
            dibujarPiramide();
        }
        if (nombreFile == 'octaedro'){
            dibujarOctaedro();
        }
        if (nombreFile == 'cilindro'){
            dibujarCilindro();
        }
        if (nombreFile == 'torus'){
            dibujarTorus();
        }
    };
}

function addLights(){
    
    // Setup the point lighting ion the middle of the roonm
    var pointLight = new THREE.PointLight(0xffffff, 1, 150);
    pointLight.position.set(0, 70, 70);
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
    camera.aspect = (window.innerWidth*0.70) / (window.innerHeight*0.99);

    // Update Projector
    camera.updateProjectionMatrix();

    // Set the new rendering size
    renderer.setSize(window.innerWidth*0.70 , window.innerHeight*0.99);
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