import { Input } from '@rneui/themed';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList } from 'react-native';

import { MyText } from './Ui/MyText';

import { useGetCat } from '~/hooks/useGetCat';
import { ThemedText } from './Ui/themed-text';

const data = [
  'Finance and Banking',
  'Venture capital firm',
  'Medical Services',
  'Healthcare',
  'Healthcare clinic',
  'Medical device manufacturer',
  'Manufacturing and Industrial',
  'Food production company',
  'Packaging company',
  'Construction and Engineering',
  'Architectural firm',
  'Shopping mall',
  'E-commerce company',
  'Supermarkets',
  'Fashion company',
  'Cosmetic company',
  'Real Estate',
  'Property Management',
  'Logistics and Transportation',
  'Public transportation',
  'Airlines',
  'Car rental',
  'Energy and Utilities',
  'Oil and gas',
  'Solar energy company',
  'Telecommunications and IT',
  'IT service providers',
  'Social media companies',
  'Education and Training',
  'University',
  'College',
  'Government agency',
  'Government and Public Sector',
  'NGO',
  'Food Production',
  'Fitness center',
  'Television network',
  'Cinema',
  'Consulting firm',
  'Professional Service',
  'Pest control company',
  'Security and Safety',
  'Cleaning service',
  'Creative and Publishing',
  'Restaurants',
  'Food delivery services',
  'Regulatory agency',
  'Vehicle maintenance service',
  'Arts and Culture',
  'Event Planning and Management',
  'Corporate event organizers',
  'Fitness and Wellness',
  'PR firm',
  'Freight shipping company',
  'Gadget company',
  'Research and Development',
  'Medical research institutions',
  'Technology innovation hub',
  'Mining and Natural Resources',
  'Solar panel installation company',
  'Packaging and Printing',
  'Cleaning and Maintenance',
  'Environmental Services',
  'Internet service provider',
  'Data center operators',
  'Urban planning firm',
  'Property investment firm',
  'Booking platform',
  'Travel and Hospitality',
  'Emergency Services',
  'Ambulance services',
  'Public Safety',
  'Daycare center',
  'Hotel services',
];

export const CategoryFlatList = (): JSX.Element => {
  const [selected, setSelected] = useState('');
  const setCat = useGetCat((state) => state.setCat);
  const onPress = (text: string) => {
    setCat(text);
    router.back();
  };
  const filteredCats = useMemo(() => {
    if (selected.length === 0) return data;
    return data.filter((cat) =>
      cat.toLowerCase().includes(selected.toLowerCase())
    );
  }, [selected]);
  return (
    <>
      <Input placeholder="Search" onChangeText={setSelected} value={selected} />
      <FlatList
        ListHeaderComponent={() => (
          <MyText poppins="Bold" fontSize={20}>
            Select a category
          </MyText>
        )}
        data={filteredCats}
        renderItem={({ item }) => (
          <ThemedText
            onPress={() => onPress(item)}
            style={{
              fontSize: 14,
              fontFamily: 'PoppinsMedium',
            }}
          >
            {item}
          </ThemedText>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 15, paddingVertical: 10 }}
      />
    </>
  );
};
