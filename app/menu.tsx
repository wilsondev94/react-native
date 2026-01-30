import MENU_IMAGES from "@/constants/menu-images";
import { MENU_ITEMS } from "@/constants/menu-items";
import { Colors } from "@/constants/theme";
import {
  Appearance,
  ColorSchemeName,
  FlatList,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Theme {
  text: string;
  background: string;
  headerBackground: string;
  tint: string;
  icon: string;
  tabIconDefault: string;
  tabIconSelected: string;
}

export default function MenuScreen() {
  const colorScheme = Appearance.getColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;

  const styles = createStyles(theme, colorScheme);
  const Container = Platform.OS === "web" ? ScrollView : SafeAreaView;

  const separatorComponent = <View style={styles.separator} />;
  // const headerComponent = <Text>Top of List</Text>;
  const footerComponent = (
    <Text style={{ color: theme.text }}>End of Menu</Text>
  );

  return (
    <Container>
      <FlatList
        data={MENU_ITEMS}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        keyExtractor={(item) => item.id.toString()}
        ItemSeparatorComponent={separatorComponent}
        // ListHeaderComponent={headerComponent}
        ListFooterComponent={footerComponent}
        ListFooterComponentStyle={styles.footerComponent}
        ListEmptyComponent={<Text>No Item</Text>}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.menuTextRow}>
              <Text style={[styles.menuItemTitle, styles.menuItemText]}>
                {item.title}
              </Text>
              <Text
              // style={styles.menuItemText}
              >
                {item.description}
              </Text>
            </View>
            <Image source={MENU_IMAGES[item.id - 1]} style={styles.menuImage} />
          </View>
        )}
      />
    </Container>
  );
}

function createStyles(theme: Theme, colorScheme: ColorSchemeName) {
  return StyleSheet.create({
    contentContainer: {
      paddingTop: 10,
      paddingBottom: 20,
      paddingHorizontal: 12,
      backgroundColor: theme.background,
    },
    separator: {
      height: 1,
      backgroundColor: colorScheme === "dark" ? "papayawhip" : "#000",
      width: "50%",
      maxWidth: 300,
      marginHorizontal: "auto",
      marginBottom: 10,
    },

    footerComponent: {
      marginHorizontal: "auto",
    },

    row: {
      flexDirection: "row",
      backgroundColor: colorScheme === "dark" ? "papayawhip" : "#000",
      width: "100%",
      height: 100,
      maxWidth: 600,
      marginBottom: 10,
      marginHorizontal: "auto",
      borderWidth: 1,
      borderStyle: "solid",
      borderRadius: 20,
      overflow: "hidden",
    },

    menuTextRow: {
      width: "65%",
      paddingTop: 10,
      paddingLeft: 10,
      paddingRight: 5,
      flexGrow: 1,
    },
    menuItemTitle: {
      fontSize: 18,
      textDecorationLine: "underline",
    },
    menuItemText: {
      // color:theme.text,
      color: colorScheme === "dark" ? "#000" : "papayawhip",
    },

    menuImage: {
      width: 100,
      height: 100,
    },
  });
}
