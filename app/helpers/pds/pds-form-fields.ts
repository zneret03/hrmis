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

export const personalInfoFields: FormField[] = [
  // --- PERSONAL INFORMATION (Page 1) ---
  {
    name: 'surname',
    type: 'text',
    page: 1,
    x: 145,
    y: 738,
    width: 390,
    height: 12,
    marginHeight: 62,
    marginWidth: -8,
    fontSize: 0.6,
  },
  {
    name: 'firstName',
    type: 'text',
    page: 1,
    x: 145,
    y: 723,
    width: 275,
    height: 12,
    marginHeight: 62,
    marginWidth: -10,
    fontSize: 0.6,
  },
  {
    name: 'middleName',
    type: 'text',
    page: 1,
    x: 145,
    y: 708,
    width: 390,
    height: 12,
    marginHeight: 62,
    marginWidth: -10,
    fontSize: 0.6,
  },
  {
    name: 'nameExtension',
    type: 'text',
    page: 1,
    x: 425,
    y: 722,
    width: 110,
    height: 12,

    marginHeight: 62,
    marginWidth: -10,
    fontSize: 0.6,
  },
  {
    name: 'dateOfBirth',
    type: 'text',
    page: 1,
    x: 145,
    y: 695,
    width: 112,
    height: 22,

    marginHeight: 70,
    marginWidth: -10,
    fontSize: 0.4,
  },
  {
    name: 'placeOfBirth',
    type: 'text',
    page: 1,
    x: 145,
    y: 670,
    width: 112,
    height: 15,

    marginHeight: 62,
    marginWidth: -10,
    fontSize: 0.6,
  },
  {
    name: 'sexMale',
    type: 'checkbox',
    page: 1,
    x: 150,
    y: 650,
    width: 8,
    height: 8,
    marginHeight: 60,
    marginWidth: -4,
  },
  {
    name: 'sexFemale',
    type: 'checkbox',
    page: 1,
    x: 217,
    y: 651,
    width: 8,
    height: 8,

    marginHeight: 60,
    marginWidth: -6,
  },
  {
    name: 'civilStatusSingle',
    type: 'checkbox',
    page: 1,
    x: 150,
    y: 637,
    width: 8,
    height: 8,

    marginHeight: 62,
    marginWidth: -4,
  },
  {
    name: 'civilStatusMarried',
    type: 'checkbox',
    page: 1,
    x: 218,
    y: 637,
    width: 8,
    height: 8,

    marginHeight: 62,
    marginWidth: -6,
  },
  {
    name: 'civilStatusWidowed',
    type: 'checkbox',
    page: 1,
    x: 150,
    y: 628,
    width: 8,
    height: 8,

    marginHeight: 62,
    marginWidth: -4,
  },
  {
    name: 'civilStatusSeparated',
    type: 'checkbox',
    page: 1,
    x: 216,
    y: 628,
    width: 8,
    height: 8,

    marginHeight: 62,
    marginWidth: -8,
  },
  {
    name: 'civilStatusOthers',
    type: 'checkbox',
    page: 1,
    x: 150,
    y: 618,
    width: 8,
    height: 8,

    marginHeight: 62,
    marginWidth: -4,
  },
  // Citizenship
  {
    name: 'citizenshipFilipino',
    type: 'checkbox',
    page: 1,
    x: 372,
    y: 688,
    width: 8,
    height: 8,

    marginHeight: 60,
    marginWidth: -10,
  },
  {
    name: 'citizenshipDual',
    type: 'checkbox',
    page: 1,
    x: 416,
    y: 688,
    width: 8,
    height: 8,

    marginHeight: 60,
    marginWidth: -10,
  },
  {
    name: 'dualCitizenshipTypeBirth',
    type: 'checkbox',
    page: 1,
    x: 428,
    y: 678,
    width: 8,
    height: 8,

    marginHeight: 60,
    marginWidth: -12,
  },
  {
    name: 'dualCitizenshipTypeNaturalization',
    type: 'checkbox',
    page: 1,
    x: 465,
    y: 678,
    width: 8,
    height: 8,

    marginHeight: 60,
    marginWidth: -12,
  },
  {
    name: 'dualCitizenshipCountry',
    type: 'text',
    page: 1,
    x: 365,
    y: 655,
    width: 152,
    height: 15,

    marginHeight: 50,
    marginWidth: -10,
    fontSize: 0.6,
  },
  // Addresses
  {
    name: 'resHouseNo',
    type: 'text',
    page: 1,
    x: 330,
    y: 638,
    width: 100,
    height: 10,

    marginHeight: 63,
    marginWidth: -10,
    fontSize: 0.8,
  },
  {
    name: 'resStreet',
    type: 'text',
    page: 1,
    x: 430,
    y: 638,
    width: 105,
    height: 10,

    marginHeight: 63,
    marginWidth: -10,
    fontSize: 0.8,
  },
  {
    name: 'resSubdivision',
    type: 'text',
    page: 1,
    x: 330,
    y: 622,
    width: 100,
    height: 8,

    marginHeight: 64,
    marginWidth: -10,
    fontSize: 0.8,
  },
  {
    name: 'resBarangay',
    type: 'text',
    page: 1,
    x: 430,
    y: 622,
    width: 102,
    height: 8,

    marginHeight: 64,
    marginWidth: -10,
    fontSize: 0.8,
  },
  {
    name: 'resCity',
    type: 'text',
    page: 1,
    x: 330,
    y: 605,
    width: 102,
    height: 8,

    marginHeight: 64,
    marginWidth: -10,
    fontSize: 0.8,
  },
  {
    name: 'resProvince',
    type: 'text',
    page: 1,
    x: 435,
    y: 605,
    width: 102,
    height: 8,

    marginHeight: 64,
    marginWidth: -10,
    fontSize: 0.8,
  },
  {
    name: 'resZipCode',
    type: 'text',
    page: 1,
    x: 330,
    y: 590,
    width: 202,
    height: 13,

    marginHeight: 66,
    marginWidth: -10,
    fontSize: 0.6,
  },
  //Permanent Address
  {
    name: 'perHouseNo',
    type: 'text',
    page: 1,
    x: 330,
    y: 575,
    width: 100,
    height: 10,

    marginHeight: 64,
    marginWidth: -10,
    fontSize: 0.8,
  },
  {
    name: 'perStreet',
    type: 'text',
    page: 1,
    x: 430,
    y: 575,
    width: 105,
    height: 10,

    marginHeight: 64,
    marginWidth: -10,
    fontSize: 0.8,
  },
  {
    name: 'perSubdivision',
    type: 'text',
    page: 1,
    x: 330,
    y: 558,
    width: 100,
    height: 8,

    marginHeight: 64,
    marginWidth: -10,
    fontSize: 0.8,
  },
  {
    name: 'perBarangay',
    type: 'text',
    page: 1,
    x: 430,
    y: 558,
    width: 102,
    height: 8,

    marginHeight: 64,
    marginWidth: -10,
    fontSize: 0.8,
  },
  {
    name: 'perCity',
    type: 'text',
    page: 1,
    x: 330,
    y: 542,
    width: 102,
    height: 8,

    marginHeight: 66,
    marginWidth: -10,
    fontSize: 0.8,
  },
  {
    name: 'perProvince',
    type: 'text',
    page: 1,
    x: 435,
    y: 542,
    width: 102,
    height: 8,

    marginHeight: 66,
    marginWidth: -10,
    fontSize: 0.8,
  },
  {
    name: 'perZipCode',
    type: 'text',
    page: 1,
    x: 330,
    y: 524,
    width: 202,
    height: 13,

    marginHeight: 68,
    marginWidth: -10,
    fontSize: 0.8,
  },
  //Personal info
  {
    name: 'height',
    type: 'text',
    page: 1,
    x: 145,
    y: 606,
    width: 115,
    height: 13,

    marginHeight: 66,
    marginWidth: -8,
    fontSize: 0.6,
  },
  {
    name: 'weight',
    type: 'text',
    page: 1,
    x: 145,
    y: 590,
    width: 115,
    height: 13,

    marginHeight: 66,
    marginWidth: -8,
    fontSize: 0.6,
  },
  {
    name: 'bloodType',
    type: 'text',
    page: 1,
    x: 145,
    y: 574,
    width: 115,
    height: 13,

    marginHeight: 66,
    marginWidth: -8,
    fontSize: 0.6,
  },
  //Government Ideas
  {
    name: 'gsisNo',
    type: 'text',
    page: 1,
    x: 145,
    y: 558,
    width: 115,
    height: 13,

    marginHeight: 66,
    marginWidth: -8,
    fontSize: 0.6,
  },
  {
    name: 'pagibigNo',
    type: 'text',
    page: 1,
    x: 145,
    y: 542,
    width: 115,
    height: 14,

    marginHeight: 66,
    marginWidth: -8,
    fontSize: 0.6,
  },
  {
    name: 'philhealthNo',
    type: 'text',
    page: 1,
    x: 145,
    y: 525,
    width: 115,
    height: 14,

    marginHeight: 66,
    marginWidth: -8,
    fontSize: 0.6,
  },
  {
    name: 'sssNo',
    type: 'text',
    page: 1,
    x: 145,
    y: 510,
    width: 115,
    height: 14,

    marginHeight: 66,
    marginWidth: -8,
    fontSize: 0.6,
  },
  {
    name: 'tinNo',
    type: 'text',
    page: 1,
    x: 145,
    y: 494,
    width: 115,
    height: 14,

    marginHeight: 66,
    marginWidth: -8,
    fontSize: 0.6,
  },
  {
    name: 'agencyEmployeeNo',
    type: 'text',
    page: 1,
    x: 145,
    y: 475,
    width: 115,
    height: 14,

    marginHeight: 66,
    marginWidth: -8,
    fontSize: 0.6,
  },
  // Contact
  {
    name: 'telephoneNo',
    type: 'text',
    page: 1,
    x: 330,
    y: 510,
    width: 205,
    height: 15,

    marginHeight: 68,
    marginWidth: -10,
    fontSize: 0.6,
  },
  {
    name: 'mobileNo',
    type: 'text',
    page: 1,
    x: 330,
    y: 494,
    width: 205,
    height: 14,

    marginHeight: 68,
    marginWidth: -10,
    fontSize: 0.6,
  },
  {
    name: 'emailAddress',
    type: 'text',
    page: 1,
    x: 328,
    y: 478,
    width: 205,
    height: 15,

    marginHeight: 68,
    marginWidth: -12,
    fontSize: 0.6,
  },

  //FAMILY BACKGROUND PAGE 1
  {
    name: 'spousesSurname',
    type: 'text',
    page: 1,
    x: 145,
    y: 450,
    width: 182,
    height: 13,

    marginHeight: 70,
    marginWidth: -10,
    fontSize: 0.6,
  },
  {
    name: 'spouseFirstName',
    type: 'text',
    page: 1,
    x: 145,
    y: 438,
    width: 114,
    height: 13,

    marginHeight: 70,
    marginWidth: -10,
    fontSize: 0.6,
  },
  {
    name: 'spouseNameExtension',
    type: 'text',
    page: 1,
    x: 260,
    y: 432,
    width: 66,
    height: 8,

    marginHeight: 68,
    marginWidth: -10,
    fontSize: 0.6,
  },
  {
    name: 'spouseMiddleName',
    type: 'text',
    page: 1,
    x: 145,
    y: 422,
    width: 182,
    height: 13,

    marginHeight: 70,
    marginWidth: -10,
    fontSize: 0.6,
  },
  {
    name: 'spouseOccupation',
    type: 'text',
    page: 1,
    x: 145,
    y: 410,
    width: 182,
    height: 13,

    marginHeight: 70,
    marginWidth: -10,
    fontSize: 0.6,
  },
  {
    name: 'employerOrBusinessPartner',
    type: 'text',
    page: 1,
    x: 145,
    y: 395,
    width: 182,
    height: 13,

    marginHeight: 70,
    marginWidth: -10,
    fontSize: 0.6,
  },
  {
    name: 'businessAddress',
    type: 'text',
    page: 1,
    x: 145,
    y: 380,
    width: 182,
    height: 13,

    marginHeight: 70,
    marginWidth: -10,
    fontSize: 0.6,
  },
  {
    name: 'businessTelPho',
    type: 'text',
    page: 1,
    x: 145,
    y: 368,
    width: 182,
    height: 13,

    marginHeight: 70,
    marginWidth: -10,
    fontSize: 0.6,
  },
];

