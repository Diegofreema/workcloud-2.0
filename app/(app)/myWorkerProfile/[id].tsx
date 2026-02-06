import {
  AntDesign,
  EvilIcons,
  MaterialCommunityIcons,
  SimpleLineIcons,
} from '@expo/vector-icons';
import { useMutation, useQuery } from 'convex/react';
import { format } from 'date-fns';
import { Redirect, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { toast } from 'sonner-native';

import { HStack } from '~/components/HStack';
import { HeaderNav } from '~/components/HeaderNav';
import { Container } from '~/components/Ui/Container';
import { LoadingComponent } from '~/components/Ui/LoadingComponent';
import { MyButton } from '~/components/Ui/MyButton';
import { MyText } from '~/components/Ui/MyText';
import { UserPreview } from '~/components/Ui/UserPreview';
import VStack from '~/components/Ui/VStack';
import { colors } from '~/constants/Colors';
import { api } from '~/convex/_generated/api';
import { Button } from '~/features/common/components/Button';
import { useTheme } from '~/hooks/use-theme';
import { generateErrorMessage } from '~/lib/helper';
import { CustomModal } from '~/components/Dialogs/CustomModal';
const Profile = () => {
  const [resigning, setResigning] = useState(false);
  const [open, setIsOpen] = useState(false);

  const data = useQuery(api.users.getWorkerProfileWithUser, {});
  const resign = useMutation(api.worker.resignFromOrganization);
  const { theme: darkMode } = useTheme();

  const router = useRouter();

  if (data === undefined) {
    return <LoadingComponent />;
  }

  if (data === null) {
    return <Redirect href={'/'} />;
  }

  const onResign = async () => {
    setResigning(true);
    try {
      await resign({
        workerId: data._id,
      });
      toast.success('Resigned successfully');
      setIsOpen(false);
    } catch (error) {
      const errorMessage = generateErrorMessage(error, 'Something went wrong');
      toast.error('An error occurred', {
        description: errorMessage,
      });
    } finally {
      setResigning(false);
    }
  };

  const formattedSkills = (text: string) => {
    const arrayOfSkills = text.split(',');

    return arrayOfSkills.map((skill, index) => (
      <View key={index} style={{ width: '100%' }}>
        <MyText poppins="Bold" style={{ color: colors.nine }}>
          {index + 1}. {skill}
        </MyText>
      </View>
    ));
  };

  return (
    <Container>
      <CustomModal
        title="Are you sure you want to resign from this organization?"
        btnText="Resign"
        onPress={onResign}
        isOpen={open}
        onClose={() => setIsOpen(false)}
        isLoading={resigning}
      />
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50, flexGrow: 1 }}
      >
        <HeaderNav title="Profile" />
        <View
          style={{
            marginTop: 10,
            marginBottom: 20,
            flexDirection: 'row',
            gap: 10,
            justifyContent: 'space-between',
          }}
        >
          <UserPreview
            imageUrl={data?.user.image!}
            name={data?.user?.name}
            roleText={data?.role}
            workPlace={data?.organization?.name!}
            personal
          />
        </View>

        <VStack mt={20} gap={15}>
          <HStack gap={5} alignItems="center">
            <AntDesign name="calendar" size={24} color={colors.grayText} />
            <MyText
              fontSize={12}
              poppins="Medium"
              style={{ color: colors.grayText }}
            >
              Joined since {format(data?._creationTime, 'do MMMM yyyy')}
            </MyText>
          </HStack>
          <HStack gap={5} alignItems="center" mb={10}>
            <EvilIcons name="location" size={24} color={colors.grayText} />
            <MyText
              fontSize={12}
              poppins="Medium"
              style={{ color: colors.grayText }}
            >
              {data?.location}
            </MyText>
          </HStack>
        </VStack>

        <VStack mt={20}>
          <MyText poppins="Bold" style={{ marginBottom: 10 }} fontSize={16}>
            Qualifications
          </MyText>

          <HStack gap={10} alignItems="center" pb={40}>
            <SimpleLineIcons
              name="graduation"
              size={24}
              color={darkMode === 'dark' ? 'white' : 'black'}
            />
            <MyText poppins="Medium" fontSize={12}>
              {data?.qualifications}
            </MyText>
          </HStack>
        </VStack>
        <VStack mt={20}>
          <MyText poppins="Bold" style={{ marginBottom: 10 }} fontSize={16}>
            Experience and Specialization
          </MyText>

          <HStack gap={10} alignItems="center" pb={40}>
            <SimpleLineIcons
              name="graduation"
              size={24}
              color={darkMode === 'dark' ? 'white' : 'black'}
            />
            <MyText poppins="Medium" fontSize={12}>
              {data?.experience}
            </MyText>
          </HStack>
        </VStack>

        <VStack mt={20}>
          <MyText poppins="Bold" style={{ marginBottom: 10 }} fontSize={16}>
            Skills
          </MyText>

          <HStack gap={10} pb={40}>
            <MaterialCommunityIcons
              name="clipboard-list-outline"
              size={24}
              color={darkMode === 'dark' ? 'white' : 'black'}
            />

            <VStack gap={5} alignItems="flex-start">
              {formattedSkills(data?.skills)}
            </VStack>
          </HStack>
        </VStack>
        <View style={{ marginTop: 'auto', gap: 10, marginBottom: 20 }}>
          <Button
            onPress={() =>
              router.push(`/myWorkerProfile/edit/${data.user._id}`)
            }
            title="Edit work profile"
          />
        </View>
        {data.bossId && (
          <Button
            onPress={() => setIsOpen(true)}
            title="Resign"
            style={{
              paddingHorizontal: 20,
              backgroundColor: colors.closeTextColor,
            }}
            loading={resigning}
            disabled={resigning}
            loadingTitle="Resigning..."
          />
        )}
      </ScrollView>
    </Container>
  );
};

export default Profile;
