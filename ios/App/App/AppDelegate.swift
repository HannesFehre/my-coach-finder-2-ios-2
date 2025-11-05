import UIKit
import Capacitor
import WebKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Override point for customization after application launch.

        // Setup URL parameter injection
        setupURLParameterInjection()

        return true
    }

    private func setupURLParameterInjection() {
        // This will be called after the Capacitor bridge is loaded
        NotificationCenter.default.addObserver(
            forName: .capacitorViewDidLoad,
            object: nil,
            queue: .main
        ) { [weak self] notification in
            self?.injectURLParameterHandler(notification: notification)
        }
    }

    private func injectURLParameterHandler(notification: Notification) {
        guard let bridge = notification.object as? CAPBridgeProtocol,
              let webView = bridge.webView else {
            print("[URLParameter] ⚠️ Could not access WebView")
            return
        }

        // Create JavaScript that intercepts all navigation
        let script = """
        (function() {
            console.log('[iOS Native] URL parameter injection script loaded');

            // Function to add os=apple parameter
            function addOSParameter(url) {
                if (!url || !url.includes('my-coach-finder.com')) {
                    return url;
                }

                if (url.includes('os=apple') || url.includes('os=android') || url.includes('os=ios')) {
                    return url;
                }

                const separator = url.includes('?') ? '&' : '?';
                const newUrl = url + separator + 'os=apple';
                console.log('[iOS Native] Added os=apple:', url, '→', newUrl);
                return newUrl;
            }

            // Intercept all link clicks
            document.addEventListener('click', function(e) {
                let el = e.target;
                for (let i = 0; i < 10 && el; i++) {
                    if (el.tagName === 'A' && el.href) {
                        const newHref = addOSParameter(el.href);
                        if (newHref !== el.href) {
                            e.preventDefault();
                            window.location.href = newHref;
                            return;
                        }
                    }
                    el = el.parentElement;
                }
            }, true);

            // Intercept window.location changes
            const originalPushState = history.pushState;
            history.pushState = function(state, title, url) {
                if (url) {
                    url = addOSParameter(url.toString());
                }
                return originalPushState.call(history, state, title, url);
            };

            const originalReplaceState = history.replaceState;
            history.replaceState = function(state, title, url) {
                if (url) {
                    url = addOSParameter(url.toString());
                }
                return originalReplaceState.call(history, state, title, url);
            };

            console.log('[iOS Native] URL parameter injection active');
        })();
        """

        let userScript = WKUserScript(
            source: script,
            injectionTime: .atDocumentStart,
            forMainFrameOnly: false
        )

        webView.configuration.userContentController.addUserScript(userScript)

        print("[URLParameter] ✅ URL parameter injection script added to WebView")
    }
}

    func applicationWillResignActive(_ application: UIApplication) {
        // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
        // Use this method to pause ongoing tasks, disable timers, and invalidate graphics rendering callbacks. Games should use this method to pause the game.
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
        // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
        // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        // Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
    }

    func applicationWillTerminate(_ application: UIApplication) {
        // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
    }

    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        // Called when the app was launched with a url. Feel free to add additional processing here,
        // but if you want the App API to support tracking app url opens, make sure to keep this call
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }

    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        // Called when the app was launched with an activity, including Universal Links.
        // Feel free to add additional processing here, but if you want the App API to support
        // tracking app url opens, make sure to keep this call
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }

}
