import { View } from "react-native";
import { SearchComponent } from "~/features/common/components/SearchComponent";
import { useSearch } from "~/features/common/hook/use-search";
import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { useGetUserId } from "~/hooks/useGetUserId";
import { LoadingComponent } from "~/components/Ui/LoadingComponent";
import { RenderStaffs } from "~/features/staff/components/render-search-all-staffs";
import { WorkerData } from "~/features/staff/type";

export const FetchSearchAllStaffs = () => {
  const { value, setValue, query } = useSearch();
  const { id } = useGetUserId();

  const workersData = useQuery(
    api.staff.searchStaffsToEmploy,
    id ? { query, loggedInUserId: id } : "skip",
  );

  if (workersData === undefined) {
    return (
      <View style={{ flex: 1 }}>
        <SearchComponent
          value={value}
          placeholder={"Search staffs..."}
          setValue={setValue}
          show={true}
        />
        <LoadingComponent />
      </View>
    );
  }
  const data = workersData.filter((item) => item !== null) as WorkerData[];

  return (
    <View>
      <SearchComponent
        value={value}
        placeholder={"Search staffs..."}
        setValue={setValue}
        show={true}
      />
      <RenderStaffs data={data} emptyText={"No staff found"} />
    </View>
  );
};
