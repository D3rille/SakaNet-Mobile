import React from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';

type CategoryItem = {
    label: string;
    value: string;
};

interface ProductCategoriesProps {
    onSelect: (value: string) => void;
}

const categories: CategoryItem[] = [
    { label: 'All', value: '' },
    { label: 'Cereals', value: 'Cereals' },
    { label: 'Root Crops', value: 'Rootcrops' },
    { label: 'Beans and Legumes', value: 'Beans and Legumes' },
    { label: 'Condiments', value: 'Condiments' },
    { label: 'Fruit Vegetables', value: 'Fruit Vegetables' },
    { label: 'Leafy Vegetables', value: 'Leafy Vegetables' },
    { label: 'Fruits', value: 'Fruits' },
    { label: 'Commercial Crops', value: 'Commercial Crops' },
    { label: 'Cut Flowers', value: 'Cutflowers' },
    { label: 'Livestock and Poultry (Backyard)', value: 'Livestock and Poultry (Backyard)' },
];

const ProductCategories: React.FC<ProductCategoriesProps> = ({ onSelect }) => {
    const renderItem = ({ item }: { item: CategoryItem }) => (
        <TouchableOpacity style={styles.item} onPress={() => onSelect(item.value)}>
            <Text style={styles.label}>{item.label}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={categories}
                renderItem={renderItem}
                keyExtractor={(item) => item.value}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: 'white',
        maxHeight: 250,
    },
    item: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    label: {
        fontSize: 16,
    },
});

export default ProductCategories;
