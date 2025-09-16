// lib/pds-form-fields.ts

export interface FormField {
  name: string
  type: 'text' | 'checkbox' | 'textarea'
  page: number
  x: number
  y: number
  width: number
  height: number
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
    x: 143,
    y: 726,
    width: 390,
    height: 12
  },
  {
    name: 'firstName',
    type: 'text',
    page: 1,
    x: 145,
    y: 710,
    width: 275,
    height: 12
  },
  {
    name: 'middleName',
    type: 'text',
    page: 1,
    x: 145,
    y: 695,
    width: 390,
    height: 12
  },
  {
    name: 'nameExtension',
    type: 'text',
    page: 1,
    x: 425,
    y: 710,
    width: 110,
    height: 12
  },
  {
    name: 'dateOfBirth',
    type: 'text',
    page: 1,
    x: 145,
    y: 673,
    width: 112,
    height: 22
  },
  {
    name: 'placeOfBirth',
    type: 'text',
    page: 1,
    x: 145,
    y: 655,
    width: 112,
    height: 15
  },
  {
    name: 'sexMale',
    type: 'checkbox',
    page: 1,
    x: 150,
    y: 642,
    width: 8,
    height: 8
  },
  {
    name: 'sexFemale',
    type: 'checkbox',
    page: 1,
    x: 217,
    y: 642,
    width: 8,
    height: 8
  },
  {
    name: 'civilStatusSingle',
    type: 'checkbox',
    page: 1,
    x: 150,
    y: 630,
    width: 8,
    height: 8
  },
  {
    name: 'civilStatusMarried',
    type: 'checkbox',
    page: 1,
    x: 218,
    y: 630,
    width: 8,
    height: 8
  },
  {
    name: 'civilStatusWidowed',
    type: 'checkbox',
    page: 1,
    x: 150,
    y: 620,
    width: 8,
    height: 8
  },
  {
    name: 'civilStatusSeparated',
    type: 'checkbox',
    page: 1,
    x: 218,
    y: 620,
    width: 8,
    height: 8
  },
  {
    name: 'civilStatusOthers',
    type: 'checkbox',
    page: 1,
    x: 150,
    y: 610,
    width: 8,
    height: 8
  },
  // Citizenship
  {
    name: 'citizenshipFilipino',
    type: 'checkbox',
    page: 1,
    x: 372,
    y: 680,
    width: 8,
    height: 8
  },
  {
    name: 'citizenshipDual',
    type: 'checkbox',
    page: 1,
    x: 416,
    y: 680,
    width: 8,
    height: 8
  },
  {
    name: 'dualCitizenshipTypeBirth',
    type: 'checkbox',
    page: 1,
    x: 428,
    y: 670,
    width: 8,
    height: 8
  },
  {
    name: 'dualCitizenshipTypeNaturalization',
    type: 'checkbox',
    page: 1,
    x: 465,
    y: 670,
    width: 8,
    height: 8
  },
  {
    name: 'dualCitizenshipCountry',
    type: 'text',
    page: 1,
    x: 365,
    y: 640,
    width: 152,
    height: 15
  },
  // Addresses
  {
    name: 'resHouseNo',
    type: 'text',
    page: 1,
    x: 330,
    y: 628,
    width: 100,
    height: 10
  },
  {
    name: 'resStreet',
    type: 'text',
    page: 1,
    x: 430,
    y: 628,
    width: 105,
    height: 10
  },
  {
    name: 'resSubdivision',
    type: 'text',
    page: 1,
    x: 330,
    y: 613,
    width: 100,
    height: 8
  },
  {
    name: 'resBarangay',
    type: 'text',
    page: 1,
    x: 430,
    y: 613,
    width: 102,
    height: 8
  },
  {
    name: 'resCity',
    type: 'text',
    page: 1,
    x: 330,
    y: 598,
    width: 102,
    height: 8
  },
  {
    name: 'resProvince',
    type: 'text',
    page: 1,
    x: 435,
    y: 598,
    width: 102,
    height: 8
  },
  {
    name: 'resZipCode',
    type: 'text',
    page: 1,
    x: 330,
    y: 578,
    width: 202,
    height: 13
  },
  //Permanent Address
  {
    name: 'perHouseNo',
    type: 'text',
    page: 1,
    x: 330,
    y: 565,
    width: 100,
    height: 10
  },
  {
    name: 'perStreet',
    type: 'text',
    page: 1,
    x: 430,
    y: 565,
    width: 105,
    height: 10
  },
  {
    name: 'perSubdivision',
    type: 'text',
    page: 1,
    x: 330,
    y: 550,
    width: 100,
    height: 8
  },
  {
    name: 'perBarangay',
    type: 'text',
    page: 1,
    x: 430,
    y: 550,
    width: 102,
    height: 8
  },
  {
    name: 'perCity',
    type: 'text',
    page: 1,
    x: 330,
    y: 534,
    width: 102,
    height: 8
  },
  {
    name: 'perProvince',
    type: 'text',
    page: 1,
    x: 435,
    y: 534,
    width: 102,
    height: 8
  },
  {
    name: 'perZipCode',
    type: 'text',
    page: 1,
    x: 330,
    y: 512,
    width: 202,
    height: 13
  },
  //Personal info
  {
    name: 'height',
    type: 'text',
    page: 1,
    x: 145,
    y: 592,
    width: 115,
    height: 13
  },
  {
    name: 'weight',
    type: 'text',
    page: 1,
    x: 145,
    y: 578,
    width: 115,
    height: 13
  },
  {
    name: 'bloodType',
    type: 'text',
    page: 1,
    x: 145,
    y: 562,
    width: 115,
    height: 13
  },
  //Government Ideas
  {
    name: 'gsisNo',
    type: 'text',
    page: 1,
    x: 145,
    y: 545,
    width: 115,
    height: 13
  },
  {
    name: 'pagibigNo',
    type: 'text',
    page: 1,
    x: 145,
    y: 527,
    width: 115,
    height: 14
  },
  {
    name: 'philhealthNo',
    type: 'text',
    page: 1,
    x: 145,
    y: 510,
    width: 115,
    height: 14
  },
  {
    name: 'sssNo',
    type: 'text',
    page: 1,
    x: 145,
    y: 496,
    width: 115,
    height: 14
  },
  {
    name: 'tinNo',
    type: 'text',
    page: 1,
    x: 145,
    y: 479,
    width: 115,
    height: 14
  },
  {
    name: 'agencyEmployeeNo',
    type: 'text',
    page: 1,
    x: 145,
    y: 463,
    width: 115,
    height: 14
  },
  // Contact
  {
    name: 'telephoneNo',
    type: 'text',
    page: 1,
    x: 330,
    y: 495,
    width: 205,
    height: 15
  },
  {
    name: 'mobileNo',
    type: 'text',
    page: 1,
    x: 330,
    y: 479,
    width: 205,
    height: 14
  },
  {
    name: 'emailAddress',
    type: 'text',
    page: 1,
    x: 328,
    y: 463,
    width: 205,
    height: 15
  },
  //Family Background
  {
    name: 'spousesSurname',
    type: 'text',
    page: 1,
    x: 145,
    y: 437,
    width: 182,
    height: 13
  },
  {
    name: 'spouseFirstName',
    type: 'text',
    page: 1,
    x: 145,
    y: 424,
    width: 114,
    height: 13
  },
  {
    name: 'spouseNameExtension',
    type: 'text',
    page: 1,
    x: 260,
    y: 424,
    width: 68,
    height: 8
  },
  {
    name: 'spouseMiddleName',
    type: 'text',
    page: 1,
    x: 145,
    y: 410,
    width: 182,
    height: 13
  },
  {
    name: 'spouseOccupation',
    type: 'text',
    page: 1,
    x: 145,
    y: 395,
    width: 182,
    height: 13
  },
  {
    name: 'employerOrBusinessPartner',
    type: 'text',
    page: 1,
    x: 145,
    y: 382,
    width: 182,
    height: 13
  },
  {
    name: 'businessAddress',
    type: 'text',
    page: 1,
    x: 145,
    y: 368,
    width: 182,
    height: 13
  },
  {
    name: 'businessTelPho',
    type: 'text',
    page: 1,
    x: 145,
    y: 354,
    width: 182,
    height: 13
  },
  //Family background Father side
  {
    name: 'fatherSurname',
    type: 'text',
    page: 1,
    x: 145,
    y: 340,
    width: 182,
    height: 13
  },
  {
    name: 'fatherFirstName',
    type: 'text',
    page: 1,
    x: 145,
    y: 328,
    width: 114,
    height: 13
  },
  {
    name: 'fatherNameExtension',
    type: 'text',
    page: 1,
    x: 260,
    y: 328,
    width: 68,
    height: 8
  },
  {
    name: 'fatherMiddleName',
    type: 'text',
    page: 1,
    x: 145,
    y: 313,
    width: 182,
    height: 13
  },
  // Mother Maidens name
  {
    name: 'motherSurname',
    type: 'text',
    page: 1,
    x: 145,
    y: 300,
    width: 182,
    height: 13
  },
  {
    name: 'motherNameExtension',
    type: 'text',
    page: 1,
    x: 145,
    y: 285,
    width: 182,
    height: 13
  },
  {
    name: 'motherFirstName',
    type: 'text',
    page: 1,
    x: 145,
    y: 273,
    width: 182,
    height: 13
  },
  {
    name: 'motherMiddleName',
    type: 'text',
    page: 1,
    x: 145,
    y: 260,
    width: 182,
    height: 13
  },
  //Childrens Name
  {
    name: 'childrenName1',
    type: 'text',
    page: 1,
    x: 330,
    y: 424,
    width: 135,
    height: 13
  },
  {
    name: 'dateOfBirthChild1',
    type: 'text',
    page: 1,
    x: 465,
    y: 424,
    width: 70,
    height: 13
  },
  {
    name: 'childrenName2',
    type: 'text',
    page: 1,
    x: 330,
    y: 410,
    width: 135,
    height: 13
  },
  {
    name: 'dateOfBirthChild2',
    type: 'text',
    page: 1,
    x: 465,
    y: 410,
    width: 70,
    height: 13
  },
  {
    name: 'childrenName3',
    type: 'text',
    page: 1,
    x: 330,
    y: 395,
    width: 135,
    height: 13
  },
  {
    name: 'dateOfBirthChild3',
    type: 'text',
    page: 1,
    x: 465,
    y: 395,
    width: 70,
    height: 13
  },
  {
    name: 'childrenName4',
    type: 'text',
    page: 1,
    x: 330,
    y: 383,
    width: 135,
    height: 13
  },
  {
    name: 'dateOfBirthChild4',
    type: 'text',
    page: 1,
    x: 465,
    y: 383,
    width: 70,
    height: 13
  },
  {
    name: 'childrenName5',
    type: 'text',
    page: 1,
    x: 330,
    y: 369,
    width: 135,
    height: 13
  },
  {
    name: 'dateOfBirthChild5',
    type: 'text',
    page: 1,
    x: 465,
    y: 369,
    width: 70,
    height: 13
  },
  {
    name: 'childrenName6',
    type: 'text',
    page: 1,
    x: 330,
    y: 355,
    width: 135,
    height: 13
  },
  {
    name: 'dateOfBirthChild6',
    type: 'text',
    page: 1,
    x: 465,
    y: 355,
    width: 70,
    height: 13
  },
  {
    name: 'childrenName7',
    type: 'text',
    page: 1,
    x: 330,
    y: 340,
    width: 135,
    height: 13
  },
  {
    name: 'dateOfBirthChild7',
    type: 'text',
    page: 1,
    x: 465,
    y: 340,
    width: 70,
    height: 13
  },
  {
    name: 'childrenName8',
    type: 'text',
    page: 1,
    x: 330,
    y: 328,
    width: 135,
    height: 13
  },
  {
    name: 'dateOfBirthChild8',
    type: 'text',
    page: 1,
    x: 465,
    y: 328,
    width: 70,
    height: 13
  },
  {
    name: 'childrenName9',
    type: 'text',
    page: 1,
    x: 330,
    y: 314,
    width: 135,
    height: 13
  },
  {
    name: 'dateOfBirthChild9',
    type: 'text',
    page: 1,
    x: 465,
    y: 314,
    width: 70,
    height: 13
  },
  {
    name: 'childrenName10',
    type: 'text',
    page: 1,
    x: 330,
    y: 300,
    width: 135,
    height: 13
  },
  {
    name: 'dateOfBirthChild10',
    type: 'text',
    page: 1,
    x: 465,
    y: 300,
    width: 70,
    height: 13
  },
  {
    name: 'childrenName11',
    type: 'text',
    page: 1,
    x: 330,
    y: 285,
    width: 135,
    height: 13
  },
  {
    name: 'dateOfBirthChild11',
    type: 'text',
    page: 1,
    x: 465,
    y: 285,
    width: 70,
    height: 13
  },
  {
    name: 'childrenName12',
    type: 'text',
    page: 1,
    x: 330,
    y: 273,
    width: 135,
    height: 13
  },
  {
    name: 'dateOfBirthChild12',
    type: 'text',
    page: 1,
    x: 465,
    y: 273,
    width: 70,
    height: 13
  },
  //EDUCATIONAL Background elementary
  {
    name: 'elementary',
    type: 'text',
    page: 1,
    x: 145,
    y: 198,
    width: 112,
    height: 18
  },
  {
    name: 'elementaryBasicEdu',
    type: 'text',
    page: 1,
    x: 260,
    y: 198,
    width: 104,
    height: 18
  },
  {
    name: 'elementaryFrom',
    type: 'text',
    page: 1,
    x: 365,
    y: 198,
    width: 28,
    height: 18
  },
  {
    name: 'elementaryTo',
    type: 'text',
    page: 1,
    x: 394,
    y: 198,
    width: 28,
    height: 18
  },
  {
    name: 'elementaryHighestLevel',
    type: 'text',
    page: 1,
    x: 424,
    y: 198,
    width: 40,
    height: 18
  },
  {
    name: 'elementaryYearGraduated',
    type: 'text',
    page: 1,
    x: 465,
    y: 198,
    width: 34,
    height: 18
  },
  {
    name: 'elementaryHonors',
    type: 'text',
    page: 1,
    x: 500,
    y: 198,
    width: 34,
    height: 18
  },
  //EDUCATIONAL Secondary
  {
    name: 'seconday',
    type: 'text',
    page: 1,
    x: 145,
    y: 178,
    width: 112,
    height: 18
  },
  {
    name: 'secondaryBasicEdu',
    type: 'text',
    page: 1,
    x: 260,
    y: 178,
    width: 104,
    height: 18
  },
  {
    name: 'secondaryFrom',
    type: 'text',
    page: 1,
    x: 365,
    y: 178,
    width: 28,
    height: 18
  },
  {
    name: 'secondaryTo',
    type: 'text',
    page: 1,
    x: 394,
    y: 178,
    width: 28,
    height: 18
  },
  {
    name: 'secondaryHighestLevel',
    type: 'text',
    page: 1,
    x: 424,
    y: 178,
    width: 40,
    height: 18
  },
  {
    name: 'secondaryYearGraduated',
    type: 'text',
    page: 1,
    x: 465,
    y: 178,
    width: 34,
    height: 18
  },
  {
    name: 'secondaryHonors',
    type: 'text',
    page: 1,
    x: 500,
    y: 178,
    width: 34,
    height: 18
  },
  // EDUCATIONAL Trade Course
  {
    name: 'vocational',
    type: 'text',
    page: 1,
    x: 145,
    y: 160,
    width: 112,
    height: 18
  },
  {
    name: 'vocationalBasicEdu',
    type: 'text',
    page: 1,
    x: 260,
    y: 160,
    width: 104,
    height: 18
  },
  {
    name: 'vocationalFrom',
    type: 'text',
    page: 1,
    x: 365,
    y: 160,
    width: 28,
    height: 18
  },
  {
    name: 'vocationalTo',
    type: 'text',
    page: 1,
    x: 394,
    y: 160,
    width: 28,
    height: 18
  },
  {
    name: 'vocationalHighestLevel',
    type: 'text',
    page: 1,
    x: 424,
    y: 160,
    width: 40,
    height: 18
  },
  {
    name: 'vocationalYearGraduated',
    type: 'text',
    page: 1,
    x: 465,
    y: 160,
    width: 34,
    height: 18
  },
  {
    name: 'vocationalHonors',
    type: 'text',
    page: 1,
    x: 500,
    y: 160,
    width: 34,
    height: 18
  },
  //EDUCATIONAL College
  {
    name: 'college',
    type: 'text',
    page: 1,
    x: 145,
    y: 140,
    width: 112,
    height: 18
  },
  {
    name: 'collegeBasicEdu',
    type: 'text',
    page: 1,
    x: 260,
    y: 140,
    width: 104,
    height: 18
  },
  {
    name: 'collegeFrom',
    type: 'text',
    page: 1,
    x: 365,
    y: 140,
    width: 28,
    height: 18
  },
  {
    name: 'collegeTo',
    type: 'text',
    page: 1,
    x: 394,
    y: 140,
    width: 28,
    height: 18
  },
  {
    name: 'collegeHighestLevel',
    type: 'text',
    page: 1,
    x: 424,
    y: 140,
    width: 40,
    height: 18
  },
  {
    name: 'collegeYearGraduated',
    type: 'text',
    page: 1,
    x: 465,
    y: 140,
    width: 34,
    height: 18
  },
  {
    name: 'collegeHonors',
    type: 'text',
    page: 1,
    x: 500,
    y: 140,
    width: 34,
    height: 18
  },
  //GRADUATE STUDIES
  {
    name: 'graduate',
    type: 'text',
    page: 1,
    x: 145,
    y: 122,
    width: 112,
    height: 18
  },
  {
    name: 'graduateBasicEdu',
    type: 'text',
    page: 1,
    x: 260,
    y: 122,
    width: 104,
    height: 18
  },
  {
    name: 'graduateFrom',
    type: 'text',
    page: 1,
    x: 365,
    y: 122,
    width: 28,
    height: 18
  },
  {
    name: 'graduateTo',
    type: 'text',
    page: 1,
    x: 394,
    y: 122,
    width: 28,
    height: 18
  },
  {
    name: 'graduateHighestLevel',
    type: 'text',
    page: 1,
    x: 424,
    y: 122,
    width: 40,
    height: 18
  },
  {
    name: 'graduateYearGraduated',
    type: 'text',
    page: 1,
    x: 465,
    y: 122,
    width: 34,
    height: 18
  },
  {
    name: 'graduateHonors',
    type: 'text',
    page: 1,
    x: 500,
    y: 122,
    width: 34,
    height: 18
  },
  //PAGE 1 DATE
  {
    name: 'date',
    type: 'text',
    page: 1,
    x: 423,
    y: 95,
    width: 110,
    height: 18
  },

  //PAGE 3 DATE
  {
    name: 'date2',
    type: 'text',
    page: 3,
    x: 418,
    y: 92,
    width: 116,
    height: 16
  },

  {
    name: 'q34a_yes',
    type: 'checkbox',
    page: 4,
    x: 365,
    y: 774,
    width: 10,
    height: 10
  },
  {
    name: 'q34a_no',
    type: 'checkbox',
    page: 4,
    x: 415,
    y: 774,
    width: 10,
    height: 10
  },
  {
    name: 'q34b_yes',
    type: 'checkbox',
    page: 4,
    x: 365,
    y: 762,
    width: 10,
    height: 10
  },
  {
    name: 'q34b_no',
    type: 'checkbox',
    page: 4,
    x: 415,
    y: 762,
    width: 10,
    height: 10
  }
  // {
  //   name: 'q34_details',
  //   type: 'textarea',
  //   page: 4,
  //   x: 350,
  //   y: 747,
  //   width: 225,
  //   height: 80
  // }

  // // Question 35
  // {
  //   name: 'q35a_yes',
  //   type: 'checkbox',
  //   page: 4,
  //   x: 257,
  //   y: 662,
  //   width: 10,
  //   height: 10
  // },
  // {
  //   name: 'q35a_no',
  //   type: 'checkbox',
  //   page: 4,
  //   x: 302,
  //   y: 662,
  //   width: 10,
  //   height: 10
  // },
  // {
  //   name: 'q35a_details',
  //   type: 'textarea',
  //   page: 4,
  //   x: 350,
  //   y: 662,
  //   width: 225,
  //   height: 22
  // },
  // {
  //   name: 'q35b_yes',
  //   type: 'checkbox',
  //   page: 4,
  //   x: 257,
  //   y: 627,
  //   width: 10,
  //   height: 10
  // },
  // {
  //   name: 'q35b_no',
  //   type: 'checkbox',
  //   page: 4,
  //   x: 302,
  //   y: 627,
  //   width: 10,
  //   height: 10
  // },
  // {
  //   name: 'q35b_details',
  //   type: 'textarea',
  //   page: 4,
  //   x: 350,
  //   y: 627,
  //   width: 225,
  //   height: 22
  // },
  // {
  //   name: 'q35b_date_filed',
  //   type: 'text',
  //   page: 4,
  //   x: 388,
  //   y: 601,
  //   width: 187,
  //   height: 14
  // },
  // {
  //   name: 'q35b_status',
  //   type: 'text',
  //   page: 4,
  //   x: 405,
  //   y: 586,
  //   width: 170,
  //   height: 14
  // },
  //
  // // Question 36
  // {
  //   name: 'q36_yes',
  //   type: 'checkbox',
  //   page: 4,
  //   x: 257,
  //   y: 556,
  //   width: 10,
  //   height: 10
  // },
  // {
  //   name: 'q36_no',
  //   type: 'checkbox',
  //   page: 4,
  //   x: 302,
  //   y: 556,
  //   width: 10,
  //   height: 10
  // },
  // {
  //   name: 'q36_details',
  //   type: 'textarea',
  //   page: 4,
  //   x: 350,
  //   y: 556,
  //   width: 225,
  //   height: 28
  // },
  //
  // // Question 37
  // {
  //   name: 'q37_yes',
  //   type: 'checkbox',
  //   page: 4,
  //   x: 257,
  //   y: 501,
  //   width: 10,
  //   height: 10
  // },
  // {
  //   name: 'q37_no',
  //   type: 'checkbox',
  //   page: 4,
  //   x: 302,
  //   y: 501,
  //   width: 10,
  //   height: 10
  // },
  // {
  //   name: 'q37_details',
  //   type: 'textarea',
  //   page: 4,
  //   x: 350,
  //   y: 501,
  //   width: 225,
  //   height: 35
  // },
  //
  // // Question 38
  // {
  //   name: 'q38a_yes',
  //   type: 'checkbox',
  //   page: 4,
  //   x: 257,
  //   y: 442,
  //   width: 10,
  //   height: 10
  // },
  // {
  //   name: 'q38a_no',
  //   type: 'checkbox',
  //   page: 4,
  //   x: 302,
  //   y: 442,
  //   width: 10,
  //   height: 10
  // },
  // {
  //   name: 'q38a_details',
  //   type: 'textarea',
  //   page: 4,
  //   x: 350,
  //   y: 442,
  //   width: 225,
  //   height: 22
  // },
  // {
  //   name: 'q38b_yes',
  //   type: 'checkbox',
  //   page: 4,
  //   x: 257,
  //   y: 392,
  //   width: 10,
  //   height: 10
  // },
  // {
  //   name: 'q38b_no',
  //   type: 'checkbox',
  //   page: 4,
  //   x: 302,
  //   y: 392,
  //   width: 10,
  //   height: 10
  // },
  // {
  //   name: 'q38b_details',
  //   type: 'textarea',
  //   page: 4,
  //   x: 350,
  //   y: 392,
  //   width: 225,
  //   height: 28
  // },
  //
  // // Question 39
  // {
  //   name: 'q39_yes',
  //   type: 'checkbox',
  //   page: 4,
  //   x: 257,
  //   y: 347,
  //   width: 10,
  //   height: 10
  // },
  // {
  //   name: 'q39_no',
  //   type: 'checkbox',
  //   page: 4,
  //   x: 302,
  //   y: 347,
  //   width: 10,
  //   height: 10
  // },
  // {
  //   name: 'q39_details',
  //   type: 'textarea',
  //   page: 4,
  //   x: 350,
  //   y: 347,
  //   width: 225,
  //   height: 22
  // },
  //
  // // Question 40
  // {
  //   name: 'q40a_yes',
  //   type: 'checkbox',
  //   page: 4,
  //   x: 257,
  //   y: 261,
  //   width: 10,
  //   height: 10
  // },
  // {
  //   name: 'q40a_no',
  //   type: 'checkbox',
  //   page: 4,
  //   x: 302,
  //   y: 261,
  //   width: 10,
  //   height: 10
  // },
  // {
  //   name: 'q40a_specify',
  //   type: 'text',
  //   page: 4,
  //   x: 405,
  //   y: 261,
  //   width: 170,
  //   height: 14
  // },
  // {
  //   name: 'q40b_yes',
  //   type: 'checkbox',
  //   page: 4,
  //   x: 257,
  //   y: 236,
  //   width: 10,
  //   height: 10
  // },
  // {
  //   name: 'q40b_no',
  //   type: 'checkbox',
  //   page: 4,
  //   x: 302,
  //   y: 236,
  //   width: 10,
  //   height: 10
  // },
  // {
  //   name: 'q40b_id_no',
  //   type: 'text',
  //   page: 4,
  //   x: 425,
  //   y: 236,
  //   width: 150,
  //   height: 14
  // },
  // {
  //   name: 'q40c_yes',
  //   type: 'checkbox',
  //   page: 4,
  //   x: 257,
  //   y: 211,
  //   width: 10,
  //   height: 10
  // },
  // {
  //   name: 'q40c_no',
  //   type: 'checkbox',
  //   page: 4,
  //   x: 302,
  //   y: 211,
  //   width: 10,
  //   height: 10
  // },
  // {
  //   name: 'q40c_id_no',
  //   type: 'text',
  //   page: 4,
  //   x: 425,
  //   y: 211,
  //   width: 150,
  //   height: 14
  // }
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
    x: number
    width: number
  }[]
}

