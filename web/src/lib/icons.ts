/**
 * Centralized Icon Library for BAPI Headless
 * 
 * This module provides Material Symbols icons as specified by BAPI's UI/UX design team.
 * All icons use Google Material Symbols with the following settings:
 * - Variant: Rounded
 * - Weight: 400
 * - Fill: 0 (no fill/outline)
 * - Optical Size: 24
 * 
 * BAPI Branded Icons:
 * - Product category icons remain as custom BAPI-branded SVG assets
 * - Do NOT replace branded icons with Material Symbols equivalents
 * 
 * Usage:
 * import { ShoppingCartIcon, CheckIcon } from '@/lib/icons';
 */

import { createMaterialSymbolIcon } from '@/components/icons/MaterialSymbol';

// Create Material Symbol icon components using Google's snake_case naming
// Navigation & UI
const Menu = createMaterialSymbolIcon('menu', 'Menu');
const Close = createMaterialSymbolIcon('close', 'Close');
const ExpandMore = createMaterialSymbolIcon('expand_more', 'ExpandMore');
const ChevronRight = createMaterialSymbolIcon('chevron_right', 'ChevronRight');
const ChevronLeft = createMaterialSymbolIcon('chevron_left', 'ChevronLeft');
const ExpandLess = createMaterialSymbolIcon('expand_less', 'ExpandLess');
const ArrowForward = createMaterialSymbolIcon('arrow_forward', 'ArrowForward');
const ArrowBack = createMaterialSymbolIcon('arrow_back', 'ArrowBack');
const ArrowUpward = createMaterialSymbolIcon('arrow_upward', 'ArrowUpward');
const Search = createMaterialSymbolIcon('search', 'Search');

// E-Commerce
const ShoppingCart = createMaterialSymbolIcon('shopping_cart', 'ShoppingCart');
const Favorite = createMaterialSymbolIcon('favorite', 'Favorite');
const FavoriteBorder = createMaterialSymbolIcon('favorite_border', 'FavoriteBorder');
const LocalOffer = createMaterialSymbolIcon('local_offer', 'LocalOffer');
const Delete = createMaterialSymbolIcon('delete', 'Delete');
const Add = createMaterialSymbolIcon('add', 'Add');
const Remove = createMaterialSymbolIcon('remove', 'Remove');
const LocalShipping = createMaterialSymbolIcon('local_shipping', 'LocalShipping');

// Status & Feedback
const Check = createMaterialSymbolIcon('check', 'Check');
const CheckCircle = createMaterialSymbolIcon('check_circle', 'CheckCircle');
const Error = createMaterialSymbolIcon('error', 'Error');
const Info = createMaterialSymbolIcon('info', 'Info');
const Warning = createMaterialSymbolIcon('warning', 'Warning');
const HourglassEmpty = createMaterialSymbolIcon('hourglass_empty', 'HourglassEmpty');
const Loop = createMaterialSymbolIcon('loop', 'Loop');
const Cancel = createMaterialSymbolIcon('cancel', 'Cancel');

// Content & Media
const Image = createMaterialSymbolIcon('image', 'Image');
const VideoLibrary = createMaterialSymbolIcon('video_library', 'VideoLibrary');
const Article = createMaterialSymbolIcon('article', 'Article');
const Description = createMaterialSymbolIcon('description', 'Description');
const PictureAsPdf = createMaterialSymbolIcon('picture_as_pdf', 'PictureAsPdf');
const Download = createMaterialSymbolIcon('download', 'Download');
const Upload = createMaterialSymbolIcon('upload', 'Upload');
const ZoomIn = createMaterialSymbolIcon('zoom_in', 'ZoomIn');
const ZoomOut = createMaterialSymbolIcon('zoom_out', 'ZoomOut');
const Rotate90DegreesCcw = createMaterialSymbolIcon('rotate_90_degrees_ccw', 'Rotate90DegreesCcw');

