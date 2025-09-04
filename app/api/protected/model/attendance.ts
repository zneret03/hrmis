import { createClient } from '@/config'
import { parseTimestamp, parseCSVLine } from '../../helpers/csvHelpers'
import { generalErrorResponse, successResponse } from '../../helpers/response'

interface BiometricRecord {
  employee_id: string
  timestamp: string
  type: number
}

export async function processCSVData(rawData: string) {
  try {
    const supabase = await createClient()
    const lines = rawData
      .trim()
      .split('\n')
      .filter((line) => line.trim())

    const recordsByEmployee: {
      [employeeId: string]: { date: string; scans: BiometricRecord[] }[]
    } = {}
    const employeeAttendance: {
      [employeeId: string]: { daysPresent: number }
    } = {}
    const hoursByEmployee: {
      [employeeId: string]: { [date: string]: number }
    } = {}
    let earliestTimestamp: Date | null = null

    for (const line of lines) {
      const columns = parseCSVLine(line)
      if (columns.length < 5) {
        console.warn(`Skipping invalid line: ${line}`)
        continue
      }

      const employeeId = columns[0]
      const timestampRaw = columns[1]
      const typeRaw = parseInt(columns[4])

      // Skip header row if type is not a number
      if (isNaN(typeRaw)) {
        console.warn(`Skipping header or invalid type in line: ${line}`)
        continue
      }

      if (![1, 15].includes(typeRaw)) {
        console.warn(
          `Invalid type ${typeRaw} for employee ${employeeId} at ${timestampRaw}`
        )
        continue
      }

      let timestamp: string
      try {
        const formattedTimestamp = parseTimestamp(timestampRaw)
        const date = new Date(formattedTimestamp)
        if (isNaN(date.getTime())) throw new Error('Invalid date')
        timestamp = date.toISOString().replace('Z', '-08:00') // PST offset
        if (!earliestTimestamp || date < earliestTimestamp) {
          earliestTimestamp = date
        }
      } catch (e) {
        console.warn(
          `Invalid timestamp ${timestampRaw} for employee ${employeeId} ${e}`
        )
        continue
      }

      if (!recordsByEmployee[employeeId]) {
        recordsByEmployee[employeeId] = []
        employeeAttendance[employeeId] = { daysPresent: 0 }
        hoursByEmployee[employeeId] = {}
      }

      const date = timestamp.split('T')[0]

      let dateGroup = recordsByEmployee[employeeId].find(
        (group) => group.date === date
      )
      if (!dateGroup) {
        dateGroup = { date, scans: [] }
        recordsByEmployee[employeeId].push(dateGroup)
      }

      dateGroup.scans.push({
        employee_id: employeeId,
        timestamp,
        type: typeRaw
      })
    }

    const finalRecords: BiometricRecord[] = []
    for (const employeeId in recordsByEmployee) {
      for (const dateGroup of recordsByEmployee[employeeId]) {
        const sortedScans = dateGroup.scans.sort((a, b) =>
          a.timestamp.localeCompare(b.timestamp)
        )

        const scansWithTypes: BiometricRecord[] = []
        sortedScans.forEach((scan) => {
          scansWithTypes.push({ ...scan })
        })

        if (scansWithTypes.length > 0) {
          let dailyHours = 0
          for (let i = 0; i < scansWithTypes.length - 1; i += 2) {
            if (
              scansWithTypes[i].type === 1 &&
              scansWithTypes[i + 1].type === 2
            ) {
              const loginTime = new Date(scansWithTypes[i].timestamp)
              const logoutTime = new Date(scansWithTypes[i + 1].timestamp)
              const diffMs = logoutTime.getTime() - loginTime.getTime()
              dailyHours += diffMs / (1000 * 60 * 60)
            }
          }
          const totalHours = parseFloat(dailyHours.toFixed(2))

          if (scansWithTypes.length % 2 === 0 && totalHours > 0) {
            employeeAttendance[employeeId].daysPresent +=
              totalHours < 4 ? 0.5 : 1
            hoursByEmployee[employeeId][dateGroup.date] = totalHours
          }
        }

        scansWithTypes.forEach((scan) => {
          finalRecords.push({ ...scan })
        })
      }
    }

    finalRecords.sort((a, b) => {
      const empCompare = a.employee_id.localeCompare(b.employee_id)
      if (empCompare !== 0) return empCompare
      return a.timestamp.localeCompare(b.timestamp)
    })

    const batchSize = 100
    for (let i = 0; i < finalRecords.length; i += batchSize) {
      const batch = finalRecords.slice(i, i + batchSize)
      const { error } = await supabase.from('biometrics').insert(batch)
      if (error) {
        return generalErrorResponse({ error: error.message })
      }
    }

    return successResponse({
      message: `Successfully imported data.`
    })
  } catch (error) {
    const newError = error as Error
    return generalErrorResponse({ error: newError.message })
  }
}

