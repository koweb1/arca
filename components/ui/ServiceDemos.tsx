/* The four animated drawings in the Services section.
   Elements carry data-draw / data-fade / data-out ranges ("start,end" as 0 to 1).
   The Services section reads them and updates the styles as the demo plays. */

const ln = "fill-none stroke-blue [stroke-width:1.5] [stroke-dasharray:1] [stroke-dashoffset:0]";
const st = "fill-none stroke-blue [stroke-width:1.5]";
const dim = "fill-none stroke-mute [stroke-width:1]";
const fa = "fill-[rgba(139,215,234,.1)]";
const fb = "fill-[rgba(139,215,234,.2)]";
const fc = "fill-blue";
const old = "fill-none stroke-[#8a999f] [stroke-width:1.5] [stroke-dasharray:5_4]";
const tx = "fill-blue font-mono text-[11px] font-medium [letter-spacing:.08em]";
const svgClass = "block h-auto w-full";

function GridDefs() {
  return (
    <defs>
      <pattern id="arca-grid" width="30" height="30" patternUnits="userSpaceOnUse">
        <path d="M30 0H0V30" fill="none" stroke="rgba(165,215,230,.08)" />
      </pattern>
    </defs>
  );
}

export function ArchitecturalDemo() {
  return (
    <svg className={svgClass} viewBox="0 0 600 380" role="img" aria-label="A building elevation drawn line by line, then filled in">
      <GridDefs />
      <rect width="600" height="380" fill="url(#arca-grid)" />
      <path className={ln} pathLength={1} data-draw="0,.12" d="M30 320H570" />
      <rect className={fa} data-fade=".5,.7" x="70" y="228" width="290" height="92" />
      <rect className={fb} data-fade=".62,.82" x="150" y="146" width="260" height="76" />
      <rect className={ln} pathLength={1} data-draw=".1,.38" x="70" y="228" width="290" height="92" />
      <rect className={ln} pathLength={1} data-draw=".3,.58" x="150" y="146" width="260" height="76" />
      <rect className={fc} data-fade=".78,.95" x="128" y="130" width="304" height="12" />
      <rect className={ln} pathLength={1} data-draw=".5,.7" x="128" y="130" width="304" height="12" />
      <path className={ln} pathLength={1} data-draw=".6,.9" d="M186 146V222M222 146V222M258 146V222M294 146V222M330 146V222M366 146V222" />
      <path className={ln} pathLength={1} data-draw=".7,.92" d="M110 228V320M170 252H330V320" />
      <g data-fade=".85,1">
        <path className={dim} d="M70 350H360M70 343V357M360 343V357" />
        <text className={tx} x="215" y="342" textAnchor="middle">21.40 m</text>
        <path className={dim} d="M452 130V320M445 130H459M445 320H459" />
        <text className={tx} x="468" y="230">7.80 m</text>
      </g>
    </svg>
  );
}

export function InteriorDemo() {
  return (
    <svg className={svgClass} viewBox="0 0 600 380" role="img" aria-label="An empty room that fills with furniture and lighting">
      <GridDefs />
      <rect width="600" height="380" fill="url(#arca-grid)" />
      <path className={st} d="M80 50H520V270H80ZM80 270L40 340H560L520 270M80 50L40 340M520 50L560 340" />
      <rect className={st} x="130" y="90" width="120" height="110" />
      <path className={st} d="M190 90V200M130 145H250" />
      <polygon className={fa} data-fade=".82,1" points="130,200 250,200 300,330 170,330" />
      <ellipse className={fb} data-fade=".1,.3" cx="300" cy="305" rx="150" ry="24" />
      <g data-fade=".2,.4">
        <rect className={fb} x="215" y="232" width="200" height="56" rx="8" />
        <rect className={fa} x="215" y="200" width="200" height="38" rx="8" />
        <path className={dim} d="M282 238V288M348 238V288" />
      </g>
      <ellipse className={fb} data-fade=".42,.56" cx="450" cy="300" rx="34" ry="12" />
      <g data-fade=".5,.66">
        <path className={st} d="M315 50V112" />
        <path className={st} d="M295 112H335L326 128H304Z" />
      </g>
      <ellipse cx="315" cy="138" rx="46" ry="14" fill="rgba(255,201,139,.28)" data-fade=".62,.8" />
      <rect className={st} data-fade=".6,.75" x="400" y="100" width="70" height="52" />
      <path className={st} data-fade=".7,.86" d="M490 270C478 238 482 214 496 196M490 270C500 240 512 226 530 220M490 270C486 246 470 232 458 230" />
      <text className={tx} x="300" y="366" textAnchor="middle">LIVING ROOM · 6.2 × 4.8 m</text>
    </svg>
  );
}

