const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Data mock untuk inventaris
const mockInventoryData = [
  { id: "1", name: "Susu", expiryDate: "2024-12-25" },
  { id: "2", name: "Roti", expiryDate: "2024-12-20" },
  { id: "3", name: "Telur", expiryDate: "2024-12-28" },
  { id: "4", name: "Keju", expiryDate: "2025-01-15" },
];

export const getInventory = async () => {
  console.log("API: Mengambil data inventaris...");
  await delay(1000); // Simulasi delay 1 detik
  console.log("API: Inventaris berhasil diambil.");
  return mockInventoryData;
};

export const uploadFoodImage = async (imageUri: string) => {
  console.log(`API: Mengunggah gambar dari ${imageUri}...`);
  await delay(2000); // Simulasi proses AI yang memakan waktu 2 detik

  // Simulasi hasil identifikasi yang acak
  const possibleLabels = ["Apel", "Pisang", "Tomat", "Wortel", "Ayam"];
  const randomLabel =
    possibleLabels[Math.floor(Math.random() * possibleLabels.length)];

  // Simulasi kegagalan 10% of the time
  if (Math.random() < 0.1) {
    console.log("API: Gagal mengidentifikasi.");
    return { success: false };
  }

  console.log(`API: Berhasil! Teridentifikasi sebagai ${randomLabel}.`);
  return { success: true, label: randomLabel };
};
