export interface SpeechBubbleLine {
  id: string;
  speaker: string;
  text: string;
  annotation: string;
}

export interface PersonalProfile {
  name: string;
  shortBrand: string;
  title: string;
  status: string;
  location: string;
  portraitUrl: string;
  portraitAlt: string;
  heroSummary: string;
  introHeading: string;
  introSubheading: string;
  biography: string[];
  background: string;
  interests: string[];
  careerGoals: string;
  speechBubbles: SpeechBubbleLine[];
}

export const personalData: PersonalProfile = {
  name: 'Basiturraza Taji',
  shortBrand: 'Basiturraza Taji',
  title: 'Software Developer',
  status: 'Fresh Graduate',
  location: 'Nagpur, India',
  portraitUrl: '/src/assets/images/hero_developer_portrait_1794977553857.jpg',
  portraitAlt:
    'Original anime manga style illustration of software developer Basiturraza Taji beside a sunlit classroom window surrounded by floating paper talismans',
  heroSummary:
    'Bachelor of Computer Applications (BCA) graduate from RTMNU (2026), crafting interactive web applications, 3D browser environments, and clean full-stack software.',
  introHeading: 'Seventh Period: The Developer Chronicle',
  introSubheading:
    'Step down the twilight corridor to explore the software craft, skills, and manga-inspired chapters of Basiturraza Taji.',
  biography: [
    'I am Basiturraza Taji, a fresh Bachelor of Computer Applications (BCA) graduate from Rashtrasant Tukadoji Maharaj Nagpur University (RTMNU), Class of 2026.',
    'My work sits at the intersection of structured software engineering and expressive visual storytelling—turning everyday web interfaces into memorable, responsive experiences without sacrificing code clarity or accessibility.',
    '[Placeholder Bio Note: Replace or expand this paragraph in src/data/personal.ts with your favorite personal story or core engineering philosophy.]',
  ],
  background:
    'Completed undergraduate studies in Computer Applications at RTMNU (2026), building foundational fluency across web frontend architecture, object-oriented programming, relational databases, and interactive browser graphics.',
  interests: [
    'Interactive 3D Web Graphics & Shaders',
    'Frontend Architecture & Design Systems',
    'Japanese Manga Visual Storytelling',
    'Full-Stack TypeScript Engineering',
  ],
  careerGoals:
    'Seeking an entry-level Software Developer or Frontend Engineer role where I can contribute to production web applications, deepen my backend and systems craft, and collaborate with thoughtful product teams.',
  speechBubbles: [
    {
      id: 'greeting',
      speaker: 'Note 01',
      text: 'Welcome to my portfolio! Click the floating paper charms in the hallway or jump straight to the chapters.',
      annotation: 'BCA Graduate · RTMNU 2026',
    },
    {
      id: 'craft',
      speaker: 'Note 02',
      text: 'Every project here is structured like a manga episode—crafted with TypeScript, React, and real Three.js scenes.',
      annotation: 'Interactive Craft',
    },
    {
      id: 'status',
      speaker: 'Note 03',
      text: 'Fresh graduate ready for software engineering opportunities, internships, and collaborative builds.',
      annotation: 'Open to Roles',
    },
  ],
};