export const familyBackgroundFields: FormField[] = [
  {
    name: 'fatherSurname',
    type: 'text',
    page: 1,
    x: 145,
    y: 355,
    width: 182,
    height: 13,

    marginHeight: 72,
    marginWidth: -10,
    fontSize: 0.6,
  },
  {
    name: 'fatherFirstName',
    type: 'text',
    page: 1,
    x: 145,
    y: 340,
    width: 114,
    height: 13,

    marginHeight: 74,
    marginWidth: -10,
    fontSize: 0.6,
  },
  {
    name: 'fatherNameExtension',
    type: 'text',
    page: 1,
    x: 260,
    y: 335,
    width: 68,
    height: 8,

    marginHeight: 72,
    marginWidth: -10,
    fontSize: 0.6,
  },
  {
    name: 'fatherMiddleName',
    type: 'text',
    page: 1,
    x: 145,
    y: 328,
    width: 182,
    height: 13,

    marginHeight: 74,
    marginWidth: -10,
    fontSize: 0.6,
  },
  // Mother Maidens name
  {
    name: 'motherMaidenName',
    type: 'text',
    page: 1,
    x: 145,
    y: 314,
    width: 182,
    height: 13,

    marginHeight: 74,
    marginWidth: -10,
    fontSize: 0.6,
  },
  {
    name: 'motherSurname',
    type: 'text',
    page: 1,
    x: 145,
    y: 298,
    width: 182,
    height: 13,

    marginHeight: 74,
    marginWidth: -10,
    fontSize: 0.6,
  },
  {
    name: 'motherFirstName',
    type: 'text',
    page: 1,
    x: 145,
    y: 284,
    width: 182,
    height: 13,

    marginHeight: 74,
    marginWidth: -10,
    fontSize: 0.6,
  },
  {
    name: 'motherMiddleName',
    type: 'text',
    page: 1,
    x: 145,
    y: 270,
    width: 182,
    height: 13,

    marginHeight: 74,
    marginWidth: -10,
    fontSize: 0.6,
  },
  //Childrens Name
  {
    name: 'childrenName1',
    type: 'text',
    page: 1,
    x: 330,
    y: 435,
    width: 135,
    height: 13,

    marginHeight: 70,
    marginWidth: -10,
    fontSize: 0.6,
  },
  {
    name: 'dateOfBirthChild1',
    type: 'text',
    page: 1,
    x: 465,
    y: 438,
    width: 70,
    height: 13,

    marginHeight: 70,
    marginWidth: -15,
    fontSize: 0.6,
  },
  {
    name: 'childrenName2',
    type: 'text',
    page: 1,
    x: 330,
    y: 422,
    width: 135,
    height: 13,

    marginHeight: 70,
    marginWidth: -10,
    fontSize: 0.6,
  },
  {
    name: 'dateOfBirthChild2',
    type: 'text',
    page: 1,
    x: 465,
    y: 424,
    width: 70,
    height: 13,

    marginHeight: 72,
    marginWidth: -15,
    fontSize: 0.6,
  },
  {
    name: 'childrenName3',
    type: 'text',
    page: 1,
    x: 330,
    y: 410,
    width: 135,
    height: 13,

    marginHeight: 72,
    marginWidth: -10,
    fontSize: 0.6,
  },
  {
    name: 'dateOfBirthChild3',
    type: 'text',
    page: 1,
    x: 465,
    y: 410,
    width: 70,
    height: 13,

    marginHeight: 72,
    marginWidth: -15,
    fontSize: 0.6,
  },
  {
    name: 'childrenName4',
    type: 'text',
    page: 1,
    x: 330,
    y: 395,
    width: 135,
    height: 13,

    marginHeight: 72,
    marginWidth: -10,
    fontSize: 0.6,
  },
  {
    name: 'dateOfBirthChild4',
    type: 'text',
    page: 1,
    x: 465,
    y: 395,
    width: 70,
    height: 13,

    marginHeight: 72,
    marginWidth: -15,
    fontSize: 0.6,
  },
  {
    name: 'childrenName5',
    type: 'text',
    page: 1,
    x: 330,
    y: 380,
    width: 135,
    height: 13,

    marginHeight: 74,
    marginWidth: -10,
    fontSize: 0.6,
  },
  {
    name: 'dateOfBirthChild5',
    type: 'text',
    page: 1,
    x: 465,
    y: 380,
    width: 70,
    height: 13,

    marginHeight: 74,
    marginWidth: -15,
    fontSize: 0.6,
  },
  {
    name: 'childrenName6',
    type: 'text',
    page: 1,
    x: 330,
    y: 368,
    width: 135,
    height: 13,

    marginHeight: 74,
    marginWidth: -10,
    fontSize: 0.6,
  },
  {
    name: 'dateOfBirthChild6',
    type: 'text',
    page: 1,
    x: 465,
    y: 368,
    width: 70,
    height: 13,

    marginHeight: 74,
    marginWidth: -15,
    fontSize: 0.6,
  },
  {
    name: 'childrenName7',
    type: 'text',
    page: 1,
    x: 330,
    y: 355,
    width: 135,
    height: 13,

    marginHeight: 60,
    marginWidth: -10,
    fontSize: 0.6,
  },
  {
    name: 'dateOfBirthChild7',
    type: 'text',
    page: 1,
    x: 465,
    y: 355,
    width: 70,
    height: 13,

    marginHeight: 60,
    marginWidth: -15,
    fontSize: 0.6,
  },
  {
    name: 'childrenName8',
    type: 'text',
    page: 1,
    x: 330,
    y: 340,
    width: 135,
    height: 13,

    marginHeight: 60,
    marginWidth: -10,
    fontSize: 0.6,
  },
  {
    name: 'dateOfBirthChild8',
    type: 'text',
    page: 1,
    x: 465,
    y: 340,
    width: 70,
    height: 13,

    marginHeight: 60,
    marginWidth: -15,
    fontSize: 0.6,
  },
  {
    name: 'childrenName9',
    type: 'text',
    page: 1,
    x: 330,
    y: 325,
    width: 135,
    height: 13,

    marginHeight: 74,
    marginWidth: -10,
    fontSize: 0.6,
  },
  {
    name: 'dateOfBirthChild9',
    type: 'text',
    page: 1,
    x: 465,
    y: 325,
    width: 70,
    height: 13,

    marginHeight: 74,
    marginWidth: -15,
    fontSize: 0.6,
  },
  {
    name: 'childrenName10',
    type: 'text',
    page: 1,
    x: 330,
    y: 311,
    width: 135,
    height: 13,

    marginHeight: 74,
    marginWidth: -10,
    fontSize: 0.6,
  },
  {
    name: 'dateOfBirthChild10',
    type: 'text',
    page: 1,
    x: 465,
    y: 311,
    width: 70,
    height: 13,

    marginHeight: 74,
    marginWidth: -15,
    fontSize: 0.6,
  },
  {
    name: 'childrenName11',
    type: 'text',
    page: 1,
    x: 330,
    y: 298,
    width: 135,
    height: 13,

    marginHeight: 72,
    marginWidth: -10,
    fontSize: 0.6,
  },
  {
    name: 'dateOfBirthChild11',
    type: 'text',
    page: 1,
    x: 465,
    y: 298,
    width: 70,
    height: 13,

    marginHeight: 74,
    marginWidth: -15,
    fontSize: 0.6,
  },
  {
    name: 'childrenName12',
    type: 'text',
    page: 1,
    x: 330,
    y: 285,
    width: 135,
    height: 13,

    marginHeight: 74,
    marginWidth: -10,
    fontSize: 0.6,
  },
  {
    name: 'dateOfBirthChild12',
    type: 'text',
    page: 1,
    x: 465,
    y: 285,
    width: 70,
    height: 13,

    marginHeight: 74,
    marginWidth: -15,
    fontSize: 0.6,
  },
];

