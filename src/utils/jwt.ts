/**
 * Utilidad para decodificar y obtener información del token JWT
 */

export interface JwtPayload {
  sub: string
  email: string | string[]
  name: string
  userId: string
  jti: string
  exp: number
  iat: number
  iss: string
  aud: string
}

/**
 * Decodifica un token JWT sin verificar la firma
 * @param token - Token JWT
 * @returns Payload del token decodificado o null si es inválido
 */
export function decodeJwt(token: string): JwtPayload | null {
  try {
    if (!token) {
      console.error('decodeJwt: token vacío o indefinido')
      return null
    }

    const parts = token.split('.')
    if (parts.length !== 3) {
      console.error('decodeJwt: formato de token inválido', token)
      return null
    }

    const payload = parts[1]
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const binary = atob(base64)
    const decoded = decodeURIComponent(
      Array.from(binary)
        .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`)
        .join('')
    )
    return JSON.parse(decoded) as JwtPayload
  } catch (error) {
    console.error('Error decoding JWT:', error)
    return null
  }
}

/**
 * Obtiene el userId del token JWT
 * @param token - Token JWT
 * @returns userId o null si no se puede obtener
 */
export function getUserIdFromToken(token: string): string | null {
  const payload = decodeJwt(token)
  return payload?.userId || payload?.sub || null
}

/**
 * Obtiene el email del token JWT
 * @param token - Token JWT
 * @returns email o null si no se puede obtener
 */
export function getEmailFromToken(token: string): string | null {
  const payload = decodeJwt(token)
  if (!payload) return null
  
  if (typeof payload.email === 'string') {
    return payload.email
  } else if (Array.isArray(payload.email) && payload.email.length > 0) {
    return payload.email[0]
  }
  
  return null
}

/**
 * Obtiene el nombre del usuario del token JWT
 * @param token - Token JWT
 * @returns nombre o null si no se puede obtener
 */
export function getNameFromToken(token: string): string | null {
  const payload = decodeJwt(token)
  return payload?.name || null
}

/**
 * Verifica si un token JWT está expirado
 * @param token - Token JWT
 * @returns true si está expirado, false si no
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeJwt(token)
  if (!payload || !payload.exp) {
    return true
  }

  const currentTime = Math.floor(Date.now() / 1000)
  return payload.exp < currentTime
}

/**
 * Obtiene toda la información del usuario desde el token JWT
 * @param token - Token JWT
 * @returns Objeto con información del usuario o null
 */
export function getUserFromToken(token: string): { id: string; email: string; name: string } | null {
  const payload = decodeJwt(token)
  if (!payload) return null

  const userId = payload.userId || payload.sub
  const email = typeof payload.email === 'string' 
    ? payload.email 
    : (Array.isArray(payload.email) && payload.email.length > 0 ? payload.email[0] : null)
  const name = payload.name || ''

  if (!userId || !email) return null

  return {
    id: userId,
    email,
    name,
  }
}