// --- DYNAMIC FIELD TEMPLATE DEFINITIONS ---

export const eligibilityFieldTemplate: DynamicFieldTemplate = {
  page: 2,
  startY: 785,
  rowHeight: 18,
  columns: [
    { name: 'careerService', x: 68, width: 143 },
    { name: 'rating', x: 212, width: 50 },
    { name: 'dateOfExamination', x: 262, width: 52 },
    { name: 'placeOfExamination', x: 316, width: 138 },
    { name: 'licenseNumber', x: 455, width: 42 },
    { name: 'licenseDateOfValidity', x: 498, width: 30 }
  ]
}

export const workExperienceFieldTemplate: DynamicFieldTemplate = {
  page: 2,
  startY: 575,
  rowHeight: 16.5,
  columns: [
    { name: 'inclusiveDatesFrom', x: 68, width: 37 },
    { name: 'inclusiveDatesTo', x: 106, width: 37 },
    { name: 'positionTitle', x: 144, width: 118 },
    { name: 'department', x: 263, width: 120 },
    { name: 'monthlySalary', x: 385, width: 32 },
    { name: 'salaryGrade', x: 418, width: 35 },
    { name: 'statusOfAppointment', x: 455, width: 42 },
    { name: 'govtService', x: 498, width: 30 }
  ]
}

