import { useCallback, useEffect, useRef } from "react"
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'lil-gui'


export default function ThreeJSPage(props: any) {
  return (
    <>
      this is threejspage page

      <ThreejsHelloWorld />
      <ThreejsObitControls />
    </>
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
    } );
    renderer.setSize( size.width, size.height );


    function animation( time: number ) {

      mesh.rotation.x = time / 1000;
      mesh.rotation.y = time / 1000;
    
      renderer.render( scene, camera );
    }

    renderer.setAnimationLoop( animation );
  }, [])


  return (<>
    <h1>Hello Threejs</h1>
    
    <canvas ref={containerRef}></canvas>
  </>)
}




function ThreejsObitControls() {
  const containerRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const gui = new dat.GUI({
      container: containerRef.current!.parentElement!
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
    <h1>Threejs orbit controls</h1>
    
    <canvas ref={containerRef} onDoubleClick={doubleClick}></canvas>
  </>)
}

