import { Container } from "~/components/Ui/Container";
import { HeaderNav } from "~/components/HeaderNav";
import { FetchOrgsByServicePoints } from "~/features/organization/components/fetch-orgs-by-service-points";
import { useLocalSearchParams } from "expo-router";

const ServicePointQueryScreen = () => {
  const { query } = useLocalSearchParams<{ query: string }>();
  return (
    <Container>
      <HeaderNav title={query} />
      <FetchOrgsByServicePoints query={query} />
    </Container>
  );
};
export default ServicePointQueryScreen;
