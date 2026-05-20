// ---------------------------------------------------------------------------
// Injection Keys — typed InjectionKey symbols for provide/inject composables
// Layer: composables (depends on: Vue, types)
// ---------------------------------------------------------------------------
// Each composable exposes a typed InjectionKey so App.vue can provide and
// child components can inject with full type safety. This avoids prop
// drilling and keeps components decoupled from the composable lifecycle.
// ---------------------------------------------------------------------------

import type { InjectionKey } from 'vue'
import type { UseInvoiceReturn } from './useInvoice'
import type { UseJsonIOReturn } from './useJsonIO'
import type { UseLogoUploadReturn } from './useLogoUpload'
import type { UseToastReturn } from './useToast'
import type { UseHistoryReturn } from './useHistory'
import type { UseTemplateReturn } from './useTemplate'

export const INVOICE_KEY: InjectionKey<UseInvoiceReturn> = Symbol('useInvoice')
export const JSON_IO_KEY: InjectionKey<UseJsonIOReturn> = Symbol('useJsonIO')
export const LOGO_UPLOAD_KEY: InjectionKey<UseLogoUploadReturn> = Symbol('useLogoUpload')
export const TOAST_KEY: InjectionKey<UseToastReturn> = Symbol('useToast')
export const HISTORY_KEY: InjectionKey<UseHistoryReturn> = Symbol('useHistory')
export const TEMPLATE_KEY: InjectionKey<UseTemplateReturn> = Symbol('useTemplate')
