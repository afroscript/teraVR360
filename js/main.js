/*
 * WebGLRendererの生成
 */
var renderer = new THREE.WebGLRenderer({antialias: true});
    // →antialias:trueで物体の輪郭がギザギザになることを抑える
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio); //画面のピクセル比を設定
//CanvasをDOMツリーに追加
document.body.appendChild(renderer.domElement);


/*
 * CSS3DRendererの生成
 */
var cssRenderer = new THREE.CSS3DRenderer();
cssRenderer.setSize(window.innerWidth, window.innerHeight);
cssRenderer.domElement.style.position = 'absolute';
cssRenderer.domElement.style.top = 0;
cssRenderer.domElement.style.margin = 0;
cssRenderer.domElement.style.padding = 0;
cssRenderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild( cssRenderer.domElement );


/*
 * シーンの追加
 */
var scene = new THREE.Scene();
var cssScene	= new THREE.Scene();


/*
 * カメラの生成
 */
var fov = 75;
var aspect = window.innerWidth / window.innerHeight;
var near = 0.1;
var far = 10000;
var camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
var camera_position_x0 = 0;
var camera_position_y0 = 0;
var camera_position_z0 = 0;
camera.position.set(camera_position_x0,camera_position_y0,camera_position_z0);


/*
 * VR用コントローラを生成（OrbitControlsは一旦//で消してる）
 */
var controls = new THREE.VRControls(camera);
// var controls = new THREE.OrbitControls(camera, renderer.domElement);


/*
 * VREffectの生成(2分割画面を構築する)
 */
var effect = new THREE.VREffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);
var cssEffect = new THREE.VREffect(cssRenderer);
cssEffect.setSize(window.innerWidth, window.innerHeight);


/*
 *VRマネージャの生成
 */
var manager = new WebVRManager(renderer, effect);
var cssManager = new WebVRManager(cssRenderer, cssEffect);


//////////////////////////////////////////////////////
/*
 *WebGLSceneにオブジェクトを追加していく
 */
//Object(床をつくってみる)
var pcWidth = 256;
var pcHeight = 256;
var floorGeo = new THREE.PlaneGeometry(pcWidth,pcHeight);
var floorMesh = new THREE.MeshBasicMaterial({color:0xc0c0c0});
// var floorMesh = new THREE.MeshBasicMaterial({wireframe:true});
var floor = new THREE.Mesh( floorGeo, floorMesh );
var objePositionX = 0;
var objePositionY = 0;
var objePositionZ = -500;
floor.position.set(objePositionX, objePositionY, objePositionZ);
// floor.rotation.x = Math.PI/2;
scene.add( floor );


/*
 *cssSceneにオブジェクトを追加していく
 */
var element = document.createElement('iframe');
element.src = 'https://teratail.com/';
element.style.width = pcWidth + 'px';
element.style.height = pcHeight + 'px';
// create the object3d for tjhis element
var cssObject = new THREE.CSS3DObject( element );
// we reference the same position and rotation
cssObject.position.set(objePositionX, objePositionY, objePositionZ);
cssObject.rotation = floor.rotation;
// add it to the css scene
cssScene.add(cssObject);


/*
 * Lightをシーンに追加
 */
var light = new THREE.DirectionalLight(0xffffff);
light.position.set(0,30,-50);
scene.add(light);
cssScene.add(light);


/*
 *環境光を追加
 */
var ambient = new THREE.AmbientLight(0x333333);
scene.add(ambient);
cssScene.add(ambient);


/*
 *補助軸の表示(最終的に消す)
 */
// var axis = new THREE.AxisHelper(1000);
// cssScene.add(axis);
// scene.add(axis);



/*
 *アニメーションループ  
 */
var lastRender = 0;
function animate(timestamp) {
  // var delta = Math.min(timestamp - lastRender, 500);
  lastRender = timestamp;

  //VRコントローラのupdate
  controls.update();

  //VRマネージャを通してシーンをレンダリング
  manager.render(scene, camera, timestamp);

  //アニメーションループ
  requestAnimationFrame(animate);
}

// アニメーションの開始
animate(performance ? performance.now() : Date.now());

//レンダリング
// function renderRender() {
//   renderer.render(scene, camera);
//   cssRenderer.render(cssScene, camera);
    
//   requestAnimationFrame(animate);
// }

//animate
// function animate(){
//   // setupCursor()
//   renderRender()
// }

// animate();