// Communication
const Email = createMaterialSymbolIcon('email', 'Email');
const Phone = createMaterialSymbolIcon('phone', 'Phone');
const Message = createMaterialSymbolIcon('message', 'Message');
const Send = createMaterialSymbolIcon('send', 'Send');
const Share = createMaterialSymbolIcon('share', 'Share');
const Print = createMaterialSymbolIcon('print', 'Print');
const ThumbUp = createMaterialSymbolIcon('thumb_up', 'ThumbUp');
const ThumbDown = createMaterialSymbolIcon('thumb_down', 'ThumbDown');
const Person = createMaterialSymbolIcon('person', 'Person');

// Business & Location
const Business = createMaterialSymbolIcon('business', 'Business');
const LocationOn = createMaterialSymbolIcon('location_on', 'LocationOn');
const Inventory = createMaterialSymbolIcon('inventory', 'Inventory');
const ViewModule = createMaterialSymbolIcon('view_module', 'ViewModule');
const ViewList = createMaterialSymbolIcon('view_list', 'ViewList');
const Tune = createMaterialSymbolIcon('tune', 'Tune');
const AccountCircle = createMaterialSymbolIcon('account_circle', 'AccountCircle');
const Group = createMaterialSymbolIcon('group', 'Group');

// Product & Category
const DeviceThermostat = createMaterialSymbolIcon('device_thermostat', 'DeviceThermostat');
const WaterDrop = createMaterialSymbolIcon('water_drop', 'WaterDrop');
const Speed = createMaterialSymbolIcon('speed', 'Speed');
const Air = createMaterialSymbolIcon('air', 'Air');
const Wifi = createMaterialSymbolIcon('wifi', 'Wifi');
const Biotech = createMaterialSymbolIcon('biotech', 'Biotech');
const Category = createMaterialSymbolIcon('category', 'Category');

// Payment & Financial
const CreditCard = createMaterialSymbolIcon('credit_card', 'CreditCard');
const AttachMoney = createMaterialSymbolIcon('attach_money', 'AttachMoney');
const Money = createMaterialSymbolIcon('money', 'Money');

// Security & Trust
const Shield = createMaterialSymbolIcon('shield', 'Shield');
const Lock = createMaterialSymbolIcon('lock', 'Lock');
const LockOpen = createMaterialSymbolIcon('lock_open', 'LockOpen');
const Verified = createMaterialSymbolIcon('verified', 'Verified');

// Actions
const Edit = createMaterialSymbolIcon('edit', 'Edit');
const ContentCopy = createMaterialSymbolIcon('content_copy', 'ContentCopy');
const Refresh = createMaterialSymbolIcon('refresh', 'Refresh');
const Schedule = createMaterialSymbolIcon('schedule', 'Schedule');
const Link = createMaterialSymbolIcon('link', 'Link');
const Bookmark = createMaterialSymbolIcon('bookmark', 'Bookmark');
const Work = createMaterialSymbolIcon('work', 'Work');
const Home = createMaterialSymbolIcon('home', 'Home');
const MoreVert = createMaterialSymbolIcon('more_vert', 'MoreVert');
const MoreHoriz = createMaterialSymbolIcon('more_horiz', 'MoreHoriz');
const Compare = createMaterialSymbolIcon('compare', 'Compare');
const Visibility = createMaterialSymbolIcon('visibility', 'Visibility');
const VisibilityOff = createMaterialSymbolIcon('visibility_off', 'VisibilityOff');
const CheckBox = createMaterialSymbolIcon('check_box', 'CheckBox');
const CheckBoxOutlineBlank = createMaterialSymbolIcon('check_box_outline_blank', 'CheckBoxOutlineBlank');
const TrendingUp = createMaterialSymbolIcon('trending_up', 'TrendingUp');
const History = createMaterialSymbolIcon('history', 'History');
const AutoAwesome = createMaterialSymbolIcon('auto_awesome', 'AutoAwesome');
const EmojiEvents = createMaterialSymbolIcon('emoji_events', 'EmojiEvents');
const Settings = createMaterialSymbolIcon('settings', 'Settings');
const EventAvailable = createMaterialSymbolIcon('event_available', 'EventAvailable');
const CalendarMonth = createMaterialSymbolIcon('calendar_month', 'CalendarMonth');
const Block = createMaterialSymbolIcon('block', 'Block');

