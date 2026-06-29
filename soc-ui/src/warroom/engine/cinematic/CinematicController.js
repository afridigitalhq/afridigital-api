import { AttackPredictor } from "../ai/prediction/AttackPredictor";
import { SOCRewind } from "../rewind/timeline/SOCRewind";
import { ThreatAudioEngine } from "../audio/pulse/ThreatAudioEngine";

export class CinematicController {
  constructor(nodes, events) {
    this.predictor = new AttackPredictor();
    this.rewind = new SOCRewind(events);
    this.audio = new ThreatAudioEngine();
  }

  frame(nodes) {
    const prediction = this.predictor.predict(nodes);
    const audio = this.audio.pulse(prediction.confidence);

    return {
      prediction,
      audio,
      rewind: this.rewind.play(),
      cinematicMode: true,
      alertLevel: prediction.confidence
    };
  }
}
