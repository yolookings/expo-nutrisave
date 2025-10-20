import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as api from "../services/api";

const CameraScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();

  if (!permission) {
    return <View />; // Tampilan kosong selagi menunggu status izin
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.message}>
          Kami butuh izin Anda untuk menggunakan kamera.
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Berikan Izin</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      setIsProcessing(true);
      try {
        // Ambil gambar dengan kualitas 70% untuk mengurangi ukuran file
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.7,
        });
        if (!photo?.uri) {
          throw new Error("Gagal mengambil gambar.");
        }

        const result = await api.uploadFoodImage(photo.uri);

        if (result.success) {
          // REKOMENDASI: Gunakan library toast/snackbar untuk UX yang lebih baik
          // daripada Alert. Contoh: react-native-toast-message
          Alert.alert(
            "Berhasil!",
            `Makanan teridentifikasi sebagai: ${result.label}.\nItem telah ditambahkan ke inventaris.`,
            [{ text: "OK", onPress: () => router.back() }]
          );
        } else {
          Alert.alert(
            "Gagal",
            result.message || "Tidak dapat mengidentifikasi makanan. Coba lagi."
          );
        }
      } catch (error: any) {
        console.error("Error in takePicture:", error);
        Alert.alert(
          "Error",
          error.message || "Terjadi kesalahan saat memproses gambar."
        );
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef} facing="back">
        {isProcessing && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>Mengidentifikasi...</Text>
          </View>
        )}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.captureButton,
              isProcessing && styles.captureButtonDisabled,
            ]}
            onPress={takePicture}
            disabled={isProcessing}
          />
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  message: { textAlign: "center", fontSize: 16, marginBottom: 20 },
  permissionButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  permissionButtonText: { color: "white", fontSize: 16 },
  camera: { flex: 1 },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingBottom: 50,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "white",
    borderWidth: 5,
    borderColor: "gray",
  },
  captureButtonDisabled: {
    backgroundColor: "#9E9E9E",
    borderColor: "#616161",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: { color: "white", marginTop: 10, fontSize: 16 },
});

export default CameraScreen;