// Special
const Mouse = createMaterialSymbolIcon('mouse', 'Mouse');
const Laptop = createMaterialSymbolIcon('laptop', 'Laptop');
const QrCode = createMaterialSymbolIcon('qr_code', 'QrCode');
const Key = createMaterialSymbolIcon('key', 'Key');
const Smartphone = createMaterialSymbolIcon('smartphone', 'Smartphone');

// Social & Utility
const YouTube = createMaterialSymbolIcon('youtube_activity', 'YouTube');
const LinkedIn = createMaterialSymbolIcon('linked_services', 'LinkedIn');
const Language = createMaterialSymbolIcon('language', 'Language');
const Public = createMaterialSymbolIcon('public', 'Public');
const Logout = createMaterialSymbolIcon('logout', 'Logout');
const VerifiedUser = createMaterialSymbolIcon('verified_user', 'VerifiedUser');
const Radio = createMaterialSymbolIcon('radio', 'Radio');
const Build = createMaterialSymbolIcon('build', 'Build');
const Support = createMaterialSymbolIcon('support', 'Support');
const School = createMaterialSymbolIcon('school', 'School');

// Additional Icons for Batch 9
const PlayArrow = createMaterialSymbolIcon('play_arrow', 'PlayArrow');
const Yard = createMaterialSymbolIcon('yard', 'Yard');
const Restaurant = createMaterialSymbolIcon('restaurant', 'Restaurant');
const MonitorHeart = createMaterialSymbolIcon('monitor_heart', 'MonitorHeart');
const SetMeal = createMaterialSymbolIcon('set_meal', 'SetMeal');
const AcUnit = createMaterialSymbolIcon('ac_unit', 'AcUnit');
const Waves = createMaterialSymbolIcon('waves', 'Waves');
const Cable = createMaterialSymbolIcon('cable', 'Cable');
const Bolt = createMaterialSymbolIcon('bolt', 'Bolt');
const FilterList = createMaterialSymbolIcon('filter_list', 'FilterList');
const Storage = createMaterialSymbolIcon('storage', 'Storage');
const TableChart = createMaterialSymbolIcon('table_chart', 'TableChart');
const Assignment = createMaterialSymbolIcon('assignment', 'Assignment');
const MenuBook = createMaterialSymbolIcon('menu_book', 'MenuBook');
const Sort = createMaterialSymbolIcon('sort', 'Sort');

// Batch 10 Icons (Account Pages)
const LocalMall = createMaterialSymbolIcon('local_mall', 'LocalMall');
const AlternateEmail = createMaterialSymbolIcon('alternate_email', 'AlternateEmail');

// Batch 11 Icons (Resources Pages)
const Computer = createMaterialSymbolIcon('computer', 'Computer');

// Batch 12 Icons (Company/Support/Applications Pages)
const ChatBubble = createMaterialSymbolIcon('chat_bubble', 'ChatBubble');
const Factory = createMaterialSymbolIcon('factory', 'Factory');
const Adjust = createMaterialSymbolIcon('adjust', 'Adjust');

// Batch 13 Icons (Product Type Pages - Sensors/Accessories/Wireless)
const Inventory2 = createMaterialSymbolIcon('inventory_2', 'Inventory2');
const Layers = createMaterialSymbolIcon('layers', 'Layers');
const Grass = createMaterialSymbolIcon('grass', 'Grass');
const LocalHospital = createMaterialSymbolIcon('local_hospital', 'LocalHospital');
const Notifications = createMaterialSymbolIcon('notifications', 'Notifications');
const BarChart = createMaterialSymbolIcon('bar_chart', 'BarChart');
const BatteryFull = createMaterialSymbolIcon('battery_full', 'BatteryFull');

// Batch 14 Icons (Contact/Quote/RMA Pages)
const Headphones = createMaterialSymbolIcon('headphones', 'Headphones');

// Batch 15 Icons (Home/Search/Where-to-Buy Pages)
const Newspaper = createMaterialSymbolIcon('newspaper', 'Newspaper');
const RssFeed = createMaterialSymbolIcon('rss_feed', 'RssFeed');

// Batch 16 Icons (Sensor/Service/Auth/Wireless Pages)
const SignalCellular4Bar = createMaterialSymbolIcon('signal_cellular_4_bar', 'SignalCellular4Bar');

