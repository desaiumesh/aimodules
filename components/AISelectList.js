import { StyleSheet } from 'react-native'
import React from 'react'
import { SelectList } from 'react-native-dropdown-select-list'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from 'react-native-paper'
import { text } from 'stream/consumers';

const AISelectList = ({ data, setSelected, placeholderText, searchPlaceholderText }) => {
    const theme = useTheme();
    const styles = selectListStyles(theme.colors)
    return (
        <SelectList
            boxStyles={styles.boxStyles}
            inputStyles={styles.inputStyles}
            dropdownStyles={styles.dropdownStyles}
            dropdownTextStyles={styles.dropdownTextStyles}
            setSelected={setSelected}
            data={data}
            arrowicon={<Ionicons name="chevron-down" size={20} color={theme.colors.onPrimary} />}
            searchicon={<Ionicons name="search" size={20} color={theme.colors.onPrimary} />}
            closeicon={<Ionicons name="close" size={20} color={theme.colors.onPrimary} />}
            search={true}
            placeholder={placeholderText}
            searchPlaceholder={searchPlaceholderText}
        />
    )
}

const selectListStyles = (colors) => StyleSheet.create({
    boxStyles: {
        borderRadius: 10,
        opacity: 0.7,
        fontWeight: 'bold',
        backgroundColor: colors.primary
    },
    inputStyles: {
        color: colors.onPrimary,
        fontWeight: 'bold'
    },
    dropdownStyles: {
        opacity: 0.7,
        borderRadius: 10,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: 'bold',
        backgroundColor: colors.primary
    },
    dropdownTextStyles: {
        color: colors.onPrimary,
        fontWeight: 'bold'
    }
});


export default AISelectList