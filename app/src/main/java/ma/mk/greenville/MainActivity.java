package ma.mk.greenville;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.view.KeyEvent;
import android.view.View;
import android.view.Window;
import androidx.activity.OnBackPressedCallback;
import android.view.WindowManager;
import android.webkit.DownloadListener;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import com.google.android.material.bottomnavigation.BottomNavigationView;

import java.util.Objects;

import ma.mk.greenville.databinding.ActivityMainBinding;

public class MainActivity extends AppCompatActivity {

    private ActivityMainBinding binding;
    private ValueCallback<Uri[]> filePathCallback;
    private static final int FILE_CHOOSER_REQUEST_CODE = 100;
    private WebView webView;
    private boolean isLoading = false;
    private Handler handler = new Handler();
    private int progress = 0;
    private SwipeRefreshLayout swipeRefreshLayout;
    private RelativeLayout splashScreen;
    private View noInternetLayout;
    private ProgressBar progressBar;
    private ProgressBar loadingBar;
    private Button retryButton;

    @SuppressLint({"SetJavaScriptEnabled", "NonConstantResourceId"})
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        webView = findViewById(R.id.webview);
        splashScreen = findViewById(R.id.splash_screen);
        swipeRefreshLayout = findViewById(R.id.swipe_refresh);
        BottomNavigationView navView = findViewById(R.id.nav_view);
        noInternetLayout = findViewById(R.id.no_internet_layout);
        retryButton = findViewById(R.id.retry_button);
        progressBar = findViewById(R.id.progress_bar);
        loadingBar = findViewById(R.id.loading_bar);

        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setJavaScriptCanOpenWindowsAutomatically(true);
        webSettings.setAllowFileAccess(true);
        webSettings.setBuiltInZoomControls(true);
        webSettings.setDisplayZoomControls(false);
        webSettings.setLoadWithOverviewMode(true);
        webSettings.setUseWideViewPort(true);

        webView.setWebViewClient(new WebViewClient() {
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                loadingBar.setVisibility(View.VISIBLE);
                isLoading = true;
                progressBar.setVisibility(View.VISIBLE);
                progressBar.setProgress(0);
                progress = 0;
                startProgressBar();
                super.onPageStarted(view, url, favicon);
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                splashScreen.setVisibility(View.GONE);
                isLoading = false;
                progressBar.setProgress(100);
                handler.removeCallbacksAndMessages(null);
                loadingBar.setVisibility(View.GONE);
                webView.setVisibility(View.VISIBLE);
                navView.setVisibility(View.VISIBLE);
                super.onPageFinished(view, url);
            }
            public boolean shouldOverrideUrlLoading(WebView view) {
                view.loadUrl(Objects.requireNonNull(view.getUrl()));
                return true;
            }

            @Override
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                Toast.makeText(MainActivity.this, "Error: " + description, Toast.LENGTH_SHORT).show();
            }
        });

        // File upload support
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                if (isLoading) {
                    progressBar.setProgress(newProgress);
                }
            }
            @Override
            public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback, WebChromeClient.FileChooserParams fileChooserParams) {
                MainActivity.this.filePathCallback = filePathCallback;
                Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
                intent.addCategory(Intent.CATEGORY_OPENABLE);
                intent.setType("*/*");
                startActivityForResult(Intent.createChooser(intent, "Choose File"), FILE_CHOOSER_REQUEST_CODE);
                return true;
            }
        });

        // Handle downloads
        webView.setDownloadListener(new DownloadListener() {
            @Override
            public void onDownloadStart(String url, String userAgent, String contentDisposition, String mimeType, long contentLength) {
                Intent intent = new Intent(Intent.ACTION_VIEW);
                intent.setData(Uri.parse(url));
                startActivity(intent);
            }
        });

        // Load your website
        webView.loadUrl("https://greenville-frontend.vercel.app/");

        navView.setOnItemSelectedListener(item -> {
            switch (item.getItemId()) {
                case R.id.navigation_home:
                    webView.loadUrl("https://greenville-frontend.vercel.app/");
                    break;
                case R.id.navigation_cart:
                    webView.loadUrl("https://greenville-frontend.vercel.app/cart");
                    break;
                case R.id.navigation_profile:
                    webView.loadUrl("https://greenville-frontend.vercel.app/profile");
                    break;
            }
            return true;
        });
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                finish();
            }
        });
        setupSwipeRefresh();
        setupRetryButton();
        checkInternetAndLoad();
    }

    private void startProgressBar() {
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                if (isLoading && progress < 100) {
                    progress += 1;
                    progressBar.setProgress(progress);
                    handler.postDelayed(this, 100);
                }
            }
        }, 100);
    }

    // Handle file chooser results
    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == FILE_CHOOSER_REQUEST_CODE && filePathCallback != null) {
            Uri[] results = (data == null || resultCode != RESULT_OK) ? null : new Uri[]{data.getData()};
            filePathCallback.onReceiveValue(results);
            filePathCallback = null;
        }
    }

    // Enable back navigation in WebView
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK && webView.canGoBack()) {
            webView.goBack();
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }

    private void setupSwipeRefresh() {
        swipeRefreshLayout.setOnRefreshListener(() -> {
            if (isConnected()) {
                webView.reload();
                swipeRefreshLayout.setRefreshing(false);
            } else {
                showNoInternetLayout();
                swipeRefreshLayout.setRefreshing(false);
            }
        });
    }

    private void setupRetryButton() {
        retryButton.setOnClickListener(v -> checkInternetAndLoad());
    }

    private void checkInternetAndLoad() {
        if (isConnected()) {
            noInternetLayout.setVisibility(View.GONE);
            webView.setVisibility(View.VISIBLE);
            webView.loadUrl("https://greenville-frontend.vercel.app/");
        } else {
            showNoInternetLayout();
        }
    }

    private void showNoInternetLayout() {
        webView.setVisibility(View.GONE);
        noInternetLayout.setVisibility(View.VISIBLE);
    }

    private boolean isConnected() {
        ConnectivityManager connectivityManager = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo activeNetwork = connectivityManager.getActiveNetworkInfo();
        return activeNetwork != null && activeNetwork.isConnected();
    }
}