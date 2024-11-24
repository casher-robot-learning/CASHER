import * as THREE from 'three'
import { GUI } from '../node_modules/three/examples/jsm/libs/lil-gui.module.min.js';
import { OrbitControls    } from 'three/examples/jsm/controls/OrbitControls.js';
import { USDZLoader } from "three-usdz-loader";
import { wgsl } from 'three/webgpu';
import { ThreeMFLoader } from 'three/examples/jsm/Addons.js';


const usdzLoader = new USDZLoader(`${import.meta.env.BASE_URL}`);

export class USDZScene {
  constructor() {

    this.container = document.getElementById("viz");
    // this.container = document.createElement("div");
    // document.body.appendChild( this.container );


    // setup scene
    this.scene = new THREE.Scene();
    this.scene.name = 'scene';

    this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.001, 100 );
    this.camera.name = 'PerspectiveCamera';
    this.camera.position.set(0,-1,1.5);
    this.camera.rotation.set(0,0,0)
    this.scene.add(this.camera);

    this.scene.background = new THREE.Color(0.15, 0.25, 0.35);

    this.ambientLight = new THREE.AmbientLight( 0xffffff, 0.8 );
    this.ambientLight.name = 'AmbientLight';
    this.scene.add( this.ambientLight );

    this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    this.renderer.setPixelRatio( window.devicePixelRatio );
    // this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

