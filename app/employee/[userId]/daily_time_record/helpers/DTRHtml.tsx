import { DTREmployee } from '@/services/biometrics/biometrics.services';
import { DTRMonth } from '@/lib/types/biometrics';

export function buildPrintHTML(month: DTRMonth, employee: DTREmployee): string {
  const fullName = [employee.last_name, employee.first_name]
    .filter((v): v is string => Boolean(v))
    .join(', ');

  const rows = month.records
    .map(
      (record) => `
      <tr>
        <td>${record.day}</td>
        <td>${record.morning_in ?? ''}</td>
        <td>${record.morning_out ?? ''}</td>
        <td>${record.afternoon_in ?? ''}</td>
        <td>${record.afternoon_out ?? ''}</td>
      </tr>`,
    )
    .join('');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>DTR - ${month.month_label}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; font-size: 11px; padding: 24px; }
    h2 { text-align: center; font-size: 14px; margin-bottom: 4px; letter-spacing: 1px; }
    .subtitle { text-align: center; font-size: 11px; margin-bottom: 16px; }
    .info { display: flex; justify-content: space-between; margin-bottom: 12px; }
    .info-item { display: flex; gap: 4px; }
    .info-label { font-weight: bold; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; }
    th, td { border: 1px solid #000; padding: 4px 8px; text-align: center; }
    thead th { background: #e0e0e0; font-weight: bold; }
    tbody tr:nth-child(even) { background: #f9f9f9; }
    .footer { margin-top: 32px; display: flex; justify-content: space-between; }
    .signature-line { border-top: 1px solid #000; width: 200px; text-align: center; padding-top: 4px; font-size: 10px; }
    @media print { body { padding: 12px; } }
  </style>
</head>
<body>
  <h2>DAILY TIME RECORD</h2>
  <p class="subtitle">Civil Service Form No. 48</p>
  <div class="info">
    <div class="info-item">
      <span class="info-label">Name:</span>
      <span>${fullName || employee.employee_id}</span>
    </div>
    <div class="info-item">
      <span class="info-label">Month:</span>
      <span>${month.month_label}</span>
    </div>
  </div>
  <div class="info">
    <div class="info-item">
      <span class="info-label">Position:</span>
      <span>${employee.position ?? ''}</span>
    </div>
    <div class="info-item">
      <span class="info-label">Employee ID:</span>
      <span>${employee.employee_id}</span>
    </div>
  </div>
  <table>
    <thead>
      <tr>
        <th rowspan="2">Day</th>
        <th colspan="2">Forenoon (AM)</th>
        <th colspan="2">Afternoon (PM)</th>
      </tr>
      <tr>
        <th>Arrival</th>
        <th>Departure</th>
        <th>Arrival</th>
        <th>Departure</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="footer">
    <div class="signature-line">Employee Signature</div>
    <div class="signature-line">Supervisor Signature</div>
  </div>
</body>
</html>`;
}
