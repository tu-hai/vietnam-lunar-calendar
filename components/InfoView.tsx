import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert, ActivityIndicator, Image } from "react-native";

export default function InfoView() {
  const version = "1.0.0";
  const buildNumber = "1";
  const [isChecking, setIsChecking] = useState(false);

  const compareVersions = (v1: string, v2: string) => {
    const parts1 = v1.split(".").map(Number);
    const parts2 = v2.split(".").map(Number);

    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const num1 = parts1[i] || 0;
      const num2 = parts2[i] || 0;
      if (num1 > num2) return 1;
      if (num1 < num2) return -1;
    }
    return 0;
  };

  const handleCheckUpdate = async () => {
    setIsChecking(true);

    try {
      const response = await fetch("https://api.github.com/repos/tu-hai/vietnam-lunar-calendar/releases/latest");

      if (!response.ok) {
        throw new Error("Không thể kiểm tra cập nhật");
      }

      const data = await response.json();
      const latestVersion = data.tag_name.replace("v", "");
      const downloadUrl = data.html_url;

      const comparison = compareVersions(latestVersion, version);

      if (comparison > 0) {
        Alert.alert(
          "🎉 Có bản cập nhật mới!",
          `Phiên bản hiện tại: ${version}\nPhiên bản mới: ${latestVersion}\n\n${
            data.body || "Nhấn 'Tải về' để cập nhật ngay!"
          }\n\nHướng dẫn cài đặt:\n1. Tải file APK từ GitHub\n2. Mở file APK trên điện thoại\n3. Chọn 'Cài đặt' hoặc 'Cập nhật'\n4. Dữ liệu của bạn sẽ được giữ nguyên`,
          [
            { text: "Để sau", style: "cancel" },
            { text: "Tải về", onPress: () => Linking.openURL(downloadUrl) },
          ]
        );
      } else {
        Alert.alert("✅ Đã cập nhật", `Bạn đang sử dụng phiên bản mới nhất: ${version}`, [{ text: "OK" }]);
      }
    } catch (error) {
      console.log("Update check error:", error);
      // Fallback for dev mode or errors
      if (__DEV__) {
        Alert.alert("Development Mode", "Checking GitHub Releases from Dev Mode. Ensure you have a release published.");
      } else {
        Alert.alert("Kiểm tra cập nhật", "Không thể kiểm tra phiên bản mới.\n\nBạn có thể kiểm tra thủ công tại GitHub Releases.", [
          { text: "Đóng", style: "cancel" },
          { text: "Mở GitHub", onPress: handleOpenGithub },
        ]);
      }
    } finally {
      setIsChecking(false);
    }
  };

  const handleOpenGithub = () => {
    Linking.openURL("https://github.com/tu-hai/vietnam-lunar-calendar/releases");
  };

  const handleContactEmail = () => {
    Linking.openURL("mailto:votuhai@gmail.com");
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* App Info */}
        <View style={styles.appInfoSection}>
          <Image source={require("../assets/icon.png")} style={styles.appIconImage} />
          <Text style={styles.appName}>Lịch Âm Dương</Text>
          <Text style={styles.appSlogan}>Lịch Việt - Theo dõi ngày giờ tốt</Text>
        </View>

        {/* Version Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin phiên bản</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phiên bản</Text>
            <Text style={styles.infoValue}>{version}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Build</Text>
            <Text style={styles.infoValue}>{buildNumber}</Text>
          </View>
        </View>

        {/* Check Update Button */}
        <TouchableOpacity style={[styles.updateButton, isChecking && styles.updateButtonDisabled]} onPress={handleCheckUpdate} disabled={isChecking}>
          {isChecking ? (
            <>
              <ActivityIndicator color="#fff" size="small" style={{ marginRight: 10 }} />
              <Text style={styles.updateButtonText}>Đang kiểm tra...</Text>
            </>
          ) : (
            <>
              <Text style={styles.updateButtonIcon}>🔄</Text>
              <Text style={styles.updateButtonText}>Kiểm tra cập nhật</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Installation Guide */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hướng dẫn cài đặt bản cập nhật</Text>
          <View style={styles.guideStep}>
            <Text style={styles.stepNumber}>1️⃣</Text>
            <Text style={styles.stepText}>Nhấn "Kiểm tra cập nhật" hoặc truy cập GitHub Releases</Text>
          </View>
          <View style={styles.guideStep}>
            <Text style={styles.stepNumber}>2️⃣</Text>
            <Text style={styles.stepText}>Tải file APK phiên bản mới nhất về máy</Text>
          </View>
          <View style={styles.guideStep}>
            <Text style={styles.stepNumber}>3️⃣</Text>
            <Text style={styles.stepText}>Mở file APK vừa tải (có thể cần bật "Cài đặt từ nguồn không xác định")</Text>
          </View>
          <View style={styles.guideStep}>
            <Text style={styles.stepNumber}>4️⃣</Text>
            <Text style={styles.stepText}>Chọn "Cài đặt" hoặc "Cập nhật" trên màn hình cài đặt</Text>
          </View>
          <View style={styles.guideStep}>
            <Text style={styles.stepNumber}>5️⃣</Text>
            <Text style={styles.stepText}>Đợi quá trình cài đặt hoàn tất và mở ứng dụng</Text>
          </View>
        </View>

        {/* Developer Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nhà phát triển</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phát triển bởi</Text>
            <Text style={styles.infoValue}>Võ Tứ Hải</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Năm phát hành</Text>
            <Text style={styles.infoValue}>2025</Text>
          </View>
        </View>

        {/* Contact Buttons */}
        <View style={styles.contactSection}>
          <TouchableOpacity style={styles.contactButton} onPress={handleContactEmail}>
            <Text style={styles.contactIcon}>✉️</Text>
            <Text style={styles.contactText}>Liên hệ hỗ trợ</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactButton} onPress={handleOpenGithub}>
            <Text style={styles.contactIcon}>💻</Text>
            <Text style={styles.contactText}>Mã nguồn</Text>
          </TouchableOpacity>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tính năng</Text>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>✓</Text>
            <Text style={styles.featureText}>Xem lịch âm dương</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>✓</Text>
            <Text style={styles.featureText}>Giờ hoàng đạo hàng ngày</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>✓</Text>
            <Text style={styles.featureText}>Ngày lễ Việt Nam</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>✓</Text>
            <Text style={styles.featureText}>Sự kiện sắp tới</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>✓</Text>
            <Text style={styles.featureText}>Xem theo ngày/tuần/tháng</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>✓</Text>
            <Text style={styles.featureText}>Không quảng cáo làm phiền</Text>
          </View>
        </View>

        {/* Copyright */}
        <View style={styles.copyrightSection}>
          <Text style={styles.copyrightText}>© 2025 Lịch Âm Dương</Text>
          <Text style={styles.copyrightSubtext}>Made with ❤️ in Da Nang Vietnam</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingBottom: 50,
  },
  scrollView: {
    flex: 1,
  },
  appInfoSection: {
    alignItems: "center",
    paddingVertical: 40,
    backgroundColor: "#fff",
  },
  appIconImage: {
    width: 100,
    height: 100,
    borderRadius: 20,
    marginBottom: 15,
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  appSlogan: {
    fontSize: 14,
    color: "#888",
  },
  section: {
    backgroundColor: "#fff",
    marginTop: 15,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  updateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    marginHorizontal: 20,
    marginTop: 15,
    paddingVertical: 15,
    borderRadius: 12,
  },
  updateButtonDisabled: {
    backgroundColor: "#9E9E9E",
    opacity: 0.7,
  },
  updateButtonIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  contactSection: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 15,
    gap: 10,
  },
  contactButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingVertical: 15,
    borderRadius: 12,
  },
  contactIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  contactText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  featureIcon: {
    fontSize: 16,
    color: "#4CAF50",
    marginRight: 10,
    fontWeight: "bold",
  },
  featureText: {
    fontSize: 14,
    color: "#666",
  },
  guideStep: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 10,
    paddingRight: 10,
  },
  stepNumber: {
    fontSize: 18,
    marginRight: 12,
    minWidth: 30,
  },
  stepText: {
    fontSize: 14,
    color: "#666",
    flex: 1,
    lineHeight: 20,
  },
  noteBox: {
    flexDirection: "row",
    backgroundColor: "#FFF9E6",
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
    borderLeftWidth: 3,
    borderLeftColor: "#FFC107",
  },
  noteIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  noteText: {
    fontSize: 13,
    color: "#856404",
    flex: 1,
    lineHeight: 18,
  },
  copyrightSection: {
    alignItems: "center",
    paddingVertical: 30,
  },
  copyrightText: {
    fontSize: 12,
    color: "#999",
  },
  copyrightSubtext: {
    fontSize: 12,
    color: "#999",
    marginTop: 5,
  },
});
