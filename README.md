# 🐳 DeepSeek Whale

A whale in the [Hermes Agent](https://github.com/NousResearch/hermes-agent) desktop titlebar that shows DeepSeek API peak/off-peak pricing at a glance.

- BLUE **Off-peak (half price)** — full-color blue whale with `x0.5`
- GREY **Peak (full price)** — greyed-out whale with `PEAK`

Click the whale (or hover) for the live countdown to the next switch. Repaints every 30 seconds. No backend, no API key — pure clock math against DeepSeek's fixed UTC peak windows (01:00–04:00 and 06:00–10:00 UTC).

Also answers to Ctrl+K → `DeepSeek Whale: peak status`.

## Install

Copy `plugin.js` into your Hermes home:

```
$HERMES_HOME/desktop-plugins/deepseek-whale/plugin.js
```

(folder name must equal the plugin `id`, which is `deepseek-whale`). Then in the desktop app: Ctrl+K → **Reload desktop plugins**. Toggle it in Settings → Plugins.

## Retune the windows

If DeepSeek changes its peak schedule, edit `PEAK_WINDOWS` at the top of `plugin.js`:

```js
// [startHour, endHour) in UTC
const PEAK_WINDOWS = [[1, 4], [6, 10]]
```

## License

MIT — see [LICENSE](LICENSE).
