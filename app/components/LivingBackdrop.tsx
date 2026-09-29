"use client";
import { useEffect, useRef, type CSSProperties } from "react";
import { sceneAsset } from "../../lib/scenery";
const vertex = `attribute vec2 p;varying vec2 uv;void main(){uv=p*.5+.5;gl_Position=vec4(p,0.,1.);}`;
const fragment = `precision mediump float;
varying vec2 uv;uniform sampler2D art;uniform vec2 size;uniform vec2 imageSize;uniform float time;uniform float weather;uniform vec3 tint;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
void main(){
 vec2 st=uv;float ar=size.x/size.y,ir=imageSize.x/imageSize.y;
 vec2 cover=ar>ir?vec2(1.,ir/ar):vec2(ar/ir,1.);
 vec2 q=(st-.5)*cover*.986+.5;q.x+=sin(time*.075)*.0015;q.y+=cos(time*.06)*.001;
 if(weather==1.){float water=1.-smoothstep(.12,.34,st.y);q.x+=sin(st.y*140.+time*1.1)*.0015*water;q.y+=sin(st.x*42.+time*.7)*.0006*water;}
 vec3 c=texture2D(art,q).rgb;
 float haze=noise(st*vec2(4.,3.)+vec2(time*.018,-time*.004))*.6+noise(st*vec2(9.,5.)-vec2(time*.009,0.))*.4;
 c=mix(c,tint,(1.-smoothstep(.0,.72,st.y))*(.018+.085*haze));
 float lamp=(sin(time*2.1)+sin(time*3.7)*.3)*.016;c+=vec3(1.,.52,.2)*lamp*max(0.,c.r-c.b)*2.;
 if(weather==1.||weather==2.){vec2 rain=vec2(st.x+st.y*.14,st.y)*vec2(120.,8.);vec2 cell=floor(rain);float r=hash(vec2(cell.x,1.));float fall=fract(rain.y+time*(1.8+r)+r*8.);float drop=(1.-smoothstep(.008,.04,abs(fract(rain.x)-.5)))*(1.-smoothstep(.015,.16,fall));c+=vec3(.3,.42,.5)*drop*.28;}
 if(weather==3.){for(int i=0;i<2;i++){float k=float(i)+1.;vec2 snow=st*vec2(34.,20.)*k+vec2(sin(time*.1)*k,time*.22*k);vec2 cell=floor(snow);vec2 f=fract(snow)-vec2(hash(cell),hash(cell+2.));c+=(1.-smoothstep(.015,.065/k,length(f)))*vec3(.55,.65,.75)*.42;}}
 if(weather==4.){c+=tint*pow(max(0.,sin(st.x*5.+st.y*1.6+time*.022)),18.)*.055;}
 c*=.78+.22*(1.-smoothstep(.1,.8,length((st-.5)*vec2(1.,.75))));gl_FragColor=vec4(c,1.);
}`;
/** Artwork displacement and lighting; no duplicated character/flag sprites. */
export default function LivingBackdrop({
  region = "fortress",
  enabled = true,
}: {
  region?: string;
  enabled?: boolean;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const path = sceneAsset(region);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    canvas.style.opacity = "0";
    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      powerPreference: "low-power",
    });
    if (!gl) return;
    const shaders: WebGLShader[] = [];
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      shaders.push(shader);
      return shader;
    };
    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vertex));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      shaders.forEach((s) => gl.deleteShader(s));
      gl.deleteProgram(program);
      return;
    }
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const pos = gl.getAttribLocation(program, "p");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const locations = Object.fromEntries(
      ["size", "imageSize", "time", "weather", "tint"].map((n) => [
        n,
        gl.getUniformLocation(program, n),
      ]),
    );
    const water = ["harbor", "archive"].includes(region),
      snow = region === "observatory",
      interior = ["chapel", "laboratory"].includes(region);
    gl.uniform1f(locations.weather, water ? 1 : snow ? 3 : interior ? 4 : 2);
    const color =
      region === "laboratory"
        ? [0.22, 0.44, 0.48]
        : region === "chapel"
          ? [0.66, 0.54, 0.36]
          : region === "palace"
            ? [0.45, 0.31, 0.36]
            : [0.36, 0.45, 0.5];
    gl.uniform3f(locations.tint, color[0], color[1], color[2]);
    let loaded = false,
      disposed = false,
      visible = true,
      frame = 0,
      last = 0,
      elapsed = 0;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const ratio = Math.min(
        devicePixelRatio || 1,
        1.5,
        1400 / Math.max(1, r.width),
      );
      canvas.width = Math.max(1, Math.round(r.width * ratio));
      canvas.height = Math.max(1, Math.round(r.height * ratio));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(locations.size, canvas.width, canvas.height);
    };
    const draw = (stamp: number) => {
      frame = 0;
      if (disposed || !loaded || !visible || document.hidden) return;
      if (stamp - last >= 33 || !enabled || motion.matches) {
        elapsed += Math.min(0.06, Math.max(0, (stamp - last) / 1000));
        last = stamp;
        gl.uniform1f(locations.time, enabled && !motion.matches ? elapsed : 0);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        canvas.style.opacity = "1";
      }
      if (enabled && !motion.matches) frame = requestAnimationFrame(draw);
    };
    const resume = () => {
      cancelAnimationFrame(frame);
      last = performance.now() - 34;
      frame = requestAnimationFrame(draw);
    };
    const observer = new ResizeObserver(() => {
      resize();
      resume();
    });
    observer.observe(canvas);
    const intersection = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      resume();
    });
    intersection.observe(canvas);
    const img = new Image();
    img.onload = () => {
      if (disposed) return;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
      gl.uniform2f(locations.imageSize, img.width, img.height);
      loaded = true;
      resize();
      resume();
    };
    img.src = path;
    document.addEventListener("visibilitychange", resume);
    motion.addEventListener("change", resume);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      img.onload = null;
      observer.disconnect();
      intersection.disconnect();
      document.removeEventListener("visibilitychange", resume);
      motion.removeEventListener("change", resume);
      gl.deleteBuffer(buffer);
      gl.deleteTexture(texture);
      shaders.forEach((s) => gl.deleteShader(s));
      gl.deleteProgram(program);
    };
  }, [region, enabled, path]);
  return (
    <div
      className={`living-backdrop wallpaper-scene scenery-${region} ${enabled ? "" : "scenery-paused"}`}
      aria-hidden="true"
      style={{ backgroundImage: `url("${path}")` }}
    >
      <canvas ref={ref} />
      {!["harbor", "archive", "laboratory", "observatory"].includes(region) &&
        Array.from({ length: 6 }, (_, i) => (
          <i
            key={i}
            className="scenery-leaf"
            style={
              {
                "--leaf-x": `${i * 18}%`,
                "--leaf-delay": `${-i * 2.7}s`,
                "--leaf-duration": `${12 + i * 2}s`,
              } as CSSProperties
            }
          />
        ))}
    </div>
  );
}
