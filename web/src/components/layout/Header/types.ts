export interface NavLink {
  href: string;
  label: string;
}

export interface MegaMenuLink {
  label: string;
  href: string;
  description?: string;
  badge?: string;
}

export interface MegaMenuColumn {
  title: string;
  slug: string; // Stable URL slug (not translated, e.g., 'temperature')
  icon?: React.ComponentType<{ className?: string }> | string; // Support both React components and image paths
  links: MegaMenuLink[];
}

export interface MegaMenuFeatured {
  title: string;
  description: string;
  href: string;
  cta: string;
  badge?: string;
}

export interface MegaMenuItem {
  label: string;
  href?: string;
  megaMenu?: {
    columns: MegaMenuColumn[];
    featured?: MegaMenuFeatured;
  };
}

export interface HeaderProps {
  className?: string;
}
