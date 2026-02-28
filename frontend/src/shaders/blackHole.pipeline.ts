import { Collision } from 'shared/src/ecs/components';
import { TargetCache } from 'shared/src/types';

const MAX_BH = 30;

const frag = `
precision mediump float;

#define MAX_BH 30
uniform int       bhCount;
uniform vec2      bhCenters[MAX_BH];
uniform float     bhRadius [MAX_BH];
uniform float     bhStrength[MAX_BH];

uniform vec2      resolution;
uniform sampler2D uMainSampler;
varying vec2      outTexCoord;      

void main () {
    vec2 uv = outTexCoord;            // 0-1
    vec2 frag = uv * resolution;      // pixels

    // Accumulate displacement from every hole
    for (int i = 0; i < MAX_BH; ++i) {
        if (i >= bhCount) break;

        vec2  dir   = frag - bhCenters[i];
        float dist  = length(dir);
        if (dist < bhRadius[i]) {       // inside event horizon: fade to black
            gl_FragColor = vec4(0.0);
            return;
        }

        // Inverse-square fall-off with tunable strength
        float offset = bhStrength[i] / (dist * dist + 1.0);
        uv -= normalize(dir) * offset / resolution;   // lensing
    }

    vec4 col = texture2D(uMainSampler, uv);
    gl_FragColor = col;
}`;

export class BlackHolePipeline extends Phaser.Renderer.WebGL.Pipelines
  .PostFXPipeline {
  private centers = new Float32Array(MAX_BH * 2);
  private radii = new Float32Array(MAX_BH);
  private strengths = new Float32Array(MAX_BH);

  constructor(game: Phaser.Game) {
    super({ game, renderTarget: true, fragShader: frag });
  }

  updateHoles(holes: TargetCache) {
    const count = Math.min(holes.length, MAX_BH);
    for (let i = 0; i < count; i++) {
      this.centers[i * 2] = holes[i].x;
      this.centers[i * 2 + 1] = this.renderer.height - holes[i].y;
      this.radii[i] = Collision.radius[holes[i].eid];
      this.strengths[i] = 20000;
    }
    this.set1i('bhCount', count);
    this.set2fv('bhCenters', this.centers);
    this.set1fv('bhRadius', this.radii);
    this.set1fv('bhStrength', this.strengths);
    this.set2f('resolution', this.renderer.width, this.renderer.height);
  }
}
