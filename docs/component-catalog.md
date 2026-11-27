# Component catalog (API contract)

Exact import paths and key props of every component, so later work reuses instead of re-inventing.
All paths are relative to `src/`. Import from the component's own file (no barrels), with relative
paths, e.g. `import { Button } from '../../components/actions/Button/Button'`.
Rules and conventions: `DESIGN.md`. Each phase appends its section here after integration.

## Phase 1 — foundations and core families

### Tokens and theme
- `import { bs } from 'theme/theme'` → CSS-variable refs: `bs.surface.canvas`, `bs.text.secondary`,
  `bs.status.danger.fg`, `bs.selection.bg`, `bs.elevation.e2`, `bs.focus.ring`, …
- `import { radius, space, layout, typeScale, duration, easing, transition, density, zLayer, type Density, type StatusTone } from 'theme/tokens'`.
- Typography variants: `display`, `h1`–`h4`, `body1`, `body2`, `label`, `caption`, `code`, `price`.
- `theme/SchemeScope`: `<SchemeScope scheme="light|dark|page" asPage?>` forces a scheme on a subtree;
  `<InverseSurface sx>` = black block with dark-scheme content.
- `theme/a11y`: `visuallyHidden`.
- `src/theme/**` is frozen. All inventory MUI components and the pickers are themed; raw MUI works.

### i18n and formatting
- `i18n/locale`: `useT(messages)`, `useLocale()`.
- `i18n/format`: `formatMoney(amount, locale, currency='USD')`, `formatNumber`, `intlLocale` (es → es-US, en → en-US).

### Domain
- `domain/status.ts`: types `BookingStatus`, `AssignmentStatus`, `PaymentStatus`, `StatusDimension`,
  `StatusByDimension`; lists `bookingStatuses`, `assignmentStatuses`, `paymentStatuses`;
  `statusMeta[dim][status] = { tone, label{es,en}, longLabel?, description }`;
  `getStatusMeta(dim, s)`, `getStatusLabel(dim, s, locale, long?)`, `dimensionLabel`.
  - booking: pending → warning, confirmed → info, in progress → brand, completed → success, cancelled → neutral
  - assignment: unassigned → warning, assigned → success
  - payment: pending → warning, paid → success, failed → danger, refunded → info
- `domain/units.ts`: `BusinessUnit = 'detailing'|'towing'|'personal-washing'`, `businessUnits`,
  `unitMeta[unit] = { name, summary{es,en} }`.

### Screens and device frame
- Story/meta: `parameters: { layout: 'fullscreen', device: { statusBar: 'auto'|'light'|'dark', background?: 'canvas'|'subtle' } }`.
- Screen root: flex column. `TopBar` first (pads the top safe area), content, then `BottomActionBar`
  or `BottomNav` last (sticky + `mt: 'auto'`). No TopBar → `pt: \`calc(${layout.safeAreaTop} + 24px)\``.
- Frame sets `--bs-safe-area-top/bottom` (falls back to `env()` outside Storybook).
- Viewports: `mobile`, `tablet`, `desktop`. Apariencia toolbar includes "Claro + Oscuro" side by side.
- Docs page with the 8 fields: `componentDocs({...})` from `storybook/docSpec` (template in DESIGN.md §6).
- Story helpers: `storybook/Showcase` (`Showcase`, `Specimen`), `storybook/labels` (`useStoryLabels`).

### Icons and brand
- `icons/<Name>Icon`: Detailing, Towing, PersonalWashing, ExteriorWash, Interior, Vacuum, EngineBay,
  Polish, Tires, TowTruck. `icons/unitIcon` → `unitIcon[unit]`. `createStrokeIcon(paths, name)` for new ones.
- `brand/Wordmark` `{ size?: 'sm'|'md'|'lg'|'xl', withMark?, orientation?: 'horizontal'|'stacked', markVariant? }`.
- `brand/BlackSixMark` `{ size?, variant?: 'orange'|'inverse'|'glyph', title? }`. Both provisional.

### Acciones — `components/actions/`
- `Button/Button` `{ variant?: 'primary'|'secondary'|'quiet'|'destructive', size?: 'sm'|'md'|'lg' (default lg) }`
  + MUI Button props (`startIcon`, `endIcon`, `fullWidth`, `loading`, `href`, `disabled`).
