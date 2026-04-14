import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack>
    <Stack.Screen 
      name="index" 
      options={{ title: "Pokedex", headerTitleAlign: "center" }}
    />
    <Stack.Screen 
      name="details" 
      options={{ 
        title: "Pokemon Details",
        headerStyle: { backgroundColor: "#f44336" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
        headerBackButtonDisplayMode: "minimal",
      }}
    />
  </Stack>;
}