export const educationalBackgroundFields: FormField[] = [
  {
    name: 'elementary',
    type: 'textarea',
    page: 1,
    x: 145,
    y: 214,
    width: 112,
    height: 18,

    marginHeight: 78,
    marginWidth: -8,
    fontSize: 0.4,
  },
  {
    name: 'elementaryBasicEdu',
    type: 'text',
    page: 1,
    x: 260,
    y: 214,
    width: 104,
    height: 18,

    marginHeight: 78,
    marginWidth: -8,
    fontSize: 0.4,
  },
  {
    name: 'elementaryFrom',
    type: 'text',
    page: 1,
    x: 365,
    y: 214,
    width: 28,
    height: 18,

    marginHeight: 78,
    marginWidth: -12,
    fontSize: 0.4,
  },
  {
    name: 'elementaryTo',
    type: 'text',
    page: 1,
    x: 394,
    y: 214,
    width: 28,
    height: 18,

    marginHeight: 78,
    marginWidth: -12,
    fontSize: 0.4,
  },
  {
    name: 'elementaryHighestLevel',
    type: 'text',
    page: 1,
    x: 424,
    y: 214,
    width: 40,
    height: 18,

    marginHeight: 78,
    marginWidth: -12,
    fontSize: 0.4,
  },
  {
    name: 'elementaryYearGraduated',
    type: 'text',
    page: 1,
    x: 465,
    y: 214,
    width: 34,
    height: 18,

    marginHeight: 78,
    marginWidth: -14,
    fontSize: 0.4,
  },
  {
    name: 'elementaryHonors',
    type: 'text',
    page: 1,
    x: 500,
    y: 214,
    width: 34,
    height: 18,

    marginHeight: 78,
    marginWidth: -14,
    fontSize: 0.4,
  },
  //EDUCATIONAL Secondary
  {
    name: 'seconday',
    type: 'text',
    page: 1,
    x: 145,
    y: 195,
    width: 112,
    height: 18,

    marginHeight: 80,
    marginWidth: -8,
    fontSize: 0.4,
  },
  {
    name: 'secondaryBasicEdu',
    type: 'text',
    page: 1,
    x: 260,
    y: 195,
    width: 104,
    height: 18,

    marginHeight: 80,
    marginWidth: -8,
    fontSize: 0.4,
  },
  {
    name: 'secondaryFrom',
    type: 'text',
    page: 1,
    x: 365,
    y: 195,
    width: 28,
    height: 18,

    marginHeight: 80,
    marginWidth: -12,
    fontSize: 0.4,
  },
  {
    name: 'secondaryTo',
    type: 'text',
    page: 1,
    x: 394,
    y: 195,
    width: 28,
    height: 18,

    marginHeight: 80,
    marginWidth: -12,
    fontSize: 0.4,
  },
  {
    name: 'secondaryHighestLevel',
    type: 'text',
    page: 1,
    x: 424,
    y: 195,
    width: 40,
    height: 18,

    marginHeight: 80,
    marginWidth: -14,
    fontSize: 0.4,
  },
  {
    name: 'secondaryYearGraduated',
    type: 'text',
    page: 1,
    x: 465,
    y: 195,
    width: 34,
    height: 18,

    marginHeight: 80,
    marginWidth: -14,
    fontSize: 0.4,
  },
  {
    name: 'secondaryHonors',
    type: 'text',
    page: 1,
    x: 500,
    y: 195,
    width: 34,
    height: 18,

    marginHeight: 80,
    marginWidth: -13,
    fontSize: 0.4,
  },
  // EDUCATIONAL Trade Course
  {
    name: 'vocational',
    type: 'text',
    page: 1,
    x: 145,
    y: 178,
    width: 112,
    height: 18,

    marginHeight: 80,
    marginWidth: -8,
    fontSize: 0.4,
  },
  {
    name: 'vocationalBasicEdu',
    type: 'text',
    page: 1,
    x: 260,
    y: 178,
    width: 104,
    height: 18,

    marginHeight: 80,
    marginWidth: -8,
    fontSize: 0.4,
  },
  {
    name: 'vocationalFrom',
    type: 'text',
    page: 1,
    x: 365,
    y: 178,
    width: 28,
    height: 18,

    marginHeight: 80,
    marginWidth: -12,
    fontSize: 0.4,
  },
  {
    name: 'vocationalTo',
    type: 'text',
    page: 1,
    x: 394,
    y: 178,
    width: 28,
    height: 18,

    marginHeight: 80,
    marginWidth: -12,
    fontSize: 0.4,
  },
  {
    name: 'vocationalHighestLevel',
    type: 'text',
    page: 1,
    x: 424,
    y: 178,
    width: 40,
    height: 18,

    marginHeight: 80,
    marginWidth: -12,
    fontSize: 0.4,
  },
  {
    name: 'vocationalYearGraduated',
    type: 'text',
    page: 1,
    x: 465,
    y: 178,
    width: 34,
    height: 18,

    marginHeight: 80,
    marginWidth: -14,
    fontSize: 0.4,
  },
  {
    name: 'vocationalHonors',
    type: 'text',
    page: 1,
    x: 500,
    y: 178,
    width: 34,
    height: 18,

    marginHeight: 80,
    marginWidth: -14,
    fontSize: 0.4,
  },
  //EDUCATIONAL College
  {
    name: 'college',
    type: 'text',
    page: 1,
    x: 145,
    y: 160,
    width: 112,
    height: 18,

    marginHeight: 80,
    marginWidth: -8,
    fontSize: 0.4,
  },
  {
    name: 'collegeBasicEdu',
    type: 'text',
    page: 1,
    x: 260,
    y: 160,
    width: 104,
    height: 18,

    marginHeight: 80,
    marginWidth: -8,
    fontSize: 0.4,
  },
  {
    name: 'collegeFrom',
    type: 'text',
    page: 1,
    x: 365,
    y: 160,
    width: 28,
    height: 18,

    marginHeight: 80,
    marginWidth: -12,
    fontSize: 0.4,
  },
  {
    name: 'collegeTo',
    type: 'text',
    page: 1,
    x: 394,
    y: 160,
    width: 28,
    height: 18,

    marginHeight: 80,
    marginWidth: -12,
    fontSize: 0.4,
  },
  {
    name: 'collegeHighestLevel',
    type: 'text',
    page: 1,
    x: 424,
    y: 160,
    width: 40,
    height: 18,

    marginHeight: 80,
    marginWidth: -12,
    fontSize: 0.4,
  },
  {
    name: 'collegeYearGraduated',
    type: 'text',
    page: 1,
    x: 465,
    y: 160,
    width: 34,
    height: 18,

    marginHeight: 80,
    marginWidth: -14,
    fontSize: 0.4,
  },
  {
    name: 'collegeHonors',
    type: 'text',
    page: 1,
    x: 500,
    y: 160,
    width: 34,
    height: 18,

    marginHeight: 80,
    marginWidth: -14,
    fontSize: 0.4,
  },
  //GRADUATE STUDIES
  {
    name: 'graduate',
    type: 'text',
    page: 1,
    x: 145,
    y: 140,
    width: 112,
    height: 18,

    marginHeight: 80,
    marginWidth: -8,
    fontSize: 0.4,
  },
  {
    name: 'graduateBasicEdu',
    type: 'text',
    page: 1,
    x: 260,
    y: 140,
    width: 104,
    height: 18,

    marginHeight: 80,
    marginWidth: -8,
    fontSize: 0.4,
  },
  {
    name: 'graduateFrom',
    type: 'text',
    page: 1,
    x: 365,
    y: 140,
    width: 28,
    height: 18,

    marginHeight: 80,
    marginWidth: -12,
    fontSize: 0.4,
  },
  {
    name: 'graduateTo',
    type: 'text',
    page: 1,
    x: 394,
    y: 140,
    width: 28,
    height: 18,

    marginHeight: 80,
    marginWidth: -12,
    fontSize: 0.4,
  },
  {
    name: 'graduateHighestLevel',
    type: 'text',
    page: 1,
    x: 424,
    y: 140,
    width: 40,
    height: 18,

    marginHeight: 80,
    marginWidth: -14,
    fontSize: 0.4,
  },
  {
    name: 'graduateYearGraduated',
    type: 'text',
    page: 1,
    x: 465,
    y: 140,
    width: 34,
    height: 18,

    marginHeight: 80,
    marginWidth: -14,
    fontSize: 0.4,
  },
  {
    name: 'graduateHonors',
    type: 'text',
    page: 1,
    x: 500,
    y: 140,
    width: 34,
    height: 18,

    marginHeight: 80,
    marginWidth: -14,
    fontSize: 0.4,
  },
];

