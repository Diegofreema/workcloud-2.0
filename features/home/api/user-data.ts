import {useAuth} from "@clerk/clerk-expo";
import {useQuery} from "convex/react";
import {api} from "~/convex/_generated/api";


type UserData = {
    userId?: string;

}

export const useUserData = ({userId}: UserData) => {
  return useQuery(api.users.getUserByClerkId, { clerkId: userId! });

};