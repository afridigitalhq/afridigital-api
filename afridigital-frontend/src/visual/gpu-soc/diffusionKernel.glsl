#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D u_state;
uniform vec2 u_resolution;
uniform float u_time;

/*
Reaction-Diffusion + Shockwave decay model:
- diffusion: spreads heat
- decay: reduces intensity over time
- excitation: incoming SOC events
*/

void main() {
  vec2 uv = vUv;

  vec4 center = texture(u_state, uv);

  vec4 left   = texture(u_state, uv + vec2(-1.0/u_resolution.x, 0.0));
  vec4 right  = texture(u_state, uv + vec2( 1.0/u_resolution.x, 0.0));
  vec4 up     = texture(u_state, uv + vec2(0.0,  1.0/u_resolution.y));
  vec4 down   = texture(u_state, uv + vec2(0.0, -1.0/u_resolution.y));

  vec4 laplacian = (left + right + up + down - 4.0 * center);

  float diffusion = 0.20;
  float decay = 0.985;

  vec4 state = center;

  // heat diffusion
  state += diffusion * laplacian;

  // shockwave decay
  state *= decay;

  fragColor = state;
}
