const html2canvas = (await import("html2canvas-pro")).default;
const jsPDF = (await import("jspdf")).default;

const exportCertificate = async (
  element,
  fileName = "certificate.pdf"
) => {
  if (!element) {
    console.error("No certificate element found.");
    return;
  }

  try {
    /* ---------------- Wait for fonts ---------------- */

    if (document.fonts) {
      await document.fonts.ready;
    }

    /* ---------------- Wait for images ---------------- */

    const images = element.querySelectorAll("img");

    await Promise.all(
      [...images].map((img) => {
        if (img.complete) return Promise.resolve();

        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      })
    );

    /* ---------------- Capture Certificate ---------------- */

    const canvas = await html2canvas(element, {
      scale: 2.5,

      useCORS: true,

      allowTaint: true,

      backgroundColor: "#ffffff",

      logging: false,

      imageTimeout: 0,

      removeContainer: true,
    });

    /* ---------------- Convert Canvas ---------------- */

const imgData = canvas.toDataURL("image/jpeg", 0.95);
    /* ---------------- Create PDF ---------------- */

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    const canvasRatio = canvasWidth / canvasHeight;
    const pageRatio = pageWidth / pageHeight;

    let pdfWidth;
    let pdfHeight;

    if (canvasRatio > pageRatio) {
      pdfWidth = pageWidth;
      pdfHeight = pageWidth / canvasRatio;
    } else {
      pdfHeight = pageHeight;
      pdfWidth = pageHeight * canvasRatio;
    }

    const x = (pageWidth - pdfWidth) / 2;
    const y = (pageHeight - pdfHeight) / 2;

    /* ---------------- Add Image ---------------- */

    pdf.addImage(
      imgData,
      "PNG",
      x,
      y,
      pdfWidth,
      pdfHeight,
      undefined,
      "FAST"
    );

    /* ---------------- Safe File Name ---------------- */

    const safeFileName = fileName.replace(
      /[\\/:*?"<>|]/g,
      " : "
    );

    pdf.save(safeFileName);
  } catch (error) {
    console.error("Error exporting certificate:", error);
  }
};

export default exportCertificate;