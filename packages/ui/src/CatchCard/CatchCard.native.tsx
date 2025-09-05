import { View as RNView, Text as RNText } from "react-native";
import { styled } from "nativewind";
import { CatchCardProps } from "./CatchCard.types";

const View = styled(RNView);
const Text = styled(RNText);

export const CatchCard = ({ species, weight, bait }: CatchCardProps) => (
  <View className="p-4 bg-blue-100 rounded-lg">
    <Text className="text-lg font-bold">{species}</Text>
    {weight && <Text className="text-sm">Weight: {weight} kg</Text>}
    {bait && <Text className="text-sm">Bait: {bait}</Text>}
  </View>
);