// NEW & CORRECTED: Template for Voluntary Work
export const voluntaryWorkFieldTemplate: DynamicFieldTemplate = {
  page: 3, // This section is on page 3
  startY: 775,
  rowHeight: 17.5,
  columns: [
    { name: 'nameAndAddress', x: 62, width: 205 },
    { name: 'inclusiveDateFrom', x: 268, width: 35 },
    { name: 'inclusiveDateTo', x: 305, width: 35 },
    { name: 'numberOfHours', x: 340, width: 35 },
    { name: 'position', x: 376, width: 158 }
  ]
}

export const learningAndDevelopmentFieldTemplate: DynamicFieldTemplate = {
  page: 3,
  startY: 590,
  rowHeight: 15.5,
  columns: [
    { name: 'title', x: 60, width: 205 },
    { name: 'inclusiveDatesFrom', x: 268, width: 34 },
    { name: 'inclusiveDatesTo', x: 305, width: 35 },
    { name: 'numberOfHours', x: 340, width: 35 },
    { name: 'typeOfLd', x: 375, width: 40 },
    { name: 'conductedBy', x: 416, width: 118 }
  ]
}

export const otherInformationFieldTemplate: DynamicFieldTemplate = {
  page: 3,
  startY: 224,
  rowHeight: 15.5,
  columns: [
    { name: 'specialSkills', x: 64, width: 116 },
    { name: 'nonAcademicDistrinction', x: 182, width: 232 },
    { name: 'membershipOrganization', x: 415, width: 120 }
  ]
}
