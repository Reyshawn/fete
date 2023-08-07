import { lazy, useCallback, useEffect, useRef, Suspense } from "react"
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'lil-gui'
import styles from "@/styles/sectionPage.module.css"

import TextureImage from "@/assets/texture01.jpg"


const Chapter1 = lazy(() => import("./Chapter1/index"))
const Chapter2 = lazy(() => import("./Chapter2/index"))

export const Menus = [
  {
    name: 'chapter1',
    element: <Suspense><Chapter1 /></Suspense>
  },
  {
    name: 'chapter2',
    element: <Suspense><Chapter2 /></Suspense>
  }
]



export default function ThreeJSPage(props: any) {
  return (
    <section className={styles.page}>
      <h1>Three.js</h1>

      <ThreejsHelloWorld />
      <ThreejsObitControls />
      <ThreejsTextures />
    </section>
  )
}


const size = {
  width: 300,
  height: 300
}


function ThreejsHelloWorld() {
  const containerRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const camera = new THREE.PerspectiveCamera( 100, size.width / size.height, 0.01, 10 )
    // const camera = new THREE.OrthographicCamera(- 1, 1, 1, - 1, 0.1, 100)
    camera.position.z = 1

    

    const scene = new THREE.Scene()


    const axesHelper = new THREE.AxesHelper(3)
    scene.add(axesHelper)

    const geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
    const material = new THREE.MeshNormalMaterial();

    const mesh = new THREE.Mesh( geometry, material );

    mesh.position.x = 0.7
    mesh.position.y = - 0.6

    // mesh.scale.x = 2
    // mesh.scale.y = 0.25
    // mesh.scale.z = 0.5

    scene.add( mesh );

    const renderer = new THREE.WebGLRenderer( {
      canvas: containerRef.current!,
      antialias: true 
    } )

    renderer.setPixelRatio( window.devicePixelRatio )
    renderer.setSize( size.width, size.height );


    function animation( time: number ) {

      mesh.rotation.x = time / 1000;
      mesh.rotation.y = time / 1000;
    
      renderer.render( scene, camera );
    }

    renderer.setAnimationLoop( animation );
  }, [])


  return (<>
    <h2>Hello Threejs</h2>
    
    <canvas ref={containerRef}></canvas>
  </>)
}




function ThreejsObitControls() {
  const containerRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const gui = new dat.GUI({
      // container: containerRef.current!.parentElement!
    })
    const camera = new THREE.PerspectiveCamera(100, size.width / size.height, 0.01, 10 )
    camera.position.z = 1

    const controls = new OrbitControls(camera, containerRef.current!)
    // controls.enableDamping = true

    const scene = new THREE.Scene()

    const axesHelper = new THREE.AxesHelper(3)
    scene.add(axesHelper)

    const geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
    const material = new THREE.MeshNormalMaterial();

    const mesh = new THREE.Mesh( geometry, material );

    gui
      .add(mesh.position, 'y')
      .min(- 3)
      .max(3)
      .step(0.01)
      .name('elevation')

    gui.add(mesh, 'visible')
    gui.add(material, 'wireframe')


    const parameters = {
      color: 0xff0000,
      test: () => console.log("123")
    }

    gui.add(parameters, 'test')
    // gui
    //   .addColor(parameters, 'color')
    //   .onChange(() => {
    //     material.color.set(parameters.color)
    //   })


    scene.add( mesh );

    const renderer = new THREE.WebGLRenderer( {
      canvas: containerRef.current!,
      antialias: true 
    });
    renderer.setPixelRatio( window.devicePixelRatio )
    renderer.setSize( size.width, size.height );

    controls.update();

    function animate() {
    
    	requestAnimationFrame( animate );
    
    	// required if controls.enableDamping or controls.autoRotate are set to true
    	controls.update();
    	renderer.render( scene, camera );
    }

    animate()

    const handleResize = () => {
      // Update sizes
      let width, height
      if (document.fullscreenElement) {
        width = window.innerWidth
        height = window.innerHeight
      } else {
        width = size.width
        height = size.height
      }
      

      // Update camera
      camera.aspect = width / height

      // Update renderer
      renderer.setPixelRatio( window.devicePixelRatio )
      renderer.setSize(width, height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }

    window.addEventListener('resize', handleResize)


    return () => {
      window.removeEventListener('resize', handleResize)
      gui.destroy()
    }
  }, [])



  const doubleClick = useCallback(() => {
    if(!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }, [])

  return (<>
    <h2>Threejs orbit controls</h2>
    
    <canvas ref={containerRef} onDoubleClick={doubleClick}></canvas>
  </>)
}



function ThreejsTextures() {
  const containerRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const camera = new THREE.OrthographicCamera(- 1, 1, 1, - 1, 0.1, 100)
    camera.position.z = 1

    const controls = new OrbitControls(camera, containerRef.current!)
    // controls.enableDamping = true

    const scene = new THREE.Scene()

    const axesHelper = new THREE.AxesHelper(3)
    scene.add(axesHelper)


    const textureLoader = new THREE.TextureLoader()
    const texture = textureLoader.load(
      TextureImage
    )

    const material =new THREE.MeshBasicMaterial({map: texture});


    const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 16, 16),
        material
    )
    sphere.position.x = - 1.5
  
    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 1),
        material
    )
  
    const torus = new THREE.Mesh(
        new THREE.TorusGeometry(0.3, 0.2, 16, 32),
        material
    )
    torus.position.x = 1.5
    scene.add(sphere, plane, torus)


    /**
      * Lights
    */
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const pointLight = new THREE.PointLight(0xffffff, 0.5)
    pointLight.position.x = 2
    pointLight.position.y = 3
    pointLight.position.z = 4
    scene.add(pointLight)


    const renderer = new THREE.WebGLRenderer( {
      canvas: containerRef.current!,
      antialias: true 
    });
    renderer.setPixelRatio( window.devicePixelRatio )
    renderer.setSize( size.width, size.height );

    controls.update();

    function animate() {
    
    	requestAnimationFrame( animate );
    
    	// required if controls.enableDamping or controls.autoRotate are set to true
    	controls.update();
    	renderer.render( scene, camera );
    }

    animate()

  }, [])

  return (<>
    <h2>Threejs Texttures</h2>
    <canvas ref={containerRef} ></canvas>
  </>)
}
