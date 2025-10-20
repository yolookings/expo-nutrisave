// services/notifications.ts
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

/**
 * Menangani error registrasi. Menggunakan console.error lebih baik daripada alert
 * karena tidak mengganggu alur pengguna (user flow).
 */
function handleRegistrationError(errorMessage: string) {
  console.error("Push Notification Error:", errorMessage);
  // Di lingkungan produksi, Anda bisa mengirim error ini ke layanan logging.
  // throw new Error(errorMessage); // Hindari melempar error yang menghentikan aplikasi
}

/**
 * Mendaftarkan perangkat untuk menerima push notification dan mengembalikan ExpoPushToken.
 * Ini adalah adaptasi dari kode dokumentasi resmi.
 */
export async function registerForPushNotificationsAsync(): Promise<
  string | undefined
> {
  if (!Device.isDevice) {
    handleRegistrationError(
      "Harus menggunakan perangkat fisik untuk Push Notifications"
    );
    return;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    handleRegistrationError("Izin notifikasi tidak diberikan!");
    return;
  }

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId;
  if (!projectId) {
    handleRegistrationError(
      "Project ID tidak ditemukan. Pastikan Anda sudah menjalankan `npx eas project:init`."
    );
    return;
  }

  try {
    const pushTokenString = (
      await Notifications.getExpoPushTokenAsync({ projectId })
    ).data;
    console.log("Expo Push Token:", pushTokenString);
    return pushTokenString;
  } catch (e: unknown) {
    handleRegistrationError(`${e}`);
  }
}

/**
 * Mengirim notifikasi tes menggunakan API Expo.
 * Berguna untuk debugging selama pengembangan.
 */
export async function sendPushNotification(expoPushToken: string) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: "🥦 Tes Notifikasi NutriSave",
    body: "Jika Anda melihat ini, notifikasi berfungsi dengan baik!",
    data: { url: "/(tabs)/inventory" }, // Data ini bisa digunakan untuk deep linking
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}
