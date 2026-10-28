import { ImageResponse } from "next/og";

export const alt = "ARCA Studio, architecture and interior design in Lagos";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const GRID = 40;

export default function OpengraphImage() {
  const verticals = Array.from({ length: size.width / GRID + 1 }, (_, i) => i * GRID);
  const horizontals = Array.from({ length: size.height / GRID + 1 }, (_, i) => i * GRID);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#0b1114",
          color: "#e8eeef",
        }}
      >
        {/* blueprint grid */}
        <div style={{ position: "absolute", top: 0, left: 0, display: "flex" }}>
          <svg width={size.width} height={size.height} viewBox={`0 0 ${size.width} ${size.height}`}>
            {verticals.map((x) => (
              <line key={`v${x}`} x1={x} y1={0} x2={x} y2={size.height} stroke="#8bd7ea" strokeOpacity={0.07} strokeWidth={1} />
            ))}
            {horizontals.map((y) => (
              <line key={`h${y}`} x1={0} y1={y} x2={size.width} y2={y} stroke="#8bd7ea" strokeOpacity={0.07} strokeWidth={1} />
            ))}
          </svg>
        </div>

        {/* building elevation, taken from the Architectural Design demo */}
        <div style={{ position: "absolute", right: 72, bottom: 56, display: "flex" }}>
          <svg width={342} height={200} viewBox="60 120 410 240">
            <path d="M30 320H570" stroke="#8bd7ea" strokeWidth={2} fill="none" />
            <rect x={70} y={228} width={290} height={92} stroke="#8bd7ea" strokeWidth={2} fill="#8bd7ea" fillOpacity={0.1} />
            <rect x={150} y={146} width={260} height={76} stroke="#8bd7ea" strokeWidth={2} fill="#8bd7ea" fillOpacity={0.2} />
            <rect x={128} y={130} width={304} height={12} fill="#8bd7ea" />
            <path
              d="M186 146V222M222 146V222M258 146V222M294 146V222M330 146V222M366 146V222M110 228V320M170 252H330V320"
              stroke="#8bd7ea"
              strokeWidth={2}
              fill="none"
            />
            <path d="M452 130V320M445 130H459M445 320H459" stroke="#93a4ab" strokeWidth={1.5} fill="none" />
          </svg>
        </div>

        {/* text */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            padding: "64px 72px",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <div style={{ fontSize: 40, letterSpacing: 10, fontWeight: 700 }}>ARCA</div>
            <div style={{ marginLeft: 20, fontSize: 18, letterSpacing: 4, color: "#93a4ab" }}>
              ARCHITECTURE STUDIO
            </div>
          </div>

          <div style={{ display: "flex", marginTop: 70, fontSize: 20, letterSpacing: 5, color: "#8bd7ea" }}>
            ARCHITECTURE &amp; INTERIOR STUDIO
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 18,
              fontSize: 72,
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: -1,
            }}
          >
            <div>SPACES THAT</div>
            <div>DEFINE THE FUTURE.</div>
          </div>

          <div
            style={{
              display: "flex",
              position: "absolute",
              left: 72,
              bottom: 56,
              fontSize: 20,
              letterSpacing: 4,
              color: "#93a4ab",
            }}
          >
            LAGOS · 6.5244° N · 3.3792° E
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}