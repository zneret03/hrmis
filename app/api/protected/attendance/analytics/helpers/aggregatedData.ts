import {
  AttendanceRecord,
  FormattedYear,
  AggregatedDataObject,
} from '@/lib/types/attendance';

export function aggregateAttendance(
  records: AttendanceRecord[],
  filterYear?: number,
): FormattedYear[] {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const recordsToProcess = filterYear
    ? records.filter(
        (record) => new Date(record.month).getFullYear() === filterYear,
      )
    : records;

  if (recordsToProcess.length === 0) {
    return [];
  }

  const aggregatedData = recordsToProcess.reduce(
    (acc: AggregatedDataObject, record) => {
      const date = new Date(record.month);
      const year = date.getFullYear().toString();
      const monthName = monthNames[date.getMonth()];

      if (!acc[year]) {
        acc[year] = {};
        monthNames.forEach((name) => {
          acc[year][name] = {
            days_present: 0,
            tardiness_count: 0,
            days_absent: 0,
          };
        });
      }

      acc[year][monthName].days_present += record.days_present;
      acc[year][monthName].tardiness_count += record.tardiness_count;
      acc[year][monthName].days_absent += record.days_absent;

      return acc;
    },
    {},
  );

  const finalFormattedArray = Object.keys(aggregatedData)
    .sort()
    .map((year) => {
      const yearData = aggregatedData[year];
      const monthDataArray = monthNames.map((monthName) => ({
        month: monthName,
        ...yearData[monthName],
      }));

      return {
        year: parseInt(year, 10),
        data: monthDataArray,
      };
    });

  return finalFormattedArray;
}
