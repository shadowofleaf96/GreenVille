package ma.mk.greenville;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;
import androidx.activity.OnBackPressedCallback;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.browser.customtabs.CustomTabsIntent;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import com.bumptech.glide.Glide;
import com.bumptech.glide.request.target.CustomTarget;
import com.bumptech.glide.request.transition.Transition;
import com.google.android.material.bottomnavigation.BottomNavigationView;

import org.json.JSONException;
import org.json.JSONObject;

import ma.mk.greenville.databinding.ActivityMainBinding;
import ma.mk.greenville.dialogs.ExitDialog;

public class MainActivity extends AppCompatActivity {

    private ActivityMainBinding binding;
    private ValueCallback<Uri[]> filePathCallback;
    private static final int FILE_CHOOSER_REQUEST_CODE = 100;
    private WebView webView;
    private boolean isLoading = false;
    private int progress = 0;
    long splashStartTime = System.currentTimeMillis();
    private RelativeLayout splashScreen;
    private RelativeLayout noInternetLayout;
    private SwipeRefreshLayout swipeRefreshLayout;

    private ProgressBar progressBar;
    private String userAgent;
    private ProgressBar loadingBar;
    private Button retryButton;
    private BottomNavigationView navView;
    private final Handler handler = new Handler(Looper.getMainLooper());

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
        swipeRefreshLayout.setEnabled(false);


        SharedPreferences preferences = getSharedPreferences("UserPreferences", MODE_PRIVATE);
        String savedProfileImageUrl = preferences.getString("profile_image_url", null);
        String savedFirstName = preferences.getString("first_name", "Profile");
        String savedLastName = preferences.getString("last_name", "");