- `IconButton/IconButton` `{ label (required), icon, variant?: 'plain'|'outlined'|'filled'|'raised'|'accent', size?: 'sm'|'md'|'lg', badge?: boolean|number, tooltip?, pressed? }`.
  `accent` = orange circle with charcoal icon (send, next, search filter); counts as the view's orange primary.
- `Link/Link` `{ variant?: 'inline'|'standalone', size?: 'sm'|'md', external?, href? | onClick? }`.
- `ActionGroup/ActionGroup` `{ layout?: 'inline'|'stacked'|'responsive', align?: 'start'|'end'|'center'|'stretch', label? }`.
- `BottomActionBar/BottomActionBar` `{ children, summary?, position?: 'sticky'|'fixed'|'static' }`.

### Navegación móvil — `components/navigation/`
- `TopBar/TopBar` `{ title?, subtitle?, leading?, onBack?|backHref?, backLabel?, actions?, tone?: 'default'|'inverse', align?: 'center'|'start', children? (below title row; page scheme when inverse), safeArea? (default true), sticky?, headingLevel? }`.
- `BackButton/BackButton` `{ label?, variant?: 'outlined'|'raised'|'plain', onClick?|href? }`.
- `BottomNav/BottomNav` `{ side?: 'client'|'operator', destinations?, badges?: Record<string, boolean|number>, value, onChange, position? }`.
  Client: home, explore, bookings, chat, profile (Inicio, Explorar, Reservas, Chat, Perfil).
  Operator: today, jobs, messages, profile (Hoy, Trabajos, Mensajes, Perfil). `useNavDestinations(side)`.
- `Tabs/Tabs` `{ items: {value,label,count?,icon?,disabled?}[], value, onChange, label, idPrefix, variant?: 'fullWidth'|'scrollable'|'standard' }`;
  same file: `TabPanel { idPrefix, value, current }`.
- `SegmentedControl/SegmentedControl` `{ options: {value,label,icon?,disabled?}[], value, onChange, label, fullWidth?, size? }`.

### Estructura — `components/layout/`
- `Container/Container` `{ size?: 'mobile'|'content'|'wide'|'full', gutters? }`.
- `Section/Section` `{ title?, description?, actionHref?|onAction?, actionLabel?, headingLevel?, spacing?: 'sm'|'md'|'lg' }`.
- `SectionHeader/SectionHeader` `{ title, description?, actionHref?|onAction?, actionLabel? (default "Ver todo"/"See all"), headingLevel?, id? }`.
- `Divider/Divider` `{ label?, variant?: 'solid'|'dashed', inset?, spacing?, orientation?, semantic? }`.
- `Card/Card` `{ variant?: 'outlined'|'elevated'|'filled', density?: Density, flush?, href?|onClick?, label?, selected?, disabled?, component? }`.
- `ListRow/ListRow` `{ title, description?, leading?, trailing?, href?|onClick? (navigable, else static), density?, divider?, destructive?, disabled?, inset?: 'gutter'|'none', as?: 'li'|'div', chevron? (true; false when trailing carries the cue), emphasis? (bold title for unread) }`;
  same file: `ListGroup { label? }`.
- `KeyValue/KeyValue` `{ label, value, layout?: 'inline'|'stacked', emphasis?, density?, tabular? }`; same file: `KeyValueList { gap? }`.
- `Media/Media` `{ src?, alt (required), ratio?: '1:1'|'4:3'|'3:2'|'16:9'|'21:9'|'3:4'|'4:5'|number|'fill' (fill = parent's full height), radius?: 'none'|'sm'|'md'|'lg'|'xl'|'full' (full = circle), unit?: BusinessUnit, fallbackIcon?, topStart?, topEnd?, bottomStart?, bottomEnd?, children?, scrim?, loading?, objectPosition? }`.
  Designed fallback when there is no photo. Same file: `MediaRating { value, count?, showCount? }`,
  `MediaBookmark { saved, onToggle, itemName }`. Text over photos: `<SchemeScope scheme="dark">` + `scrim`.

