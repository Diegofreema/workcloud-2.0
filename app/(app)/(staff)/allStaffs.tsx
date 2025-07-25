import { useQuery } from "convex/react";
import { router } from "expo-router";
import { Search } from "lucide-react-native";
import React from "react";
import { HeaderNav } from "~/components/HeaderNav";
import { Container } from "~/components/Ui/Container";
import { CustomPressable } from "~/components/Ui/CustomPressable";
import { LoadingComponent } from "~/components/Ui/LoadingComponent";
import { colors } from "~/constants/Colors";
import { api } from "~/convex/_generated/api";
import { RenderStaffs } from "~/features/staff/components/render-search-all-staffs";
import { WorkerData } from "~/features/staff/type";

const AllStaffs = () => {
  const staffs = useQuery(api.worker.getAllOtherWorkers, {});

  if (staffs === undefined) {
    return <LoadingComponent />;
  }

  const data = staffs.filter((staff) => staff.user !== null) as WorkerData[];
  console.log({ data });
  return (
    <Container>
      <HeaderNav
        title="Add staff"
        rightComponent={
          <CustomPressable onPress={() => router.push("/search-all-staffs")}>
            <Search color={colors.black} size={20} />
          </CustomPressable>
        }
      />
      <RenderStaffs data={data} />
    </Container>
  );
};

export default AllStaffs;
