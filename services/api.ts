// services/api.ts
import { FoodItem, UploadResponse } from "@/types";

/**
 * PENTING: Untuk pengembangan, buat file `.env` di root proyek Anda dan tambahkan:
 * EXPO_PUBLIC_API_URL=http://<IP_ADDRESS_LOKAL_ANDA>:8000/api
 * Contoh: EXPO_PUBLIC_API_URL=http://192.168.1.5:8000/api
 */
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000/api";

const IS_MOCK_MODE = true; // Ganti menjadi false saat backend siap

// --- IMPLEMENTASI API SUNGGUHAN ---

const getInventoryReal = async (): Promise<FoodItem[]> => {
  const response = await fetch(`${API_BASE_URL}/inventory`);
  if (!response.ok) {
    throw new Error("Gagal mengambil data inventaris");
  }
  return response.json();
};

const uploadFoodImageReal = async (
  imageUri: string
): Promise<UploadResponse> => {
  const formData = new FormData();
  // 'any' digunakan karena tipe FormData di React Native sedikit berbeda
  formData.append("file", {
    uri: imageUri,
    name: `photo_${Date.now()}.jpg`,
    type: "image/jpeg",
  } as any);

  try {
    const response = await fetch(`${API_BASE_URL}/upload-food`, {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        // Tambahkan header autentikasi jika diperlukan, contoh:
        // 'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Terjadi kesalahan pada server." }));
      return { success: false, message: errorData.message };
    }
    return response.json();
  } catch (error) {
    console.error("Upload error:", error);
    return { success: false, message: "Tidak dapat terhubung ke server." };
  }
};

// --- IMPLEMENTASI MOCK (untuk pengembangan) ---

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const mockInventoryData: FoodItem[] = [
  {
    id: "1",
    name: "Susu UHT",
    expiryDate: "2025-10-25",
    addedAt: "2025-10-15T00:00:00.000Z",
  },
  {
    id: "2",
    name: "Roti Tawar",
    expiryDate: "2025-10-20",
    addedAt: "2025-10-18T00:00:00.000Z",
  },
  {
    id: "3",
    name: "Telur Ayam",
    expiryDate: "2025-11-05",
    addedAt: "2025-10-15T00:00:00.000Z",
  },
  {
    id: "4",
    name: "Apel",
    expiryDate: "2025-10-22",
    addedAt: "2025-10-19T00:00:00.000Z",
  },
];

const getInventoryMock = async (): Promise<FoodItem[]> => {
  console.log("API: Mengambil data inventaris (mock)...");
  await delay(1000);
  return [...mockInventoryData];
};

const uploadFoodImageMock = async (
  imageUri: string
): Promise<UploadResponse> => {
  console.log(`API: Mengunggah gambar dari ${imageUri} (mock)...`);
  await delay(2000);

  if (Math.random() < 0.1) {
    console.log("API: Simulasi kegagalan identifikasi.");
    return { success: false, message: "Gagal mengidentifikasi gambar." };
  }

  const possibleLabels = ["Apel", "Pisang", "Tomat", "Wortel", "Ayam Fillet"];
  const randomLabel =
    possibleLabels[Math.floor(Math.random() * possibleLabels.length)];

  const newItem: FoodItem = {
    id: String(Date.now()),
    name: randomLabel,
    // Simulasi tanggal kedaluwarsa 7 hari dari sekarang
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    addedAt: new Date().toISOString(),
  };

  // Menambahkan item baru ke data mock untuk simulasi
  mockInventoryData.push(newItem);

  console.log(`API: Berhasil! Teridentifikasi sebagai ${randomLabel}.`);
  return { success: true, label: randomLabel, item: newItem };
};

// --- EKSPOR FUNGSI ---
// Switch antara implementasi nyata dan mock berdasarkan flag
export const getInventory = IS_MOCK_MODE ? getInventoryMock : getInventoryReal;
export const uploadFoodImage = IS_MOCK_MODE
  ? uploadFoodImageMock
  : uploadFoodImageReal;
