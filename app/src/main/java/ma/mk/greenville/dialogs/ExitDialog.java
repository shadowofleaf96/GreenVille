package ma.mk.greenville.dialogs;

import android.annotation.SuppressLint;
import android.app.AlertDialog;
import android.content.Context;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.core.content.ContextCompat;
import java.util.Objects;
import ma.mk.greenville.R;

public class ExitDialog {

    @SuppressLint("SetTextI18n")
    public static void showExitDialog(Context context, Runnable onExit) {
        LayoutInflater inflater = LayoutInflater.from(context);
        View customView = inflater.inflate(R.layout.dialog_exit, null);

        ImageView dialogImage = customView.findViewById(R.id.dialogImage);
        dialogImage.setImageResource(R.drawable.baseline_exit_to_app_24);

        TextView messageTextView = customView.findViewById(R.id.dialogMessage);
        messageTextView.setText("Are you sure you want to exit the app? " +
                "Don't miss out on exploring our organic products for a healthier lifestyle.");

        AlertDialog.Builder builder = new AlertDialog.Builder(context, R.style.CustomDialogTheme)
                .setView(customView)
                .setCancelable(false);

        AlertDialog dialog = builder.create();
        dialog.show();

        Window window = dialog.getWindow();
        if (window != null) {
            Objects.requireNonNull(dialog.getWindow()).setBackgroundDrawableResource(R.drawable.dialog_rounded_background);
            WindowManager.LayoutParams layoutParams = window.getAttributes();
            layoutParams.width = (int) (context.getResources().getDisplayMetrics().widthPixels * 0.8);
            window.setAttributes(layoutParams);
        }

        Button positiveButton = customView.findViewById(R.id.positiveButton);
        Button negativeButton = customView.findViewById(R.id.negativeButton);

        positiveButton.setText("Exit");
        positiveButton.setTextColor(ContextCompat.getColor(context, R.color.white));
        positiveButton.setBackground(ContextCompat.getDrawable(context, R.drawable.button_exit));
        positiveButton.setOnClickListener(v -> {
            onExit.run();
            dialog.dismiss();
        });

        negativeButton.setText("Cancel");
        negativeButton.setTextColor(ContextCompat.getColor(context, R.color.lime_green));
        negativeButton.setBackgroundColor(ContextCompat.getColor(context, android.R.color.transparent));
        negativeButton.setOnClickListener(v -> dialog.dismiss());
    }
}
