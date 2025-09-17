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

// --- Your static form fields (with Civil Service Eligibility removed) ---
export const formFields: FormField[] = [
  // --- PERSONAL INFORMATION (Page 1) ---
  {
    name: 'surname',
    type: 'text',
    page: 1,
    x: 145,
    y: 726,
    width: 390,
    height: 12,
    marginHeight: 50,
    marginWidth: -10,
    fontSize: 0.6
  },
  {
    name: 'firstName',
    type: 'text',
    page: 1,
    x: 145,
    y: 710,
    width: 275,
    height: 12,
    marginHeight: 50,
    marginWidth: -10,
    fontSize: 0.6
  },
  {
    name: 'middleName',
    type: 'text',
    page: 1,
    x: 145,
    y: 695,
    width: 390,
    height: 12,
    marginHeight: 50,
    marginWidth: -10,
    fontSize: 0.6
  },
  {
    name: 'nameExtension',
    type: 'text',
    page: 1,
    x: 425,
    y: 710,
    width: 110,
    height: 12,

    marginHeight: 50,
    marginWidth: -10,
    fontSize: 0.6
  },
  {
    name: 'dateOfBirth',
    type: 'text',
    page: 1,
    x: 145,
    y: 673,
    width: 112,
    height: 22,

    marginHeight: 50,
    marginWidth: -10,
    fontSize: 0.6
  },
  {
    name: 'placeOfBirth',
    type: 'text',
    page: 1,
    x: 145,
    y: 655,
    width: 112,
    height: 15,

    marginHeight: 50,
    marginWidth: -10,
    fontSize: 0.6
  },
  {
    name: 'sexMale',
    type: 'checkbox',
    page: 1,
    x: 150,
    y: 642,
    width: 8,
    height: 8,
    marginHeight: 52,
    marginWidth: -10
  },
  {
    name: 'sexFemale',
    type: 'checkbox',
    page: 1,
    x: 217,
    y: 642,
    width: 8,
    height: 8,

    marginHeight: 51,
    marginWidth: -10
  },
  {
    name: 'civilStatusSingle',
    type: 'checkbox',
    page: 1,
    x: 150,
    y: 630,
    width: 8,
    height: 8,

    marginHeight: 51,
    marginWidth: -10
  },
  {
    name: 'civilStatusMarried',
    type: 'checkbox',
    page: 1,
    x: 218,
    y: 630,
    width: 8,
    height: 8,

    marginHeight: 52,
    marginWidth: -10
  },
  {
    name: 'civilStatusWidowed',
    type: 'checkbox',
    page: 1,
    x: 150,
    y: 620,
    width: 8,
    height: 8,

    marginHeight: 52,
    marginWidth: -10
  },
  {
    name: 'civilStatusSeparated',
    type: 'checkbox',
    page: 1,
    x: 218,
    y: 620,
    width: 8,
    height: 8,

    marginHeight: 50,
    marginWidth: -10
  },
  {
    name: 'civilStatusOthers',
    type: 'checkbox',
    page: 1,
    x: 150,
    y: 610,
    width: 8,
    height: 8,

    marginHeight: 52,
    marginWidth: -10
  },
  // Citizenship
  {
    name: 'citizenshipFilipino',
    type: 'checkbox',
    page: 1,
    x: 372,
    y: 680,
    width: 8,
    height: 8,

    marginHeight: 52,
    marginWidth: -10
  },
  {
    name: 'citizenshipDual',
    type: 'checkbox',
    page: 1,
    x: 416,
    y: 680,
    width: 8,
    height: 8,

    marginHeight: 52,
    marginWidth: -10
  },
  {
    name: 'dualCitizenshipTypeBirth',
    type: 'checkbox',
    page: 1,
    x: 428,
    y: 670,
    width: 8,
    height: 8,

    marginHeight: 52,
    marginWidth: -12
  },
  {
    name: 'dualCitizenshipTypeNaturalization',
    type: 'checkbox',
    page: 1,
    x: 465,
    y: 670,
    width: 8,
    height: 8,

    marginHeight: 52,
    marginWidth: -12
  },
  {
    name: 'dualCitizenshipCountry',
    type: 'text',
    page: 1,
    x: 365,
    y: 640,
    width: 152,
    height: 15,

    marginHeight: 50,
    marginWidth: -10,
    fontSize: 0.6
  },
  // Addresses
  {
    name: 'resHouseNo',
    type: 'text',
    page: 1,
    x: 330,
    y: 628,
    width: 100,
    height: 10,

    marginHeight: 54,
    marginWidth: -10,
    fontSize: 0.8
  },
  {
    name: 'resStreet',
    type: 'text',
    page: 1,
    x: 430,
    y: 628,
    width: 105,
    height: 10,

    marginHeight: 54,
    marginWidth: -10,
    fontSize: 0.8
  },
  {
    name: 'resSubdivision',
    type: 'text',
    page: 1,
    x: 330,
    y: 613,
    width: 100,
    height: 8,

    marginHeight: 54,
    marginWidth: -10,
    fontSize: 0.8
  },
  {
    name: 'resBarangay',
    type: 'text',
    page: 1,
    x: 430,
    y: 613,
    width: 102,
    height: 8,

    marginHeight: 54,
    marginWidth: -10,
    fontSize: 0.8
  },
  {
    name: 'resCity',
    type: 'text',
    page: 1,
    x: 330,
    y: 598,
    width: 102,
    height: 8,

    marginHeight: 54,
    marginWidth: -10,
    fontSize: 0.8
  },
  {
    name: 'resProvince',
    type: 'text',
    page: 1,
    x: 435,
    y: 598,
    width: 102,
    height: 8,

    marginHeight: 54,
    marginWidth: -10,
    fontSize: 0.8
  },
  {
    name: 'resZipCode',
    type: 'text',
    page: 1,
    x: 330,
    y: 578,
    width: 202,
    height: 13,

    marginHeight: 52,
    marginWidth: -10,
    fontSize: 0.6
  },
  //Permanent Address
  {
    name: 'perHouseNo',
    type: 'text',
    page: 1,
    x: 330,
    y: 565,
    width: 100,
    height: 10,

    marginHeight: 56,
    marginWidth: -10,
    fontSize: 0.8
  },
  {
    name: 'perStreet',
    type: 'text',
    page: 1,
    x: 430,
    y: 565,
    width: 105,
    height: 10,

    marginHeight: 56,
    marginWidth: -10,
    fontSize: 0.8
  },
  {
    name: 'perSubdivision',
    type: 'text',
    page: 1,
    x: 330,
    y: 550,
    width: 100,
    height: 8,

    marginHeight: 54,
    marginWidth: -10,
    fontSize: 0.8
  },
  {
    name: 'perBarangay',
    type: 'text',
    page: 1,
    x: 430,
    y: 550,
    width: 102,
    height: 8,

    marginHeight: 56,
    marginWidth: -10,
    fontSize: 0.8
  },
  {
    name: 'perCity',
    type: 'text',
    page: 1,
    x: 330,
    y: 534,
    width: 102,
    height: 8,

    marginHeight: 56,
    marginWidth: -10,
    fontSize: 0.8
  },
  {
    name: 'perProvince',
    type: 'text',
    page: 1,
    x: 435,
    y: 534,
    width: 102,
    height: 8,

    marginHeight: 56,
    marginWidth: -10,
    fontSize: 0.8
  },
  {
    name: 'perZipCode',
    type: 'text',
    page: 1,
    x: 330,
    y: 512,
    width: 202,
    height: 13,

    marginHeight: 54,
    marginWidth: -10,
    fontSize: 0.8
  },
  //Personal info
  {
    name: 'height',
    type: 'text',
    page: 1,
    x: 145,
    y: 592,
    width: 115,
    height: 13,

    marginHeight: 50,
    marginWidth: -10,
    fontSize: 0.6
  },
  {
    name: 'weight',
    type: 'text',
    page: 1,
    x: 145,
    y: 578,
    width: 115,
    height: 13,

    marginHeight: 50,
    marginWidth: -10,
    fontSize: 0.6
  },
  {
    name: 'bloodType',
    type: 'text',
    page: 1,
    x: 145,
    y: 562,
    width: 115,
    height: 13,

    marginHeight: 50,
    marginWidth: -10,
    fontSize: 0.6
  },
  //Government Ideas
  {
    name: 'gsisNo',
    type: 'text',
    page: 1,
    x: 145,
    y: 545,
    width: 115,
    height: 13,

    marginHeight: 50,
    marginWidth: -10,
    fontSize: 0.6
  },
  {
    name: 'pagibigNo',
    type: 'text',
    page: 1,
    x: 145,
    y: 527,
    width: 115,
    height: 14,

    marginHeight: 50,
    marginWidth: -10,
    fontSize: 0.6
  },
  {
    name: 'philhealthNo',
    type: 'text',
    page: 1,
    x: 145,
    y: 510,
    width: 115,
    height: 14,

    marginHeight: 50,
    marginWidth: -10,
    fontSize: 0.6
  },
  {
    name: 'sssNo',
    type: 'text',
    page: 1,
    x: 145,
    y: 496,
    width: 115,
    height: 14,

    marginHeight: 50,
    marginWidth: -10,
    fontSize: 0.6
  },
  {
    name: 'tinNo',
    type: 'text',
    page: 1,
    x: 145,
    y: 479,
    width: 115,
    height: 14,

    marginHeight: 50,
    marginWidth: -10,
    fontSize: 0.6
  },
  {
    name: 'agencyEmployeeNo',
    type: 'text',
    page: 1,
    x: 145,
    y: 463,
    width: 115,
    height: 14,

    marginHeight: 50,
    marginWidth: -10,
    fontSize: 0.6
  },
  // Contact
  {
    name: 'telephoneNo',
    type: 'text',
    page: 1,
    x: 330,
    y: 495,
    width: 205,
    height: 15,

    marginHeight: 54,
    marginWidth: -10,
    fontSize: 0.6
  },
  {
    name: 'mobileNo',
    type: 'text',
    page: 1,
    x: 330,
    y: 479,
    width: 205,
    height: 14,

    marginHeight: 54,
    marginWidth: -10,
    fontSize: 0.6
  },
  {
    name: 'emailAddress',
    type: 'text',
    page: 1,
    x: 328,
    y: 463,
    width: 205,
    height: 15,

    marginHeight: 54,
    marginWidth: -12,
    fontSize: 0.6
  },
  //Family Background
  {
    name: 'spousesSurname',
    type: 'text',
    page: 1,
    x: 145,
    y: 437,
    width: 182,
    height: 13,

    marginHeight: 55,
    marginWidth: -10,
    fontSize: 0.6
  },
  {
    name: 'spouseFirstName',
    type: 'text',
    page: 1,
    x: 145,
    y: 424,
    width: 114,
    height: 13,

    marginHeight: 58,
    marginWidth: -10,
    fontSize: 0.6
  },
  {
    name: 'spouseNameExtension',
    type: 'text',
    page: 1,
    x: 260,
    y: 424,
    width: 68,
    height: 8,

    marginHeight: 58,
    marginWidth: -10,
    fontSize: 0.6
  },
  {
    name: 'spouseMiddleName',
    type: 'text',
    page: 1,
    x: 145,
    y: 410,
    width: 182,
    height: 13,

    marginHeight: 58,
    marginWidth: -10,
    fontSize: 0.6
  },
  {
    name: 'spouseOccupation',
    type: 'text',
    page: 1,
    x: 145,
    y: 395,
    width: 182,
    height: 13,

    marginHeight: 58,
    marginWidth: -10,
    fontSize: 0.6
  },
  {
    name: 'employerOrBusinessPartner',
    type: 'text',
    page: 1,
    x: 145,
    y: 382,
    width: 182,
    height: 13,

    marginHeight: 58,
    marginWidth: -10,
    fontSize: 0.6
  },
  {
    name: 'businessAddress',
    type: 'text',
    page: 1,
    x: 145,
    y: 368,
    width: 182,
    height: 13,

    marginHeight: 58,
    marginWidth: -10,
    fontSize: 0.6
  },
  {
    name: 'businessTelPho',
    type: 'text',
    page: 1,
    x: 145,
    y: 354,
    width: 182,
    height: 13,

    marginHeight: 58,
    marginWidth: -10,
    fontSize: 0.6
  },
  //Family background Father side
  {
    name: 'fatherSurname',
    type: 'text',
    page: 1,
    x: 145,
    y: 340,
    width: 182,
    height: 13,

    marginHeight: 58,
    marginWidth: -10,
    fontSize: 0.6
  },
  {
    name: 'fatherFirstName',
    type: 'text',
    page: 1,
    x: 145,
    y: 328,
    width: 114,
    height: 13,

    marginHeight: 62,
    marginWidth: -10,
    fontSize: 0.6
  },
  {
    name: 'fatherNameExtension',
    type: 'text',
    page: 1,
    x: 260,
    y: 328,
    width: 68,
    height: 8,

    marginHeight: 62,
    marginWidth: -10,
    fontSize: 0.6
  },
  {
    name: 'fatherMiddleName',
    type: 'text',
    page: 1,
    x: 145,
    y: 313,
    width: 182,
    height: 13,

    marginHeight: 62,
    marginWidth: -10,
    fontSize: 0.6
  },
  // Mother Maidens name
  {
    name: 'motherMaidenName',
    type: 'text',
    page: 1,
    x: 145,
    y: 300,
    width: 182,
    height: 13,

    marginHeight: 62,
    marginWidth: -10,
    fontSize: 0.6
  },
  {
    name: 'motherSurname',
    type: 'text',
    page: 1,
    x: 145,
    y: 285,
    width: 182,
    height: 13,

    marginHeight: 62,
    marginWidth: -10,
    fontSize: 0.6
  },
  {
    name: 'motherFirstName',
    type: 'text',
    page: 1,
    x: 145,
    y: 273,
    width: 182,
    height: 13,

    marginHeight: 62,
    marginWidth: -10,
    fontSize: 0.6
  },
  {
    name: 'motherMiddleName',
    type: 'text',
    page: 1,
    x: 145,
    y: 260,
    width: 182,
    height: 13,

    marginHeight: 62,
    marginWidth: -10,
    fontSize: 0.6
  },
  //Childrens Name
  {
    name: 'childrenName1',
    type: 'text',
    page: 1,
    x: 330,
    y: 424,
    width: 135,
    height: 13,

    marginHeight: 58,
    marginWidth: -10,
    fontSize: 0.6
  },
  {
    name: 'dateOfBirthChild1',
    type: 'text',
    page: 1,
    x: 465,
    y: 424,
    width: 70,
    height: 13,

    marginHeight: 58,
    marginWidth: -15,
    fontSize: 0.6
  },
  {
    name: 'childrenName2',
    type: 'text',
    page: 1,
    x: 330,
    y: 410,
    width: 135,
    height: 13,

    marginHeight: 58,
    marginWidth: -10,
    fontSize: 0.6
  },
  {
    name: 'dateOfBirthChild2',
    type: 'text',
    page: 1,
    x: 465,
    y: 410,
    width: 70,
    height: 13,

    marginHeight: 55,
    marginWidth: -15,
    fontSize: 0.6
  },
  {
    name: 'childrenName3',
    type: 'text',
    page: 1,
    x: 330,
    y: 395,
    width: 135,
    height: 13,

    marginHeight: 55,
    marginWidth: -10,
    fontSize: 0.6
  },
  {
    name: 'dateOfBirthChild3',
    type: 'text',
    page: 1,
    x: 465,
    y: 395,
    width: 70,
    height: 13,

    marginHeight: 55,
    marginWidth: -15,
    fontSize: 0.6
  },
  {
    name: 'childrenName4',
    type: 'text',
    page: 1,
    x: 330,
    y: 383,
    width: 135,
    height: 13,

    marginHeight: 58,
    marginWidth: -10,
    fontSize: 0.6
  },
  {
    name: 'dateOfBirthChild4',
    type: 'text',
    page: 1,
    x: 465,
    y: 383,
    width: 70,
    height: 13,

    marginHeight: 58,
    marginWidth: -15,
    fontSize: 0.6
  },
  {
    name: 'childrenName5',
    type: 'text',
    page: 1,
    x: 330,
    y: 369,
    width: 135,
    height: 13,

    marginHeight: 60,
    marginWidth: -10,
    fontSize: 0.6
  },
  {
    name: 'dateOfBirthChild5',
    type: 'text',
    page: 1,
    x: 465,
    y: 369,
    width: 70,
    height: 13,

    marginHeight: 60,
    marginWidth: -15,
    fontSize: 0.6
  },
  {
    name: 'childrenName6',
    type: 'text',
    page: 1,
    x: 330,
    y: 355,
    width: 135,
    height: 13,

    marginHeight: 60,
    marginWidth: -10,
    fontSize: 0.6
  },
  {
    name: 'dateOfBirthChild6',
    type: 'text',
    page: 1,
    x: 465,
    y: 355,
    width: 70,
    height: 13,

    marginHeight: 60,
    marginWidth: -15,
    fontSize: 0.6
  },
  {
    name: 'childrenName7',
    type: 'text',
    page: 1,
    x: 330,
    y: 340,
    width: 135,
    height: 13,

    marginHeight: 60,
    marginWidth: -10,
    fontSize: 0.6
  },
  {
    name: 'dateOfBirthChild7',
    type: 'text',
    page: 1,
    x: 465,
    y: 340,
    width: 70,
    height: 13,

    marginHeight: 60,
    marginWidth: -15,
    fontSize: 0.6
  },
  {
    name: 'childrenName8',
    type: 'text',
    page: 1,
    x: 330,
    y: 328,
    width: 135,
    height: 13,

    marginHeight: 60,
    marginWidth: -10,
    fontSize: 0.6
  },
  {
    name: 'dateOfBirthChild8',
    type: 'text',
    page: 1,
    x: 465,
    y: 328,
    width: 70,
    height: 13,

    marginHeight: 60,
    marginWidth: -15,
    fontSize: 0.6
  },
  {
    name: 'childrenName9',
    type: 'text',
    page: 1,
    x: 330,
    y: 314,
    width: 135,
    height: 13,

    marginHeight: 60,
    marginWidth: -10,
    fontSize: 0.6
  },
  {
    name: 'dateOfBirthChild9',
    type: 'text',
    page: 1,
    x: 465,
    y: 314,
    width: 70,
    height: 13,

    marginHeight: 60,
    marginWidth: -15,
    fontSize: 0.6
  },
  {
    name: 'childrenName10',
    type: 'text',
    page: 1,
    x: 330,
    y: 300,
    width: 135,
    height: 13,

    marginHeight: 60,
    marginWidth: -10,
    fontSize: 0.6
  },
  {
    name: 'dateOfBirthChild10',
    type: 'text',
    page: 1,
    x: 465,
    y: 300,
    width: 70,
    height: 13,

    marginHeight: 60,
    marginWidth: -15,
    fontSize: 0.6
  },
  {
    name: 'childrenName11',
    type: 'text',
    page: 1,
    x: 330,
    y: 285,
    width: 135,
    height: 13,

    marginHeight: 60,
    marginWidth: -10,
    fontSize: 0.6
  },
  {
    name: 'dateOfBirthChild11',
    type: 'text',
    page: 1,
    x: 465,
    y: 285,
    width: 70,
    height: 13,

    marginHeight: 60,
    marginWidth: -15,
    fontSize: 0.6
  },
  {
    name: 'childrenName12',
    type: 'text',
    page: 1,
    x: 330,
    y: 273,
    width: 135,
    height: 13,

    marginHeight: 64,
    marginWidth: -10,
    fontSize: 0.6
  },
  {
    name: 'dateOfBirthChild12',
    type: 'text',
    page: 1,
    x: 465,
    y: 273,
    width: 70,
    height: 13,

    marginHeight: 64,
    marginWidth: -15,
    fontSize: 0.6
  },
  //EDUCATIONAL Background elementary
  {
    name: 'elementary',
    type: 'text',
    page: 1,
    x: 145,
    y: 198,
    width: 112,
    height: 18,

    marginHeight: 64,
    marginWidth: -8,
    fontSize: 0.6
  },
  {
    name: 'elementaryBasicEdu',
    type: 'text',
    page: 1,
    x: 260,
    y: 198,
    width: 104,
    height: 18,

    marginHeight: 64,
    marginWidth: -8,
    fontSize: 0.6
  },
  {
    name: 'elementaryFrom',
    type: 'text',
    page: 1,
    x: 365,
    y: 198,
    width: 28,
    height: 18,

    marginHeight: 64,
    marginWidth: -12,
    fontSize: 0.6
  },
  {
    name: 'elementaryTo',
    type: 'text',
    page: 1,
    x: 394,
    y: 198,
    width: 28,
    height: 18,

    marginHeight: 64,
    marginWidth: -12,
    fontSize: 0.6
  },
  {
    name: 'elementaryHighestLevel',
    type: 'text',
    page: 1,
    x: 424,
    y: 198,
    width: 40,
    height: 18,

    marginHeight: 64,
    marginWidth: -12,
    fontSize: 0.6
  },
  {
    name: 'elementaryYearGraduated',
    type: 'text',
    page: 1,
    x: 465,
    y: 198,
    width: 34,
    height: 18,

    marginHeight: 64,
    marginWidth: -14,
    fontSize: 0.6
  },
  {
    name: 'elementaryHonors',
    type: 'text',
    page: 1,
    x: 500,
    y: 198,
    width: 34,
    height: 18,

    marginHeight: 64,
    marginWidth: -14,
    fontSize: 0.6
  },
  //EDUCATIONAL Secondary
  {
    name: 'seconday',
    type: 'text',
    page: 1,
    x: 145,
    y: 178,
    width: 112,
    height: 18,

    marginHeight: 64,
    marginWidth: -8,
    fontSize: 0.6
  },
  {
    name: 'secondaryBasicEdu',
    type: 'text',
    page: 1,
    x: 260,
    y: 178,
    width: 104,
    height: 18,

    marginHeight: 64,
    marginWidth: -8,
    fontSize: 0.6
  },
  {
    name: 'secondaryFrom',
    type: 'text',
    page: 1,
    x: 365,
    y: 178,
    width: 28,
    height: 18,

    marginHeight: 64,
    marginWidth: -12,
    fontSize: 0.6
  },
  {
    name: 'secondaryTo',
    type: 'text',
    page: 1,
    x: 394,
    y: 178,
    width: 28,
    height: 18,

    marginHeight: 64,
    marginWidth: -12,
    fontSize: 0.6
  },
  {
    name: 'secondaryHighestLevel',
    type: 'text',
    page: 1,
    x: 424,
    y: 178,
    width: 40,
    height: 18,

    marginHeight: 64,
    marginWidth: -14,
    fontSize: 0.6
  },
  {
    name: 'secondaryYearGraduated',
    type: 'text',
    page: 1,
    x: 465,
    y: 178,
    width: 34,
    height: 18,

    marginHeight: 64,
    marginWidth: -14,
    fontSize: 0.6
  },
  {
    name: 'secondaryHonors',
    type: 'text',
    page: 1,
    x: 500,
    y: 178,
    width: 34,
    height: 18,

    marginHeight: 64,
    marginWidth: -13,
    fontSize: 0.6
  },
  // EDUCATIONAL Trade Course
  {
    name: 'vocational',
    type: 'text',
    page: 1,
    x: 145,
    y: 160,
    width: 112,
    height: 18,

    marginHeight: 64,
    marginWidth: -8,
    fontSize: 0.6
  },
  {
    name: 'vocationalBasicEdu',
    type: 'text',
    page: 1,
    x: 260,
    y: 160,
    width: 104,
    height: 18,

    marginHeight: 64,
    marginWidth: -8,
    fontSize: 0.6
  },
  {
    name: 'vocationalFrom',
    type: 'text',
    page: 1,
    x: 365,
    y: 160,
    width: 28,
    height: 18,

    marginHeight: 64,
    marginWidth: -12,
    fontSize: 0.6
  },
  {
    name: 'vocationalTo',
    type: 'text',
    page: 1,
    x: 394,
    y: 160,
    width: 28,
    height: 18,

    marginHeight: 64,
    marginWidth: -12,
    fontSize: 0.6
  },
  {
    name: 'vocationalHighestLevel',
    type: 'text',
    page: 1,
    x: 424,
    y: 160,
    width: 40,
    height: 18,

    marginHeight: 64,
    marginWidth: -12,
    fontSize: 0.6
  },
  {
    name: 'vocationalYearGraduated',
    type: 'text',
    page: 1,
    x: 465,
    y: 160,
    width: 34,
    height: 18,

    marginHeight: 64,
    marginWidth: -14,
    fontSize: 0.6
  },
  {
    name: 'vocationalHonors',
    type: 'text',
    page: 1,
    x: 500,
    y: 160,
    width: 34,
    height: 18,

    marginHeight: 64,
    marginWidth: -14,
    fontSize: 0.6
  },
  //EDUCATIONAL College
  {
    name: 'college',
    type: 'text',
    page: 1,
    x: 145,
    y: 140,
    width: 112,
    height: 18,

    marginHeight: 64,
    marginWidth: -8,
    fontSize: 0.6
  },
  {
    name: 'collegeBasicEdu',
    type: 'text',
    page: 1,
    x: 260,
    y: 140,
    width: 104,
    height: 18,

    marginHeight: 64,
    marginWidth: -8,
    fontSize: 0.6
  },
  {
    name: 'collegeFrom',
    type: 'text',
    page: 1,
    x: 365,
    y: 140,
    width: 28,
    height: 18,

    marginHeight: 64,
    marginWidth: -12,
    fontSize: 0.6
  },
  {
    name: 'collegeTo',
    type: 'text',
    page: 1,
    x: 394,
    y: 140,
    width: 28,
    height: 18,

    marginHeight: 64,
    marginWidth: -12,
    fontSize: 0.6
  },
  {
    name: 'collegeHighestLevel',
    type: 'text',
    page: 1,
    x: 424,
    y: 140,
    width: 40,
    height: 18,

    marginHeight: 64,
    marginWidth: -12,
    fontSize: 0.6
  },
  {
    name: 'collegeYearGraduated',
    type: 'text',
    page: 1,
    x: 465,
    y: 140,
    width: 34,
    height: 18,

    marginHeight: 64,
    marginWidth: -14,
    fontSize: 0.6
  },
  {
    name: 'collegeHonors',
    type: 'text',
    page: 1,
    x: 500,
    y: 140,
    width: 34,
    height: 18,

    marginHeight: 64,
    marginWidth: -14,
    fontSize: 0.6
  },
  //GRADUATE STUDIES
  {
    name: 'graduate',
    type: 'text',
    page: 1,
    x: 145,
    y: 122,
    width: 112,
    height: 18,

    marginHeight: 64,
    marginWidth: -8,
    fontSize: 0.6
  },
  {
    name: 'graduateBasicEdu',
    type: 'text',
    page: 1,
    x: 260,
    y: 122,
    width: 104,
    height: 18,

    marginHeight: 64,
    marginWidth: -8,
    fontSize: 0.6
  },
  {
    name: 'graduateFrom',
    type: 'text',
    page: 1,
    x: 365,
    y: 122,
    width: 28,
    height: 18,

    marginHeight: 64,
    marginWidth: -12,
    fontSize: 0.6
  },
  {
    name: 'graduateTo',
    type: 'text',
    page: 1,
    x: 394,
    y: 122,
    width: 28,
    height: 18,

    marginHeight: 64,
    marginWidth: -12,
    fontSize: 0.6
  },
  {
    name: 'graduateHighestLevel',
    type: 'text',
    page: 1,
    x: 424,
    y: 122,
    width: 40,
    height: 18,

    marginHeight: 64,
    marginWidth: -14,
    fontSize: 0.6
  },
  {
    name: 'graduateYearGraduated',
    type: 'text',
    page: 1,
    x: 465,
    y: 122,
    width: 34,
    height: 18,

    marginHeight: 64,
    marginWidth: -14,
    fontSize: 0.6
  },
  {
    name: 'graduateHonors',
    type: 'text',
    page: 1,
    x: 500,
    y: 122,
    width: 34,
    height: 18,

    marginHeight: 64,
    marginWidth: -14,
    fontSize: 0.6
  },
  //PAGE 1 DATE
  {
    name: 'date',
    type: 'text',
    page: 1,
    x: 423,
    y: 95,
    width: 110,
    height: 18,

    marginHeight: 65,
    marginWidth: -16,
    fontSize: 0.6
  },

  //PAGE 3 DATE
  {
    name: 'date2',
    type: 'text',
    page: 3,
    x: 418,
    y: 92,
    width: 116,
    height: 16,

    marginHeight: 50,
    marginWidth: -10,
    fontSize: 0.6
  },

  {
    name: 'q34a_yes',
    type: 'checkbox',
    page: 4,
    x: 365,
    y: 774,
    width: 10,
    height: 10,

    marginHeight: 50,
    marginWidth: -10
  },
  {
    name: 'q34a_no',
    type: 'checkbox',
    page: 4,
    x: 415,
    y: 774,
    width: 10,
    height: 10,

    marginHeight: 50,
    marginWidth: -10
  },
  {
    name: 'q34b_yes',
    type: 'checkbox',
    page: 4,
    x: 365,
    y: 762,
    width: 10,
    height: 10,

    marginHeight: 50,
    marginWidth: -10
  },
  {
    name: 'q34b_no',
    type: 'checkbox',
    page: 4,
    x: 415,
    y: 762,
    width: 10,
    height: 10,

    marginHeight: 50,
    marginWidth: -10
  },
  {
    name: 'q34_details',
    type: 'textarea',
    page: 4,
    x: 370,
    y: 740,
    width: 155,
    height: 16,

    marginHeight: 50,
    marginWidth: -10,
    fontSize: 0.6
  },

  // // Question 35
  {
    name: 'q35a_yes',
    type: 'checkbox',
    page: 4,
    x: 365,
    y: 725,
    width: 10,
    height: 10,

    marginHeight: 50,
    marginWidth: -10
  },
  {
    name: 'q35a_no',
    type: 'checkbox',
    page: 4,
    x: 415,
    y: 725,
    width: 10,
    height: 10,

    marginHeight: 50,
    marginWidth: -12
  },
  {
    name: 'q35a_details',
    type: 'textarea',
    page: 4,
    x: 370,
    y: 700,
    width: 155,
    height: 16,

    marginHeight: 50,
    marginWidth: -10,
    fontSize: 0.6
  },
  {
    name: 'q35b_yes',
    type: 'checkbox',
    page: 4,
    x: 365,
    y: 685,
    width: 10,
    height: 10,

    marginHeight: 50,
    marginWidth: -10
  },
  {
    name: 'q35b_no',
    type: 'checkbox',
    page: 4,
    x: 418,
    y: 685,
    width: 10,
    height: 10,

    marginHeight: 50,
    marginWidth: -12
  },
  {
    name: 'q35b_details',
    type: 'textarea',
    page: 4,
    x: 420,
    y: 662,
    width: 110,
    height: 16,

    marginHeight: 50,
    marginWidth: -10,
    fontSize: 0.6
  },
  {
    name: 'q35b_status',
    type: 'text',
    page: 4,
    x: 420,
    y: 650,
    width: 110,
    height: 16,

    marginHeight: 50,
    marginWidth: -10,
    fontSize: 0.6
  },

  // Question 36
  {
    name: 'q36_yes',
    type: 'checkbox',
    page: 4,
    x: 365,
    y: 635,
    width: 10,
    height: 10,

    marginHeight: 50,
    marginWidth: -10
  },
  {
    name: 'q36_no',
    type: 'checkbox',
    page: 4,
    x: 420,
    y: 635,
    width: 10,
    height: 10,

    marginHeight: 50,
    marginWidth: -12
  },
  {
    name: 'q36_details',
    type: 'textarea',
    page: 4,
    x: 370,
    y: 612,
    width: 160,
    height: 16,

    marginHeight: 50,
    marginWidth: -10,
    fontSize: 0.6
  },
  //
  // // Question 37
  {
    name: 'q37_yes',
    type: 'checkbox',
    page: 4,
    x: 363,
    y: 598,
    width: 10,
    height: 10,

    marginHeight: 54,
    marginWidth: -12
  },
  {
    name: 'q37_no',
    type: 'checkbox',
    page: 4,
    x: 420,
    y: 598,
    width: 10,
    height: 10,

    marginHeight: 54,
    marginWidth: -12
  },
  {
    name: 'q37_details',
    type: 'textarea',
    page: 4,
    x: 368,
    y: 580,
    width: 160,
    height: 16,

    marginHeight: 50,
    marginWidth: -10,
    fontSize: 0.6
  },
  //
  // // Question 38
  {
    name: 'q38a_yes',
    type: 'checkbox',
    page: 4,
    x: 365,
    y: 565,
    width: 10,
    height: 10,

    marginHeight: 55,
    marginWidth: -12
  },
  {
    name: 'q38a_no',
    type: 'checkbox',
    page: 4,
    x: 425,
    y: 565,
    width: 10,
    height: 10,

    marginHeight: 55,
    marginWidth: -12
  },
  {
    name: 'q38a_details',
    type: 'textarea',
    page: 4,
    x: 425,
    y: 555,
    width: 100,
    height: 12,

    marginHeight: 50,
    marginWidth: -10,
    fontSize: 0.6
  },
  {
    name: 'q38b_yes',
    type: 'checkbox',
    page: 4,
    x: 364,
    y: 542,
    width: 10,
    height: 10,

    marginHeight: 55,
    marginWidth: -12
  },
  {
    name: 'q38b_no',
    type: 'checkbox',
    page: 4,
    x: 425,
    y: 540,
    width: 10,
    height: 10,

    marginHeight: 55,
    marginWidth: -12
  },
  {
    name: 'q38b_details',
    type: 'textarea',
    page: 4,
    x: 422,
    y: 530,
    width: 100,
    height: 12,

    marginHeight: 50,
    marginWidth: -10,
    fontSize: 0.6
  },
  // // Question 39
  {
    name: 'q39_yes',
    type: 'checkbox',
    page: 4,
    x: 364,
    y: 514,
    width: 10,
    height: 10,

    marginHeight: 58,
    marginWidth: -12
  },
  {
    name: 'q39_no',
    type: 'checkbox',
    page: 4,
    x: 425,
    y: 515,
    width: 10,
    height: 10,

    marginHeight: 58,
    marginWidth: -12
  },
  {
    name: 'q39_details',
    type: 'textarea',
    page: 4,
    x: 370,
    y: 495,
    width: 160,
    height: 16,

    marginHeight: 50,
    marginWidth: -10,
    fontSize: 0.6
  },
  // Question 40
  {
    name: 'q40a_yes',
    type: 'checkbox',
    page: 4,
    x: 363,
    y: 456,
    width: 10,
    height: 10,

    marginHeight: 58,
    marginWidth: -12
  },
  {
    name: 'q40a_no',
    type: 'checkbox',
    page: 4,
    x: 425,
    y: 456,
    width: 10,
    height: 10,

    marginHeight: 58,
    marginWidth: -12
  },
  {
    name: 'q40a_specify',
    type: 'text',
    page: 4,
    x: 454,
    y: 450,
    width: 75,
    height: 16,

    marginHeight: 50,
    marginWidth: -10,
    fontSize: 0.6
  },
  {
    name: 'q40b_yes',
    type: 'checkbox',
    page: 4,
    x: 364,
    y: 435,
    width: 10,
    height: 10,

    marginHeight: 58,
    marginWidth: -12
  },
  {
    name: 'q40b_no',
    type: 'checkbox',
    page: 4,
    x: 424,
    y: 435,
    width: 10,
    height: 10,

    marginHeight: 58,
    marginWidth: -14
  },
  {
    name: 'q40b_id_no',
    type: 'text',
    page: 4,
    x: 455,
    y: 428,
    width: 73,
    height: 14,

    marginHeight: 50,
    marginWidth: -10,
    fontSize: 0.6
  },
  {
    name: 'q40c_yes',
    type: 'checkbox',
    page: 4,
    x: 364,
    y: 415,
    width: 10,
    height: 10,

    marginHeight: 58,
    marginWidth: -12
  },
  {
    name: 'q40c_no',
    type: 'checkbox',
    page: 4,
    x: 425,
    y: 415,
    width: 10,
    height: 10,

    marginHeight: 58,
    marginWidth: -14
  },
  {
    name: 'q40c_id_no',
    type: 'text',
    page: 4,
    x: 455,
    y: 410,
    width: 75,
    height: 14,

    marginHeight: 50,
    marginWidth: -10,
    fontSize: 0.6
  },

  //GOVERNMENT ISSUED ID
  {
    name: 'governmentIssueID',
    type: 'text',
    page: 4,
    x: 125,
    y: 226,
    width: 105,
    height: 14,

    marginHeight: 62,
    marginWidth: -5,
    fontSize: 0.6
  },
  {
    name: 'IDLicensePassortNo',
    type: 'text',
    page: 4,
    x: 125,
    y: 210,
    width: 105,
    height: 14,

    marginHeight: 62,
    marginWidth: -5,
    fontSize: 0.6
  },
  {
    name: 'issuance',
    type: 'text',
    page: 4,
    x: 125,
    y: 195,
    width: 105,
    height: 14,

    marginHeight: 62,
    marginWidth: -5,
    fontSize: 0.6
  }
]