export const otherStaticFields: FormField[] = [
  //PAGE 1 DATE
  {
    name: 'date',
    type: 'text',
    page: 1,
    x: 423,
    y: 112,
    width: 110,
    height: 18,

    marginHeight: 82,
    marginWidth: -16,
    fontSize: 0.6,
  },

  {
    name: 'date2',
    type: 'text',
    page: 2,
    x: 388,
    y: 122,
    width: 140,
    height: 16,

    marginHeight: 82,
    marginWidth: -10,
    fontSize: 0.6,
  },

  //PAGE 3 DATE
  {
    name: 'date3',
    type: 'text',
    page: 3,
    x: 418,
    y: 110,
    width: 116,
    height: 16,

    marginHeight: 82,
    marginWidth: -10,
    fontSize: 0.6,
  },

  {
    name: 'q34a_yes',
    type: 'checkbox',
    page: 4,
    x: 365,
    y: 785,
    width: 10,
    height: 10,

    marginHeight: 60,
    marginWidth: -12,
  },
  {
    name: 'q34a_no',
    type: 'checkbox',
    page: 4,
    x: 415,
    y: 785,
    width: 10,
    height: 10,

    marginHeight: 60,
    marginWidth: -12,
  },
  {
    name: 'q34b_yes',
    type: 'checkbox',
    page: 4,
    x: 365,
    y: 770,
    width: 10,
    height: 10,

    marginHeight: 58,
    marginWidth: -12,
  },
  {
    name: 'q34b_no',
    type: 'checkbox',
    page: 4,
    x: 415,
    y: 770,
    width: 10,
    height: 10,

    marginHeight: 58,
    marginWidth: -12,
  },
  {
    name: 'q34_details',
    type: 'textarea',
    page: 4,
    x: 370,
    y: 758,
    width: 155,
    height: 16,

    marginHeight: 60,
    marginWidth: -10,
    fontSize: 0.6,
  },

  // Question 35
  {
    name: 'q35a_yes',
    type: 'checkbox',
    page: 4,
    x: 365,
    y: 735,
    width: 10,
    height: 10,

    marginHeight: 60,
    marginWidth: -10,
  },
  {
    name: 'q35a_no',
    type: 'checkbox',
    page: 4,
    x: 415,
    y: 735,
    width: 10,
    height: 10,

    marginHeight: 60,
    marginWidth: -12,
  },
  {
    name: 'q35a_details',
    type: 'textarea',
    page: 4,
    x: 370,
    y: 720,
    width: 155,
    height: 16,

    marginHeight: 62,
    marginWidth: -10,
    fontSize: 0.6,
  },
  {
    name: 'q35b_yes',
    type: 'checkbox',
    page: 4,
    x: 365,
    y: 695,
    width: 10,
    height: 10,

    marginHeight: 62,
    marginWidth: -10,
  },
  {
    name: 'q35b_no',
    type: 'checkbox',
    page: 4,
    x: 418,
    y: 695,
    width: 10,
    height: 10,

    marginHeight: 62,
    marginWidth: -12,
  },
  {
    name: 'q35b_details',
    type: 'textarea',
    page: 4,
    x: 420,
    y: 680,
    width: 110,
    height: 16,

    marginHeight: 60,
    marginWidth: -15,
    fontSize: 0.4,
  },
  {
    name: 'q35b_status',
    type: 'text',
    page: 4,
    x: 420,
    y: 670,
    width: 110,
    height: 16,

    marginHeight: 70,
    marginWidth: -15,
    fontSize: 0.4,
  },

  // Question 36
  {
    name: 'q36_yes',
    type: 'checkbox',
    page: 4,
    x: 365,
    y: 645,
    width: 10,
    height: 10,

    marginHeight: 62,
    marginWidth: -10,
  },
  {
    name: 'q36_no',
    type: 'checkbox',
    page: 4,
    x: 420,
    y: 645,
    width: 10,
    height: 10,

    marginHeight: 62,
    marginWidth: -12,
  },
  {
    name: 'q36_details',
    type: 'textarea',
    page: 4,
    x: 370,
    y: 630,
    width: 160,
    height: 16,

    marginHeight: 60,
    marginWidth: -10,
    fontSize: 0.6,
  },
  //
  // // Question 37
  {
    name: 'q37_yes',
    type: 'checkbox',
    page: 4,
    x: 363,
    y: 608,
    width: 10,
    height: 10,

    marginHeight: 64,
    marginWidth: -12,
  },
  {
    name: 'q37_no',
    type: 'checkbox',
    page: 4,
    x: 420,
    y: 608,
    width: 10,
    height: 10,

    marginHeight: 64,
    marginWidth: -12,
  },
  {
    name: 'q37_details',
    type: 'textarea',
    page: 4,
    x: 368,
    y: 600,
    width: 160,
    height: 16,

    marginHeight: 64,
    marginWidth: -10,
    fontSize: 0.6,
  },
  //
  // // Question 38
  {
    name: 'q38a_yes',
    type: 'checkbox',
    page: 4,
    x: 365,
    y: 575,
    width: 10,
    height: 10,

    marginHeight: 64,
    marginWidth: -12,
  },
  {
    name: 'q38a_no',
    type: 'checkbox',
    page: 4,
    x: 425,
    y: 575,
    width: 10,
    height: 10,

    marginHeight: 64,
    marginWidth: -12,
  },
  {
    name: 'q38a_details',
    type: 'textarea',
    page: 4,
    x: 425,
    y: 570,
    width: 100,
    height: 12,

    marginHeight: 60,
    marginWidth: -12,
    fontSize: 0.6,
  },
  {
    name: 'q38b_yes',
    type: 'checkbox',
    page: 4,
    x: 364,
    y: 550,
    width: 10,
    height: 10,

    marginHeight: 64,
    marginWidth: -12,
  },
  {
    name: 'q38b_no',
    type: 'checkbox',
    page: 4,
    x: 425,
    y: 550,
    width: 10,
    height: 10,

    marginHeight: 64,
    marginWidth: -12,
  },
  {
    name: 'q38b_details',
    type: 'textarea',
    page: 4,
    x: 422,
    y: 542,
    width: 100,
    height: 12,

    marginHeight: 60,
    marginWidth: -15,
    fontSize: 0.6,
  },
  // // Question 39
  {
    name: 'q39_yes',
    type: 'checkbox',
    page: 4,
    x: 364,
    y: 524,
    width: 10,
    height: 10,

    marginHeight: 68,
    marginWidth: -12,
  },
  {
    name: 'q39_no',
    type: 'checkbox',
    page: 4,
    x: 425,
    y: 524,
    width: 10,
    height: 10,

    marginHeight: 69,
    marginWidth: -12,
  },
  {
    name: 'q39_details',
    type: 'textarea',
    page: 4,
    x: 370,
    y: 510,
    width: 160,
    height: 16,

    marginHeight: 64,
    marginWidth: -10,
    fontSize: 0.6,
  },
  // Question 40
  {
    name: 'q40a_yes',
    type: 'checkbox',
    page: 4,
    x: 363,
    y: 465,
    width: 10,
    height: 10,

    marginHeight: 68,
    marginWidth: -12,
  },
  {
    name: 'q40a_no',
    type: 'checkbox',
    page: 4,
    x: 425,
    y: 465,
    width: 10,
    height: 10,

    marginHeight: 68,
    marginWidth: -12,
  },
  {
    name: 'q40a_specify',
    type: 'text',
    page: 4,
    x: 454,
    y: 462,
    width: 75,
    height: 16,

    marginHeight: 72,
    marginWidth: -10,
    fontSize: 0.6,
  },
  {
    name: 'q40b_yes',
    type: 'checkbox',
    page: 4,
    x: 364,
    y: 445,
    width: 10,
    height: 10,

    marginHeight: 68,
    marginWidth: -12,
  },
  {
    name: 'q40b_no',
    type: 'checkbox',
    page: 4,
    x: 424,
    y: 445,
    width: 10,
    height: 10,

    marginHeight: 68,
    marginWidth: -14,
  },
  {
    name: 'q40b_id_no',
    type: 'text',
    page: 4,
    x: 455,
    y: 440,
    width: 73,
    height: 14,

    marginHeight: 72,
    marginWidth: -10,
    fontSize: 0.6,
  },
  {
    name: 'q40c_yes',
    type: 'checkbox',
    page: 4,
    x: 364,
    y: 425,
    width: 10,
    height: 10,

    marginHeight: 68,
    marginWidth: -12,
  },
  {
    name: 'q40c_no',
    type: 'checkbox',
    page: 4,
    x: 425,
    y: 425,
    width: 10,
    height: 10,

    marginHeight: 68,
    marginWidth: -14,
  },
  {
    name: 'q40c_id_no',
    type: 'text',
    page: 4,
    x: 455,
    y: 422,
    width: 75,
    height: 14,

    marginHeight: 72,
    marginWidth: -10,
    fontSize: 0.6,
  },

  //GOVERNMENT ISSUED ID
  {
    name: 'governmentIssueID',
    type: 'text',
    page: 4,
    x: 125,
    y: 240,
    width: 105,
    height: 14,

    marginHeight: 76,
    marginWidth: -5,
    fontSize: 0.6,
  },
  {
    name: 'IDLicensePassortNo',
    type: 'text',
    page: 4,
    x: 125,
    y: 225,
    width: 105,
    height: 14,

    marginHeight: 76,
    marginWidth: -5,
    fontSize: 0.6,
  },
  {
    name: 'issuance',
    type: 'text',
    page: 4,
    x: 125,
    y: 208,
    width: 105,
    height: 14,

    marginHeight: 76,
    marginWidth: -5,
    fontSize: 0.6,
  },
];

