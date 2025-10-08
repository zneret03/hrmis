// lib/pds-form-fields.ts

export type FormField =
  | {
      name: string
      type: 'checkbox'
      page: number
      x: number
      y: number
      width: number
      height: number
      marginHeight: number
      marginWidth: number
    }
  | {
      name: string
      type: 'text' | 'textarea'
      page: number
      x: number
      y: number
      width: number
      height: number
      marginHeight: number
      marginWidth: number
      fontSize: number
    }

export const PDF_A4_WIDTH = 595
export const PDF_A4_HEIGHT = 842

export const formValues: FormField[] = [
  {
    name: 'familyName',
    type: 'text',
    page: 1,
    x: 90,
    y: 705,
    width: 110,
    height: 13,

    marginHeight: -154,
    marginWidth: -10,
    fontSize: 0.8
  },
  {
    name: 'givenName',
    type: 'text',
    page: 1,
    x: 205,
    y: 705,
    width: 110,
    height: 13,

    marginHeight: -154,
    marginWidth: -10,
    fontSize: 0.8
  },
  {
    name: 'middleInitial',
    type: 'text',
    page: 1,
    x: 320,
    y: 705,
    width: 90,
    height: 13,

    marginHeight: -154,
    marginWidth: -10,
    fontSize: 0.8
  },
  {
    name: 'dateOfBirth',
    type: 'text',
    page: 1,
    x: 90,
    y: 660,
    width: 110,
    height: 13,

    marginHeight: -150,
    marginWidth: -10,
    fontSize: 0.8
  },
  {
    name: 'placeOfBirth',
    type: 'text',
    page: 1,
    x: 205,
    y: 660,
    width: 200,
    height: 13,

    marginHeight: -150,
    marginWidth: -10,
    fontSize: 0.8
  },
  {
    name: 'dateSigned',
    type: 'text',
    page: 1,
    x: 148,
    y: 48,
    width: 70,
    height: 13,

    marginHeight: -134,
    marginWidth: -10,
    fontSize: 0.8
  },
  {
    name: 'signedName',
    type: 'text',
    page: 1,
    x: 415,
    y: 58,
    width: 140,
    height: 13,

    marginHeight: -134,
    marginWidth: -10,
    fontSize: 0.8
  }
]

export type ServiceRecordDynamic = {
  from: string
  to: string
  designation: string
  status: string
  salary: string
  placeOfAssignment: string
  branch: string
  withOrWithoutPay: string
  date: string
  cause: string
}

export interface DynamicFieldTemplate {
  page: number
  startY: number
  rowHeight: number
  serverHeight?: number
  fontSize?: number
  columns: {
    name: keyof ServiceRecordDynamic
    x: number
    width: number
    marginWidth: number
    marginHeight: number
    fontSize: number
  }[]
}

export const serviceRecordFieldTemplate: DynamicFieldTemplate = {
  page: 1,
  startY: 510,
  rowHeight: 16.4,
  serverHeight: 16.8,
  columns: [
    {
      name: 'from',
      x: 40,
      width: 50,

      marginHeight: -148,
      marginWidth: -2,
      fontSize: 0.5
    },
    {
      name: 'to',
      x: 92,
      width: 50,

      marginHeight: -148,
      marginWidth: -2,
      fontSize: 0.5
    },
    {
      name: 'designation',
      x: 144,
      width: 76,

      marginHeight: -148,
      marginWidth: -4,
      fontSize: 0.5
    },
    {
      name: 'status',
      x: 226,
      width: 44,

      marginHeight: -148,
      marginWidth: -6,
      fontSize: 0.5
    },
    {
      name: 'salary',
      x: 274,
      width: 48,

      marginHeight: -148,
      marginWidth: -6,
      fontSize: 0.5
    },
    {
      name: 'placeOfAssignment',
      x: 328,
      width: 74,

      marginHeight: -148,
      marginWidth: -10,
      fontSize: 0.5
    },
    {
      name: 'branch',
      x: 405,
      width: 32,

      marginHeight: -148,
      marginWidth: -12,
      fontSize: 0.5
    },
    {
      name: 'withOrWithoutPay',
      x: 442,
      width: 32,

      marginHeight: -148,
      marginWidth: -12,
      fontSize: 0.5
    },
    {
      name: 'date',
      x: 480,
      width: 32,

      marginHeight: -148,
      marginWidth: -14,
      fontSize: 0.5
    },
    {
      name: 'cause',
      x: 516,
      width: 40,

      marginHeight: -148,
      marginWidth: -14,
      fontSize: 0.5
    }
  ]
}
