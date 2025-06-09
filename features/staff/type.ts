import { Doc, Id } from "~/convex/_generated/dataModel";

export type StaffType = "processor" | "frontier";

export type WorkerData = {
  user: Doc<"users">;
  worker: Doc<"workers"> | null;
};

export type ProcessorType = {
  name: string;
  id: Id<"users">;
  role: string;
  image: string;
};
