import init, { ZipHandle } from '../wasm/zip_core'

let initialized = false

export async function initWasm(): Promise<void> {
  if (!initialized) {
    await init()
    initialized = true
  }
}

export { ZipHandle }

export async function loadArchive(data: Uint8Array): Promise<ZipHandle> {
  await initWasm()
  return new ZipHandle(data)
}
