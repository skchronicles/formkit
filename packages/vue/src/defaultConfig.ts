import { FormKitOptions, FormKitLibrary } from '@formkit/core'
import { extend } from '@formkit/utils'
import * as defaultRules from '@formkit/rules'
import {
  createValidationPlugin,
  FormKitValidationRule,
} from '@formkit/validation'
import {
  createI18nPlugin,
  FormKitLocale,
  FormKitLocaleRegistry,
  en,
} from '@formkit/i18n'
import { createLibraryPlugin, inputs as defaultInputs } from '@formkit/inputs'
import bindings from './bindings'
import '@formkit/dev'

interface PluginConfigs {
  rules: Record<string, FormKitValidationRule>
  locales: FormKitLocaleRegistry
  inputs: FormKitLibrary
  messages: Record<string, Partial<FormKitLocale>>
}

/**
 * The allowed options for defaultConfig.
 * @public
 */
export type DefaultConfigOptions = FormKitOptions &
  Partial<PluginConfigs> &
  Record<string, unknown>

/**
 * Default configuration options. Includes all validation rules,
 * en i18n messages.
 * @public
 */
const defaultConfig = (options: DefaultConfigOptions = {}): FormKitOptions => {
  const {
    rules = {},
    locales = {},
    inputs = {},
    messages = {},
    locale = undefined,
    ...nodeOptions
  } = options
  /**
   * The default configuration includes the validation plugin,
   * with all core-available validation rules.
   */
  const validation = createValidationPlugin({
    ...defaultRules,
    ...(rules || {}),
  })

  /**
   * Includes the i18n plugin with only the english language
   * messages.
   */
  const i18n = createI18nPlugin(
    extend({ en, ...(locales || {}) }, messages) as FormKitLocaleRegistry
  )

  /**
   * Create the library of inputs that are generally available. This default
   * config imports all "native" inputs by default, but
   */
  const library = createLibraryPlugin(defaultInputs, inputs)

  return extend(
    {
      plugins: [library, bindings, i18n, validation],
      ...(!locale ? {} : { config: { locale } }),
    },
    nodeOptions || {},
    true
  ) as FormKitOptions
}

export default defaultConfig
