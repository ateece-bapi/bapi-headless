/**
 * BAPI Sales & Technical Team data
 *
 * Single source of truth for all team members shown on /contact and
 * individual /contact/[slug] pages. Photos live in /public/images/team/.
 *
 * slug      – headless URL segment: /contact/matt-holder
 *             The WordPress page slug is always "contact-{slug}"
 * wpSlug    – derived at runtime: `contact-${slug}` — do NOT store separately
 */

export interface TeamMember {
  slug: string;
  name: string;
  title: string;
  region: string;
  email: string;
  phone: string;
  photo: string;
  video?: string;
}

export const northAmericaTeam: TeamMember[] = [
  {
    slug: 'matt-holder',
    name: 'Matt Holder',
    title: 'Business Development & Regional Sales Manager',
    region: 'North America',
    email: 'mholder@bapihvac.com',
    phone: '+1-608-735-4800',
    photo: '/images/team/matt-holder.webp',
  },
  {
    slug: 'steve-lindquist',
    name: 'Steve Lindquist',
    title: 'Key Account Specialist',
    region: 'North America',
    email: 'slindquist@bapihvac.com',
    phone: '+1-800-553-3027',
    photo: '/images/team/steve-lindquist.webp',
  },
  {
    slug: 'todd-vanden-heuvel',
    name: 'Todd Vanden Heuvel',
    title: 'Key Account Specialist',
    region: 'North America',
    email: 'tvandenheuvel@bapihvac.com',
    phone: '+1-800-553-3027',
    photo: '/images/team/todd-vanden-heuvel.webp',
  },
  {
    slug: 'mitchell-ogorman',
    name: 'Mitchell Ogorman',
    title: 'Key Account Specialist',
    region: 'North America',
    email: 'mogorman@bapihvac.com',
    phone: '+1-800-553-3027',
    photo: '/images/team/mitchell-ogorman.webp',
  },
  {
    slug: 'jennifer-sanford',
    name: 'Jennifer Sanford',
    title: 'Key Account Specialist',
    region: 'North America',
    email: 'jsanford@bapihvac.com',
    phone: '+1-800-553-3027',
    photo: '/images/team/jennifer-sanford.webp',
  },
  {
    slug: 'jon-greenwald',
    name: 'Jon Greenwald',
    title: 'Distribution Accounts Leader',
    region: 'North America',
    email: 'jgreenwald@bapihvac.com',
    phone: '+1-800-553-3027',
    photo: '/images/team/jon-greenwald.webp',
    video: 'https://www.youtube.com/embed/iBeUe3OGrk4',
  },
  {
    slug: 'brian-thaldorf',
    name: 'Brian Thaldorf',
    title: 'Distribution Account Specialist',
    region: 'North America',
    email: 'bthaldorf@bapihvac.com',
    phone: '+1-800-553-3027',
    photo: '/images/team/brian-thaldorf.webp',
  },
  {
    slug: 'reggie-saucke',
    name: 'Reggie Saucke',
    title: 'HVAC Sensor Sales',
    region: 'North America',
    email: 'rsaucke@bapihvac.com',
    phone: '+1-800-553-3027',
    photo: '/images/team/reggie-saucke.webp',
  },
  {
    slug: 'jacob-benson',
    name: 'Jacob Benson',
    title: 'HVAC Sensor Sales',
    region: 'North America',
    email: 'jbenson@bapihvac.com',
    phone: '+1-800-553-3027',
    photo: '/images/team/jacob-benson.webp',
  },
];

export const ukTeam: TeamMember[] = [
  {
    slug: 'mike-moss',
    name: 'Mike Moss',
    title: 'Business Development & Regional Sales Manager',
    region: 'UK & Western Europe',
    email: 'mmoss@bapihvac.com',
    phone: '+1-800-553-3027',
    photo: '/images/team/mike-moss.webp',
  },
];

