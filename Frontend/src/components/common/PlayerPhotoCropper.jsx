import { useCallback, useRef, useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slider,
} from "@mui/material";
import Cropper from "react-easy-crop";

import {
  calculateMinimumZoom,
  createPlayerPhotoFile,
} from "./playerPhotoCrop.js";

const DEFAULT_CROP = { x: 0, y: 0 };

function PlayerPhotoCropper({
  errorMessage,
  imageSource,
  initialCrop,
  initialZoom = 1,
  onCancel,
  onConfirm,
  onReplace,
  open,
}) {
  const [crop, setCrop] = useState(initialCrop || DEFAULT_CROP);
  const [zoom, setZoom] = useState(initialZoom);
  const [minimumZoom, setMinimumZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [processingError, setProcessingError] = useState("");
  const mediaSizeRef = useRef(null);
  const cropSizeRef = useRef(null);
  const hasCalculatedInitialZoomRef = useRef(false);

  const updateMinimumZoom = useCallback(
    (mediaSize, cropSize) => {
      if (!mediaSize || !cropSize) return;

      const nextMinimumZoom = calculateMinimumZoom(mediaSize, cropSize);
      setMinimumZoom(nextMinimumZoom);
      setZoom((currentZoom) => {
        if (!hasCalculatedInitialZoomRef.current) {
          hasCalculatedInitialZoomRef.current = true;
          return Math.max(nextMinimumZoom, initialZoom);
        }

        return Math.max(nextMinimumZoom, currentZoom);
      });
    },
    [initialZoom]
  );

  const handleMediaLoaded = useCallback(
    (mediaSize) => {
      mediaSizeRef.current = mediaSize;
      updateMinimumZoom(mediaSize, cropSizeRef.current);
    },
    [updateMinimumZoom]
  );

  const handleCropSizeChange = useCallback(
    (cropSize) => {
      cropSizeRef.current = cropSize;
      updateMinimumZoom(mediaSizeRef.current, cropSize);
    },
    [updateMinimumZoom]
  );

  const handleCropComplete = useCallback((_, areaPixels) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleConfirm = async () => {
    try {
      setProcessing(true);
      setProcessingError("");
      const file = await createPlayerPhotoFile(imageSource, croppedAreaPixels);
      await onConfirm(file, { crop, zoom });
    } catch (error) {
      setProcessingError(
        error instanceof Error
          ? error.message
          : "The cropped photo could not be created. Please try again."
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={processing ? undefined : onCancel}
      aria-labelledby="player-photo-crop-title"
      aria-describedby="player-photo-crop-description"
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: { xs: 2, sm: 3 },
          m: { xs: 1.5, sm: 3 },
          maxHeight: "calc(100dvh - 24px)",
        },
      }}
    >
      <DialogTitle id="player-photo-crop-title" sx={{ pb: 0.75 }}>
        <span className="block text-xl font-bold text-slate-900">
          Adjust your photo
        </span>
      </DialogTitle>

      <DialogContent sx={{ px: { xs: 2, sm: 3 }, pb: 1.5 }}>
        <p
          id="player-photo-crop-description"
          className="mb-3 text-sm leading-5 text-slate-600"
        >
          Position the player&apos;s face inside the frame. This photo will be
          used on the player profile.
        </p>

        <div className="relative h-[clamp(220px,43dvh,390px)] overflow-hidden rounded-xl bg-slate-950">
          {imageSource && (
            <Cropper
              image={imageSource}
              crop={crop}
              zoom={zoom}
              minZoom={minimumZoom}
              maxZoom={minimumZoom + 2}
              zoomSpeed={0.15}
              aspect={4 / 5}
              cropShape="rect"
              objectFit="contain"
              restrictPosition
              showGrid
              roundCropAreaPixels
              onCropChange={setCrop}
              onCropComplete={handleCropComplete}
              onCropSizeChange={handleCropSizeChange}
              onMediaLoaded={handleMediaLoaded}
              onZoomChange={setZoom}
              mediaProps={{ alt: "Player photo being cropped" }}
              style={{ mediaStyle: { imageOrientation: "from-image" } }}
            />
          )}
        </div>

        <div className="mt-4 flex items-center gap-3">
          <label
            htmlFor="player-photo-zoom"
            className="shrink-0 text-sm font-semibold text-slate-700"
          >
            Zoom
          </label>
          <Slider
            id="player-photo-zoom"
            value={zoom}
            min={minimumZoom}
            max={minimumZoom + 2}
            step={0.01}
            onChange={(_, value) => setZoom(value)}
            disabled={processing}
            aria-label="Zoom player photo"
            sx={{ color: "#2563eb" }}
          />
        </div>

        <button
          type="button"
          onClick={onReplace}
          disabled={processing}
          className="min-h-11 rounded-lg px-2 text-sm font-semibold text-blue-700 underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Choose another photo
        </button>

        {(processingError || errorMessage) && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {processingError || errorMessage}
          </Alert>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          gap: 1,
          px: { xs: 2, sm: 3 },
          pb: { xs: 2, sm: 3 },
          pt: 1,
        }}
      >
        <Button
          type="button"
          variant="outlined"
          onClick={onCancel}
          disabled={processing}
          sx={{ minHeight: 44, minWidth: 96 }}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="contained"
          onClick={handleConfirm}
          disabled={processing || !croppedAreaPixels}
          sx={{ minHeight: 44, minWidth: 112 }}
        >
          {processing ? "Processing..." : "Use Photo"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PlayerPhotoCropper;
