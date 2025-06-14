import {useGetUserId} from "~/hooks/useGetUserId";
import {useQuery} from "convex/react";
import {api} from "~/convex/_generated/api";
import {ChatPreviewSkeleton} from "~/components/ChatPreviewSkeleton";
import {RenderStaffs} from "~/features/staff/components/render-staffs";

export const FetchStaffs = () => {
  const { id } = useGetUserId();
  const staffs = useQuery(
    api.organisation.getStaffsByBossId,
    id ? { bossId: id } : "skip",
  );
  if (staffs === undefined) return <ChatPreviewSkeleton length={6} />;
  const data = staffs.map((item) => ({
    name: item?.user?.name!,
    image: item?.user?.imageUrl!,
    id: item?.user?._id!,
    role: item.role!,
    workspace: item.workspace,

  }));
  return <RenderStaffs data={data} />;
};
