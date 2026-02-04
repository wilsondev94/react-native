import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";

export default function EditScreen() {
  const { id } = useLocalSearchParams();

  return <View>{id}</View>;
}
