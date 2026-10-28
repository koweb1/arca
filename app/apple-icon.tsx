import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b1114",
        }}
      >
        <svg width={120} height={120} viewBox="0 0 64 64">
          <path d="M12 52 32 10 52 52M21 38H43" stroke="#8bd7ea" strokeWidth={6} fill="none" strokeLinecap="square" />
        </svg>
      </div>
    ),
    { ...size },
  );
}