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
  Search,
  
  // E-Commerce
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  LocalOffer,
  Delete,
  Add,
  Remove,
  
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
  
  // Special
  Mouse,
  Laptop,
  QrCode,
  Key,
  Smartphone,
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
export { Search as SearchIcon };

// E-Commerce Icons
export { ShoppingCart as ShoppingCartIcon };
export { Favorite as HeartIcon };
export { FavoriteBorder as HeartOutlineIcon };
export { LocalOffer as TagIcon };
export { Delete as Trash2Icon };
export { Add as PlusIcon };
export { Remove as MinusIcon };

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

// Special Icons
export { Mouse as MousePointerClickIcon };
export { Laptop as CommandIcon };
export { QrCode as QrCodeIcon };
export { Key as KeyIcon };
export { Smartphone as SmartphoneIcon };

// ========================================
// Type Definitions
// ========================================

/**
 * Base props for Material UI icons
 * All MUI icons support these props
 */
export interface IconProps {
  /**
   * CSS class name
   */
  className?: string;
  
  /**
   * Icon size (uses MUI fontSize prop)
   * - 'small': 20px
   * - 'medium': 24px (default)
   * - 'large': 35px
   * - 'inherit': inherits from parent
   */
  fontSize?: 'small' | 'medium' | 'large' | 'inherit';
  
  /**
   * Icon color (uses MUI color prop)
   * - 'primary': theme primary color
   * - 'secondary': theme secondary color
   * - 'action': theme action color
   * - 'disabled': theme disabled color
   * - 'error': theme error color
   * - 'inherit': inherits from parent
   */
  color?: 'inherit' | 'primary' | 'secondary' | 'action' | 'disabled' | 'error';
  
  /**
   * Inline styles
   */
  style?: React.CSSProperties;
  
  /**
   * ARIA label for accessibility
   */
  'aria-label'?: string;
  
  /**
   * Role attribute
   */
  role?: string;
}

/**
 * Migration Notes:
 * 
 * Lucide → Material UI Size Mapping:
 * - Lucide: size={16|20|24} → MUI: fontSize="small|medium|large"
 * - Lucide: className="w-4 h-4" → MUI: fontSize="small"
 * - Lucide: className="w-5 h-5" → MUI: fontSize="medium"
 * - Lucide: className="w-6 h-6" → MUI: fontSize="large"
 * 
 * Stroke Width:
 * - Lucide: strokeWidth prop → MUI: uses theme default (no direct equivalent)
 * - MUI icons are filled by default; use outlined variants if needed
 * 
 * Animation:
 * - Lucide: className="animate-spin" → Keep Tailwind class, works with MUI
 */