        if (savedProfileImageUrl != null && !savedProfileImageUrl.isEmpty()) {
            updateProfileButton(savedProfileImageUrl, savedFirstName, savedLastName);
        }

        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        userAgent = System.getProperty("http.agent");
        webSettings.setUserAgentString(userAgent + "greenville");
        webSettings.setDomStorageEnabled(true);
        webSettings.setJavaScriptCanOpenWindowsAutomatically(true);
        webSettings.setAllowFileAccess(true);
        webSettings.setBuiltInZoomControls(true);
        webSettings.setDisplayZoomControls(false);
        webSettings.setLoadWithOverviewMode(true);
        webSettings.setUseWideViewPort(true);

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                Log.d("WebViewClient", "Loading URL: " + url);
                if (url.contains("greenville-frontend.vercel.app")) {
                    return false;
                } else if (url.startsWith("greenville://")) {
                    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    try {
                        startActivity(intent);
                    } catch (Exception e) {
                        Toast.makeText(MainActivity.this, "No app found to open this link", Toast.LENGTH_SHORT).show();
                    }
                    return true;
                } else {
                    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    intent.setPackage("com.android.chrome");
                    try {
                        startActivity(intent);
                    } catch (Exception e) {
                        intent.setPackage(null);
                        startActivity(intent);
                    }
                    return true;
                }
            }

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
                long minSplashTime = 2000;
                long elapsedTime = System.currentTimeMillis() - splashStartTime;
                long delay = Math.max(0, minSplashTime - elapsedTime);

                new Handler(Looper.getMainLooper()).postDelayed(() -> {
                    splashScreen.setVisibility(View.GONE);
                    loadingBar.setVisibility(View.GONE);
                    progressBar.setVisibility(View.GONE);
                    isLoading = false;

                    boolean hasInternet = isConnected();
                    webView.setVisibility(hasInternet ? View.VISIBLE : View.GONE);
                    navView.setVisibility(hasInternet ? View.VISIBLE : View.GONE);
                    noInternetLayout.setVisibility(hasInternet ? View.GONE : View.VISIBLE);

                    swipeRefreshLayout.setVisibility(View.VISIBLE);
                    swipeRefreshLayout.setEnabled(true);
                }, delay);

                super.onPageFinished(view, url);
                startCartCountCheck();
            }

            @Override
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                noInternetLayout.setVisibility(View.VISIBLE);
                webView.setVisibility(View.GONE);
                navView.setVisibility(View.GONE);
                Toast.makeText(MainActivity.this, "No Internet Connection", Toast.LENGTH_SHORT).show();
            }
        });

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                if (newProgress < 100) {
                    progressBar.setVisibility(View.VISIBLE);
                } else {
                    progressBar.setVisibility(View.GONE);
                }
                progressBar.setProgress(newProgress);
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

        webView.setDownloadListener((url, userAgent, contentDisposition, mimeType, contentLength) -> {
            Intent intent = new Intent(Intent.ACTION_VIEW);
            intent.setData(Uri.parse(url));
            startActivity(intent);
        });

        webView.addJavascriptInterface(new Object() {
                @JavascriptInterface
                public void onLoginSuccess(String loginData) {
                    try {
                        JSONObject json = new JSONObject(loginData);
                        JSONObject customer = json.getJSONObject("customer");
                        String customerImage = customer.getString("customer_image");
                        String customerFirstName = customer.getString("first_name");
                        String customerLastName = customer.getString("last_name");


                        runOnUiThread(() -> updateProfileButton(customerImage, customerFirstName, customerLastName));

                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }

                @JavascriptInterface
                public void onLogout() {
                    runOnUiThread(() -> clearProfileButton());
                }
            }, "AndroidInterface");

        webView.loadUrl(getString(R.string.home_url));

        navView.setOnItemSelectedListener(item -> {
            switch (item.getItemId()) {
                case R.id.navigation_home:
                    webView.loadUrl(getString(R.string.home_url));
                    break;
                case R.id.navigation_cart:
                    webView.loadUrl(getString(R.string.cart_url));
                    break;
                case R.id.navigation_profile:
                    webView.loadUrl(getString(R.string.profile_url));
                    break;
            }
            return true;
        });

        retryButton.setOnClickListener(v -> {
            if (isConnected()) {
                webView.reload();
                noInternetLayout.setVisibility(View.GONE);
                webView.setVisibility(View.VISIBLE);
                navView.setVisibility(View.VISIBLE);
            } else {
                Toast.makeText(MainActivity.this, "Oops! No internet connection.", Toast.LENGTH_LONG).show();
                navView.setVisibility(View.GONE);
                webView.setVisibility(View.GONE);
            }
        });

        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                if (webView != null && webView.canGoBack()) {
                    webView.goBack();
                } else {
                    ExitDialog.showExitDialog(MainActivity.this, MainActivity.this::finish);
                }
            }
        });

        setupSwipeRefresh();

        splashStartTime = System.currentTimeMillis();
        new Handler(Looper.getMainLooper()).postDelayed(() -> {
            if (isConnected()) {
                webView.setVisibility(View.VISIBLE);
                noInternetLayout.setVisibility(View.GONE);
                navView.setVisibility(View.VISIBLE);
            } else {
                webView.setVisibility(View.GONE);
                noInternetLayout.setVisibility(View.VISIBLE);
                navView.setVisibility(View.GONE);
            }
        }, 2000);
    }

    private void clearProfileButton() {
        SharedPreferences preferences = getSharedPreferences("UserPreferences", MODE_PRIVATE);
        SharedPreferences.Editor editor = preferences.edit();

        editor.remove("profile_image_url");
        editor.remove("first_name");
        editor.remove("last_name");
        editor.apply();

        Menu navViewMenu = navView.getMenu();
        MenuItem profileItem = navViewMenu.findItem(R.id.navigation_profile);
        profileItem.setIcon(R.drawable.round_person_24);
        MenuItem profileTextItem = navViewMenu.findItem(R.id.navigation_profile);
        profileTextItem.setTitle("Profile");
    }

    private void updateProfileButton(String customerImageUrl, String firstName, String lastName) {
        Menu navViewMenu = navView.getMenu();
        MenuItem profileItem = navViewMenu.findItem(R.id.navigation_profile);
        if (customerImageUrl != null && !customerImageUrl.isEmpty()) {

            SharedPreferences preferences = getSharedPreferences("UserPreferences", MODE_PRIVATE);
            SharedPreferences.Editor editor = preferences.edit();
            editor.putString("profile_image_url", customerImageUrl);
            editor.putString("first_name", firstName);
            editor.putString("last_name", lastName);
            editor.apply();

            Glide.with(this)
                    .asBitmap()
                    .load(customerImageUrl)
                    .circleCrop()
                    .error(R.drawable.illustration_404)
                    .into(new CustomTarget<Bitmap>() {
                        @Override
                        public void onResourceReady(@NonNull Bitmap resource, @Nullable Transition<? super Bitmap> transition) {
                            Drawable drawable = new BitmapDrawable(getResources(), resource);
                            profileItem.setIcon(drawable);
                            navView.setItemIconTintList(null);
                        }

                        @Override
                        public void onLoadCleared(@Nullable Drawable placeholder) {
                        }
                    });
        }

        String fullName = firstName + " " + lastName;
        MenuItem profileTextItem = navViewMenu.findItem(R.id.navigation_profile);
        profileTextItem.setTitle(fullName);
    }

    private void openUrlInChromeCustomTab(String url) {
        try {
            CustomTabsIntent.Builder builder = new CustomTabsIntent.Builder();
            CustomTabsIntent customTabsIntent = builder.build();
            customTabsIntent.launchUrl(MainActivity.this, Uri.parse(url));
        } catch (Exception e) {
            Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
            intent.setPackage("com.android.chrome");
            try {
                startActivity(intent);
            } catch (Exception ex) {
                intent.setPackage(null);
                startActivity(intent);
            }
        }
    }

    private void startCartCountCheck() {
        final Handler handler = new Handler(Looper.getMainLooper());
        final Runnable cartCountRunnable = new Runnable() {
            @Override
            public void run() {
                webView.evaluateJavascript(
                        "(function() { " +
                                "  var cart = localStorage.getItem('persist:cart');" +
                                "  if (cart) {" +
                                "    try {" +
                                "      var parsedCart = JSON.parse(cart);" +
                                "      return parsedCart.cartCount || '0';" +
                                "    } catch (e) { return '0'; }" +
                                "  } else {" +
                                "    return '0';" +
                                "  }" +
                                "})();",
                        value -> {
                            int cartCount = Integer.parseInt(value.replace("\"", ""));
                            updateCartBadge(cartCount);
                        }
                );
                handler.postDelayed(this, 500);
            }
        };

        handler.post(cartCountRunnable);
    }

    private void updateCartBadge(int count) {
        if (count > 0) {
            navView.getOrCreateBadge(R.id.navigation_cart).setNumber(count);
            navView.getOrCreateBadge(R.id.navigation_cart).setVisible(true);
        } else {
            navView.removeBadge(R.id.navigation_cart);
        }
    }

    private void setupSwipeRefresh() {
        swipeRefreshLayout.setOnRefreshListener(() -> {
            if (isConnected()) {
                webView.reload();
            } else {
                Toast.makeText(MainActivity.this, "No internet connection", Toast.LENGTH_SHORT).show();
            }
            swipeRefreshLayout.setRefreshing(false);
        });
    }

    private void startProgressBar() {
        handler.post(new Runnable() {
            @Override
            public void run() {
                if (isLoading && progress < 100) {
                    progressBar.setProgress(++progress);
                    handler.postDelayed(this, 100);
                }
            }
        });
    }

    private boolean isConnected() {
        ConnectivityManager connectivityManager = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo activeNetwork = connectivityManager.getActiveNetworkInfo();
        return activeNetwork != null && activeNetwork.isConnected();
    }
}