### Campos — `components/fields/`
- `TextField/TextField` `{ label, hideLabel?, helperText?, error?: boolean|string, optional?, required?, readOnly?, clearable? + onClear?, startIcon?, endAdornment?, prefix?, size?: 'md'|'lg' }` + MUI TextField props.
- `TextArea/TextArea` `{ minRows?, maxRows?, maxLength? (counter) }`.
- `EmailField/EmailField`, `PhoneField/PhoneField` (`countryCode?='+1'`), `PasswordField/PasswordField` (`purpose?: 'current'|'new'`).
- `SearchField/SearchField` `{ label?, onSubmit?, onFilterClick?, filterLabel?, activeFilters? }`.
- `CodeField/CodeField` `{ variant?: 'identifier'|'otp', label, value: string, onChange(string), length? (otp, default 4), charset?: 'numeric'|'alphanumeric', maxLength?, helperText?, error?, required?, optional?, readOnly?, disabled?, clearable? }`.
  Keeps leading zeros. `CodeField/normalizeCode` → `normalizeCode()`.

### Selección — `components/selection/`
- `Checkbox/Checkbox` `{ label, description?, error? }` + MUI Checkbox props.
- `Radio/Radio`: `RadioGroup { label, options: {value,label,description?,disabled?}[], value, onChange, orientation?, helperText?, error?, required? }`, `Radio { label, value, checked, onChange }`.
- `Switch/Switch` `{ label, description?, checked, onChange(bool), disabled?, placement? }`.
- `Select/Select` `{ options: {value,label,disabled?}[], value, onChange, placeholder?, native?, renderOption? }` + TextField props.
- `Combobox/Combobox` `{ options: {value,label,description?,group?}[], value, onChange, multiple?, loading?, noOptionsText?, label, … }`.
- `FilterChip/FilterChip`: `FilterChipGroup { selectionMode: 'single'|'multiple', value, onChange, options: {value,label,icon?,count?,disabled?}[], label, overflow?: 'scroll'|'wrap', size? }`.

### Presentación de datos — `components/data-display/`
- `InitialsAvatar/InitialsAvatar` `{ name? (none = unassigned placeholder), src?, size?: 'xs'..'xl', decorative? }`; `initialsOf()`.
- `StatusBadge/StatusBadge` `{ dimension, status (typed per dimension), long?, size?: 'sm'|'md', variant?: 'soft'|'outline', announceDimension? }`; `statusIcon[dim][status]`.
- `Counter/Counter` `{ value, max?, tone?: 'brand'|'neutral'|'inverse', size?, children? (badge mode), label?, hideZero? }`.
- `Tag/Tag` `{ label, tone?: StatusTone|'inverse'|'outline', icon?, size? }`.
- `Price/Price` `{ amount, currency?, size?: 'sm'|'md'|'lg'|'xl', originalAmount?, from?, unit? }`.
- `AmountBreakdown/AmountBreakdown` `{ lines: {label, amount, kind?: 'charge'|'discount'|'free', detail?}[], total, totalLabel?, currency?, note?, density? }`.
- `IdentifierBlock/IdentifierBlock` `{ label, value, copyable?, variant?: 'block'|'inline', groupSize?, size?, compact? (one line + icon-only copy, for table rows) }` ("Copiado / Copied" for 2 s, announced).

## Phase 2A — overlays, feedback, screen states, desktop navigation, preferences

### Capas y menús — `components/overlays/`
- `ActionMenu/ActionMenu` `{ items: {value,label,icon?,destructive?,disabled?,onSelect?}[], label (required), trigger?: 'icon'|'button', triggerText?, onSelect?(value), align?: 'start'|'end' }`. Destructive items get a divider before them.
- `Dropdown/Dropdown<T>` `{ label, options: {value,label,disabled?}[], value, onChange, hideLabel?, size?: 'sm'|'md', fullWidth? }`. Toolbar control (`role="listbox"`); forms use `Select`.
- `Popover/Popover` `{ triggerLabel (required), triggerText?, title, children, actionLabel?, onAction?, placement?: 'bottom'|'top' }`.
- `BottomSheet/BottomSheet` `{ open, onClose, title, description?, children?, actions?, showClose?, closeLabel?, dismissible? (true), disablePortal? }`. Drag handle (swipe-down 96px closes), sticky actions, safe area. s38/s81 pattern.
- `SidePanel/SidePanel` `{ open, onClose, title, subtitle?, children, actions?, width?: 'md'(440)|'lg'(560), closeLabel?, dismissible?, disablePortal? }`. Modal.
- `ResponsiveDetail/ResponsiveDetail` `{ open, onClose, title: string, subtitle?, children, actions?, backLabel?, closeLabel?, disablePortal? }`. SidePanel ≥ 900px; full-screen Dialog with TopBar back + BottomActionBar below.
- `ConfirmDialog/ConfirmDialog` `{ open, onClose, onConfirm, title, description, confirmLabel?, cancelLabel?, variant?: 'default'|'destructive', loading?, disablePortal? }`; same file: `DiscardChangesDialog { open, onClose, onDiscard, disablePortal? }`.
- Inside the device frame, pass `disablePortal` so overlays stay within the 390×844 screen.

