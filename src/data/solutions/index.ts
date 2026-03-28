import type { SolutionData } from "./types";
import { cctv } from "./cctv";
import { accessControl } from "./access-control";
import { faceId } from "./face-id";
import { parking } from "./parking";
import { parkingGuide } from "./parking-guide";
import { ups } from "./ups";
import { videoWall } from "./video-wall";
import { turnstile } from "./turnstile";
import { intercom } from "./intercom";
import { vms } from "./vms";
import { dataCenter } from "./data-center";

export type { SolutionData } from "./types";

/** All hardcoded solutions — ordered for display */
export const SOLUTIONS: SolutionData[] = [
  cctv,
  accessControl,
  faceId,
  parking,
  vms,
  parkingGuide,
  turnstile,
  videoWall,
  intercom,
  ups,
  dataCenter,
];

/** Quick lookup by slug */
export function getSolutionBySlug(slug: string): SolutionData | undefined {
  return SOLUTIONS.find((s) => s.slug === slug);
}
