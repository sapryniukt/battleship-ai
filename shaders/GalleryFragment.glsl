uniform sampler2D map;
uniform vec3 color;
varying vec2 vUv;
void main() {
    if (gl_FrontFacing) {
        gl_FragColor = texture2D(map, vUv);
    } else {
        gl_FragColor = vec4(color, 1.0);
    }
}