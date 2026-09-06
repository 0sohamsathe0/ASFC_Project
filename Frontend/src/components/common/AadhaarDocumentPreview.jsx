import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

function AadhaarDocumentPreview({ fileName, fileType, onClose, open, source }) {
  const isPdf = fileType === "application/pdf";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="aadhaar-document-preview-title"
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: { xs: 2, sm: 3 },
          m: { xs: 1.5, sm: 3 },
          maxHeight: "calc(100dvh - 24px)",
        },
      }}
    >
      <DialogTitle id="aadhaar-document-preview-title" sx={{ pb: 1 }}>
        <span className="block text-xl font-bold text-slate-900">
          Aadhaar Card Preview
        </span>
        <span className="mt-1 block truncate text-sm font-normal text-slate-500">
          {fileName}
        </span>
      </DialogTitle>

      <DialogContent sx={{ px: { xs: 2, sm: 3 }, py: 1 }}>
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
          {isPdf ? (
            <iframe
              src={`${source}#toolbar=0&navpanes=0`}
              title="Aadhaar PDF preview"
              className="h-[min(68dvh,680px)] w-full bg-white"
            />
          ) : (
            <img
              src={source}
              alt="Selected Aadhaar card preview"
              className="max-h-[68dvh] min-h-48 w-full object-contain"
            />
          )}
        </div>

        {isPdf && (
          <p className="mt-2 text-xs text-slate-500">
            If the PDF does not appear on your device, use Open PDF below.
          </p>
        )}
      </DialogContent>

      <DialogActions sx={{ px: { xs: 2, sm: 3 }, py: 2, gap: 1 }}>
        {isPdf && (
          <Button
            component="a"
            href={source}
            target="_blank"
            rel="noopener noreferrer"
            variant="outlined"
            sx={{ minHeight: 44 }}
          >
            Open PDF
          </Button>
        )}
        <Button
          type="button"
          onClick={onClose}
          variant="contained"
          sx={{ minHeight: 44, minWidth: 96 }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AadhaarDocumentPreview;
