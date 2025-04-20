import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Picker, StyleSheet, Alert } from 'react-native';
import api from '../services/api';

export default function AdminOrderManagementScreen() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/admin/orders');
      setOrders(response.data);
    } catch (err) {
      Alert.alert('Error', 'Failed to fetch orders');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, status) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status });
      Alert.alert('Success', 'Order status updated');
      fetchOrders();
    } catch (err) {
      Alert.alert('Error', 'Failed to update order status');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Text style={styles.orderId}>Order ID: {item._id}</Text>
      <Text>User: {item.user?.name || 'N/A'}</Text>
      <Text>Total Price: ${item.totalPrice.toFixed(2)}</Text>
      <Text>Status:</Text>
      <Picker
        selectedValue={item.status}
        style={styles.picker}
        onValueChange={(value) => updateOrderStatus(item._id, value)}
      >
        <Picker.Item label="Pending" value="pending" />
        <Picker.Item label="Preparing" value="preparing" />
        <Picker.Item label="Ready" value="ready" />
        <Picker.Item label="Out for Delivery" value="out_for_delivery" />
        <Picker.Item label="Completed" value="completed" />
        <Picker.Item label="Cancelled" value="cancelled" />
      </Picker>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Order Management</Text>
      <FlatList
        data={orders}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  orderItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  orderId: { fontWeight: 'bold', marginBottom: 5 },
  picker: { height: 50, width: '100%' },
});
