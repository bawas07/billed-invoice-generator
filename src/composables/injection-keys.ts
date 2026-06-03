// ---------------------------------------------------------------------------
// Injection Keys — typed InjectionKey symbols for provide/inject composables
// Layer: composables (depends on: Vue, types)
// ---------------------------------------------------------------------------
// Each composable exposes a typed InjectionKey so App.vue can provide and
// child components can inject with full type safety. This avoids prop
// drilling and keeps components decoupled from the composable lifecycle.
// ---------------------------------------------------------------------------

import type { InjectionKey, Ref } from 'vue'
import type { UseInvoiceReturn } from './useInvoice'
import type { UseJsonIOReturn } from './useJsonIO'
import type { UseLogoUploadReturn } from './useLogoUpload'
import type { UseToastReturn } from './useToast'
import type { UseHistoryReturn } from './useHistory'
import type { UseTemplateReturn } from './useTemplate'
import type { InvoiceData } from '@/types'

/**
 * Entry mode passed from App.vue (via LandingView events) to AppView.
 * Determines what the app should do on mount.
 */
export type EntryMode = {
  type: 'new' | 'continue' | 'upload'
  payload?: InvoiceData
} | null

export const ENTRY_MODE_KEY: InjectionKey<Ref<EntryMode>> = Symbol('entryMode')

/** Sidebar tab identifier for tab control injection */
export type SidebarTab = 'editor' | 'history'

export const SIDEBAR_TAB_KEY: InjectionKey<Ref<SidebarTab>> = Symbol('sidebarTab')

export const INVOICE_KEY: InjectionKey<UseInvoiceReturn> = Symbol('useInvoice')
export const JSON_IO_KEY: InjectionKey<UseJsonIOReturn> = Symbol('useJsonIO')
export const LOGO_UPLOAD_KEY: InjectionKey<UseLogoUploadReturn> = Symbol('useLogoUpload')
export const TOAST_KEY: InjectionKey<UseToastReturn> = Symbol('useToast')
export const HISTORY_KEY: InjectionKey<UseHistoryReturn> = Symbol('useHistory')
export const TEMPLATE_KEY: InjectionKey<UseTemplateReturn> = Symbol('useTemplate')
