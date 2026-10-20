import { describe, expect, it } from "vitest";

import { readinessLabel, readinessScore, topicAccuracy, weakestTopic, MIN_ATTEMPTS } from "@/lib/scoring";

describe("topicAccuracy", () => {
  it("returns null below 5 attempts", () => {
    expect(topicAccuracy(4, 4)).toBeNull();
    expect(topicAccuracy(0, 0)).toBeNull();
  });

  it("returns a rounded percentage at 5+ attempts", () => {
    expect(topicAccuracy(4, 5)).toBe(80);
    expect(topicAccuracy(1, 3)).toBeNull();
    expect(topicAccuracy(3, 6)).toBe(50);
  });
});

describe("readinessScore", () => {
  it("weights accuracies by exam weight over topics with 5+ attempts", () => {
    // cloud: 30/38 ≈ 79, arch: 11/21 ≈ 52, governance: 3 attempts → excluded
    const score = readinessScore([
      { topicId: "cloud-concepts", correct: 30, attempts: 38, weight: 27.5 },
      { topicId: "architecture-services", correct: 11, attempts: 21, weight: 37.5 },
      { topicId: "management-governance", correct: 1, attempts: 3, weight: 32.5 },
    ]);
    // (27.5*79 + 37.5*52) / 65 = 63.4… → 63
    expect(score).toBe(63);
  });

  it("returns null when no topic has enough attempts", () => {
    expect(
      readinessScore([{ topicId: "cloud-concepts", correct: 2, attempts: 2, weight: 27.5 }]),
    ).toBeNull();
  });
});

describe("readinessLabel", () => {
  it("maps score ranges to labels", () => {
    expect(readinessLabel(59)).toBe("Keep studying");
    expect(readinessLabel(60)).toBe("Almost there");
    expect(readinessLabel(74)).toBe("Almost there");
    expect(readinessLabel(75)).toBe("Exam ready");
  });
});

describe("weakestTopic", () => {
  it("picks the lowest-accuracy scored topic", () => {
    const weak = weakestTopic([
      { topicId: "cloud-concepts", correct: 30, attempts: 38, weight: 27.5 },
      { topicId: "architecture-services", correct: 11, attempts: 21, weight: 37.5 },
      { topicId: "management-governance", correct: 1, attempts: 3, weight: 32.5 },
    ]);
    expect(weak?.topicId).toBe("architecture-services");
  });

  it("falls back to the least-attempted topic when nothing is scored", () => {
    const weak = weakestTopic([
      { topicId: "cloud-concepts", correct: 0, attempts: 2, weight: 27.5 },
      { topicId: "architecture-services", correct: 0, attempts: 0, weight: 37.5 },
    ]);
    expect(weak?.topicId).toBe("architecture-services");
  });

  it("MIN_ATTEMPTS is 5", () => {
    expect(MIN_ATTEMPTS).toBe(5);
  });
});
