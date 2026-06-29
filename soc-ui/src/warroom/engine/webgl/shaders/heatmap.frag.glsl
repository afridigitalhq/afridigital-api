precision highp float;

uniform float intensity;
uniform vec2 resolution;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;

  float heat = intensity * (1.0 - distance(uv, vec2(0.5)));

  vec3 color = mix(
    vec3(0.0, 0.0, 0.0),
    vec3(1.0, 0.0, 0.0),
    heat
  );

  gl_FragColor = vec4(color, heat);
}
