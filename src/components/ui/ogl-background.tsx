import { useEffect, useRef } from 'react'
import { Camera, Mesh, Plane, Program, Renderer, Transform } from 'ogl'

const vertexShader = /* glsl */`
precision highp float;

attribute vec3 position;
attribute vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uTime;

varying vec2 vUv;
varying float vElevation;

void main() {
  vUv = uv;
  vec3 pos = position;

  float w1 = sin(pos.x * 1.5 + uTime * 0.8) * 0.3;
  float w2 = sin(pos.z * 2.0 - uTime * 0.6) * 0.2;
  float w3 = sin((pos.x + pos.z) * 1.2 + uTime * 0.4) * 0.15;

  pos.y = w1 + w2 + w3;
  vElevation = pos.y;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`

const fragmentShader = /* glsl */`
precision highp float;

uniform float uTime;
uniform float uDarkMode;

varying vec2 vUv;
varying float vElevation;

void main() {
  vec3 darkLow   = vec3(0.05, 0.07, 0.18);
  vec3 darkHigh  = vec3(0.20, 0.33, 1.00);
  vec3 lightLow  = vec3(0.82, 0.88, 1.00);
  vec3 lightHigh = vec3(0.35, 0.50, 1.00);

  float t = clamp((vElevation + 0.65) / 1.3, 0.0, 1.0);
  float lateral = sin(vUv.x * 3.14159 + uTime * 0.2) * 0.5 + 0.5;

  vec3 lo = mix(lightLow,  darkLow,  uDarkMode);
  vec3 hi = mix(lightHigh, darkHigh, uDarkMode);
  vec3 color = mix(lo, hi, t);

  vec3 accent = vec3(0.45, 0.15, 0.90);
  color = mix(color, accent, lateral * t * 0.35 * uDarkMode);

  gl_FragColor = vec4(color, 1.0);
}
`

export function OGLBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dpr = Math.min(window.devicePixelRatio, 1.5)

    const renderer = new Renderer({
      canvas,
      alpha: false,
      antialias: false,
      dpr,
    })
    const gl = renderer.gl

    const isDark = document.documentElement.classList.contains('dark')
    const setBackground = (dark: boolean) => {
      if (dark) gl.clearColor(0.043, 0.059, 0.105, 1)
      else       gl.clearColor(0.992, 0.992, 0.992, 1)
    }
    setBackground(isDark)

    const camera = new Camera(gl, { fov: 55 })
    camera.position.set(0, 3.5, 6)
    camera.lookAt([0, 0, 0])

    const scene = new Transform()

    const geometry = new Plane(gl, {
      width: 20,
      height: 20,
      widthSegments: 50,
      heightSegments: 50,
    })

    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime:     { value: 0 },
        uDarkMode: { value: isDark ? 1.0 : 0.0 },
      },
      depthWrite: false,
      cullFace: false,
    })

    const mesh = new Mesh(gl, { geometry, program })
    mesh.rotation.x = -Math.PI / 2
    mesh.setParent(scene)

    const resize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight)
      camera.perspective({ aspect: window.innerWidth / window.innerHeight })
    }
    resize()
    window.addEventListener('resize', resize)

    const themeObserver = new MutationObserver(() => {
      const dark = document.documentElement.classList.contains('dark')
      setBackground(dark)
      program.uniforms.uDarkMode.value = dark ? 1.0 : 0.0
    })
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    const startTime = performance.now()
    let animId: number

    const tick = () => {
      animId = requestAnimationFrame(tick)
      program.uniforms.uTime.value = (performance.now() - startTime) / 1000
      renderer.render({ scene, camera })
    }
    tick()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      themeObserver.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', top: 0, left: 0, zIndex: 0, pointerEvents: 'none' }}
      aria-hidden="true"
    />
  )
}
