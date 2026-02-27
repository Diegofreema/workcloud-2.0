import { EvilIcons } from '@expo/vector-icons';
import { useQuery } from 'convex/react';
import { Image } from 'expo-image';
import * as Linking from 'expo-linking';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { HeaderNav } from '~/components/HeaderNav';
import { ServicePointLists } from '~/components/ServicePointLists';
import { Container } from '~/components/Ui/Container';
import { LoadingComponent } from '~/components/Ui/LoadingComponent';
import { MyButton } from '~/components/Ui/MyButton';
import { MyText } from '~/components/Ui/MyText';
import { colors } from '~/constants/Colors';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';
import { useTheme } from '~/hooks/use-theme';

/** Sends an unauthenticated user to login, preserving where to return. */
const redirectToLogin = (orgId: string, page: 'reception' | 'overview') => {
  router.push(`/login?redirect=${page}&orgId=${orgId}`);
};

type OrgItemProps = { name: any; text: any; website?: boolean };

const OrganizationItem = ({ name, text, website }: OrgItemProps) => {
  const { theme: darkMode } = useTheme();
  if (website) {
    return (
      <Pressable
        onPress={() => Linking.openURL('https://' + text)}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}
      >
        <EvilIcons
          color={darkMode === 'dark' ? colors.white : colors.textGray}
          name={name}
          size={24}
        />
        <MyText
          poppins="Bold"
          style={{
            color: darkMode === 'dark' ? colors?.lightBlue : colors.buttonBlue,
            fontSize: 10,
          }}
        >
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
        }}
      >
        {text}
      </Text>
    </View>
  );
};

const PublicOverview = () => {
  const { id } = useLocalSearchParams<{ id: Id<'organizations'> }>();
  const { theme: darkMode } = useTheme();
  const { width } = useWindowDimensions();

  const data = useQuery(api.organisation.getOrganisationWithServicePoints, {
    organizationId: id,
  });

  if (!data) return <LoadingComponent />;

  const { organization, servicePoints } = data;
  const startDay = organization?.workDays?.split('-')[0];
  const endDay = organization?.workDays?.split('-')[1];

  return (
    <Container>
      <HeaderNav
        title={organization?.name!}
        subTitle={organization?.category}
      />

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        {/* Avatar + description */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View style={{ alignItems: 'center', flexDirection: 'row', gap: 10 }}>
            <Image
              style={{ width: 70, height: 70, borderRadius: 50 }}
              contentFit="cover"
              source={{ uri: organization?.avatar! }}
              placeholder={require('../../../assets/images.png')}
            />
            <View>
              <Text
                style={{
                  fontFamily: 'PoppinsBold',
                  maxWidth: width * 0.7,
                  fontSize: 12,
                  color: darkMode === 'dark' ? colors.white : colors.black,
                }}
              >
                {organization?.description}
              </Text>
            </View>
          </View>
        </View>

        {/* Opening hours */}
        <View style={{ marginTop: 10, paddingTop: 10 }}>
          <MyText poppins="Light" style={{ fontSize: 13 }}>
            Opening hours:
          </MyText>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 20,
              marginTop: 10,
            }}
          >
            <Text
              style={{
                fontFamily: 'PoppinsBold',
                fontSize: 10,
                color: darkMode === 'dark' ? colors.white : colors.black,
                textTransform: 'uppercase',
              }}
            >
              {startDay} - {endDay}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  padding: 5,
                  borderRadius: 5,
                  backgroundColor: '#CCF2D9',
                }}
              >
                <Text
                  style={{
                    color: '#00C041',
                    fontFamily: 'PoppinsBold',
                    fontSize: 10,
                  }}
                >
                  {organization?.start}
                </Text>
              </View>
              <Text
                style={{
                  marginBottom: 4,
                  color: darkMode === 'dark' ? colors.white : colors.black,
                }}
              >
                {' '}
                —{' '}
              </Text>
              <View
                style={{
                  backgroundColor: '#FFD9D9',
                  padding: 5,
                  borderRadius: 5,
                }}
              >
                <Text
                  style={{
                    color: '#D61B0C',
                    fontFamily: 'PoppinsBold',
                    fontSize: 10,
                  }}
                >
                  {organization?.end}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Details */}
        <View style={{ gap: 10, marginTop: 15 }}>
          <OrganizationItem name="envelope" text={organization?.email} />
          <OrganizationItem name="location" text={organization?.location} />
          <OrganizationItem name="link" text={organization?.website} website />
          <Text
            style={{
              fontFamily: 'PoppinsBold',
              fontSize: 12,
              color: darkMode === 'dark' ? colors.white : colors.black,
            }}
          >
            Members {organization?.followers?.length || 0}
          </Text>
        </View>

        {/* CTA — redirects to login */}
        <View style={{ marginTop: 10, marginBottom: 20, width: '100%' }}>
          <MyButton
            onPress={() => redirectToLogin(id, 'overview')}
            contentStyle={{ height: 50 }}
            buttonStyle={{ width: '100%' }}
          >
            Join
          </MyButton>
        </View>

        <ServicePointLists data={servicePoints} />
      </ScrollView>
    </Container>
  );
};

export default PublicOverview;
