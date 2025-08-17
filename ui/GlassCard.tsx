import React from 'react';
import { ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';

interface GlassCardProps {
  style?: ViewStyle;
  children?: React.ReactNode;
}

export const GlassCard: React.FC<GlassCardProps> = ({ style, children }) => {
  return (
    <BlurView intensity={50} tint="dark" style={[{
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderRadius: 16,
      padding: 16
    }, style]}>
      {children}
    </BlurView>
  );
};