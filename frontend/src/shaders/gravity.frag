precision mediump float;

uniform vec2 resolution;
uniform float centerX;
uniform float centerY;
uniform float radius;
uniform float strength;
uniform float hardness;

varying vec2 fragCoord;

void main() {
    vec2 center = vec2(centerX, centerY);
    float dist = distance(fragCoord, center);

    if (radius > 0.0 && dist > radius) {
        discard;
    }

    float intensity = strength / (dist * dist + 1.0); // Inverse square falloff
    intensity = clamp(intensity, 0.0, 1.0);
    intensity = pow(intensity, hardness); // Optional hardness control

    // Corrected color mapping: red (high), purple (mid), blue (low)
    float red   = intensity;
    float blue  = 1.0 - intensity;
    float green = 0.0;

    // Mix some purple in mid-range
    float purpleMix = 4.0 * intensity * (1.0 - intensity); // bell curve
    red   += 0.5 * purpleMix;
    blue  += 0.5 * purpleMix;

    // Normalize
    float alpha = intensity;

    vec3 color = normalize(vec3(red, green, blue)) * alpha;


    gl_FragColor = vec4(color, alpha);
}
