import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { Id } from "~/convex/_generated/dataModel";

type Props = {
  ownerId?: Id<"users">;
};
export const useConnections = ({ ownerId }: Props) => {
  return useQuery(
    api.connection.getUserConnections,
    ownerId
      ? {
          ownerId,
        }
      : "skip",
  );
};