### Feedback — `components/feedback/`
- `FieldMessage/FieldMessage` `{ tone?: 'hint'|'error'|'success'|'warning'|'info', children, id?, live? }`.
- `InlineAlert/InlineAlert` `{ severity: 'success'|'warning'|'error'|'info', title?, children, action?, onClose?, closeLabel? }`.
- `Banner/Banner` `{ severity, title, children?, action?, dismissible? (false = persistent), onDismiss?, dismissLabel? }`. Persistent = confirmed booking.
- `Toast/Toast`: `ToastProvider { children, offsetBottom? }` + `useToast() → { show({message, severity?: 'neutral'|'success'|'warning'|'error'|'info', actionLabel?, onAction?, duration?: number|null}) → id, dismiss(id?) }`. The screen mounts the provider.
- `LoadingIndicator/LoadingIndicator` `{ variant?: 'spinner'|'inline'|'block', label?, size? }` ("Enviando…" / "Cargando…").
- `Skeleton/Skeleton`: `SkeletonGroup { children, label? }`, `SkeletonText { lines? }`, `SkeletonListRow { density?, inset? }`, `SkeletonCard { density? }`, `SkeletonPhotoCard`.
- `StepProgress/StepProgress` `{ steps: {id,label}[], current (0-based), variant?: 'responsive'|'compact'|'full', label? }`; same file: `useBookingSteps()` (Vehículo, Servicio, Horario, Pago, Confirmación).

### Estados de pantalla — `components/screen-states/`
- `EmptyState/EmptyState` `{ illustration?, title, description?, primaryAction?, secondaryAction?, layout?: 'page'|'inline', headingLevel?, role?: 'alert'|'status' }`.
- `EmptyState/Illustrations`: `EmptyIllustration`, `NoResultsIllustration`, `ErrorIllustration`, `OfflineIllustration`, `RestrictedIllustration` `{ size? }`.
- `StatePresets/StatePresets` (base props, `title` optional): `NoItemsState`, `NoResultsState { query?, onClear? }`, `ErrorState { onRetry?, retrying? }`, `OfflineState { onRetry?, retrying? }`, `RestrictedState { requiredRole?: 'operator'|'admin', onBack?, onRequestAccess? }`.
- `SuccessState/SuccessState` `{ title, description?, children?, primaryAction?, secondaryAction?, layout?: 'page'|'inline', headingLevel? }`. s22/s35/s76 pattern; page layout puts actions in BottomActionBar.

### Navegación de escritorio — `components/desktop-navigation/`
- `Sidebar/Sidebar` `{ items?: SidebarItem[] (default useSidebarItems()), value, onChange, role: StaffRole, collapsed?, onCollapsedChange?, footer?, label? }`; exports `useSidebarItems(badges?)`, `sidebarWidth` (248/72), `SidebarItem`, `StaffRole = 'operator'|'admin'`.
  Operator: Hoy, Trabajos, Agenda. Admin adds Personal, Clientes, Reportes, Configuración.
- `PageHeader/PageHeader` `{ title, description?, breadcrumbs?: BreadcrumbItem[], meta?, actions?, headingLevel? }`.
- `Breadcrumbs/Breadcrumbs` `{ items: {label, href?, onClick?}[], label?, maxItems? (4) }`.
- `UserMenu/UserMenu` `{ name, role: StaffRole, language, onLanguageChange, appearance, onAppearanceChange, onProfile, onLogout, compact?, placement?: 'above'|'below' }`.
- `AppShell/AppShell` `{ sidebar, children, width?: 'wide'|'full', height? (100vh) }`. Skip link + `main` landmark.

