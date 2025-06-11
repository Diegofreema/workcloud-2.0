import { useQuery } from 'convex/react';
import { EvilIcons } from '@expo/vector-icons';

import { Image } from 'expo-image';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AuthHeader } from '~/components/AuthHeader';
import { CreateWorkspaceModal } from '~/components/Dialogs/CreateWorkspace';
import { DeleteWksSpaceModal } from '~/components/Dialogs/DeleteWks';
import { SelectRow } from '~/components/Dialogs/SelectRow';
import { Review } from '~/components/Review';
import { Container } from '~/components/Ui/Container';
import { LoadingComponent } from '~/components/Ui/LoadingComponent';
import { MyText } from '~/components/Ui/MyText';
import { WorkspaceDetails } from '~/components/WorkspaceDetails';
import { colors } from '~/constants/Colors';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';
import { useCreate } from '~/hooks/useCreate';
import { useDarkMode } from '~/hooks/useDarkMode';
import { useGetUserId } from '~/hooks/useGetUserId';

const MyOrg = () => {
  const { id } = useGetUserId();
  const data = useQuery(api.organisation.getOrganizationWithOwnerAndWorkspaces, {
    ownerId: id as Id<'users'>,
  });

  const { onOpen } = useCreate();
  const { darkMode } = useDarkMode();

  if (!data) {
    return <LoadingComponent />;
  }

  const startDay = data?.workDays?.split('-')[0];
  const endDay = data?.workDays?.split('-')[1];

  return (
    <Container>
      {/*@ts-ignore*/}
      <CreateWorkspaceModal workspace={data?.workspaces!} />
      <SelectRow organizationId={data?._id!} profile={data?.owner!} />
      <DeleteWksSpaceModal />
      <AuthHeader style={{ alignItems: 'center' }} path="Manage Organizations" />
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View style={{ alignItems: 'center', flexDirection: 'row', gap: 10 }}>
            <Image
              style={{ width: 70, height: 70, borderRadius: 50 }}
              contentFit="cover"
              source={{ uri: data?.avatar! }}
              placeholder={require('~/assets/images/boy.png')}
              placeholderContentFit="cover"
            />
            <View>
              <Text
                style={{
                  fontFamily: 'PoppinsBold',

                  fontSize: 14,
                  color: darkMode === 'dark' ? colors.white : colors.black,
                }}>
                {data?.name}
              </Text>
              <Text
                style={{
                  fontFamily: 'PoppinsMedium',
                  fontSize: 10,
                  color: darkMode === 'dark' ? colors.white : colors.black,
                }}>
                {data?.owner?.name?.split(' ')?.[0]} | Admin
              </Text>
            </View>
          </View>
          {id === data?.owner?._id && (
            <Pressable
              style={({ pressed }) => ({
                padding: 5,
                opacity: pressed ? 0.5 : 1,
                backgroundColor: colors.buttonBlue,
                borderRadius: 5,
                width: 100,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
              })}
              onPress={() => router.push(`/(app)/(organization)/edit/${data?._id}`)}>
              <MyText poppins="Medium" fontSize={14} style={{ color: 'white' }}>
                Edit
              </MyText>
            </Pressable>
          )}
        </View>
        <View
          style={{
            marginTop: 10,
            borderTopColor: darkMode === 'dark' ? colors.black : colors.gray,
            borderTopWidth: StyleSheet.hairlineWidth,
            paddingTop: 10,
          }}>
          <MyText
            poppins="Light"
            style={{
              fontSize: 13,
            }}>
            {data?.description}
          </MyText>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 20,
              marginTop: 10,
            }}>
            <Text
              style={{
                fontFamily: 'PoppinsBold',
                fontSize: 10,

                color: darkMode === 'dark' ? colors.white : colors.black,
                textTransform: 'uppercase',
              }}>
              {startDay} - {endDay}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  padding: 5,
                  borderRadius: 5,
                  backgroundColor: '#CCF2D9',
                }}>
                <Text
                  style={{
                    color: '#00C041',
                    fontFamily: 'PoppinsBold',
                    fontSize: 10,
                  }}>
                  {data?.start}
                </Text>
              </View>
              <Text style={{ marginBottom: 8 }}> — </Text>
              <View
                style={{
                  backgroundColor: '#FFD9D9',

                  padding: 5,
                  borderRadius: 5,
                }}>
                <Text
                  style={{
                    color: '#D61B0C',
                    fontFamily: 'PoppinsBold',
                    fontSize: 10,
                  }}>
                  {data?.end}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            gap: 10,
            marginTop: 15,
          }}>
          <OrganizationItems name="envelope" text={data?.email} />
          <OrganizationItems name="location" text={data?.location} />
          <OrganizationItems name="link" text={data?.website} website />
          <Text
            style={{
              fontFamily: 'PoppinsBold',
              fontSize: 12,
              color: darkMode === 'dark' ? colors.white : colors.black,
            }}>
            Members {data?.followers?.length || 0}
          </Text>
        </View>
        <View>
          <View
            style={{
              marginVertical: 20,
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: darkMode === 'dark' ? colors.black : colors.gray,
            }}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 15,
          }}>
          <WorkspaceDetails
            onPress={onOpen}
            darkMode={darkMode}
            uri={require('~/assets/images/workspace.png')}
            name="Workspaces"
          />

          <WorkspaceDetails
            onPress={() => router.push(`/staffs/${id}`)}
            darkMode={darkMode}
            uri={require('~/assets/images/staff.png')}
            name="Staffs"
          />
          <WorkspaceDetails
            onPress={() => router.push(`/message`)}
            darkMode={darkMode}
            uri={require('~/assets/images/message.png')}
            name="Messages"
          />

          <WorkspaceDetails
            onPress={() => router.push(`/posts/${data?._id}`)}
            darkMode={darkMode}
            uri={require('~/assets/images/post.png')}
            name="Posts"
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <WorkspaceDetails
            onPress={() => router.push(`/services?id=${data?._id}`)}
            darkMode={darkMode}
            uri={require('~/assets/images/service.png')}
            name="Service point"
          />
        </View>
        <Review userId={id!} organizationId={data?.owner?.organizationId!} showComments />
      </ScrollView>
    </Container>
  );
};

export default MyOrg;

type SubProps = {
  name: any;
  text: any;
  website?: boolean;
};
export const OrganizationItems = ({ name, text, website }: SubProps) => {
  const { darkMode } = useDarkMode();

  if (website) {
    return (
      <Pressable
        onPress={() => Linking.openURL('https://' + text)}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
        <EvilIcons
          color={darkMode === 'dark' ? colors.white : colors.textGray}
          name={name}
          size={24}
        />
        <MyText
          poppins="Bold"
          style={{
            color: colors.buttonBlue,

            fontSize: 10,
          }}>
          {text}
        </MyText>
      </Pressable>
    );
  }
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
      <EvilIcons
        color={darkMode === 'dark' ? colors.white : colors.textGray}
        name={name}
        size={24}
      />
      <Text
        style={{
          color: darkMode === 'dark' ? colors.white : colors.textGray,
          fontFamily: 'PoppinsBold',
          fontSize: 10,
        }}>
        {text}
      </Text>
    </View>
  );
};
