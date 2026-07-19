import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A0A0A",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 60,
            left: 64,
            display: "flex",
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#6B6B67",
            fontWeight: 500,
          }}
        >
          Wear Your Story
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 148,
            fontWeight: 900,
            letterSpacing: -6,
            color: "#FFFFFF",
          }}
        >
          MIDE
          <span style={{ color: "#2563EB" }}>.</span>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 8,
            fontSize: 26,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#FFFFFF",
            opacity: 0.6,
          }}
        >
          Collectives
        </div>
      </div>
    ),
    { ...size }
  );
}
