import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import {
  // Navigation
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ExternalLink,
  Home,
  // Actions
  Plus,
  Minus,
  Check,
  ShoppingCart,
  Heart,
  GitCompare,
  Share2,
  Download,
  Trash2,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Printer,
  Send,
  Play,
  Search,
  Filter,
  // Status/Feedback
  CheckCircle,
  AlertCircle,
  XCircle,
  Info,
  AlertTriangle,
  Loader2,
  Clock,
  History,
  // Forms
  Mail,
  Phone,
  User,
  UserCircle,
  MapPin,
  CreditCard,
  Banknote,
  Lock,
  LogOut,
  Settings,
  Command,
  // Products
  Package,
  Tag,
  DollarSign,
  FileText,
  Grid3x3,
  List,
  SortAsc,
  SlidersHorizontal,
  BookOpen,
  Book,
  FileSpreadsheet,
  ClipboardList,
  File,
  HardDrive,
  // BAPI Product Categories (Lucide fallbacks)
  Thermometer,
  Droplets,
  Droplet,
  Gauge,
  Wind,
  Waves,
  Radio,
  Wifi,
  Cable,
  // Industry
  Building2,
  Briefcase,
  Truck,
  HeartPulse,
  Sprout,
  UtensilsCrossed,
  Beef,
  Snowflake,
  // Tech/System
  Cloud,
  Smartphone,
  Bell,
  LineChart,
  TrendingUp,
  Shield,
  Zap,
  Award,
  Languages,
  Globe,
  // Social
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Linkedin,
  Youtube,
} from 'lucide-react';

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
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

