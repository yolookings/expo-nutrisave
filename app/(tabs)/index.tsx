import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const HomeScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>NutriSave</Text>
      <Text style={styles.subtitle}>Kurangi limbah makanan Anda</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/camera")}
      >
        <Text style={styles.buttonText}>+ Tambah Makanan</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={() => router.push("/inventory")}
      >
        <Text style={styles.buttonText}>Lihat Inventaris</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: { fontSize: 32, fontWeight: "bold", marginBottom: 8, color: "#333" },
  subtitle: { fontSize: 16, color: "#666", marginBottom: 40 },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
    marginBottom: 15,
  },
  secondaryButton: { backgroundColor: "#2196F3" },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
});

export default HomeScreen;
