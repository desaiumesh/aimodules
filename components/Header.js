import React from 'react';
import { Appbar, useTheme, Switch } from 'react-native-paper';
import { PreferencesContext } from './PreferencesContext';

const Header = ({ route, navigation, color }) => {

    const theme = useTheme();
    const openDrawer = () => {
        navigation.openDrawer();
    };

    const headerProps = {};

    if (Platform.OS === 'android') {
        headerProps.statusBarHeight = 0;
    };

    return (
        <Appbar.Header {...headerProps} statusBarHeight={0}
            safeAreaInsets={{}}
            style={{
                backgroundColor: color
            }}>

            <Appbar.Action
                icon="menu"
                onPress={openDrawer}
            />
           
            <Appbar.Content color={theme.colors.light} title={route.name} />

        </Appbar.Header>
    );
};

export default Header;