export type Eligibility = {
  careerService: string;
  rating: string;
  dateOfExamination: string;
  placeOfExamination: string;
  licenseNumber: string;
  licenseDateOfValidity: string;
};

export type WorkExperience = {
  inclusiveDatesFrom: string;
  inclusiveDatesTo: string;
  positionTitle: string;
  department: string;
  monthlySalary: string;
  salaryGrade: string;
  statusOfAppointment: string;
  govtService: string;
};

export type VoluntaryWork = {
  nameAndAddress: string;
  inclusiveDateFrom: string;
  inclusiveDateTo: string;
  numberOfHours: string;
  position: string;
};

export type LearningAndDevelopment = {
  title: string;
  inclusiveDatesFrom: string;
  inclusiveDatesTo: string;
  numberOfHours: string;
  typeOfLd: string;
  conductedBy: string;
};

export type OtherInformation = {
  specialSkills: string;
  nonAcademicDistrinction: string;
  membershipOrganization: string;
};

export type References = {
  name: string;
  address: string;
  telNo: string;
};

// --- DYNAMIC FIELD TEMPLATE INTERFACE ---

export interface DynamicFieldTemplate {
  page: number;
  startY: number;
  rowHeight: number;
  fontSize?: number;
  columns: {
    name:
      | keyof Eligibility
      | keyof WorkExperience
      | keyof VoluntaryWork
      | keyof LearningAndDevelopment
      | keyof OtherInformation
      | keyof References;
    x: number;
    width: number;
    marginWidth: number;
    marginHeight: number;
    fontSize: number;
  }[];
}

