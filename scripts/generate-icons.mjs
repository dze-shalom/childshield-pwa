import { deflateRawSync } from 'zlib'
import { writeFileSync, mkdirSync } from 'fs'

// CRC32 for PNG chunks
const T = new Uint32Array(256)
for (let i = 0; i < 256; i++) {
  let c = i
  for (let j = 0; j < 8; j++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  T[i] = c
}
function crc(b) {
  let c = 0xffffffff
  for (const x of b) c = T[(c ^ x) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}
function chunk(type, data) {
  const t = Buffer.from(type), l = Buffer.alloc(4), cr = Buffer.alloc(4)
  l.writeUInt32BE(data.length)
  cr.writeUInt32BE(crc(Buffer.concat([t, data])))
  return Buffer.concat([l, t, data, cr])
}

function makePNG(sz) {
  const BG  = [8,   14,  26]   // #080E1A  dark navy
  const RED = [239, 68,  68]   // #EF4444  brand red
  const WHT = [255, 255, 255]  // white

  const raw = Buffer.alloc((sz * 3 + 1) * sz)
  const cx = sz / 2, cy = sz / 2

  // Shield shape: defined as normalised polygon (0..1 coords), centered
  // Points: top-centre arc, sides taper, bottom point
  function inShield(x, y) {
    const nx = (x - cx) / (sz * 0.38)   // normalise to -1..1
    const ny = (y - cy) / (sz * 0.42)
    // Shield top: semicircle above centre
    if (ny < -0.05) {
      return nx * nx + ny * ny < 1
    }
    // Shield body: tapered rectangle
    const taper = 1 - ny * 0.6
    if (ny < 0.75) return Math.abs(nx) < taper
    // Bottom point
    return Math.abs(nx) < (1 - ny) * 2.2
  }

  // Inner shield cutout (hollow effect)
  function inInner(x, y) {
    const nx = (x - cx) / (sz * 0.26)
    const ny = (y - cy) / (sz * 0.30)
    if (ny < -0.05) return nx * nx + ny * ny < 1
    const taper = 1 - ny * 0.6
    if (ny < 0.75) return Math.abs(nx) < taper
    return Math.abs(nx) < (1 - ny) * 2.2
  }

  for (let y = 0; y < sz; y++) {
    raw[y * (sz * 3 + 1)] = 0  // filter byte
    for (let x = 0; x < sz; x++) {
      let col = BG
      if (inShield(x, y)) col = RED
      if (inInner(x, y))  col = WHT
      // "C" letter: white bar across inner shield centre
      const nx = (x - cx) / (sz * 0.14)
      const ny = (y - cy) / (sz * 0.10)
      if (nx * nx + ny * ny < 1 && nx < 0.1) col = RED  // "C" cutout
      const p = y * (sz * 3 + 1) + 1 + x * 3
      raw[p] = col[0]; raw[p + 1] = col[1]; raw[p + 2] = col[2]
    }
  }

  const hdr = Buffer.alloc(13)
  hdr.writeUInt32BE(sz, 0); hdr.writeUInt32BE(sz, 4)
  hdr[8] = 8; hdr[9] = 2  // 8-bit RGB

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),  // PNG signature
    chunk('IHDR', hdr),
    chunk('IDAT', deflateRawSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

mkdirSync('public/icons', { recursive: true })
writeFileSync('public/icons/icon-192.png', makePNG(192))
writeFileSync('public/icons/icon-512.png', makePNG(512))
console.log('Icons generated: public/icons/icon-192.png + icon-512.png')
