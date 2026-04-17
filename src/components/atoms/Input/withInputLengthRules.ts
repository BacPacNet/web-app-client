export const PASSWORD_MAX_LENGTH = 16
export const DEFAULT_FIELD_MAX_LENGTH = 50

export function getDefaultMaxLengthForInput(
  type: string,
  options?: { lengthRule?: 'password' | 'email' | 'default'; readOnly?: boolean }
): number | undefined {
  if (options?.readOnly) return undefined

  const rule = options?.lengthRule ?? (type === 'email' ? 'email' : type === 'password' ? 'password' : 'default')

  if (rule === 'email') return undefined
  if (rule === 'password') return PASSWORD_MAX_LENGTH
  return DEFAULT_FIELD_MAX_LENGTH
}

export function withInputLengthRules<TRules extends Record<string, any> = Record<string, any>>(type: string, rules: TRules = {} as TRules): TRules {
  const { maxLength: existingMaxLength, ...rest } = rules as any
  const defaultMaxLength = getDefaultMaxLengthForInput(type)

  return {
    ...rest,
    ...(existingMaxLength !== undefined || defaultMaxLength === undefined
      ? {}
      : {
          maxLength: {
            value: defaultMaxLength,
            message: type === 'password' ? 'Password must be less than 16 characters' : `This field must be less than ${defaultMaxLength} characters`,
          },
        }),
  } as TRules
}
