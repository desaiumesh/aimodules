import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer'
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { appStyles } from '../styles/appStyle';

const DrawerContent = () => {

    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <DrawerContentScrollView>
                <View>
                    <View style={styles.innerContainer}>
                        <Ionicons name='person-circle' size={100} />
                    </View>
                    <DrawerItem label="Home" labelStyle={styles.drawerItemLabel} style={styles.drawerItem} icon={() => (<Ionicons name="home" size={drawerIconSize} color={appStyles.drawerLabelColor} />)} onPress={() => { navigation.navigate('Home') }} />
                    <DrawerItem label="Text" labelStyle={styles.drawerItemLabel} style={styles.drawerItem} icon={() => (<Ionicons name="document-text" size={drawerIconSize} color={appStyles.drawerLabelColor} />)} onPress={() => { navigation.navigate('Text') }} />
                    <DrawerItem label="Speech" labelStyle={styles.drawerItemLabel} style={styles.drawerItem} icon={() => (<Ionicons name="mic" size={drawerIconSize} color={appStyles.drawerLabelColor} />)} onPress={() => { navigation.navigate('Speech') }} />
                    <DrawerItem label="Vision" labelStyle={styles.drawerItemLabel} style={styles.drawerItem} icon={() => (<Ionicons name="laptop-outline" size={drawerIconSize} color={appStyles.drawerLabelColor} />)} onPress={() => { navigation.navigate('Speech') }} />
                    <DrawerItem label="Language" labelStyle={styles.drawerItemLabel} style={styles.drawerItem} icon={() => (<Ionicons name="language" size={drawerIconSize} color={appStyles.drawerLabelColor} />)} onPress={() => { navigation.navigate('Speech') }} />

                </View>
            </DrawerContentScrollView>
        </View>
    )
};

let drawerIconSize = 30;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: appStyles.drawerFlyoutBackgroundColor
    },
    innerContainer: {
        alignItems: 'center'
    },
    drawerItemLabel: {
        color: appStyles.drawerLabelColor,
        fontWeight: 'bold',
        fontSize: 16
    },
    drawerItem: {
        backgroundColor: appStyles.primaryColor
    },
});

export default DrawerContent;