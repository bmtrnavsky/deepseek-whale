// DeepSeek Whale — titlebar chip showing DeepSeek API peak/off-peak status.
// Peak windows are fixed UTC slots: 01:00-04:00 and 06:00-10:00 UTC,
// Monday through Friday only. Weekends (and Chinese public holidays)
// are off-peak in full. Source: https://api-docs.deepseek.com/quick_start/pricing
// Peak = full price (grey whale), off-peak = half price (blue whale).
// Repaints every 30s by re-registering. No backend, no API key, clock math.
import { PALETTE_AREA, TITLEBAR_AREAS, haptic, host } from '@hermes/plugin-sdk'
import { jsx } from 'react/jsx-runtime'

const ID = 'deepseek-whale'

// [startHour, endHour) in UTC, weekdays only (getUTCDay 1-5).
const PEAK_WINDOWS = [[1, 4], [6, 10]]

function isPeak(date) {
  var day = date.getUTCDay() // 0 = Sunday, 6 = Saturday
  if (day === 0 || day === 6) return false
  var h = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600
  return PEAK_WINDOWS.some(function (w) { return h >= w[0] && h < w[1] })
}

function nextSwitch(now) {
  var peak = isPeak(now)
  var cursor = new Date(now.getTime())
  cursor.setUTCSeconds(0, 0)
  cursor.setUTCMinutes(cursor.getUTCMinutes() + 1)
  // Minute-by-minute sweep; the longest jump is the weekend (~3 days),
  // so an 8-day margin covers it without any day arithmetic.
  for (var i = 0; i < 60 * 24 * 8; i++) {
    if (isPeak(cursor) !== peak) return cursor
    cursor.setUTCMinutes(cursor.getUTCMinutes() + 1)
  }
  return null
}

function whaleStatus(now) {
  now = now || new Date()
  var inPeak = isPeak(now)
  var next = nextSwitch(now)
  var mins = next ? Math.max(1, Math.round((next - now) / 60000)) : 0
  return { inPeak: inPeak, minsToSwitch: mins }
}

function detailLine() {
  const st = whaleStatus()
  const hh = Math.floor(st.minsToSwitch / 60)
  const mm = st.minsToSwitch % 60
  const when = hh > 0 ? hh + 'h ' + mm + 'm' : mm + 'm'
  return st.inPeak
    ? 'DeepSeek PEAK x1.0, half price in ' + when
    : 'DeepSeek OFF-PEAK x0.5, peak in ' + when
}

function WhaleButton() {
  const st = whaleStatus()
  return jsx('button', {
    type: 'button',
    title: detailLine(),
    onClick: function () {
      haptic('tap')
      host.notify({ kind: 'info', message: detailLine() })
    },
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      padding: '2px 6px',
      fontSize: '12px',
      color: 'var(--ui-text-secondary)',
      // blue whale at half price, grey whale at peak
      filter: st.inPeak ? 'grayscale(1) opacity(0.6)' : 'none'
    },
    children: [
      jsx('span', { key: 'w', style: { fontSize: '15px', lineHeight: 1 }, children: '🐳' }),
      jsx('span', { key: 't', children: st.inPeak ? 'PEAK' : 'x0.5' })
    ]
  })
}

export default {
  id: ID, // must match the folder name
  name: 'DeepSeek Whale',
  register(ctx) {
    let disposeWhale = null

    const paint = function () {
      if (disposeWhale) disposeWhale()
      disposeWhale = ctx.register({
        id: 'whale',
        area: TITLEBAR_AREAS.right,
        order: 999,
        render: function () { return jsx(WhaleButton, {}) }
      })
    }

    paint()
    const timer = setInterval(paint, 30000)
    if (ctx.onDispose) ctx.onDispose(function () { clearInterval(timer) })

    ctx.register({
      id: 'status',
      area: PALETTE_AREA,
      data: {
        id: 'deepseek-whale.status',
        label: 'DeepSeek Whale: peak status',
        keywords: ['deepseek', 'peak', 'whale', 'pricing'],
        run: function () { host.notify({ kind: 'info', message: detailLine() }) }
      }
    })
  }
}
