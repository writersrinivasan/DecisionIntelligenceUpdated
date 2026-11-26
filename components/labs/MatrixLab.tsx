"use client";
import WeightedMatrix from "./WeightedMatrix";
import { LabProps } from "./shared";

export default function MatrixLab({ onExport, accent, uc }: LabProps) {
  return (
    <WeightedMatrix
      accent={accent}
      options={["Build", "Buy", "Partner"]}
      criteria={[
        { name: "Strategic differentiation", weight: 20 },
        { name: "Time to value", weight: 20 },
        { name: "3-year TCO", weight: 15 },
        { name: "Control & IP ownership", weight: 10 },
        { name: "Talent availability", weight: 10 },
        { name: "Compliance / data residency", weight: 15 },
        { name: "Vendor lock-in risk (low = good)", weight: 10 },
      ]}
      scores={[
        [5, 2, 4],
        [1, 5, 3],
        [3, 4, 2],
        [5, 1, 3],
        [1, 5, 4],
        [5, 2, 4],
        [5, 1, 3],
      ]}
      onChange={(s) => onExport(`${uc.agent.data}\n\nOUR WEIGHTED MATRIX:\n${s}`)}
    />
  );
}
