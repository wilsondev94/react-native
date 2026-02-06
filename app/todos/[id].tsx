import { useTheme } from "@/constext/ThemeContext";
import { Theme, TodoData } from "@/types";
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import { Octicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  ColorSchemeName,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const { colorScheme, setColorScheme, theme } = useTheme();

  const [todo, setTodo] = useState<TodoData | undefined>(undefined);

  const [loaded, error] = useFonts({
    Inter_500Medium,
  });

  useEffect(() => {
    const fetchData = async (id: string | string[]) => {
      try {
        const jsonValue = await AsyncStorage.getItem("TodoApp");

        const storageTodos: TodoData[] =
          jsonValue !== null ? JSON.parse(jsonValue) : null;

        if (storageTodos && storageTodos.length) {
          const myTodo = storageTodos.find((todo) => todo.id.toString() === id);
          setTodo(myTodo);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData(id);
  }, [id]);

  if (!loaded && !error) {
    return null;
  }

  const handleSave = async () => {
    try {
      const saveTodo = { ...todo, title: todo?.title };
      const jsonValue = await AsyncStorage.getItem("TodoApp");

      const storageTodos: TodoData[] =
        jsonValue !== null ? JSON.parse(jsonValue) : null;
      if (storageTodos && storageTodos.length) {
        const otherTodos = storageTodos.filter(
          (todo) => todo.id !== saveTodo.id,
        );

        const allTodos = [...otherTodos, saveTodo];

        await AsyncStorage.setItem("TodoApp", JSON.stringify(allTodos));
      } else {
        await AsyncStorage.setItem("TodoApp", JSON.stringify([saveTodo]));
      }
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  const styles = createStyles(theme, colorScheme);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          maxLength={30}
          placeholder="Edit todo"
          placeholderTextColor="gray"
          value={todo?.title || ""}
          onChangeText={(text) =>
            setTodo((prev) => {
              if (!prev) return prev;

              return { ...prev, title: text };
            })
          }
        />
        <Pressable
          onPress={() =>
            setColorScheme(colorScheme === "light" ? "dark" : "light")
          }
          style={{ marginLeft: 10 }}
        >
          <Octicons
            name={colorScheme === "dark" ? "moon" : "sun"}
            siz={16}
            color={theme.text}
            selectable={undefined}
            style={{ width: 36 }}
          />
        </Pressable>
      </View>

      <View style={styles.inputContainer}>
        <Pressable onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push("/")}
          style={[styles.saveButton, { backgroundColor: "red" }]}
        >
          <Text style={[styles.saveButtonText, { color: "white" }]}>
            Cancel
          </Text>
        </Pressable>
      </View>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </SafeAreaView>
  );
}

function createStyles(theme: Theme, colorScheme: ColorSchemeName) {
  return StyleSheet.create({
    container: {
      flex: 1,
      width: "100%",
      backgroundColor: theme.background,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      padding: 10,
      width: "100%",
      maxWidth: 1024,
      marginHorizontal: "auto",
      pointerEvents: "auto",
    },
    input: {
      flex: 1,
      borderColor: "gray",
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      marginRight: 10,
      fontSize: 18,
      fontFamily: "Inter_500Medium",
      minWidth: 0,
      color: theme.text,
    },
    saveButton: {
      backgroundColor: theme.button,
      borderRadius: 5,
      padding: 10,
    },
    saveButtonText: {
      fontSize: 18,
      color: colorScheme === "dark" ? "black" : "white",
    },
  });
}