export type Eligibility = {
  careerService: string
  rating: string
  dateOfExamination: string
  placeOfExamination: string
  licenseNumber: string
  licenseDateOfValidity: string
}

export type WorkExperience = {
  inclusiveDatesFrom: string
  inclusiveDatesTo: string
  positionTitle: string
  department: string
  monthlySalary: string
  salaryGrade: string
  statusOfAppointment: string
  govtService: string
}

export type VoluntaryWork = {
  nameAndAddress: string
  inclusiveDateFrom: string
  inclusiveDateTo: string
  numberOfHours: string
  position: string
}

export type LearningAndDevelopment = {
  title: string
  inclusiveDatesFrom: string
  inclusiveDatesTo: string
  numberOfHours: string
  typeOfLd: string
  conductedBy: string
}

export type OtherInformation = {
  specialSkills: string
  nonAcademicDistrinction: string
  membershipOrganization: string
}

export type References = {
  name: string
  address: string
  telNo: string
}

// --- DYNAMIC FIELD TEMPLATE INTERFACE ---

export interface DynamicFieldTemplate {
  page: number
  startY: number
  rowHeight: number
  columns: {
    name:
      | keyof Eligibility
      | keyof WorkExperience
      | keyof VoluntaryWork
      | keyof LearningAndDevelopment
      | keyof OtherInformation
      | keyof References
    x: number
    width: number
    marginWidth: number
    marginHeight: number
    fontSize: number
  }[]
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
      fontSize: 0.6
    },
    {
      name: 'rating',
      x: 212,
      width: 50,

      marginWidth: -8,
      marginHeight: 63,
      fontSize: 0.6
    },
    {
      name: 'dateOfExamination',
      x: 262,
      width: 52,

      marginWidth: -10,
      marginHeight: 63,
      fontSize: 0.6
    },
    {
      name: 'placeOfExamination',
      x: 316,
      width: 138,

      marginWidth: -14,
      marginHeight: 63,
      fontSize: 0.6
    },
    {
      name: 'licenseNumber',
      x: 455,
      width: 42,

      marginWidth: -16,
      marginHeight: 63,
      fontSize: 0.6
    },
    {
      name: 'licenseDateOfValidity',
      x: 498,
      width: 30,

      marginWidth: -16,
      marginHeight: 63,
      fontSize: 0.6
    }
  ]
}

