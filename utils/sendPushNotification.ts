export async function sendPushNotification({
  body,
  data,
  title,
  expoPushToken,
}: {
  expoPushToken: string;
  title: string;
  body: string;
  data: Record<string, string>;
}) {
  const message = {
    to: expoPushToken,
    title,
    body,
    sound: 'default',
    data,
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}
