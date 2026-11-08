import { drawBuildFrame, perimeterPoint, type Rect, type Vec } from './build-frame';
import { SWARM_CLASS } from './enable';
import { clamp, easeInOutCubic, easeOutCubic, rand, triangle, wrapAngle } from './math';
import { createSprite, drawMouse, type MouseSprite } from './mouse-sprite';
import { SCHOOL_STYLES } from './palette';

/* ─────────────────────────────────────────────────────────────────────────
 * Tunables
 * ──────────────────────────────────────────────────────────────────────── */

/** Components are picked up once their top edge rises above this share of the viewport. */
const TRIGGER_LINE = 0.95;
/**
 * A component whose bottom edge has risen above this many px has been scrolled
 * past (it is under the header): nobody would see it built, so it just appears.
 * Sticky elements (the header) are exempt — they live up there on purpose.
 */
const PASSED_LINE = 80;
/** Seconds the schools swim alone before the first component is built. */
const INTRO_DELAY = 1.25;
/** Components being built at the same time. */
const MAX_CONCURRENT = 6;
/** Minimum gap between two build starts, so they cascade instead of popping together. */
const START_GAP = 0.14;
/** After the whole landing exists, how long the schools keep swimming before leaving. */
const FINALE_SWIM = 3.5;
/** How long the construction frame stays (fading) after a component is finished. */
const FRAME_LINGER = 1.0;
/** A single build that runs longer than this (in build-seconds) is completed instantly. */
const BUILD_TIMEOUT = 6;
/** Safety net: force-finish if the exit somehow stalls. */
const EXIT_TIMEOUT = 9;

// Build timeline, in seconds at speed 1.
const TRACE = 0.62; // mice ink the border
const FILL = 0.7; // content is revealed (starts mid-trace)
const FILL_START = 0.55; // …at this share of TRACE
const LINE_FILL = 0.55; // thin dividers: a single mouse drags the line across

// Free swimming.
const SEPARATION_RADIUS = 30;
const NEIGHBOUR_RADIUS = 150;

const ATTR_STATE = 'buildState';
const OVERSHOOT = 28;

/* ─────────────────────────────────────────────────────────────────────────
 * Types
 * ──────────────────────────────────────────────────────────────────────── */

interface Mouse {
  x: number;
  y: number;
  vx: number;
  vy: number;
  school: number;
  size: number;
  cruise: number;
  phase: number;
  heading: number;
  wander: number;
  /** Has been on-screen at least once (bounds only apply after that). */
  entered: boolean;
  gone: boolean;
  job: Build | null;
  slot: number;
}

interface School {
  anchor: Vec;
  exit: Vec;
}

type BuildState = 'pending' | 'queued' | 'active' | 'done';

interface Build {
  el: HTMLElement;
  label: string;
  state: BuildState;
  /** Thin horizontal divider — built with a single mouse, no box frame. */
  line: boolean;
  /** `position: sticky` — stays near the top of the viewport by design. */
  sticky: boolean;
  rect: Rect;
  t: number;
  gather: number;
  builders: Mouse[];
  heads: number;
  inked: number;
  fill: number;
  doneAt: number;
}

/* ─────────────────────────────────────────────────────────────────────────
 * DOM helpers
 * ──────────────────────────────────────────────────────────────────────── */

function clipFor(fill: number, line: boolean): string {
  // Inset of the *still hidden* part. A little slack on every side keeps glows
  // and offset decorations from being sliced while the element is revealed.
  const rest = 1 - fill;
  const hidden = `calc(${(rest * 100).toFixed(2)}% + ${(OVERSHOOT * (1 - 2 * fill)).toFixed(1)}px)`;
  const o = `-${OVERSHOOT}px`;
  return line ? `inset(${o} ${hidden} ${o} ${o})` : `inset(${o} ${o} ${hidden} ${o})`;
}

function markDone(el: HTMLElement) {
  el.dataset[ATTR_STATE] = 'done';
  el.style.removeProperty('opacity');
  el.style.removeProperty('clip-path');
}

/** Reveals everything and switches the hiding CSS off. Safe to call any time. */
export function releaseContent() {
  document.querySelectorAll<HTMLElement>('[data-build]').forEach(markDone);
  document.documentElement.classList.remove(SWARM_CLASS);
}

