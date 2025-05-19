import { useMemo } from "react";
import { Doc, Id } from "~/convex/_generated/dataModel";

type Data = {
  request: {
    _id: Id<"requests">;
    _creationTime: number;
    unread: boolean;
    role: string;
    responsibility: string;
    salary: string;
    from: Id<"users">;
    to: Id<"users">;
    qualities: string;
    accepted: boolean;
    pending: boolean;
  };
  organisation: {} | null;
};

type Props = {
  data: Data[] | undefined;
};
export const useUnreadNotificationCount = ({ data }: Props) => {
  return useMemo(
    () => data?.filter((r) => r?.request?.unread).length || 0,
    [data],
  );
};
