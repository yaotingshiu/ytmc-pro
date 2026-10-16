# Privacy Policy

Last updated: October 16, 2026

This policy explains how **Moving Company for YouTube™** (the "Tool") and its website handle your data. The Tool is developed and maintained by independent developer Hsu Yao Ting ("we" or "us").

**In one sentence:** your backups stay in your own browser. We run no servers, do no analytics or tracking, show no ads, and never sell any data.

## 1. What we don't do

- We don't collect or upload your subscriptions, playlists, watch history or backups.
- We don't read or transmit your Google/YouTube password or cookies.
- We don't use any analytics (such as Google Analytics), ad tracking or browser fingerprinting.
- We don't sell, rent or trade any personal data.

## 2. Data that stays in your browser

The following is kept in the browser's built-in extension storage on your own computer. We cannot access it:

- **Backups**: names and IDs of subscribed channels and playlists, channel avatar URLs, video IDs and titles, backup time and account name.
- **Settings and logs**: language, interface settings, task progress and activity logs.
- **Pro license status** (Pro members only): license key, device ID, device name, plan, purchase email, expiry date and last verification time, used to recognize Pro while offline.
- **Pro device list** (Pro members only): the license key and each browser’s device ID and device name, kept in the browser’s sync storage (chrome.storage.sync). If browser sync is on, Google syncs this list between your browsers signed in to the same account, so you can remove another browser and free its slot from any of them. We cannot access it.

You can delete backups in the extension at any time. When you uninstall the Tool, the browser deletes this data. If you export a backup to a file, that file is yours to keep safe.

## 3. Who the Tool connects to

| Service | When | What is sent |
|---|---|---|
| **YouTube** (youtube.com, i.ytimg.com) | When you back up, restore or organize your account | Inside the YouTube page, the Tool uses YouTube's own functions as your signed-in self, exactly like doing it by hand on YouTube. It also loads channel avatars and video thumbnails. Data travels only between your browser and YouTube, never through us. |
| **Dodo Payments** (live.dodopayments.com) | Pro only: activating a key, automatic verification every 3 days, signing out a device or uninstalling | The license key, a device ID, and a device name (operating system, browser and activation date, e.g. "Windows · Chrome · 2026-10-12"). |
| **Device-list service** (a small program we run on Cloudflare Workers) | Pro only: when you view or remove the browsers a key is active in | The license key. The service only uses it to ask Dodo Payments which browsers are active (device ID, device name and activation time) and returns that to you. It does not store the key or any personal data. Cloudflare may log connection data such as IP addresses under its policies. |
| **GitHub Pages** (yaotingshiu.github.io) | Reading sponsor information when the extension opens; opening the thank-you page on uninstall | No personal data is sent. As with any website, GitHub may log connection data such as your IP address under its own policy. |

**On uninstall:** the browser opens our thank-you page. For Pro members, the part of the page address after "#" contains the license key and device ID (this part is never sent to the web server). The page uses it to release this device's activation slot at Dodo Payments so you can keep using Pro in other browsers.

## 4. When you buy Pro

1. Payments are handled by **Dodo Payments** as the Merchant of Record. The name, email, billing address and payment details you enter at checkout are collected and processed by Dodo Payments under its [Privacy Policy](https://dodopayments.com/privacy-policy).
2. We **cannot see** your full card number or other payment details. In the Dodo Payments dashboard we can see order information, including your name, email, country/region, plan, order and refund history, and the device names where your license key is active.
3. We use this information only to provide and verify your Pro license, handle support and refunds, prevent license abuse, and notify you of price changes or significant changes to our terms.

## 5. Problem reports and emails

1. "Report a problem" in the extension opens **your own email app** with the extension version, browser information and activity log filled in. You can review or edit everything before sending, and nothing is sent unless you send it.
2. Emails you send us (including your address and the content) are used only to reply and fix problems, and we will delete them on request once the issue is resolved.

## 6. Website

1. The website is hosted on GitHub Pages. GitHub may log connection data under its [Privacy Statement](https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement).
2. The website only remembers your chosen language and light/dark theme in your browser (localStorage). It uses no tracking cookies or analytics.
3. The checkout on the plans page is provided by Dodo Payments, which may use cookies needed for payment and fraud prevention.
4. The plans page and the payment-complete page can talk directly to the installed extension (one-click activation, this browser’s license, removing other browsers). This happens only inside your browser; the website only receives a masked key and device names, and nothing is sent to any server. After payment, Dodo Payments puts the license key in the address of the payment-complete page, which reads it and removes it from the address bar right away.

## 7. Extension permissions

- **storage / unlimitedStorage**: keep backups and settings in your browser. Backups can be large, so unlimited storage is needed.
- **tabs**: find or open a YouTube tab to run tasks, and open pages such as the Backup Manager.
- **sidePanel** (Chrome/Edge) / **sidebar** (Firefox): lets you use the Tool in the browser side panel.
- **Access to www.youtube.com**: run backup, restore and cleanup inside YouTube pages. The Tool does not access the content of any other website.

## 8. How long data is kept

- Data in your browser: until you delete it or uninstall the Tool.
- Order data: kept by Dodo Payments under its policy and tax laws.
- Emails: until the issue is resolved; you can ask us to delete them at any time.

## 9. Your rights

Under Taiwan's Personal Data Protection Act and the laws of your region (such as the EU GDPR), you can ask us to access, copy, correct, restrict or delete your personal data, or to stop processing it. Since most data stays in your own browser, you can view, export or delete it directly in the extension. For order-related requests, email us or contact Dodo Payments.

Providing data is optional: if you don't buy Pro or email us, you can still use all free features.

## 10. Children's privacy

The Tool is not designed for children under 13, and we do not knowingly collect personal data from children. If you believe we have received a child's data by mistake, email us and we will delete it.

## 11. Security

Connections between the Tool, YouTube and Dodo Payments use HTTPS encryption, and the Tool never loads or runs remote code. Note that exported backup files are not encrypted, so please store them safely.

## 12. Changes to this policy

We may update this policy to reflect changes in features or law. Updates will be posted on this page with a new date. For significant changes (such as sending a new type of data), we will notify you in advance in the extension or on the website.

## 13. Contact

For any privacy question or request, email us at [speed132454@gmail.com](mailto:speed132454@gmail.com)
