import { useTheme } from "@/constext/ThemeContext";
import { data } from "@/data/todo";
import { Theme, TodoData } from "@/types";
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Octicons from "@expo/vector-icons/Octicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
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
import Animated, { LinearTransition } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const router = useRouter();
  const [todos, setTodos] = useState<TodoData[]>([]);
  const [text, setText] = useState("");

  const { colorScheme, setColorScheme, theme } = useTheme();

  const [loaded, error] = useFonts({
    Inter_500Medium,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("TodoApp");

        const storageTodos: TodoData[] =
          jsonValue !== null ? JSON.parse(jsonValue) : null;

        if (storageTodos && storageTodos.length) {
          setTodos(storageTodos.sort((a, b) => b.id - a.id));
        } else {
          setTodos(data.sort((a, b) => b.id - a.id));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    const storeData = async () => {
      try {
        const jsonValue = JSON.stringify(todos);
        await AsyncStorage.setItem("TodoApp", jsonValue);
      } catch (error) {
        console.log(error);
      }
    };
    storeData();
  }, [todos]);

  if (!loaded && !error) {
    return null;
  }

  const addTodo = () => {
    if (text.trim()) {
      const newId = todos.length > 0 ? todos[0].id + 1 : 1;
      setTodos([{ id: newId, title: text, completed: false }, ...todos]);
      setText("");
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const removeTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };
  const handlePress = (id: number) => {
    // router.push(`/todos/${id}`);
    router.push({
      pathname: "/todos/[id]",
      params: { id },
    });
  };

  const styles = createStyles(theme, colorScheme);

  const renderItem = ({ item }: { item: TodoData }) => (
    <View style={styles.todoItem}>
      <Pressable
        onPress={() => handlePress(item.id)}
        onLongPress={() => toggleTodo(item.id)}
      >
        <Text style={[styles.todoText, item.completed && styles.completedText]}>
          {item.title}
        </Text>
      </Pressable>
      <Pressable onPress={() => removeTodo(item.id)}>
        <MaterialCommunityIcons
          name="delete-circle"
          size={36}
          color="red"
          selectable={undefined}
        />
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a new todo"
          placeholderTextColor="gray"
          value={text}
          onChangeText={setText}
        />
        <Pressable onPress={addTodo} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>
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
      <Animated.FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={(todo) => String(todo.id)}
        contentContainerStyle={{ flexGrow: 1 }}
        itemLayoutAnimation={LinearTransition}
        keyboardDismissMode="on-drag"
      />
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </SafeAreaView>
  );
}

function createStyles(theme: Theme, colorScheme: ColorSchemeName) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
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
    addButton: {
      backgroundColor: theme.text,
      borderRadius: 5,
      padding: 10,
    },
    addButtonText: {
      fontSize: 18,
      color: colorScheme === "dark" ? "black" : "white",
    },
    todoItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 4,
      padding: 10,
      borderBottomColor: "gray",
      borderBottomWidth: 1,
      width: "100%",
      maxWidth: 1024,
      marginHorizontal: "auto",
      pointerEvents: "auto",
    },
    todoText: {
      flex: 1,
      fontSize: 18,
      fontFamily: "Inter_500Medium",
      color: theme.text,
    },
    completedText: {
      textDecorationLine: "line-through",
      color: "gray",
    },
  });
}
