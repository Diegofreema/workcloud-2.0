import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { LoadingComponent } from "~/components/Ui/LoadingComponent";
import { RenderOrgsByServicePoints } from "~/features/organization/components/render-orgs-by-service-points";

type Props = {
  query: string;
};
export const FetchOrgsByServicePoints = ({ query }: Props) => {
  const data = useQuery(
    api.servicePoints.getOrganizationsByNameOfServicePoints,
    { query },
  );
  if (data === undefined) {
    return <LoadingComponent />;
  }

  return <RenderOrgsByServicePoints data={data} />;
};
