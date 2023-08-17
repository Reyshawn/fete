import styles from "@/styles/sectionPage.module.css"
import { useCallback, useEffect, useRef } from "react"
import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import * as dat from 'lil-gui'


export default function Chapter2(props: any) {
  return (
    <section className={styles.page}>
      <h1>Three.js</h1>

      <ThreeJSRaycaster />
    </section>
  )
}



function ThreeJSRaycaster() {


  const containerRef = useRef<HTMLCanvasElement | null>(null)


  useEffect(() => {
    /**
     * Base
     */
    // Debug
    const gui = new dat.GUI()

    // Canvas
    const canvas = containerRef.current!

    // Scene
    const scene = new THREE.Scene()

    /**
     * Objects
     */
    const object1 = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 16, 16),
      new THREE.MeshBasicMaterial({ color: '#F3FDE8' })
    )
    object1.position.x = - 2
    
    const object2 = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 16, 16),
      new THREE.MeshBasicMaterial({ color: '#F3FDE8' })
    )
    
    const object3 = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 16, 16),
      new THREE.MeshBasicMaterial({ color: '#F3FDE8' })
    )
    object3.position.x = 2

    scene.add(object1, object2, object3)

    /**
     * Sizes
     */
    const sizes = {
      width: 600,
      height: 600
    }

    // window.addEventListener('resize', () => {
    //     // Update sizes
    //     sizes.width = window.innerWidth
    //     sizes.height = window.innerHeight
    // 
    //     // Update camera
    //     camera.aspect = sizes.width / sizes.height
    //     camera.updateProjectionMatrix()
    // 
    //     // Update renderer
    //     renderer.setSize(sizes.width, sizes.height)
    //     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    // })

    /**
     * Camera
     */
    // Base camera
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
    camera.position.z = 3
    scene.add(camera)

    // Controls
    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true

    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas
    })
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


    /**
    * Raycaster
    */
    const raycaster = new THREE.Raycaster()


    /**
     * Mouse
     */
    const mouse = new THREE.Vector2()
    let currentIntersect: THREE.Intersection<THREE.Object3D<THREE.Event>> | null = null

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = event.offsetX / sizes.width * 2 - 1
      mouse.y = - (event.offsetY / sizes.height) * 2 + 1
    }

    const handleMouseClick = (event: MouseEvent) => {

      if (currentIntersect != null) {
        console.log("click::::", currentIntersect)
      }
    }

    containerRef.current!.addEventListener('mousemove', handleMouseMove)
    containerRef.current!.addEventListener("click", handleMouseClick)

    /**
     * Animate
     */
    const clock = new THREE.Clock()

    

    const tick = () => {
      const elapsedTime = clock.getElapsedTime()


      // Animate objects
      // object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5
      // object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5
      // object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5


      // // Cast a ray
      // const rayOrigin = new THREE.Vector3(- 3, 0, 0)
      // const rayDirection = new THREE.Vector3(1, 0, 0)
      // rayDirection.normalize()
    
      raycaster.setFromCamera(mouse, camera)
    
      const objectsToTest = [object1, object2, object3]
      const intersects = raycaster.intersectObjects(objectsToTest)
      // console.log(intersects)


      for(const object of objectsToTest) {
        object.material.color.set('#F3FDE8')
      }


      for(const intersect of intersects) {
        (intersect.object as THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>).material.color.set('#E19898')
      }



      if(intersects.length) {
        if(!currentIntersect) {
          console.log('mouse enter')
        }

        currentIntersect = intersects[0]
      } else {
        if(currentIntersect) {
          console.log('mouse leave')
        }
        
        currentIntersect = null
      }

    
      // Update controls
      controls.update()
    
      // Render
      renderer.render(scene, camera)
    
      // Call tick again on the next frame
      window.requestAnimationFrame(tick)
    }

    tick()


    return () => {
      gui.destroy()
      containerRef.current?.removeEventListener("mousemove", handleMouseMove)
      containerRef.current?.removeEventListener("click", handleMouseClick)
    }

  }, [])

  return (
    <>
      <h2>Threejs Raycaster</h2>
    
      <canvas ref={containerRef}></canvas>
    </>
  )
}