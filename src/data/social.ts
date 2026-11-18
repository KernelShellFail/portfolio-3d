export interface SocialProfile {
  id: string;
  platform: 'Email' | 'GitHub' | 'LinkedIn' | 'Portfolio';
  label: string;
  handleDisplay: string;
  href: string | null;
  isPlaceholder: boolean;
  note: string;
}

/**
 * Editable contact and social profiles.
 * Note: Replace placeholder entries in src/data/social.ts with your real
 * email address, GitHub URL, and LinkedIn profile URL.
 */
export const socialData: SocialProfile[] = [
  {
    id: 'email',
    platform: 'Email',
    label: 'Direct Email',
    handleDisplay: 'basiturraza.taji@example.com (Placeholder)',
    href: null,
    isPlaceholder: true,
    note: 'Replace with your personal email in src/data/social.ts',
  },
  {
    id: 'github',
    platform: 'GitHub',
    label: 'GitHub Profile',
    handleDisplay: 'github.com/your-handle (Placeholder)',
    href: null,
    isPlaceholder: true,
    note: 'Add your real GitHub profile URL in src/data/social.ts',
  },
  {
    id: 'linkedin',
    platform: 'LinkedIn',
    label: 'LinkedIn Profile',
    handleDisplay: 'linkedin.com/in/your-handle (Placeholder)',
    href: null,
    isPlaceholder: true,
    note: 'Add your real LinkedIn profile URL in src/data/social.ts',
  },
];
