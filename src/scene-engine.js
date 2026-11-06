import { CameraSystem } from "./camera-system.js";

const SHOTS = [
  "witness", "officer", "witness", "officer", "witness",
  "table", "officer", "officer", "daichi", "witness",
  "officer", "witness", "officer"
];

export class SceneEngine {
  constructor({ scene, caption, portraits }) {
    this.camera = new CameraSystem(scene, caption);
    this.portraits = portraits;
    this.scene = scene;
  }

  present(line, index) {
    const camera = line.camera || SHOTS[index] || "wide";
    this.camera.cut(camera);

    for (const [role, element] of Object.entries(this.portraits)) {
      const isSpeaker = line.role === role;
      element.classList.toggle("active", isSpeaker);
      element.classList.toggle("dimmed", !isSpeaker && camera !== "wide" && camera !== "twoShot");
      element.dataset.expression = line.expression || (isSpeaker ? "speaking" : "neutral");
      element.setAttribute("aria-hidden", "false");
    }

    this.scene.classList.remove("shot-enter");
    // Force a style boundary so the transition can replay for consecutive shots.
    void this.scene.offsetWidth;
    this.scene.classList.add("shot-enter");
  }

  reset() {
    this.camera.cut("wide");
    this.scene.classList.remove("shot-enter");
    Object.values(this.portraits).forEach((element) => {
      element.classList.remove("active", "dimmed");
      element.dataset.expression = "neutral";
    });
  }
}
