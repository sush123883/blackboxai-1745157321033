import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import api from '../services/api';

export default function OrderTrackingScreen({ route }) {
  const { orderId } = route.params;
  const [status, setStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrderStatus = async () => {
    try {
      const response = await api.get(`/orders/status/${orderId}`);
      setStatus(response.data.status);
      setPaymentStatus(response.data.paymentStatus);
      setEstimatedDeliveryTime(response.data.estimatedDeliveryTime);
    } catch (err) {
      Alert.alert('Error', 'Failed to fetch order status');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrderStatus();
    const interval = setInterval(fetchOrderStatus, 10000); // refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loading} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Status</Text>
      <Text>Status: {status}</Text>
      <Text>Payment Status: {paymentStatus}</Text>
      {estimatedDeliveryTime && <Text>Estimated Delivery Time: {new Date(estimatedDeliveryTime).toLocaleString()}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
