import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { WebView } from 'react-native-webview';
import type { WebViewErrorEvent } from 'react-native-webview/lib/WebViewTypes';
import { ThemedText } from '~/components/Ui/themed-text';
import { ThemedView } from '~/components/Ui/themed-view';

interface PDFViewerProps {
  pdfUrl: string;
  style?: ViewStyle;
  onLoadStart?: () => void;
  onLoadEnd?: () => void;
  onError?: (error: string) => void;
  showLoader?: boolean;
  loaderColor?: string;
  errorMessage?: string;
  retryText?: string;
  backgroundColor?: string;
}

interface PDFViewerState {
  loading: boolean;
  error: string | null;
  retryCount: number;
}

const PDFViewer: React.FC<PDFViewerProps> = ({
  pdfUrl,
  style,
  onLoadStart,
  onLoadEnd,
  onError,
  showLoader = true,
  loaderColor = '#007AFF',
  errorMessage = 'Failed to load PDF',
  retryText = 'Tap to retry',
  backgroundColor = '#f5f5f5',
}) => {
  const [state, setState] = useState<PDFViewerState>({
    loading: true,
    error: null,
    retryCount: 0,
  });

  // Validate PDF URL
  const isValidUrl = useCallback((url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }, []);

  // Generate HTML content with embedded PDF.js viewer
  const htmlContent = useMemo(() => {
    if (!isValidUrl(pdfUrl)) {
      return '<html><body><h3>Invalid PDF URL</h3></body></html>';
    }

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>PDF Viewer</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: ${backgroundColor};
            overflow: hidden;
        }
        
        #pdfContainer {
            width: 100%;
            height: 100vh;
            position: relative;
            display: flex;
            flex-direction: column;
        }
        
        #pdfViewer {
            width: 100%;
            height: 100%;
            border: none;
            background: white;
        }
        
        #loadingContainer {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background-color: rgba(255, 255, 255, 0.9);
            z-index: 1000;
        }
        
        #errorContainer {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: none;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background-color: ${backgroundColor};
            text-align: center;
            padding: 20px;
            z-index: 1001;
        }
        
        .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid ${loaderColor};
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .error-text {
            color: #d32f2f;
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        
        .retry-btn {
            background: ${loaderColor};
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            font-size: 16px;
            cursor: pointer;
            margin-top: 15px;
        }
        
        .retry-btn:hover {
            opacity: 0.8;
        }
        
        /* Hide PDF.js toolbar on mobile for cleaner look */
        @media (max-width: 768px) {
            .toolbar {
                display: none !important;
            }
        }
    </style>
</head>
<body>
    <div id="pdfContainer">
        <div id="loadingContainer">
            <div class="spinner"></div>
            <p style="margin-top: 15px; color: #666;">Loading PDF...</p>
        </div>
        
        <div id="errorContainer">
            <div class="error-text">Failed to load PDF</div>
            <p style="color: #666; margin-bottom: 10px;">Please check your internet connection and try again.</p>
            <button class="retry-btn" onclick="retryLoad()">Retry</button>
        </div>
        
        <iframe 
            id="pdfViewer"
            src="https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(pdfUrl)}"
            onload="onPDFLoad()"
            onerror="onPDFError()"
        ></iframe>
    </div>

    <script>
        let retryCount = 0;
        const maxRetries = 3;
        
        function onPDFLoad() {
            console.log('PDF loaded successfully');
            document.getElementById('loadingContainer').style.display = 'none';
            
            // Post message to React Native
            if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'PDF_LOADED'
                }));
            }
        }
        
        function onPDFError() {
            console.error('PDF failed to load');
            showError();
            
            // Post message to React Native
            if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'PDF_ERROR',
                    error: 'Failed to load PDF document'
                }));
            }
        }
        
        function showError() {
            document.getElementById('loadingContainer').style.display = 'none';
            document.getElementById('errorContainer').style.display = 'flex';
        }
        
        function retryLoad() {
            if (retryCount >= maxRetries) {
                alert('Maximum retry attempts reached. Please check the PDF URL.');
                return;
            }
            
            retryCount++;
            document.getElementById('errorContainer').style.display = 'none';
            document.getElementById('loadingContainer').style.display = 'flex';
            
            // Reload the iframe
            const iframe = document.getElementById('pdfViewer');
            iframe.src = iframe.src;
            
            // Post message to React Native
            if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'PDF_RETRY',
                    retryCount: retryCount
                }));
            }
        }
        
        // Handle iframe load timeout
        setTimeout(() => {
            const loadingContainer = document.getElementById('loadingContainer');
            if (loadingContainer.style.display !== 'none') {
                onPDFError();
            }
        }, 15000); // 15 second timeout
        
        // Handle touch events for mobile
        document.addEventListener('touchstart', function(e) {
            // Prevent zoom on double tap
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });
        
        // Prevent context menu
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
        });
    </script>
