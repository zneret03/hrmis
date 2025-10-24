import { rgb, PDFPage } from 'pdf-lib';

export const drawCheckmark = (
  page: PDFPage,
  { x = 0, y = 0, size = 10, thickness = 1.5, color = rgb(0, 0, 0) },
): void => {
  const x1 = x + size * 0.1;
  const y1 = y + size * 0.4;
  const x2 = x + size * 0.4;
  const y2 = y + size * 0.1;
  const x3 = x + size * 0.9;
  const y3 = y + size * 0.7;

  page.drawLine({
    start: { x: x1, y: y1 },
    end: { x: x2, y: y2 },
    thickness: thickness,
    color: color,
  });
  page.drawLine({
    start: { x: x2, y: y2 },
    end: { x: x3, y: y3 },
    thickness: thickness,
    color: color,
  });
};
