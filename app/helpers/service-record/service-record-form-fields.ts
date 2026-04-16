// lib/pds-form-fields.ts

export type FormField =
  | {
      name: string;
      type: 'checkbox';
      page: number;
      x: number;
      y: number;
      width: number;
      height: number;
      marginHeight: number;
      marginWidth: number;
    }
  | {
      name: string;
      type: 'text' | 'textarea';
      page: number;
      x: number;
      y: number;
      width: number;
      height: number;
      marginHeight: number;
      marginWidth: number;
      fontSize: number;
    };

export const PDF_A4_WIDTH = 595;
export const PDF_A4_HEIGHT = 842;

export const formValues: FormField[] = [
  {
    name: 'familyName',
    type: 'text',
    page: 1,
    x: 115,
    y: 695,
    width: 90,
    height: 13,

    marginHeight: -154,
    marginWidth: -10,
    fontSize: 0.8,
  },
  {
    name: 'givenName',
    type: 'text',
    page: 1,
    x: 210,
    y: 695,
    width: 90,
    height: 13,

    marginHeight: -154,
    marginWidth: -10,
    fontSize: 0.8,
  },
  {
    name: 'middleInitial',
    type: 'text',
    page: 1,
    x: 305,
    y: 695,
    width: 45,
    height: 13,

    marginHeight: -154,
    marginWidth: -10,
    fontSize: 0.8,
  },
  {
    name: 'dateOfBirth',
    type: 'text',
    page: 1,
    x: 115,
    y: 658,
    width: 90,
    height: 13,

    marginHeight: -150,
    marginWidth: -10,
    fontSize: 0.8,
  },
  {
    name: 'placeOfBirth',
    type: 'text',
    page: 1,
    x: 210,
    y: 658,
    width: 140,
    height: 13,

    marginHeight: -150,
    marginWidth: -10,
    fontSize: 0.8,
  },
  {
    name: 'dateSigned',
    type: 'text',
    page: 1,
    x: 100,
    y: 94,
    width: 100,
    height: 13,

    marginHeight: -134,
    marginWidth: -10,
    fontSize: 0.8,
  },
  // {
  //   name: 'signedName',
  //   type: 'text',
  //   page: 1,
  //   x: 415,
  //   y: 58,
  //   width: 140,
  //   height: 13,
  //
  //   marginHeight: -134,
  //   marginWidth: -10,
  //   fontSize: 0.8,
  // },
];

export type ServiceRecordDynamic = {
  from: string;
  to: string;
  designation: string;
  status: string;
  salary: string;
  placeOfAssignment: string;
  branch: string;
  withOrWithoutPay: string;
  date: string;
  cause: string;
};

export interface DynamicFieldTemplate {
  page: number;
  startY: number;
  rowHeight: number;
  serverHeight?: number;
  fontSize?: number;
  columns: {
    name: keyof ServiceRecordDynamic;
    x: number;
    width: number;
    marginWidth: number;
    marginHeight: number;
    fontSize: number;
  }[];
}

export const serviceRecordFieldTemplate: DynamicFieldTemplate = {
  page: 1,
  startY: 550,
  rowHeight: 16.4,
  serverHeight: 16.8,
  columns: [
    {
      name: 'from',
      x: 10,
      width: 50,

      marginHeight: -148,
      marginWidth: -2,
      fontSize: 0.5,
    },
    {
      name: 'to',
      x: 70,
      width: 50,

      marginHeight: -148,
      marginWidth: -2,
      fontSize: 0.5,
    },
    {
      name: 'designation',
      x: 128,
      width: 66,

      marginHeight: -148,
      marginWidth: -4,
      fontSize: 0.5,
    },
    {
      name: 'status',
      x: 200,
      width: 44,

      marginHeight: -148,
      marginWidth: -6,
      fontSize: 0.5,
    },
    {
      name: 'salary',
      x: 255,
      width: 60,

      marginHeight: -148,
      marginWidth: -6,
      fontSize: 0.5,
    },
    {
      name: 'placeOfAssignment',
      x: 324,
      width: 60,

      marginHeight: -148,
      marginWidth: -10,
      fontSize: 0.5,
    },
    {
      name: 'branch',
      x: 390,
      width: 36,

      marginHeight: -148,
      marginWidth: -12,
      fontSize: 0.5,
    },
    {
      name: 'withOrWithoutPay',
      x: 430,
      width: 32,

      marginHeight: -148,
      marginWidth: -12,
      fontSize: 0.5,
    },
    {
      name: 'date',
      x: 468,
      width: 44,

      marginHeight: -148,
      marginWidth: -14,
      fontSize: 0.5,
    },
    {
      name: 'cause',
      x: 520,
      width: 60,

      marginHeight: -148,
      marginWidth: -14,
      fontSize: 0.5,
    },
  ],
};
