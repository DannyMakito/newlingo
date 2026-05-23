import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardEvent,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type VerificationModalProps = {
  visible: boolean;
  email: string;
  onClose: () => void;
  onVerify: (code: string) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
};

export function VerificationModal({
  visible,
  email,
  onClose,
  onVerify,
  isLoading = false,
  error = null,
}: VerificationModalProps) {
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);
  const [code, setCode] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    if (!visible) {
      setKeyboardHeight(0);
      setCode("");
      return;
    }

    const timer = setTimeout(() => inputRef.current?.focus(), 400);

    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const onKeyboardShow = (event: KeyboardEvent) => {
      setKeyboardHeight(event.endCoordinates.height);
    };

    const onKeyboardHide = () => {
      setKeyboardHeight(0);
    };

    const showSub = Keyboard.addListener(showEvent, onKeyboardShow);
    const hideSub = Keyboard.addListener(hideEvent, onKeyboardHide);

    return () => {
      clearTimeout(timer);
      showSub.remove();
      hideSub.remove();
    };
  }, [visible]);

  const handleCodeChange = async (text: string) => {
    if (isLoading) {
      return;
    }

    const digits = text.replace(/\D/g, "").slice(0, 6);
    setCode(digits);

    if (digits.length === 6) {
      Keyboard.dismiss();
      await onVerify(digits);
    }
  };

  const displayEmail = email.trim() || "your email";
  const sheetBottomPadding = Math.max(insets.bottom, 16);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} disabled={isLoading} />

        <View style={{ marginBottom: keyboardHeight }}>
          <View style={[styles.sheet, { paddingBottom: sheetBottomPadding }]}>
            <View style={styles.handle} />
            <Text style={styles.title}>Check your email</Text>
            <Text style={styles.subtitle}>
              We sent a 6-digit verification code to{"\n"}
              <Text style={styles.email}>{displayEmail}</Text>
            </Text>

            <View style={styles.codeInputArea}>
              <Pressable
                onPress={() => inputRef.current?.focus()}
                style={styles.codeRow}
                disabled={isLoading}
              >
                {Array.from({ length: 6 }).map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.codeBox,
                      code.length === index && styles.codeBoxActive,
                    ]}
                  >
                    <Text style={styles.codeDigit}>{code[index] ?? ""}</Text>
                  </View>
                ))}
              </Pressable>

              <TextInput
                ref={inputRef}
                value={code}
                onChangeText={handleCodeChange}
                keyboardType="number-pad"
                maxLength={6}
                editable={!isLoading}
                autoComplete="one-time-code"
                textContentType="oneTimeCode"
                caretHidden
                style={styles.hiddenInput}
              />
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            {isLoading ? (
              <ActivityIndicator
                color="#6C4EF5"
                style={styles.loader}
                size="small"
              />
            ) : (
              <Text style={styles.hint}>
                Enter the code using your number pad
              </Text>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E5E7EB",
    marginBottom: 20,
  },
  title: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 20,
    lineHeight: 26,
    color: "#0D132B",
    textAlign: "center",
  },
  subtitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    lineHeight: 22,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 8,
  },
  email: {
    fontFamily: "Poppins-Medium",
    color: "#0D132B",
  },
  codeInputArea: {
    marginTop: 32,
    position: "relative",
    minHeight: 56,
  },
  codeRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  codeBox: {
    width: 44,
    height: 56,
    marginHorizontal: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    backgroundColor: "#F6F7FB",
    alignItems: "center",
    justifyContent: "center",
  },
  codeBoxActive: {
    borderColor: "#6C4EF5",
    backgroundColor: "#F3F0FF",
  },
  codeDigit: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 20,
    color: "#0D132B",
  },
  hiddenInput: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 56,
    opacity: 0,
  },
  hint: {
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    lineHeight: 20,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 24,
    marginBottom: 8,
  },
  error: {
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    lineHeight: 20,
    color: "#FF4D4F",
    textAlign: "center",
    marginTop: 16,
  },
  loader: {
    marginTop: 24,
    marginBottom: 8,
  },
});
