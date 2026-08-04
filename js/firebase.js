// Firebase Configuration and Initialization
// This file now works with the new modular Firebase SDK (v12.17.0)

function getHostName() {
    return (window.location && window.location.hostname) || '';
}

function getFirebaseEnvironment() {
    var host = getHostName();
    var params = new URLSearchParams(window.location.search || '');
    var forcedEnv = (params.get('firebaseEnv') || '').toLowerCase();

    if (forcedEnv === 'development') {
        return 'development';
    }

    if (forcedEnv === 'production') {
        return 'production';
    }

    if (!host || host === 'localhost' || host === '127.0.0.1' || host === '[::1]' || /\.local$/i.test(host) || /\.test$/i.test(host)) {
        return 'development';
    }

    return 'production';
}

function isMobileBrowser() {
    return /Android|webOS|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(navigator.userAgent || '');
}

function isAdminAppPage() {
    var path = (window.location && window.location.pathname) || '';
    return /admin\.html/i.test(path) || /login\.html/i.test(path);
}

// Firebase is now initialized in HTML with modular SDK
// This file provides utility functions and persistence setup

window.firebaseEnvironment = getFirebaseEnvironment();

// Wait for Firebase to be initialized from HTML
function waitForFirebase() {
    return new Promise(function(resolve, reject) {
        if (window.db && window.auth) {
            resolve({ db: window.db, auth: window.auth });
        } else {
            var checkInterval = setInterval(function() {
                if (window.db && window.auth) {
                    clearInterval(checkInterval);
                    resolve({ db: window.db, auth: window.auth });
                }
            }, 100);
            setTimeout(function() {
                clearInterval(checkInterval);
                reject(new Error('Firebase initialization timeout'));
            }, 5000);
        }
    });
}

// Set up Firestore persistence for mobile compatibility
waitForFirebase().then(function({ db, auth }) {
    // Mobile browsers / PWA (iOS Safari, in-app WebViews) often fail with WebChannel;
    // long polling is more reliable on hosted HTTPS sites (Vercel, Netlify).
    try {
        if (db.settings) {
            db.settings({
                experimentalForceLongPolling: true,
                merge: true
            });
        }
    } catch (error) {
        console.warn('Firestore settings:', error);
    }

    // Let the app know when Firestore is ready (persistence is optional).
    // Admin must work offline on mobile — enable persistence on admin/login pages.
    window.dbReady = Promise.resolve(db);
    var shouldEnablePersistence = isAdminAppPage() || !isMobileBrowser();
    
    if (shouldEnablePersistence && db.enablePersistence) {
        try {
            var persistenceOpts = (isAdminAppPage() && isMobileBrowser())
                ? {}
                : { synchronizeTabs: true };
            var persistencePromise = db.enablePersistence(persistenceOpts)
                .then(function () {
                    console.log('Firestore offline persistence enabled');
                    return db;
                })
                .catch(function (error) {
                    if (error.code === 'failed-precondition') {
                        console.log('Persistence unavailable (another tab owns it) — running online only.');
                    } else if (error.code === 'unimplemented') {
                        console.log('Persistence not supported by browser');
                    } else {
                        console.error('Persistence error:', error);
                    }
                    return db;
                });
            var persistenceSettled = false;
            var mobileTimeout = isMobileBrowser() ? 8000 : 4000;
            window.dbReady = Promise.race([
                persistencePromise.then(function (db) {
                    persistenceSettled = true;
                    return db;
                }),
                new Promise(function (resolve) {
                    setTimeout(function () {
                        if (!persistenceSettled) {
                            console.log('Firebase ready — offline cache still loading in background (normal on mobile).');
                        }
                        resolve(db);
                    }, mobileTimeout);
                })
            ]);
        } catch (error) {
            console.error('Persistence setup error:', error);
        }
    } else {
        console.log('Menu page on mobile — Firestore persistence skipped');
    }

    // Set up auth persistence - modular SDK uses browserLocalPersistence
    try {
        if (window.setPersistence && window.browserLocalPersistence) {
            setPersistence(auth, browserLocalPersistence)
                .then(function() {
                    console.log('Auth persistence set to LOCAL');
                })
                .catch(function(error) {
                    console.error('Error setting auth persistence:', error);
                });
        } else {
            console.log('Auth persistence functions not available - using default');
        }
    } catch (error) {
        console.error('Auth persistence setup error:', error);
    }

    // Auth state observer (for debugging)
    if (auth.onAuthStateChanged) {
        auth.onAuthStateChanged(function(user) {
            if (user) {
                console.log('User is signed in:', user.email);
            } else {
                console.log('User is signed out');
            }
        });
    }

    console.log('Firebase Storage disabled; using direct image URLs only');
    console.log('Using Firebase environment:', window.firebaseEnvironment, 'project:', window.firebaseConfig ? window.firebaseConfig.projectId : 'unknown');
}).catch(function(error) {
    console.error('Firebase initialization error:', error);
});