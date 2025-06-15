import notifee, { AndroidImportance, TimestampTrigger, TriggerType } from '@notifee/react-native';

export async function setupNotificationChannel() {
  await notifee.createChannel({
    id: 'meeting-reminder',
    name: 'Meeting Reminder',
    importance: AndroidImportance.HIGH,
  });
}

export async function scheduleMeetingNotification(meetingId: string, title: string, waktuMulaiISO: string) {
  const triggerTimestamp = new Date(new Date(waktuMulaiISO).getTime() - 10 * 60 * 1000); // 10 menit sebelumnya

  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: triggerTimestamp.getTime(),
  };

  await notifee.createTriggerNotification(
    {
      id: meetingId,
      title: 'Pengingat Meeting',
      body: `"${title}" akan dimulai dalam 10 menit!`,
      android: {
        channelId: 'meeting-reminder',
        smallIcon: 'ic_launcher', 
      },
    },
    trigger
  );
}

export async function cancelMeetingNotification(meetingId: string) {
  await notifee.cancelNotification(meetingId);
}
