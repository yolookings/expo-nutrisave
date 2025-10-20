// app/(tabs)/inventory.tsx
import { FoodItem } from "@/types"; // Import tipe dari file terpusat
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as api from "../../services/api";

// Fungsi helper untuk memformat tanggal menjadi relatif
const formatRelativeDate = (dateString: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalisasi waktu hari ini
  const expiryDate = new Date(dateString);
  expiryDate.setHours(0, 0, 0, 0); // Normalisasi waktu kedaluwarsa

  const diffTime = expiryDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return `Lewat ${Math.abs(diffDays)} hari`;
  if (diffDays === 0) return "Hari ini";
  if (diffDays === 1) return "Besok";
  return `Dalam ${diffDays} hari`;
};

// Fungsi helper untuk memberikan warna berdasarkan tanggal kedaluwarsa
const getExpiryStyle = (dateString: string) => {
  const today = new Date();
  const expiryDate = new Date(dateString);
  const diffTime = expiryDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return styles.expiryPassed;
  if (diffDays <= 3) return styles.expirySoon;
  return styles.expirySafe;
};

const InventoryScreen = () => {
  const [inventory, setInventory] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadInventory = useCallback(async () => {
    try {
      const data = await api.getInventory();
      // Urutkan data berdasarkan tanggal kedaluwarsa terdekat
      const sortedData = data.sort(
        (a, b) =>
          new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
      );
      setInventory(sortedData);
    } catch (error) {
      console.error("Gagal memuat inventaris:", error);
      // Di sini Anda bisa menambahkan state error untuk ditampilkan di UI
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // useFocusEffect akan menjalankan callback setiap kali layar ini menjadi fokus.
  // Ini memastikan data selalu terbaru setelah kembali dari layar lain (misal: kamera).
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadInventory();
    }, [loadInventory])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadInventory();
  }, [loadInventory]);

  const renderItem = ({ item }: { item: FoodItem }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={[styles.itemExpiry, getExpiryStyle(item.expiryDate)]}>
        {formatRelativeDate(item.expiryDate)}
      </Text>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={inventory}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>Inventaris Anda kosong.</Text>
            <Text style={styles.emptySubText}>
              Tambahkan makanan untuk memulai!
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#4CAF50"]}
          />
        }
        contentContainerStyle={inventory.length === 0 ? { flex: 1 } : {}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  itemContainer: {
    backgroundColor: "#fff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  itemName: { fontSize: 18, fontWeight: "500" },
  itemExpiry: { fontSize: 14 },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
  },
  emptySubText: {
    marginTop: 8,
    fontSize: 14,
    color: "#888",
  },
  expiryPassed: { color: "#d32f2f", fontWeight: "bold" },
  expirySoon: { color: "#f57c00" },
  expirySafe: { color: "#388e3c" },
});

export default InventoryScreen;
