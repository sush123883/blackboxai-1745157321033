import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Switch, StyleSheet, Alert } from 'react-native';
import api from '../services/api';

export default function AdminInventoryManagementScreen() {
  const [menuItems, setMenuItems] = useState([]);

  const fetchInventory = async () => {
    try {
      const response = await api.get('/admin/inventory');
      setMenuItems(response.data);
    } catch (err) {
      Alert.alert('Error', 'Failed to fetch inventory');
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const toggleAvailability = async (id, currentValue) => {
    try {
      await api.put(`/admin/inventory/${id}`, { available: !currentValue });
      Alert.alert('Success', 'Inventory updated');
      fetchInventory();
    } catch (err) {
      Alert.alert('Error', 'Failed to update inventory');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Switch
        value={item.available}
        onValueChange={() => toggleAvailability(item._id, item.available)}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Inventory Management</Text>
      <FlatList
        data={menuItems}
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
  item: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  itemName: { fontSize: 16 },
});
