import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import Image from 'next/image';
import {
  // Navigation
  MenuIcon,
  XIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  ArrowUpIcon,
  ExternalLinkIcon,
  HomeIcon,
  // Actions
  PlusIcon,
  MinusIcon,
  CheckIcon,
  ShoppingCartIcon,
  HeartIcon,
  GitCompareIcon,
  Share2Icon,
  DownloadIcon,
  Trash2Icon,
  ZoomInIcon,
  ZoomOutIcon,
  RotateCwIcon,
  PrinterIcon,
  SendIcon,
  PlayIcon,
  SearchIcon,
  FilterIcon,
  // Status/Feedback
  CheckCircleIcon,
  AlertCircleIcon,
  XCircleIcon,
  InfoIcon,
  AlertTriangleIcon,
  Loader2Icon,
  ClockIcon,
  HistoryIcon,
  // Forms
  MailIcon,
  PhoneIcon,
  UserIcon,
  UserCircleIcon,
  MapPinIcon,
  CreditCardIcon,
  BanknoteIcon,
  LockIcon,
  LogOutIcon,
  SettingsIcon,
  CommandIcon,
  // Products
  PackageIcon,
  TagIcon,
  DollarSignIcon,
  FileTextIcon,
  Grid3x3Icon,
  ListIcon,
  SortAscIcon,
  SlidersHorizontalIcon,
  BookOpenIcon,
  BookIcon,
  FileSpreadsheetIcon,
  ClipboardListIcon,
  FileIcon,
  HardDriveIcon,
  // BAPI Product Categories (Material UI)
  ThermometerIcon,
  DropletsIcon,
  DropletIcon,
  GaugeIcon,
  WindIcon,
  WavesIcon,
  RadioIcon,
  WifiIcon,
  CableIcon,
  FlaskConicalIcon,
  // Industry
  Building2Icon,
  BriefcaseIcon,
  TruckIcon,
  HeartPulseIcon,
  SproutIcon,
  UtensilsCrossedIcon,
  BeefIcon,
  SnowflakeIcon,
  // Tech/System
  CloudIcon,
  SmartphoneIcon,
  BellIcon,
  LineChartIcon,
  TrendingUpIcon,
  ShieldIcon,
  ZapIcon,
  AwardIcon,
  LanguagesIcon,
  GlobeIcon,
  // Social
  MessageCircleIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
  LinkedinIcon,
  YoutubeIcon,
} from '@/lib/icons';

const meta: Meta = {
  title: 'Design System/Icons',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Complete catalog of lucide-react icons used in BAPI Headless. All icons are from the lucide-react library with consistent stroke width (2px) and sizing.',
      },
    },
  },
  tags: ['autodocs', 'skip-a11y'], // Icon gallery is for reference, not a functional component
};

export default meta;
type Story = StoryObj;

