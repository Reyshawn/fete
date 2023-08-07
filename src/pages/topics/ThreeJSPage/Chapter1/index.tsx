
import styles from "@/styles/sectionPage.module.css"
import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

import TextureImage from "@/assets/particles/2.png"

export default function Chapter1(props: any) {
  return (
    <section className={styles.page}>
      <h1>Three.js</h1>

      <ThreeJSParticles />
    </section>
  )
}



const size = {
  width: 600,
  height: 600
}


function ThreeJSParticles() {
  const containerRef = useRef<HTMLCanvasElement | null>(null)


  useEffect(() => {

    const camera = new THREE.PerspectiveCamera( 100, size.width / size.height, 0.01, 10 )
    camera.position.z = 1.6

    const controls = new OrbitControls(camera, containerRef.current!)

    // const particlesGeometry = new THREE.SphereGeometry(1, 32, 32)
    const particlesGeometry = new THREE.BufferGeometry()

    const count = 5000

    const positions = new Float32Array(count * 3) // Multiply by 3 because each position is composed of 3 values (x, y, z)
    const colors = new Float32Array(count * 3)

    for(let i = 0; i < count * 3; i++) { // Multiply by 3 for same reason
      positions[i] = (Math.random() - 0.5) * 10 // Math.random() - 0.5 to have a random value between -0.5 and +0.5
      colors[i] = Math.random()
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3)) // Create the Three.js BufferAttribute and specify that each information is composed of 3 values
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    /**
     * Textures
     */
    const textureLoader = new THREE.TextureLoader()
    const particleTexture = textureLoader.load(TextureImage)


    // Material
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      sizeAttenuation: true
    })

    particlesMaterial.size = 0.1
    // particlesMaterial.sizeAttenuation = true
    particlesMaterial.transparent = true
    particlesMaterial.alphaMap = particleTexture
    particlesMaterial.color = new THREE.Color('#ff88cc')
    particlesMaterial.alphaTest = 0.001
    particlesMaterial.depthWrite = false
    particlesMaterial.blending = THREE.AdditiveBlending
    particlesMaterial.vertexColors = true
 

    const scene = new THREE.Scene()
    const axesHelper = new THREE.AxesHelper(3)
    scene.add(axesHelper)


    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(),
      new THREE.MeshBasicMaterial()
    )
    scene.add(cube)

    const particles = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particles)

    const renderer = new THREE.WebGLRenderer( {
      canvas: containerRef.current!,
      antialias: true 
    })

    renderer.setPixelRatio( window.devicePixelRatio )
    renderer.setSize( size.width, size.height )


    const clock = new THREE.Clock()

    const tick = () => {
      const elapsedTime = clock.getElapsedTime()
    
      // Update particles
      for(let i = 0; i < count; i++) {
          let i3 = i * 3
      
          const x = particlesGeometry.attributes.position.array[i3]
          particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x)
      }
      particlesGeometry.attributes.position.needsUpdate = true
      
      // Update controls
      controls.update()
      
      // Render
      renderer.render(scene, camera)
      
      // Call tick again on the next frame
      window.requestAnimationFrame(tick)
    }
    
    tick()
  }, [])
  

  return (
    <>
      <h2>Threejs Particles</h2>
    
      <canvas ref={containerRef}></canvas>
    </>
  )
}