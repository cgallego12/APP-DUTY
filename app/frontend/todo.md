# Skyfree Shop - Duty Free Analytics Dashboard

## Design Style
- **References**: Power BI dashboards, modern analytics tools (Tableau, Metabase)
- **Color Palette**: 
  - Primary: #0EA5E9 (sky blue - matching "Skyfree")
  - Accent: #F59E0B (amber/gold - luxury duty-free feel)
  - Success: #10B981 (emerald)
  - Danger: #EF4444 (red)
  - Background: #0F172A (dark slate)
  - Cards: #1E293B
- **Typography**: Inter, tabular-nums for metrics
- **Layout**: Sticky header with tabs + responsive grid of charts

## Development Tasks
- [x] Install dependencies: xlsx (SheetJS) and recharts for charts
- [x] Create Excel parsing utility (src/lib/excelParser.ts) - handles Sales and Departures files
- [x] Create data analytics utility (src/lib/analytics.ts) - computes KPIs, aggregations
- [x] Create FileUploader component with drag & drop for both Sales and Departures files
- [x] Create KPI cards component showing total sales, transactions, avg ticket, units
- [x] Create Sales Dashboard with charts: by date, by seller, by origin/destination, by nationality, top SKUs
- [x] Create Inventory/Departures Dashboard with charts: stock status, days without sales, top moving SKUs
- [x] Create global Filters component (date range, currency, origin, nationality)
- [x] Create Data Table component with search, sort, pagination, Excel export
- [x] Integrate everything in Index.tsx with tabs: Upload | Ventas | Inventario | Datos
- [x] Run pnpm lint and build
- [x] Add authentication with admin/viewer roles (first user becomes admin, others are viewers)
- [x] Persist uploaded datasets to backend so viewers can see latest data
- [x] Gate upload UI to admins only; viewers only consume dashboards