// Icon registry organized by category
const icons = {
  Navigation: [
    { name: 'Menu', icon: MenuIcon, usage: 'Mobile menu toggle' },
    { name: 'X', icon: XIcon, usage: 'Close buttons, remove items' },
    { name: 'ChevronDown', icon: ChevronDownIcon, usage: 'Dropdown indicators' },
    { name: 'ChevronUp', icon: ChevronUpIcon, usage: 'Collapse indicators' },
    { name: 'ChevronLeft', icon: ChevronLeftIcon, usage: 'Previous navigation' },
    { name: 'ChevronRight', icon: ChevronRightIcon, usage: 'Next navigation' },
    { name: 'ArrowRight', icon: ArrowRightIcon, usage: 'Call-to-action arrows' },
    { name: 'ArrowLeft', icon: ArrowLeftIcon, usage: 'Back navigation' },
    { name: 'ArrowUp', icon: ArrowUpIcon, usage: 'Back to top button' },
    { name: 'ExternalLink', icon: ExternalLinkIcon, usage: 'External links' },
    { name: 'Home', icon: HomeIcon, usage: 'Home/dashboard link' },
  ],
  Actions: [
    { name: 'Plus', icon: PlusIcon, usage: 'Add item, increase quantity' },
    { name: 'Minus', icon: MinusIcon, usage: 'Remove item, decrease quantity' },
    { name: 'Check', icon: CheckIcon, usage: 'Confirmation, selection indicator' },
    { name: 'ShoppingCart', icon: ShoppingCartIcon, usage: 'Cart button, checkout' },
    { name: 'Heart', icon: HeartIcon, usage: 'Favorite/wishlist toggle' },
    { name: 'GitCompare', icon: GitCompareIcon, usage: 'Product comparison' },
    { name: 'Share2', icon: Share2Icon, usage: 'Share content' },
    { name: 'Download', icon: DownloadIcon, usage: 'Download resources' },
    { name: 'Trash2', icon: Trash2Icon, usage: 'Delete actions' },
    { name: 'ZoomIn', icon: ZoomInIcon, usage: 'Image zoom in' },
    { name: 'ZoomOut', icon: ZoomOutIcon, usage: 'Image zoom out' },
    { name: 'RotateCw', icon: RotateCwIcon, usage: 'Rotate image' },
    { name: 'Printer', icon: PrinterIcon, usage: 'Print actions' },
    { name: 'Send', icon: SendIcon, usage: 'Submit chat/forms' },
    { name: 'Play', icon: PlayIcon, usage: 'Video play buttons' },
    { name: 'Search', icon: SearchIcon, usage: 'Search inputs' },
    { name: 'Filter', icon: FilterIcon, usage: 'Filter controls' },
  ],
  Status: [
    { name: 'CheckCircle', icon: CheckCircleIcon, usage: 'Success states' },
    { name: 'AlertCircle', icon: AlertCircleIcon, usage: 'Warning states' },
    { name: 'XCircle', icon: XCircleIcon, usage: 'Error states' },
    { name: 'Info', icon: InfoIcon, usage: 'Information tooltips' },
    { name: 'AlertTriangle', icon: AlertTriangleIcon, usage: 'Critical warnings' },
    { name: 'Loader2', icon: Loader2Icon, usage: 'Loading spinners' },
    { name: 'Clock', icon: ClockIcon, usage: 'Pending/scheduled' },
    { name: 'History', icon: HistoryIcon, usage: 'Recently viewed' },
  ],
  Forms: [
    { name: 'Mail', icon: MailIcon, usage: 'Email inputs' },
    { name: 'Phone', icon: PhoneIcon, usage: 'Phone inputs' },
    { name: 'User', icon: UserIcon, usage: 'User profile icon' },
    { name: 'UserCircle', icon: UserCircleIcon, usage: 'User avatar' },
    { name: 'MapPin', icon: MapPinIcon, usage: 'Address/location' },
    { name: 'CreditCard', icon: CreditCardIcon, usage: 'Payment methods' },
    { name: 'Banknote', icon: BanknoteIcon, usage: 'Purchase order payment' },
    { name: 'Lock', icon: LockIcon, usage: 'Secure/password fields' },
    { name: 'LogOut', icon: LogOutIcon, usage: 'Sign out button' },
    { name: 'Settings', icon: SettingsIcon, usage: 'Settings/preferences' },
    { name: 'Command', icon: CommandIcon, usage: 'Keyboard shortcuts' },
  ],
  Products: [
    { name: 'Package', icon: PackageIcon, usage: 'Products, orders' },
    { name: 'Tag', icon: TagIcon, usage: 'Pricing, discounts' },
    { name: 'DollarSign', icon: DollarSignIcon, usage: 'Pricing display' },
    { name: 'FileText', icon: FileTextIcon, usage: 'Documents, specs' },
    { name: 'Grid3x3', icon: Grid3x3Icon, usage: 'Grid view toggle' },
    { name: 'List', icon: ListIcon, usage: 'List view toggle' },
    { name: 'SortAsc', icon: SortAscIcon, usage: 'Sort controls' },
    { name: 'SlidersHorizontal', icon: SlidersHorizontalIcon, usage: 'Filter drawer' },
    { name: 'BookOpen', icon: BookOpenIcon, usage: 'Application notes' },
    { name: 'Book', icon: BookIcon, usage: 'Documentation' },
    { name: 'FileSpreadsheet', icon: FileSpreadsheetIcon, usage: 'Spreadsheets' },
    { name: 'ClipboardList', icon: ClipboardListIcon, usage: 'Order lists' },
    { name: 'File', icon: FileIcon, usage: 'Generic files' },
    { name: 'HardDrive', icon: HardDriveIcon, usage: 'Resources' },
  ],
  'BAPI Categories': [
    { name: 'Thermometer', icon: ThermometerIcon, usage: 'Temperature sensors' },
    { name: 'Droplets', icon: DropletsIcon, usage: 'Humidity sensors' },
    { name: 'Droplet', icon: DropletIcon, usage: 'Humidity (alt)' },
    { name: 'Gauge', icon: GaugeIcon, usage: 'Pressure sensors' },
    { name: 'Wind', icon: WindIcon, usage: 'Air quality sensors' },
    { name: 'Waves', icon: WavesIcon, usage: 'Air flow sensors' },
    { name: 'Radio', icon: RadioIcon, usage: 'Wireless sensors' },
    { name: 'Wifi', icon: WifiIcon, usage: 'WiFi connectivity' },
    { name: 'Cable', icon: CableIcon, usage: 'Wired accessories' },
  ],
  Industry: [
    { name: 'Building2', icon: Building2Icon, usage: 'Buildings, companies' },
    { name: 'Briefcase', icon: BriefcaseIcon, usage: 'Business, jobs' },
    { name: 'Truck', icon: TruckIcon, usage: 'Shipping, logistics' },
    { name: 'HeartPulse', icon: HeartPulseIcon, usage: 'Healthcare industry' },
    { name: 'Sprout', icon: SproutIcon, usage: 'Agriculture/grow rooms' },
    { name: 'UtensilsCrossed', icon: UtensilsCrossedIcon, usage: 'Restaurants' },
    { name: 'Beef', icon: BeefIcon, usage: 'Food processing' },
    { name: 'Snowflake', icon: SnowflakeIcon, usage: 'Refrigeration/cold chain' },
  ],
  System: [
    { name: 'Cloud', icon: CloudIcon, usage: 'Cloud services' },
    { name: 'Smartphone', icon: SmartphoneIcon, usage: 'Mobile apps' },
    { name: 'Bell', icon: BellIcon, usage: 'Notifications/alerts' },
    { name: 'LineChart', icon: LineChartIcon, usage: 'Analytics/graphs' },
    { name: 'TrendingUp', icon: TrendingUpIcon, usage: 'Growth/trends' },
    { name: 'Shield', icon: ShieldIcon, usage: 'Security/protection' },
    { name: 'Zap', icon: ZapIcon, usage: 'Performance/speed' },
    { name: 'Award', icon: AwardIcon, usage: 'Achievements' },
    { name: 'Languages', icon: LanguagesIcon, usage: 'Language selector' },
    { name: 'Globe', icon: GlobeIcon, usage: 'Region selector' },
  ],
  Social: [
    { name: 'MessageCircle', icon: MessageCircleIcon, usage: 'Chat/messages' },
    { name: 'ThumbsUp', icon: ThumbsUpIcon, usage: 'Like/helpful' },
    { name: 'ThumbsDown', icon: ThumbsDownIcon, usage: 'Dislike/not helpful' },
    { name: 'Linkedin', icon: LinkedinIcon, usage: 'LinkedIn social link' },
    { name: 'Youtube', icon: YoutubeIcon, usage: 'YouTube social link' },
  ],
};

// Helper component for displaying an icon with details
interface IconDisplayProps {
  name: string;
  Icon: React.ElementType;
  size?: number;
  color?: string;
  showCode?: boolean;
  showUsage?: boolean;
  usage?: string;
}

