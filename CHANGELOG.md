# Changelog

## 1.0.0 (2026-04-24)


### Features

* add Cloudflare Turnstile, server-side plan pricing, input hardening ([4a62848](https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg.nl/commit/4a62848af3804099b5af6a9b855cfc54e4d98b3a))
* add IndexNow verification key ([#49](https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg.nl/issues/49)) ✨ ([53e8c22](https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg.nl/commit/53e8c22b25e3c37b9afdf9e094404873db92ecdc))
* add production robots.txt and llms.txt ([ce71553](https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg.nl/commit/ce71553533a54637e02f13c012c9e8664d2181b9))
* add Resend email confirmations for signup and contact forms ([a0e18de](https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg.nl/commit/a0e18ded4dc4bb45253cae7dcb7d09f6c8669ddf))
* complete SEO implementation — schema, OG tags, sitemap, crawlers ✨ ([dba5846](https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg.nl/commit/dba58469cd21030b3adaa9e0272c444b9eaacfb7))
* complete Session 3 website build ([a8369a6](https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg.nl/commit/a8369a66710a95b46ccbe655ba67017c4461d521))
* complete signup system, image optimization, and repo cleanup ([3ee6e15](https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg.nl/commit/3ee6e159a4db52133008e739c27b4cc96352cccb))
* plan-type-aware inschrijfkosten for Dagpas + Quick Deal ✨ ([#11](https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg.nl/issues/11)) ([ff3e842](https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg.nl/commit/ff3e84229a19cadf534e68fe45f435a453b54e7f))
* soft-delete signups/contacts to archive tables with 12-month auto-prune ([9abb44b](https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg.nl/commit/9abb44b9ea697e0bfa1860cb307b4f8d3f1aa354))
* switch contact form turnstile to invisible mode ([57a28fc](https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg.nl/commit/57a28fc8427c0835e4931a64452d4bf3b01bb045))


### Bug Fixes

* add Combi Deal second membership pass info (€27 for 2 passes) ([829c341](https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg.nl/commit/829c341f4cfc102d7d441519ec37af9174a4ae7e))
* add server-side admin auth, input limits, and security headers ([104d697](https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg.nl/commit/104d697cf3dad8617a39a203b83638ebed816469))
* admin dashboard UX — Dutch labels, IBAN reveal, row emphasis 🐛 ([9d57497](https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg.nl/commit/9d57497c1912fe2a4ed8bf8b46ffe3378600d273))
* admin expandable rows, delete feature, dropdown fix 🐛 ([7cab625](https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg.nl/commit/7cab625f3e7a72bf206c977e7e91355077bddb00))
* admin SEPA fields, dropdown readability, ZT isolation 🐛 ([9c7330d](https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg.nl/commit/9c7330d11131db5349a82f3fa06ced0587faf196))
* bokszaktraining tone and trainer presence 🐛 ([f958cdd](https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg.nl/commit/f958cddd7f5e22d68fe58951a3f1148c42fd2071))
* burger menu, hero scroll, Android toggle, mobile tables 🐛 ([10453d5](https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg.nl/commit/10453d5e2589a156c7266a364f13dc2d6e8fa1e5))
* change owner notification email to gym owner ([d3cd130](https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg.nl/commit/d3cd13021ff7ec3342da9fe56b1e157c5622aa80))
* clean up bokszaktraining content 🐛 ([8f53195](https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg.nl/commit/8f53195298f6ef924fea452f7f556269219e83a6))
* disable server-side auth check, rely on Zero Trust ([7514c2e](https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg.nl/commit/7514c2e6fe74119b62a08bfe427d28d8ac0e77cf))
* don't persist membership selection across signup sessions ([#9](https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg.nl/issues/9)) 🐛 ([9ea7d35](https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg.nl/commit/9ea7d350d35e33ad659a51192859a33a1ebb5f60))
* duration pill slider not rendering on step 1 navigation ([#46](https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg.nl/issues/46)) 🐛 ([4c527e3](https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg.nl/commit/4c527e36482f1e2d1cc8064db908eaa23164c3b4))
* email template improvements, favicon, inner page spacing, and copy fixes ([a32657b](https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg.nl/commit/a32657bcbbfa06fcf45e1e45c3d07e3879266cac))
* ensure pricing CTA buttons have equal min-width 🐛 ([127e2ca](https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg.nl/commit/127e2ca16eb09d25e67a2644aebcefac4e820bd7))
* hardcode Access config instead of unreliable env vars 🐛 ([45c01ff](https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg.nl/commit/45c01ff02261c51fd81b53aba7a182da97163aba))
* hero scroll chevron above mobile CTA bar 🐛 ([083510a](https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg.nl/commit/083510ad5fa72bc4fa700cb3940e81b582bf5523))
* hide phone in header on desktop 🐛 ([c2fe41d](https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg.nl/commit/c2fe41da2e859cbe4e7a45cd29181e754f036e68))
* homepage pricing toggle after view transitions 🐛 ([8bb0d40](https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg.nl/commit/8bb0d40f10c59ef1e1a57291bb31a9b6fb6fd302))
* iOS date overflow + signup form restructure with PDOK auto-fill ([#7](https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg.nl/issues/7)) ([54512d7](https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg.nl/commit/54512d79b7372fd937ab3340db7cfe20cdddcf10))
* Ladies Only pricing card title white 🐛 ([11f86b1](https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg.nl/commit/11f86b17d98268eb7ffb1ce34fdbbf4cf367f67a))
* lazy-load vibe video + restart after navigation ([#44](https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg.nl/issues/44)) 🐛 ([762f4b7](https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg.nl/commit/762f4b729059cea23f4b2514ae044f80cd0ac1cc))
* menu transparency, hero video, table cards, footer layout 🐛 ([071d4bf](https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg.nl/commit/071d4bfdf4fd7ffef13297901a887251f85a2acd))
* mobile page spacing, footer contact hidden, dagpas text 🐛 ([e11eaf1](https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg.nl/commit/e11eaf13bbe34e756ea94275ac1cc2157b6b983f))
* re-decode Cloudflare email obfuscation after View Transitions ([#10](https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg.nl/issues/10)) 🐛 ([4833995](https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg.nl/commit/48339957da2956393389c0b7993d15777e4645e4))
* re-enable admin auth via CF_Authorization cookie check ([104303b](https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg.nl/commit/104303bfe87800fe2bd2bf9282b549a9ee26bdff))
* redirect unauthenticated admin visitors to canonical login URL 🐛 ([0f92cf1](https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg.nl/commit/0f92cf1e758882a9ba461fc45e3b45acf91b1fc3))
* remove 'gratis begeleiding' from homepage ([#42](https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg.nl/issues/42)) 🐛 ([361bdde](https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg.nl/commit/361bddef90436e039a359fddcd7161160ede28ed))
* remove 'voor alle niveaus' from bokszaktraining ([#40](https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg.nl/issues/40)) 🐛 ([04361fe](https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg.nl/commit/04361fe8d02acf21c4bf26f35271e35c6c78cc10))
* remove full gym access claims from Ladies Only plan ([#8](https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg.nl/issues/8)) 🐛 ([5b7a265](https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg.nl/commit/5b7a265bb09e6ee1ddaee504feb8a20bf0150c19))
* remove leftover code causing Functions build failure 🐛 ([426169a](https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg.nl/commit/426169a43c3849b9a5cc5344ac474ea31d1b34eb))
* replace cookie-existence auth with proper JWT validation 🐛 ([b8548d6](https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg.nl/commit/b8548d6cf4029d557f136fd8afffbaaf00592544))
* replace email logo with optimized v2 (608KB -&gt; 4.5KB) ([cf2f8f3](https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg.nl/commit/cf2f8f33373e4aae242daabc94399779b9527dc0))
* resolve GSC 404 and add custom error page 🐛 ([4771151](https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg.nl/commit/4771151afbf83a3b5a73770b533c20bbb471d45e))
* reviews pill mobile overflow, proeftraining deep link 🐛 ([fb6fe01](https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg.nl/commit/fb6fe0189851994ae73c46a2cc514fe4008484b7))
* server-side redirect for admin on non-canonical domains 🐛 ([906c278](https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg.nl/commit/906c2781889ef1f754df882e60573c4e561d99aa))
* soften admin auth to accept CF_Authorization cookie ([7f03d50](https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg.nl/commit/7f03d50ec458eb1b2dcb71fe146c17f4bd6fc1ec))
* update email sender and URLs to fitcityculemborg.nl ([66e7314](https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg.nl/commit/66e7314dac31b32b38b31e4e74aa7161a9801475))
* use PNG logo in emails for client compatibility ([2a286cd](https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg.nl/commit/2a286cd34e6c06828513ce0f4256a899d2fa6181))

## [1.1.0](https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg/compare/v1.0.0...v1.1.0) (2026-04-05)


### Features

* add Resend email confirmations for signup and contact forms ([a0e18de](https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg/commit/a0e18ded4dc4bb45253cae7dcb7d09f6c8669ddf))
* complete Session 3 website build ([a8369a6](https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg/commit/a8369a66710a95b46ccbe655ba67017c4461d521))
* complete signup system, image optimization, and repo cleanup ([3ee6e15](https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg/commit/3ee6e159a4db52133008e739c27b4cc96352cccb))

## 1.0.0 (2026-04-05)


### Features

* complete Session 3 website build ([a8369a6](https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg/commit/a8369a66710a95b46ccbe655ba67017c4461d521))
* complete signup system, image optimization, and repo cleanup ([3ee6e15](https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg/commit/3ee6e159a4db52133008e739c27b4cc96352cccb))
