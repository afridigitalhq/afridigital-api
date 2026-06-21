#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D u_velocity;
uniform sampler2D u_particles;
uniform vec2 u_resolution;

void main() {
  vec2 uv = vUv;

  vec4 particle = texture(u_particles, uv);
  vec2 pos = particle.xy;
  vec2 vel = texture(u_velocity, pos).xy;

  // advection step (flow field movement)
  vec2 newPos = pos + vel * 0.01;

  // boundary clamp
  newPos = clamp(newPos, 0.0, 1.0);

  fragColor = vec4(newPos, particle.zw);
}
