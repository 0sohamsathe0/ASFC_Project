import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

const exportCertificate = async (
  element,
  fileName = "certificate.pdf"
) => {
  if (!element) {
    console.error("No certificate element found.");
    return;
  }

  try {
    // Capture certificate
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
    });

    // Convert canvas to compressed JPEG
    const imgData = canvas.toDataURL("image/jpeg", 0.92);

    // Create PDF
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    // A4 Landscape dimensions
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Canvas dimensions
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Calculate aspect ratios
    const canvasRatio = canvasWidth / canvasHeight;
    const pageRatio = pageWidth / pageHeight;

    let pdfWidth;
    let pdfHeight;

    if (canvasRatio > pageRatio) {
      // Fit to page width
      pdfWidth = pageWidth;
      pdfHeight = pageWidth / canvasRatio;
    } else {
      // Fit to page height
      pdfHeight = pageHeight;
      pdfWidth = pageHeight * canvasRatio;
    }

    // Center the certificate
    const x = (pageWidth - pdfWidth) / 2;
    const y = (pageHeight - pdfHeight) / 2;

    pdf.addImage(
      imgData,
      "JPEG",
      x,
      y,
      pdfWidth,
      pdfHeight,
      undefined,
      "FAST"
    );

    pdf.save(fileName);
  } catch (error) {
    console.error("Error exporting certificate:", error);
  }
};

export default exportCertificate;