### Preferencias — `components/preferences/`
- `LanguageSelect/LanguageSelect` `{ value: Locale, onChange, label?, fullWidth?, size? }`.
- `AppearanceSelect/AppearanceSelect` `{ value: AppearanceMode ('light'|'dark'|'system'), onChange, label?, fullWidth?, size? }`; exports `AppearanceMode`.
- `AccountMenu/AccountMenu` `{ name, email, language, onLanguageChange, appearance, onAppearanceChange, onNavigate?(AccountDestination), onLogout }`; `AccountDestination = 'bookings'|'addresses'|'payments'|'help'`.

## Phase 2B — date & time, addresses, tables

### Fecha y hora — `components/date-time/`
- `Calendar/Calendar` `{ value: Dayjs|null, onChange(day), getDayState(day): DayState, onMonthChange?(month), loading?, minDate?, maxDate?, showLegend? (true), label (required) }`;
  `DayState = 'available'|'full'|'closed'|'none'`. Only `available` is selectable; selected = soft orange + border + check.
- `DayStrip/DayStrip` `{ start: Dayjs, count? (14), value: Dayjs|null, onChange(day), getDayState?(day): DayState, today?, label (required) }`. Radiogroup, roving tabindex; Hoy / Mañana / weekday.
- `TimeSlot/TimeSlot` `{ time: 'HH:mm', status?: SlotStatus ('available'|'full'|'closed'|'taken'), selected?, onSelect?, tabIndex? }`; `formatSlotTime(time, locale)`.
- `TimeSlotGroup/TimeSlotGroup` `{ slots: {value:'HH:mm', status?: SlotStatus}[], value: string|null, onChange(v), label (required), loading? }`.
  Groups Mañana/Tarde/Noche. If the selected slot stops being available, value is kept, the slot shows "Ocupado" and an alert offers the next free slot.
- `DateRangePicker/DateRangePicker` `{ value: {from: Dayjs|null, to: Dayjs|null}, onChange(range), label (required), presets? (true), today?, minDate?, maxDate? }`; type `DateRange`. Field height is 52px (no compact size yet).
- `DateNavigator/DateNavigator` `{ value: Dayjs, onChange(day), today?, size?: 'sm'|'md' }`.

### Direcciones — `components/address/`
- `MapCanvas/MapCanvas` `{ label (required), pins?: MapPin[], route?: MapPoint[], userLocation?: {x,y}, serviceArea?: {x,y,radius}, eta?: {label, x?, y?}, selectedPinId?, onPinSelect?(id|null), pinLabels?: 'selected'|'all'|'none', ratio? (4/3), seed? (7), rounded? (true), children? }`.
  `MapPin = { id, kind: 'address'|'auction'|'destination'|'service'|'unit', x, y, label }`, `MapPoint = [x, y]`; coordinates are 0–100 % of the map. SVG, no map library.
- `LocationCard/LocationCard` `{ address: AddressData, title, pinKind?, layout?: 'auto'|'stacked'|'inline', showMap? (true), onEdit?, actions? (true) }`;
  exports `AddressData { line1, line2?, city, state, zip, reference? }`, `formatAddress(a)`, `mapsHref(a)`. Address never truncated.
- `RouteSummary/RouteSummary` `{ origin: RouteStop, destination: RouteStop, trip?, onEditOrigin?, onEditDestination?, originLabel?, destinationLabel? }`;
  `RouteStop = { kind: 'auction'|'address', name, address: AddressData, auction?: { lot: string, code: string } }`.
- `AddressSearch/AddressSearch` `{ value, onChange(query), suggestions: {id, primary, secondary}[], onSelect(s), onUseCurrentLocation?, locating?, onManualEntry?, loading?, minChars? (3), autoFocus? }`.
- `AddressForm/AddressForm` `{ value: AddressFormValue, onChange(next), onSubmit?(value), errors?: AddressFormErrors, submitLabel?, loading?, stateOptions?, hideLabelChips? }`;
  `AddressFormValue = { label: 'home'|'office'|'other', customLabel, street, unit, city, state, zip, reference }`; exports `emptyAddressForm`, `validateAddressForm(value, locale)`.

