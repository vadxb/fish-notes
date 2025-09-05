import type { CatchCardProps } from "./CatchCard.types";

export const CatchCard = ({ species, weight, bait }: CatchCardProps) => (
  <div className="p-4 bg-blue-100 rounded-lg">
    <h2 className="text-lg font-bold">{species}</h2>
    {weight && <p className="text-sm">Weight: {weight} kg</p>}
    {bait && <p className="text-sm">Bait: {bait}</p>}
  </div>
);
