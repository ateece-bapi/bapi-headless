/**
 * Centralized Icon Library for BAPI Headless
 * 
 * This module provides Material UI icons for consistency with BAPI's WAM application.
 * All icons are exported with consistent naming for easy migration from lucide-react.
 * 
 * BAPI Branded Icons:
 * - Product category icons remain as custom BAPI-branded SVG assets
 * - Do NOT replace branded icons with Material UI equivalents
 * 
 * Usage:
 * import { ShoppingCartIcon, CheckIcon } from '@/lib/icons';
 */

// Import all MUI icons with their original names
import {
  // Navigation & UI
  Menu,
  Close,
  ExpandMore,
  ChevronRight,
  ChevronLeft,
  ExpandLess,
  ArrowForward,
  ArrowBack,
  ArrowUpward,
  Search,
  
  // E-Commerce
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  LocalOffer,
  Delete,
  Add,
  Remove,
  LocalShipping,
  
  // Status & Feedback
  Check,
  CheckCircle,
  Error,
  Info,
  Warning,
  HourglassEmpty,
  Loop,
  Cancel,
  
  // Content & Media
  Image,
  VideoLibrary,
  Article,
  Description,
  PictureAsPdf,
  Download,
  Upload,
  ZoomIn,
  ZoomOut,
  Rotate90DegreesCcw,
  
  // Communication
  Email,
  Phone,
  Message,
  Send,
  Share,
  Print,
  ThumbUp,
  ThumbDown,
  Person,
  
  // Business & Location
  Business,
  LocationOn,
  Inventory,
  ViewModule,
  ViewList,
  Tune,
  AccountCircle,
  Group,
  
  // Product & Category
  DeviceThermostat,
  WaterDrop,
  Speed,
  Air,
  Wifi,
  Biotech,
  Category,
  
  // Payment & Financial
  CreditCard,
  AttachMoney,
  Money,
  
  // Security & Trust
  Shield,
  Lock,
  LockOpen,
  Verified,
  
  // Actions
  Edit,
  ContentCopy,
  Refresh,
  Schedule,
  Link,
  Bookmark,
  Work,
  Home,
  MoreVert,
  MoreHoriz,
  Compare,
  Visibility,
  VisibilityOff,
  CheckBox,
  CheckBoxOutlineBlank,
  TrendingUp,
  History,
  AutoAwesome,
  EmojiEvents,
  Settings,
  EventAvailable,
  CalendarMonth,
  Block,
  
  // Special
  Mouse,
  Laptop,
  QrCode,
  Key,
  Smartphone,
  
  // Social & Utility
  YouTube,
  LinkedIn,
  Language,
  Public,
  Logout,
  VerifiedUser,
  Radio,
  Build,
  Support,
  School,
  
  // Additional Icons for Batch 9
  PlayArrow,
  Yard,
  Restaurant,
  MonitorHeart,
  SetMeal,
  AcUnit,
  Waves,
  Cable,
  Bolt,
  FilterList,
  Storage,
  TableChart,
  Assignment,
  MenuBook,
  Sort,
  
  // Batch 10 Icons (Account Pages)
  LocalMall,
  AlternateEmail,
  
  // Batch 11 Icons (Resources Pages)
  Computer,
  
  // Batch 12 Icons (Company/Support/Applications Pages)
  ChatBubble,
  Factory as FactoryMUI,
  Adjust,
  
  // Batch 13 Icons (Product Type Pages - Sensors/Accessories/Wireless)
  Inventory2,
  Layers,
  Grass,
  LocalHospital,
  Notifications,
  BarChart,
  BatteryFull,
  
  // Batch 14 Icons (Contact/Quote/RMA Pages)
  Headphones,
  
  // Batch 15 Icons (Home/Search/Where-to-Buy Pages)
  Newspaper,
  
  // Batch 16 Icons (Sensor/Service/Auth/Wireless Pages)
  SignalCellular4Bar,
  
  // Batch 17 Icons (Company Pages)
  CardGiftcard,
  Flight,
  FitnessCenter,
  Lightbulb,
  Star,
  
  // Batch 19 Icons (App Notes/Solutions/WAM/SignIn Pages)
  LocalActivity,
  Cloud,
  ShowChart,
} from '@mui/icons-material';

// Export with lucide-react compatible names
// Navigation & UI Icons
export { Menu as MenuIcon };
export { Close as XIcon };
export { ExpandMore as ChevronDownIcon };
export { ChevronRight as ChevronRightIcon };
export { ChevronLeft as ChevronLeftIcon };
export { ExpandLess as ChevronUpIcon };
export { ArrowForward as ArrowRightIcon };
export { ArrowBack as ArrowLeftIcon };
export { ArrowUpward as ArrowUpIcon };
export { Search as SearchIcon };

// E-Commerce Icons
export { ShoppingCart as ShoppingCartIcon };
export { Favorite as HeartIcon };
export { FavoriteBorder as HeartOutlineIcon };
export { LocalOffer as TagIcon };
export { Delete as Trash2Icon };
export { Add as PlusIcon };
export { Remove as MinusIcon };
export { LocalShipping as TruckIcon };

