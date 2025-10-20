import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as api from "../../services/api";

interface FoodItem {
  id: string;
  name: string;
  expiryDate: string;
}

const InventoryScreen = () => {
  const [inventory, setInventory] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInventory = async () => {
      try {
        const data = await api.getInventory();
        setInventory(data);
      } catch (error) {
        console.error("Gagal memuat inventaris:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInventory();
  }, []);

  const renderItem = ({ item }: { item: FoodItem }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemExpiry}>Kedaluwarsa: {item.expiryDate}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
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
          <Text style={styles.emptyText}>Inventaris kosong.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
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
  },
  itemName: { fontSize: 18, fontWeight: "bold" },
  itemExpiry: { fontSize: 14, color: "#888" },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#888",
  },
});

export default InventoryScreen;
