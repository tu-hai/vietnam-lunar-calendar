import { useRef, useEffect } from "react";
import { PanResponder, PanResponderInstance } from "react-native";

export const useSwipeGesture = (onSwipeLeft: () => void, onSwipeRight: () => void, swipeThreshold = 50) => {
  const onSwipeLeftRef = useRef(onSwipeLeft);
  const onSwipeRightRef = useRef(onSwipeRight);

  useEffect(() => {
    onSwipeLeftRef.current = onSwipeLeft;
    onSwipeRightRef.current = onSwipeRight;
  }, [onSwipeLeft, onSwipeRight]);

  const panResponder = useRef<PanResponderInstance>(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 10;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > swipeThreshold) {
          onSwipeRightRef.current();
        } else if (gestureState.dx < -swipeThreshold) {
          onSwipeLeftRef.current();
        }
      },
    })
  ).current;

  return panResponder;
};

export const useVerticalSwipeGesture = (onSwipeUp: () => void, onSwipeDown: () => void, swipeThreshold = 50) => {
  const onSwipeUpRef = useRef(onSwipeUp);
  const onSwipeDownRef = useRef(onSwipeDown);

  useEffect(() => {
    onSwipeUpRef.current = onSwipeUp;
    onSwipeDownRef.current = onSwipeDown;
  }, [onSwipeUp, onSwipeDown]);

  const panResponder = useRef<PanResponderInstance>(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 10;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy < -swipeThreshold) {
          onSwipeUpRef.current();
        } else if (gestureState.dy > swipeThreshold) {
          onSwipeDownRef.current();
        }
      },
    })
  ).current;

  return panResponder;
};
