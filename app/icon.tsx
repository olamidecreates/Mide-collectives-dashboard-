import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A0A0A",
          color: "#FFFFFF",
          fontSize: 20,
          fontWeight: 900,
          letterSpacing: -1,
        }}
      >
        M
        <span style={{ color: "#2563EB" }}>.</span>
      </div>
    ),
    { ...size }
  );
}
