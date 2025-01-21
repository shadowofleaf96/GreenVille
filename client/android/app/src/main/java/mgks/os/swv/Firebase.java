package mgks.os.swv;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import android.util.Log;

import androidx.core.app.NotificationCompat;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

public class Firebase extends FirebaseMessagingService {

	private final String fcm_channel = SmartWebView.asw_fcm_channel;

	@Override
	public void onNewToken(String s) {
		super.onNewToken(s);
		Log.d("Firebase", "onNewToken() called"); // Prominent log to confirm if it's called
		if (!s.isEmpty()) {
			SmartWebView.fcm_token = s;
			Log.d("TOKEN_REFRESHED", s); // Log the new token
			// Send the token to your server if needed
		} else {
			Log.d("TOKEN_REFRESHED", "NULL >> FAILED");
		}
	}

	@Override
	public void onMessageReceived(RemoteMessage message) {
		if (message.getNotification() != null) {
			String title = message.getNotification().getTitle();
			String body = message.getNotification().getBody();
			String uri = message.getData().get("uri");
			String click_action = message.getNotification().getClickAction();

			// Use default values if null
			if (uri == null) {
				uri = SmartWebView.ASWV_URL;
			}
			if (click_action == null) {
				click_action = "OPEN_URI";
			}

			Log.d("FCM_MESSAGE", "Title: " + title + ", Body: " + body + ", URI: " + uri + ", Click Action: " + click_action);

			sendMyNotification(title, body, click_action, uri, message.getData().get("tag"), message.getData().get("nid"), this); // Pass context from here
		}
	}

	public void sendMyNotification(String title, String message, String click_action, String uri, String tag, String nid, Context context) {
		// Create an intent based on the URI
		Intent intent;
		if (uri == null || uri.isEmpty() || uri.startsWith("file://")) {
			intent = new Intent(context, MainActivity.class);
		} else {
			intent = new Intent(Intent.ACTION_VIEW, Uri.parse(uri));
		}
		intent.setAction(click_action);
		intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK);

		// Create a PendingIntent
		PendingIntent pendingIntent;
		pendingIntent = PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);

		// Use a unique ID for each notification or a more robust default
		int notification_id = nid != null ? Integer.parseInt(nid) : SmartWebView.ASWV_FCM_ID;

		// Build the notification
		NotificationCompat.Builder notificationBuilder = new NotificationCompat.Builder(context, fcm_channel)
			.setSmallIcon(R.mipmap.ic_launcher) // Use a specific notification icon if available
			.setContentTitle(title) // Remove notification ID from title
			.setContentText(message)
			.setAutoCancel(true)
			.setSound(RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION))
			.setContentIntent(pendingIntent)
			.setPriority(NotificationCompat.PRIORITY_HIGH);

		// Get the NotificationManager
		NotificationManager notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);

		// Create a notification channel for Android Oreo and above
		if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
			NotificationChannel channel = new NotificationChannel(fcm_channel, "SWV Channel", NotificationManager.IMPORTANCE_HIGH); // Use a more descriptive channel name
			notificationManager.createNotificationChannel(channel);
		}

		// Notify
		notificationManager.notify(notification_id, notificationBuilder.build());
	}
}
