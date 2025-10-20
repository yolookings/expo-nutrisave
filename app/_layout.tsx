// app/_layout.tsx
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { Stack } from "expo-router";
import React from "react";

/**
 * Ini adalah Root Layout. Kita hanya perlu memanggil hook notifikasi di sini
 * untuk menginisialisasi semuanya. Semua logika kompleks sudah ada di dalam hook.
 */
export default function RootLayout() {
  // Memanggil hook akan menginisialisasi semua logika notifikasi di latar belakang.
  usePushNotifications();

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="camera"
        options={{
          presentation: "modal",
          title: "Tambah Makanan",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="modal"
        options={{
          presentation: "modal",
          title: "Modal",
        }}
      />
    </Stack>
  );
}