// --- DYNAMIC FIELD TEMPLATE DEFINITIONS ---

export const eligibilityFieldTemplate: DynamicFieldTemplate = {
  page: 2,
  startY: 785,
  rowHeight: 18,
  columns: [
    {
      name: 'careerService',
      x: 68,
      width: 143,
      marginWidth: -5,
      marginHeight: 63,
      fontSize: 0.4,
    },
    {
      name: 'rating',
      x: 212,
      width: 50,

      marginWidth: -8,
      marginHeight: 63,
      fontSize: 0.4,
    },
    {
      name: 'dateOfExamination',
      x: 262,
      width: 52,

      marginWidth: -10,
      marginHeight: 63,
      fontSize: 0.4,
    },
    {
      name: 'placeOfExamination',
      x: 316,
      width: 138,

      marginWidth: -14,
      marginHeight: 63,
      fontSize: 0.4,
    },
    {
      name: 'licenseNumber',
      x: 455,
      width: 42,

      marginWidth: -16,
      marginHeight: 63,
      fontSize: 0.4,
    },
    {
      name: 'licenseDateOfValidity',
      x: 498,
      width: 30,

      marginWidth: -16,
      marginHeight: 63,
      fontSize: 0.6,
    },
  ],
};

export const workExperienceFieldTemplate: DynamicFieldTemplate = {
  page: 2,
  startY: 592,
  rowHeight: 16.5,
  columns: [
    {
      name: 'inclusiveDatesFrom',
      x: 68,
      width: 37,

      marginWidth: -1,
      marginHeight: 66,
      fontSize: 0.45,
    },
    {
      name: 'inclusiveDatesTo',
      x: 106,
      width: 37,

      marginWidth: -2,
      marginHeight: 66,
      fontSize: 0.45,
    },
    {
      name: 'positionTitle',
      x: 144,
      width: 118,

      marginWidth: -4,
      marginHeight: 66,
      fontSize: 0.5,
    },
    {
      name: 'department',
      x: 263,
      width: 120,

      marginWidth: -5,
      marginHeight: 66,
      fontSize: 0.5,
    },
    {
      name: 'monthlySalary',
      x: 385,
      width: 32,

      marginWidth: -10,
      marginHeight: 66,
      fontSize: 0.5,
    },
    {
      name: 'salaryGrade',
      x: 418,
      width: 35,

      marginWidth: -12,
      marginHeight: 66,
      fontSize: 0.5,
    },
    {
      name: 'statusOfAppointment',
      x: 455,
      width: 42,

      marginWidth: -12,
      marginHeight: 66,
      fontSize: 0.5,
    },
    {
      name: 'govtService',
      x: 498,
      width: 30,

      marginWidth: -16,
      marginHeight: 66,
      fontSize: 0.5,
    },
  ],
};

