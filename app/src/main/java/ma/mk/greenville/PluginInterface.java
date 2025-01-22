package ma.mk.greenville;



import android.app.Activity;
import android.content.Intent;
import android.webkit.WebResourceRequest;
import android.webkit.WebView;

import androidx.annotation.NonNull;

public interface PluginInterface {
	void initialize(Activity activity, WebView webView);
	String getPluginName();
	String[] getOverriddenUrls();
	void handlePermissionRequest(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults);
	void handleActivityResult(int requestCode, int resultCode, Intent data);
	boolean shouldOverrideUrlLoading(WebView view, String url);
	void onPageStarted(String url);
	void onPageFinished(String url);

	boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request);

	void onQRCodeScanResult(String result);
}
