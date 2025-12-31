interface LogData {
  level: 'info' | 'warn' | 'error'
  message: string
  timestamp?: string
  userId?: string
  endpoint?: string
  duration?: number
  error?: string
  [key: string]: any
}

export const logger = {
  info: (message: string, data?: Record<string, any>) => {
    console.log(JSON.stringify({
      level: 'info',
      message,
      timestamp: new Date().toISOString(),
      ...data
    }))
  },

  warn: (message: string, data?: Record<string, any>) => {
    console.warn(JSON.stringify({
      level: 'warn',
      message,
      timestamp: new Date().toISOString(),
      ...data
    }))
  },

  error: (message: string, error?: Error | string, data?: Record<string, any>) => {
    console.error(JSON.stringify({
      level: 'error',
      message,
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      ...data
    }))
  }
}