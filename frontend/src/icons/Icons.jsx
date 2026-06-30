const Icon = ({ d, size = 16, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={{ flexShrink: 0 }}
  >
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
)

const Icons = {
  Dashboard: <Icon d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10" size={16} />,
  Board: <Icon d={['M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18']} size={16} />,
  Doc: <Icon d={['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6', 'M16 13H8', 'M16 17H8', 'M10 9H8']} size={16} />,
  Users: <Icon d={['M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2', 'M23 21v-2a4 4 0 0 0-3-3.87', 'M16 3.13a4 4 0 0 1 0 7.75']} size={16} />,
  Plus: <Icon d="M12 5v14M5 12h14" size={16} />,
  ChevLeft: <Icon d="M15 18l-6-6 6-6" size={16} />,
  ChevRight: <Icon d="M9 18l6-6-6-6" size={16} />,
  Search: <Icon d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0" size={16} />,
  Bell: <Icon d={['M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9', 'M13.73 21a2 2 0 0 1-3.46 0']} size={16} />,
  Menu: <Icon d="M3 12h18M3 6h18M3 18h18" size={18} />,
  Calendar: <Icon d={['M8 2v4m8-4v4', 'M3 10h18', 'M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z']} size={9} />,
  MoreH: <Icon d="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm7 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM5 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" size={14} />,
  X: <Icon d="M18 6L6 18M6 6l12 12" size={14} />,
  Check: <Icon d="M20 6L9 17l-5-5" size={12} />,
  Circle: <Icon d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" size={12} />,
  Trending: <Icon d="M23 6l-9.5 9.5-5-5L1 18" size={12} />,
  Alert: <Icon d={['M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z', 'M12 9v4', 'M12 17h.01']} size={12} />,
  CheckCircle: <Icon d={['M22 11.08V12a10 10 0 1 1-5.93-9.14', 'M22 4L12 14.01l-3-3']} size={12} />,
  ArrowRight: <Icon d="M5 12h14M12 5l7 7-7 7" size={14} />,
  H1: <Icon d="M4 6h4m0 0v12m0-12h8m-8 6h8m0-6v12m0-12h4" size={13} />,
  H2: <Icon d="M4 6h4m0 0v12m0-12h8m-8 6h8m0-6v12" size={13} />,
  TypeIcon: <Icon d="M4 7V4h16v3M9 20h6M12 4v16" size={13} />,
  Bold: <Icon d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6zm0 8h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" size={13} />,
  List: <Icon d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" size={13} />,
  Hash: <Icon d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18" size={13} />,
  Save: <Icon d={['M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z', 'M17 21v-8H7v8', 'M7 3v5h8']} size={12} />,
  Eye: <Icon d={['M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z', 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z']} size={12} />,
  Target: <Icon d={['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z', 'M12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12z', 'M12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4z']} size={16} />,
  Zap: <Icon d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" size={16} />,
  BarChart: <Icon d="M12 20V10M18 20V4M6 20v-4" size={16} />,
  Clock: <Icon d={['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z', 'M12 6v6l4 2']} size={14} />,
  Divider: <Icon d="M5 12h14" size={13} />,
  Logout: <Icon d={['M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4', 'M16 17l5-5-5-5', 'M21 12H9']} size={16} />,
}

export default Icons
