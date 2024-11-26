import * as THREE from 'three'
import { GUI } from '../node_modules/three/examples/jsm/libs/lil-gui.module.min.js';
import { OrbitControls    } from 'three/examples/jsm/controls/OrbitControls.js';
import { USDZLoader } from "three-usdz-loader";
import { wgsl } from 'three/webgpu';
import { ThreeMFLoader } from 'three/examples/jsm/Addons.js';

import { LoadingManager } from 'three';
import URDFLoader from 'urdf-loader';


import { envs } from './constants.js';



export class USDZScene {
  constructor() {

    // this.container = document.getElementById("viz");
    // this.container = document.createElement("div");
    // document.body.appendChild( this.container );


    // setup scene
    this.scene = new THREE.Scene();
    this.scene.name = 'scene';

    // camera setup
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 50 );
    this.camera.position.set(0,1,1.5);
    this.camera.far = 100;
    this.camera.updateProjectionMatrix();



    this.scene.background = new THREE.Color(0.92, 0.83, 1);

    this.ambientLight = new THREE.AmbientLight( 0xffffff, 0.8 );
    this.ambientLight.name = 'AmbientLight';
    this.scene.add( this.ambientLight );

    this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    this.renderer.setPixelRatio( window.devicePixelRatio );
    // this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

    this.controls = new OrbitControls( this.camera, this.renderer.domElement );
    this.controls.saveState();
    this.camera.up.set(0, 1, 0); // Change up direction to Z-axis
      
    let controls = this.controls
    let camera = this.camera

    this.gui = new GUI({container: document.getElementById("viz")})
    this.guiParams = {
      environment: '2'
    }
    this.gui.add(this.guiParams, 'environment', envs).onChange( value => {
      this.readyToRender = false;
      this.viewerIsReady(false, [this.getElement(), this.gui.domElement], this);
      this.setup()
    });

    this.env = new THREE.Group();
    this.robot = new THREE.Group();
    this.scene.add(this.env);
    this.scene.add(this.robot);


    this.env.rotateZ(1.57)
    this.robot.rotateZ(1.57)

    this.env.rotateY(1.57)
    this.robot.rotateY(1.57)


    this.usdzLoader = new USDZLoader(`${import.meta.env.BASE_URL}`);
    this.manager = new LoadingManager();
    this.urdfLoader = new URDFLoader(this.manager);
  }

  setSize(width, height) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( width, height );
  }

  getElement() {
    return this.renderer.domElement;
  }

  async init(viewerIsReady) {
    console.log('reach')
    this.viewerIsReady = viewerIsReady;
    console.log('reach')

    await this.setup()
    console.log('reach')
    
    // viewerIsReady(true, this.getElement(), this);
    
    this.renderer.setAnimationLoop(this.render.bind(this));
    console.log('reach')
  }

  
  async loadJSON() {
    try {
       // Fetch the JSON file
      // const response = await fetch('/public_release/obj2sink_2.json'); // Adjust path as needed
      // demo.init()
      const response = await fetch(`${import.meta.env.BASE_URL}public_release/obj2sink_${this.guiParams.environment}.json`);
      // Check for response errors
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Parse JSON
      const data = await response.json();

      this.traj = data["traj"];
      this.obj2idx = data["obj2idx"]
    } catch (error) {
      console.log("error in json:", error)
    }
  }

  async setup() {

    console.log("meow")
    await this.loadJSON() 
    console.log("meow")

    this.env.clear()
    this.robot.clear()
     
    console.log("meow")
    // Load your file. File is of type File
    const response = await fetch(`${import.meta.env.BASE_URL}public_release/usd/obj2sink_${this.guiParams.environment}.usdz`);
    const blob = await response.blob();
     const file = new File([blob], 'test.usdz', {
      type: 'model/vnd.usdz+zip',  // MIME type for USDZ
      lastModified: new Date().getTime() // Optional: set last modified time
    });

    const loadedModel = await this.usdzLoader.loadFile(file, this.env);
    console.log("meow")

    // const response2 = await fetch(`${import.meta.env.BASE_URL}public_release/usd/franka.usdz`);
    // const blob2 = await response2.blob();
    //  const file2 = new File([blob2], 'test2.usdz', {
    //   type: 'model/vnd.usdz+zip',  // MIME type for USDZ
    //   lastModified: new Date().getTime() // Optional: set last modified time
    // });
    // const loadedModel2 = await this.usdzLoader.loadFile(file2, this.robot);

    // this.urdfLoader.load(`${import.meta.env.BASE_URL}franka_description/meshes/panda_arm_hand.urdf`, (robot) => {
    //   this.robot.add(robot)
    // });
    //
    let robot = await this.urdfLoader.loadAsync(`${import.meta.env.BASE_URL}franka_description/meshes/panda_arm_hand.urdf`)
    this.robot.add(robot)

    this.bowl = this.env.children[this.obj2idx["obj"]]
    this.sink = this.env.children[this.obj2idx["background"]]
    
    this.step = 0

    // const axesHelper = new THREE.AxesHelper(1); // 2 = size of the axes
    // this.scene.add(axesHelper)

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
    this.readyToRender = true;
    this.viewerIsReady(true, [this.getElement(), this.gui.domElement], this);
  }

  render(timeMS) {

    if (this.readyToRender) {
    
      // update everything's pos and quat
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
      pos = new THREE.Vector3(...this.traj[step].background.pos)
      quat = new THREE.Quaternion(...this.traj[step].background.rot)
      var mat = new THREE.Matrix4().makeRotationFromQuaternion(quat)
      mat.multiply(permuteMat)

      // var newQuat = new THREE.Quaternion().setFromRotationMatrix(mat)

      this.sink.position.set(pos.x, pos.y, pos.z)
      this.sink.quaternion.set(...quat);

      
      for (let i = 0; i < 7; i++) {
        const val = this.traj[step].jp[i]
        this.robot.children[0].setJointValue(`panda_joint${i+1}`, val)
      }
      this.robot.children[0].setJointValue(`panda_finger_joint1`, this.traj[step].jp[7])
      this.robot.children[0].setJointValue(`panda_finger_joint2`, this.traj[step].jp[8])



      this.bowl.updateMatrix()
      this.sink.updateMatrix()


      // for (let mesh in this.robot.children) {
      //   // console.log(mesh)
      // }
      
      this.controls.update();
      this.renderer.render( this.scene, this.camera );

      this.step += 0.2
      this.step = this.step % this.traj.length
    }
  }
}
