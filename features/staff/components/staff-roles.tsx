import { FlatList, StyleSheet } from 'react-native';
import { MyText } from '~/components/Ui/MyText';
import React from 'react';
import { colors } from '~/constants/Colors';
import { CustomPressable } from '~/components/Ui/CustomPressable';
import { capitaliseFirstLetter } from '~/lib/helper';

type Props = {
  roles: string[];
  setRole: (role: string) => void;
  role: string;
};
export const StaffRoles = ({ roles, setRole, role }: Props) => {
  const uniquesRoles = [...new Set(roles)];
  return (
    <FlatList
      horizontal
      style={{ marginBottom: 10 }}
      showsHorizontalScrollIndicator={false}
      data={['All', ...uniquesRoles]}
      contentContainerStyle={{ gap: 20 }}
      renderItem={({ item }) => (
        <CustomPressable
          style={[styles.buttonStyle, role === item && styles.activeButton]}
          onPress={() => setRole(item)}
        >
          <MyText
            style={{ color: role === item ? 'white' : 'black' }}
            poppins="Medium"
            fontSize={13}
          >
            {capitaliseFirstLetter(item)}
          </MyText>
        </CustomPressable>
      )}
      keyExtractor={(item) => item?.toString()}
    />
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: colors.buttonSmall,
    padding: 3,
    paddingHorizontal: 5,
    borderRadius: 5,
  },

  activeButton: {
    backgroundColor: colors.dialPad,
    padding: 3,
    paddingHorizontal: 5,
    borderRadius: 5,
  },
});