// Status & Feedback Icons
export { Check as CheckIcon };
export { CheckCircle as CheckCircleIcon };
export { Error as AlertCircleIcon };
export { Cancel as XCircleIcon };
export { Info as InfoIcon };
export { Warning as AlertTriangleIcon };
export { HourglassEmpty as Loader2Icon };
export { Loop as RefreshCwIcon };

// Content & Media Icons
export { Image as ImageIcon };
export { VideoLibrary as VideoIcon };
export { Article as FileTextIcon };
export { Description as FileIcon };
export { PictureAsPdf as FileDocumentIcon };
export { Download as DownloadIcon };
export { Download as FileDownIcon };
export { Upload as UploadIcon };
export { ZoomIn as ZoomInIcon };
export { ZoomOut as ZoomOutIcon };
export { Rotate90DegreesCcw as RotateCwIcon };

// Communication Icons
export { Email as MailIcon };
export { Phone as PhoneIcon };
export { Message as MessageCircleIcon };
export { Send as SendIcon };
export { Share as Share2Icon };
export { Print as PrinterIcon };
export { ThumbUp as ThumbsUpIcon };
export { ThumbDown as ThumbsDownIcon };
export { Person as UserCircleIcon };

// Business & Location Icons
export { Business as Building2Icon };
export { Business as BuildingIcon };
export { LocationOn as MapPinIcon };
export { Inventory as PackageIcon };
export { ViewModule as Grid3x3Icon };
export { ViewList as ListIcon };
export { Tune as SlidersHorizontalIcon };
export { AccountCircle as UserIcon };
export { Group as UsersIcon };

// Product & Category Icons
export { DeviceThermostat as ThermometerIcon };
export { WaterDrop as DropletsIcon };
export { WaterDrop as DropletIcon }; // Singular variant alias
export { Speed as GaugeIcon };
export { Air as WindIcon };
export { Wifi as WifiIcon };
export { Biotech as FlaskConicalIcon };
export { Category as PackageCategoryIcon };

// Payment & Financial Icons
export { CreditCard as CreditCardIcon };
export { AttachMoney as DollarSignIcon };
export { Money as BanknoteIcon };

// Security & Trust Icons
export { Shield as ShieldIcon };
export { Lock as LockIcon };
export { LockOpen as UnlockIcon };
export { Verified as VerifiedIcon };

// Action Icons
export { Edit as EditIcon };
export { ContentCopy as CopyIcon };
export { Refresh as RotateCcwIcon };
export { Schedule as ClockIcon };
export { Link as ExternalLinkIcon };
export { Bookmark as BookOpenIcon };
export { Work as BriefcaseIcon };
export { Home as HomeIcon };
export { MoreVert as MoreVerticalIcon };
export { MoreHoriz as MoreHorizontalIcon };
export { Compare as GitCompareIcon };
export { Visibility as EyeIcon };
export { VisibilityOff as EyeOffIcon };
export { CheckBox as CheckSquareIcon };
export { CheckBoxOutlineBlank as SquareIcon };
export { TrendingUp as TrendingUpIcon };
export { History as HistoryIcon };
export { AutoAwesome as SparklesIcon };
export { EmojiEvents as AwardIcon };
export { Settings as SettingsIcon };
export { EventAvailable as CalendarPlusIcon };
export { CalendarMonth as CalendarIcon };
export { Block as ShieldOffIcon };

// Special Icons
export { Mouse as MousePointerClickIcon };
export { Laptop as CommandIcon };
export { QrCode as QrCodeIcon };
export { Key as KeyIcon };
export { Smartphone as SmartphoneIcon };

// Social & Utility Icons
export { YouTube as YoutubeIcon };
export { LinkedIn as LinkedinIcon };
export { Language as LanguagesIcon };
export { Public as GlobeIcon };
export { Logout as LogOutIcon };
export { VerifiedUser as ShieldCheckIcon };
export { Radio as RadioIcon };
export { Build as WrenchIcon };
export { Support as LifeBuoyIcon };
export { School as GraduationCapIcon };

// Batch 9 Icons (Applications, Company, Contact, Home, Resources)
export { PlayArrow as PlayIcon };
export { Yard as SproutIcon };
export { Restaurant as UtensilsCrossedIcon };
export { MonitorHeart as HeartPulseIcon };
export { SetMeal as BeefIcon };
export { AcUnit as SnowflakeIcon };
export { Waves as WavesIcon };
export { Cable as CableIcon };
export { Bolt as ZapIcon };
export { FilterList as FilterIcon };
export { Storage as HardDriveIcon };
export { TableChart as FileSpreadsheetIcon };
export { Assignment as ClipboardListIcon };
export { MenuBook as BookIcon };
export { Sort as SortAscIcon };

// Batch 10 Icons (Account Pages)
export { LocalMall as ShoppingBagIcon };
export { AlternateEmail as AtSignIcon };

