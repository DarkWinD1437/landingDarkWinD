import { useEffect, useRef } from 'react';
import { Camera, Geometry, Mesh, type OGLRenderingContext, Program, Renderer, Transform } from 'ogl';
import { cn } from '@/lib/utils';

const BOX_COUNT = 130;
const EDGE_HALF_THICKNESS = 0.1;
const CYAN: [number, number, number] = [0.32, 0.7, 0.78];
const RED: [number, number, number] = [0.75, 0.38, 0.28];

type Vec3Tuple = [number, number, number];

function sub(a: Vec3Tuple, b: Vec3Tuple): Vec3Tuple {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}
function add(a: Vec3Tuple, b: Vec3Tuple): Vec3Tuple {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}
function cross(a: Vec3Tuple, b: Vec3Tuple): Vec3Tuple {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}
function normalize(a: Vec3Tuple): Vec3Tuple {
  const len = Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]) || 1;
  return [a[0] / len, a[1] / len, a[2] / len];
}
function scale(a: Vec3Tuple, s: number): Vec3Tuple {
  return [a[0] * s, a[1] * s, a[2] * s];
}

// Edges are turned into thin triangulated ribbons instead of GL_LINES:
// most browsers/GPUs clamp gl.lineWidth to 1px regardless of what's
// requested, so this is the only reliable way to get a thicker stroke.
function buildCityGeometry(gl: OGLRenderingContext) {
  const positions: number[] = [];
  const colors: number[] = [];
  const alphas: number[] = [];

  for (let i = 0; i < BOX_COUNT; i++) {
    const w = 1.5 + Math.random() * 5.5;
    const h = 3 + Math.random() * 22;
    const d = 1.5 + Math.random() * 5.5;
    const accent = Math.random() < 0.08;
    const color = accent ? RED : CYAN;
    const alpha = accent ? 0.7 : 0.28 + Math.random() * 0.22;

    const angle = Math.random() * Math.PI * 2;
    const radius = 12 + Math.random() * 46;
    const cx = Math.cos(angle) * radius;
    const cy = h / 2 - 6 + Math.random() * 6;
    const cz = Math.sin(angle) * radius - 28;

    const hw = w / 2;
    const hh = h / 2;
    const hd = d / 2;
    const corners: [number, number, number][] = [
      [-hw, -hh, -hd], [hw, -hh, -hd], [hw, hh, -hd], [-hw, hh, -hd],
      [-hw, -hh, hd], [hw, -hh, hd], [hw, hh, hd], [-hw, hh, hd],
    ];
    const edges: [number, number][] = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7],
    ];

    edges.forEach(([a, b]) => {
      const A = corners[a];
      const B = corners[b];
      const dir = normalize(sub(B, A));
      const upHelper: Vec3Tuple = Math.abs(dir[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
      const perp = scale(normalize(cross(dir, upHelper)), EDGE_HALF_THICKNESS);

      const p1 = add(A, perp);
      const p2 = sub(A, perp);
      const p3 = sub(B, perp);
      const p4 = add(B, perp);

      [p1, p2, p3, p1, p3, p4].forEach(([x, y, z]) => {
        positions.push(x + cx, y + cy, z + cz);
        colors.push(...color);
        alphas.push(alpha);
      });
    });
  }

  return new Geometry(gl, {
    position: { size: 3, data: new Float32Array(positions) },
    color: { size: 3, data: new Float32Array(colors) },
    alpha: { size: 1, data: new Float32Array(alphas) },
  });
}

const vertexShader = /* glsl */`
  attribute vec3 position;
  attribute vec3 color;
  attribute float alpha;

  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vColor = color;
    vAlpha = alpha;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */`
  precision highp float;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    gl_FragColor = vec4(vColor, vAlpha);
  }
`;

export function WireframeCity({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new Renderer({
      canvas,
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    const camera = new Camera(gl, { fov: 55, far: 400 })
    camera.position.set(0, 5, 48);
    camera.lookAt([0, 3, -15]);

    const scene = new Transform();
    const geometry = buildCityGeometry(gl);
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      transparent: true,
      depthWrite: false,
      cullFace: false,
    });
    const mesh = new Mesh(gl, { geometry, program });
    mesh.setParent(scene);

    // Measure the parent, not the canvas itself: ogl's Renderer constructor
    // forces the canvas to a 300x150 default via inline style, which would
    // otherwise permanently poison a `canvas.clientWidth` read taken after
    // construction (it would just keep re-confirming that shrunk size).
    const resize = () => {
      const parent = canvas.parentElement;
      const w = parent?.clientWidth || window.innerWidth;
      const h = parent?.clientHeight || window.innerHeight;
      renderer.setSize(w, h);
      camera.perspective({ aspect: w / h });
    };
    resize();
    window.addEventListener('resize', resize);

    let raf: number;
    const animate = () => {
      mesh.rotation.y += 0.0012;
      renderer.render({ scene, camera });
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={cn('absolute inset-0 h-full w-full', className)}
      aria-hidden="true"
    />
  );
}
