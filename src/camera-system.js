const CAMERA_PRESETS = {
  wide: { label: "MASTER SHOT", focus: "all" },
  witness: { label: "WITNESS CLOSE-UP", focus: "man" },
  officer: { label: "OFFICER CLOSE-UP", focus: "chief" },
  daichi: { label: "DAICHI CLOSE-UP", focus: "daichi" },
  overShoulder: { label: "OVER THE SHOULDER", focus: "chief" },
  table: { label: "EVIDENCE INSERT", focus: "none" },
  twoShot: { label: "TWO-SHOT", focus: "pair" }
};

export class CameraSystem {
  constructor(sceneElement, captionElement) {
    this.scene = sceneElement;
    this.caption = captionElement;
    this.current = null;
  }

  cut(camera = "wide") {
    const preset = CAMERA_PRESETS[camera] || CAMERA_PRESETS.wide;
    this.scene.dataset.camera = camera;
    this.scene.dataset.focus = preset.focus;
    this.caption.textContent = `POLICE STATION · INTERROGATION ROOM · ${preset.label}`;
    this.current = camera;
  }
}
