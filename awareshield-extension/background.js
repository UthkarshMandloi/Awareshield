// Comprehensive Threat Database - Phishing, Malware, and Scam domains
const BLOCKED_DOMAINS = [
    "evil.com", "hackersite.net", "scam-alert.org", "unsafe-demo.awareshield.com",
    "secure-login-paypal.com.example", "paypa1-security-center.example", 
    "icici-netbanking-secure.example", "hdfc-bank-otp-verify.example", 
    "sbi-online-update-kyc.example", "axisbank-netsecure-login.example", 
    "upi-refund-portal.example", "paytm-wallet-verify.example", 
    "razorpay-billing-update.example", "google-account-security-check.example", 
    "secure-facebook-login-center.example", "instagram-help-center-verify.example", 
    "twitter-blue-verify-badge.example", "microsoft-account-protect.example", 
    "appleid-security-check.example", "office365-mailbox-upgrade.example", 
    "outlook-storage-limit-warning.example", "webmail-login-reset.example", 
    "university-sso-portal.example", "vpn-portal-auth.example", 
    "corporate-hr-portal-update.example", "github-security-notice.example", 
    "gitlab-ci-failed-notice.example", "slack-workspace-auth.example", 
    "zoom-meeting-invite-secure.example", "you-are-the-millionth-visitor.example", 
    "free-iphone14-giveaway.example", "amazon-gift-card-claim-now.example", 
    "flipkart-lucky-spin-wheel.example", "google-lottery-results.example", 
    "whatsapp-gold-premium-offer.example", "telegram-free-data-pack.example", 
    "instant-loan-approved.example", "urgent-windows-virus-alert.example", 
    "microsoft-certified-support.example", "irs-tax-refund-portal.example", 
    "income-tax-refund-india.example", "bank-kyc-blocked-account.example", 
    "credit-card-suspended-notice.example", "windows11-activator-crack.example", 
    "office365-keygen-free.example", "adobe-photoshop-full-crack.example", 
    "premium-vpn-lifetime-free.example", "paid-antivirus-free-license.example", 
    "whatsapp-spy-tool-pro.example", "instagram-hack-tool-2026.example", 
    "pubg-aimbot-hack-free.example", "free-robux-generator.example", 
    "minecraft-premium-launcher-crack.example", "android-paid-apps-free-store.example", 
    "unlimited-netflix-accounts.example", "spotify-premium-mod-apk.example", 
    "3d-game-mod-menu.example", "system-cleaner-optimizer-pro.example", 
    "free-movies-hd-stream.example", "latest-bollywood-movies-hd.example", 
    "south-movie-dubbed-hd.example", "anime-streaming-free-subdub.example", 
    "latest-webseries-1080p.example", "cracked-games-full-setup.example", 
    "free-ott-webseries-download.example", "sports-live-stream-free.example", 
    "ipl-live-streaming-free-example", "live-football-stream-hd.example", 
    "kdrama-full-episode-free.example", "premium-course-downloads-free.example", 
    "paid-udemy-courses-free.example", "latest-song-mp3-downloads.example", 
    "torrent-movie-index.example", "bit-secure-link.example", 
    "click-go-now.example", "short-safe-url.example", "fast-redirect-link.example", 
    "tiny-login-url.example", "go-to-reward.example", "secure-check-now.example", 
    "redirect-safe-center.example", "confirm-now-link.example", 
    "download-now-fast.example", "fileshare-fast-download.example", 
    "cdn-random-storage.example", "anonymous-file-drop.example", 
    "cloud-share-free-storage.example", "direct-download-host.example", 
    "mega-free-premium-link.example", "drive-protected-share.example", 
    "sendfile-now-free.example", "doc-viewer-online.example", 
    "image-hosting-fast.example"
];

const BLOCKED_KEYWORDS = ["phishing", "malware", "secure-login-verify", "bank-update-now", "awareshield-demo-unsafe", "crack", "keygen"];

chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  if (details.frameId !== 0) return; // Only check main tab navigations

  const url = new URL(details.url);
  const isBlockedDomain = BLOCKED_DOMAINS.some(d => url.hostname === d || url.hostname.endsWith('.' + d));
  const hasBlockedKeywords = BLOCKED_KEYWORDS.some(k => url.href.toLowerCase().includes(k));

  if (isBlockedDomain || hasBlockedKeywords) {
    console.warn(`[Awareshield] THREAT DETECTED: ${details.url}`);
    
    // 1. Notify user
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icon.png",
      title: "🛑 Awareshield Protection",
      message: "Security threat blocked! Link identified as high-risk.",
      priority: 2
    });
    
    // 2. Redirect to internal 'safe' page (or site home)
    chrome.tabs.update(details.tabId, { url: "https://www.google.com/search?q=awareshield+threat+blocked" });
  }
});

console.log("[Awareshield] Background Security Engine initialized.");
