const frag = `
precision mediump float;

uniform sampler2D uMainSampler;   // filled by Phaser
uniform vec2      resolution;     // set in onPreRender
varying vec2      outTexCoord;    // 0-1

void main() {
    vec2 uv  = outTexCoord;
    vec2 px  = vec2(1.0) / resolution;             // pixel size

    // Sample the 4 diagonal neighbors
    vec3 rgbNW = texture2D(uMainSampler, uv + px * vec2(-1.0, -1.0)).rgb;
    vec3 rgbNE = texture2D(uMainSampler, uv + px * vec2( 1.0, -1.0)).rgb;
    vec3 rgbSW = texture2D(uMainSampler, uv + px * vec2(-1.0,  1.0)).rgb;
    vec3 rgbSE = texture2D(uMainSampler, uv + px * vec2( 1.0,  1.0)).rgb;
    vec3 rgbM  = texture2D(uMainSampler, uv).rgb;

    // Compute luminance (perceptual grey)
    float lumaNW = dot(rgbNW, vec3(0.299, 0.587, 0.114));
    float lumaNE = dot(rgbNE, vec3(0.299, 0.587, 0.114));
    float lumaSW = dot(rgbSW, vec3(0.299, 0.587, 0.114));
    float lumaSE = dot(rgbSE, vec3(0.299, 0.587, 0.114));
    float lumaM  = dot(rgbM , vec3(0.299, 0.587, 0.114));

    float lumaMin = min(lumaM, min(min(lumaNW, lumaNE), min(lumaSW, lumaSE)));
    float lumaMax = max(lumaM, max(max(lumaNW, lumaNE), max(lumaSW, lumaSE)));

    // Early exit: no edge here
    if (lumaMax - lumaMin < 0.5) {   // tunable threshold
        gl_FragColor = vec4(rgbM, 1.0);
        return;
    }

    // Blend diagonally - cheap variant of FXAA 3.11
    vec3 blend = (rgbNW + rgbNE + rgbSW + rgbSE) * 0.25;
    gl_FragColor = vec4(blend, 1.0);
}`;

export class FXAAPipeline extends Phaser.Renderer.WebGL.Pipelines
  .PostFXPipeline {
  constructor(game: Phaser.Game) {
    super({ game, renderTarget: true, fragShader: frag });
  }

  onPreRender(): void {
    // Pass the current back-buffer size every frame
    this.set2f('resolution', this.renderer.width, this.renderer.height);
  }
}
