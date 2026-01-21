import { useQuery } from 'convex/react';
import { View } from 'react-native';
import { LoadingComponent } from '~/components/Ui/LoadingComponent';
import { api } from '~/convex/_generated/api';
import { SearchComponent } from '~/features/common/components/SearchComponent';
import { useSearch } from '~/features/common/hook/use-search';
import { RenderStaffs } from '~/features/staff/components/render-search-all-staffs';
import { WorkerData } from '~/features/staff/type';

export const FetchSearchAllStaffs = () => {
  const { value, setValue, query } = useSearch();
  const workersData = useQuery(api.staff.searchStaffsToEmploy, { query });

  if (workersData === undefined) {
    return (
      <View style={{ flex: 1 }}>
        <SearchComponent
          value={value}
          placeholder={'Search staffs...'}
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
        placeholder={'Search staffs...'}
        setValue={setValue}
        show={true}
      />
      <RenderStaffs data={data} emptyText={'No staff found'} />
    </View>
  );
};
