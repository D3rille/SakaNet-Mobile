import React from 'react'
import { StyleSheet, Text, TextStyle } from 'react-native'
import { scale } from 'react-native-size-matters'

interface LabelProps {
    text: string;
    style?: TextStyle; 
}

export default function Label({ text, style = {} }: LabelProps) {
    return (
        <Text style={[styles.label, style]}>{text}</Text>
    )
}

const styles = StyleSheet.create({
    label: {
        fontSize: scale(14),
        color: '#000000'
    }
})
