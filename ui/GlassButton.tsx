import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';

interface GlassButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
}

export const GlassButton: React.FC<GlassButtonProps> = ({ title, onPress, style }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, style]}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 5
  },
  text: {
    color: '#8e44ad',
    fontSize: 18,
    fontWeight: '600'
  }
});