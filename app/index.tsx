import { data } from "@/data/todo";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface TodoData {
  id: number;
  title: string;
  completed: boolean;
}

export interface Theme {
  text: string;
  background: string;
  icon: string;
  button: string;
}

export default function Index() {
  const [todos, setTodos] = useState<TodoData[]>(
    data.sort((a, b) => b.id - a.id),
  );
  const [text, setText] = useState("");

  const addTodo = () => {
    if (text.trim()) {
      const newId = todos.length > 0 ? todos[0].id + 1 : 1;
      setTodos([{ id: newId, title: text, completed: false }, ...todos]);
      setText("");
    }
  };

  return (
    <SafeAreaView>
      <View>
        <TextInput
          placeholder="Add a new todo"
          placeholderTextColor="gray"
          value={text}
          onChangeText={setText}
        />
        <Pressable onPress={addTodo}>
          <Text>Add</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
