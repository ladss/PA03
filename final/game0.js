/*
Game
This is a ThreeJS program which implements a simple game
The user flies a bird through the sky

*/


	// First we declare the variables that hold the objects we need
	// in the animation code
	var scene, renderer;  // all threejs programs need these
	var camera, avatarCam, edgeCam;  // we have two cameras in the main scene
	var avatar; var cactus;
	// here are some mesh objects ...

	var controls =
	     {fwd:false, bwd:false, left:false, right:false,
				speed:10, fly:false, reset:false,
		    camera:camera}

	var gameState =
	     {scene:'main', camera:'none' }


	// Here is the main game control
  	init(); //
	initControls();
	animate();  // start the animation loop!


	/**
	  To initialize the scene, we initialize each of its components
	*/
	function init(){
    		initPhysijs();
		scene = initScene();
		initRenderer();
		createMainScene();
	}


	function createMainScene(){
      		// setup lighting
		var light1 = createPointLight();
		light1.position.set(0,200,20);
		scene.add(light1);
		var light0 = new THREE.AmbientLight( 0xffffff,0.25);
		scene.add(light0);

		// create main camera
		camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
		camera.position.set(0,50,0);
		camera.lookAt(0,0,0);

		// create the ground and the skybox
 		var ground = createGround('sand.jpg');
 		scene.add(ground);
+		var skybox = createSkyBox('sky_texture.png',1);
 		scene.add(skybox);
 
 			// create the avatar

		// create the avatar
		avatarCam = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
		initCactus();
		avatarCam.translateY(-4);
		avatarCam.translateZ(3);
		//scene.add(avatar);
		gameState.camera = avatarCam;

		edgeCam = new THREE.PerspectiveCamera( 120, window.innerWidth / window.innerHeight, 0.1, 1000 );
		edgeCam.position.set(20,20,10);



	}
	/* We don't do much here, but we could do more!
	*/
	function initScene(){
		//scene = new THREE.Scene();
    		var scene = new Physijs.Scene();
		return scene;
	}

  function initPhysijs(){
    Physijs.scripts.worker = '/js/physijs_worker.js';
    Physijs.scripts.ammo = '/js/ammo.js';
  }
	/*
		The renderer needs a size and the actual canvas we draw on
		needs to be added to the body of the webpage. We also specify
		that the renderer will be computing soft shadows
	*/
	function initRenderer(){
		renderer = new THREE.WebGLRenderer();
		renderer.setSize( window.innerWidth, window.innerHeight-50 );
		document.body.appendChild( renderer.domElement );
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	}


	function createPointLight(){
		var light;
		light = new THREE.PointLight( 0xffffff);
		light.castShadow = true;
		//Set up shadow properties for the light
		light.shadow.mapSize.width = 2048;  // default
		light.shadow.mapSize.height = 2048; // default
		light.shadow.camera.near = 0.5;       // default
		light.shadow.camera.far = 500      // default
		return light;
	}

	function createGround(image){
		// creating a textured plane which receives shadows
		var geometry = new THREE.PlaneGeometry( 360, 360, 256 );
		var texture = new THREE.TextureLoader().load( '../images/'+image );
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( 15, 15 );
		var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} );
		var pmaterial = new Physijs.createMaterial(material,0.9,0.5);
		//var mesh = new THREE.Mesh( geometry, material );
		var mesh = new Physijs.BoxMesh( geometry, pmaterial, 0 );

		mesh.receiveShadow = true;

		mesh.rotateX(Math.PI/2);
		return mesh
		// we need to rotate the mesh 90 degrees to make it horizontal not vertical
	}



	function createSkyBox(image,k){
		// creating a textured plane which receives shadows
		var geometry = new THREE.SphereGeometry( 160, 160, 160 );
		var texture = new THREE.TextureLoader().load( '../images/'+image );
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( k, k );
		var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide } );
		//var pmaterial = new Physijs.createMaterial(material,0.9,0.5);
		//var mesh = new THREE.Mesh( geometry, material );
		var mesh = new THREE.Mesh( geometry, material, 0 );

		mesh.receiveShadow = false;


		return mesh
		// we need to rotate the mesh 90 degrees to make it horizontal not vertical


	}

	function createCloud(){
		var geometry1 = new THREE.SphereGeometry( 5, 10, 10 );
		var material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
		var sphere1 = new THREE.Mesh( geometry1, material );
		var geometry2 = new THREE.SphereGeometry( 2, 5, 5 );
		var sphere2 = new THREE.Mesh( geometry2, material );
		sphere2.setX(sphere1.x-5);
		sphere2.setY(sphere1.y-1);
		var sphere3 = new THREE.Mesh( geometry2, material );
		sphere3.setX(sphere1.x+5);
		sphere3.setY(sphere1.y+1);
	}

	function initCactus() {
			var loader = new THREE.OBJLoader();
			loader.load("../models/cactus.obj",
					function ( obj ) {
						console.log("loading cactus.obj file");
						cactus = obj;

						var geometry = cactus.children[0].geometry;
						var material = cactus.children[0].material;
						cactus = new Physijs.BoxMesh(geometry, material);

						avatarCam = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
						gameState.camera = avatarCam;

						avatarCam.position.set(0,6,-15);
						avatarCam.lookAt(0,4,10);
						cactus.add(avatarCam);
						cactus.position.set(-40,20,-40);
						cactus.castShadow = false;
						scene.add( cactus  );
						avatar=cactus;

						console.log("cactus has been added");
					},

					function(xhr) {
						console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
					},

					function(err) {
						console.log("error in loading: "+err);
					}
				)
		}




	var clock;

	function initControls(){
		// here is where we create the eventListeners to respond to operations

		  //create a clock for the time-based animation ...
			clock = new THREE.Clock();
			clock.start();

			window.addEventListener( 'keydown', keydown);
			window.addEventListener( 'keyup',   keyup );
  }

	function keydown(event){
		console.log("Keydown:"+event.key);
		//console.dir(event);
		// this is the regular scene
		switch (event.key){
			// change the way the avatar is moving
			case "w": controls.fwd = true;  break;
			case "s": controls.bwd = true; break;
			case "a": controls.left = true; break;
			case "d": controls.right = true; break;
			case "z": controls.up = true; break;
			case "x": controls.down = true; break;
			case "m": controls.speed = 30; break;
      			case " ": controls.fly = true; break;


			// switch cameras
			case "1": gameState.camera = camera; break;
			case "2": gameState.camera = avatarCam; break;

			// move the camera around, relative to the avatar
			case "ArrowLeft": avatarCam.translateY(1);break;
			case "ArrowRight": avatarCam.translateY(-1);break;
			case "ArrowUp": avatarCam.translateZ(-1);break;
			case "ArrowDown": avatarCam.translateZ(1);break;
			case "q": avatarCam.rotateY(0.5) = true; break;
			case "e": avatarCam.rotateY(-0.5) = true; break;
		}

	}

	function keyup(event){
		//console.log("Keydown:"+event.key);
		//console.dir(event);
		switch (event.key){
			case "w": controls.fwd   = false;  break;
			case "s": controls.bwd   = false; break;
			case "a": controls.left  = false; break;
			case "d": controls.right = false; break;
			case "z": controls.up    = false; break;
			case "x": controls.down  = false; break;
			case "m": controls.speed = 30; break;
      		 	case " ": controls.fly = false; break;
		}
	}



  function updateAvatar(){
		"change the avatar's linear or angular velocity based on controls state (set by WSAD key presses)"

		var forward = avatar.getWorldDirection();

		if (controls.fwd){
			avatar.setLinearVelocity(forward.multiplyScalar(controls.speed));
		} else if (controls.bwd){
			avatar.setLinearVelocity(forward.multiplyScalar(-controls.speed));
		} else {
			var velocity = avatar.getLinearVelocity();
			velocity.x=velocity.z=0;
			avatar.setLinearVelocity(velocity); //stop the xz motion
		}

    if (controls.fly){
      avatar.setLinearVelocity(new THREE.Vector3(0,controls.speed,0));
    }

		if (controls.left){
			avatar.setAngularVelocity(new THREE.Vector3(0,controls.speed*0.1,0));
		} else if (controls.right){
			avatar.setAngularVelocity(new THREE.Vector3(0,-controls.speed*0.1,0));
		}

    if (controls.reset){
      	avatar.__dirtyRotation = true;
				avatar.rotation.set(0,0,0);
				avatar.__dirtyPosition = true;
				avatar.position.set(-40,20,-40);
				avatarCam.lookAt(0,4,10);
				gameState.scene = 'main';
    }
		avatar.material.color.b=0
  }

	}