const IconDisplay = ({
  name,
  Icon,
  size = 24,
  color = 'currentColor',
  showCode = false,
  showUsage = false,
  usage = '',
}: IconDisplayProps) => {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(`import { ${name} } from '@/lib/icons';`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // Swallow clipboard errors in Storybook to avoid noisy unhandled rejections
      // eslint-disable-next-line no-console
      console.error('Failed to copy icon import to clipboard:', error);
    }
  };

  return (
    <div className="group relative flex flex-col items-center gap-2 rounded-lg border border-neutral-200 p-4 transition-all hover:border-primary-500 hover:bg-neutral-50">
      <Icon sx={{ fontSize: size }} />
      <span className="text-xs font-medium text-neutral-700">{name}</span>
      {showUsage && usage && (
        <span className="text-center text-[10px] text-neutral-700">{usage}</span>
      )}
      {showCode && (
        <button
          onClick={copyCode}
          className="mt-1 rounded bg-neutral-900 px-2 py-1 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100"
          type="button"
        >
          {copied ? 'Copied!' : 'Copy import'}
        </button>
      )}
    </div>
  );
};

// Main story: Complete catalog with search
export const AllIcons: Story = {
  render: () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    const categories = ['All', ...Object.keys(icons)];

    const filteredIcons = Object.entries(icons).reduce(
      (acc, [category, categoryIcons]) => {
        if (selectedCategory !== 'All' && category !== selectedCategory) {
          return acc;
        }

        const filtered = categoryIcons.filter(
          ({ name, usage }) =>
            name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            usage.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (filtered.length > 0) {
          acc.push({ category, icons: filtered });
        }

        return acc;
      },
      [] as Array<{ category: string; icons: typeof icons.Navigation }>
    );

    const totalCount = filteredIcons.reduce((sum, cat) => sum + cat.icons.length, 0);

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-neutral-950">Icon Library</h1>
          <p className="text-lg text-neutral-700">
            {Object.values(icons).reduce((sum, cat) => sum + cat.length, 0)} lucide-react icons used
            across BAPI Headless
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search icons by name or usage..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 py-2 pl-10 pr-4 focus:border-primary-500 focus:outline-none"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-lg border border-neutral-300 px-4 py-2 focus:border-primary-500 focus:outline-none"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Results count */}
        <p className="text-sm text-neutral-700">
          Showing {totalCount} icon{totalCount !== 1 ? 's' : ''}
        </p>

        {/* Icon Grid */}
        {filteredIcons.length > 0 ? (
          <div className="space-y-8">
            {filteredIcons.map(({ category, icons: categoryIcons }) => (
              <div key={category}>
                <h2 className="mb-4 text-2xl font-semibold text-neutral-950">{category}</h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {categoryIcons.map(({ name, icon: Icon, usage }) => (
                    <IconDisplay
                      key={name}
                      name={name}
                      Icon={Icon}
                      showCode
                      showUsage
                      usage={usage}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 py-12">
            <SearchIcon className="mb-2 h-12 w-12 text-neutral-400" />
            <p className="text-neutral-700">No icons found matching "{searchQuery}"</p>
          </div>
        )}

        {/* Usage Guidelines */}
        <div className="mt-12 rounded-lg bg-neutral-100 p-6">
          <h3 className="mb-4 text-xl font-semibold text-neutral-950">Usage Guidelines</h3>
          <ul className="space-y-2 text-sm text-neutral-700">
            <li>
              <strong>Default size:</strong> 24px (use <code>size={'{24}'}</code> prop)
            </li>
            <li>
              <strong>Stroke width:</strong> 2px (consistent across all icons)
            </li>
            <li>
              <strong>Color:</strong> Use semantic color tokens (
              <code>className="text-primary-500"</code>)
            </li>
            <li>
              <strong>Accessibility:</strong> Provide <code>aria-label</code> for icon-only buttons
            </li>
            <li>
              <strong>Import:</strong> <code>import {'{ IconName }'} from '@/lib/icons';</code>
            </li>
          </ul>
        </div>
      </div>
    );
  },
};

// Story: Size variants
export const SizeVariants: Story = {
  render: () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-neutral-950">Icon Sizes</h2>
      <p className="text-neutral-700">
        Standard icon sizes used across BAPI Headless based on context
      </p>

      <div className="space-y-8">
        {/* Small - 16px */}
        <div>
          <h3 className="mb-4 text-xl font-semibold text-neutral-950">Small (16px)</h3>
          <p className="mb-4 text-sm text-neutral-700">
            Used for: Inline text icons, badges, compact UI elements
          </p>
          <div className="flex items-center gap-6 rounded-lg border border-neutral-200 p-6">
            <ShoppingCartIcon fontSize="small" />
            <CheckIcon fontSize="small" />
            <InfoIcon fontSize="small" />
            <ArrowRightIcon fontSize="small" />
            <PackageIcon fontSize="small" />
          </div>
          <pre className="mt-2 rounded bg-neutral-900 p-3 text-sm text-white">
            &lt;ShoppingCart size={'{16}'} /&gt;
          </pre>
        </div>

        {/* Medium - 24px (default) */}
        <div>
          <h3 className="mb-4 text-xl font-semibold text-neutral-950">Medium (24px) - Default</h3>
          <p className="mb-4 text-sm text-neutral-700">
            Used for: Buttons, navigation, form fields, most UI elements
          </p>
          <div className="flex items-center gap-6 rounded-lg border border-neutral-200 p-6">
            <ShoppingCartIcon fontSize="medium" />
            <CheckIcon fontSize="medium" />
            <InfoIcon fontSize="medium" />
            <ArrowRightIcon fontSize="medium" />
            <PackageIcon fontSize="medium" />
          </div>
          <pre className="mt-2 rounded bg-neutral-900 p-3 text-sm text-white">
            &lt;ShoppingCart size={'{24}'} /&gt; {'//'} or &lt;ShoppingCart /&gt;
          </pre>
        </div>

        {/* Large - 32px */}
        <div>
          <h3 className="mb-4 text-xl font-semibold text-neutral-950">Large (32px)</h3>
          <p className="mb-4 text-sm text-neutral-700">
            Used for: Hero sections, feature cards, prominent CTAs
          </p>
          <div className="flex items-center gap-6 rounded-lg border border-neutral-200 p-6">
            <ShoppingCartIcon fontSize="large" />
            <CheckIcon fontSize="large" />
            <InfoIcon fontSize="large" />
            <ArrowRightIcon fontSize="large" />
            <PackageIcon fontSize="large" />
          </div>
          <pre className="mt-2 rounded bg-neutral-900 p-3 text-sm text-white">
            &lt;ShoppingCart size={'{32}'} /&gt;
          </pre>
        </div>

        {/* Extra Large - 48px */}
        <div>
          <h3 className="mb-4 text-xl font-semibold text-neutral-950">Extra Large (48px)</h3>
          <p className="mb-4 text-sm text-neutral-700">
            Used for: Empty states, large feature displays, marketing sections
          </p>
          <div className="flex items-center gap-6 rounded-lg border border-neutral-200 p-6">
            <ShoppingCartIcon sx={{ fontSize: 48 }} />
            <CheckIcon sx={{ fontSize: 48 }} />
            <InfoIcon sx={{ fontSize: 48 }} />
            <ArrowRightIcon sx={{ fontSize: 48 }} />
            <PackageIcon sx={{ fontSize: 48 }} />
          </div>
          <pre className="mt-2 rounded bg-neutral-900 p-3 text-sm text-white">
            &lt;ShoppingCart size={'{48}'} /&gt;
          </pre>
        </div>
      </div>
    </div>
  ),
};

// Story: Color variants
export const ColorVariants: Story = {
  render: () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-neutral-950">Icon Colors</h2>
      <p className="text-neutral-700">
        Use semantic color tokens from BAPI color system for consistent icon coloring
      </p>

      <div className="space-y-8">
        {/* Primary Blue */}
        <div>
          <h3 className="mb-4 text-xl font-semibold text-neutral-950">Primary (BAPI Blue)</h3>
          <div className="flex items-center gap-6 rounded-lg border border-neutral-200 bg-white p-6">
            <ShoppingCartIcon className="text-primary-500" fontSize="large" />
            <CheckCircleIcon className="text-primary-500" fontSize="large" />
            <PackageIcon className="text-primary-500" fontSize="large" />
            <ThermometerIcon className="text-primary-500" fontSize="large" />
          </div>
          <pre className="mt-2 rounded bg-neutral-900 p-3 text-sm text-white">
            &lt;ShoppingCart className="text-primary-500" /&gt;
          </pre>
        </div>

        {/* Accent Yellow */}
        <div>
          <h3 className="mb-4 text-xl font-semibold text-neutral-950">Accent (BAPI Yellow)</h3>
          <div className="flex items-center gap-6 rounded-lg border border-neutral-200 bg-white p-6">
            <AlertTriangleIcon className="text-accent-500" fontSize="large" />
            <BellIcon className="text-accent-500" fontSize="large" />
            <AwardIcon className="text-accent-500" fontSize="large" />
            <ZapIcon className="text-accent-500" fontSize="large" />
          </div>
          <pre className="mt-2 rounded bg-neutral-900 p-3 text-sm text-white">
            &lt;AlertTriangle className="text-accent-500" /&gt;
          </pre>
        </div>

        {/* Success Green */}
        <div>
          <h3 className="mb-4 text-xl font-semibold text-neutral-950">Success</h3>
          <div className="flex items-center gap-6 rounded-lg border border-neutral-200 bg-white p-6">
            <CheckCircleIcon className="text-success-500" fontSize="large" />
            <CheckIcon className="text-success-500" fontSize="large" />
            <ThumbsUpIcon className="text-success-500" fontSize="large" />
            <ShieldIcon className="text-success-500" fontSize="large" />
          </div>
          <pre className="mt-2 rounded bg-neutral-900 p-3 text-sm text-white">
            &lt;CheckCircle className="text-success-500" /&gt;
          </pre>
        </div>

        {/* Warning Orange */}
        <div>
          <h3 className="mb-4 text-xl font-semibold text-neutral-950">Warning</h3>
          <div className="flex items-center gap-6 rounded-lg border border-neutral-200 bg-white p-6">
            <AlertCircleIcon className="text-warning-500" fontSize="large" />
            <AlertTriangleIcon className="text-warning-500" fontSize="large" />
            <ClockIcon className="text-warning-500" fontSize="large" />
            <InfoIcon className="text-warning-500" fontSize="large" />
          </div>
          <pre className="mt-2 rounded bg-neutral-900 p-3 text-sm text-white">
            &lt;AlertCircle className="text-warning-500" /&gt;
          </pre>
        </div>

        {/* Error Red */}
        <div>
          <h3 className="mb-4 text-xl font-semibold text-neutral-950">Error</h3>
          <div className="flex items-center gap-6 rounded-lg border border-neutral-200 bg-white p-6">
            <XCircleIcon className="text-error-500" fontSize="large" />
            <XIcon className="text-error-500" fontSize="large" />
            <AlertTriangleIcon className="text-error-500" fontSize="large" />
            <Trash2Icon className="text-error-500" fontSize="large" />
          </div>
          <pre className="mt-2 rounded bg-neutral-900 p-3 text-sm text-white">
            &lt;XCircle className="text-error-500" /&gt;
          </pre>
        </div>

        {/* Neutral Gray */}
        <div>
          <h3 className="mb-4 text-xl font-semibold text-neutral-950">Neutral</h3>
          <div className="flex items-center gap-6 rounded-lg border border-neutral-200 bg-white p-6">
            <SettingsIcon className="text-neutral-700" fontSize="large" />
            <FilterIcon className="text-neutral-700" fontSize="large" />
            <SearchIcon className="text-neutral-700" fontSize="large" />
            <MenuIcon className="text-neutral-700" fontSize="large" />
          </div>
          <pre className="mt-2 rounded bg-neutral-900 p-3 text-sm text-white">
            &lt;Settings className="text-neutral-700" /&gt;
          </pre>
        </div>

        {/* White on Dark */}
        <div>
          <h3 className="mb-4 text-xl font-semibold text-neutral-950">White on Dark</h3>
          <div className="flex items-center gap-6 rounded-lg bg-neutral-900 p-6">
            <ShoppingCartIcon className="text-white" fontSize="large" />
            <PackageIcon className="text-white" fontSize="large" />
            <HeartIcon className="text-white" fontSize="large" />
            <UserIcon className="text-white" fontSize="large" />
          </div>
          <pre className="mt-2 rounded bg-neutral-900 p-3 text-sm text-white">
            &lt;ShoppingCart className="text-white" /&gt;
          </pre>
        </div>
      </div>
    </div>
  ),
};

// Story: Common use cases
export const CommonUseCases: Story = {
  render: () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-neutral-950">Common Use Cases</h2>
      <p className="text-neutral-700">Real-world examples of icon usage across BAPI Headless</p>

      <div className="space-y-8">
        {/* Cart Button with Badge */}
        <div>
          <h3 className="mb-4 text-xl font-semibold text-neutral-950">Cart Button with Badge</h3>
          <div className="rounded-lg border border-neutral-200 p-6">
            <button
              type="button"
              className="relative inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-white hover:bg-primary-600"
            >
              <ShoppingCartIcon fontSize="small" />
              <span>Cart</span>
              <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-accent-500 text-xs font-bold text-neutral-900">
                3
              </span>
            </button>
          </div>
          <pre className="mt-2 rounded bg-neutral-900 p-3 text-sm text-white">
            {`<button className="relative...">
  <ShoppingCartIcon fontSize="small" />
  <span>Cart</span>
  <span className="absolute -right-2 -top-2...">3</span>
</button>`}
          </pre>
        </div>

        {/* Loading Button */}
        <div>
          <h3 className="mb-4 text-xl font-semibold text-neutral-950">Loading State</h3>
          <div className="rounded-lg border border-neutral-200 p-6">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-white opacity-75"
              disabled
            >
              <Loader2Icon fontSize="small" className="animate-spin" />
              <span>Adding to Cart...</span>
            </button>
          </div>
          <pre className="mt-2 rounded bg-neutral-900 p-3 text-sm text-white">
            {`<button disabled className="...opacity-75">
  <Loader2Icon fontSize="small" className="animate-spin" />
  <span>Adding to Cart...</span>
</button>`}
          </pre>
        </div>

        {/* Success Notification */}
        <div>
          <h3 className="mb-4 text-xl font-semibold text-neutral-950">Success Notification</h3>
          <div className="rounded-lg border border-neutral-200 p-6">
            <div className="flex items-center gap-3 rounded-lg bg-success-50 p-4">
              <CheckCircleIcon className="text-success-500" fontSize="medium" />
              <span className="text-success-700">Product added to cart successfully!</span>
            </div>
          </div>
          <pre className="mt-2 rounded bg-neutral-900 p-3 text-sm text-white">
            {`<div className="flex items-center gap-3 bg-success-50...">
  <CheckCircleIcon className="text-success-500" fontSize="medium" />
  <span>Product added to cart successfully!</span>
</div>`}
          </pre>
        </div>

        {/* Product Card Footer */}
        <div>
          <h3 className="mb-4 text-xl font-semibold text-neutral-950">Product Card Action Icons</h3>
          <div className="rounded-lg border border-neutral-200 p-6">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-lg border border-neutral-300 p-2 hover:border-primary-500 hover:text-primary-500"
              >
                <HeartIcon fontSize="small" />
              </button>
              <button
                type="button"
                className="rounded-lg border border-neutral-300 p-2 hover:border-primary-500 hover:text-primary-500"
              >
                <GitCompareIcon fontSize="small" />
              </button>
              <button
                type="button"
                className="flex-1 rounded-lg bg-primary-500 px-4 py-2 text-white hover:bg-primary-600"
              >
                <ShoppingCartIcon fontSize="small" className="inline" /> Add to Cart
              </button>
            </div>
          </div>
          <pre className="mt-2 rounded bg-neutral-900 p-3 text-sm text-white">
            {`<div className="flex gap-2">
  <button><HeartIcon fontSize="small" /></button>
  <button><GitCompareIcon fontSize="small" /></button>
  <button>
    <ShoppingCartIcon fontSize="small" /> Add to Cart
  </button>
</div>`}
          </pre>
        </div>

        {/* Search with Icon */}
        <div>
          <h3 className="mb-4 text-xl font-semibold text-neutral-950">Search Input</h3>
          <div className="rounded-lg border border-neutral-200 p-6">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full rounded-lg border border-neutral-300 py-2 pl-10 pr-4"
              />
            </div>
          </div>
          <pre className="mt-2 rounded bg-neutral-900 p-3 text-sm text-white">
            {`<div className="relative">
  <SearchIcon className="absolute left-3 top-1/2..." />
  <input className="...pl-10..." />
</div>`}
          </pre>
        </div>

        {/* BAPI Category Nav */}
        <div>
          <h3 className="mb-4 text-xl font-semibold text-neutral-950">
            Product Category Navigation
          </h3>
          <div className="rounded-lg border border-neutral-200 p-6">
            <div className="grid grid-cols-4 gap-4">
              <button
                type="button"
                className="flex flex-col items-center gap-2 rounded-lg p-4 hover:bg-primary-50"
              >
                <ThermometerIcon className="text-primary-500" fontSize="large" />
                <span className="text-sm font-medium">Temperature</span>
              </button>
              <button
                type="button"
                className="flex flex-col items-center gap-2 rounded-lg p-4 hover:bg-primary-50"
              >
                <DropletsIcon className="text-primary-500" fontSize="large" />
                <span className="text-sm font-medium">Humidity</span>
              </button>
              <button
                type="button"
                className="flex flex-col items-center gap-2 rounded-lg p-4 hover:bg-primary-50"
              >
                <GaugeIcon className="text-primary-500" fontSize="large" />
                <span className="text-sm font-medium">Pressure</span>
              </button>
              <button
                type="button"
                className="flex flex-col items-center gap-2 rounded-lg p-4 hover:bg-primary-50"
              >
                <WindIcon className="text-primary-500" fontSize="large" />
                <span className="text-sm font-medium">Air Quality</span>
              </button>
            </div>
          </div>
          <pre className="mt-2 rounded bg-neutral-900 p-3 text-sm text-white">
            {`<div className="grid grid-cols-4 gap-4">
  <button className="flex flex-col items-center...">
    <ThermometerIcon className="text-primary-500" fontSize="large" />
    <span>Temperature</span>
  </button>
  {/* More categories... */}
</div>`}
          </pre>
        </div>
      </div>
    </div>
  ),
};

// Story: BAPI Branded Product Category Icons
export const BAPIBrandedIcons: Story = {
  render: () => {
    const bapiIcons = [
      {
        name: 'Temperature',
        file: 'Temperature_Icon',
        lucide: ThermometerIcon,
        color: 'Red/Orange',
        order: 1,
      },
      {
        name: 'Humidity',
        file: 'Humidity_Icon',
        lucide: DropletsIcon,
        color: 'Blue/Cyan',
        order: 2,
      },
      {
        name: 'Pressure',
        file: 'Pressure_Icon',
        lucide: GaugeIcon,
        color: 'Purple/Pink',
        order: 3,
      },
      {
        name: 'Air Quality',
        file: 'AirQuality_Icon',
        lucide: WindIcon,
        color: 'Teal/Cyan',
        order: 4,
      },
      {
        name: 'Sensors',
        file: 'Sensors_Icon',
        lucide: PackageIcon,
        color: 'Blue/Gray',
        order: 5,
      },
      {
        name: 'Wireless',
        file: 'Wireless_Icon',
        lucide: WifiIcon,
        color: 'Green/Emerald',
        order: 6,
      },
      {
        name: 'Accessories',
        file: 'Accessories_Icon',
        lucide: PackageIcon,
        color: 'Gray/Neutral',
        order: 7,
      },
      {
        name: 'Test Instruments',
        file: 'Test_Instruments_Icon',
        lucide: FlaskConicalIcon,
        color: 'Cyan/Blue',
        order: 8,
      },
    ];

    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-neutral-950">BAPI Branded Product Icons</h1>
          <p className="text-lg text-neutral-700">
            Official brand-standard product category icons from the 2024 BAPI Brand Guide
          </p>
        </div>

        {/* Brand Compliance Alert */}
        <div className="rounded-lg border-2 border-accent-500 bg-accent-50 p-6">
          <div className="flex items-start gap-3">
            <AlertTriangleIcon className="mt-1 text-accent-600" fontSize="medium" />
            <div>
              <h3 className="mb-2 text-lg font-semibold text-accent-900">
                Brand Standard Requirements
              </h3>
              <ul className="space-y-1 text-sm text-accent-800">
                <li>
                  ✓ Icons <strong>must always</strong> appear in this order: T → H → P → AQ → S → W → A
                  → TI
                </li>
                <li>✓ Icons must be equidistant horizontally or vertically</li>
                <li>✓ Use WebP format for web performance</li>
                <li>✓ Two color schemes: Blue on white OR White on blue background</li>
                <li>✗ Never reorder icons for visual preference</li>
                <li>✗ Never combine categories (e.g., &quot;Humidity &amp; Air Quality&quot;)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Brand Icons Grid */}
        <div>
          <h2 className="mb-4 text-2xl font-semibold text-neutral-950">
            Official Brand Icons (Mandatory Order)
          </h2>
          <div className="rounded-lg border border-neutral-200 bg-white p-8">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 md:grid-cols-8">
              {bapiIcons.map((icon) => (
                <div key={icon.order} className="flex flex-col items-center gap-3">
                  <div className="relative h-16 w-16">
                    <Image
                      src={`/images/icons/${icon.file}.webp`}
                      alt={`${icon.name} category icon`}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold text-neutral-900">{icon.name}</div>
                    <div className="text-xs text-neutral-700">#{icon.order}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3 rounded bg-neutral-900 p-4 text-sm text-white">
            <code>{`<img src="/images/icons/Temperature_Icon.webp" alt="Temperature sensors" />`}</code>
          </div>
        </div>

        {/* White on Blue Variant */}
        <div>
          <h2 className="mb-4 text-2xl font-semibold text-neutral-950">
            White Icons on Blue Background
          </h2>
          <div className="rounded-lg bg-primary-500 p-8">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 md:grid-cols-8">
              {bapiIcons.map((icon) => (
                <div key={icon.order} className="flex flex-col items-center gap-3">
                  <div className="relative h-16 w-16">
                    <Image
                      src={`/images/icons/${icon.file}.webp`}
                      alt={`${icon.name} category icon`}
                      fill
                      className="object-contain brightness-0 invert"
                    />
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold text-white">{icon.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3 rounded bg-neutral-900 p-4 text-sm text-white">
            <code>{`<img className="brightness-0 invert" src="/images/icons/Temperature_Icon.webp" />`}</code>
          </div>
        </div>

        {/* Size Variants */}
        <div>
          <h2 className="mb-4 text-2xl font-semibold text-neutral-950">Size Guidelines</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-6">
              <h4 className="mb-3 text-sm font-semibold text-neutral-900">Mobile Nav (24px)</h4>
              <div className="relative mx-auto h-6 w-6">
                <Image
                  src="/images/icons/Temperature_Icon.webp"
                  alt="Temperature"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-6">
              <h4 className="mb-3 text-sm font-semibold text-neutral-900">Mega Menu (32px)</h4>
              <div className="relative mx-auto h-8 w-8">
                <Image
                  src="/images/icons/Temperature_Icon.webp"
                  alt="Temperature"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-6">
              <h4 className="mb-3 text-sm font-semibold text-neutral-900">Product Cards (48px)</h4>
              <div className="relative mx-auto h-12 w-12">
                <Image
                  src="/images/icons/Temperature_Icon.webp"
                  alt="Temperature"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-6">
              <h4 className="mb-3 text-sm font-semibold text-neutral-900">Hero Sections (64px)</h4>
              <div className="relative mx-auto h-16 w-16">
                <Image
                  src="/images/icons/Temperature_Icon.webp"
                  alt="Temperature"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Lucide Fallbacks Comparison */}
        <div>
          <h2 className="mb-4 text-2xl font-semibold text-neutral-950">
            Lucide Fallbacks (Development Only)
          </h2>
          <p className="mb-4 text-sm text-neutral-700">
            Use these lucide-react icons during development when brand assets aren&apos;t available
          </p>
          <div className="rounded-lg border border-neutral-200 bg-white p-6">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 md:grid-cols-8">
              {bapiIcons.map((icon) => {
                const LucideIcon = icon.lucide;
                return (
                  <div key={icon.order} className="flex flex-col items-center gap-3">
                    <div className="flex h-16 w-16 items-center justify-center">
                      <LucideIcon className="text-primary-500" sx={{ fontSize: 40 }} />
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-neutral-700">{icon.name}</div>
                      <code className="text-xs text-neutral-700">{icon.name}</code>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Implementation Example */}
        <div>
          <h2 className="mb-4 text-2xl font-semibold text-neutral-950">Mega Menu Implementation</h2>
          <div className="rounded-lg border border-neutral-200 bg-white p-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-8">
              {bapiIcons.map((icon) => (
                <button
                  key={icon.order}
                  type="button"
                  className="flex flex-col items-center gap-2 rounded-lg p-3 transition-colors hover:bg-primary-50"
                >
                  <div className="relative h-8 w-8">
                    <Image
                      src={`/images/icons/${icon.file}.webp`}
                      alt=""
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="text-xs font-medium text-neutral-900">{icon.name}</span>
                </button>
              ))}
            </div>
          </div>
          <pre className="mt-3 rounded bg-neutral-900 p-4 text-sm text-white">
            {`// Illustrative pattern (actual implementation in getMegaMenuItems()):
// See: web/src/components/layout/Header/config.ts for real structure
// Icons are defined inline on each column object, not as a separate map
const megaMenuColumns = [
  { title: 'Temperature', icon: '/images/icons/Temperature_Icon.webp', ... },
  { title: 'Humidity', icon: '/images/icons/Humidity_Icon.webp', ... },
  { title: 'Pressure', icon: '/images/icons/Pressure_Icon.webp', ... },
  // ...7 categories total (Sensors in brand guidelines but not yet in menu)
];`}
          </pre>
        </div>

        {/* When to Limit Icons */}
        <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-6">
          <h3 className="mb-4 text-xl font-semibold text-neutral-900">
            Space Constraints (6 Icons)
          </h3>
          <p className="mb-4 text-sm text-neutral-700">
            If space allows only 6 icons, you may eliminate <strong>one</strong> of the following:
          </p>
          <div className="mb-4 space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <XIcon className="text-error-500" fontSize="small" />
              <span>
                <strong>Accessories</strong> - For technical/engineering audiences
              </span>
            </div>
            <div className="flex items-center gap-2">
              <XIcon className="text-error-500" fontSize="small" />
              <span>
                <strong>Wireless</strong> - For traditional wired-sensor focused content
              </span>
            </div>
          </div>
          <div className="rounded bg-accent-100 p-3 text-sm">
            <strong className="text-accent-900">Never eliminate:</strong>{' '}
            <span className="text-accent-800">
              Temperature, Humidity, Pressure, Air Quality, Sensors, Test Instruments
            </span>
          </div>
        </div>

        {/* Brand Compliance Checklist */}
        <div className="rounded-lg border-2 border-success-500 bg-success-50 p-6">
          <h3 className="text-success-900 mb-4 text-xl font-semibold">
            Brand Compliance Checklist
          </h3>
          <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
            <div className="flex items-start gap-2">
              <CheckCircleIcon className="mt-0.5 flex-shrink-0 text-success-600" fontSize="small" />
              <span className="text-success-800">
                Icons in brand-standard order (T-H-P-AQ-W-A-TI)
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircleIcon className="mt-0.5 flex-shrink-0 text-success-600" fontSize="small" />
              <span className="text-success-800">Equidistant spacing (horizontal or vertical)</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircleIcon className="mt-0.5 flex-shrink-0 text-success-600" fontSize="small" />
              <span className="text-success-800">Using WebP format for performance</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircleIcon className="mt-0.5 flex-shrink-0 text-success-600" fontSize="small" />
              <span className="text-success-800">Original aspect ratio maintained</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircleIcon className="mt-0.5 flex-shrink-0 text-success-600" fontSize="small" />
              <span className="text-success-800">Blue or white color scheme only</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircleIcon className="mt-0.5 flex-shrink-0 text-success-600" fontSize="small" />
              <span className="text-success-800">Alt text for accessibility</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircleIcon className="mt-0.5 flex-shrink-0 text-success-600" fontSize="small" />
              <span className="text-success-800">No combined categories</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircleIcon className="mt-0.5 flex-shrink-0 text-success-600" fontSize="small" />
              <span className="text-success-800">Appropriate size for context (32-64px)</span>
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// Story: Trust Badges and Brand Assets
export const TrustBadges: Story = {
  render: () => {
    const trustBadges = [
      {
        name: '5-Year Warranty',
        file: '5-year-warranty-icon',
        usage: 'Product pages, quality assurance sections',
        description: 'BAPI\'s industry-leading 5-year warranty badge',
      },
      {
        name: 'BAPI Backed',
        file: 'bapi-backed-logo',
        usage: 'Footer, about pages, quality messaging',
        description: 'Official BAPI quality assurance logo',
      },
      {
        name: 'Certified Original',
        file: 'certified-original-stamp',
        usage: 'Product authentication, anti-counterfeiting',
        description: 'Certified original product stamp',
      },
    ];

    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-neutral-950">Trust Badges & Brand Assets</h1>
          <p className="text-lg text-neutral-700">
            Brand trust signals and quality assurance badges used across the BAPI platform
          </p>
        </div>

        {/* Brand Trust Badges */}
        <div>
          <h2 className="mb-4 text-2xl font-semibold text-neutral-950">Quality Assurance Badges</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {trustBadges.map((badge) => (
              <div
                key={badge.file}
                className="flex flex-col items-center gap-4 rounded-lg border border-neutral-200 bg-white p-6"
              >
                <div className="relative h-32 w-32">
                  <Image
                    src={`/images/icons/${badge.file}.webp`}
                    alt={badge.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="text-center">
                  <h3 className="mb-1 text-lg font-semibold text-neutral-950">{badge.name}</h3>
                  <p className="mb-2 text-sm text-neutral-700">{badge.description}</p>
                  <p className="text-xs font-medium text-primary-600">{badge.usage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Size Variants */}
        <div>
          <h2 className="mb-4 text-2xl font-semibold text-neutral-950">Size Guidelines</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-6">
              <h4 className="mb-3 text-sm font-semibold text-neutral-900">Small (64px)</h4>
              <div className="relative mx-auto h-16 w-16">
                <Image
                  src="/images/icons/5-year-warranty-icon.webp"
                  alt="5-Year Warranty"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="mt-2 text-xs text-neutral-700">Inline badges</p>
            </div>
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-6">
              <h4 className="mb-3 text-sm font-semibold text-neutral-900">Medium (96px)</h4>
              <div className="relative mx-auto h-24 w-24">
                <Image
                  src="/images/icons/5-year-warranty-icon.webp"
                  alt="5-Year Warranty"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="mt-2 text-xs text-neutral-700">Product cards</p>
            </div>
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-6">
              <h4 className="mb-3 text-sm font-semibold text-neutral-900">Large (128px)</h4>
              <div className="relative mx-auto h-32 w-32">
                <Image
                  src="/images/icons/5-year-warranty-icon.webp"
                  alt="5-Year Warranty"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="mt-2 text-xs text-neutral-700">Feature sections</p>
            </div>
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-6">
              <h4 className="mb-3 text-sm font-semibold text-neutral-900">X-Large (192px)</h4>
              <div className="relative mx-auto h-48 w-48">
                <Image
                  src="/images/icons/5-year-warranty-icon.webp"
                  alt="5-Year Warranty"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="mt-2 text-xs text-neutral-700">Hero/landing</p>
            </div>
          </div>
        </div>

        {/* Implementation Examples */}
        <div>
          <h2 className="mb-4 text-2xl font-semibold text-neutral-950">
            Common Implementation Patterns
          </h2>

          {/* Product Page Badge Bar */}
          <div className="mb-6">
            <h3 className="mb-3 text-lg font-semibold text-neutral-900">Product Page Badge Bar</h3>
            <div className="rounded-lg border border-neutral-200 bg-white p-6">
              <div className="flex flex-wrap items-center justify-center gap-8">
                <div className="flex flex-col items-center gap-2">
                  <div className="relative h-16 w-16">
                    <Image
                      src="/images/icons/5-year-warranty-icon.webp"
                      alt="5-Year Warranty"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="text-xs font-medium text-neutral-700">5-Year Warranty</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="relative h-16 w-16">
                    <Image
                      src="/images/icons/certified-original-stamp.webp"
                      alt="Certified Original"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="text-xs font-medium text-neutral-700">Certified Original</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="relative h-16 w-16">
                    <Image
                      src="/images/icons/bapi-backed-logo.webp"
                      alt="BAPI Backed"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="text-xs font-medium text-neutral-700">BAPI Quality</span>
                </div>
              </div>
            </div>
            <pre className="mt-3 rounded bg-neutral-900 p-4 text-sm text-white">
              {`<div className="flex gap-8 items-center">
  <Image 
    src="/images/icons/5-year-warranty-icon.webp" 
    alt="5-Year Warranty" 
    width={64} 
    height={64} 
  />
  <Image 
    src="/images/icons/certified-original-stamp.webp" 
    alt="Certified Original" 
    width={64} 
    height={64} 
  />
</div>`}
            </pre>
          </div>

          {/* Footer Trust Section */}
          <div>
            <h3 className="mb-3 text-lg font-semibold text-neutral-900">Footer Trust Section</h3>
            <div className="rounded-lg bg-neutral-900 p-8">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="relative h-24 w-24">
                  <Image
                    src="/images/icons/bapi-backed-logo.webp"
                    alt="BAPI Backed"
                    fill
                    className="object-contain brightness-0 invert"
                  />
                </div>
                <h4 className="text-xl font-semibold text-white">BAPI Quality Guarantee</h4>
                <p className="max-w-md text-sm text-neutral-300">
                  Every BAPI product is backed by our industry-leading 5-year warranty and
                  commitment to quality.
                </p>
              </div>
            </div>
            <pre className="mt-3 rounded bg-neutral-900 p-4 text-sm text-white">
              {`<Image 
  src="/images/icons/bapi-backed-logo.webp" 
  alt="BAPI Backed"
  className="brightness-0 invert"
  width={96} 
  height={96} 
/>`}
            </pre>
          </div>
        </div>

        {/* Usage Guidelines */}
        <div className="rounded-lg border-2 border-primary-500 bg-primary-50 p-6">
          <h3 className="mb-4 text-xl font-semibold text-primary-900">Usage Guidelines</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <h4 className="mb-2 text-sm font-semibold text-primary-900">✓ Do</h4>
              <ul className="space-y-1 text-sm text-primary-800">
                <li>• Use WebP format for web performance</li>
                <li>• Maintain original aspect ratios</li>
                <li>• Provide descriptive alt text</li>
                <li>• Use appropriate sizing for context</li>
                <li>• Group related trust signals together</li>
                <li>• Ensure sufficient contrast on backgrounds</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 text-sm font-semibold text-error-900">✗ Don&apos;t</h4>
              <ul className="space-y-1 text-sm text-error-800">
                <li>• Distort or stretch badges</li>
                <li>• Use low-resolution PNG when WebP available</li>
                <li>• Overuse badges (3-4 max per section)</li>
                <li>• Place on busy backgrounds</li>
                <li>• Remove or crop important badge text</li>
                <li>• Use badges as decorative elements</li>
              </ul>
            </div>
          </div>
        </div>

        {/* All Assets Reference */}
        <div>
          <h2 className="mb-4 text-2xl font-semibold text-neutral-950">Available Formats</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200 text-sm">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-neutral-900">Asset</th>
                  <th className="px-4 py-3 text-left font-semibold text-neutral-900">WebP</th>
                  <th className="px-4 py-3 text-left font-semibold text-neutral-900">PNG</th>
                  <th className="px-4 py-3 text-left font-semibold text-neutral-900">Usage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 bg-white">
                {trustBadges.map((badge) => (
                  <tr key={badge.file}>
                    <td className="px-4 py-3 font-medium text-neutral-900">{badge.name}</td>
                    <td className="px-4 py-3">
                      <code className="rounded bg-neutral-100 px-2 py-1 text-xs text-neutral-900">
                        {badge.file}.webp
                      </code>
                    </td>
                    <td className="px-4 py-3">
                      <code className="rounded bg-neutral-100 px-2 py-1 text-xs text-neutral-900">
                        {badge.file}.png
                      </code>
                    </td>
                    <td className="px-4 py-3 text-neutral-700">{badge.usage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  },
};
