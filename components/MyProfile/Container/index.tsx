import React, { ReactNode } from 'react'
import { ScrollView, StyleSheet, View, SafeAreaView } from 'react-native'
import { COLORS } from '../../../constants';

interface ContainerProps {
    children: ReactNode;
    isScrollable?: boolean;
}

export default function Container({ children, isScrollable = false }: ContainerProps) {
    return (
        <SafeAreaView style={styles.container}>
            {isScrollable ? 
                <ScrollView>
                    <View style={styles.innerView}>{children}</View>
                </ScrollView> :
                <View style={styles.innerView}>{children}</View>
            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.pageBg 
    },
    innerView: {
        flex: 1,
        // paddingHorizontal: scale(15)
    }
})
