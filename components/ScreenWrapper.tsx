import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, ViewStyle } from "react-native";
import { useIsFocused } from "@react-navigation/native";

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function ScreenWrapper({ children, style }: ScreenWrapperProps) {
  const isFocused = useIsFocused();
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isFocused) {
      // Reset opacity to 0 and animate to 1
      opacity.setValue(0);
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250, // 250ms fade in
        useNativeDriver: true,
      }).start();
    }
  }, [isFocused]);

  return <Animated.View style={[styles.container, { opacity }, style]}>{children}</Animated.View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // Default background
  },
});