### Tablas y bandejas — `components/tables/`
- `DataTable/DataTable` `DataTable<Row> { label (required), columns: Column<Row>[], rows, getRowId(row), sort?: SortState|null, onSortChange?(next), onRowClick?(row), activeRowId?, rowActions?(row): RowMenuItem[], getRowLabel?(row), density?, stickyHeader?, maxHeight?, renderMobileCard?(row), mobileBreakpoint? (640, container width), loading?, empty? }`;
  `Column<Row> = { id, header, cell(row), sortValue?(row), align?, minWidth?, hideHeader? }`, `SortState = { columnId, direction }`, `sortRows(rows, columns, sort, locale?)`.
- `FilterBar/FilterBar` `{ value: TrayFilters, onChange(next), assignees: {value,label}[], date?: {value: Dayjs, onChange, today?}, unitCounts?, resultCount?, searchPlaceholder? }`;
  `TrayFilters = { query, units: BusinessUnit[], assignee: 'all'|'unassigned'|<id>, status: BookingStatus|'all' }`; `emptyTrayFilters`, `countActiveFilters(f)`. The parent filters rows.
- `Pagination/Pagination` `{ page (1-based), pageSize, total, onPageChange(p), onPageSizeChange?(n), pageSizeOptions?, label? }`.
- `RowMenu/RowMenu` `{ items: RowMenuItem[], label (required), size?: 'sm'|'md' }`; `RowMenuItem = { id, label, icon?, onClick, destructive?, disabled?, dividerBefore? }`.
- `DataTable/todayAgendaExample.tsx` (story data, not a component): `agendaRows`, `filterAgenda`, `useAgendaColumns`, `useAgendaRowActions`, `AgendaMobileCard` (placeholder for the operator job card), `AgendaDetailDrawer`, `TodayAgenda`.

## Phase 3A — Black Seat components, domain types and mocks

### Domain — `domain/booking.ts`
- Types: `Localized`, `ServiceCategory`, `ServicePackage`, `ServiceOffering`, `OpeningHours`, `Center`, `Customer`, `Vehicle`,
  `CustomerAddress`, `Professional`, `AuctionYard`, `AuctionPickup`, `PaymentMethod`, `PriceLine`, `StatusChange`, `Receipt`,
  `Review`, `Offer`, `GalleryItem`.
- `Booking` keeps the three dimensions apart: `status: BookingStatus`, `assignment: { status, professionalId? }`,
  `payment: { status, methodId, reference? }`. `BookingDetail` = Booking with resolved package, customer, vehicle,
  center?, assignee?, paymentMethod, yard?.
- `Job` (operator row) `{ id, date, time, unit, service, durationMin, customer, location, auction?, assigneeId?, status, assignment, payment, nextAction: 'assign'|'start'|'complete'|'view' }`.
- Lot, pickup code, ZIP and booking id are strings. `time` "HH:mm", `date` "YYYY-MM-DD", `StatusChange.at` "YYYY-MM-DDTHH:mm".

### Mocks — `mocks/` (mock "today" = Wed 2026-11-25, Miami area, USD). Read-only for screens.
- `catalog.ts`: `mockTodayIso`, `mockToday`, `mockUnits`, `getUnit(unit)`, `serviceCategories`, `getCategoryName(id, locale)`,
  `servicePackages` (8), `getPackage(id)`, `getPackagesForUnit(unit)`, `serviceOfferings`, `getServiceOffering(unit)`, `unitHours`,
  `centers` (Doral, Brickell, Hialeah, Fort Lauderdale), `getCenter(id)`, `auctionYards` (IAA, Copart), `getYard(id)`, `auctionName`,
  `paymentMethods` (card, Apple Pay, Zelle, cash), `getPaymentMethod(id)`.
- `people.ts`: `currentCustomerId` ('cus-andrea'), `customers`, `getCustomer`, `vehicles`, `getVehicle`, `vehicleName`,
  `customerAddresses`, `getAddress`, `addressesOf(customerId)`, `professionals` (6), `getProfessional`, `professionalsForUnit(unit)`.
