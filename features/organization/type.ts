import {Doc} from "~/convex/_generated/dataModel";

export type Suggestions = Doc<'servicePoints'> & {
    organizationName: string
}