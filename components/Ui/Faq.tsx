import { AntDesign } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import Animated from 'react-native-reanimated';

import { HStack } from '../HStack';
import { MyText } from './MyText';

import { useTheme } from '~/hooks/use-theme';

const SECTIONS = [
  {
    title: 'What are the Organizational Benefit of workcloud',
    content: [
      'To reduce high cost of operation required to run a physical workspace',
      'Reduction of over crowded workspace environment',
      'Avoidance of workspace disaster',
      'Improved customer service and convenience',
      'Improved staff productivity and remote working',
    ],
  },
  {
    title: 'How is the creation of workcloud impacting work ethics in Africa',
    content: [
      'The creation and adoption of workcloud will positively impact work ethics in African by promoting flexibility, and productivity. It would improve remote work, encourage skills development, increase access to resources, and speed to solutions',
    ],
  },
  {
    title: 'How is workcloud creating the future workspace of tomorrow',
    content: [
      "Workcloud is shaping the future workspace by leveraging cloud technology to offer flexible, virtual work environments. By enabling remote collaboration, optimizing resources, and promoting accessibility, it's fostering a dynamic work culture that adapts to evolving needs. This approach could redefine traditional of office spaces, offering a more versatile, efficient, and globally connected workspace for tomorrow",
    ],
  },
  {
    title: 'What opportunities are on workcloud',
    content: [
      'Job Opportunities',
      'Monetization',
      'Networking',
      'Collaboration',
    ],
  },
  {
    title: 'What is workcloud Sales workspace',
    content: [
      'Workcloud Sales Workspace is a comprehensive and innovative platform designed to facilitate seamless and engaging sales interactions between sellers and buyers. It offers a dynamic environment where sellers can engage buyers through real time video interaction leveraging the unique Spotlight feature to recommend products effectively. Additionally, the workspace provides real time visibility in to buyer behavior during product selection, enabling sellers to offer tailored assistance and guidance.This interactive approach enhances the sales process, fostering efficient communication and personalized customer experiences within a cloud based environment.',
    ],
  },
  {
    title: 'Why Should I use sales workspace',
    content: [
      'Enhanced Engagement : It enables real time, interactive engagement between sellers and buyers through live video calls, fostering a more personalized and engaging sales experience. Efficient Product Showcase: The Spotlight feature allows sellers to effectively highlight and recommend products, increasing the chances of successful sales by show casing items in a focused manner. Insightful Buyer Behavior Analysis: The ability to observe buyer actions and preferences during product selection provides valuable insights. Sellers can tailor recommendations or assistance based on real time buyer.',
    ],
  },
];
const AnimatedIcon = Animated.createAnimatedComponent(AntDesign);
export const Faq: React.FC = () => {
  const [activeSections, setActiveSections] = useState<number[]>([]);

  const { theme: darkMode } = useTheme();

  const renderHeader = (
    section: { title: string },
    index: number,
    isActive: boolean
  ) => {
    return (
      <HStack justifyContent="space-between" alignItems="center">
        <MyText poppins="Bold" fontSize={16} style={{ maxWidth: '70%' }}>
          {section.title}
        </MyText>
        <AnimatedIcon
          name="right"
          size={24}
          color={darkMode === 'dark' ? '#fff' : '#000'}
          style={{ transform: [{ rotate: isActive ? '90deg' : '0deg' }] }}
        />
      </HStack>
    );
  };

  const renderContent = (section: { title: string; content: string[] }) => (
    <View style={styles.content}>
      {section.content.map((item, index) => (
        <MyText
          poppins="LightItalic"
          fontSize={14}
          style={{
            lineHeight: 25,
            color: darkMode === 'dark' ? 'white' : 'gray',
          }}
          key={index}
        >
          {item}
        </MyText>
      ))}
    </View>
  );

  const updateSections = (newActiveSections: number[]) => {
    setActiveSections(newActiveSections);
  };

  return (
    <Accordion
      sections={SECTIONS}
      activeSections={activeSections}
      renderHeader={renderHeader}
      renderContent={renderContent}
      onChange={updateSections}
      containerStyle={{ gap: 15, marginTop: 10 }}
      sectionContainerStyle={styles.header}
      underlayColor={darkMode === 'dark' ? '#222' : '#f1f1f1'}
    />
  );
};

const styles = StyleSheet.create({
  content: {
    // Add your content styles here
  },
  header: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 15,
    gap: 10,
  },
  headerText: {
    // Add your header text styles here
  },
});
