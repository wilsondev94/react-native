import { Colors } from "@/constants/theme";
import { Stack } from "expo-router";
import { Appearance } from "react-native";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = Appearance.getColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;

  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: theme.headerBackground },
        headerTintColor: theme.text,
      }}
    >
      <Stack.Screen
        name="index"
        options={{ headerShown: false, title: "Home" }}
      />
      <Stack.Screen
        name="menu"
        options={{
          headerShown: true,
          title: "Menu",
          headerTitle: "Coffee Shop Menu",
        }}
      />
      <Stack.Screen
        name="contact"
        options={{
          headerShown: true,
          title: "Contact",
          headerTitle: "Contact Us",
        }}
      />
      <Stack.Screen name="+not-found" options={{ headerShown: false }} />
    </Stack>
  );
}
