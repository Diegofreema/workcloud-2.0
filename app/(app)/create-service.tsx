import { AuthHeader } from '~/components/AuthHeader';
import { ServicePointForm } from '~/components/Forms/ServicePointForm';
import { Container } from '~/components/Ui/Container';

const CreateServicePoint = () => {
  return (
    <Container>
      <AuthHeader path="Create Service Point" />
      <ServicePointForm />
    </Container>
  );
};

export default CreateServicePoint;
