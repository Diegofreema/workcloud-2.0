import { useQuery } from 'convex/react';
import { ChatPreviewSkeleton } from '~/components/ChatPreviewSkeleton';
import { api } from '~/convex/_generated/api';
import { RenderStaffs } from '~/features/staff/components/render-staffs';

export const FetchStaffs = () => {
  const staffs = useQuery(api.organisation.getStaffsByBossId);
  if (staffs === undefined) return <ChatPreviewSkeleton length={6} />;
  const data = staffs.map((item) => ({
    name: item?.user?.name!,
    image: item?.user?.image!,
    id: item?.user?._id!,
    role: item.role!,
    workspace: item.workspace,
  }));
  return <RenderStaffs data={data} />;
};
