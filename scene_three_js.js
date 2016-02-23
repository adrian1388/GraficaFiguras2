        //
        // Startup
        //
        var ESCALARMOVIMIENTO = 0.1;

        var _isDown, _points, _r, _g, _rc;
        var b_circulo = false;
        var b_triangulo = false;
        var b_rectangulo = false;
        var rotar = false, trasladar = false, escalar = false;
        var ptoBorde = false, ptoCentroide = false;
        var objetoDibujado;
        var lista = new Array();
        var circulo,triangulo,cubo,brazoDer,piernaIzq,piernaDer;
        var centroide
        var puntoTraslado, puntoEscalado;
        var i = 0;
        var clock = new THREE.Clock();
        var collidableMeshList = [];
        var colorSelected;
        var lookAt = new THREE.Vector3();
        var lookAtX = new THREE.Vector3();
        

                // if ( objetoDibujado.length > 1 ) {
                //     drawConnectedPoint(_points.length - 2, _points.length - 1);
                // }

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
            controls.enabled = false; // disable controls

            _isDown = true;
            x -= _rc.x;
            y -= _rc.y - getScrollY();

            if ( b_circulo || b_triangulo || b_rectangulo ) {
                puntoTraslado = new Point(x, y);
                puntoEscalado = new Point(x, y);
                if (b_circulo){
                    i=0;
                    do{
                        var dist = Distance( puntoEscalado, circulo[i] );
                        if( dist < 20 ){
                            ptoBorde = true;
                        }else{
                            ptoBorde = false;
                        }
                        i++;
                    }while( ptoBorde == false && i < circulo.length );
                }
                if (b_triangulo){
                    i=0;
                    do{
                        var dist = Distance( puntoEscalado, triangulo[i] );
                        if( dist < 20 ){
                            ptoBorde = true;
                        }else{
                            ptoBorde = false;
                        }
                        i++;
                    }while( ptoBorde == false && i < triangulo.length );
                }
                if (b_rectangulo){
                    i=0;
                    do{
                        var dist = Distance( puntoEscalado, cubo[i] );
                        if( dist < 20 ){
                            ptoBorde = true;
                        }else{
                            ptoBorde = false;
                        }
                        i++;
                    }while( ptoBorde == false && i < cubo.length );
                }

                var dist = Distance( puntoTraslado, centroide );
                if ( dist < 20 ) {
                    ptoCentroide = true;
                } else {
                    ptoCentroide = false;
                }
            };

            //  _g.clearRect(0, 0, _rc.width, _rc.height);
            
            _points.length = 1; // clear
            _points[0] = new Point(x, y);
            drawText("Recording unistroke...");
            //_g.fillRect(x - 4, y - 3, 9, 9);

            //document.getElementById('objetoDibujado').value = x + ", " + y;
            //document.getElementById('objetoDibujado').value = "new Point( " + x + ", " + y + ")";
            objetoDibujado.length = 1;
            objetoDibujado[0] = new Point(x,y);
        }
        function mouseMoveEvent(x, y)
        {
            if (_isDown)
            {
                x -= _rc.x;
                y -= _rc.y - getScrollY();

                // if ( b_circulo || b_triangulo || b_rectangulo ) {
                //     if (Distance(puntoTraslado,centroide) < 20) {
                //         trasladar = true;
                //         if ( centroide.X + 5 < x ) {
                //             moveObjetoX = ESCALARMOVIMIENTO;
                //         } else if ( centroide.X - 5 > x ) {
                //             moveObjetoX = -ESCALARMOVIMIENTO;
                //         } else if ( ( centroide.X - 5 < x ) && ( centroide.X + 5 > x ) ) {
                //             moveObjetoX = 0;
                //         }
                //         if ( centroide.Y - 5 > y ) {
                //             moveObjetoY = ESCALARMOVIMIENTO;
                //         } else if ( centroide.Y + 5 < y ) {
                //             moveObjetoY = - ESCALARMOVIMIENTO;
                //         } else if ( ( centroide.Y - 5 < y ) && ( centroide.Y + 5 > y ) ) {
                //             moveObjetoY = 0;
                //         }
                //     };
                    // if (escalar) {
                    //     if ( puntoEscalado.X < x ) {
                    //         scaleObjetoX = 1;
                    //     } else if ( puntoEscalado.X > x ) {
                    //         scaleObjetoX = -1;
                    //     }
                    //     if ( puntoEscalado.Y > y ) {
                    //         scaleObjetoY = 1;
                    //     } else if ( puntoEscalado.Y < y ) {
                    //         scaleObjetoY = -1;
                    //     }
                    // };
                // };

                _points[_points.length] = new Point(x, y); // append
                coloRear(colorSelected,3);
                
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
            controls.enabled = true; // enable controls

            if (_isDown)
            {
                x -= _rc.x;
                y -= _rc.y - getScrollY();
                _isDown = false;
                if ( b_circulo || b_triangulo || b_rectangulo ) {
                    if (trasladar) {
                        trasladar = false;
                        moveObjetoX = 0;
                        moveObjetoY = 0;
                    };
                };
                // if (escalar) {
                //         escalar = false;
                //         scaleObjetoX = 0;
                //         scaleObjetoY = 0;
                //     };
                if (_points.length >= 10)
                {
                    var result = _r.Recognize(_points, document.getElementById('useProtractor').checked);
                    if (result.Score > 1.0){
                        drawText("Result: " + result.Name + " (" + round(result.Score,2) + ").");
                        //drawText("Result: " + result.Name);
                        if (result.Name == "circle") {
                            onClickLimpiar();
                            b_circulo = true;
                            addElements();
                            for ( i = 0; i < objetoDibujado.length; i++) {
                                circulo[i] = objetoDibujado[i];
                            }
                            centroide = Centroid(circulo);
                            drawPoint(centroide.X,centroide.Y);
                            coloRear(colorSelected,3);
                            for ( i = 0; i < circulo.length - 2; i++) {
                                drawTrazo(i, i+1);
                            }
                            
                            
                        } else if (result.Name == "triangle") {
                            onClickLimpiar();
                            b_triangulo = true;
                            addElements();
                            
                            for ( i = 0; i < objetoDibujado.length; i++) {
                                triangulo[i] = objetoDibujado[i];
                            }
                            centroide = Centroid(triangulo);
                            drawPoint(centroide.X,centroide.Y);
                            coloRear(colorSelected,3);
                            for ( i = 0; i < triangulo.length - 2; i++) {
                                drawTrazo(i, i+1);
                            }
                            
                        
                        } else if (result.Name == "rectangle") {
                            onClickLimpiar();
                            b_rectangulo = true;
                            addElements();
                            
                            for ( i = 0; i < objetoDibujado.length; i++) {
                                cubo[i] = objetoDibujado[i];
                            }
                            centroide = Centroid(cubo);
                            drawPoint(centroide.X,centroide.Y);
                            coloRear(colorSelected,3);
                            for ( i = 0; i < cubo.length - 2; i++) {
                                drawTrazo(i, i+1);
                            }
                            
                        
                        } else if (( b_circulo || b_triangulo || b_rectangulo ) && result.Name == "rotar" && result.Score > 4.0) {
                            if (ptoBorde){
                                rotar = true;
                            }
                            else rotar = false;
                        
                            if (b_circulo)  mifuncion(objetoDibujado,circulo);
                            if (b_triangulo)  mifuncion(objetoDibujado,triangulo);
                            if (b_rectangulo)  mifuncion(objetoDibujado,cubo);

                            drawText("Haz clic para detener.");

                        
                        } else if (( b_circulo || b_triangulo || b_rectangulo ) && result.Name == "flecha" ) {

                            //escalar
                            
                            if (ptoBorde) {
                                var ultX = objetoDibujado[9].X;
                                var ultY = objetoDibujado[9].Y;
                                var distPtoEsc = Distance( centroide, puntoEscalado );
                                var distUlt    = Distance( centroide, new Point(ultX,ultY) );
                                
                                if ( distPtoEsc < distUlt ) {
                                    escalar = true;
                                    if ( puntoEscalado.X + 5 < ultX ) scaleObjetoX = 1;
                                    else scaleObjetoX = 0;
                                    if ( puntoEscalado.Y - 5 > ultY ) scaleObjetoY = 1;
                                    else scaleObjetoY = 0;
                                } else if ( distPtoEsc > distUlt ) {
                                    escalar = true;
                                    if ( puntoEscalado.X - 5 > ultX ) scaleObjetoX = -1;
                                    else scaleObjetoX = 0;
                                    if ( puntoEscalado.Y + 5 < ultX ) scaleObjetoY = -1;
                                    else scaleObjetoY = 0;
                                }

                                if (b_circulo)  mifuncion(objetoDibujado,circulo);
                                if (b_triangulo)  mifuncion(objetoDibujado,triangulo);
                                if (b_rectangulo)  mifuncion(objetoDibujado,cubo);

                                drawText("Haz clic para detener.");
                                
                            }

                            //trasladar

                            if (ptoCentroide) {

                                var ultX = objetoDibujado[5].X;
                                var ultY = objetoDibujado[5].Y;
                                
                                if ( centroide.X + 5 < ultX ) {
                                    trasladar = true;
                                    moveObjetoX = ESCALARMOVIMIENTO;
                                } else if ( centroide.X - 5 > ultX ) {
                                    trasladar = true;
                                    moveObjetoX = -ESCALARMOVIMIENTO;
                                } else if ( ( centroide.X - 5 < ultX ) && ( centroide.X + 5 > ultX ) ) {
                                    moveObjetoX = 0;
                                }

                                if ( centroide.Y - 5 > ultY ) {
                                    trasladar = true;
                                    moveObjetoY = ESCALARMOVIMIENTO;
                                } else if ( centroide.Y + 5 < ultY ) {
                                    trasladar = true;
                                    moveObjetoY = - ESCALARMOVIMIENTO;
                                } else if ( ( centroide.Y - 5 < ultY ) && ( centroide.Y + 5 > ultY ) ) {
                                    moveObjetoY = 0;
                                }

                                if (b_circulo)  mifuncion(objetoDibujado,circulo);
                                if (b_triangulo)  mifuncion(objetoDibujado,triangulo);
                                if (b_rectangulo)  mifuncion(objetoDibujado,cubo);

                                drawText("Haz clic para detener.");

                            }
                            
                        } else if (result.Name == "borrar"){
                            //borrar objeto de la escena 3js
                            if (lista.length > 0) {
                                scene.remove( lista[lista.length-1] );
                                lista[lista.length-1] = null;
                                lista.length = lista.length - 1;
                                objeto = lista[lista.length - 1];
                            }
                            
                            onClickLimpiar();

                        }else {
                            onClickLimpiar();
                        }
                        //objetoDibujado.length = 1;

                    }
                    else{
                        drawText("Result: Trazo no reconocido. ¡Inténtalo de nuevo!");

                        coloRear("#dddddd",5);
                        for ( i = 0; i < objetoDibujado.length - 2; i++) {
                            drawTrazo(i, i+1);
                        }

                        //document.getElementById('objetoDibujado').value = "";
                        objetoDibujado.length = 0;
                    }
                    
                }
                else // fewer than 10 points were inputted
                {
                    if ( escalar || rotar || trasladar) {
                        escalar = false;
                        scaleObjetoX = 0;
                        scaleObjetoY = 0;

                        rotar = false;

                        trasladar = false;
                    }
                    drawText("Too few points made. Please try again.");
                    coloRear("#dddddd",5);
                    for ( i = 0; i < objetoDibujado.length - 2; i++) {
                        drawTrazo(i, i+1);
                    }

                    
                }
            }
        }
        /* Gráficos: HM-ini */
        function mifuncion(objetodibujado,objetoReal) {
            drawText("Haz clic para detener.");
            _g.clearRect(0, 0, _rc.width, _rc.height);

            coloRear("rgb(100,190,150)",3);
            for ( i = 0; i < objetodibujado.length - 2; i++) {
                drawTrazo(i, i+1);
            }
            for ( i = 0; i < objetoReal.length; i++) {
                objetodibujado[i] = objetoReal[i];
            }
            coloRear(colorSelected,3);
            for ( i = 0; i < objetoReal.length - 2; i++) {
                drawTrazo(i, i+1);
            }
        }
        function cambiarColorDibujo( color ){

        }
        function drawPoint(x, y){
            _g.beginPath();
            _g.arc(x, y, 1, 0, 2 * Math.PI, true);
            _g.stroke();
        }
        function drawTrazo(desde, hasta)
        {
            //_g.stroke();
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
            rotar = false;
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
            //_g.stroke();
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

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var SELECTED;



var scene;
var camera;
var renderer;
var Top, Group;
var shininess = 50, specular = 0x333333, bumpScale = 1, shading = THREE.SmoothShading;
var controls;
var objeto;
var moveObjetoX, moveObjetoY, scaleObjetoX = 1, scaleObjetoY = 1;



window.addEventListener("load", init, false);
animate();

function init(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(50, window.innerWidth*0.70 / window.innerHeight*0.99, 1, 10000); // PerspectiveCamera(fov, aspect, near, far)
    scene.add( camera );
    camera.position.set(0, 100, 300);

    addHtml();
    addElements();
    addLights();
    

    renderer = new THREE.WebGLRenderer({preserveDrawingBuffer   : true  }); // required to support .toDataURL()
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
            colorSelected = "rgb(0,0,225)";
                $("#clr > div").click(function(){
                    colorSelected=$(this).css("background-color");
                });
            document.getElementById('infobutton').style.display = 'none';
            document.getElementById('downloadScene').style.display = 'none';

}

function addElements(){

    containerOpciones = document.createElement('div');
    containerOpciones.id = 'containerOpciones';
    var opciones = document.getElementById("opciones");
    while (opciones.hasChildNodes()) {
        opciones.removeChild(opciones.firstChild);
    }
    opciones.appendChild(containerOpciones);

    addArrowAxis();
    
    if (b_circulo){
        material = new THREE.MeshPhongMaterial({ bumpScale: 1, color: colorSelected, specular: 0xffffff, shininess: 50, metal: true, shading: shading } );
        
        var info = document.createElement('img');
        var source = 'esfera2.png';
        addImgOpciones(info,source);
        containerOpciones = document.getElementById('containerOpciones');
        opciones.replaceChild(info,containerOpciones);
        
        info = document.createElement('img');
        source = 'piramide_cilindrica2.png';
        addImgOpciones(info,source);
        opciones.appendChild(info);
        
        info = document.createElement('img');
        source = 'cilindro2.png';
        addImgOpciones(info,source);
        opciones.appendChild(info);
        
        info = document.createElement('img');
        source = 'torus2.png';
        addImgOpciones(info,source);
        opciones.appendChild(info);
    }
    if (b_triangulo){
        material = new THREE.MeshPhongMaterial({ bumpScale: 1, color: colorSelected, specular: 0xffffff, shininess: 50, metal: true, shading: shading } );
        var info = document.createElement('img');
        var source = 'piramide2.png';
        addImgOpciones(info,source);
        containerOpciones = document.getElementById('containerOpciones');
        document.getElementById("opciones").replaceChild(info,containerOpciones);

        info = document.createElement('img');
        source = 'piramide_cilindrica2.png';
        addImgOpciones(info,source);
        opciones.appendChild(info);
    }
    if (b_rectangulo){
        material = new THREE.MeshPhongMaterial({ bumpScale: 1, color: colorSelected, specular: 0xffffff, shininess: 50, metal: true, shading: shading } );
        var info = document.createElement('img');
        var source = 'cubo2.png';
        addImgOpciones(info,source);
        containerOpciones = document.getElementById('containerOpciones');
        document.getElementById("opciones").replaceChild(info,containerOpciones);
        
        info = document.createElement('img');
        source = 'octaedro.png';
        addImgOpciones(info,source);
        opciones.appendChild(info);
    }


}

function addArrowAxis() {
    var axis = new THREE.AxisHelper( 10000 );
    axis.position.set( 0, 0, 0 );
    //scene.add( axis );

    //PISO
    material = new THREE.MeshPhongMaterial({ bumpScale: 1, color: 0x555555, specular: 0xffffff, shininess: 50, metal: true, shading: shading } );
    var floor = new THREE.Mesh(new THREE.PlaneGeometry(1000,1000,50,50),material);
    scene.add( floor );
    floor.rotateOnAxis( new THREE.Vector3(1,0,0), (Math.PI / 2)*3 );
}
function dibujarEsfera(){
    objeto = new THREE.Mesh(new THREE.SphereGeometry( 20, 32, 32), material);
    objeto.position.set(0,20,0);
    lista.push(objeto);
    scene.add(objeto);
    collidableMeshList.push(objeto);
}

function dibujarPiramide(){
    objeto = new THREE.Mesh(new THREE.TetrahedronGeometry(40,0),material);
    // objeto.rotation.z = Math.PI/180 * 45;
    // objeto.rotation.x = Math.PI/180 * -35;
    objeto.position.set(0,20,0);
    lista.push(objeto);
    scene.add(objeto);
    collidableMeshList.push(objeto);
}

function dibujarPiramideCilindrica(){
    
    objeto = new THREE.Mesh( new THREE.CylinderGeometry( 0, 20, 40, 100 ), material );
    objeto.position.set(0,20,0);
    lista.push(objeto);
    scene.add( objeto );
    collidableMeshList.push(objeto);
}

function dibujarCubo(){
    objeto = new THREE.Mesh(new THREE.BoxGeometry(40,40,40),material);
    objeto.position.set(0,20,0);
    lista.push(objeto);
    scene.add(objeto);
    collidableMeshList.push(objeto);
}

function dibujarOctaedro(){
    var geometry = new THREE.OctahedronGeometry( 20, 0 );
    objeto = new THREE.Mesh( geometry, material );
    objeto.position.set(0,20,0);
    lista.push(objeto);
    scene.add( objeto );
    collidableMeshList.push(objeto);
}

function dibujarCilindro(){
    var geometry = new THREE.CylinderGeometry( 20, 20, 40, 100 );
    objeto = new THREE.Mesh( geometry, material );
    objeto.position.set(0,20,0);
    lista.push(objeto);
    scene.add( objeto );
    collidableMeshList.push(objeto);
}

function dibujarTorus() {
    var geometry = new THREE.TorusGeometry( 16, 4, 15, 100 );
    objeto = new THREE.Mesh( geometry, material );
    objeto.position.set(0,20,0);
    lista.push(objeto);
    scene.add( objeto );
    collidableMeshList.push(objeto);
}

function rotarObjeto () {
    var delta = clock.getDelta(); // seconds.
    var rotateAngle = Math.PI / 4 * delta;   // pi/4 radians (90 degrees) per second
    //var vectorRotacion = camera.lookAt;

    if (rotar) {
        objeto.rotateOnAxis( lookAtX, rotateAngle);
    }
}

function trasladarObjeto () {

    if (trasladar) {
        // objeto.translateX( moveObjetoX );
        // objeto.translateY( moveObjetoY );
        // objeto.translateZ( lookAtX.Z );
        objeto.translateOnAxis( lookAtX,moveObjetoX );
        objeto.translateOnAxis( new THREE.Vector3(0,1,0),moveObjetoY );
    }
}

function escalarObjeto () {
    var delta = 0.01;
    var moveDistance = 10000 * delta; // 200 pixels per second

    if (escalar) {
        objeto.scale.x = objeto.scale.x + delta*scaleObjetoX*lookAtX.x;
        objeto.scale.y = objeto.scale.y + delta*scaleObjetoY;
        objeto.scale.z = objeto.scale.z + delta*scaleObjetoX*(-lookAtX.z);
    }
}

function cambiarMaterial () {
    material = new THREE.MeshPhongMaterial({ bumpScale: 1, color: colorSelected, specular: 0xffffff, shininess: 20, metal: false, shading: shading } );
}

function obtenerCameraLookVector () {
    lookAt.copy(camera.position);
    lookAt.setY(-1);
    lookAt.multiplyScalar(-1);
    lookAt = lookAt.normalize();
    lookAtX = lookAtX.crossVectors(lookAt,new THREE.Vector3(0,1,0));
}

function addImgOpciones(nodo,file) {
    var nombreFile = file.substring(0,file.length-4);
    nodo.style.margin = '0 auto';
    nodo.style.top = '1em';
    nodo.style.width = '6em';
    nodo.style.height = 'auto';
    nodo.style.color = 'white';
    nodo.src = file;
    nodo.alt = nombreFile;
    nodo.onclick = function (){
        if (nombreFile == 'esfera2'){
            dibujarEsfera();
        }
        if (nombreFile == 'piramide_cilindrica2' || nombreFile == 'piramide_cilindrica_red'){
            dibujarPiramideCilindrica();
        }
        if (nombreFile == 'cubo2'){
            dibujarCubo();
        }
        if (nombreFile == 'piramide2'){
            dibujarPiramide();
        }
        if (nombreFile == 'octaedro' || nombreFile == 'octaedro_cafe'){
            dibujarOctaedro();
        }
        if (nombreFile == 'cilindro2'){
            dibujarCilindro();
        }
        if (nombreFile == 'torus2'){
            dibujarTorus();
        }
    };
}

function addLights(){
    
    // Setup the point lighting ion the middle of the roonm
    //var pointLight = new THREE.PointLight(0xffffff, 1, 150);
    //pointLight.position.set(0, 70, 70);
    //scene.add(pointLight);
    //scene.add(new THREE.PointLightHelper(bluePoint, 3));

    // Setup ambient lighting for the room
    var hemLight = new THREE.HemisphereLight(0xFFFFFF, 0xffffff, .40);
    hemLight.position.set( 0,10000,0 );
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

function miMouseDown(x, y) {

    mouse.x = ( x / (window.innerWidth) ) * 2 - 1;
    mouse.y = - ( y / (window.innerHeight) ) * 2 + 1;     
    raycaster.setFromCamera( mouse, camera );
        var intersects = raycaster.intersectObjects( scene );
        if ( intersects.length > 0 ) {
            SELECTED = intersects[ 0 ].object;

            SELECTED.material.color.set(0xff0000);

            // var intersects = raycaster.intersectObject( plane );
            // if ( intersects.length > 0 ) {
            //     offset.copy( intersects[ 0 ].point ).sub( plane.position );
            // }
            container.style.cursor = 'move';
        }
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
   rotarObjeto();
   trasladarObjeto();
   escalarObjeto();
   cambiarMaterial();
   obtenerCameraLookVector();
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

function copyCanvas() {
    imgData = renderer.domElement.toDataURL();

    // create a new image and add to the document
    // imgNode = document.createElement("img");
    // imgNode.src = imgData;
    // document.body.appendChild(imgNode);

   // alternative way, which downloads the image 
   var link = document.createElement("a");
   link.download = 'capture.png';
   link.href = imgData;
   link.click();
}
window.addEventListener("keyup", copyCanvas);