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
import android.os.Looper;
import android.view.KeyEvent;
import android.view.View;
import android.webkit.DownloadListener;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.Toast;
import androidx.activity.OnBackPressedCallback;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import com.google.android.material.bottomnavigation.BottomNavigationView;
import ma.mk.greenville.databinding.ActivityMainBinding;
import ma.mk.greenville.dialogs.ExitDialog;

public class MainActivity extends AppCompatActivity {

    private ActivityMainBinding binding;
    private ValueCallback<Uri[]> filePathCallback;
    private static final int FILE_CHOOSER_REQUEST_CODE = 100;
    private WebView webView;
    private boolean isLoading = false;
    private Handler handler = new Handler();
    private int progress = 0;
    long splashStartTime = System.currentTimeMillis();
    private RelativeLayout splashScreen;
    private RelativeLayout noInternetLayout;
    private SwipeRefreshLayout swipeRefreshLayout;

    private ProgressBar progressBar;
    private ProgressBar loadingBar;
    private Button retryButton;
    private BottomNavigationView navView;

    @SuppressLint({"SetJavaScriptEnabled", "NonConstantResourceId"})
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        webView = findViewById(R.id.webview);
        splashScreen = findViewById(R.id.splash_screen);
        swipeRefreshLayout = findViewById(R.id.swipe_refresh);
        navView = findViewById(R.id.nav_view);
        noInternetLayout = findViewById(R.id.no_internet_layout);
        retryButton = findViewById(R.id.retry_button);
        progressBar = findViewById(R.id.progress_bar);
        loadingBar = findViewById(R.id.loading_bar);

        // Set up WebView and its settings
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setJavaScriptCanOpenWindowsAutomatically(true);
        webSettings.setAllowFileAccess(true);
        webSettings.setBuiltInZoomControls(true);
        webSettings.setDisplayZoomControls(false);
        webSettings.setLoadWithOverviewMode(true);
        webSettings.setUseWideViewPort(true);

        // Set WebView client for handling page loading and errors
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
                long minSplashTime = 2000;  // Minimum time to show splash
                long currentTime = System.currentTimeMillis();
                long elapsedTime = currentTime - splashStartTime;
                long remainingTime = Math.max(0, minSplashTime - elapsedTime);

                new Handler(Looper.getMainLooper()).postDelayed(() -> {
                    splashScreen.setVisibility(View.GONE);
                    isLoading = false;
                    progressBar.setProgress(100);
                    loadingBar.setVisibility(View.GONE);

                    // Check if connected to the internet before displaying the WebView or No Internet
                    if (isConnected()) {
                        webView.setVisibility(View.VISIBLE);
                        navView.setVisibility(View.VISIBLE); // Show NavView if there's internet
                        noInternetLayout.setVisibility(View.GONE); // Hide No Internet Layout
                    } else {
                        webView.setVisibility(View.GONE);
                        navView.setVisibility(View.GONE); // Hide NavView if no internet
                        noInternetLayout.setVisibility(View.VISIBLE); // Show No Internet Layout
                    }
                }, remainingTime);

                super.onPageFinished(view, url);
            }

            @Override
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                noInternetLayout.setVisibility(View.VISIBLE);
                webView.setVisibility(View.GONE);
                navView.setVisibility(View.GONE); // Hide NavView in case of no internet
                Toast.makeText(MainActivity.this, "No Internet Connection", Toast.LENGTH_SHORT).show();
            }
        });

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
        webView.setDownloadListener((url, userAgent, contentDisposition, mimeType, contentLength) -> {
            Intent intent = new Intent(Intent.ACTION_VIEW);
            intent.setData(Uri.parse(url));
            startActivity(intent);
        });

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

        retryButton.setOnClickListener(v -> {
            if (isConnected()) {
                webView.reload();
                noInternetLayout.setVisibility(View.GONE);
                webView.setVisibility(View.VISIBLE);
            } else {
                Toast.makeText(MainActivity.this, "Oops! No internet connection. Please check your network or try again.", Toast.LENGTH_LONG).show();
                navView.setVisibility(View.GONE);
                webView.setVisibility(View.GONE);
            }
        });

        // Add the Back Button handling in onCreate() method
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                if (webView != null && webView.canGoBack()) {
                    // If WebView can go back, navigate back in WebView history
                    webView.goBack();
                } else {
                    // If WebView cannot go back, show the exit dialog
                    ExitDialog.showExitDialog(MainActivity.this, MainActivity.this::finish);
                }
            }
        });

        // Set up swipe-to-refresh
        setupSwipeRefresh();

        // Ensure splash screen is visible for at least 2 seconds before checking internet
        splashStartTime = System.currentTimeMillis();
        new Handler(Looper.getMainLooper()).postDelayed(() -> {
            if (isConnected()) {
                webView.setVisibility(View.VISIBLE);
                noInternetLayout.setVisibility(View.GONE);
                navView.setVisibility(View.VISIBLE); // Show NavView if there's internet
            } else {
                webView.setVisibility(View.GONE);
                noInternetLayout.setVisibility(View.VISIBLE);
                navView.setVisibility(View.GONE); // Hide NavView if no internet
            }
        }, 2000);  // Minimum duration for splash screen
    }

    private void setupSwipeRefresh() {
        swipeRefreshLayout.setOnRefreshListener(() -> {
            if (isConnected()) {
                noInternetLayout.setVisibility(View.GONE);
                navView.setVisibility(View.VISIBLE);
                webView.setVisibility(View.VISIBLE);
                webView.reload();
            } else {
                noInternetLayout.setVisibility(View.VISIBLE);
                navView.setVisibility(View.GONE);
                webView.setVisibility(View.GONE);
            }
            swipeRefreshLayout.setRefreshing(false);
        });
    }

    // Start the progress bar for page loading
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

    // Check for internet connection
    private boolean isConnected() {
        ConnectivityManager connectivityManager = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo activeNetwork = connectivityManager.getActiveNetworkInfo();
        return activeNetwork != null && activeNetwork.isConnected();
    }
}