import jsPDF from "jspdf";

export function downloadAsPDF(content: string, filename: string = "resume.pdf"): void {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const usableWidth = pageWidth - margin * 2;

  doc.setFontSize(10);
  doc.setTextColor(30, 30, 30);

  const lines = doc.splitTextToSize(content, usableWidth);
  let y = margin;
  const lineHeight = 5.5;

  for (const line of lines) {
    if (y + lineHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
    doc.text(line, margin, y);
    y += lineHeight;
  }

  doc.save(filename);
}