// NEW & CORRECTED: Template for Voluntary Work
export const voluntaryWorkFieldTemplate: DynamicFieldTemplate = {
  page: 3, // This section is on page 3
  startY: 775,
  rowHeight: 17.5,
  columns: [
    {
      name: 'nameAndAddress',
      x: 62,
      width: 205,

      marginWidth: -5,
      marginHeight: 65,
      fontSize: 0.6,
    },
    {
      name: 'inclusiveDateFrom',
      x: 268,
      width: 35,
      marginWidth: -8,
      marginHeight: 65,
      fontSize: 0.5,
    },
    {
      name: 'inclusiveDateTo',
      x: 305,
      width: 35,

      marginWidth: -8,
      marginHeight: 65,
      fontSize: 0.5,
    },
    {
      name: 'numberOfHours',
      x: 340,
      width: 35,

      marginWidth: -12,
      marginHeight: 65,
      fontSize: 0.5,
    },
    {
      name: 'position',
      x: 376,
      width: 158,

      marginWidth: -12,
      marginHeight: 65,
      fontSize: 0.5,
    },
  ],
};

export const learningAndDevelopmentFieldTemplate: DynamicFieldTemplate = {
  page: 3,
  startY: 590,
  rowHeight: 15.5,
  columns: [
    {
      name: 'title',
      x: 60,
      width: 205,

      marginWidth: -6,
      marginHeight: 68,
      fontSize: 0.6,
    },
    {
      name: 'inclusiveDatesFrom',
      x: 268,
      width: 34,

      marginWidth: -10,
      marginHeight: 68,
      fontSize: 0.5,
    },
    {
      name: 'inclusiveDatesTo',
      x: 305,
      width: 35,

      marginWidth: -8,
      marginHeight: 68,
      fontSize: 0.5,
    },
    {
      name: 'numberOfHours',
      x: 340,
      width: 35,

      marginWidth: -9,
      marginHeight: 68,
      fontSize: 0.5,
    },
    {
      name: 'typeOfLd',
      x: 375,
      width: 40,

      marginWidth: -12,
      marginHeight: 68,
      fontSize: 0.6,
    },
    {
      name: 'conductedBy',
      x: 416,
      width: 118,

      marginWidth: -14,
      marginHeight: 68,
      fontSize: 0.6,
    },
  ],
};

