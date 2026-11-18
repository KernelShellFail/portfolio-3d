export interface EducationRecord {
  id: string;
  degree: string;
  institution: string;
  university: string;
  graduationYear: string;
  status: string;
  summary: string;
  keySubjects: string[];
}

export const educationData: EducationRecord[] = [
  {
    id: 'rtmnu-bca-2026',
    degree: 'Bachelor of Computer Applications (BCA)',
    institution: 'RTMNU Affiliated Degree Program',
    university: 'Rashtrasant Tukadoji Maharaj Nagpur University (RTMNU)',
    graduationYear: '2026',
    status: 'Fresh Graduate',
    summary:
      'Three-year undergraduate computer applications degree covering software engineering, web development, database systems, and programming languages.',
    keySubjects: [
      'Data Structures & Algorithms',
      'Database Management Systems',
      'Web Technologies',
      'Object-Oriented Programming',
      'Operating Systems & Networking',
    ],
  },
];
