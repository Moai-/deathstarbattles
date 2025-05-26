export const addShadow = (
  scene: Phaser.Scene,
  container: Phaser.GameObjects.Container,
  radius: number,
  options = {
    color: 0x000000,
    alpha: 0.4,
    angle: Math.PI * 2, // Angle of light (top-left)
    offsetFactor: 0.6, // Controls depth of crescent
    cutoutScale: 1, // Smaller radius for cutout
  },
) => {
  const { color, alpha, angle, offsetFactor, cutoutScale } = options;

  const graphics = scene.add.graphics();
  graphics.fillStyle(color, alpha);

  const cutoutRadius = radius * cutoutScale;
  const offset = radius * offsetFactor;
  const cutoutX = Math.cos(angle) * offset;
  const cutoutY = Math.sin(angle) * offset;

  const startAngle = angle + Math.PI / 2; // Start and end angles of shadow
  const endAngle = angle - Math.PI / 2;

  graphics.beginPath();

  // Outer arc (main circle)
  graphics.arc(0, 0, radius, startAngle, endAngle, false);

  // Inner arc (cutout) - partial arc in reverse
  // graphics.save();
  graphics.translateCanvas(-cutoutX * 0.3, 0);
  graphics.setScale(0.85, 1);
  // graphics.fillStyle(color, alpha);
  // graphics.fillEllipse(cutoutX, cutoutY, radius, radius);
  graphics.arc(cutoutX, cutoutY, cutoutRadius, endAngle, startAngle, true);
  // graphics.restore();

  graphics.closePath();
  graphics.fillPath();

  // Cull outside pixels
  // const side = radius * 2 * 1.25;
  // const rt = scene.make.renderTexture({
  //   width: side,
  //   height: side,
  // });
  // rt.draw(graphics);
  // graphics.destroy();

  // const width = side;
  // const height = side;
  // const centerX = container.x;
  // const centerY = container.y;

  // rt.snapshot((snapshot) => {
  //   // image is an HTMLImageElement containing the rendered texture

  //   // 3️⃣ Create an offscreen canvas and draw the snapshot image
  //   const offCanvas = document.createElement('canvas');
  //   offCanvas.width = width;
  //   offCanvas.height = height;
  //   const ctx = offCanvas.getContext('2d')!;
  //   ctx.drawImage(snapshot as HTMLImageElement, 0, 0);

  //   // 4️⃣ Get ImageData for pixel manipulation
  //   const imgData = ctx.getImageData(0, 0, width, height);
  //   const data = imgData.data;

  //   // 5️⃣ Cull pixels outside the circle
  //   const radSq = radius * radius;
  //   for (let y = 0; y < height; y++) {
  //     for (let x = 0; x < width; x++) {
  //       const dx = x - centerX;
  //       const dy = y - centerY;
  //       const distSq = dx * dx + dy * dy;

  //       if (distSq > radSq) {
  //         const idx = (y * width + x) * 4;
  //         data[idx + 0] = 100; // R
  //         data[idx + 1] = 100; // G
  //         data[idx + 2] = 100; // B
  //         data[idx + 3] = 100; // A
  //       }
  //     }
  //   }

  //   // 6️⃣ Put the modified ImageData back
  //   ctx.putImageData(imgData, 0, 0);

  //   // 7️⃣ Create a Phaser texture from the canvas
  //   const key = Phaser.Utils.String.UUID();
  //   scene.textures.addCanvas(key, offCanvas);

  //   // 8️⃣ Add to container
  //   const imageObj = scene.add.image(0, 0, key);
  //   imageObj.setPosition(500, 500);
  //   // container.add(imageObj);
  // });

  container.add(graphics);
};