    // this.container.appendChild( this.renderer.domElement );
    
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 1, 0);
    this.controls.panSpeed = 2;
    this.controls.zoomSpeed = 1;
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 1.0;
    this.controls.screenSpacePanning = true;
    this.controls.update()// Remove all rotation limits
    let controls = this.controls
    let camera = this.camera
    let initPos = [0, 0, 3]
    let radius = camera.position.distanceTo(controls.target); // Initial distance
    const fixedTiltAngle = Math.PI / 6; // 30 degrees tilt

    this.controls.addEventListener('change', () => {

      // Calculate the new camera position around the Z-axis
      //
      camera.position.z = initPos[2]; // Keep Z constant
       // Compute the angle from the mouse movement
      let angle = Math.atan2(camera.position.y - controls.target.y, camera.position.x - controls.target.x);

      // Update camera position to maintain circular motion in the X-Y plane
      camera.position.x = controls.target.x + radius * Math.cos(angle);
      camera.position.y = controls.target.y + radius * Math.sin(angle);

 const lookDirection = new THREE.Vector3(
    -Math.cos(angle), // Point backward in X based on orbit
    -Math.sin(angle), // Point backward in Y based on orbit
    0 // Stay horizontal in the Z-plane
  );

  // Dynamically tilt the camera around the Z-axis
  const upDirection = new THREE.Vector3(0, 0, 1); // Z-axis up
  camera.up.copy(upDirection); // Ensure correct tilt alignment
  camera.lookAt(controls.target);
    });

    this.gui = new GUI()
    this.guiParams = {
      environment: 'obj2sink_2'
    }
    this.gui.add(this.guiParams, 'environment', ['obj2sink_2'])

  }

  setSize(width, height) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( width, height );
  }

  getElement() {
    return this.renderer.domElement;
  }

  
  async loadJSON() {
    try {
       // Fetch the JSON file
      // const response = await fetch('/public_release/obj2sink_2.json'); // Adjust path as needed
      const response = await fetch(`${import.meta.env.BASE_URL}public_release/obj2sink_2.json`);
      // Check for response errors
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log(response)
      // Parse JSON
      const data = await response.json();

      this.traj = data["traj"];
      this.obj2idx = data["obj2idx"]
    } catch (error) {
      console.log("error in json:", error)
    }
  }

  async init() {
    const env = new THREE.Group();
    const robot = new THREE.Group();
    this.env = env;
    this.robot = robot;
    this.scene.add(env);
    this.scene.add(robot);

    await this.loadJSON() 
     
    // Load your file. File is of type File
    const response = await fetch(`${import.meta.env.BASE_URL}public_release/usd/obj2sink_2.usdz`);
    const blob = await response.blob();
     const file = new File([blob], 'test.usdz', {
      type: 'model/vnd.usdz+zip',  // MIME type for USDZ
      lastModified: new Date().getTime() // Optional: set last modified time
    });

    const loadedModel = await usdzLoader.loadFile(file, env);
    console.log("REACHED")

    const response2 = await fetch(`${import.meta.env.BASE_URL}public_release/usd/franka.usdz`);
    const blob2 = await response2.blob();
     const file2 = new File([blob2], 'test2.usdz', {
      type: 'model/vnd.usdz+zip',  // MIME type for USDZ
      lastModified: new Date().getTime() // Optional: set last modified time
    });
    const loadedModel2 = await usdzLoader.loadFile(file2, robot);

    this.renderer.setAnimationLoop(this.render.bind(this));

    this.bowl = this.env.children[this.obj2idx["bowl"]]
    this.sink = this.env.children[this.obj2idx["sink"]]
    
    this.step = 0

    const axesHelper = new THREE.AxesHelper(1); // 2 = size of the axes
    this.scene.add(axesHelper)

    this.link2idx = {
      'panda_link0': 0,
      'panda_link1': 1,
      'panda_link2': 2,
      'panda_link3': 3,
      'panda_link4': 4,
      'panda_link5': 5,
      'panda_link6': 6,
      'panda_link7': 7,
      'panda_hand': 8,
      'panda_leftfinger': 9,
      'panda_rightfinger': 10,
    }

    console.log(this.scene)
    this.env.rotateZ(1.57)
    this.robot.rotateZ(1.57)
  }

  render(timeMS) {
    // update everything's pos and quat


    // this.scene.updateMatrixWorld(true)
    // this.bowl.updateMatrixWorld(true)
    const step = Math.floor(this.step)

    const permuteMat = new THREE.Matrix4();
    permuteMat.set( 1, 0, 0, 0,
                    0, 0, 1, 0,
                    0, -1, 0, 0,
                    0, 0, 0, 1)
                  
    var pos = new THREE.Vector3(...this.traj[step].obj.pos)
    var quat = new THREE.Quaternion(...this.traj[step].obj.rot)
    var mat = new THREE.Matrix4().makeRotationFromQuaternion(quat)
    mat.multiply(permuteMat)

    // var newQuat = new THREE.Quaternion().setFromRotationMatrix(mat)

    // this.bowl.position.set(pos.x, pos.z, -pos.y)
    this.bowl.position.set(pos.x, pos.y, pos.z)
    this.bowl.quaternion.set(...quat)
    
    // var newPos = pos1.clone().add(pos2);
    // var newQuat = quat1.clone().multiply(quat2);
    // this.bowlGroup.position.set(...newPos);
    // this.bowlGroup.quaternion.set(...newQuat);
    // this.bowlGroup.position.set(...pos2)
    //
    pos = new THREE.Vector3(...this.traj[step].sink.pos)
    quat = new THREE.Quaternion(...this.traj[step].sink.rot)
    var mat = new THREE.Matrix4().makeRotationFromQuaternion(quat)
    mat.multiply(permuteMat)

    // var newQuat = new THREE.Quaternion().setFromRotationMatrix(mat)


    this.sink.position.set(pos.x, pos.y, pos.z)
    this.sink.quaternion.set(...quat);
    
    // newPos = pos1.clone().add(pos2);
    // newQuat = quat1.clone().multiply(quat2);
    // this.sinkGroup.position.set(...newPos);
    // this.sinkGroup.quaternion.set(...newQuat);

    let p = 0
    for (let link in this.link2idx) {
      let pose = this.traj[step][link]
      pos = new THREE.Vector3(...pose.pos)
      quat = new THREE.Quaternion(...pose.rot)
      var mat = new THREE.Matrix4().makeRotationFromQuaternion(quat)
      mat.multiply(permuteMat)
      this.robot.children[this.link2idx[link]* 2].position.set(pos.x, pos.y, pos.z)
      this.robot.children[this.link2idx[link]* 2].quaternion.set(...quat)
    // for(let link = 0; link < 22; link+=2) {
    //   this.robot.children[link].position.set(p,p,p)
      this.robot.children[this.link2idx[link]*2].updateMatrix()
    //   p += 0.1

    }



    this.bowl.updateMatrix()
    this.sink.updateMatrix()
    for (let mesh in this.robot.children) {
      // console.log(mesh)
    }
    // this.robot.updateMatrix()
    // console.log(this.bowl.position)
    // console.log(this.sink.position)
    
    this.controls.update();
    this.renderer.render( this.scene, this.camera );

    this.step += 0.2
    this.step = this.step % this.traj.length
  }
}