</body>
</html>`;
  }, [pdfUrl, isValidUrl, backgroundColor, loaderColor]);

  // Handle WebView load start
  const handleLoadStart = useCallback(() => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    onLoadStart?.();
  }, [onLoadStart]);

  // Handle WebView load end
  const handleLoadEnd = useCallback(() => {
    setState((prev) => ({ ...prev, loading: false }));
    onLoadEnd?.();
  }, [onLoadEnd]);

  // Handle WebView errors
  const handleError = useCallback(
    (event: WebViewErrorEvent) => {
      const errorMsg =
        event.nativeEvent.description || 'Unknown error occurred';
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMsg,
        retryCount: prev.retryCount + 1,
      }));
      onError?.(errorMsg);
    },
    [onError]
  );

  // Handle messages from WebView
  const handleMessage = useCallback(
    (event: any) => {
      try {
        const data = JSON.parse(event.nativeEvent.data);

        switch (data.type) {
          case 'PDF_LOADED':
            setState((prev) => ({ ...prev, loading: false, error: null }));
            onLoadEnd?.();
            break;

          case 'PDF_ERROR':
            setState((prev) => ({
              ...prev,
              loading: false,
              error: data.error || 'Failed to load PDF',
              retryCount: prev.retryCount + 1,
            }));
            onError?.(data.error || 'Failed to load PDF');
            break;

          case 'PDF_RETRY':
            setState((prev) => ({
              ...prev,
              loading: true,
              error: null,
              retryCount: data.retryCount || prev.retryCount + 1,
            }));
            onLoadStart?.();
            break;
        }
      } catch (error) {
        console.error('Error parsing WebView message:', error);
      }
    },
    [onLoadStart, onLoadEnd, onError]
  );

  // Error view component

  // Loading view component
  const renderLoader = () =>
    showLoader &&
    state.loading && (
      <ThemedView style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={loaderColor} />
        <ThemedText style={styles.loadingText}>Loading PDF...</ThemedText>
      </ThemedView>
    );

  return (
    <View style={[styles.container, style]}>
      <WebView
        key={`pdf-viewer-${state.retryCount}`}
        source={{ html: htmlContent }}
        style={styles.webview}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={false}
        scalesPageToFit={Platform.OS === 'android'}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        // Web-specific props
        {...(Platform.OS === 'web' && {
          containerStyle: styles.webContainer,
        })}
        // iOS-specific props
        {...(Platform.OS === 'ios' && {
          allowsBackForwardNavigationGestures: false,
          bounces: false,
          scrollEnabled: true,
        })}
        // Android-specific props
        {...(Platform.OS === 'android' && {
          mixedContentMode: 'compatibility',
          thirdPartyCookiesEnabled: true,
          cacheEnabled: true,
        })}
      />
      {renderLoader()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  webContainer: {
    flex: 1,
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',

    zIndex: 1000,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 10,
  },
  errorDetails: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryText: {
    fontSize: 16,
    color: '#007AFF',
    textAlign: 'center',
    textDecorationLine: 'underline',
    padding: 10,
  },
});

export default PDFViewer;

// Usage Example:
/*
import PDFViewer from './PDFViewer';

const App = () => {
  return (
    <View style={{ flex: 1 }}>
      <PDFViewer
        pdfUrl="https://giddy-marten-642.convex.cloud/api/storage/2cd8ef1f-fe66-44a9-9742-1cd598ab61cd"
        style={{ flex: 1 }}
        onLoadStart={() => console.log('PDF loading started')}
        onLoadEnd={() => console.log('PDF loading completed')}
        onError={(error) => console.error('PDF loading error:', error)}
        showLoader={true}
        loaderColor="#007AFF"
        backgroundColor="#f5f5f5"
      />
    </View>
  );
};
*/
