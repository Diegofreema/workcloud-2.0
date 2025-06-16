import { Doc, Id } from "~/convex/_generated/dataModel";

export type Suggestions = Doc<"servicePoints">;

export type BFetchOrgsByServicePointsType = {
  id: Id<"organizations">;
  name: string;
  image: string;
  description?: string;
};
