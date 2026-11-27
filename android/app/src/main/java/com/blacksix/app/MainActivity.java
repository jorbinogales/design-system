package com.blacksix.app;

import android.os.Bundle;
import androidx.activity.OnBackPressedCallback;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Back button / gesture: let the web nav stack pop a screen; only leave the app from the root screen.
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                getBridge().getWebView().evaluateJavascript("window.bsBack ? window.bsBack() : false", (handled) -> {
                    if (!"true".equals(handled)) finish();
                });
            }
        });
    }
}