// Icon registry organized by category
const icons = {
  Navigation: [
    { name: 'Menu', icon: Menu, usage: 'Mobile menu toggle' },
    { name: 'X', icon: X, usage: 'Close buttons, remove items' },
    { name: 'ChevronDown', icon: ChevronDown, usage: 'Dropdown indicators' },
    { name: 'ChevronUp', icon: ChevronUp, usage: 'Collapse indicators' },
    { name: 'ChevronLeft', icon: ChevronLeft, usage: 'Previous navigation' },
    { name: 'ChevronRight', icon: ChevronRight, usage: 'Next navigation' },
    { name: 'ArrowRight', icon: ArrowRight, usage: 'Call-to-action arrows' },
    { name: 'ArrowLeft', icon: ArrowLeft, usage: 'Back navigation' },
    { name: 'ArrowUp', icon: ArrowUp, usage: 'Back to top button' },
    { name: 'ExternalLink', icon: ExternalLink, usage: 'External links' },
    { name: 'Home', icon: Home, usage: 'Home/dashboard link' },
  ],
  Actions: [
    { name: 'Plus', icon: Plus, usage: 'Add item, increase quantity' },
    { name: 'Minus', icon: Minus, usage: 'Remove item, decrease quantity' },
    { name: 'Check', icon: Check, usage: 'Confirmation, selection indicator' },
    { name: 'ShoppingCart', icon: ShoppingCart, usage: 'Cart button, checkout' },
    { name: 'Heart', icon: Heart, usage: 'Favorite/wishlist toggle' },
    { name: 'GitCompare', icon: GitCompare, usage: 'Product comparison' },
    { name: 'Share2', icon: Share2, usage: 'Share content' },
    { name: 'Download', icon: Download, usage: 'Download resources' },
    { name: 'Trash2', icon: Trash2, usage: 'Delete actions' },
    { name: 'ZoomIn', icon: ZoomIn, usage: 'Image zoom in' },
    { name: 'ZoomOut', icon: ZoomOut, usage: 'Image zoom out' },
    { name: 'RotateCw', icon: RotateCw, usage: 'Rotate image' },
    { name: 'Printer', icon: Printer, usage: 'Print actions' },
    { name: 'Send', icon: Send, usage: 'Submit chat/forms' },
    { name: 'Play', icon: Play, usage: 'Video play buttons' },
    { name: 'Search', icon: Search, usage: 'Search inputs' },
    { name: 'Filter', icon: Filter, usage: 'Filter controls' },
  ],
  Status: [
    { name: 'CheckCircle', icon: CheckCircle, usage: 'Success states' },
    { name: 'AlertCircle', icon: AlertCircle, usage: 'Warning states' },
    { name: 'XCircle', icon: XCircle, usage: 'Error states' },
    { name: 'Info', icon: Info, usage: 'Information tooltips' },
    { name: 'AlertTriangle', icon: AlertTriangle, usage: 'Critical warnings' },
    { name: 'Loader2', icon: Loader2, usage: 'Loading spinners' },
    { name: 'Clock', icon: Clock, usage: 'Pending/scheduled' },
    { name: 'History', icon: History, usage: 'Recently viewed' },
  ],
  Forms: [
    { name: 'Mail', icon: Mail, usage: 'Email inputs' },
    { name: 'Phone', icon: Phone, usage: 'Phone inputs' },
    { name: 'User', icon: User, usage: 'User profile icon' },
    { name: 'UserCircle', icon: UserCircle, usage: 'User avatar' },
    { name: 'MapPin', icon: MapPin, usage: 'Address/location' },
    { name: 'CreditCard', icon: CreditCard, usage: 'Payment methods' },
    { name: 'Banknote', icon: Banknote, usage: 'Purchase order payment' },
    { name: 'Lock', icon: Lock, usage: 'Secure/password fields' },
    { name: 'LogOut', icon: LogOut, usage: 'Sign out button' },
    { name: 'Settings', icon: Settings, usage: 'Settings/preferences' },
    { name: 'Command', icon: Command, usage: 'Keyboard shortcuts' },
  ],
  Products: [
    { name: 'Package', icon: Package, usage: 'Products, orders' },
    { name: 'Tag', icon: Tag, usage: 'Pricing, discounts' },
    { name: 'DollarSign', icon: DollarSign, usage: 'Pricing display' },
    { name: 'FileText', icon: FileText, usage: 'Documents, specs' },
    { name: 'Grid3x3', icon: Grid3x3, usage: 'Grid view toggle' },
    { name: 'List', icon: List, usage: 'List view toggle' },
    { name: 'SortAsc', icon: SortAsc, usage: 'Sort controls' },
    { name: 'SlidersHorizontal', icon: SlidersHorizontal, usage: 'Filter drawer' },
    { name: 'BookOpen', icon: BookOpen, usage: 'Application notes' },
    { name: 'Book', icon: Book, usage: 'Documentation' },
    { name: 'FileSpreadsheet', icon: FileSpreadsheet, usage: 'Spreadsheets' },
    { name: 'ClipboardList', icon: ClipboardList, usage: 'Order lists' },
    { name: 'File', icon: File, usage: 'Generic files' },
    { name: 'HardDrive', icon: HardDrive, usage: 'Resources' },
  ],
  'BAPI Categories': [
    { name: 'Thermometer', icon: Thermometer, usage: 'Temperature sensors' },
    { name: 'Droplets', icon: Droplets, usage: 'Humidity sensors' },
    { name: 'Droplet', icon: Droplet, usage: 'Humidity (alt)' },
    { name: 'Gauge', icon: Gauge, usage: 'Pressure sensors' },
    { name: 'Wind', icon: Wind, usage: 'Air quality sensors' },
    { name: 'Waves', icon: Waves, usage: 'Air flow sensors' },
    { name: 'Radio', icon: Radio, usage: 'Wireless sensors' },
    { name: 'Wifi', icon: Wifi, usage: 'WiFi connectivity' },
    { name: 'Cable', icon: Cable, usage: 'Wired accessories' },
  ],
  Industry: [
    { name: 'Building2', icon: Building2, usage: 'Buildings, companies' },
    { name: 'Briefcase', icon: Briefcase, usage: 'Business, jobs' },
    { name: 'Truck', icon: Truck, usage: 'Shipping, logistics' },
    { name: 'HeartPulse', icon: HeartPulse, usage: 'Healthcare industry' },
    { name: 'Sprout', icon: Sprout, usage: 'Agriculture/grow rooms' },
    { name: 'UtensilsCrossed', icon: UtensilsCrossed, usage: 'Restaurants' },
    { name: 'Beef', icon: Beef, usage: 'Food processing' },
    { name: 'Snowflake', icon: Snowflake, usage: 'Refrigeration/cold chain' },
  ],
  System: [
    { name: 'Cloud', icon: Cloud, usage: 'Cloud services' },
    { name: 'Smartphone', icon: Smartphone, usage: 'Mobile apps' },
    { name: 'Bell', icon: Bell, usage: 'Notifications/alerts' },
    { name: 'LineChart', icon: LineChart, usage: 'Analytics/graphs' },
    { name: 'TrendingUp', icon: TrendingUp, usage: 'Growth/trends' },
    { name: 'Shield', icon: Shield, usage: 'Security/protection' },
    { name: 'Zap', icon: Zap, usage: 'Performance/speed' },
    { name: 'Award', icon: Award, usage: 'Achievements' },
    { name: 'Languages', icon: Languages, usage: 'Language selector' },
    { name: 'Globe', icon: Globe, usage: 'Region selector' },
  ],
  Social: [
    { name: 'MessageCircle', icon: MessageCircle, usage: 'Chat/messages' },
    { name: 'ThumbsUp', icon: ThumbsUp, usage: 'Like/helpful' },
    { name: 'ThumbsDown', icon: ThumbsDown, usage: 'Dislike/not helpful' },
    { name: 'Linkedin', icon: Linkedin, usage: 'LinkedIn social link' },
    { name: 'Youtube', icon: Youtube, usage: 'YouTube social link' },
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

  const copyCode = () => {
    navigator.clipboard.writeText(`import { ${name} } from 'lucide-react';`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative flex flex-col items-center gap-2 rounded-lg border border-neutral-200 p-4 transition-all hover:border-primary-500 hover:bg-neutral-50">
      <Icon size={size} color={color} strokeWidth={2} />
      <span className="text-xs font-medium text-neutral-700">{name}</span>
      {showUsage && usage && (
        <span className="text-center text-2xs text-neutral-500">{usage}</span>
      )}
      {showCode && (
        <button
          onClick={copyCode}
          className="mt-1 rounded bg-neutral-900 px-2 py-1 text-2xs text-white opacity-0 transition-opacity group-hover:opacity-100"
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
          <p className="text-lg text-neutral-600">
            {Object.values(icons).reduce((sum, cat) => sum + cat.length, 0)} lucide-react icons
            used across BAPI Headless
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
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
        <p className="text-sm text-neutral-600">
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
            <Search className="mb-2 h-12 w-12 text-neutral-400" />
            <p className="text-neutral-600">No icons found matching "{searchQuery}"</p>
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
              <strong>Import:</strong> <code>import {'{IconName}'} from 'lucide-react';</code>
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
      <p className="text-neutral-600">
        Standard icon sizes used across BAPI Headless based on context
      </p>

      <div className="space-y-8">
        {/* Small - 16px */}
        <div>
          <h3 className="mb-4 text-xl font-semibold text-neutral-950">Small (16px)</h3>
          <p className="mb-4 text-sm text-neutral-600">
            Used for: Inline text icons, badges, compact UI elements
          </p>
          <div className="flex items-center gap-6 rounded-lg border border-neutral-200 p-6">
            <ShoppingCart size={16} />
            <Check size={16} />
            <Info size={16} />
            <ArrowRight size={16} />
            <Package size={16} />
          </div>
          <pre className="mt-2 rounded bg-neutral-900 p-3 text-sm text-white">
            &lt;ShoppingCart size={'{16}'} /&gt;
          </pre>
        </div>

        {/* Medium - 24px (default) */}
        <div>
          <h3 className="mb-4 text-xl font-semibold text-neutral-950">Medium (24px) - Default</h3>
          <p className="mb-4 text-sm text-neutral-600">
            Used for: Buttons, navigation, form fields, most UI elements
          </p>
          <div className="flex items-center gap-6 rounded-lg border border-neutral-200 p-6">
            <ShoppingCart size={24} />
            <Check size={24} />
            <Info size={24} />
            <ArrowRight size={24} />
            <Package size={24} />
          </div>
          <pre className="mt-2 rounded bg-neutral-900 p-3 text-sm text-white">
            &lt;ShoppingCart size={'{24}'} /&gt; {'//'} or &lt;ShoppingCart /&gt;
          </pre>
        </div>

        {/* Large - 32px */}
        <div>
          <h3 className="mb-4 text-xl font-semibold text-neutral-950">Large (32px)</h3>
          <p className="mb-4 text-sm text-neutral-600">
            Used for: Hero sections, feature cards, prominent CTAs
          </p>
          <div className="flex items-center gap-6 rounded-lg border border-neutral-200 p-6">
            <ShoppingCart size={32} />
            <Check size={32} />
            <Info size={32} />
            <ArrowRight size={32} />
            <Package size={32} />
          </div>
          <pre className="mt-2 rounded bg-neutral-900 p-3 text-sm text-white">
            &lt;ShoppingCart size={'{32}'} /&gt;
          </pre>
        </div>

        {/* Extra Large - 48px */}
        <div>
          <h3 className="mb-4 text-xl font-semibold text-neutral-950">Extra Large (48px)</h3>
          <p className="mb-4 text-sm text-neutral-600">
            Used for: Empty states, large feature displays, marketing sections
          </p>
          <div className="flex items-center gap-6 rounded-lg border border-neutral-200 p-6">
            <ShoppingCart size={48} />
            <Check size={48} />
            <Info size={48} />
            <ArrowRight size={48} />
            <Package size={48} />
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
      <p className="text-neutral-600">
        Use semantic color tokens from BAPI color system for consistent icon coloring
      </p>

      <div className="space-y-8">
        {/* Primary Blue */}
        <div>
          <h3 className="mb-4 text-xl font-semibold text-neutral-950">Primary (BAPI Blue)</h3>
          <div className="flex items-center gap-6 rounded-lg border border-neutral-200 bg-white p-6">
            <ShoppingCart className="text-primary-500" size={32} />
            <CheckCircle className="text-primary-500" size={32} />
            <Package className="text-primary-500" size={32} />
            <Thermometer className="text-primary-500" size={32} />
          </div>
          <pre className="mt-2 rounded bg-neutral-900 p-3 text-sm text-white">
            &lt;ShoppingCart className="text-primary-500" /&gt;
          </pre>
        </div>

        {/* Accent Yellow */}
        <div>
          <h3 className="mb-4 text-xl font-semibold text-neutral-950">Accent (BAPI Yellow)</h3>
          <div className="flex items-center gap-6 rounded-lg border border-neutral-200 bg-white p-6">
            <AlertTriangle className="text-accent-500" size={32} />
            <Bell className="text-accent-500" size={32} />
            <Award className="text-accent-500" size={32} />
            <Zap className="text-accent-500" size={32} />
          </div>
          <pre className="mt-2 rounded bg-neutral-900 p-3 text-sm text-white">
            &lt;AlertTriangle className="text-accent-500" /&gt;
          </pre>
        </div>

        {/* Success Green */}
        <div>
          <h3 className="mb-4 text-xl font-semibold text-neutral-950">Success</h3>
          <div className="flex items-center gap-6 rounded-lg border border-neutral-200 bg-white p-6">
            <CheckCircle className="text-success-500" size={32} />
            <Check className="text-success-500" size={32} />
            <ThumbsUp className="text-success-500" size={32} />
            <Shield className="text-success-500" size={32} />
          </div>
          <pre className="mt-2 rounded bg-neutral-900 p-3 text-sm text-white">
            &lt;CheckCircle className="text-success-500" /&gt;
          </pre>
        </div>

        {/* Warning Orange */}
        <div>
          <h3 className="mb-4 text-xl font-semibold text-neutral-950">Warning</h3>
          <div className="flex items-center gap-6 rounded-lg border border-neutral-200 bg-white p-6">
            <AlertCircle className="text-warning-500" size={32} />
            <AlertTriangle className="text-warning-500" size={32} />
            <Clock className="text-warning-500" size={32} />
            <Info className="text-warning-500" size={32} />
          </div>
          <pre className="mt-2 rounded bg-neutral-900 p-3 text-sm text-white">
            &lt;AlertCircle className="text-warning-500" /&gt;
          </pre>
        </div>

        {/* Error Red */}
        <div>
          <h3 className="mb-4 text-xl font-semibold text-neutral-950">Error</h3>
          <div className="flex items-center gap-6 rounded-lg border border-neutral-200 bg-white p-6">
            <XCircle className="text-error-500" size={32} />
            <X className="text-error-500" size={32} />
            <AlertTriangle className="text-error-500" size={32} />
            <Trash2 className="text-error-500" size={32} />
          </div>
          <pre className="mt-2 rounded bg-neutral-900 p-3 text-sm text-white">
            &lt;XCircle className="text-error-500" /&gt;
          </pre>
        </div>

        {/* Neutral Gray */}
        <div>
          <h3 className="mb-4 text-xl font-semibold text-neutral-950">Neutral</h3>
          <div className="flex items-center gap-6 rounded-lg border border-neutral-200 bg-white p-6">
            <Settings className="text-neutral-500" size={32} />
            <Filter className="text-neutral-500" size={32} />
            <Search className="text-neutral-500" size={32} />
            <Menu className="text-neutral-500" size={32} />
          </div>
          <pre className="mt-2 rounded bg-neutral-900 p-3 text-sm text-white">
            &lt;Settings className="text-neutral-500" /&gt;
          </pre>
        </div>

        {/* White on Dark */}
        <div>
          <h3 className="mb-4 text-xl font-semibold text-neutral-950">White on Dark</h3>
          <div className="flex items-center gap-6 rounded-lg bg-neutral-900 p-6">
            <ShoppingCart className="text-white" size={32} />
            <Package className="text-white" size={32} />
            <Heart className="text-white" size={32} />
            <User className="text-white" size={32} />
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
      <p className="text-neutral-600">Real-world examples of icon usage across BAPI Headless</p>

      <div className="space-y-8">
        {/* Cart Button with Badge */}
        <div>
          <h3 className="mb-4 text-xl font-semibold text-neutral-950">Cart Button with Badge</h3>
          <div className="rounded-lg border border-neutral-200 p-6">
            <button
              type="button"
              className="relative inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-white hover:bg-primary-600"
            >
              <ShoppingCart size={20} />
              <span>Cart</span>
              <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-accent-500 text-xs font-bold text-neutral-900">
                3
              </span>
            </button>
          </div>
          <pre className="mt-2 rounded bg-neutral-900 p-3 text-sm text-white">
            {`<button className="relative...">
  <ShoppingCart size={20} />
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
              <Loader2 size={20} className="animate-spin" />
              <span>Adding to Cart...</span>
            </button>
          </div>
          <pre className="mt-2 rounded bg-neutral-900 p-3 text-sm text-white">
            {`<button disabled className="...opacity-75">
  <Loader2 size={20} className="animate-spin" />
  <span>Adding to Cart...</span>
</button>`}
          </pre>
        </div>

        {/* Success Notification */}
        <div>
          <h3 className="mb-4 text-xl font-semibold text-neutral-950">Success Notification</h3>
          <div className="rounded-lg border border-neutral-200 p-6">
            <div className="flex items-center gap-3 rounded-lg bg-success-50 p-4">
              <CheckCircle className="text-success-500" size={24} />
              <span className="text-success-700">Product added to cart successfully!</span>
            </div>
          </div>
          <pre className="mt-2 rounded bg-neutral-900 p-3 text-sm text-white">
            {`<div className="flex items-center gap-3 bg-success-50...">
  <CheckCircle className="text-success-500" size={24} />
  <span>Product added to cart successfully!</span>
</div>`}
          </pre>
        </div>

        {/* Product Card Footer */}
        <div>
          <h3 className="mb-4 text-xl font-semibold text-neutral-950">
            Product Card Action Icons
          </h3>
          <div className="rounded-lg border border-neutral-200 p-6">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-lg border border-neutral-300 p-2 hover:border-primary-500 hover:text-primary-500"
              >
                <Heart size={20} />
              </button>
              <button
                type="button"
                className="rounded-lg border border-neutral-300 p-2 hover:border-primary-500 hover:text-primary-500"
              >
                <GitCompare size={20} />
              </button>
              <button
                type="button"
                className="flex-1 rounded-lg bg-primary-500 px-4 py-2 text-white hover:bg-primary-600"
              >
                <ShoppingCart size={20} className="inline" /> Add to Cart
              </button>
            </div>
          </div>
          <pre className="mt-2 rounded bg-neutral-900 p-3 text-sm text-white">
            {`<div className="flex gap-2">
  <button><Heart size={20} /></button>
  <button><GitCompare size={20} /></button>
  <button>
    <ShoppingCart size={20} /> Add to Cart
  </button>
</div>`}
          </pre>
        </div>

        {/* Search with Icon */}
        <div>
          <h3 className="mb-4 text-xl font-semibold text-neutral-950">Search Input</h3>
          <div className="rounded-lg border border-neutral-200 p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full rounded-lg border border-neutral-300 py-2 pl-10 pr-4"
              />
            </div>
          </div>
          <pre className="mt-2 rounded bg-neutral-900 p-3 text-sm text-white">
            {`<div className="relative">
  <Search className="absolute left-3 top-1/2..." />
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
                <Thermometer className="text-primary-500" size={32} />
                <span className="text-sm font-medium">Temperature</span>
              </button>
              <button
                type="button"
                className="flex flex-col items-center gap-2 rounded-lg p-4 hover:bg-primary-50"
              >
                <Droplets className="text-primary-500" size={32} />
                <span className="text-sm font-medium">Humidity</span>
              </button>
              <button
                type="button"
                className="flex flex-col items-center gap-2 rounded-lg p-4 hover:bg-primary-50"
              >
                <Gauge className="text-primary-500" size={32} />
                <span className="text-sm font-medium">Pressure</span>
              </button>
              <button
                type="button"
                className="flex flex-col items-center gap-2 rounded-lg p-4 hover:bg-primary-50"
              >
                <Wind className="text-primary-500" size={32} />
                <span className="text-sm font-medium">Air Quality</span>
              </button>
            </div>
          </div>
          <pre className="mt-2 rounded bg-neutral-900 p-3 text-sm text-white">
            {`<div className="grid grid-cols-4 gap-4">
  <button className="flex flex-col items-center...">
    <Thermometer className="text-primary-500" size={32} />
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