export const otherInformationFieldTemplate: DynamicFieldTemplate = {
  page: 3,
  startY: 224,
  rowHeight: 15.5,
  columns: [
    {
      name: 'specialSkills',
      x: 64,
      width: 116,

      marginWidth: -6,
      marginHeight: 78,
      fontSize: 0.6,
    },
    {
      name: 'nonAcademicDistrinction',
      x: 182,
      width: 232,
      marginWidth: -10,
      marginHeight: 78,
      fontSize: 0.6,
    },
    {
      name: 'membershipOrganization',
      x: 415,
      width: 120,

      marginWidth: -14,
      marginHeight: 78,
      fontSize: 0.6,
    },
  ],
};

export const referencesFieldTemplate: DynamicFieldTemplate = {
  page: 4,
  startY: 370,
  rowHeight: 16.5,
  columns: [
    {
      name: 'name',
      x: 64,
      width: 176,

      marginWidth: -4,
      marginHeight: 76,
      fontSize: 0.5,
    },
    {
      name: 'address',
      x: 245,
      width: 108,

      marginWidth: -6,
      marginHeight: 76,
      fontSize: 0.5,
    },
    {
      name: 'telNo',
      x: 358,
      width: 52,

      marginWidth: -10,
      marginHeight: 76,
      fontSize: 0.5,
    },
  ],
};
