import { BFetchOrgsByServicePointsType } from "~/features/organization/type";
import Card from "~/features/common/components/card";
import { Image } from "expo-image";
import { CustomPressable } from "~/components/Ui/CustomPressable";
import { trimText } from "~/lib/helper";
import { router } from "expo-router";

type OrganizationCardProps = {
  data: BFetchOrgsByServicePointsType;
};

export const OrganizationCard = ({ data }: OrganizationCardProps) => {
  const onPress = () => {
    // @ts-ignore
    router.push(`reception/${data.id}`);
  };
  return (
    <CustomPressable onPress={onPress}>
      <Card>
        <Card.Header>
          <Card.Title>{data.name}</Card.Title>
          <Image
            source={data.image}
            placeholder={require("~/assets/images/pl.png")}
            style={{ width: "100%", height: 200, borderRadius: 8 }}
          />
        </Card.Header>
        {data?.description && (
          <Card.Footer>
            <Card.Description>
              {trimText(data.description, 100)}
            </Card.Description>
          </Card.Footer>
        )}
      </Card>
    </CustomPressable>
  );
};
