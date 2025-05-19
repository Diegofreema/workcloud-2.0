import {useQuery} from "convex/react";
import {api} from "~/convex/_generated/api";
import {Id} from "~/convex/_generated/dataModel";


type Props = {
    id: Id<'users'> | undefined
}

export const usePendingRequestWithOrganization = ({id}: Props) => {
    return useQuery(api.request.getPendingRequestsWithOrganization, {
        id: id!,
    });

};