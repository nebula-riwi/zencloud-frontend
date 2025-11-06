import { z } from 'zod'

// Mensajes de error personalizados en español
const requiredError = 'Este campo es requerido'
const invalidEmailError = 'Email inválido'
const minLengthError = (min: number) => `Debe tener al menos ${min} caracteres`
const maxLengthError = (max: number) => `Debe tener máximo ${max} caracteres`

// Schema para Login
export const loginSchema = z.object({
  email: z
    .string({ required_error: requiredError })
    .min(1, requiredError)
    .email(invalidEmailError),
  password: z
    .string({ required_error: requiredError })
    .min(1, requiredError)
    .min(6, minLengthError(6)),
})

export type LoginFormData = z.infer<typeof loginSchema>

// Schema para Register
export const registerSchema = z.object({
  name: z
    .string({ required_error: requiredError })
    .min(1, requiredError)
    .min(2, minLengthError(2))
    .max(100, maxLengthError(100)),
  email: z
    .string({ required_error: requiredError })
    .min(1, requiredError)
    .email(invalidEmailError),
  password: z
    .string({ required_error: requiredError })
    .min(1, requiredError)
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
    ),
})

export type RegisterFormData = z.infer<typeof registerSchema>

// Composable para validación de formularios
export function useFormValidation<T extends z.ZodType>(schema: T) {
  const validate = (data: unknown): { success: boolean; data?: z.infer<T>; errors?: Record<string, string> } => {
    try {
      const validatedData = schema.parse(data)
      return { success: true, data: validatedData }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0].toString()] = err.message
          }
        })
        return { success: false, errors }
      }
      return { success: false, errors: { general: 'Error de validación' } }
    }
  }

  const validateField = (field: string, value: unknown): string | undefined => {
    try {
      // Validar solo un campo específico
      const fieldSchema = (schema as any).shape[field]
      if (fieldSchema) {
        fieldSchema.parse(value)
      }
      return undefined
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.errors[0]?.message
      }
      return 'Error de validación'
    }
  }

  return { validate, validateField }
}

