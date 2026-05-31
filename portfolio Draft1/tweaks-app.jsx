/* Tweaks app — mounts the panel and drives CSS via window.applyTweak */
const { useState, useEffect } = React;

const ACCENTS = [
  { hex: "#6366f1", hue: 264 }, // indigo (default)
  { hex: "#4f7cff", hue: 248 }, // blue
  { hex: "#22b8d6", hue: 210 }, // cyan
  { hex: "#22c197", hue: 162 }, // emerald
  { hex: "#a855f7", hue: 300 }, // violet
  { hex: "#fb7185", hue: 18 }   // coral
];

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#6366f1",
  "font": "geometric",
  "glow": 0.55,
  "grid": true
}/*EDITMODE-END*/;

function PortfolioTweaks() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Re-apply whenever a tweak changes (and on first mount / reload-from-storage)
  useEffect(() => {
    const hue = (ACCENTS.find(a => a.hex === t.accent) || ACCENTS[0]).hue;
    window.applyTweak && window.applyTweak("accent", hue);
    window.applyTweak && window.applyTweak("font", t.font);
    window.applyTweak && window.applyTweak("glow", t.glow);
    window.applyTweak && window.applyTweak("grid", t.grid);
  }, [t.accent, t.font, t.glow, t.grid]);

  return (
    React.createElement(TweaksPanel, { title: "Tweaks" },
      React.createElement(TweakSection, { label: "Accent" }),
      React.createElement(TweakColor, {
        label: "Color", value: t.accent,
        options: ACCENTS.map(a => a.hex),
        onChange: v => setTweak("accent", v)
      }),
      React.createElement(TweakSlider, {
        label: "Hero glow", value: t.glow, min: 0, max: 0.9, step: 0.05,
        onChange: v => setTweak("glow", v)
      }),
      React.createElement(TweakSection, { label: "Typography" }),
      React.createElement(TweakRadio, {
        label: "Headline", value: t.font,
        options: ["geometric", "serif", "mono"],
        onChange: v => setTweak("font", v)
      }),
      React.createElement(TweakSection, { label: "Atmosphere" }),
      React.createElement(TweakToggle, {
        label: "Grid lines", value: t.grid,
        onChange: v => setTweak("grid", v)
      })
    )
  );
}

ReactDOM.createRoot(document.getElementById("tweaks-root")).render(
  React.createElement(PortfolioTweaks)
);