/* ─────────────────────────────────────────────────────────────────────────
 * Engine
 * ──────────────────────────────────────────────────────────────────────── */

export function startSwarm(canvas: HTMLCanvasElement, onFinish: () => void): () => void {
  const ctx = canvas.getContext('2d');
  const els = Array.from(document.querySelectorAll<HTMLElement>('[data-build]'));
  if (!ctx || els.length === 0) {
    releaseContent();
    return () => {};
  }

  const root = document.documentElement;
  root.classList.add(SWARM_CLASS);

  const mobile = window.matchMedia('(max-width: 767px)').matches;
  const sizeBase = mobile ? 0.85 : 1;
  const maxBuilders = mobile ? 3 : 4;

  let vw = 0;
  let vh = 0;
  let dpr = 1;

  /**
   * Re-measured every frame instead of cached from `resize`: on mobile the
   * layout viewport changes without a reliable `resize` (URL bar, a page that
   * was zoomed out to fit overflow and then recovers), and a stale height made
   * components start building while still far below the screen.
   * `clientWidth/Height` is the layout viewport — the space `getBoundingClientRect`
   * and the fixed canvas both live in.
   */
  const syncViewport = () => {
    const w = root.clientWidth || window.innerWidth;
    const h = root.clientHeight || window.innerHeight;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    if (Math.abs(w - vw) < 1 && Math.abs(h - vh) < 1 && ratio === dpr) return;
    vw = w;
    vh = h;
    dpr = ratio;
    canvas.width = Math.round(vw * dpr);
    canvas.height = Math.round(vh * dpr);
  };
  syncViewport();

  /* ── builds ── */
  const builds: Build[] = els.map((el) => {
    el.dataset[ATTR_STATE] = 'idle';
    el.style.removeProperty('opacity');
    el.style.removeProperty('clip-path');
    return {
      el,
      label: el.dataset.build ?? '',
      state: 'pending',
      line: false,
      sticky: getComputedStyle(el).position === 'sticky',
      rect: { left: 0, top: 0, width: 0, height: 0 },
      t: 0,
      gather: 0,
      builders: [],
      heads: 1,
      inked: 0,
      fill: 0,
      doneAt: -1,
    };
  });
  const queue: Build[] = [];

  /* ── schools & mice ── */
  const sprites: MouseSprite[] = SCHOOL_STYLES.map((s) => createSprite(s.color, s.glow, Math.max(2, dpr)));

  const origins: ((w: number, h: number) => { x: number; y: number; dx: number; dy: number })[] = [
    (_w, h) => ({ x: -50, y: h * 0.4, dx: 1, dy: 0.08 }),
    (w, h) => ({ x: w + 50, y: h * 0.62, dx: -1, dy: -0.08 }),
    (w, h) => ({ x: w * 0.5, y: h + 50, dx: 0.15, dy: -1 }),
  ];

  let time = 0;
  const idleAnchor = (si: number, out: Vec) => {
    out.x = vw * (0.5 + 0.3 * Math.sin(time * 0.21 + si * 2.1));
    out.y = vh * (0.58 + 0.2 * Math.sin(time * 0.29 + si * 1.7 + 1));
    return out;
  };

  const schools: School[] = SCHOOL_STYLES.map((_, si) => ({
    anchor: idleAnchor(si, { x: 0, y: 0 }),
    exit: { x: 0, y: 0 },
  }));

  const mice: Mouse[] = [];
  SCHOOL_STYLES.forEach((style, si) => {
    const count = Math.round(style.count * (mobile ? 0.6 : 1));
    for (let i = 0; i < count; i++) {
      const o = origins[si](vw, vh);
      const across = rand(-90, 90);
      const behind = rand(0, 150);
      const speed = rand(170, 230);
      mice.push({
        x: o.x - o.dx * behind - o.dy * across,
        y: o.y - o.dy * behind + o.dx * across,
        vx: o.dx * speed,
        vy: o.dy * speed,
        school: si,
        size: style.scale * sizeBase * rand(0.88, 1.12),
        cruise: rand(95, 135),
        phase: rand(0, Math.PI * 2),
        heading: Math.atan2(o.dy, o.dx),
        wander: rand(0, Math.PI * 2),
        entered: false,
        gone: false,
        job: null,
        slot: 0,
      });
    }
  });

  /* ── per-frame state ── */
  let raf = 0;
  let last = 0;
  let lastScrollY = window.scrollY;
  let lastStart = -Infinity;
  let finaleAt = -1;
  let exiting = false;
  let exitStart = 0;
  let stopped = false;
  let finished = false;

  const tmpA: Vec = { x: 0, y: 0 };
  const tmpB: Vec = { x: 0, y: 0 };

  /* ── build lifecycle ── */

  const finishBuild = (b: Build, instant: boolean) => {
    b.state = 'done';
    b.inked = 1;
    b.fill = 1;
    b.doneAt = instant ? -1 : time;
    markDone(b.el);
    for (const m of b.builders) if (m.job === b) m.job = null;
    b.builders = [];
  };

  const readRect = (b: Build) => {
    const r = b.el.getBoundingClientRect();
    b.rect.left = r.left;
    b.rect.top = r.top;
    b.rect.width = r.width;
    b.rect.height = r.height;
    // An ancestor's transform (scale 0, a mid-flight entrance…) can squash the
    // box to nothing. The layout size is immune to transforms, so fall back to it.
    if (!(r.width >= 1 && r.height >= 1)) {
      b.rect.width = b.el.offsetWidth;
      b.rect.height = b.el.offsetHeight;
    }
  };

  /** Nothing to build: no layout box at all (display:none, collapsed…). */
  const empty = (b: Build) => !(b.rect.width >= 1 && b.rect.height >= 1);

  const siteCentre = (b: Build, out: Vec) => {
    out.x = clamp(b.rect.left + b.rect.width / 2, 60, vw - 60);
    out.y = clamp(b.rect.top + b.rect.height / 2, 60, vh - 90);
    return out;
  };

  const passed = (b: Build) => !b.sticky && b.rect.top + b.rect.height < PASSED_LINE;

  const pickBuilders = (b: Build): Mouse[] => {
    const want = b.line ? 1 : clamp(Math.round((b.rect.width + b.rect.height) / 300), 2, maxBuilders);
    siteCentre(b, tmpA);
    return mice
      .filter((m) => !m.gone && !m.job && m.entered)
      .sort((p, q) => (p.x - tmpA.x) ** 2 + (p.y - tmpA.y) ** 2 - ((q.x - tmpA.x) ** 2 + (q.y - tmpA.y) ** 2))
      .slice(0, want);
  };

  const beginBuild = (b: Build, crew: Mouse[]) => {
    b.state = 'active';
    b.t = 0;
    b.builders = crew;
    b.heads = b.line ? 1 : clamp(crew.length, 1, 4);
    crew.forEach((m, i) => {
      m.job = b;
      m.slot = i;
    });
    b.el.dataset[ATTR_STATE] = 'building';
    b.el.style.opacity = '0';
    b.el.style.clipPath = clipFor(0, b.line);

    // Time to get there: farther crews get a longer gather before inking starts.
    let dist = 0;
    for (const m of crew) {
      perimeterPoint(b.rect, 0, tmpB);
      dist += Math.hypot(tmpB.x - m.x, tmpB.y - m.y);
    }
    const gather = dist / crew.length / 1400;
    b.gather = Number.isFinite(gather) ? clamp(gather, 0.12, 0.45) : 0.2;
  };

  const startFromQueue = () => {
    let active = 0;
    for (const b of builds) if (b.state === 'active') active++;

    while (queue.length && active < MAX_CONCURRENT && time - lastStart >= START_GAP) {
      // Only start what is actually on screen; the rest waits its turn.
      const idx = queue.findIndex((b) => b.rect.top < vh - 10);
      if (idx < 0) break;
      const b = queue[idx];
      const crew = pickBuilders(b);
      if (crew.length === 0) break;
      queue.splice(idx, 1);
      beginBuild(b, crew);
      lastStart = time;
      active++;
    }
  };

  const updateBuild = (b: Build, dt: number) => {
    // The more is waiting in line (the user is outrunning the crew), the faster everyone works.
    b.t += dt * clamp(1 + 0.12 * queue.length, 1, 2.2);
    // Watchdog: a build must never be able to hold a component hostage.
    if (!Number.isFinite(b.t) || b.t > BUILD_TIMEOUT) {
      finishBuild(b, true);
      return;
    }
    const g = b.gather;
    if (b.line) {
      b.fill = easeOutCubic(clamp((b.t - g) / LINE_FILL, 0, 1));
      b.inked = b.fill;
    } else {
      b.inked = easeInOutCubic(clamp((b.t - g) / TRACE, 0, 1));
      b.fill = easeOutCubic(clamp((b.t - (g + TRACE * FILL_START)) / FILL, 0, 1));
    }

    if (b.fill >= 1) {
      finishBuild(b, false);
      return;
    }
    b.el.style.opacity = String(Math.min(1, b.fill * 3));
    b.el.style.clipPath = clipFor(b.fill, b.line);
  };

  /* ── where does this mouse want to be? ── */
  const jobTarget = (m: Mouse, out: Vec): Vec => {
    const b = m.job as Build;
    const r = b.rect;
    const crew = b.builders.length;

    if (b.line) {
      out.x = r.left + r.width * b.fill;
      out.y = r.top + r.height / 2 + Math.sin(b.t * 14 + m.slot) * 4;
    } else if (b.fill > 0 && (b.inked >= 1 || m.slot % 2 === 0)) {
      // Sweeping the wipe edge back and forth while the content appears.
      out.x = r.left + r.width * triangle(b.t * 1.4 + m.slot / crew);
      out.y = r.top + r.height * b.fill;
    } else {
      // Riding a head along the border; followers trail behind it.
      const P = 2 * (r.width + r.height);
      const head = b.t < b.gather ? 0 : b.inked;
      const h = m.slot % b.heads;
      const lag = Math.floor(m.slot / b.heads) * 34;
      perimeterPoint(r, (h / b.heads + head / b.heads) * P - lag, out);
    }

    out.x = clamp(out.x, 12, vw - 12);
    out.y = clamp(out.y, 12, vh - 42);
    return out;
  };

  /* ── frame update ── */

  const update = (dt: number) => {
    /* 1. READ — every rect before any style write, so layout is computed once. */
    for (const b of builds) {
      if (b.state !== 'done' || (b.doneAt >= 0 && time - b.doneAt < FRAME_LINGER)) readRect(b);
    }

    /* 2. Triggers */
    if (time >= INTRO_DELAY) {
      const line = vh * TRIGGER_LINE;
      for (const b of builds) {
        if (b.state !== 'done' && empty(b)) {
          if (b.state === 'queued') queue.splice(queue.indexOf(b), 1);
          finishBuild(b, true);
        } else if (b.state === 'pending') {
          if (passed(b)) {
            finishBuild(b, true); // already scrolled past (restored scroll, hash jump…)
          } else if (b.rect.top < line) {
            b.line = b.rect.height < 40 && b.rect.width > b.rect.height * 4;
            b.state = 'queued';
            queue.push(b);
          }
        } else if (b.state === 'queued' && passed(b)) {
          queue.splice(queue.indexOf(b), 1);
          finishBuild(b, true);
        } else if (b.state === 'active' && passed(b)) {
          finishBuild(b, true);
        }
      }
      startFromQueue();
    }

    /* 3. Builds */
    for (const b of builds) if (b.state === 'active') updateBuild(b, dt);

    /* 4. Schools: where is each one heading? */
    for (let si = 0; si < schools.length; si++) {
      const s = schools[si];
      let cx = 0;
      let cy = 0;
      let n = 0;
      for (const m of mice) {
        if (m.gone || m.school !== si) continue;
        cx += m.x;
        cy += m.y;
        n++;
      }
      if (n) {
        cx /= n;
        cy /= n;
      }

      let tx: number;
      let ty: number;
      if (exiting) {
        tx = s.exit.x;
        ty = s.exit.y;
      } else {
        // Hover around the closest component that is being built, else drift.
        let best: Build | null = null;
        let bestD = Infinity;
        for (const b of builds) {
          if (b.state !== 'active') continue;
          const c = siteCentre(b, tmpA);
          const d = (c.x - cx) ** 2 + (c.y - cy) ** 2;
          if (d < bestD) {
            bestD = d;
            best = b;
          }
        }
        if (best) {
          siteCentre(best, tmpA);
        } else {
          idleAnchor(si, tmpA);
        }
        tx = tmpA.x;
        ty = tmpA.y;
      }
      // While swimming the anchor glides; when leaving it snaps so the school commits to the exit.
      const k = exiting ? 1 : Math.min(1, dt * 2.2);
      s.anchor.x += (tx - s.anchor.x) * k;
      s.anchor.y += (ty - s.anchor.y) * k;
    }

    /* 5. Mice */
    const scrollDy = window.scrollY - lastScrollY;
    lastScrollY = window.scrollY;

    for (const m of mice) {
      if (m.gone) continue;

      const speed = Math.hypot(m.vx, m.vy);
      m.phase += dt * (6 + speed * 0.025);
      if (!m.entered && m.x > 24 && m.x < vw - 24 && m.y > 24 && m.y < vh - 24) m.entered = true;

      let ax = 0;
      let ay = 0;

      // Separation (everyone) + flocking (free mice of the same school).
      let sepX = 0;
      let sepY = 0;
      let aliX = 0;
      let aliY = 0;
      let cohX = 0;
      let cohY = 0;
      let mates = 0;
      for (const o of mice) {
        if (o === m || o.gone) continue;
        const dx = m.x - o.x;
        const dy = m.y - o.y;
        const d2 = dx * dx + dy * dy;
        if (d2 === 0 || d2 > NEIGHBOUR_RADIUS * NEIGHBOUR_RADIUS) continue;
        const d = Math.sqrt(d2);
        if (d < SEPARATION_RADIUS) {
          const f = (SEPARATION_RADIUS - d) / SEPARATION_RADIUS;
          sepX += (dx / d) * f;
          sepY += (dy / d) * f;
        }
        if (!m.job && !o.job && o.school === m.school) {
          aliX += o.vx;
          aliY += o.vy;
          cohX += o.x;
          cohY += o.y;
          mates++;
        }
      }

      if (m.job) {
        const t = jobTarget(m, tmpA);
        // Critically-damped-ish spring: snappy, but never overshoots wildly.
        ax = (t.x - m.x) * 130 - m.vx * 20 + sepX * 260;
        ay = (t.y - m.y) * 130 - m.vy * 20 + sepY * 260;
      } else {
        ax = sepX * 520;
        ay = sepY * 520;
        if (mates) {
          ax += (aliX / mates - m.vx) * 1.6 + (cohX / mates - m.x) * 1.3;
          ay += (aliY / mates - m.vy) * 1.6 + (cohY / mates - m.y) * 1.3;
        }

        // Orbit the school's anchor (a point that wanders, or sits on the build site).
        const s = schools[m.school];
        const orbit = time * 0.8 + m.school * 2.1;
        const radius = exiting ? 0 : 1; // no loitering on the way out
        const sx = s.anchor.x + Math.cos(orbit) * 90 * radius;
        const sy = s.anchor.y + Math.sin(orbit) * 70 * radius;
        const dx = sx - m.x;
        const dy = sy - m.y;
        const d = Math.hypot(dx, dy) || 1;
        const pull = exiting ? 700 : 110 * Math.min(1, d / 120);
        ax += (dx / d) * pull;
        ay += (dy / d) * pull;

        // A touch of noise so the shoal never looks mechanical.
        m.wander += dt * 0.9;
        ax += Math.cos(m.wander * 1.7 + m.cruise) * 35;
        ay += Math.sin(m.wander) * 35;

        if (m.entered && !exiting) {
          const M = 36;
          const bottom = vh - 56; // keep clear of the ticker
          if (m.x < M) ax += (M - m.x) * 6;
          if (m.x > vw - M) ax -= (m.x - (vw - M)) * 6;
          if (m.y < M) ay += (M - m.y) * 6;
          if (m.y > bottom) ay -= (m.y - bottom) * 6;
        }

        // The page scrolling drags the shoal along a little, like a current.
        m.y -= scrollDy * 0.3;
      }

      m.vx += ax * dt;
      m.vy += ay * dt;

      // Speed envelope.
      const sp = Math.hypot(m.vx, m.vy);
      const max = m.job ? 1300 : exiting ? 650 : m.cruise * 1.5;
      const min = m.job ? 0 : exiting ? 300 : m.cruise * 0.6;
      let target = sp;
      if (sp > max) target = sp - (sp - max) * Math.min(1, dt * 3); // ease off after a sprint
      else if (sp < min) target = min;
      if (sp > 0.001 && target !== sp) {
        m.vx *= target / sp;
        m.vy *= target / sp;
      } else if (sp <= 0.001 && min > 0) {
        m.vx = Math.cos(m.heading) * min;
        m.vy = Math.sin(m.heading) * min;
      }

      m.x += m.vx * dt;
      m.y += m.vy * dt;

      // One non-finite value spreads to every neighbour through flocking — reset it.
      if (!Number.isFinite(m.x + m.y + m.vx + m.vy)) {
        const home = schools[m.school].anchor;
        m.x = Number.isFinite(home.x) ? home.x : vw / 2;
        m.y = Number.isFinite(home.y) ? home.y : vh / 2;
        m.vx = m.cruise;
        m.vy = 0;
        m.heading = 0;
      }

      if (Math.hypot(m.vx, m.vy) > 8) {
        const want = Math.atan2(m.vy, m.vx);
        m.heading += wrapAngle(want - m.heading) * Math.min(1, dt * (m.job ? 14 : 8));
      }

      if (exiting && (m.x < -90 || m.x > vw + 90 || m.y < -90 || m.y > vh + 90)) m.gone = true;
    }

    /* 6. Finale: everything built → swim a while → leave. */
    if (!exiting && time >= INTRO_DELAY && builds.every((b) => b.state === 'done')) {
      if (finaleAt < 0) finaleAt = time;
      else if (time - finaleAt >= FINALE_SWIM) {
        exiting = true;
        exitStart = time;
        // Each school leaves through whichever screen edge it is closest to.
        schools.forEach((s, si) => {
          let cx = 0;
          let cy = 0;
          let n = 0;
          for (const m of mice) {
            if (m.gone || m.school !== si) continue;
            cx += m.x;
            cy += m.y;
            n++;
          }
          if (n) {
            cx /= n;
            cy /= n;
          } else {
            cx = vw / 2;
            cy = vh / 2;
          }
          const toLeft = cx;
          const toRight = vw - cx;
          const toTop = cy;
          const toBottom = vh - cy;
          const nearest = Math.min(toLeft, toRight, toTop, toBottom);
          const OUT = 200;
          if (nearest === toLeft) s.exit = { x: -OUT, y: cy };
          else if (nearest === toRight) s.exit = { x: vw + OUT, y: cy };
          else if (nearest === toTop) s.exit = { x: cx, y: -OUT };
          else s.exit = { x: cx, y: vh + OUT };
        });
      }
    }
  };

  /* ── drawing ── */

  const draw = () => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, vw, vh);

    for (const b of builds) {
      let alpha: number;
      if (b.state === 'active') alpha = Math.min(1, b.t * 6);
      else if (b.state === 'done' && b.doneAt >= 0) alpha = 1 - clamp((time - b.doneAt) / FRAME_LINGER, 0, 1);
      else continue;
      drawBuildFrame(ctx, b.rect, {
        label: b.label,
        heads: b.heads,
        inked: b.inked,
        scan: b.state === 'active' && !b.line ? b.fill : null,
        line: b.line,
        alpha,
      });
    }

    for (const m of mice) {
      if (m.gone) continue;
      drawMouse(
        ctx,
        { x: m.x, y: m.y, heading: m.heading, size: m.size, phase: m.phase, speed: Math.hypot(m.vx, m.vy) },
        sprites[m.school],
      );
    }
  };

  /* ── loop ── */

  const finish = () => {
    if (finished) return;
    finished = true;
    stopped = true;
    cancelAnimationFrame(raf);
    root.classList.remove(SWARM_CLASS);
    onFinish();
  };

  const tick = (now: number) => {
    if (stopped) return;
    const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
    last = now;
    time += dt;

    syncViewport();
    update(dt);
    draw();

    const allGone = mice.every((m) => m.gone);
    if (exiting && (allGone || time - exitStart > EXIT_TIMEOUT)) {
      finish();
      return;
    }
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);

  return () => {
    stopped = true;
    cancelAnimationFrame(raf);
    if (!finished) releaseContent();
  };
}
