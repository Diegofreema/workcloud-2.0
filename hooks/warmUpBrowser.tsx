import * as WebBrowser from "expo-web-browser";
import React from "react";

export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

//  const onSignInWIthGoogle = async () => {
//    try {
//      const { createdSessionId, setActive } = await startSSOFlow({
//        strategy: 'oauth_google',
//        redirectUrl: AuthSession.makeRedirectUri(),
//      });

//      if (createdSessionId) {
//        setActive!({ session: createdSessionId });
//      } else {
//        toast.error('Something went wrong', {
//          description: 'Please try again later',
//        });
//      }
//    } catch (error) {
//      console.log(error);

//      toast.error('Something went wrong', {
//        description: 'Please try again later',
//      });
//    }
//  };