- `bookings.ts`: `bookings` (19), `getBooking(id)`, `getBookingDetail(id)` (throws on unknown id), `bookingToJob(b)`,
  `bookingLocation(b)`, `todayJobs` (13), `getJob(id)`, `jobAuctionLabel`, `customerUpcoming(customerId)`, `customerPast(customerId)`,
  `receipts`, `getReceipt(bookingId)`, `reviews` (6), `offers` (4, #ParaTi), `galleryItems` (6).
- `availability.ts`: `getDayState(day, unit)`, `getSlots(day, unit)`, `mockSlotDay` (Fri 27 Nov). Sundays and Thu 26 Nov
  (Thanksgiving) closed; 2 Dec full.
- Key bookings:
  - BS-24117: next appointment. Detailing Premium; confirmed, unassigned, payment pending; has a discount.
  - BS-24120: Towing, pending; Copart lot 05503318, code 0071.
  - BS-24119: failed payment.
  - BS-24118: assigned and paid.
  - BS-24090: completed, with receipt PAY-9F4K2L.
  - BS-24071: cancelled and refunded.
- Today's jobs include BS-24102 (Towing, IAA Miami North, lot 04217753, code 0093, unassigned).
- Shared helpers: `blacksix/shared/format.ts` (dates, durations, hours, `addMinutes`, `auctionLabel`).

### Cliente components — `blacksix/<Name>/<Name>`
- `BusinessUnitCard` `{ unit, variant?: 'hero'|'compact', photoSrc?, fromPrice?, selected?, onSelect?(unit), href? }`.
- `PackageCard` `{ pkg: ServicePackage, selected?, onSelect?(id), headingLevel? }` (selection tokens + check when selected).
- `ServiceSheet` `{ service: ServiceOffering, photoSrc?, showPhoto? (true; false when the screen already has a hero), fromPrice, categoryLabels?, placeLabel?, onChooseTime?, action?: 'inline'|'none' }`
  ('none' when the screen supplies a BottomActionBar).
- `AppointmentPicker` `{ value: {day: Dayjs|null, time: string|null}, onChange, start, today?, days?, getDayState, slots: SlotOption[], loading?, durationMin?, showCalendar? }`.
  Keeps data when a slot is taken.
- `ProfessionalCard` `{ professional?: Professional, unit?, baseLabel?, awaitingNote? }`. Without `professional` = "Pendiente de asignación".
- `AuctionPickupForm` `{ value: AuctionPickupValue {auction, yardId, lot, code, date}, onChange, yards, errors?, start, today?, getDayState?, onSubmit?, submitLabel?, loading? }`;
  `emptyAuctionPickup`, `validateAuctionPickup(value, locale)` (lot 6–8 digits, code 4 digits).
- `BookingSummary` `{ booking: BookingDetail, onEdit?(field: 'service'|'schedule'|'location'|'vehicle'|'auction'|'payment'), hideAmounts? }`.
- `PaymentPanel` `{ methods, value, onChange?, lines, total, status, reference?, mode?: 'checkout'|'receipt', issuedAt?, secureFields? }`.
  No raw card inputs: `secureFields` is the payment provider's slot.
- `NextAppointmentCard` `{ booking: BookingDetail, onView?(id), href? }`.
- `StatusHistory` `{ changes: StatusChange[], audience?: 'customer'|'operator', order?: 'asc'|'desc', showUpcoming?, label? }`
  (`customer` = Track Order timeline).

### Operator components — `blacksix/<Name>/<Name>`
- `OperatorJobCard` `{ job: Job, assigneeName?, variant?: 'card'|'embedded', onAction?(action, job) }`. `embedded` for
  `DataTable.renderMobileCard`. Same file: `JobNextAction`, `JobAssignee`, `JobAuctionBlock`.
- `DailyJobsTray` `{ jobs, day, onDayChange, today?, staff: {id,name}[], onOpenJob?, onAction?, activeJobId?, pageSize?, loading? }`; `filterJobs`.
- `AssignmentPanel` `{ open, onClose, job: Job|null, professionals, jobs, value, onChange, onConfirm(id), confirming?, disablePortal? }`;
  `getAssignmentConflicts(job, pro, jobs)` ('unit' and 'dayoff' block; 'overlap' warns).
- `OrderDetail` `{ order: BookingDetail, role: 'operator'|'admin', onAction?(OrderAction), actions?: 'inline'|'none' }`;
  `getOrderActions(order, role)`, `OrderActionButtons`.
