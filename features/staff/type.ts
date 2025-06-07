import { Doc } from "~/convex/_generated/dataModel";

export type StaffType = "processor" | "frontier";

export type WorkerData = {
  user: Doc<"users">;
  worker: Doc<"workers"> | null
};