export async function processBiometricData(rawData: string) {
  try {
    const supabase = await createClient()
    const lines = rawData
      .trim()
      .split('\n')
      .filter((line) => line.trim())

    const recordsByEmployee: {
      [employeeId: string]: { date: string; scans: BiometricRecord[] }[]
    } = {}
    const employeeAttendance: {
      [employeeId: string]: { daysPresent: number }
    } = {}
    let earliestTimestamp: Date | null = null

    for (const line of lines) {
      const columns = line.trim().split('\t')
      if (columns.length < 5) {
        console.warn(`Skipping invalid line: ${line}`)
        continue
      }

      const employeeId = columns[0]
      const timestampRaw = columns[1]
      const typeRaw = parseInt(columns[4])

      if (![1, 15].includes(typeRaw)) {
        console.warn(
          `Invalid type ${typeRaw} for employee ${employeeId} at ${timestampRaw}`
        )
        continue
      }

      let timestamp: string
      try {
        const date = new Date(timestampRaw.replace(' ', 'T')) // Parse without Z
        if (isNaN(date.getTime())) throw new Error('Invalid date')
        timestamp = date.toISOString().replace('Z', '-08:00') // PST offset
        if (!earliestTimestamp || date < earliestTimestamp) {
          earliestTimestamp = date
        }
      } catch (e) {
        console.warn(
          `Invalid timestamp ${timestampRaw} for employee ${employeeId} ${e}`
        )
        continue
      }

      if (!recordsByEmployee[employeeId]) {
        recordsByEmployee[employeeId] = []
        employeeAttendance[employeeId] = { daysPresent: 0 }
      }

      const date = timestamp.split('T')[0]

      let dateGroup = recordsByEmployee[employeeId].find(
        (group) => group.date === date
      )
      if (!dateGroup) {
        dateGroup = { date, scans: [] }
        recordsByEmployee[employeeId].push(dateGroup)
      }

      dateGroup.scans.push({
        employee_id: employeeId,
        timestamp,
        type: typeRaw
      })
    }

    const finalRecords: BiometricRecord[] = []
    for (const employeeId in recordsByEmployee) {
      for (const dateGroup of recordsByEmployee[employeeId]) {
        const sortedScans = dateGroup.scans.sort((a, b) =>
          a.timestamp.localeCompare(b.timestamp)
        )

        const scansWithTypes: BiometricRecord[] = []
        sortedScans.forEach((scan) => {
          if (scan.type === 15) {
            scansWithTypes.push({ ...scan, type: 15 })
          } else {
            scansWithTypes.push({ ...scan, type: scan.type })
          }
        })

        const standardScans = scansWithTypes.filter((scan) => scan.type !== 15)
        if (standardScans.length > 0) {
          let dailyHours = 0

          for (let i = 0; i < standardScans.length - 1; i += 2) {
            if (
              standardScans[i].type === 1 &&
              standardScans[i + 1].type === 2
            ) {
              const loginTime = new Date(standardScans[i].timestamp)
              const logoutTime = new Date(standardScans[i + 1].timestamp)
              const diffMs = logoutTime.getTime() - loginTime.getTime()
              dailyHours += diffMs / (1000 * 60 * 60)
            }
          }
          const totalHours = parseFloat(dailyHours.toFixed(2))

          if (standardScans.length % 2 === 0 && totalHours > 0) {
            employeeAttendance[employeeId].daysPresent +=
              totalHours < 4 ? 0.5 : 1
          }
        }

        scansWithTypes.forEach((scan) => {
          finalRecords.push({ ...scan })
        })
      }
    }

    finalRecords.sort((a, b) => {
      const empCompare = a.employee_id.localeCompare(b.employee_id)
      if (empCompare !== 0) return empCompare
      return a.timestamp.localeCompare(b.timestamp)
    })

    const batchSize = 100
    for (let i = 0; i < finalRecords.length; i += batchSize) {
      const batch = finalRecords.slice(i, i + batchSize)

      const { error } = await supabase.from('biometrics').insert(batch)
      if (error) {
        return generalErrorResponse({ error: error.message })
      }
    }

    return successResponse({
      message: `Successfully imported data.`
    })
  } catch (error) {
    const newError = error as Error
    return generalErrorResponse({ error: newError.message })
  }
}
