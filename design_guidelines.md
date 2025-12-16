# Design Guidelines: Artisan Stall PWA

## Design Approach
**Utility-First Design System** - Prioritizing usability, touch-friendliness, and clarity for market stall operation. Drawing inspiration from Material Design's clarity with enhanced touch targets for outdoor/market use.

## Typography
- **Primary Font**: Inter or Roboto (via Google Fonts CDN)
- **Hierarchy**:
  - Page titles: text-2xl to text-3xl, font-semibold
  - Section headers: text-xl, font-medium
  - Product names: text-lg, font-medium
  - Body text/labels: text-base
  - Counter values: text-xl to text-2xl, font-bold (high visibility)
  - Buttons: text-base to text-lg, font-medium

## Layout System
**Spacing Primitives**: Use Tailwind units of 4, 6, 8, 12, 16
- Component padding: p-4 to p-6
- Section spacing: gap-6 to gap-8
- Button spacing: px-8 py-4 (extra large touch targets)
- Grid gaps: gap-4 to gap-6

**Container Strategy**:
- Max-width: max-w-7xl for main content
- Full-width grids with responsive columns
- Comfortable margins: mx-4 to mx-8

## Component Library

### Navigation/Header
- Sticky top bar with app title and current mode indicator
- Large, clearly labeled action buttons (Import/Export/End Day)
- Persistent export warning banner when data hasn't been saved

### Home Screen (Mode Selection)
- Two large, equal-width cards (md:grid-cols-2)
- Each card: min-h-64, prominent icon (from Heroicons), title, and description
- Clear visual hierarchy separating the two entry modes

### Import/Manual Entry Wizard
- Step-by-step form with clear progress indication
- Large input fields (min-h-12 for text inputs)
- Dropzone for file upload with visual feedback
- Preview list of imported/entered products before confirmation

### Product Grid (Main Screen)
- Responsive grid: grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
- Product cards with:
  - Square image container (aspect-square) with placeholder support
  - Product name (truncate if needed)
  - Large, visible quantity display with label
  - Four counter buttons in 2x2 grid layout
  
### Counter Buttons
- **Critical**: Minimum touch target 56x56px (h-14 w-14 or larger)
- Icons from Heroicons (plus/minus symbols)
- Clear labels: "+Sold", "-Sold", "+Created", "-Created"
- Instant visual feedback on tap
- High contrast for outdoor visibility

### Export Section
- Summary statistics card showing totals
- Large export button with format selection
- Success confirmation with download prompt

### Forms & Inputs
- Large input fields: min-h-12, px-4
- Clear labels above inputs
- Select dropdowns with large touch targets
- Image upload with preview thumbnail

### Modals/Dialogs
- Full-screen on mobile, centered card on tablet/desktop
- Clear close/cancel actions
- Prominent primary action button

## Grid & Cards Strategy
- Product cards: Border with subtle shadow, rounded corners (rounded-lg)
- Hover states minimal (this is touch-first)
- Focus on tap states with scale or background change
- Cards should feel substantial (p-4 to p-6)

## Icons
**Use Heroicons** (outline style for consistency):
- Plus/minus for counters
- Upload for import
- Download for export
- Check for confirmations
- Alert triangle for warnings
- Package/box for products

## Responsive Breakpoints
- Mobile-first: Single column, stacked layout
- Tablet (md:): 2-column product grid
- Desktop (lg:): 3-4 column product grid
- All touch targets remain large across breakpoints

## Images
**Product Images**:
- Square aspect ratio (aspect-square)
- Placeholder: Simple icon or initials when no image
- Image upload: Show preview immediately
- Grid display: Consistent sizing across all cards

**No Hero Image**: This is a utility app - focus on immediate functionality

## Accessibility
- High contrast text (outdoor readability)
- Large touch targets throughout (minimum 56px)
- Clear focus indicators for keyboard navigation
- ARIA labels for counter buttons
- Screen reader support for quantity changes

## Key UX Principles
1. **Speed**: Instant updates, no loading states for local operations
2. **Clarity**: Always show current quantities prominently
3. **Safety**: Confirmation dialogs for destructive actions
4. **Feedback**: Toast notifications for successful operations
5. **Offline-first**: Clear indicators when data is local vs. synced