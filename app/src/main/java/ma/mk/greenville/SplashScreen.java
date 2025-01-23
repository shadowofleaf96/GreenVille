package ma.mk.greenville;



import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;

@SuppressLint("CustomSplashScreen")
public class SplashScreen extends Activity {
	@Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);

		int SPLASH_TIME_OUT = 3000;
		new Handler().postDelayed(() -> {
			Intent i = new Intent(SplashScreen.this, MainActivity.class);
			startActivity(i);
			finish();
		}, SPLASH_TIME_OUT);
    }
}
