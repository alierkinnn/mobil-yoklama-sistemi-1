import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Eğer bu kütüphaneyi kullanmıyorsanız, kendi ikon kütüphanenizi kullanabilirsiniz.
import styles from './AdminAnaSayfaDropdownStyle';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamsList } from '../../../App';

interface AdminAnaSayfaDropdownProps {
  title: string;
  options: { label: string; value: string }[];
  onSelect: (option: { label: string; value: string }) => void;
}

const AdminAnaSayfaDropdown: React.FC<AdminAnaSayfaDropdownProps> = ({ title, options, onSelect}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: { label: string; value: string }) => {
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <View>
      <TouchableOpacity style={styles.dropdown} onPress={() => setIsOpen(!isOpen)}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
          <Text style={styles.dropdownText}>{title}</Text>
          <Ionicons style={{color: 'white'}} name={isOpen ? 'chevron-down-outline' : 'chevron-forward-outline'} size={20} color="#000" />
        </View>
      </TouchableOpacity>

      {isOpen && (
        <FlatList
          data={options}
          keyExtractor={(item) => item.value.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelect(item)}>
              <View style={styles.optionItem}>
                <Text style={styles.optionText}>{item.label}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default AdminAnaSayfaDropdown;