export function VisualizationDemo() {
  return (
    <svg className={svgClass} viewBox="0 0 600 380" role="img" aria-label="A line drawing becoming a lit, rendered building">
      <defs>
        <linearGradient id="arca-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0d2233" />
          <stop offset=".7" stopColor="#3b5b72" />
          <stop offset="1" stopColor="#e9a066" />
        </linearGradient>
        <linearGradient id="arca-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2b5a70" />
          <stop offset="1" stopColor="#0e2733" />
        </linearGradient>
        <pattern id="arca-grid" width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M30 0H0V30" fill="none" stroke="rgba(165,215,230,.08)" />
        </pattern>
      </defs>
      <rect width="600" height="380" fill="url(#arca-grid)" />
      <rect data-fade=".2,.45" x="0" y="0" width="600" height="320" fill="url(#arca-sky)" />
      <rect data-fade=".3,.5" x="0" y="320" width="600" height="60" fill="#0f181c" />
      <rect data-fade=".38,.6" x="70" y="228" width="290" height="92" fill="#aeb4b3" />
      <rect data-fade=".38,.6" x="150" y="146" width="260" height="76" fill="#8a6a4c" />
      <rect data-fade=".5,.72" x="186" y="152" width="214" height="64" fill="url(#arca-glass)" />
      <rect data-fade=".5,.72" x="170" y="252" width="160" height="68" fill="url(#arca-glass)" />
      <rect data-fade=".66,.88" x="196" y="160" width="70" height="48" fill="rgba(255,201,139,.8)" />
      <rect data-fade=".66,.88" x="186" y="262" width="120" height="50" fill="rgba(255,201,139,.85)" />
      <rect data-fade=".38,.6" x="128" y="130" width="304" height="12" fill="#10181c" />
      <rect data-fade=".78,1" x="70" y="324" width="290" height="22" fill="rgba(255,201,139,.18)" />
      <circle data-fade=".82,1" cx="500" cy="70" r="16" fill="#ffd9a8" />
      <path className={st} d="M30 320H570M70 228H360V320H70ZM150 146H410V222H150ZM128 130H432V142H128Z" />
      <text className={tx} x="30" y="368">DRAFT → FINAL RENDER</text>
    </svg>
  );
}

export function RenovationDemo() {
  return (
    <svg className={svgClass} viewBox="0 0 600 380" role="img" aria-label="An existing house transforming into a redesigned building">
      <GridDefs />
      <rect width="600" height="380" fill="url(#arca-grid)" />
      <path className={st} d="M30 320H570" />
      <g data-out=".25,.6">
        <path className={old} d="M110 320V210H340V320M92 210L225 130L358 210Z" />
        <path className={old} d="M140 240H180V280H140ZM270 240H310V280H270ZM205 320V262H243V320" />
        <text className={tx} x="110" y="352">EXISTING</text>
      </g>
      <rect className={fa} data-fade=".7,.9" x="90" y="220" width="280" height="100" />
      <rect className={fb} data-fade=".78,.96" x="150" y="140" width="230" height="80" />
      <path className={ln} pathLength={1} data-draw=".35,.65" d="M90 320V220H370V320M150 220V140H380V220" />
      <path className={ln} pathLength={1} data-draw=".5,.8" d="M110 140H400M180 150V210M240 150V210M300 150V210M360 150V210M110 240H350V320" />
      <rect className={fc} data-fade=".82,1" x="130" y="128" width="290" height="12" />
      <text className={tx} data-fade=".75,.95" x="90" y="352">REDESIGNED</text>
      <text className={tx} data-fade=".85,1" x="400" y="222">+ 86 m² · + 40% daylight</text>
    </svg>
  );
}

export const serviceDemos = [ArchitecturalDemo, InteriorDemo, VisualizationDemo, RenovationDemo];