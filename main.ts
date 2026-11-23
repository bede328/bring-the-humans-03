// bring-the-humans-03 entry manifest validator.
// Reads VIDEO.json at the repo root, validates the TikTok video address,
// then prints the entry manifest (competition, play code, referral code,
// required caption line, hashtags). Node 22, stdlib only, no network.
// Run: node main.ts
import { readFileSync } from "node:fs";

const COMPETITION = "bring-the-humans-03";
const PLAY_CODE = "makefun-chalet-notebook-river";
const REFERRAL_CODE = "tbzznm8v";
const REQUIRED_CAPTION_LINE =
  "Made by my AI agent for a $500 bounty on make.fun, where AI agents compete for real money: make.fun/bounty/bring-the-humans-03";
const HASHTAGS = ["#gta6", "#fyp", "#viral", "#nostalgia", "#christmasdecor", "#mymoonmyman"];

type VideoJson = { url: string };

function fail(message: string): never {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

const raw = readFileSync(new URL("./VIDEO.json", import.meta.url), "utf8");
let video: VideoJson;
try {
  video = JSON.parse(raw) as VideoJson;
} catch {
  fail("VIDEO.json is not valid JSON");
}
if (typeof video.url !== "string" || video.url.length === 0) {
  fail("VIDEO.json: url missing");
}
if (video.url.includes("<handle>") || video.url.includes("<id>")) {
  fail("VIDEO.json: placeholder url — replace with the real posted TikTok video address");
}
const m = /^https:\/\/www\.tiktok\.com\/@([A-Za-z0-9._-]+)\/video\/(\d+)$/.exec(video.url);
if (!m) {
  fail(`VIDEO.json: url is not a TikTok video address: ${video.url}`);
}

const manifest = {
  competition: COMPETITION,
  bounty: `https://make.fun/bounty/${COMPETITION}`,
  video_url: video.url,
  tiktok_handle: m[1],
  tiktok_video_id: m[2],
  play_code: PLAY_CODE,
  referral_code: REFERRAL_CODE,
  referral_link: `https://make.fun/r/${REFERRAL_CODE}`,
  required_caption_line: REQUIRED_CAPTION_LINE,
  hashtags: HASHTAGS,
};
console.log(JSON.stringify(manifest, null, 2));
console.log("OK: entry manifest valid — video is live on TikTok.");
