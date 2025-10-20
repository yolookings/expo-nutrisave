// app/(tabs)/index.tsx
import {
  registerForPushNotificationsAsync,
  sendPushNotification,
} from "@/services/notifications";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const HomeScreen = () => {
  const router = useRouter();
  const [expoPushToken, setExpoPushToken] = useState<string>("");

  // Dapatkan token hanya untuk keperluan tombol tes di UI ini
  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      if (token) {
        setExpoPushToken(token);
      }
    });
  }, []);

  const handleSendNotification = async () => {
    if (expoPushToken) {
      await sendPushNotification(expoPushToken);
      Alert.alert("Notifikasi Terkirim!", "Cek bar notifikasi perangkat Anda.");
    } else {
      Alert.alert(
        "Token Belum Siap",
        "Expo Push Token belum berhasil didapatkan. Coba lagi nanti."
      );
    }
  };

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
        onPress={() => router.push("/(tabs)/inventory")}
      >
        <Text style={styles.buttonText}>Lihat Inventaris</Text>
      </TouchableOpacity>

      {/* Tombol untuk testing notifikasi */}
      <TouchableOpacity
        style={[styles.button, styles.testButton]}
        onPress={handleSendNotification}
        disabled={!expoPushToken}
      >
        <Text style={styles.buttonText}>Kirim Notifikasi Tes</Text>
      </TouchableOpacity>
      <Text style={styles.tokenText}>
        Token: {expoPushToken || "Memuat..."}
      </Text>
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
    elevation: 2,
  },
  secondaryButton: { backgroundColor: "#2196F3" },
  testButton: { backgroundColor: "#f57c00", marginTop: 20 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  tokenText: {
    marginTop: 20,
    fontSize: 10,
    color: "#aaa",
    paddingHorizontal: 20,
    textAlign: "center",
  },
});

export default HomeScreen;
