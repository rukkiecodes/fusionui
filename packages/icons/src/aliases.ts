// Curated semantic icon aliases used internally by FusionUI components (e.g. the
// close button on an alert resolves `$close`). Wired as the default aliases in
// fusionui's createIcons, so they always work without registering the full set.
// This pulls only the ~two dozen icons referenced below — not all 287.

import type { FeatherIcon } from './runtime'
import { X } from './icons/x'
import { XCircle } from './icons/x-circle'
import { Check } from './icons/check'
import { CheckCircle } from './icons/check-circle'
import { Info } from './icons/info'
import { AlertTriangle } from './icons/alert-triangle'
import { AlertCircle } from './icons/alert-circle'
import { ChevronLeft } from './icons/chevron-left'
import { ChevronRight } from './icons/chevron-right'
import { ChevronDown } from './icons/chevron-down'
import { ChevronUp } from './icons/chevron-up'
import { Menu } from './icons/menu'
import { Search } from './icons/search'
import { Trash2 } from './icons/trash-2'
import { Edit2 } from './icons/edit-2'
import { Plus } from './icons/plus'
import { Minus } from './icons/minus'
import { Upload } from './icons/upload'
import { Star } from './icons/star'
import { Calendar } from './icons/calendar'
import { Clock } from './icons/clock'
import { Eye } from './icons/eye'
import { EyeOff } from './icons/eye-off'

export const featherAliases: Record<string, FeatherIcon> = {
  close: X,
  cancel: X,
  clear: XCircle,
  check: Check,
  complete: Check,
  success: CheckCircle,
  info: Info,
  warning: AlertTriangle,
  error: AlertCircle,
  prev: ChevronLeft,
  next: ChevronRight,
  dropdown: ChevronDown,
  expand: ChevronDown,
  collapse: ChevronUp,
  menu: Menu,
  search: Search,
  delete: Trash2,
  edit: Edit2,
  increment: Plus,
  decrement: Minus,
  upload: Upload,
  rating: Star,
  calendar: Calendar,
  clock: Clock,
  eye: Eye,
  eyeOff: EyeOff,
}
