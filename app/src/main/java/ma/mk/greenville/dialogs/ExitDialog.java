package ma.mk.greenville.dialogs;

import android.app.AlertDialog;
import android.content.Context;
import android.graphics.drawable.Drawable;
import android.view.Gravity;
import android.view.Window;
import android.view.WindowManager;
import android.widget.TextView;
import androidx.core.content.ContextCompat;

import java.util.Objects;

import ma.mk.greenville.R;

public class ExitDialog {

    public static void showExitDialog(Context context, Runnable onExit) {
        String message = "Are you sure you want to exit the app? Don't miss out on exploring our organic products for a healthier lifestyle.";
        String positiveButtonLabel = "Exit";
        String negativeButtonLabel = "Cancel";

        Drawable icon = ContextCompat.getDrawable(context, R.drawable.ic_exit);

        AlertDialog.Builder builder = new AlertDialog.Builder(context)
                .setTitle("Exit App")
                .setMessage(message)
                .setIcon(icon)
                .setCancelable(false)
                .setPositiveButton(positiveButtonLabel, (dialog, id) -> {
                    onExit.run();
                })
                .setNegativeButton(negativeButtonLabel, null);

        AlertDialog dialog = builder.create();
        dialog.show();

        Objects.requireNonNull(dialog.getWindow()).setBackgroundDrawableResource(R.drawable.dialog_background);

        Window window = dialog.getWindow();
        if (window != null) {
            WindowManager.LayoutParams layoutParams = window.getAttributes();
            layoutParams.width = WindowManager.LayoutParams.MATCH_PARENT;
            layoutParams.width = (int) (context.getResources().getDisplayMetrics().widthPixels * 0.8);
            window.setAttributes(layoutParams);
        }

        TextView messageTextView = dialog.findViewById(android.R.id.message);
        if (messageTextView != null) {
            messageTextView.setGravity(Gravity.START);
            messageTextView.setTextSize(15);
        }

        dialog.getButton(AlertDialog.BUTTON_POSITIVE).setTextColor(ContextCompat.getColor(context, R.color.black));
        dialog.getButton(AlertDialog.BUTTON_NEGATIVE).setTextColor(ContextCompat.getColor(context, R.color.black));
    }
}
