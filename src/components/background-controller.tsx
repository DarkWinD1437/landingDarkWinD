import { WebcamPixelGrid } from './ui/webcam-pixel-grid'

export function BackgroundController() {
  return (
    <div
      className="fixed inset-0 overflow-hidden bg-[#030303]"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      <div className="absolute inset-0 pointer-events-none">
        <WebcamPixelGrid
          gridCols={40}
          gridRows={30}
          maxElevation={50}
          motionSensitivity={0.25}
          elevationSmoothing={0.2}
          colorMode="webcam"
          backgroundColor="#030303"
          mirror={true}
          gapRatio={0.05}
          darken={0.6}
          borderColor="#ffffff"
          borderOpacity={0.06}
          className="w-full h-full"
        />
      </div>
    </div>
  )
}
