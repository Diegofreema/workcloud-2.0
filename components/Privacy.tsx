import { View } from 'react-native';

import { AuthHeader } from './AuthHeader';
import { MyText } from './Ui/MyText';

export const Privacy = (): JSX.Element => {
  return (
    <View>
      <AuthHeader path="Workcloud Privacy Policy" />
      <MyText
        poppins="Medium"
        fontSize={20}
        style={{ marginTop: 20, textAlign: 'justify' }}
      >
        At Workcloud, we prioritize your privacy and the security of your
        personal data. We collect only the necessary information to provide and
        improve our services. Your data is never sold to third parties and is
        shared only with trusted service providers essential to our platform's
        operations. We implement industry-standard encryption and security
        measures to safeguard your data. Users have the right to access, modify,
        or delete their information at any time. By using Workcloud, you agree
        to our data collection and usage practices.
      </MyText>
    </View>
  );
};
