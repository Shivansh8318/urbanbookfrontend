import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Container = ({ children, style }) => {
  return (
    <SafeAreaView style={[styles.container, style]}>
      <View style={styles.inner}>{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827', // Dark gray background (gray-900)
  },
  inner: {
    flex: 1,
  },
});

export default Container; 