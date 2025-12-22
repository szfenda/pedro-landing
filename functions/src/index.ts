import { onRequest } from 'firebase-functions/v2/https'
import next from 'next'

const nextjsDistDir = require('./next.config.js').distDir

const nextjsServer = next({
  dev: false,
  conf: {
    distDir: nextjsDistDir,
  },
})
const nextjsHandle = nextjsServer.getRequestHandler()

export const nextjsFunc = onRequest(async (req, res) => {
  await nextjsServer.prepare()
  return nextjsHandle(req, res)
})