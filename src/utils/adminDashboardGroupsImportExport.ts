import type { AdminDashboardFilteredGroupsExportGroup } from '@/services/admin-dashboard-auth'
import * as XLSX from 'xlsx'

const GROUP_IMPORT_HEADERS = ['Group Type', 'Group Name', 'Member List', 'Access', 'Label', 'Admin ID', 'Category', 'Group Description'] as const

const formatCategory = (category?: Record<string, string[]> | null) => {
  if (!category || Object.keys(category).length === 0) return ''
  return JSON.stringify(category)
}

const mapGroupToImportRow = (group: AdminDashboardFilteredGroupsExportGroup): string[] => [
  group.communityGroupLabel || '',
  group.title || '',
  group.users.map((user) => user._id).join(', '),
  group.communityGroupAccess || '',
  group.communityGroupType || '',
  group.adminUserId || '',
  formatCategory(group.communityGroupCategory),
  group.description || '',
]

export const downloadGroupImportTemplate = () => {
  const worksheet = XLSX.utils.aoa_to_sheet([Array.from(GROUP_IMPORT_HEADERS)])
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Groups')
  XLSX.writeFile(workbook, 'groups-import-template.xlsx', { bookType: 'xlsx' })
}

export const downloadGroupsExportAsImportTemplate = (groups: AdminDashboardFilteredGroupsExportGroup[], fileName: string) => {
  const worksheet = XLSX.utils.aoa_to_sheet([Array.from(GROUP_IMPORT_HEADERS), ...groups.map(mapGroupToImportRow)])
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Groups')
  XLSX.writeFile(workbook, `${fileName}.xlsx`, { bookType: 'xlsx' })
}
