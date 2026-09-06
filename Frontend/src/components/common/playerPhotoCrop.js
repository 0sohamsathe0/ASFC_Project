const OUTPUT_WIDTH = 800;
const OUTPUT_HEIGHT = 1000;
const OUTPUT_TYPE = "image/jpeg";
const OUTPUT_QUALITY = 0.88;

const calculateMinimumZoom = (mediaSize, cropSize) => {
  if (
    !mediaSize?.width ||
    !mediaSize?.height ||
    !cropSize?.width ||
    !cropSize?.height
  ) {
    return 1;
  }

  // react-easy-crop applies zoom to the already rendered media. This is the
  // smallest multiplier that still covers every edge of the crop rectangle.
  return Math.max(
    cropSize.width / mediaSize.width,
    cropSize.height / mediaSize.height
  );
};

const loadImage = (source) =>
  new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("The selected image could not be decoded."));
    // Modern browsers apply phone-camera EXIF orientation while decoding. Setting
    // this explicitly keeps the crop preview and canvas output on the same basis.
    image.style.imageOrientation = "from-image";
    image.src = source;
  });

const canvasToBlob = (canvas) =>
  new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob || blob.size === 0) {
          reject(new Error("The cropped photo could not be created."));
          return;
        }

        resolve(blob);
      },
      OUTPUT_TYPE,
      OUTPUT_QUALITY
    );
  });

const createPlayerPhotoFile = async (imageSource, cropPixels) => {
  if (
    !cropPixels ||
    cropPixels.width <= 0 ||
    cropPixels.height <= 0
  ) {
    throw new Error("Please wait for the photo to finish loading.");
  }

  const image = await loadImage(imageSource);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Photo processing is not supported in this browser.");
  }

  canvas.width = OUTPUT_WIDTH;
  canvas.height = OUTPUT_HEIGHT;

  // JPEG has no transparency. A white base avoids dark backgrounds for PNGs
  // that contain transparent pixels.
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, OUTPUT_WIDTH, OUTPUT_HEIGHT);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(
    image,
    cropPixels.x,
    cropPixels.y,
    cropPixels.width,
    cropPixels.height,
    0,
    0,
    OUTPUT_WIDTH,
    OUTPUT_HEIGHT
  );

  const blob = await canvasToBlob(canvas);

  return new File([blob], "player-profile.jpg", {
    type: OUTPUT_TYPE,
    lastModified: Date.now(),
  });
};

export {
  calculateMinimumZoom,
  createPlayerPhotoFile,
  OUTPUT_HEIGHT,
  OUTPUT_TYPE,
  OUTPUT_WIDTH,
};
