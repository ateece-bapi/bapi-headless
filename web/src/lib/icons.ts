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

// ========================================
// Navigation & UI Icons
// ========================================
export { Menu as MenuIcon } from '@mui/icons-material';
export { Close as XIcon } from '@mui/icons-material';
export { ExpandMore as ChevronDownIcon } from '@mui/icons-material';
export { ChevronRight as ChevronRightIcon } from '@mui/icons-material';
export { ChevronLeft as ChevronLeftIcon } from '@mui/icons-material';
export { ExpandLess as ChevronUpIcon } from '@mui/icons-material';
export { ArrowForward as ArrowRightIcon } from '@mui/icons-material';
export { ArrowBack as ArrowLeftIcon } from '@mui/icons-material';
export { Search as SearchIcon } from '@mui/icons-material';

// ========================================
// E-Commerce Icons
// ========================================
export { ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';
export { Favorite as HeartIcon } from '@mui/icons-material';
export { FavoriteBorder as HeartOutlineIcon } from '@mui/icons-material';
export { LocalOffer as TagIcon } from '@mui/icons-material';
export { Delete as Trash2Icon } from '@mui/icons-material';
export { Add as PlusIcon } from '@mui/icons-material';
export { Remove as MinusIcon } from '@mui/icons-material';

// ========================================
// Status & Feedback Icons
// ========================================
export { Check as CheckIcon } from '@mui/icons-material';
export { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
export { Error as AlertCircleIcon } from '@mui/icons-material';
export { Info as InfoIcon } from '@mui/icons-material';
export { Warning as AlertTriangleIcon } from '@mui/icons-material';
export { HourglassEmpty as Loader2Icon } from '@mui/icons-material';
export { Loop as RefreshCwIcon } from '@mui/icons-material';

// ========================================
// Content & Media Icons
// ========================================
export { Image as ImageIcon } from '@mui/icons-material';
export { VideoLibrary as VideoIcon } from '@mui/icons-material';
export { Article as FileTextIcon } from '@mui/icons-material';
export { Description as FileIcon } from '@mui/icons-material';
export { PictureAsPdf as FileDocumentIcon } from '@mui/icons-material';
export { Download as DownloadIcon } from '@mui/icons-material';
export { Upload as UploadIcon } from '@mui/icons-material';
export { ZoomIn as ZoomInIcon } from '@mui/icons-material';
export { ZoomOut as ZoomOutIcon } from '@mui/icons-material';
export { Rotate90DegreesCcw as RotateCwIcon } from '@mui/icons-material';

// ========================================
// Communication Icons
// ========================================
export { Email as MailIcon } from '@mui/icons-material';
export { Phone as PhoneIcon } from '@mui/icons-material';
export { Message as MessageCircleIcon } from '@mui/icons-material';
export { Send as SendIcon } from '@mui/icons-material';
export { Share as Share2Icon } from '@mui/icons-material';
export { Print as PrinterIcon } from '@mui/icons-material';
export { ThumbUp as ThumbsUpIcon } from '@mui/icons-material';
export { ThumbDown as ThumbsDownIcon } from '@mui/icons-material';
export { Person as UserCircleIcon } from '@mui/icons-material';

// ========================================
// Business & Location Icons
// ========================================
export { Business as Building2Icon } from '@mui/icons-material';
export { LocationOn as MapPinIcon } from '@mui/icons-material';
export { Inventory as PackageIcon } from '@mui/icons-material';
export { ViewModule as Grid3x3Icon } from '@mui/icons-material';
export { ViewList as ListIcon } from '@mui/icons-material';
export { Tune as SlidersHorizontalIcon } from '@mui/icons-material';
export { AccountCircle as UserIcon } from '@mui/icons-material';
export { Group as UsersIcon } from '@mui/icons-material';

// ========================================
// Product & Category Icons
// ========================================
export { DeviceThermostat as ThermometerIcon } from '@mui/icons-material';
export { WaterDrop as DropletsIcon } from '@mui/icons-material';
export { Speed as GaugeIcon } from '@mui/icons-material';
export { Air as WindIcon } from '@mui/icons-material';
export { Wifi as WifiIcon } from '@mui/icons-material';
export { Biotech as FlaskConicalIcon } from '@mui/icons-material';
export { Category as PackageCategoryIcon } from '@mui/icons-material';

// ========================================
// Payment & Financial Icons
// ========================================
export { CreditCard as CreditCardIcon } from '@mui/icons-material';
export { AttachMoney as DollarSignIcon } from '@mui/icons-material';
export { Money as BanknoteIcon } from '@mui/icons-material';

// ========================================
// Security & Trust Icons
// ========================================
export { Shield as ShieldIcon } from '@mui/icons-material';
export { Lock as LockIcon } from '@mui/icons-material';
export { LockOpen as UnlockIcon } from '@mui/icons-material';
export { Verified as VerifiedIcon } from '@mui/icons-material';

// ========================================
// Action Icons
// ========================================
export { Edit as EditIcon } from '@mui/icons-material';
export { ContentCopy as CopyIcon } from '@mui/icons-material';
export { Refresh as RotateCcwIcon } from '@mui/icons-material';
export { Schedule as ClockIcon } from '@mui/icons-material';
export { Link as ExternalLinkIcon } from '@mui/icons-material';
export { Bookmark as BookOpenIcon } from '@mui/icons-material';
export { Work as BriefcaseIcon } from '@mui/icons-material';
export { Home as HomeIcon } from '@mui/icons-material';
export { MoreVert as MoreVerticalIcon } from '@mui/icons-material';
export { MoreHoriz as MoreHorizontalIcon } from '@mui/icons-material';

// ========================================
// Special Icons
// ========================================
export { Mouse as MousePointerClickIcon } from '@mui/icons-material';
export { Laptop as CommandIcon } from '@mui/icons-material';
export { QrCode as QrCodeIcon } from '@mui/icons-material';
export { Key as KeyIcon } from '@mui/icons-material';
export { Smartphone as SmartphoneIcon } from '@mui/icons-material';

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
