import { AuthHeader } from './AuthHeader';
import { Contact } from './Ui/Contact';
import { Container } from './Ui/Container';
import { CustomTabs } from './Ui/CustomTabs';
import { Faq } from './Ui/Faq';

export const HelpComponent = (): JSX.Element => {
  return (
    <Container noPadding>
      <AuthHeader path="Help" style={{ paddingHorizontal: 20 }} />
      <CustomTabs content1={<Faq />} content2={<Contact />} />
    </Container>
  );
};
