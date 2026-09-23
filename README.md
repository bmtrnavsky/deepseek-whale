# 🐳 DeepSeek Whale — Peak/Off-Peak Pricing Indicator for Hermes Agent Desktop

A live DeepSeek API pricing indicator for the [Hermes Agent](https://github.com/NousResearch/hermes-agent) desktop app. A whale in the titlebar tells you at a glance whether DeepSeek is in **peak hours (full price)** or **off-peak hours (half-price discount)**, so you never burn full-price tokens by accident.

- 🔵 **Off-peak = half price** — full-color blue whale with `x0.5`
- ⚪ **Peak = full price** — greyed-out whale with `PEAK`

Click the whale (or hover) for a live countdown to the next pricing switch. Repaints every 30 seconds. No backend, no API key — pure clock math against DeepSeek's fixed UTC peak windows (01:00–04:00 and 06:00–10:00 UTC, Monday–Friday; weekends always off-peak).

Also answers to Ctrl+K → `DeepSeek Whale: peak status`.

## Why this exists

DeepSeek charges full price during peak hours and ~50% off during off-peak hours. That pricing question — *"am I in peak right now?"* — deserves an answer without opening a browser tab. This plugin puts it in the Hermes desktop titlebar, next to the settings gear.

Peak hours per [DeepSeek's pricing page](https://api-docs.deepseek.com/quick_start/pricing): 01:00–04:00 and 06:00–10:00 UTC, Monday through Friday. All other hours are off-peak, including full weekends.

## Install (Hermes desktop plugin)

Copy `plugin.js` into your Hermes home:

```
$HERMES_HOME/desktop-plugins/deepseek-whale/plugin.js
```

(folder name must equal the plugin `id`, which is `deepseek-whale`). Then in the desktop app: Ctrl+K → **Reload desktop plugins**. Toggle it in Settings → Plugins.

Requires the Hermes desktop app (`hermes desktop`). Built on the [@hermes/plugin-sdk](https://hermes-agent.nousresearch.com/docs/developer-guide/desktop-plugin-sdk) titlebar contribution area — single ESM file, no build step.

## Retune the windows

If DeepSeek changes its peak schedule, edit `PEAK_WINDOWS` at the top of `plugin.js`:

```js
// [startHour, endHour) in UTC
const PEAK_WINDOWS = [[1, 4], [6, 10]]
```

## Keywords

deepseek, deepseek-api, peak-hours, off-peak, api-pricing, cost-optimization, hermes-agent, desktop-plugin, titlebar-widget, llm-pricing

## License

MIT — see [LICENSE](LICENSE).
