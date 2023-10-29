import { Appbar, useTheme } from 'react-native-paper';

const Header = ({ route, navigation }) => {
    const theme = useTheme();
    const openDrawer = () => {
        navigation.openDrawer();
    };

    return (
        <Appbar.Header
            safeAreaInsets={{}}
            style={{
                backgroundColor: theme.colors.darkPrimary
            }}>
          
            <Appbar.Action
                icon="menu"
                color={theme.colors.light}
                onPress={openDrawer}
            />
            <Appbar.Content color={theme.colors.light} title={route.name} />
        </Appbar.Header>
    );
};

export default Header;