// Batch 11 Icons (Resources Pages)
export { Computer as MonitorIcon };

// Batch 12 Icons (Company/Support/Applications Pages)
export { ChatBubble as MessageSquareIcon };
export { FactoryMUI as FactoryIcon };
export { Adjust as TargetIcon };

// Batch 13 Icons (Product Type Pages - Sensors/Accessories/Wireless)
export { Inventory2 as BoxIcon };
export { Layers as LayersIcon };
export { Grass as LeafIcon };
export { LocalHospital as HospitalIcon };
export { Notifications as BellIcon };
export { BarChart as BarChart3Icon };
export { BatteryFull as BatteryIcon };

// Batch 14 Icons (Contact/Quote/RMA Pages)
export { Headphones as HeadphonesIcon };

// Batch 15 Icons (Home/Search/Where-to-Buy Pages)
export { Newspaper as NewspaperIcon };

// Batch 16 Icons (Sensor/Service/Auth/Wireless Pages)
export { SignalCellular4Bar as SignalIcon };

// Batch 17 Icons (Company Pages)
export { CardGiftcard as GiftIcon };
export { Flight as PlaneIcon };
export { FitnessCenter as DumbbellIcon };
export { Lightbulb as LightbulbIcon };
export { Star as StarIcon };
export { CheckCircle as CheckCircle2Icon }; // lucide-react variant alias

// Batch 19 Icons (App Notes/Solutions/WAM/SignIn Pages)
export { LocalActivity as ActivityIcon };
export { Storage as ServerIcon }; // lucide-react variant alias (same as HardDriveIcon)
export { Cloud as CloudIcon };
export { ShowChart as LineChartIcon };
// Note: FileDownIcon already exported in Content & Media Icons section (line 248)

// ========================================
// Type Definitions
// ========================================

/**
 * Material UI Icon Props
 * 
 * Note: This project is Tailwind-first and does NOT use MUI ThemeProvider.
 * Use className for styling (recommended). MUI-specific props are listed for reference
 * but will not work properly without MUI theme configuration.
 */
export interface IconProps {
  /**
   * CSS class name (PRIMARY STYLING METHOD)
   * Use Tailwind classes for size, color, spacing, etc.
   * Example: className="h-6 w-6 text-primary-500 mb-4"
   */
  className?: string;
  
  /**
   * Icon size - MUI fontSize prop (REQUIRES MUI THEME - not recommended)
   * Use className with Tailwind sizing instead: "h-4 w-4", "h-6 w-6", etc.
   */
  fontSize?: 'small' | 'medium' | 'large' | 'inherit';
  
  /**
   * Icon color - MUI color prop (REQUIRES MUI THEME - not recommended)
   * Use className with Tailwind colors instead: "text-primary-500", etc.
   */
  color?: 'inherit' | 'primary' | 'secondary' | 'action' | 'disabled' | 'error';
  
  /**
   * Inline styles (use sparingly, prefer Tailwind classes)
   */
  style?: React.CSSProperties;
  
  /**
   * ARIA label for accessibility (RECOMMENDED for icon-only buttons)
   */
  'aria-label'?: string;
  
  /**
   * Role attribute
   */
  role?: string;
}

/**
 * Material UI Icons + Tailwind Best Practices
 * 
 * This project uses MUI Icons as simple React components in a Tailwind-first design system.
 * We do NOT use MUI ThemeProvider, so MUI-specific props (fontSize, color, sx) are not used.
 * 
 * ✅ CORRECT: Use className for all styling (Tailwind standard)
 * - Size: className="h-4 w-4" (16px), "h-5 w-5" (20px), "h-6 w-6" (24px), "h-14 w-14" (56px)
 * - Color: className="text-primary-500", "text-accent-500", "text-neutral-700", etc.
 * - Spacing: className="mb-4 mr-2 ml-3", etc.
 * - Transitions: className="transition-transform duration-300 hover:scale-110"
 * - Animation: className="animate-spin" (works perfectly with MUI icons)
 * 
 * ❌ AVOID: MUI theme props (require MUI ThemeProvider which we don't use)
 * - fontSize="small|medium|large" → Only works with MUI theme
 * - color="primary|secondary" → Only works with MUI theme  
 * - sx={{ ... }} → Requires MUI styling engine
 * 
 * Migration Pattern (Lucide → MUI Icons):
 * - lucide size={16} → className="h-4 w-4"
 * - lucide size={20} → className="h-5 w-5"
 * - lucide size={24} → className="h-6 w-6"
 * - lucide strokeWidth → Remove (MUI icons are filled SVGs, no stroke control)
 * - Keep all existing Tailwind classes (colors, spacing, transitions)
 * 
 * Why This Approach:
 * - MUI Icons are just React components that render SVG elements
 * - They accept className like any React component
 * - Tailwind is our design system, maintaining consistency across all components
 * - This is the industry standard for MUI Icons + Tailwind (without MUI theme)
 */