// Batch 17 Icons (Company Pages)
const CardGiftcard = createMaterialSymbolIcon('card_giftcard', 'CardGiftcard');
const Flight = createMaterialSymbolIcon('flight', 'Flight');
const FitnessCenter = createMaterialSymbolIcon('fitness_center', 'FitnessCenter');
const Lightbulb = createMaterialSymbolIcon('lightbulb', 'Lightbulb');
const Star = createMaterialSymbolIcon('star', 'Star');

// Batch 19 Icons (App Notes/Solutions/WAM/SignIn Pages)
const LocalActivity = createMaterialSymbolIcon('local_activity', 'LocalActivity');
const Cloud = createMaterialSymbolIcon('cloud', 'Cloud');
const ShowChart = createMaterialSymbolIcon('show_chart', 'ShowChart');
const Door = createMaterialSymbolIcon('door_open', 'Door');
const Percent = createMaterialSymbolIcon('percent', 'Percent');
const HumidityPercentage = createMaterialSymbolIcon('humidity_percentage', 'HumidityPercentage');
const WaterDamage = createMaterialSymbolIcon('water_damage', 'WaterDamage');

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
export { Factory as FactoryIcon };
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
export { RssFeed as RssIcon };

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
export { Door as DoorOpenIcon };
export { Percent as PercentIcon };
export { HumidityPercentage as HumidityPercentageIcon };
export { Speed as SpeedIcon };
export { WaterDamage as WaterDamageIcon };
// Note: FileDownIcon already exported in Content & Media Icons section (line 248)

// ========================================
// Type Definitions
// ========================================

/**
 * Material Symbols Icon Props
 * 
 * Material Symbols use a span element with the 'material-symbols-rounded' class.
 * The icon name is rendered as text content inside the span.
 * 
 * Default settings (per UI/UX design specifications):
 * - Variant: Rounded
 * - Weight: 400
 * - Fill: 0 (no fill)
 * - Optical Size: 24
 */
export interface IconProps {
  /**
   * CSS class name (PRIMARY STYLING METHOD)
   * Use Tailwind classes for size, color, spacing, etc.
   * Example: className="h-6 w-6 text-primary-500 mb-4"
   */
  className?: string;
  
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
 * Material Symbols + Tailwind Best Practices
 * 
 * This project uses Material Symbols from Google Fonts in a Tailwind-first design system.
 * Icons are rendered as React components that output <span> elements with the appropriate class.
 * 
 * Design Settings (per UI/UX specifications):
 * - Variant: Rounded (material-symbols-rounded)
 * - Weight: 400 (configured via font-variation-settings: 'wght' 400)
 * - Fill: 0 / No fill (configured via font-variation-settings: 'FILL' 0)
 * - Optical Size: 24 (configured via font-variation-settings: 'opsz' 24)
 * 
 * ✅ CORRECT: Use className for all styling (Tailwind standard)
 * - Size: className="text-base" (16px), "text-xl" (20px), "text-2xl" (24px), "text-5xl" (56px)
 *   Or use w/h: className="h-4 w-4" (16px), "h-5 w-5" (20px), "h-6 w-6" (24px)
 * - Color: className="text-primary-500", "text-accent-500", "text-neutral-700", etc.
 * - Spacing: className="mb-4 mr-2 ml-3", etc.
 * - Transitions: className="transition-transform duration-300 hover:scale-110"
 * - Animation: className="animate-spin" (works perfectly with Material Symbols)
 * 
 * Migration from MUI Icons:
 * - No changes needed to component code - exports remain the same
 * - Material Symbols have 2,500+ icons vs MUI's smaller set
 * - Better coverage for sensor icons (BAPI's core products)
 * - All existing className usage continues to work
 * 
 * Why Material Symbols:
 * - More comprehensive icon library (2,500+ icons)
 * - Better sensor icon coverage (critical for BAPI's product line)
 * - Variable font allows customization without changing components
 * - Matches UI/UX design specifications (Rounded, 400, no fill, 24dp)
 * - Same React component pattern as MUI icons
 * - Maintained by Google, part of Material Design 3
 */