export const workExperienceFieldTemplate: DynamicFieldTemplate = {
  page: 2,
  startY: 575,
  rowHeight: 16.5,
  columns: [
    {
      name: 'inclusiveDatesFrom',
      x: 68,
      width: 37,

      marginWidth: -1,
      marginHeight: 53,
      fontSize: 0.45
    },
    {
      name: 'inclusiveDatesTo',
      x: 106,
      width: 37,

      marginWidth: -2,
      marginHeight: 53,
      fontSize: 0.45
    },
    {
      name: 'positionTitle',
      x: 144,
      width: 118,

      marginWidth: -4,
      marginHeight: 53,
      fontSize: 0.5
    },
    {
      name: 'department',
      x: 263,
      width: 120,

      marginWidth: -5,
      marginHeight: 53,
      fontSize: 0.5
    },
    {
      name: 'monthlySalary',
      x: 385,
      width: 32,

      marginWidth: -10,
      marginHeight: 53,
      fontSize: 0.5
    },
    {
      name: 'salaryGrade',
      x: 418,
      width: 35,

      marginWidth: -12,
      marginHeight: 53,
      fontSize: 0.5
    },
    {
      name: 'statusOfAppointment',
      x: 455,
      width: 42,

      marginWidth: -12,
      marginHeight: 53,
      fontSize: 0.5
    },
    {
      name: 'govtService',
      x: 498,
      width: 30,

      marginWidth: -16,
      marginHeight: 53,
      fontSize: 0.5
    }
  ]
}

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
      fontSize: 0.6
    },
    {
      name: 'inclusiveDateFrom',
      x: 268,
      width: 35,
      marginWidth: -8,
      marginHeight: 65,
      fontSize: 0.5
    },
    {
      name: 'inclusiveDateTo',
      x: 305,
      width: 35,

      marginWidth: -8,
      marginHeight: 65,
      fontSize: 0.5
    },
    {
      name: 'numberOfHours',
      x: 340,
      width: 35,

      marginWidth: -12,
      marginHeight: 65,
      fontSize: 0.5
    },
    {
      name: 'position',
      x: 376,
      width: 158,

      marginWidth: -12,
      marginHeight: 65,
      fontSize: 0.5
    }
  ]
}

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
      fontSize: 0.6
    },
    {
      name: 'inclusiveDatesFrom',
      x: 268,
      width: 34,

      marginWidth: -10,
      marginHeight: 68,
      fontSize: 0.5
    },
    {
      name: 'inclusiveDatesTo',
      x: 305,
      width: 35,

      marginWidth: -8,
      marginHeight: 68,
      fontSize: 0.5
    },
    {
      name: 'numberOfHours',
      x: 340,
      width: 35,

      marginWidth: -9,
      marginHeight: 68,
      fontSize: 0.5
    },
    {
      name: 'typeOfLd',
      x: 375,
      width: 40,

      marginWidth: -12,
      marginHeight: 68,
      fontSize: 0.6
    },
    {
      name: 'conductedBy',
      x: 416,
      width: 118,

      marginWidth: -14,
      marginHeight: 68,
      fontSize: 0.6
    }
  ]
}

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
      fontSize: 0.6
    },
    {
      name: 'nonAcademicDistrinction',
      x: 182,
      width: 232,
      marginWidth: -10,
      marginHeight: 78,
      fontSize: 0.6
    },
    {
      name: 'membershipOrganization',
      x: 415,
      width: 120,

      marginWidth: -14,
      marginHeight: 78,
      fontSize: 0.6
    }
  ]
}

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
      marginHeight: 72,
      fontSize: 0.7
    },
    {
      name: 'address',
      x: 245,
      width: 108,

      marginWidth: -6,
      marginHeight: 72,
      fontSize: 0.5
    },
    {
      name: 'telNo',
      x: 358,
      width: 52,

      marginWidth: -10,
      marginHeight: 73,
      fontSize: 0.5
    }
  ]
}
