import { useMutation } from 'convex/react';
import { useState } from 'react';
import { TextInput, View } from 'react-native';
import { toast } from 'sonner-native';

import { MyButton } from './Ui/MyButton';
import { MyText } from './Ui/MyText';

import { api } from '~/convex/_generated/api';
import { useTheme } from '~/hooks/use-theme';
import { Button } from '~/features/common/components/Button';

export const AddRole = ({
  onNavigate,
}: {
  onNavigate: (item: string) => void;
}) => {
  const { theme: darkMode } = useTheme();
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const addRole = useMutation(api.staff.createStaffRole);

  const onAddRole = async () => {
    if (value === '') return;

    setLoading(true);
    try {
      await addRole({ role: value.charAt(0).toUpperCase() + value.slice(1) });

      onNavigate(value);
      toast.success('Role added successfully');
      setValue('');
    } catch (error) {
      console.log(error);
      toast.error('Failed to add role');
    } finally {
      setLoading(false);
    }
  };

  console.log(value === '', loading);

  return (
    <View style={{ gap: 10, paddingTop: 15 }}>
      <MyText poppins="Medium" fontSize={15}>
        Couldn't find a role
      </MyText>
      <TextInput
        placeholder="Enter a custom one"
        placeholderTextColor={darkMode === 'dark' ? 'white' : 'black'}
        style={{
          borderWidth: 1,
          borderRadius: 5,
          marginTop: 10,
          padding: 10,
          height: 55,
          borderColor: 'gray',
          color: darkMode === 'dark' ? 'white' : 'black',
        }}
        onEndEditing={onAddRole}
        value={value}
        onChangeText={setValue}
      />
      <Button
        onPress={onAddRole}
        disabled={value === '' || loading}
        loading={loading}
        title="Add custom role"
      />
    </View>
  );
};
