export const fieldFragmentShader = `
precision mediump float;

uniform float time;
uniform vec2 resolution;
uniform float intensity;

float rand(vec2 co){
  return fract(sin(dot(co.xy, vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;

  // radial wave origin (center SOC pulse)
  float dist = distance(uv, vec2(0.5));

  // shockwave propagation
  float wave = sin(10.0 * dist - time * 2.0);

  // diffusion decay
  float decay = exp(-dist * 3.0);

  // noise field for instability
  float noise = rand(uv + time * 0.1) * 0.2;

  float field = (wave * decay + noise) * intensity;

  gl_FragColor = vec4(field, field * 0.3, 0.0, field);
}
`;