export const europeTeam: TeamMember[] = [
  {
    slug: 'jan-zurawski',
    name: 'Jan Zurawski',
    title: 'Regional Business Development & Operations Manager',
    region: 'Central & Eastern Europe',
    email: 'jzurawski@bapihvac.com',
    phone: '+1-800-553-3027',
    photo: '/images/team/jan-zurawski.webp',
    video: 'https://www.youtube.com/embed/O5jwFOFAO0A',
  },
];

export const middleEastTeam: TeamMember[] = [
  {
    slug: 'murtaza-kalabhai',
    name: 'Murtaza Kalabhai',
    title: 'Regional Sales Manager',
    region: 'Middle East & India',
    email: 'mkalabhai@bapihvac.com',
    phone: '+1-800-553-3027',
    photo: '/images/team/murtaza-kalabhai.webp',
  },
];

export const indiaTeam: TeamMember[] = [
  {
    slug: 'sharad-thakur',
    name: 'Sharad Thakur',
    title: 'North India Sales Manager',
    region: 'India',
    email: 'sharad@bapihvac.com',
    phone: '+1-800-553-3027',
    photo: '/images/team/sharad-thakur.webp',
  },
  {
    slug: 'shyam-krishnareddygari',
    name: 'Shyam Krishnareddygari',
    title: 'South India Sales Manager',
    region: 'India',
    email: 'shyam@bapihvac.com',
    phone: '+1-800-553-3027',
    photo: '/images/team/shyam-krishnareddygari.webp',
  },
];

export const southAmericaTeam: TeamMember[] = [
  {
    slug: 'john-shields',
    name: 'John Shields',
    title: 'Business Development & Regional Sales Manager',
    region: 'Africa, South America, Middle East, India, Scandinavia',
    email: 'jshields@bapihvac.com',
    phone: '+1-800-553-3027',
    photo: '/images/team/john-shields.webp',
  },
];

export const africaTeam: TeamMember[] = [
  {
    slug: 'john-shields',
    name: 'John Shields',
    title: 'Business Development & Regional Sales Manager',
    region: 'Africa, South America, Middle East, India, Scandinavia',
    email: 'jshields@bapihvac.com',
    phone: '+1-800-553-3027',
    photo: '/images/team/john-shields.webp',
  },
];

export const australiaTeam: TeamMember[] = [
  {
    slug: 'andy-brooks',
    name: 'Andy Brooks',
    title: 'Business Development & Regional Sales Manager',
    region: 'Asia, Australia & Pacific',
    email: 'abrooks@bapihvac.com',
    phone: '+1-800-553-3027',
    photo: '/images/team/andy-brooks.webp',
  },
];

export const technicalTeam: TeamMember[] = [
  {
    slug: 'jonathan-hillebrand',
    name: 'Jonathan Hillebrand',
    title: 'Senior Product Manager',
    region: 'Technical Support',
    email: 'jhillebrand@bapihvac.com',
    phone: '+1-800-553-3027',
    photo: '/images/team/jonathan-hillebrand.webp',
  },
  {
    slug: 'don-clark',
    name: 'Don Clark',
    title: 'RMA & Technical Service Manager',
    region: 'Technical Support',
    email: 'dclark@bapihvac.com',
    phone: '+1-800-553-3027',
    photo: '/images/team/donald-clark.webp',
  },
];

/** All team members with a WordPress contact page — used for generateStaticParams.
 * Built from all regional arrays and deduplicated by slug so adding a rep to any
 * group is sufficient — no manual maintenance of this list required.
 */
export const ALL_TEAM_MEMBERS: TeamMember[] = Array.from(
  new Map(
    [
      ...northAmericaTeam,
      ...ukTeam,
      ...europeTeam,
      ...middleEastTeam,
      ...indiaTeam,
      ...southAmericaTeam,
      ...africaTeam,
      ...australiaTeam,
      ...technicalTeam,
    ].map((m) => [m.slug, m]),
  ).values(),
);
