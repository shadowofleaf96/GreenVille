package ma.mk.greenville.utils;

import android.os.Build;
import android.view.View;
import android.view.Window;
import android.view.WindowInsets;

import androidx.annotation.NonNull;
import androidx.core.view.WindowInsetsCompat;

public class StatusBarUtils {

    public static void setStatusBarColor(Window window, int color) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.VANILLA_ICE_CREAM) {
            window.getDecorView().setOnApplyWindowInsetsListener(new View.OnApplyWindowInsetsListener() {
                @NonNull
                @Override
                public WindowInsets onApplyWindowInsets(@NonNull View view, @NonNull WindowInsets insets) {
                    WindowInsetsCompat insetsCompat = WindowInsetsCompat.toWindowInsetsCompat(insets);
                    int statusBarInsets = insetsCompat.getInsets(WindowInsetsCompat.Type.statusBars()).top;
                    view.setBackgroundColor(color);

                    view.setPadding(0, statusBarInsets, 0, 0);
                    return insets;
                }
            });
        } else {
            window.setStatusBarColor(color);
        }
    }
}