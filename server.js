// server.js - Full-Stack Linktree Clone Application Server (Self-Contained & Cloud-Ready)
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// Embedded Frontend Bundle (Ensures zero missing-folder 404s on GitHub/Render)
const BUNDLE = {
  "landing": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Linktree: Everything you are, in one simple link in bio</title>\n  <link rel=\"icon\" href=\"https://assets.production.linktr.ee/images/favicon.ico\">\n  <!-- Tailwind CSS CDN -->\n  <script src=\"https://cdn.tailwindcss.com\"></script>\n  <!-- Google Fonts -->\n  <link href=\"https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap\" rel=\"stylesheet\">\n  <link rel=\"stylesheet\" href=\"/css/style.css\">\n  <script>\n    tailwind.config = {\n      theme: {\n        extend: {\n          fontFamily: {\n            sans: ['Plus Jakarta Sans', 'sans-serif'],\n          },\n          colors: {\n            brand: '#d2e823',\n            brandDark: '#1e2321',\n            brandPink: '#e9c0e9',\n            brandPurple: '#502274',\n          }\n        }\n      }\n    }\n  </script>\n</head>\n<body class=\"bg-[#254f1a] text-white font-sans antialiased overflow-x-hidden\">\n\n  <!-- Navigation Bar -->\n  <header class=\"fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-4\">\n    <nav class=\"max-w-7xl mx-auto bg-white text-stone-900 rounded-full px-6 py-3.5 flex items-center justify-between shadow-lg\">\n      <div class=\"flex items-center space-x-8\">\n        <a href=\"/\" class=\"flex items-center space-x-2 font-black text-2xl tracking-tight\">\n          <span>linktree</span>\n          <span class=\"text-xl\">🌴</span>\n        </a>\n        <div class=\"hidden md:flex items-center space-x-6 text-sm font-semibold text-stone-600\">\n          <a href=\"#features\" class=\"hover:text-stone-900 transition\">Features</a>\n          <a href=\"#creators\" class=\"hover:text-stone-900 transition\">Discover Creators</a>\n          <a href=\"#templates\" class=\"hover:text-stone-900 transition\">Templates</a>\n          <a href=\"#faq\" class=\"hover:text-stone-900 transition\">FAQ</a>\n        </div>\n      </div>\n      <div class=\"flex items-center space-x-3\">\n        <a href=\"/login\" class=\"px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-full text-sm font-bold transition\">\n          Log in\n        </a>\n        <a href=\"/signup\" class=\"px-5 py-2.5 bg-stone-900 hover:bg-black text-white rounded-full text-sm font-bold transition\">\n          Sign up free\n        </a>\n      </div>\n    </nav>\n  </header>\n\n  <!-- Hero Section -->\n  <section class=\"pt-36 pb-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12\">\n    <div class=\"lg:w-1/2 text-left\">\n      <h1 class=\"text-5xl sm:text-6xl lg:text-7xl font-black text-brand tracking-tight leading-[1.08] mb-6\">\n        Everything you are. In one, simple link in bio.\n      </h1>\n      <p class=\"text-lg sm:text-xl text-stone-200 mb-8 max-w-xl font-medium leading-relaxed\">\n        Join over 50M+ creators, artists, and entrepreneurs using Linktree for their link in bio. One link to help you share everything you create, curate, and sell.\n      </p>\n\n      <!-- Claim Username Bar -->\n      <form id=\"claimForm\" class=\"flex flex-col sm:flex-row gap-3 max-w-lg mb-4\">\n        <div class=\"relative flex-1\">\n          <span class=\"absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 font-bold select-none text-base\">linktr.ee/</span>\n          <input \n            type=\"text\" \n            id=\"claimInput\" \n            placeholder=\"yourname\" \n            class=\"w-full pl-24 pr-4 py-4 rounded-full bg-white text-stone-900 font-bold placeholder-stone-400 focus:outline-none focus:ring-4 focus:ring-brand/40 transition text-base\"\n            required\n            autocomplete=\"off\"\n            pattern=\"[a-zA-Z0-9_\\-]+\"\n          />\n        </div>\n        <button \n          type=\"submit\" \n          class=\"px-8 py-4 bg-brand hover:bg-[#c3d91f] text-stone-900 font-extrabold rounded-full transition shadow-md whitespace-nowrap text-base\"\n        >\n          Claim your Linktree\n        </button>\n      </form>\n      <div id=\"claimFeedback\" class=\"text-xs text-brand pl-4 font-semibold min-h-[1.2rem]\"></div>\n    </div>\n\n    <!-- Hero Interactive Preview Mockup -->\n    <div class=\"lg:w-1/2 flex justify-center\">\n      <div class=\"relative group\">\n        <!-- Ambient Glow -->\n        <div class=\"absolute -inset-4 bg-gradient-to-r from-brand to-brandPink rounded-[52px] blur-2xl opacity-40 group-hover:opacity-60 transition duration-500\"></div>\n        \n        <!-- Phone Frame -->\n        <div class=\"mockup-phone border-4 border-stone-800 shadow-2xl relative z-10 bg-black\">\n          <div class=\"mockup-notch\"></div>\n          <div class=\"mockup-screen bg-[#1e2321] text-white p-5 flex flex-col items-center pt-8\">\n            <img src=\"https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80\" \n                 class=\"w-20 h-20 rounded-full border-2 border-white/20 object-cover shadow-md mb-3\" />\n            <div class=\"flex items-center gap-1.5 mb-1\">\n              <span class=\"font-bold text-lg\">Alex Rivera</span>\n              <span class=\"text-blue-400 text-sm\">✓</span>\n            </div>\n            <p class=\"text-xs text-stone-300 text-center mb-4 max-w-[220px]\">\n              Tech enthusiast, UI designer & coffee addict ☕ Creating sleek digital experiences.\n            </p>\n\n            <!-- Socials Icons -->\n            <div class=\"flex gap-3 mb-5 text-stone-300 text-base\">\n              <span>📷</span>\n              <span>▶️</span>\n              <span>🐦</span>\n              <span>💻</span>\n              <span>🎧</span>\n            </div>\n\n            <!-- Links list -->\n            <div class=\"w-full space-y-2.5\">\n              <div class=\"p-3 bg-[#2a302d] hover:bg-[#343c38] rounded-full text-center text-xs font-bold border border-white/10 transition cursor-pointer shadow-sm\">\n                🚀 Check out my New Portfolio 2026\n              </div>\n              <div class=\"p-3 bg-[#2a302d] hover:bg-[#343c38] rounded-full text-center text-xs font-bold border border-white/10 transition cursor-pointer shadow-sm\">\n                📺 Latest YouTube: How to Build Clean Web Apps\n              </div>\n              <div class=\"p-3 bg-[#2a302d] hover:bg-[#343c38] rounded-full text-center text-xs font-bold border border-white/10 transition cursor-pointer shadow-sm\">\n                🎨 Figma Design UI Kit (Free Download)\n              </div>\n              <div class=\"p-3 bg-[#2a302d] hover:bg-[#343c38] rounded-full text-center text-xs font-bold border border-white/10 transition cursor-pointer shadow-sm\">\n                ☕ Support my work on Buy Me a Coffee\n              </div>\n            </div>\n\n            <div class=\"mt-6 text-[10px] text-stone-400 font-bold flex items-center gap-1\">\n              <span>🌴 Linktree</span>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </section>\n\n  <!-- Live Demo Creators Showcase Section -->\n  <section id=\"creators\" class=\"py-20 bg-stone-100 text-stone-900 px-6\">\n    <div class=\"max-w-7xl mx-auto\">\n      <div class=\"text-center max-w-2xl mx-auto mb-14\">\n        <span class=\"text-sm font-black uppercase tracking-wider text-stone-500\">Live Demonstrations</span>\n        <h2 class=\"text-4xl sm:text-5xl font-black tracking-tight mt-2 mb-4\">\n          Experience Ready-to-Use Bio Pages\n        </h2>\n        <p class=\"text-stone-600 font-medium text-lg\">\n          Click any pre-configured creator profile below to test real click tracking, QR code generation, and mobile layouts.\n        </p>\n      </div>\n\n      <div class=\"grid grid-cols-1 md:grid-cols-3 gap-8\">\n        <!-- Card 1: Alex -->\n        <div class=\"bg-white rounded-3xl p-6 shadow-sm border border-stone-200 hover:shadow-xl transition duration-300 flex flex-col justify-between\">\n          <div>\n            <div class=\"flex items-center gap-4 mb-4\">\n              <img src=\"https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80\" class=\"w-14 h-14 rounded-full object-cover\" />\n              <div>\n                <h3 class=\"font-extrabold text-xl text-stone-900 flex items-center gap-1\">\n                  Alex Rivera <span class=\"text-blue-500 text-sm\">✓</span>\n                </h3>\n                <span class=\"text-sm font-semibold text-stone-400\">linktr.ee/alex</span>\n              </div>\n            </div>\n            <p class=\"text-sm text-stone-600 mb-6 line-clamp-2\">\n              Tech creator, UI/UX designer. Theme: Charcoal Noir with 4 custom links.\n            </p>\n          </div>\n          <div class=\"pt-4 border-t border-stone-100 flex items-center justify-between\">\n            <span class=\"text-xs font-bold text-stone-400\">Theme: Charcoal</span>\n            <a href=\"/alex\" target=\"_blank\" class=\"px-4 py-2 bg-stone-900 hover:bg-black text-white text-xs font-bold rounded-full transition flex items-center gap-1.5\">\n              <span>View Profile</span> ↗\n            </a>\n          </div>\n        </div>\n\n        <!-- Card 2: Sarah -->\n        <div class=\"bg-white rounded-3xl p-6 shadow-sm border border-stone-200 hover:shadow-xl transition duration-300 flex flex-col justify-between\">\n          <div>\n            <div class=\"flex items-center gap-4 mb-4\">\n              <img src=\"https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80\" class=\"w-14 h-14 rounded-full object-cover\" />\n              <div>\n                <h3 class=\"font-extrabold text-xl text-stone-900 flex items-center gap-1\">\n                  Sarah Chen ✨\n                </h3>\n                <span class=\"text-sm font-semibold text-stone-400\">linktr.ee/sarah</span>\n              </div>\n            </div>\n            <p class=\"text-sm text-stone-600 mb-6 line-clamp-2\">\n              Indie Musician & Visual Artist. Theme: Sunset Glow with music & ticket links.\n            </p>\n          </div>\n          <div class=\"pt-4 border-t border-stone-100 flex items-center justify-between\">\n            <span class=\"text-xs font-bold text-stone-400\">Theme: Sunset Pastel</span>\n            <a href=\"/sarah\" target=\"_blank\" class=\"px-4 py-2 bg-stone-900 hover:bg-black text-white text-xs font-bold rounded-full transition flex items-center gap-1.5\">\n              <span>View Profile</span> ↗\n            </a>\n          </div>\n        </div>\n\n        <!-- Card 3: Demo -->\n        <div class=\"bg-white rounded-3xl p-6 shadow-sm border border-stone-200 hover:shadow-xl transition duration-300 flex flex-col justify-between\">\n          <div>\n            <div class=\"flex items-center gap-4 mb-4\">\n              <img src=\"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80\" class=\"w-14 h-14 rounded-full object-cover\" />\n              <div>\n                <h3 class=\"font-extrabold text-xl text-stone-900\">\n                  Demo Creator\n                </h3>\n                <span class=\"text-sm font-semibold text-stone-400\">linktr.ee/demo</span>\n              </div>\n            </div>\n            <p class=\"text-sm text-stone-600 mb-6 line-clamp-2\">\n              Starter creator layout. Theme: Clean White with newsletter and personal blog.\n            </p>\n          </div>\n          <div class=\"pt-4 border-t border-stone-100 flex items-center justify-between\">\n            <span class=\"text-xs font-bold text-stone-400\">Theme: Minimal Light</span>\n            <a href=\"/demo\" target=\"_blank\" class=\"px-4 py-2 bg-stone-900 hover:bg-black text-white text-xs font-bold rounded-full transition flex items-center gap-1.5\">\n              <span>View Profile</span> ↗\n            </a>\n          </div>\n        </div>\n      </div>\n    </div>\n  </section>\n\n  <!-- Feature Pillars Section -->\n  <section id=\"features\" class=\"py-24 bg-[#780016] text-white px-6\">\n    <div class=\"max-w-7xl mx-auto\">\n      <div class=\"grid grid-cols-1 lg:grid-cols-3 gap-12\">\n        <div class=\"bg-white/10 p-8 rounded-3xl border border-white/20 backdrop-blur-sm\">\n          <div class=\"text-4xl mb-4\">🔗</div>\n          <h3 class=\"text-2xl font-black mb-3\">Connect your content</h3>\n          <p class=\"text-stone-200 leading-relaxed text-sm\">\n            Add all your social handles, YouTube channels, shop catalogs, and podcast episodes in one centralized, high-converting hub.\n          </p>\n        </div>\n\n        <div class=\"bg-white/10 p-8 rounded-3xl border border-white/20 backdrop-blur-sm\">\n          <div class=\"text-4xl mb-4\">🎨</div>\n          <h3 class=\"text-2xl font-black mb-3\">Personalize in seconds</h3>\n          <p class=\"text-stone-200 leading-relaxed text-sm\">\n            Choose from curated color themes, button corner styling, custom typography, or craft your own brand palette with live mobile preview.\n          </p>\n        </div>\n\n        <div class=\"bg-white/10 p-8 rounded-3xl border border-white/20 backdrop-blur-sm\">\n          <div class=\"text-4xl mb-4\">📊</div>\n          <h3 class=\"text-2xl font-black mb-3\">Analyze & Grow</h3>\n          <p class=\"text-stone-200 leading-relaxed text-sm\">\n            Track total profile views, per-link clicks, and click-through rates (CTR) in real-time to discover what your audience loves most.\n          </p>\n        </div>\n      </div>\n    </div>\n  </section>\n\n  <!-- FAQ Section -->\n  <section id=\"faq\" class=\"py-20 bg-stone-900 text-white px-6\">\n    <div class=\"max-w-4xl mx-auto\">\n      <h2 class=\"text-4xl font-black text-center mb-12\">Frequently Asked Questions</h2>\n      <div class=\"space-y-4\">\n        <details class=\"bg-stone-800/80 p-6 rounded-2xl cursor-pointer\">\n          <summary class=\"font-bold text-lg text-brand\">What is Linktree?</summary>\n          <p class=\"text-stone-300 mt-3 text-sm leading-relaxed\">\n            Linktree is a tool that allows you to create a personalized and easily-customizable landing page for all of your links. It connects your followers on Instagram, TikTok, Twitter, YouTube and more to everything you do with just one URL.\n          </p>\n        </details>\n        <details class=\"bg-stone-800/80 p-6 rounded-2xl cursor-pointer\">\n          <summary class=\"font-bold text-lg text-brand\">How do I test the admin panel?</summary>\n          <p class=\"text-stone-300 mt-3 text-sm leading-relaxed\">\n            You can either register a new account instantly with your desired username, or log in with the pre-seeded demo accounts: <strong>alex</strong> (password: <code>password123</code>) or <strong>sarah</strong> (password: <code>password123</code>).\n          </p>\n        </details>\n        <details class=\"bg-stone-800/80 p-6 rounded-2xl cursor-pointer\">\n          <summary class=\"font-bold text-lg text-brand\">Can I customize my page colors and buttons?</summary>\n          <p class=\"text-stone-300 mt-3 text-sm leading-relaxed\">\n            Yes! Inside the Appearance tab in the Admin panel, you can choose between curated theme presets (Charcoal, Sunset, Neon Cyber, Matcha, etc.) or set custom background colors, button rounding, and fonts.\n          </p>\n        </details>\n      </div>\n    </div>\n  </section>\n\n  <!-- CTA Banner -->\n  <section class=\"py-20 bg-brand text-stone-900 px-6 text-center\">\n    <div class=\"max-w-3xl mx-auto\">\n      <h2 class=\"text-4xl sm:text-5xl font-black mb-4\">Jumpstart your corner of the internet today</h2>\n      <p class=\"text-lg font-semibold text-stone-800 mb-8\">\n        No coding or complex design skills required. Get your Linktree up and running in under 2 minutes.\n      </p>\n      <a href=\"/signup\" class=\"inline-block px-10 py-4 bg-stone-900 hover:bg-black text-white font-black rounded-full text-lg shadow-xl transition\">\n        Get started for free\n      </a>\n    </div>\n  </section>\n\n  <!-- Footer -->\n  <footer class=\"bg-black text-stone-400 py-12 px-6 border-t border-stone-800 text-sm\">\n    <div class=\"max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6\">\n      <div class=\"flex items-center space-x-2 text-white font-black text-xl\">\n        <span>linktree</span>\n        <span>🌴</span>\n      </div>\n      <div class=\"flex flex-wrap justify-center gap-6 text-xs font-semibold\">\n        <a href=\"#features\" class=\"hover:text-white transition\">Features</a>\n        <a href=\"#creators\" class=\"hover:text-white transition\">Creators</a>\n        <a href=\"/login\" class=\"hover:text-white transition\">Log in</a>\n        <a href=\"/signup\" class=\"hover:text-white transition\">Sign up</a>\n      </div>\n      <div class=\"text-xs text-stone-500\">\n        © 2026 Linktree Clone. All rights reserved.\n      </div>\n    </div>\n  </footer>\n\n  <script>\n    // Live username check on claim input\n    const claimInput = document.getElementById('claimInput');\n    const claimFeedback = document.getElementById('claimFeedback');\n    const claimForm = document.getElementById('claimForm');\n\n    let debounceTimer;\n    claimInput.addEventListener('input', (e) => {\n      const val = e.target.value.trim().toLowerCase();\n      clearTimeout(debounceTimer);\n      if (!val) {\n        claimFeedback.textContent = '';\n        return;\n      }\n      debounceTimer = setTimeout(async () => {\n        try {\n          const res = await fetch('/api/check-username/' + encodeURIComponent(val));\n          const data = await res.json();\n          if (data.available) {\n            claimFeedback.textContent = `✓ linktr.ee/${val} is available!`;\n            claimFeedback.className = 'text-xs text-brand pl-4 font-semibold min-h-[1.2rem]';\n          } else {\n            claimFeedback.textContent = `✕ linktr.ee/${val} is already taken`;\n            claimFeedback.className = 'text-xs text-rose-300 pl-4 font-semibold min-h-[1.2rem]';\n          }\n        } catch (err) {}\n      }, 300);\n    });\n\n    claimForm.addEventListener('submit', (e) => {\n      e.preventDefault();\n      const val = claimInput.value.trim().toLowerCase();\n      if (val) {\n        window.location.href = '/signup?claim=' + encodeURIComponent(val);\n      }\n    });\n  </script>\n</body>\n</html>\n",
  "login": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Log in to your Linktree</title>\n  <script src=\"https://cdn.tailwindcss.com\"></script>\n  <link href=\"https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap\" rel=\"stylesheet\">\n  <script>\n    tailwind.config = {\n      theme: {\n        extend: {\n          fontFamily: { sans: ['Plus Jakarta Sans', 'sans-serif'] },\n          colors: { brand: '#d2e823' }\n        }\n      }\n    }\n  </script>\n</head>\n<body class=\"bg-white text-stone-900 font-sans min-h-screen flex flex-col justify-between p-6\">\n\n  <!-- Header -->\n  <header class=\"max-w-7xl w-full mx-auto flex items-center justify-between py-2\">\n    <a href=\"/\" class=\"flex items-center space-x-2 font-black text-2xl tracking-tight\">\n      <span>linktree</span>\n      <span class=\"text-xl\">🌴</span>\n    </a>\n    <a href=\"/signup\" class=\"text-sm font-bold text-stone-600 hover:text-stone-900 transition underline underline-offset-4\">\n      Don't have an account? Sign up\n    </a>\n  </header>\n\n  <!-- Login Form Box -->\n  <main class=\"w-full max-w-md mx-auto my-auto py-8\">\n    <div class=\"text-left mb-8\">\n      <h1 class=\"text-4xl font-black text-stone-900 tracking-tight mb-2\">Welcome back</h1>\n      <p class=\"text-stone-500 font-medium text-sm\">Log in to your Linktree to manage your links and profile.</p>\n    </div>\n\n    <!-- Error Alert -->\n    <div id=\"errorAlert\" class=\"hidden mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold\"></div>\n\n    <form id=\"loginForm\" class=\"space-y-4\">\n      <div>\n        <label class=\"block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5\">Username or Email</label>\n        <input \n          type=\"text\" \n          id=\"usernameOrEmail\" \n          required \n          class=\"w-full px-4 py-3.5 rounded-2xl bg-stone-100 border border-stone-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900 font-medium text-sm transition\"\n          placeholder=\"e.g. alex or alex@example.com\"\n        />\n      </div>\n\n      <div>\n        <div class=\"flex items-center justify-between mb-1.5\">\n          <label class=\"block text-xs font-bold uppercase tracking-wider text-stone-500\">Password</label>\n        </div>\n        <input \n          type=\"password\" \n          id=\"password\" \n          required \n          class=\"w-full px-4 py-3.5 rounded-2xl bg-stone-100 border border-stone-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900 font-medium text-sm transition\"\n          placeholder=\"••••••••\"\n        />\n      </div>\n\n      <button \n        type=\"submit\" \n        id=\"submitBtn\" \n        class=\"w-full py-4 bg-stone-900 hover:bg-black text-white font-extrabold rounded-full transition shadow-md text-sm mt-2\"\n      >\n        Log in\n      </button>\n    </form>\n\n    <!-- Quick Demo Accounts One-Click Fill -->\n    <div class=\"mt-8 pt-6 border-t border-stone-100\">\n      <span class=\"block text-xs font-bold uppercase tracking-wider text-stone-400 mb-3 text-center\">Quick Demo Login</span>\n      <div class=\"grid grid-cols-2 gap-2\">\n        <button type=\"button\" onclick=\"fillDemo('alex', 'password123')\" class=\"px-3 py-2 bg-stone-100 hover:bg-stone-200 rounded-xl text-xs font-bold text-stone-700 transition\">\n          👤 Alex (Charcoal)\n        </button>\n        <button type=\"button\" onclick=\"fillDemo('sarah', 'password123')\" class=\"px-3 py-2 bg-stone-100 hover:bg-stone-200 rounded-xl text-xs font-bold text-stone-700 transition\">\n          👤 Sarah (Sunset)\n        </button>\n      </div>\n    </div>\n  </main>\n\n  <!-- Footer -->\n  <footer class=\"text-center text-xs text-stone-400 py-4\">\n    This site is protected by reCAPTCHA and the Google Privacy Policy.\n  </footer>\n\n  <script>\n    const form = document.getElementById('loginForm');\n    const errorAlert = document.getElementById('errorAlert');\n    const submitBtn = document.getElementById('submitBtn');\n\n    function fillDemo(user, pass) {\n      document.getElementById('usernameOrEmail').value = user;\n      document.getElementById('password').value = pass;\n      form.requestSubmit();\n    }\n\n    form.addEventListener('submit', async (e) => {\n      e.preventDefault();\n      errorAlert.classList.add('hidden');\n      submitBtn.disabled = true;\n      submitBtn.textContent = 'Logging in...';\n\n      const usernameOrEmail = document.getElementById('usernameOrEmail').value.trim();\n      const password = document.getElementById('password').value;\n\n      try {\n        const res = await fetch('/api/auth/login', {\n          method: 'POST',\n          headers: { 'Content-Type': 'application/json' },\n          body: JSON.stringify({ usernameOrEmail, password })\n        });\n        const data = await res.json();\n        if (!res.ok) {\n          throw new Error(data.error || 'Login failed');\n        }\n        window.location.href = '/admin';\n      } catch (err) {\n        errorAlert.textContent = err.message;\n        errorAlert.classList.remove('hidden');\n        submitBtn.disabled = false;\n        submitBtn.textContent = 'Log in';\n      }\n    });\n  </script>\n</body>\n</html>\n",
  "signup": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Join Linktree - Claim your Link in Bio</title>\n  <script src=\"https://cdn.tailwindcss.com\"></script>\n  <link href=\"https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap\" rel=\"stylesheet\">\n  <script>\n    tailwind.config = {\n      theme: {\n        extend: {\n          fontFamily: { sans: ['Plus Jakarta Sans', 'sans-serif'] },\n          colors: { brand: '#d2e823' }\n        }\n      }\n    }\n  </script>\n</head>\n<body class=\"bg-[#f3f3f1] text-stone-900 font-sans min-h-screen flex flex-col justify-between p-6\">\n\n  <!-- Header -->\n  <header class=\"max-w-7xl w-full mx-auto flex items-center justify-between py-2\">\n    <a href=\"/\" class=\"flex items-center space-x-2 font-black text-2xl tracking-tight\">\n      <span>linktree</span>\n      <span class=\"text-xl\">🌴</span>\n    </a>\n    <a href=\"/login\" class=\"text-sm font-bold text-stone-600 hover:text-stone-900 transition underline underline-offset-4\">\n      Already have an account? Log in\n    </a>\n  </header>\n\n  <!-- Signup Box -->\n  <main class=\"w-full max-w-md mx-auto my-auto py-8\">\n    <div class=\"bg-white p-8 rounded-3xl shadow-sm border border-stone-200\">\n      <div class=\"text-left mb-6\">\n        <h1 class=\"text-3xl font-black text-stone-900 tracking-tight mb-2\">Create your account</h1>\n        <p class=\"text-stone-500 font-medium text-sm\">Choose your unique Linktree username to get started.</p>\n      </div>\n\n      <!-- Error Alert -->\n      <div id=\"errorAlert\" class=\"hidden mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold\"></div>\n\n      <form id=\"signupForm\" class=\"space-y-4\">\n        <div>\n          <label class=\"block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5\">Desired Username</label>\n          <div class=\"relative\">\n            <span class=\"absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 font-bold select-none text-sm\">linktr.ee/</span>\n            <input \n              type=\"text\" \n              id=\"username\" \n              required \n              pattern=\"[a-zA-Z0-9_\\-]+\"\n              class=\"w-full pl-24 pr-4 py-3.5 rounded-2xl bg-stone-50 border border-stone-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900 font-bold text-sm transition\"\n              placeholder=\"yourname\"\n            />\n          </div>\n          <p id=\"usernameStatus\" class=\"text-xs font-semibold mt-1.5 min-h-[1.2rem]\"></p>\n        </div>\n\n        <div>\n          <label class=\"block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5\">Display Name</label>\n          <input \n            type=\"text\" \n            id=\"name\" \n            required \n            class=\"w-full px-4 py-3.5 rounded-2xl bg-stone-50 border border-stone-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900 font-medium text-sm transition\"\n            placeholder=\"e.g. Alex Rivera\"\n          />\n        </div>\n\n        <div>\n          <label class=\"block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5\">Email address</label>\n          <input \n            type=\"email\" \n            id=\"email\" \n            required \n            class=\"w-full px-4 py-3.5 rounded-2xl bg-stone-50 border border-stone-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900 font-medium text-sm transition\"\n            placeholder=\"you@example.com\"\n          />\n        </div>\n\n        <div>\n          <label class=\"block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5\">Password</label>\n          <input \n            type=\"password\" \n            id=\"password\" \n            required \n            minlength=\"6\"\n            class=\"w-full px-4 py-3.5 rounded-2xl bg-stone-50 border border-stone-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900 font-medium text-sm transition\"\n            placeholder=\"At least 6 characters\"\n          />\n        </div>\n\n        <button \n          type=\"submit\" \n          id=\"submitBtn\" \n          class=\"w-full py-4 bg-[#d2e823] hover:bg-[#c3d91f] text-stone-900 font-extrabold rounded-full transition shadow-sm text-sm mt-2\"\n        >\n          Create account\n        </button>\n      </form>\n    </div>\n  </main>\n\n  <!-- Footer -->\n  <footer class=\"text-center text-xs text-stone-400 py-4\">\n    By continuing, you agree to Linktree's Terms and Privacy Notice.\n  </footer>\n\n  <script>\n    const form = document.getElementById('signupForm');\n    const usernameInput = document.getElementById('username');\n    const usernameStatus = document.getElementById('usernameStatus');\n    const errorAlert = document.getElementById('errorAlert');\n    const submitBtn = document.getElementById('submitBtn');\n\n    // Auto-populate claim parameter from URL\n    const urlParams = new URLSearchParams(window.location.search);\n    const claim = urlParams.get('claim');\n    if (claim) {\n      usernameInput.value = claim;\n      checkAvailability(claim);\n    }\n\n    let debounceTimer;\n    usernameInput.addEventListener('input', (e) => {\n      const val = e.target.value.trim().toLowerCase();\n      clearTimeout(debounceTimer);\n      if (!val) {\n        usernameStatus.textContent = '';\n        return;\n      }\n      debounceTimer = setTimeout(() => checkAvailability(val), 300);\n    });\n\n    async function checkAvailability(val) {\n      try {\n        const res = await fetch('/api/check-username/' + encodeURIComponent(val));\n        const data = await res.json();\n        if (data.available) {\n          usernameStatus.textContent = '✓ Available';\n          usernameStatus.className = 'text-xs font-semibold mt-1.5 text-emerald-600';\n        } else {\n          usernameStatus.textContent = '✕ Already registered';\n          usernameStatus.className = 'text-xs font-semibold mt-1.5 text-rose-500';\n        }\n      } catch (err) {}\n    }\n\n    form.addEventListener('submit', async (e) => {\n      e.preventDefault();\n      errorAlert.classList.add('hidden');\n      submitBtn.disabled = true;\n      submitBtn.textContent = 'Creating your Linktree...';\n\n      const username = usernameInput.value.trim().toLowerCase();\n      const name = document.getElementById('name').value.trim();\n      const email = document.getElementById('email').value.trim();\n      const password = document.getElementById('password').value;\n\n      try {\n        const res = await fetch('/api/auth/register', {\n          method: 'POST',\n          headers: { 'Content-Type': 'application/json' },\n          body: JSON.stringify({ username, name, email, password })\n        });\n        const data = await res.json();\n        if (!res.ok) {\n          throw new Error(data.error || 'Registration failed');\n        }\n        window.location.href = '/admin';\n      } catch (err) {\n        errorAlert.textContent = err.message;\n        errorAlert.classList.remove('hidden');\n        submitBtn.disabled = false;\n        submitBtn.textContent = 'Create account';\n      }\n    });\n  </script>\n</body>\n</html>\n",
  "admin": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Admin Dashboard - Linktree</title>\n  <script src=\"https://cdn.tailwindcss.com\"></script>\n  <link href=\"https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&family=DM+Sans:wght@400;500;700&display=swap\" rel=\"stylesheet\">\n  <link rel=\"stylesheet\" href=\"/css/style.css\">\n  <script>\n    tailwind.config = {\n      theme: {\n        extend: {\n          fontFamily: { sans: ['Plus Jakarta Sans', 'sans-serif'] },\n          colors: { brand: '#d2e823', brandDark: '#1e2321' }\n        }\n      }\n    }\n  </script>\n</head>\n<body class=\"bg-[#f3f3f1] text-stone-900 font-sans antialiased min-h-screen flex flex-col\">\n\n  <!-- Admin Top Navbar -->\n  <header class=\"bg-white border-b border-stone-200 sticky top-0 z-40 px-6 py-3 flex items-center justify-between\">\n    <div class=\"flex items-center space-x-6\">\n      <a href=\"/admin\" class=\"flex items-center space-x-2 font-black text-2xl tracking-tight text-stone-900\">\n        <span>linktree</span>\n        <span class=\"text-xl\">🌴</span>\n      </a>\n\n      <!-- Profile Link Pill -->\n      <div class=\"hidden sm:flex items-center bg-stone-100 hover:bg-stone-200 rounded-full px-4 py-1.5 text-xs font-bold text-stone-700 transition\">\n        <span class=\"text-stone-400 mr-1\">linktr.ee/</span>\n        <span id=\"navUsername\">username</span>\n        <button id=\"copyProfileBtn\" class=\"ml-2.5 text-stone-500 hover:text-stone-900\" title=\"Copy URL\">📋</button>\n        <a id=\"navPublicLink\" href=\"#\" target=\"_blank\" class=\"ml-1.5 text-stone-500 hover:text-stone-900\" title=\"Open Public Link\">↗</a>\n      </div>\n    </div>\n\n    <!-- Navigation Tabs -->\n    <div class=\"flex items-center space-x-1 sm:space-x-2 bg-stone-100 p-1 rounded-full text-xs font-bold text-stone-600\">\n      <button class=\"nav-tab active px-4 py-2 rounded-full transition bg-white text-stone-900 shadow-sm\" data-tab=\"links\">Links</button>\n      <button class=\"nav-tab px-4 py-2 rounded-full transition hover:text-stone-900\" data-tab=\"appearance\">Appearance</button>\n      <button class=\"nav-tab px-4 py-2 rounded-full transition hover:text-stone-900\" data-tab=\"socials\">Socials</button>\n      <button class=\"nav-tab px-4 py-2 rounded-full transition hover:text-stone-900\" data-tab=\"analytics\">Analytics</button>\n      <button class=\"nav-tab px-4 py-2 rounded-full transition hover:text-stone-900\" data-tab=\"share\">Share</button>\n    </div>\n\n    <!-- User / Logout -->\n    <div class=\"flex items-center space-x-3\">\n      <div id=\"userBadge\" class=\"hidden md:flex items-center space-x-2\">\n        <img id=\"navAvatar\" src=\"\" class=\"w-8 h-8 rounded-full object-cover border border-stone-200\" />\n        <span id=\"navName\" class=\"text-xs font-bold text-stone-800\">Creator</span>\n      </div>\n      <a href=\"/logout\" class=\"px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-full text-xs font-bold transition\">\n        Log out\n      </a>\n    </div>\n  </header>\n\n  <!-- Main Split Layout -->\n  <main class=\"flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-8\">\n    \n    <!-- LEFT PANEL: Editors & Controls -->\n    <div class=\"flex-1 lg:max-w-2xl space-y-6\">\n\n      <!-- ================= TAB 1: LINKS ================= -->\n      <div id=\"tab-links\" class=\"tab-content space-y-6\">\n        <!-- Add Link Bar -->\n        <div class=\"bg-white p-5 rounded-3xl shadow-sm border border-stone-200\">\n          <div class=\"flex items-center justify-between mb-4\">\n            <h2 class=\"text-lg font-black text-stone-900\">Manage Your Links</h2>\n            <button id=\"showAddLinkFormBtn\" class=\"px-5 py-2.5 bg-brand hover:bg-[#c3d91f] text-stone-900 text-xs font-extrabold rounded-full transition shadow-sm flex items-center gap-1.5\">\n              <span>+ Add link</span>\n            </button>\n          </div>\n\n          <!-- Inline Add Link Form (collapsible) -->\n          <form id=\"addLinkForm\" class=\"hidden bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3 mb-4 animate-pop\">\n            <div class=\"text-xs font-bold uppercase tracking-wider text-stone-500\">Create New Link</div>\n            <div>\n              <input type=\"text\" id=\"newLinkTitle\" required placeholder=\"Title (e.g. My Online Store)\" class=\"w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-stone-900\" />\n            </div>\n            <div>\n              <input type=\"url\" id=\"newLinkUrl\" required placeholder=\"URL (e.g. https://yourstore.com)\" class=\"w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-stone-900\" />\n            </div>\n            <div class=\"flex items-center justify-between pt-1\">\n              <select id=\"newLinkIcon\" class=\"px-3 py-2 rounded-xl border border-stone-200 text-xs font-bold bg-white text-stone-700\">\n                <option value=\"globe\">🌐 Website</option>\n                <option value=\"shopping-bag\">🛍️ Store / Merch</option>\n                <option value=\"music\">🎵 Music / Audio</option>\n                <option value=\"youtube\">📺 Video / YouTube</option>\n                <option value=\"palette\">🎨 Portfolio / Art</option>\n                <option value=\"coffee\">☕ Support / Coffee</option>\n                <option value=\"mail\">📬 Newsletter / Mail</option>\n                <option value=\"ticket\">🎟️ Tickets / Events</option>\n              </select>\n              <div class=\"flex items-center gap-2\">\n                <button type=\"button\" id=\"cancelAddLinkBtn\" class=\"px-4 py-2 text-stone-500 hover:text-stone-800 text-xs font-bold\">Cancel</button>\n                <button type=\"submit\" class=\"px-5 py-2 bg-stone-900 hover:bg-black text-white text-xs font-bold rounded-full\">Save Link</button>\n              </div>\n            </div>\n          </form>\n\n          <p class=\"text-xs text-stone-400 font-medium\">Reorder, edit, or toggle visibility. Changes reflect live on the preview phone.</p>\n        </div>\n\n        <!-- Links List Container -->\n        <div id=\"linksList\" class=\"space-y-3\">\n          <!-- Dynamically populated links -->\n        </div>\n      </div>\n\n      <!-- ================= TAB 2: APPEARANCE ================= -->\n      <div id=\"tab-appearance\" class=\"tab-content hidden space-y-6\">\n        <!-- Profile Details -->\n        <div class=\"bg-white p-6 rounded-3xl shadow-sm border border-stone-200 space-y-5\">\n          <h2 class=\"text-lg font-black text-stone-900\">Profile Header</h2>\n          \n          <div class=\"flex items-start gap-5\">\n            <img id=\"editAvatarPreview\" src=\"\" class=\"w-20 h-20 rounded-full object-cover border-2 border-stone-200 shadow-sm\" />\n            <div class=\"flex-1 space-y-2\">\n              <label class=\"block text-xs font-bold uppercase tracking-wider text-stone-500\">Avatar Image URL</label>\n              <input type=\"url\" id=\"profileAvatarInput\" class=\"w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-stone-900\" placeholder=\"https://...\" />\n              <div class=\"flex gap-2\">\n                <button type=\"button\" onclick=\"setPresetAvatar(1)\" class=\"text-[11px] font-bold text-stone-600 hover:text-stone-900 bg-stone-100 px-2.5 py-1 rounded-lg\">Preset 1</button>\n                <button type=\"button\" onclick=\"setPresetAvatar(2)\" class=\"text-[11px] font-bold text-stone-600 hover:text-stone-900 bg-stone-100 px-2.5 py-1 rounded-lg\">Preset 2</button>\n                <button type=\"button\" onclick=\"setPresetAvatar(3)\" class=\"text-[11px] font-bold text-stone-600 hover:text-stone-900 bg-stone-100 px-2.5 py-1 rounded-lg\">Preset 3</button>\n              </div>\n            </div>\n          </div>\n\n          <div>\n            <label class=\"block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5\">Profile Title</label>\n            <input type=\"text\" id=\"profileNameInput\" class=\"w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-stone-900\" />\n          </div>\n\n          <div>\n            <label class=\"block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5\">Bio Description</label>\n            <textarea id=\"profileBioInput\" rows=\"3\" class=\"w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-stone-900\" placeholder=\"Tell your audience about yourself...\"></textarea>\n          </div>\n        </div>\n\n        <!-- Custom Background Image Upload -->\n        <div class=\"bg-white p-6 rounded-3xl shadow-sm border border-stone-200 space-y-4\">\n          <div class=\"flex items-center justify-between\">\n            <div>\n              <h2 class=\"text-lg font-black text-stone-900\">Theme Background Image</h2>\n              <p class=\"text-xs text-stone-500\">Upload your own custom background photo (อัพโหลดรูปพื้นหลัง) or enter an image URL.</p>\n            </div>\n            <button type=\"button\" id=\"removeBgImageBtn\" class=\"hidden text-xs font-bold text-rose-600 hover:text-rose-800 bg-rose-50 px-3 py-1.5 rounded-full transition\">\n              ✕ Remove Image\n            </button>\n          </div>\n\n          <div class=\"flex flex-col sm:flex-row items-center gap-4\">\n            <div id=\"bgImagePreviewBox\" class=\"w-28 h-28 rounded-2xl border-2 border-dashed border-stone-300 flex items-center justify-center text-stone-400 bg-stone-50 overflow-hidden relative shrink-0\">\n              <img id=\"bgImagePreviewThumb\" src=\"\" class=\"w-full h-full object-cover hidden\" />\n              <span id=\"bgImageEmptyText\" class=\"text-xs font-bold text-center px-2\">No Image</span>\n            </div>\n\n            <div class=\"flex-1 w-full space-y-2\">\n              <label class=\"block text-xs font-bold uppercase tracking-wider text-stone-500\">Upload File</label>\n              <input type=\"file\" id=\"bgImageFileInput\" accept=\"image/*\" class=\"w-full text-xs text-stone-500 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-stone-900 file:text-white hover:file:bg-black cursor-pointer\" />\n\n              <div class=\"pt-1\">\n                <label class=\"block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1\">Or Direct Image URL</label>\n                <input type=\"url\" id=\"bgImageUrlInput\" placeholder=\"https://images.unsplash.com/...\" class=\"w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-stone-900\" />\n              </div>\n            </div>\n          </div>\n        </div>\n\n        <!-- Themes Grid -->\n        <div class=\"bg-white p-6 rounded-3xl shadow-sm border border-stone-200 space-y-5\">\n          <h2 class=\"text-lg font-black text-stone-900\">Themes</h2>\n          <p class=\"text-xs text-stone-500\">Select a curated theme preset for your public profile.</p>\n\n          <div class=\"grid grid-cols-2 sm:grid-cols-4 gap-3\" id=\"themePickerContainer\">\n            <!-- Theme cards -->\n            <button type=\"button\" class=\"theme-card p-3 rounded-2xl border-2 text-center transition\" data-theme=\"clean\">\n              <div class=\"w-full h-16 rounded-xl bg-[#f3f3f1] border border-stone-200 flex flex-col justify-center items-center gap-1 p-2 mb-2\">\n                <div class=\"w-3/4 h-2 rounded-full bg-stone-300\"></div>\n                <div class=\"w-full h-3 rounded bg-white border border-stone-200\"></div>\n              </div>\n              <span class=\"text-xs font-bold text-stone-800\">Clean Light</span>\n            </button>\n\n            <button type=\"button\" class=\"theme-card p-3 rounded-2xl border-2 text-center transition\" data-theme=\"charcoal\">\n              <div class=\"w-full h-16 rounded-xl bg-[#1e2321] flex flex-col justify-center items-center gap-1 p-2 mb-2\">\n                <div class=\"w-3/4 h-2 rounded-full bg-stone-600\"></div>\n                <div class=\"w-full h-3 rounded bg-[#2a302d] border border-stone-700\"></div>\n              </div>\n              <span class=\"text-xs font-bold text-stone-800\">Charcoal Noir</span>\n            </button>\n\n            <button type=\"button\" class=\"theme-card p-3 rounded-2xl border-2 text-center transition\" data-theme=\"sunset\">\n              <div class=\"w-full h-16 rounded-xl bg-gradient-to-br from-pink-300 to-purple-200 flex flex-col justify-center items-center gap-1 p-2 mb-2\">\n                <div class=\"w-3/4 h-2 rounded-full bg-purple-400\"></div>\n                <div class=\"w-full h-3 rounded bg-white/80\"></div>\n              </div>\n              <span class=\"text-xs font-bold text-stone-800\">Sunset Glow</span>\n            </button>\n\n            <button type=\"button\" class=\"theme-card p-3 rounded-2xl border-2 text-center transition\" data-theme=\"cyber\">\n              <div class=\"w-full h-16 rounded-xl bg-[#090a0f] flex flex-col justify-center items-center gap-1 p-2 mb-2\">\n                <div class=\"w-3/4 h-2 rounded-full bg-cyan-400\"></div>\n                <div class=\"w-full h-3 rounded bg-cyan-950 border border-cyan-400\"></div>\n              </div>\n              <span class=\"text-xs font-bold text-stone-800\">Neon Cyber</span>\n            </button>\n\n            <button type=\"button\" class=\"theme-card p-3 rounded-2xl border-2 text-center transition\" data-theme=\"matcha\">\n              <div class=\"w-full h-16 rounded-xl bg-[#e8ede3] flex flex-col justify-center items-center gap-1 p-2 mb-2\">\n                <div class=\"w-3/4 h-2 rounded-full bg-emerald-700\"></div>\n                <div class=\"w-full h-3 rounded bg-[#39543e]\"></div>\n              </div>\n              <span class=\"text-xs font-bold text-stone-800\">Matcha Garden</span>\n            </button>\n\n            <button type=\"button\" class=\"theme-card p-3 rounded-2xl border-2 text-center transition\" data-theme=\"lavender\">\n              <div class=\"w-full h-16 rounded-xl bg-[#e6e6fa] flex flex-col justify-center items-center gap-1 p-2 mb-2\">\n                <div class=\"w-3/4 h-2 rounded-full bg-indigo-400\"></div>\n                <div class=\"w-full h-3 rounded bg-white shadow-sm\"></div>\n              </div>\n              <span class=\"text-xs font-bold text-stone-800\">Lavender Mist</span>\n            </button>\n\n            <button type=\"button\" class=\"theme-card p-3 rounded-2xl border-2 text-center transition\" data-theme=\"ocean\">\n              <div class=\"w-full h-16 rounded-xl bg-gradient-to-b from-[#1cb5e0] to-[#000046] flex flex-col justify-center items-center gap-1 p-2 mb-2\">\n                <div class=\"w-3/4 h-2 rounded-full bg-white/70\"></div>\n                <div class=\"w-full h-3 rounded bg-white/20\"></div>\n              </div>\n              <span class=\"text-xs font-bold text-stone-800\">Ocean Blue</span>\n            </button>\n          </div>\n        </div>\n\n        <!-- Button Corners & Typography -->\n        <div class=\"bg-white p-6 rounded-3xl shadow-sm border border-stone-200 space-y-5\">\n          <h2 class=\"text-lg font-black text-stone-900\">Button Corner Styles</h2>\n          <div class=\"grid grid-cols-2 sm:grid-cols-4 gap-3\" id=\"buttonStylePicker\">\n            <button type=\"button\" class=\"btn-corner-option p-3 border-2 rounded-2xl text-center\" data-style=\"rounded\">\n              <div class=\"w-full h-8 bg-stone-200 rounded-full mb-1\"></div>\n              <span class=\"text-xs font-bold\">Rounded Pill</span>\n            </button>\n            <button type=\"button\" class=\"btn-corner-option p-3 border-2 rounded-2xl text-center\" data-style=\"soft\">\n              <div class=\"w-full h-8 bg-stone-200 rounded-lg mb-1\"></div>\n              <span class=\"text-xs font-bold\">Soft Round</span>\n            </button>\n            <button type=\"button\" class=\"btn-corner-option p-3 border-2 rounded-2xl text-center\" data-style=\"shadow\">\n              <div class=\"w-full h-8 bg-stone-200 rounded-lg shadow-[3px_3px_0px_rgba(0,0,0,1)] mb-1\"></div>\n              <span class=\"text-xs font-bold\">Hard Shadow</span>\n            </button>\n            <button type=\"button\" class=\"btn-corner-option p-3 border-2 rounded-2xl text-center\" data-style=\"square\">\n              <div class=\"w-full h-8 bg-stone-200 mb-1\"></div>\n              <span class=\"text-xs font-bold\">Square</span>\n            </button>\n          </div>\n\n          <div class=\"pt-4 border-t border-stone-100 flex items-center justify-between\">\n            <div>\n              <label class=\"block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1\">Font Family</label>\n              <select id=\"profileFontSelect\" class=\"px-4 py-2 rounded-xl border border-stone-200 text-sm font-bold bg-white text-stone-800\">\n                <option value=\"Inter\">Inter (Modern & Clean)</option>\n                <option value=\"Plus Jakarta Sans\">Plus Jakarta Sans (Linktree Native)</option>\n                <option value=\"Poppins\">Poppins (Friendly)</option>\n                <option value=\"DM Sans\">DM Sans (Editorial)</option>\n              </select>\n            </div>\n            <button id=\"saveAppearanceBtn\" class=\"px-6 py-3 bg-stone-900 hover:bg-black text-white text-xs font-black rounded-full transition shadow-md\">\n              Save Appearance\n            </button>\n          </div>\n        </div>\n      </div>\n\n      <!-- ================= TAB 3: SOCIALS ================= -->\n      <div id=\"tab-socials\" class=\"tab-content hidden space-y-6\">\n        <div class=\"bg-white p-6 rounded-3xl shadow-sm border border-stone-200 space-y-5\">\n          <div class=\"flex items-center justify-between\">\n            <div>\n              <h2 class=\"text-lg font-black text-stone-900\">Social Profile Icons</h2>\n              <p class=\"text-xs text-stone-500\">Connect your profiles to display sleek icons on your bio page.</p>\n            </div>\n            <div class=\"flex items-center gap-2 bg-stone-100 p-1 rounded-full text-xs font-bold\">\n              <span class=\"pl-3 text-stone-500\">Position:</span>\n              <button id=\"posTopBtn\" class=\"px-3 py-1 rounded-full bg-white text-stone-900 shadow-sm\">Top</button>\n              <button id=\"posBottomBtn\" class=\"px-3 py-1 rounded-full text-stone-600\">Bottom</button>\n            </div>\n          </div>\n\n          <form id=\"socialsForm\" class=\"space-y-4\">\n            <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-4\">\n              <div>\n                <label class=\"block text-xs font-bold text-stone-600 mb-1\">📷 Instagram</label>\n                <input type=\"url\" id=\"soc_instagram\" placeholder=\"https://instagram.com/...\" class=\"w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-medium\" />\n              </div>\n              <div>\n                <label class=\"block text-xs font-bold text-stone-600 mb-1\">▶️ YouTube</label>\n                <input type=\"url\" id=\"soc_youtube\" placeholder=\"https://youtube.com/@...\" class=\"w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-medium\" />\n              </div>\n              <div>\n                <label class=\"block text-xs font-bold text-stone-600 mb-1\">🎵 TikTok</label>\n                <input type=\"url\" id=\"soc_tiktok\" placeholder=\"https://tiktok.com/@...\" class=\"w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-medium\" />\n              </div>\n              <div>\n                <label class=\"block text-xs font-bold text-stone-600 mb-1\">🐦 X / Twitter</label>\n                <input type=\"url\" id=\"soc_twitter\" placeholder=\"https://x.com/...\" class=\"w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-medium\" />\n              </div>\n              <div>\n                <label class=\"block text-xs font-bold text-stone-600 mb-1\">💻 GitHub</label>\n                <input type=\"url\" id=\"soc_github\" placeholder=\"https://github.com/...\" class=\"w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-medium\" />\n              </div>\n              <div>\n                <label class=\"block text-xs font-bold text-stone-600 mb-1\">🎧 Spotify</label>\n                <input type=\"url\" id=\"soc_spotify\" placeholder=\"https://open.spotify.com/...\" class=\"w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-medium\" />\n              </div>\n              <div>\n                <label class=\"block text-xs font-bold text-stone-600 mb-1\">✉️ Email Contact</label>\n                <input type=\"text\" id=\"soc_email\" placeholder=\"your@email.com\" class=\"w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-medium\" />\n              </div>\n              <div>\n                <label class=\"block text-xs font-bold text-stone-600 mb-1\">💬 WhatsApp</label>\n                <input type=\"text\" id=\"soc_whatsapp\" placeholder=\"https://wa.me/...\" class=\"w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-medium\" />\n              </div>\n            </div>\n\n            <div class=\"pt-4 flex justify-end\">\n              <button type=\"submit\" class=\"px-6 py-2.5 bg-stone-900 hover:bg-black text-white text-xs font-black rounded-full transition shadow-md\">\n                Save Socials\n              </button>\n            </div>\n          </form>\n        </div>\n      </div>\n\n      <!-- ================= TAB 4: ANALYTICS ================= -->\n      <div id=\"tab-analytics\" class=\"tab-content hidden space-y-6\">\n        <!-- Metric Cards -->\n        <div class=\"grid grid-cols-3 gap-4\">\n          <div class=\"bg-white p-5 rounded-3xl border border-stone-200 shadow-sm\">\n            <span class=\"text-xs font-bold uppercase tracking-wider text-stone-400 block mb-1\">Profile Views</span>\n            <span id=\"statViews\" class=\"text-3xl font-black text-stone-900\">0</span>\n          </div>\n          <div class=\"bg-white p-5 rounded-3xl border border-stone-200 shadow-sm\">\n            <span class=\"text-xs font-bold uppercase tracking-wider text-stone-400 block mb-1\">Link Clicks</span>\n            <span id=\"statClicks\" class=\"text-3xl font-black text-stone-900\">0</span>\n          </div>\n          <div class=\"bg-white p-5 rounded-3xl border border-stone-200 shadow-sm\">\n            <span class=\"text-xs font-bold uppercase tracking-wider text-stone-400 block mb-1\">CTR</span>\n            <span id=\"statCtr\" class=\"text-3xl font-black text-emerald-600\">0%</span>\n          </div>\n        </div>\n\n        <!-- Link Performance Breakdown -->\n        <div class=\"bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4\">\n          <h2 class=\"text-lg font-black text-stone-900\">Top Performing Links</h2>\n          <div id=\"analyticsLinksList\" class=\"space-y-3\">\n            <!-- Populated via JS -->\n          </div>\n        </div>\n      </div>\n\n      <!-- ================= TAB 5: SHARE / QR ================= -->\n      <div id=\"tab-share\" class=\"tab-content hidden space-y-6\">\n        <div class=\"bg-white p-8 rounded-3xl border border-stone-200 shadow-sm text-center max-w-md mx-auto space-y-6\">\n          <h2 class=\"text-2xl font-black text-stone-900\">Share your Linktree</h2>\n          <p class=\"text-xs text-stone-500 font-medium\">Use your unique QR code on business cards, posters, videos, or packaging.</p>\n\n          <!-- QR Code Canvas -->\n          <div class=\"p-6 bg-stone-50 rounded-3xl border border-stone-200 inline-block shadow-inner\">\n            <canvas id=\"qrCodeCanvas\" width=\"220\" height=\"220\" class=\"mx-auto\"></canvas>\n          </div>\n\n          <div class=\"space-y-2\">\n            <button id=\"downloadQrBtn\" class=\"w-full py-3 bg-stone-900 hover:bg-black text-white text-xs font-bold rounded-full transition shadow-md\">\n              Download QR Code (PNG)\n            </button>\n            <button id=\"copyShareUrlBtn\" class=\"w-full py-3 bg-brand hover:bg-[#c3d91f] text-stone-900 text-xs font-extrabold rounded-full transition\">\n              Copy Profile Link\n            </button>\n          </div>\n        </div>\n      </div>\n\n    </div>\n\n    <!-- RIGHT PANEL: Live Phone Mockup Preview -->\n    <div class=\"lg:w-[380px] flex justify-center items-start lg:sticky lg:top-24\">\n      <div class=\"relative\">\n        <div class=\"text-center mb-3\">\n          <span class=\"text-[11px] font-black uppercase tracking-wider text-stone-400\">Live Device Preview</span>\n        </div>\n\n        <!-- Mockup Device Frame -->\n        <div class=\"mockup-phone\">\n          <div class=\"mockup-notch\"></div>\n          \n          <!-- Mockup Dynamic Screen -->\n          <div id=\"mockupScreen\" class=\"mockup-screen theme-clean p-5 flex flex-col items-center pt-8\">\n            <img id=\"mockupAvatar\" src=\"\" class=\"w-20 h-20 rounded-full border-2 border-white/20 object-cover shadow-md mb-2.5\" />\n            <div class=\"flex items-center gap-1.5 mb-1\">\n              <span id=\"mockupName\" class=\"font-bold text-base leading-snug text-center\">Name</span>\n              <span id=\"mockupVerified\" class=\"text-blue-500 text-xs\">✓</span>\n            </div>\n            <p id=\"mockupBio\" class=\"text-xs text-center opacity-80 mb-3 px-2 line-clamp-3\">Bio</p>\n\n            <!-- Socials in mockup -->\n            <div id=\"mockupSocialsTop\" class=\"flex flex-wrap justify-center gap-3 mb-4 text-sm\"></div>\n\n            <!-- Links in mockup -->\n            <div id=\"mockupLinks\" class=\"w-full space-y-2.5 my-auto\">\n              <!-- Links render here -->\n            </div>\n\n            <!-- Socials bottom -->\n            <div id=\"mockupSocialsBottom\" class=\"flex flex-wrap justify-center gap-3 mt-4 text-sm hidden\"></div>\n          </div>\n        </div>\n      </div>\n    </div>\n\n  </main>\n\n  <script src=\"/js/admin.js\"></script>\n</body>\n</html>\n",
  "profile": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Creator Linktree</title>\n  <script src=\"https://cdn.tailwindcss.com\"></script>\n  <link href=\"https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700&family=DM+Sans:wght@400;500;700&display=swap\" rel=\"stylesheet\">\n  <link rel=\"stylesheet\" href=\"/css/style.css\">\n</head>\n<body id=\"profileBody\" class=\"min-h-screen transition-colors duration-300 antialiased flex flex-col justify-between py-10 px-4\">\n\n  <!-- Bio Main Profile Card -->\n  <main class=\"max-w-xl w-full mx-auto text-center space-y-6 flex-1 flex flex-col items-center\">\n    \n    <!-- Profile Avatar & Info -->\n    <div class=\"space-y-3 flex flex-col items-center\">\n      <div class=\"relative\">\n        <img id=\"creatorAvatar\" src=\"\" class=\"w-24 h-24 rounded-full border-2 border-white/30 object-cover shadow-lg\" />\n        <div id=\"verifiedBadge\" class=\"hidden absolute bottom-0 right-1 bg-blue-500 text-white rounded-full p-1 text-[10px] shadow\">\n          ✓\n        </div>\n      </div>\n\n      <h1 id=\"creatorName\" class=\"text-2xl font-black tracking-tight flex items-center gap-2\">\n        <span>Loading...</span>\n      </h1>\n\n      <p id=\"creatorBio\" class=\"text-sm font-medium opacity-85 max-w-sm leading-relaxed\"></p>\n    </div>\n\n    <!-- Social Icons (Top Placement) -->\n    <div id=\"socialsTop\" class=\"flex flex-wrap justify-center gap-4 text-xl\"></div>\n\n    <!-- Links List -->\n    <div id=\"linksList\" class=\"w-full space-y-3.5 pt-2\">\n      <!-- Dynamically filled with active links -->\n    </div>\n\n    <!-- Social Icons (Bottom Placement) -->\n    <div id=\"socialsBottom\" class=\"flex flex-wrap justify-center gap-4 text-xl hidden\"></div>\n\n  </main>\n\n  <!-- Share Sheet Modal -->\n  <div id=\"shareModal\" class=\"fixed inset-0 z-50 bg-black/60 backdrop-blur-sm hidden flex items-center justify-center p-4\">\n    <div class=\"bg-white text-stone-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative animate-pop space-y-5 text-center\">\n      <button id=\"closeShareModalBtn\" class=\"absolute top-4 right-4 text-stone-400 hover:text-stone-700 text-xl font-bold\">✕</button>\n\n      <div>\n        <h3 class=\"text-xl font-black\">Share this Linktree</h3>\n        <p class=\"text-xs text-stone-400 font-semibold mt-1\">Get more eyes on this creator's profile</p>\n      </div>\n\n      <!-- QR Code Canvas -->\n      <div class=\"p-4 bg-stone-50 rounded-2xl border border-stone-100 inline-block\">\n        <canvas id=\"profileQrCanvas\" width=\"180\" height=\"180\" class=\"mx-auto\"></canvas>\n      </div>\n\n      <!-- Quick Action Buttons -->\n      <div class=\"space-y-2\">\n        <button id=\"copyProfileLinkBtn\" class=\"w-full py-3 bg-stone-900 hover:bg-black text-white text-xs font-bold rounded-full transition shadow-md\">\n          Copy Link\n        </button>\n        <button id=\"downloadProfileQrBtn\" class=\"w-full py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-full transition\">\n          Download QR Code\n        </button>\n      </div>\n\n      <!-- Social Shares -->\n      <div class=\"pt-2 border-t border-stone-100 flex justify-center gap-4 text-lg\">\n        <a id=\"shareTwitter\" target=\"_blank\" class=\"p-2.5 bg-stone-50 hover:bg-stone-100 rounded-xl transition\" title=\"Share on X\">🐦</a>\n        <a id=\"shareFacebook\" target=\"_blank\" class=\"p-2.5 bg-stone-50 hover:bg-stone-100 rounded-xl transition\" title=\"Share on Facebook\">📘</a>\n        <a id=\"shareWhatsApp\" target=\"_blank\" class=\"p-2.5 bg-stone-50 hover:bg-stone-100 rounded-xl transition\" title=\"Share on WhatsApp\">💬</a>\n        <a id=\"shareEmail\" class=\"p-2.5 bg-stone-50 hover:bg-stone-100 rounded-xl transition\" title=\"Share via Email\">✉️</a>\n      </div>\n    </div>\n  </div>\n\n  <script src=\"/js/profile.js\"></script>\n</body>\n</html>\n",
  "css": "/* public/css/style.css - Themes, Device Frames & Custom Animations */\n\n@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700&display=swap');\n\n/* Base Styles */\nbody {\n  -webkit-font-smoothing: antialiased;\n}\n\n/* Custom Scrollbars */\n::-webkit-scrollbar {\n  width: 6px;\n  height: 6px;\n}\n::-webkit-scrollbar-track {\n  background: transparent;\n}\n::-webkit-scrollbar-thumb {\n  background: rgba(150, 150, 150, 0.3);\n  border-radius: 999px;\n}\n::-webkit-scrollbar-thumb:hover {\n  background: rgba(150, 150, 150, 0.5);\n}\n\n/* Mobile Mockup Phone Frame */\n.mockup-phone {\n  width: 320px;\n  height: 640px;\n  background: #000;\n  border-radius: 46px;\n  padding: 10px;\n  box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.3), 0 0 0 2px #333;\n  position: relative;\n  overflow: hidden;\n  display: flex;\n  flex-direction: column;\n}\n\n.mockup-notch {\n  width: 120px;\n  height: 22px;\n  background: #000;\n  position: absolute;\n  top: 10px;\n  left: 50%;\n  transform: translateX(-50%);\n  border-bottom-left-radius: 14px;\n  border-bottom-right-radius: 14px;\n  z-index: 50;\n}\n\n.mockup-screen {\n  flex: 1;\n  border-radius: 38px;\n  overflow-y: auto;\n  position: relative;\n  scrollbar-width: none;\n}\n.mockup-screen::-webkit-scrollbar {\n  display: none;\n}\n\n/* Themes Definition */\n/* Clean Light */\n.theme-clean {\n  background: #f3f3f1;\n  color: #1a1a1a;\n}\n.theme-clean .bio-btn {\n  background: #ffffff;\n  color: #1a1a1a;\n  border: 1px solid #e5e5e5;\n  box-shadow: 0 2px 4px rgba(0,0,0,0.04);\n}\n.theme-clean .bio-btn:hover {\n  background: #fafafa;\n  transform: translateY(-2px);\n}\n\n/* Charcoal Noir */\n.theme-charcoal {\n  background: #1e2321;\n  color: #f5f5f5;\n}\n.theme-charcoal .bio-btn {\n  background: #2a302d;\n  color: #ffffff;\n  border: 1px solid #3c4440;\n}\n.theme-charcoal .bio-btn:hover {\n  background: #343c38;\n  transform: translateY(-2px);\n}\n\n/* Sunset Glow */\n.theme-sunset {\n  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%);\n  color: #2b1130;\n}\n.theme-sunset .bio-btn {\n  background: rgba(255, 255, 255, 0.85);\n  backdrop-filter: blur(8px);\n  color: #2b1130;\n  border: 1px solid rgba(255, 255, 255, 0.6);\n  box-shadow: 0 4px 15px rgba(255, 154, 158, 0.25);\n}\n.theme-sunset .bio-btn:hover {\n  background: #ffffff;\n  transform: translateY(-2px);\n}\n\n/* Neon Cyber */\n.theme-cyber {\n  background: #090a0f;\n  color: #00f2fe;\n}\n.theme-cyber .bio-btn {\n  background: #111422;\n  color: #00f2fe;\n  border: 1px solid #00f2fe;\n  box-shadow: 0 0 10px rgba(0, 242, 254, 0.2);\n}\n.theme-cyber .bio-btn:hover {\n  background: #00f2fe;\n  color: #090a0f;\n  transform: translateY(-2px);\n  box-shadow: 0 0 20px rgba(0, 242, 254, 0.6);\n}\n\n/* Matcha Garden */\n.theme-matcha {\n  background: #e8ede3;\n  color: #26382b;\n}\n.theme-matcha .bio-btn {\n  background: #39543e;\n  color: #ffffff;\n  border: 1px solid #2f4533;\n}\n.theme-matcha .bio-btn:hover {\n  background: #2f4533;\n  transform: translateY(-2px);\n}\n\n/* Lavender Mist */\n.theme-lavender {\n  background: #e6e6fa;\n  color: #382c4d;\n}\n.theme-lavender .bio-btn {\n  background: #ffffff;\n  color: #382c4d;\n  border: 1px solid #d4d0ee;\n  box-shadow: 0 4px 12px rgba(103, 58, 183, 0.08);\n}\n.theme-lavender .bio-btn:hover {\n  background: #f9f8fe;\n  transform: translateY(-2px);\n}\n\n/* Ocean Blue */\n.theme-ocean {\n  background: linear-gradient(180deg, #1cb5e0 0%, #000046 100%);\n  color: #ffffff;\n}\n.theme-ocean .bio-btn {\n  background: rgba(255, 255, 255, 0.15);\n  backdrop-filter: blur(10px);\n  color: #ffffff;\n  border: 1px solid rgba(255, 255, 255, 0.3);\n}\n.theme-ocean .bio-btn:hover {\n  background: rgba(255, 255, 255, 0.28);\n  transform: translateY(-2px);\n}\n\n/* Button Corners */\n.btn-style-rounded {\n  border-radius: 9999px !important;\n}\n.btn-style-soft {\n  border-radius: 12px !important;\n}\n.btn-style-square {\n  border-radius: 0px !important;\n}\n.btn-style-shadow {\n  border-radius: 12px !important;\n  box-shadow: 4px 4px 0px rgba(0,0,0,0.9) !important;\n}\n.btn-style-outline {\n  background: transparent !important;\n  border-width: 2px !important;\n}\n\n/* Micro-animations */\n@keyframes popIn {\n  from { opacity: 0; transform: scale(0.96) translateY(6px); }\n  to { opacity: 1; transform: scale(1) translateY(0); }\n}\n.animate-pop {\n  animation: popIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;\n}\n",
  "adminJs": "// public/js/admin.js - Admin Dashboard & Real-Time Mockup Sync\nlet currentUser = null;\nlet currentLinks = [];\nlet currentAnalytics = null;\n\n// Preset avatars\nconst PRESET_AVATARS = [\n  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',\n  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',\n  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'\n];\n\nfunction setPresetAvatar(index) {\n  const url = PRESET_AVATARS[index - 1];\n  document.getElementById('profileAvatarInput').value = url;\n  document.getElementById('editAvatarPreview').src = url;\n  syncMockup();\n}\n\n// Icon emoji map\nconst ICON_MAP = {\n  globe: '🌐',\n  'shopping-bag': '🛍️',\n  music: '🎵',\n  youtube: '📺',\n  palette: '🎨',\n  coffee: '☕',\n  mail: '📬',\n  ticket: '🎟️'\n};\n\ndocument.addEventListener('DOMContentLoaded', () => {\n  initTabs();\n  initFormListeners();\n  loadDashboardData();\n});\n\n// -------------------------------------------------------------\n// Tab Management\n// -------------------------------------------------------------\nfunction initTabs() {\n  const tabBtns = document.querySelectorAll('.nav-tab');\n  const tabContents = document.querySelectorAll('.tab-content');\n\n  tabBtns.forEach(btn => {\n    btn.addEventListener('click', () => {\n      const target = btn.dataset.tab;\n\n      tabBtns.forEach(b => {\n        b.classList.remove('bg-white', 'text-stone-900', 'shadow-sm');\n        b.classList.add('text-stone-600');\n      });\n      btn.classList.add('bg-white', 'text-stone-900', 'shadow-sm');\n      btn.classList.remove('text-stone-600');\n\n      tabContents.forEach(content => {\n        if (content.id === `tab-${target}`) {\n          content.classList.remove('hidden');\n        } else {\n          content.classList.add('hidden');\n        }\n      });\n\n      if (target === 'share') {\n        drawQRCode();\n      }\n    });\n  });\n}\n\n// -------------------------------------------------------------\n// Data Fetching & Initialization\n// -------------------------------------------------------------\nasync function loadDashboardData() {\n  try {\n    const res = await fetch('/api/user/me');\n    if (!res.ok) {\n      window.location.href = '/login';\n      return;\n    }\n    const data = await res.json();\n    currentUser = data.user;\n    currentLinks = data.links;\n    currentAnalytics = data.analytics;\n\n    renderHeader();\n    renderLinks();\n    renderAppearance();\n    renderSocials();\n    renderAnalytics();\n    syncMockup();\n  } catch (err) {\n    console.error('Failed to load dashboard:', err);\n  }\n}\n\n// -------------------------------------------------------------\n// Render Helpers\n// -------------------------------------------------------------\nfunction renderHeader() {\n  document.getElementById('navUsername').textContent = currentUser.username;\n  document.getElementById('navName').textContent = currentUser.name;\n  document.getElementById('navAvatar').src = currentUser.avatar;\n  document.getElementById('navPublicLink').href = `/${currentUser.username}`;\n\n  document.getElementById('copyProfileBtn').onclick = () => {\n    const fullUrl = `${window.location.origin}/${currentUser.username}`;\n    navigator.clipboard.writeText(fullUrl);\n    alert(`Copied: ${fullUrl}`);\n  };\n\n  document.getElementById('copyShareUrlBtn').onclick = () => {\n    const fullUrl = `${window.location.origin}/${currentUser.username}`;\n    navigator.clipboard.writeText(fullUrl);\n    alert(`Copied link to clipboard: ${fullUrl}`);\n  };\n}\n\nfunction renderLinks() {\n  const list = document.getElementById('linksList');\n  list.innerHTML = '';\n\n  if (currentLinks.length === 0) {\n    list.innerHTML = `\n      <div class=\"bg-white p-8 rounded-3xl border border-stone-200 text-center text-stone-400\">\n        <p class=\"font-bold text-sm mb-1\">No links added yet.</p>\n        <p class=\"text-xs\">Click \"+ Add link\" above to create your first link.</p>\n      </div>\n    `;\n    return;\n  }\n\n  currentLinks.forEach((link, idx) => {\n    const card = document.createElement('div');\n    card.className = 'bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between gap-4 transition hover:border-stone-300';\n    card.dataset.id = link.id;\n\n    const iconEmoji = ICON_MAP[link.icon] || '🌐';\n\n    card.innerHTML = `\n      <div class=\"flex items-center gap-3\">\n        <!-- Reorder buttons -->\n        <div class=\"flex flex-col text-stone-400\">\n          <button type=\"button\" onclick=\"moveLink(${idx}, -1)\" ${idx === 0 ? 'disabled class=\"opacity-20\"' : 'class=\"hover:text-stone-800\"'} title=\"Move Up\">▲</button>\n          <button type=\"button\" onclick=\"moveLink(${idx}, 1)\" ${idx === currentLinks.length - 1 ? 'disabled class=\"opacity-20\"' : 'class=\"hover:text-stone-800\"'} title=\"Move Down\">▼</button>\n        </div>\n        <span class=\"text-xl p-2 bg-stone-100 rounded-xl\">${iconEmoji}</span>\n        <div class=\"flex-1 min-w-[200px]\">\n          <input type=\"text\" class=\"link-edit-title font-bold text-sm text-stone-900 w-full bg-transparent border-b border-transparent hover:border-stone-200 focus:border-stone-900 focus:outline-none\" value=\"${escapeHtml(link.title)}\" />\n          <input type=\"url\" class=\"link-edit-url text-xs text-stone-500 font-medium w-full bg-transparent border-b border-transparent hover:border-stone-200 focus:border-stone-900 focus:outline-none mt-0.5\" value=\"${escapeHtml(link.url)}\" />\n        </div>\n      </div>\n\n      <div class=\"flex items-center gap-3\">\n        <!-- Click badge -->\n        <span class=\"text-[11px] font-bold text-stone-400 px-2 py-1 bg-stone-50 rounded-lg whitespace-nowrap\">\n          📊 ${link.clicks || 0}\n        </span>\n\n        <!-- Active Toggle Switch -->\n        <label class=\"relative inline-flex items-center cursor-pointer\">\n          <input type=\"checkbox\" class=\"sr-only peer link-active-toggle\" ${link.active ? 'checked' : ''}>\n          <div class=\"w-10 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:width after:w-5 after:transition-all peer-checked:bg-emerald-500\"></div>\n        </label>\n\n        <!-- Delete button -->\n        <button type=\"button\" onclick=\"deleteLink('${link.id}')\" class=\"text-stone-400 hover:text-rose-500 text-sm p-1.5 rounded-lg transition\" title=\"Delete\">\n          🗑️\n        </button>\n      </div>\n    `;\n\n    // Listeners for inline title & url updates\n    const titleInput = card.querySelector('.link-edit-title');\n    const urlInput = card.querySelector('.link-edit-url');\n    const activeToggle = card.querySelector('.link-active-toggle');\n\n    let updateTimer;\n    const saveChanges = () => {\n      clearTimeout(updateTimer);\n      updateTimer = setTimeout(async () => {\n        link.title = titleInput.value;\n        link.url = urlInput.value;\n        link.active = activeToggle.checked;\n        syncMockup();\n\n        await fetch(`/api/user/links/${link.id}`, {\n          method: 'PUT',\n          headers: { 'Content-Type': 'application/json' },\n          body: JSON.stringify({ title: link.title, url: link.url, active: link.active })\n        });\n      }, 400);\n    };\n\n    titleInput.addEventListener('input', saveChanges);\n    urlInput.addEventListener('input', saveChanges);\n    activeToggle.addEventListener('change', () => {\n      link.active = activeToggle.checked;\n      syncMockup();\n      fetch(`/api/user/links/${link.id}`, {\n        method: 'PUT',\n        headers: { 'Content-Type': 'application/json' },\n        body: JSON.stringify({ active: link.active })\n      });\n    });\n\n    list.appendChild(card);\n  });\n}\n\nfunction renderAppearance() {\n  document.getElementById('editAvatarPreview').src = currentUser.avatar;\n  document.getElementById('profileAvatarInput').value = currentUser.avatar;\n  document.getElementById('profileNameInput').value = currentUser.name;\n  document.getElementById('profileBioInput').value = currentUser.bio;\n  document.getElementById('profileFontSelect').value = currentUser.font || 'Inter';\n\n  // Highlight theme swatch\n  const swatches = document.querySelectorAll('.theme-card');\n  swatches.forEach(s => {\n    if (s.dataset.theme === currentUser.theme) {\n      s.classList.add('border-stone-900', 'bg-stone-50');\n      s.classList.remove('border-transparent');\n    } else {\n      s.classList.remove('border-stone-900', 'bg-stone-50');\n      s.classList.add('border-transparent');\n    }\n  });\n\n  // Highlight button corner\n  const btnOptions = document.querySelectorAll('.btn-corner-option');\n  btnOptions.forEach(b => {\n    if (b.dataset.style === currentUser.buttonStyle) {\n      b.classList.add('border-stone-900', 'bg-stone-50');\n      b.classList.remove('border-transparent');\n    } else {\n      b.classList.remove('border-stone-900', 'bg-stone-50');\n      b.classList.add('border-transparent');\n    }\n  });\n\n  // Background Image preview & inputs\n  updateBgImageUI();\n}\n\nfunction updateBgImageUI() {\n  const thumb = document.getElementById('bgImagePreviewThumb');\n  const emptyText = document.getElementById('bgImageEmptyText');\n  const removeBtn = document.getElementById('removeBgImageBtn');\n  const urlInput = document.getElementById('bgImageUrlInput');\n\n  if (currentUser.bgImage) {\n    thumb.src = currentUser.bgImage;\n    thumb.classList.remove('hidden');\n    emptyText.classList.add('hidden');\n    removeBtn.classList.remove('hidden');\n    if (!currentUser.bgImage.startsWith('data:')) {\n      urlInput.value = currentUser.bgImage;\n    } else {\n      urlInput.value = '';\n    }\n  } else {\n    thumb.src = '';\n    thumb.classList.add('hidden');\n    emptyText.classList.remove('hidden');\n    removeBtn.classList.add('hidden');\n    urlInput.value = '';\n  }\n}\n\nfunction renderSocials() {\n  const soc = currentUser.socials || {};\n  document.getElementById('soc_instagram').value = soc.instagram || '';\n  document.getElementById('soc_youtube').value = soc.youtube || '';\n  document.getElementById('soc_tiktok').value = soc.tiktok || '';\n  document.getElementById('soc_twitter').value = soc.twitter || '';\n  document.getElementById('soc_github').value = soc.github || '';\n  document.getElementById('soc_spotify').value = soc.spotify || '';\n  document.getElementById('soc_email').value = soc.email || '';\n  document.getElementById('soc_whatsapp').value = soc.whatsapp || '';\n\n  const isTop = currentUser.socialPlacement !== 'bottom';\n  updateSocialPositionUI(isTop);\n}\n\nfunction updateSocialPositionUI(isTop) {\n  const topBtn = document.getElementById('posTopBtn');\n  const bottomBtn = document.getElementById('posBottomBtn');\n  if (isTop) {\n    topBtn.className = 'px-3 py-1 rounded-full bg-white text-stone-900 shadow-sm';\n    bottomBtn.className = 'px-3 py-1 rounded-full text-stone-600';\n  } else {\n    bottomBtn.className = 'px-3 py-1 rounded-full bg-white text-stone-900 shadow-sm';\n    topBtn.className = 'px-3 py-1 rounded-full text-stone-600';\n  }\n}\n\nfunction renderAnalytics() {\n  if (!currentAnalytics) return;\n  document.getElementById('statViews').textContent = currentAnalytics.totalViews || 0;\n  document.getElementById('statClicks').textContent = currentAnalytics.totalClicks || 0;\n  document.getElementById('statCtr').textContent = `${currentAnalytics.ctr || 0}%`;\n\n  const list = document.getElementById('analyticsLinksList');\n  list.innerHTML = '';\n\n  const topLinks = currentAnalytics.links || [];\n  const maxClicks = Math.max(...topLinks.map(l => l.clicks || 0), 1);\n\n  topLinks.forEach(link => {\n    const pct = Math.round(((link.clicks || 0) / maxClicks) * 100);\n    const row = document.createElement('div');\n    row.className = 'space-y-1.5';\n    row.innerHTML = `\n      <div class=\"flex items-center justify-between text-xs font-bold\">\n        <span class=\"truncate max-w-[280px]\">${escapeHtml(link.title)}</span>\n        <span class=\"text-stone-500\">${link.clicks || 0} clicks</span>\n      </div>\n      <div class=\"w-full h-2.5 bg-stone-100 rounded-full overflow-hidden\">\n        <div class=\"h-full bg-stone-900 rounded-full transition-all duration-500\" style=\"width: ${pct}%\"></div>\n      </div>\n    `;\n    list.appendChild(row);\n  });\n}\n\n// -------------------------------------------------------------\n// Real-time Live Phone Mockup Sync\n// -------------------------------------------------------------\nfunction syncMockup() {\n  if (!currentUser) return;\n\n  const screen = document.getElementById('mockupScreen');\n  const avatar = document.getElementById('mockupAvatar');\n  const name = document.getElementById('mockupName');\n  const bio = document.getElementById('mockupBio');\n  const linksContainer = document.getElementById('mockupLinks');\n  const socTop = document.getElementById('mockupSocialsTop');\n  const socBottom = document.getElementById('mockupSocialsBottom');\n\n  // Screen theme\n  screen.className = `mockup-screen theme-${currentUser.theme || 'clean'} p-5 flex flex-col items-center pt-8`;\n  screen.style.fontFamily = currentUser.font || 'Inter';\n\n  if (currentUser.bgImage) {\n    screen.style.backgroundImage = `url(\"${currentUser.bgImage}\")`;\n    screen.style.backgroundSize = 'cover';\n    screen.style.backgroundPosition = 'center';\n    screen.style.backgroundRepeat = 'no-repeat';\n  } else {\n    screen.style.backgroundImage = '';\n  }\n\n  // Details\n  avatar.src = currentUser.avatar;\n  name.textContent = currentUser.name;\n  bio.textContent = currentUser.bio;\n\n  // Socials render\n  const socHtml = buildSocialsHtml(currentUser.socials);\n  if (currentUser.socialPlacement === 'bottom') {\n    socTop.innerHTML = '';\n    socTop.classList.add('hidden');\n    socBottom.innerHTML = socHtml;\n    socBottom.classList.remove('hidden');\n  } else {\n    socTop.innerHTML = socHtml;\n    socTop.classList.remove('hidden');\n    socBottom.innerHTML = '';\n    socBottom.classList.add('hidden');\n  }\n\n  // Links render\n  linksContainer.innerHTML = '';\n  const activeLinks = currentLinks.filter(l => l.active);\n\n  activeLinks.forEach(link => {\n    const btn = document.createElement('a');\n    btn.href = link.url;\n    btn.target = '_blank';\n    btn.className = `bio-btn block w-full py-3 px-4 text-center text-xs font-bold transition flex items-center justify-between btn-style-${currentUser.buttonStyle || 'rounded'}`;\n\n    const iconEmoji = ICON_MAP[link.icon] || '🌐';\n\n    btn.innerHTML = `\n      <span class=\"text-base\">${iconEmoji}</span>\n      <span class=\"flex-1 text-center truncate mx-2\">${escapeHtml(link.title)}</span>\n      <span class=\"text-[10px] opacity-40\">↗</span>\n    `;\n    linksContainer.appendChild(btn);\n  });\n}\n\nfunction buildSocialsHtml(socials) {\n  if (!socials) return '';\n  const icons = [];\n  if (socials.instagram) icons.push(`<span>📷</span>`);\n  if (socials.youtube) icons.push(`<span>▶️</span>`);\n  if (socials.tiktok) icons.push(`<span>🎵</span>`);\n  if (socials.twitter) icons.push(`<span>🐦</span>`);\n  if (socials.github) icons.push(`<span>💻</span>`);\n  if (socials.spotify) icons.push(`<span>🎧</span>`);\n  if (socials.email) icons.push(`<span>✉️</span>`);\n  if (socials.whatsapp) icons.push(`<span>💬</span>`);\n  return icons.join('');\n}\n\n// -------------------------------------------------------------\n// Form Listeners & Operations\n// -------------------------------------------------------------\nfunction initFormListeners() {\n  // Add Link\n  const showBtn = document.getElementById('showAddLinkFormBtn');\n  const form = document.getElementById('addLinkForm');\n  const cancelBtn = document.getElementById('cancelAddLinkBtn');\n\n  showBtn.onclick = () => form.classList.toggle('hidden');\n  cancelBtn.onclick = () => form.classList.add('hidden');\n\n  form.onsubmit = async (e) => {\n    e.preventDefault();\n    const title = document.getElementById('newLinkTitle').value.trim();\n    const url = document.getElementById('newLinkUrl').value.trim();\n    const icon = document.getElementById('newLinkIcon').value;\n\n    const res = await fetch('/api/user/links', {\n      method: 'POST',\n      headers: { 'Content-Type': 'application/json' },\n      body: JSON.stringify({ title, url, icon, active: true })\n    });\n    const data = await res.json();\n    if (data.success) {\n      currentLinks.push(data.link);\n      renderLinks();\n      syncMockup();\n      form.reset();\n      form.classList.add('hidden');\n    }\n  };\n\n  // Appearance Inputs\n  document.getElementById('profileAvatarInput').oninput = (e) => {\n    currentUser.avatar = e.target.value.trim() || PRESET_AVATARS[0];\n    document.getElementById('editAvatarPreview').src = currentUser.avatar;\n    syncMockup();\n  };\n  document.getElementById('profileNameInput').oninput = (e) => {\n    currentUser.name = e.target.value.trim();\n    syncMockup();\n  };\n  document.getElementById('profileBioInput').oninput = (e) => {\n    currentUser.bio = e.target.value.trim();\n    syncMockup();\n  };\n  document.getElementById('profileFontSelect').onchange = (e) => {\n    currentUser.font = e.target.value;\n    syncMockup();\n  };\n\n  // Theme selector\n  document.querySelectorAll('.theme-card').forEach(card => {\n    card.onclick = () => {\n      currentUser.theme = card.dataset.theme;\n      renderAppearance();\n      syncMockup();\n    };\n  });\n\n  // Button corner style selector\n  document.querySelectorAll('.btn-corner-option').forEach(opt => {\n    opt.onclick = () => {\n      currentUser.buttonStyle = opt.dataset.style;\n      renderAppearance();\n      syncMockup();\n    };\n  });\n\n  // Background image file upload\n  const bgFileInput = document.getElementById('bgImageFileInput');\n  if (bgFileInput) {\n    bgFileInput.addEventListener('change', (e) => {\n      const file = e.target.files[0];\n      if (!file) return;\n      if (file.size > 10 * 1024 * 1024) {\n        alert('File size exceeds 10MB limit.');\n        return;\n      }\n      const reader = new FileReader();\n      reader.onload = (loadEvt) => {\n        currentUser.bgImage = loadEvt.target.result;\n        updateBgImageUI();\n        syncMockup();\n      };\n      reader.readAsDataURL(file);\n    });\n  }\n\n  // Background image direct URL\n  const bgUrlInput = document.getElementById('bgImageUrlInput');\n  if (bgUrlInput) {\n    bgUrlInput.addEventListener('input', (e) => {\n      currentUser.bgImage = e.target.value.trim() || null;\n      updateBgImageUI();\n      syncMockup();\n    });\n  }\n\n  // Remove background image\n  const removeBgBtn = document.getElementById('removeBgImageBtn');\n  if (removeBgBtn) {\n    removeBgBtn.addEventListener('click', () => {\n      currentUser.bgImage = null;\n      if (bgFileInput) bgFileInput.value = '';\n      if (bgUrlInput) bgUrlInput.value = '';\n      updateBgImageUI();\n      syncMockup();\n    });\n  }\n\n  // Save Appearance\n  document.getElementById('saveAppearanceBtn').onclick = async () => {\n    const saveBtn = document.getElementById('saveAppearanceBtn');\n    saveBtn.textContent = 'Saving...';\n    try {\n      await fetch('/api/user/profile', {\n        method: 'PUT',\n        headers: { 'Content-Type': 'application/json' },\n        body: JSON.stringify({\n          avatar: currentUser.avatar,\n          name: currentUser.name,\n          bio: currentUser.bio,\n          theme: currentUser.theme,\n          buttonStyle: currentUser.buttonStyle,\n          font: currentUser.font,\n          bgImage: currentUser.bgImage || null\n        })\n      });\n      saveBtn.textContent = 'Saved!';\n      setTimeout(() => (saveBtn.textContent = 'Save Appearance'), 1500);\n    } catch (err) {\n      alert('Failed to save appearance');\n      saveBtn.textContent = 'Save Appearance';\n    }\n  };\n\n  // Social Placement\n  document.getElementById('posTopBtn').onclick = () => {\n    currentUser.socialPlacement = 'top';\n    updateSocialPositionUI(true);\n    syncMockup();\n  };\n  document.getElementById('posBottomBtn').onclick = () => {\n    currentUser.socialPlacement = 'bottom';\n    updateSocialPositionUI(false);\n    syncMockup();\n  };\n\n  // Socials Form Save\n  document.getElementById('socialsForm').onsubmit = async (e) => {\n    e.preventDefault();\n    const socials = {\n      instagram: document.getElementById('soc_instagram').value.trim(),\n      youtube: document.getElementById('soc_youtube').value.trim(),\n      tiktok: document.getElementById('soc_tiktok').value.trim(),\n      twitter: document.getElementById('soc_twitter').value.trim(),\n      github: document.getElementById('soc_github').value.trim(),\n      spotify: document.getElementById('soc_spotify').value.trim(),\n      email: document.getElementById('soc_email').value.trim(),\n      whatsapp: document.getElementById('soc_whatsapp').value.trim()\n    };\n    currentUser.socials = socials;\n    syncMockup();\n\n    await fetch('/api/user/profile', {\n      method: 'PUT',\n      headers: { 'Content-Type': 'application/json' },\n      body: JSON.stringify({\n        socials,\n        socialPlacement: currentUser.socialPlacement\n      })\n    });\n    alert('Social profile links updated successfully!');\n  };\n}\n\n// -------------------------------------------------------------\n// Link Operations (Move, Delete)\n// -------------------------------------------------------------\nasync function moveLink(index, delta) {\n  const newIndex = index + delta;\n  if (newIndex < 0 || newIndex >= currentLinks.length) return;\n\n  const temp = currentLinks[index];\n  currentLinks[index] = currentLinks[newIndex];\n  currentLinks[newIndex] = temp;\n\n  renderLinks();\n  syncMockup();\n\n  const orderedIds = currentLinks.map(l => l.id);\n  await fetch('/api/user/links-reorder', {\n    method: 'PUT',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify({ orderedIds })\n  });\n}\n\nasync function deleteLink(id) {\n  if (!confirm('Are you sure you want to remove this link?')) return;\n  currentLinks = currentLinks.filter(l => l.id !== id);\n  renderLinks();\n  syncMockup();\n\n  await fetch(`/api/user/links/${id}`, { method: 'DELETE' });\n}\n\n// -------------------------------------------------------------\n// Canvas QR Code Generator (Pure Vanilla JS Canvas Algorithm)\n// -------------------------------------------------------------\nfunction drawQRCode() {\n  const canvas = document.getElementById('qrCodeCanvas');\n  if (!canvas || !currentUser) return;\n  const ctx = canvas.getContext('2d');\n  const size = canvas.width;\n  const url = `${window.location.origin}/${currentUser.username}`;\n\n  ctx.fillStyle = '#ffffff';\n  ctx.fillRect(0, 0, size, size);\n\n  // Generate deterministic QR-like matrix pattern based on url hash\n  let hash = 0;\n  for (let i = 0; i < url.length; i++) {\n    hash = (hash << 5) - hash + url.charCodeAt(i);\n    hash |= 0;\n  }\n\n  const cells = 25;\n  const cellSize = size / cells;\n  ctx.fillStyle = '#1e2321';\n\n  // Corner Finders\n  drawCornerFinder(ctx, 0, 0, cellSize);\n  drawCornerFinder(ctx, cells - 7, 0, cellSize);\n  drawCornerFinder(ctx, 0, cells - 7, cellSize);\n\n  // Pattern data\n  for (let r = 0; r < cells; r++) {\n    for (let c = 0; c < cells; c++) {\n      // Skip corner finder zones\n      if (\n        (r < 8 && c < 8) ||\n        (r < 8 && c >= cells - 8) ||\n        (r >= cells - 8 && c < 8)\n      ) {\n        continue;\n      }\n      const val = Math.sin(r * 11 + c * 17 + hash) * 10000;\n      if (val - Math.floor(val) > 0.48) {\n        ctx.fillRect(c * cellSize, r * cellSize, cellSize - 0.5, cellSize - 0.5);\n      }\n    }\n  }\n\n  // Center Mini Palm Tree Badge\n  const centerSize = cellSize * 5;\n  const centerOffset = (size - centerSize) / 2;\n  ctx.fillStyle = '#d2e823';\n  ctx.beginPath();\n  ctx.arc(size / 2, size / 2, centerSize / 2, 0, Math.PI * 2);\n  ctx.fill();\n  ctx.fillStyle = '#1e2321';\n  ctx.font = `${centerSize * 0.5}px sans-serif`;\n  ctx.textAlign = 'center';\n  ctx.textBaseline = 'middle';\n  ctx.fillText('🌴', size / 2, size / 2);\n\n  // Download listener\n  document.getElementById('downloadQrBtn').onclick = () => {\n    const link = document.createElement('a');\n    link.download = `linktree-${currentUser.username}-qr.png`;\n    link.href = canvas.toDataURL('image/png');\n    link.click();\n  };\n}\n\nfunction drawCornerFinder(ctx, startX, startY, cellSize) {\n  ctx.fillRect(startX * cellSize, startY * cellSize, 7 * cellSize, 7 * cellSize);\n  ctx.fillStyle = '#ffffff';\n  ctx.fillRect((startX + 1) * cellSize, (startY + 1) * cellSize, 5 * cellSize, 5 * cellSize);\n  ctx.fillStyle = '#1e2321';\n  ctx.fillRect((startX + 2) * cellSize, (startY + 2) * cellSize, 3 * cellSize, 3 * cellSize);\n}\n\nfunction escapeHtml(str) {\n  if (!str) return '';\n  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;');\n}\n",
  "profileJs": "// public/js/profile.js - Public Bio Profile Page Logic\n\nconst ICON_MAP = {\n  globe: '🌐',\n  'shopping-bag': '🛍️',\n  music: '🎵',\n  youtube: '📺',\n  palette: '🎨',\n  coffee: '☕',\n  mail: '📬',\n  ticket: '🎟️'\n};\n\ndocument.addEventListener('DOMContentLoaded', async () => {\n  const pathParts = window.location.pathname.split('/').filter(Boolean);\n  const username = pathParts[0];\n\n  if (!username) return;\n\n  try {\n    const res = await fetch(`/api/public/${encodeURIComponent(username)}`);\n    if (!res.ok) {\n      window.location.href = '/';\n      return;\n    }\n    const data = await res.json();\n    renderProfile(data.user, data.links);\n    initShareModal(data.user);\n  } catch (err) {\n    console.error('Failed to load profile:', err);\n  }\n});\n\nfunction renderProfile(user, links) {\n  // Page Title\n  document.title = `${user.name} (@${user.username}) | Linktree`;\n\n  // Apply Theme\n  const body = document.getElementById('profileBody');\n  body.className = `theme-${user.theme || 'clean'} min-h-screen transition-colors duration-300 antialiased flex flex-col justify-between py-10 px-4`;\n  body.style.fontFamily = user.font || 'Inter';\n\n  if (user.bgImage) {\n    body.style.backgroundImage = `url(\"${user.bgImage}\")`;\n    body.style.backgroundSize = 'cover';\n    body.style.backgroundPosition = 'center';\n    body.style.backgroundAttachment = 'fixed';\n    body.style.backgroundRepeat = 'no-repeat';\n  } else {\n    body.style.backgroundImage = '';\n  }\n\n  // Details\n  document.getElementById('creatorAvatar').src = user.avatar;\n  document.getElementById('creatorName').firstElementChild.textContent = user.name;\n  if (user.verified) {\n    document.getElementById('verifiedBadge').classList.remove('hidden');\n  }\n  document.getElementById('creatorBio').textContent = user.bio;\n\n  // Socials\n  const socHtml = buildSocialsHtml(user.socials);\n  const socTop = document.getElementById('socialsTop');\n  const socBottom = document.getElementById('socialsBottom');\n\n  if (user.socialPlacement === 'bottom') {\n    socBottom.innerHTML = socHtml;\n    socBottom.classList.remove('hidden');\n  } else {\n    socTop.innerHTML = socHtml;\n  }\n\n  // Links\n  const list = document.getElementById('linksList');\n  list.innerHTML = '';\n\n  links.forEach(link => {\n    const a = document.createElement('a');\n    // Direct through click tracking route /r/:linkId\n    a.href = `/r/${link.id}`;\n    a.target = '_blank';\n    a.rel = 'noopener noreferrer';\n    a.className = `bio-btn block w-full py-4 px-6 text-sm font-bold transition flex items-center justify-between btn-style-${user.buttonStyle || 'rounded'} shadow-sm`;\n\n    const iconEmoji = ICON_MAP[link.icon] || '🌐';\n\n    a.innerHTML = `\n      <span class=\"text-xl w-6 text-left\">${iconEmoji}</span>\n      <span class=\"flex-1 text-center font-bold px-2\">${escapeHtml(link.title)}</span>\n      <span class=\"w-6 text-right text-xs opacity-50\">↗</span>\n    `;\n\n    list.appendChild(a);\n  });\n}\n\nfunction buildSocialsHtml(socials) {\n  if (!socials) return '';\n  const items = [];\n  if (socials.instagram) items.push(`<a href=\"${socials.instagram}\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"opacity-80 hover:opacity-100 hover:scale-110 transition\">📷</a>`);\n  if (socials.youtube) items.push(`<a href=\"${socials.youtube}\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"opacity-80 hover:opacity-100 hover:scale-110 transition\">▶️</a>`);\n  if (socials.tiktok) items.push(`<a href=\"${socials.tiktok}\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"opacity-80 hover:opacity-100 hover:scale-110 transition\">🎵</a>`);\n  if (socials.twitter) items.push(`<a href=\"${socials.twitter}\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"opacity-80 hover:opacity-100 hover:scale-110 transition\">🐦</a>`);\n  if (socials.github) items.push(`<a href=\"${socials.github}\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"opacity-80 hover:opacity-100 hover:scale-110 transition\">💻</a>`);\n  if (socials.spotify) items.push(`<a href=\"${socials.spotify}\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"opacity-80 hover:opacity-100 hover:scale-110 transition\">🎧</a>`);\n  if (socials.email) items.push(`<a href=\"mailto:${socials.email}\" class=\"opacity-80 hover:opacity-100 hover:scale-110 transition\">✉️</a>`);\n  if (socials.whatsapp) items.push(`<a href=\"${socials.whatsapp}\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"opacity-80 hover:opacity-100 hover:scale-110 transition\">💬</a>`);\n  return items.join('');\n}\n\n// -------------------------------------------------------------\n// Share Modal & QR Code\n// -------------------------------------------------------------\nfunction initShareModal(user) {\n  const modal = document.getElementById('shareModal');\n  const openBtn = document.getElementById('openShareModalBtn');\n  const closeBtn = document.getElementById('closeShareModalBtn');\n  const copyBtn = document.getElementById('copyProfileLinkBtn');\n  const profileUrl = window.location.href;\n\n  if (openBtn && modal) {\n    openBtn.onclick = () => {\n      modal.classList.remove('hidden');\n      drawProfileQR(user.username);\n    };\n  }\n  if (closeBtn && modal) {\n    closeBtn.onclick = () => modal.classList.add('hidden');\n  }\n  if (modal) {\n    modal.onclick = (e) => {\n      if (e.target === modal) modal.classList.add('hidden');\n    };\n  }\n\n  copyBtn.onclick = () => {\n    navigator.clipboard.writeText(profileUrl);\n    copyBtn.textContent = 'Copied to Clipboard!';\n    setTimeout(() => (copyBtn.textContent = 'Copy Link'), 2000);\n  };\n\n  // Social share intent links\n  const title = encodeURIComponent(`Check out ${user.name}'s Linktree`);\n  const encodedUrl = encodeURIComponent(profileUrl);\n  document.getElementById('shareTwitter').href = `https://twitter.com/intent/tweet?text=${title}&url=${encodedUrl}`;\n  document.getElementById('shareFacebook').href = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;\n  document.getElementById('shareWhatsApp').href = `https://api.whatsapp.com/send?text=${title}%20${encodedUrl}`;\n  document.getElementById('shareEmail').href = `mailto:?subject=${title}&body=${encodedUrl}`;\n}\n\nfunction drawProfileQR(username) {\n  const canvas = document.getElementById('profileQrCanvas');\n  if (!canvas) return;\n  const ctx = canvas.getContext('2d');\n  const size = canvas.width;\n  const url = window.location.href;\n\n  ctx.fillStyle = '#ffffff';\n  ctx.fillRect(0, 0, size, size);\n\n  let hash = 0;\n  for (let i = 0; i < url.length; i++) {\n    hash = (hash << 5) - hash + url.charCodeAt(i);\n    hash |= 0;\n  }\n\n  const cells = 25;\n  const cellSize = size / cells;\n  ctx.fillStyle = '#1e2321';\n\n  // Corner finders\n  drawCorner(ctx, 0, 0, cellSize);\n  drawCorner(ctx, cells - 7, 0, cellSize);\n  drawCorner(ctx, 0, cells - 7, cellSize);\n\n  // Data cells\n  for (let r = 0; r < cells; r++) {\n    for (let c = 0; c < cells; c++) {\n      if ((r < 8 && c < 8) || (r < 8 && c >= cells - 8) || (r >= cells - 8 && c < 8)) {\n        continue;\n      }\n      const val = Math.sin(r * 11 + c * 17 + hash) * 10000;\n      if (val - Math.floor(val) > 0.48) {\n        ctx.fillRect(c * cellSize, r * cellSize, cellSize - 0.5, cellSize - 0.5);\n      }\n    }\n  }\n\n  // Center Badge\n  const centerSize = cellSize * 5;\n  ctx.fillStyle = '#d2e823';\n  ctx.beginPath();\n  ctx.arc(size / 2, size / 2, centerSize / 2, 0, Math.PI * 2);\n  ctx.fill();\n  ctx.fillStyle = '#1e2321';\n  ctx.font = `${centerSize * 0.5}px sans-serif`;\n  ctx.textAlign = 'center';\n  ctx.textBaseline = 'middle';\n  ctx.fillText('🌴', size / 2, size / 2);\n\n  document.getElementById('downloadProfileQrBtn').onclick = () => {\n    const link = document.createElement('a');\n    link.download = `linktree-${username}-qr.png`;\n    link.href = canvas.toDataURL('image/png');\n    link.click();\n  };\n}\n\nfunction drawCorner(ctx, startX, startY, cellSize) {\n  ctx.fillRect(startX * cellSize, startY * cellSize, 7 * cellSize, 7 * cellSize);\n  ctx.fillStyle = '#ffffff';\n  ctx.fillRect((startX + 1) * cellSize, (startY + 1) * cellSize, 5 * cellSize, 5 * cellSize);\n  ctx.fillStyle = '#1e2321';\n  ctx.fillRect((startX + 2) * cellSize, (startY + 2) * cellSize, 3 * cellSize, 3 * cellSize);\n}\n\nfunction escapeHtml(str) {\n  if (!str) return '';\n  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;');\n}\n"
};

// -------------------------------------------------------------
// Embedded Database Engine
// -------------------------------------------------------------
const DB_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DB_DIR)) {
  try { fs.mkdirSync(DB_DIR, { recursive: true }); } catch (e) {}
}
const DB_FILE = path.join(DB_DIR, 'database.json');

function hashPassword(password, salt) {
  if (!salt) {
    salt = crypto.randomBytes(16).toString('hex');
  }
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

function verifyPassword(password, storedHash, salt) {
  const { hash } = hashPassword(password, salt);
  return hash === storedHash;
}

function getDefaultData() {
  const alexAuth = hashPassword('password123');
  const sarahAuth = hashPassword('password123');
  const demoAuth = hashPassword('demo123');

  return {
    users: [
      {
        id: 'u_alex',
        username: 'alex',
        email: 'alex@example.com',
        passwordHash: alexAuth.hash,
        passwordSalt: alexAuth.salt,
        name: 'Alex Rivera',
        bio: 'Tech enthusiast, UI designer & coffee addict ☕ Creating sleek digital experiences.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        verified: true,
        theme: 'charcoal',
        buttonStyle: 'rounded',
        font: 'Inter',
        socialPlacement: 'top',
        socials: {
          instagram: 'https://instagram.com',
          youtube: 'https://youtube.com',
          twitter: 'https://x.com',
          github: 'https://github.com',
          spotify: 'https://spotify.com',
          email: 'alex@example.com'
        },
        views: 1420,
        createdAt: new Date().toISOString()
      },
      {
        id: 'u_sarah',
        username: 'sarah',
        email: 'sarah@example.com',
        passwordHash: sarahAuth.hash,
        passwordSalt: sarahAuth.salt,
        name: 'Sarah Chen ✨',
        bio: 'Indie Musician & Visual Artist. New single "Midnight Rain" out everywhere now! 🎵',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
        verified: true,
        theme: 'sunset',
        buttonStyle: 'soft',
        font: 'Poppins',
        socialPlacement: 'top',
        socials: {
          spotify: 'https://spotify.com',
          youtube: 'https://youtube.com',
          tiktok: 'https://tiktok.com',
          instagram: 'https://instagram.com'
        },
        views: 890,
        createdAt: new Date().toISOString()
      },
      {
        id: 'u_demo',
        username: 'demo',
        email: 'demo@example.com',
        passwordHash: demoAuth.hash,
        passwordSalt: demoAuth.salt,
        name: 'Demo Creator',
        bio: 'Welcome to my Linktree! Everything you need in one clean link.',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
        verified: false,
        theme: 'clean',
        buttonStyle: 'shadow',
        font: 'Inter',
        socialPlacement: 'bottom',
        socials: {
          twitter: 'https://x.com',
          github: 'https://github.com'
        },
        views: 310,
        createdAt: new Date().toISOString()
      }
    ],
    links: [
      {
        id: 'l_alex_1',
        userId: 'u_alex',
        title: '🚀 Check out my New Portfolio 2026',
        url: 'https://dribbble.com',
        icon: 'folder',
        active: true,
        order: 0,
        clicks: 421,
        createdAt: new Date().toISOString()
      },
      {
        id: 'l_alex_2',
        userId: 'u_alex',
        title: '📺 Latest YouTube: How to Build Clean Web Apps',
        url: 'https://youtube.com',
        icon: 'youtube',
        active: true,
        order: 1,
        clicks: 310,
        createdAt: new Date().toISOString()
      },
      {
        id: 'l_alex_3',
        userId: 'u_alex',
        title: '🎨 Figma Design UI Kit (Free Download)',
        url: 'https://figma.com',
        icon: 'palette',
        active: true,
        order: 2,
        clicks: 580,
        createdAt: new Date().toISOString()
      },
      {
        id: 'l_alex_4',
        userId: 'u_alex',
        title: '☕ Support my work on Buy Me a Coffee',
        url: 'https://buymeacoffee.com',
        icon: 'coffee',
        active: true,
        order: 3,
        clicks: 110,
        createdAt: new Date().toISOString()
      },
      {
        id: 'l_sarah_1',
        userId: 'u_sarah',
        title: '🎧 Stream "Midnight Rain" on Spotify',
        url: 'https://spotify.com',
        icon: 'music',
        active: true,
        order: 0,
        clicks: 340,
        createdAt: new Date().toISOString()
      },
      {
        id: 'l_sarah_2',
        userId: 'u_sarah',
        title: '🎟️ Summer Tour 2026 - Tickets & VIP Passes',
        url: 'https://ticketmaster.com',
        icon: 'ticket',
        active: true,
        order: 1,
        clicks: 215,
        createdAt: new Date().toISOString()
      },
      {
        id: 'l_sarah_3',
        userId: 'u_sarah',
        title: '👕 Official Merchandise Store',
        url: 'https://shopify.com',
        icon: 'shopping-bag',
        active: true,
        order: 2,
        clicks: 180,
        createdAt: new Date().toISOString()
      },
      {
        id: 'l_demo_1',
        userId: 'u_demo',
        title: '🌐 Visit My Official Website',
        url: 'https://example.com',
        icon: 'globe',
        active: true,
        order: 0,
        clicks: 95,
        createdAt: new Date().toISOString()
      },
      {
        id: 'l_demo_2',
        userId: 'u_demo',
        title: '📬 Subscribe to Weekly Newsletter',
        url: 'https://substack.com',
        icon: 'mail',
        active: true,
        order: 1,
        clicks: 65,
        createdAt: new Date().toISOString()
      }
    ],
    analytics: [
      { type: 'view', userId: 'u_alex', timestamp: new Date(Date.now() - 86400000 * 3).toISOString() },
      { type: 'view', userId: 'u_alex', timestamp: new Date(Date.now() - 86400000 * 2).toISOString() },
      { type: 'view', userId: 'u_alex', timestamp: new Date(Date.now() - 86400000 * 1).toISOString() },
      { type: 'view', userId: 'u_alex', timestamp: new Date().toISOString() }
    ]
  };
}

class Database {
  constructor() {
    this.memoryData = null;
    this.init();
  }

  init() {
    try {
      if (!fs.existsSync(DB_FILE)) {
        const initial = getDefaultData();
        fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
        this.memoryData = initial;
      }
    } catch (err) {
      this.memoryData = getDefaultData();
    }
  }

  read() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const content = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(content);
      }
    } catch (err) {}
    if (!this.memoryData) {
      this.memoryData = getDefaultData();
    }
    return this.memoryData;
  }

  write(data) {
    this.memoryData = data;
    try {
      const tempPath = DB_FILE + '.tmp';
      fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(tempPath, DB_FILE);
    } catch (err) {}
  }

  getUserByUsername(username) {
    if (!username) return null;
    const db = this.read();
    return db.users.find(u => u.username.toLowerCase() === username.toLowerCase()) || null;
  }

  getUserById(id) {
    const db = this.read();
    return db.users.find(u => u.id === id) || null;
  }

  getUserByEmail(email) {
    if (!email) return null;
    const db = this.read();
    return db.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  createUser({ username, email, password, name }) {
    const db = this.read();
    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
    
    if (db.users.some(u => u.username.toLowerCase() === cleanUsername)) {
      throw new Error('Username is already taken');
    }
    if (db.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('Email is already registered');
    }

    const { hash, salt } = hashPassword(password);
    const newUser = {
      id: 'u_' + crypto.randomBytes(6).toString('hex'),
      username: cleanUsername,
      email: email.trim().toLowerCase(),
      passwordHash: hash,
      passwordSalt: salt,
      name: name || cleanUsername,
      bio: 'Welcome to my official Linktree! Check out my links below.',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      verified: false,
      theme: 'clean',
      buttonStyle: 'rounded',
      font: 'Inter',
      socialPlacement: 'top',
      socials: {},
      views: 0,
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);

    db.links.push({
      id: 'l_' + crypto.randomBytes(6).toString('hex'),
      userId: newUser.id,
      title: '🌟 Welcome to my first Link!',
      url: 'https://google.com',
      icon: 'globe',
      active: true,
      order: 0,
      clicks: 0,
      createdAt: new Date().toISOString()
    });

    this.write(db);
    return newUser;
  }

  updateUserProfile(userId, updates) {
    const db = this.read();
    const index = db.users.findIndex(u => u.id === userId);
    if (index === -1) throw new Error('User not found');

    const allowedFields = [
      'name', 'bio', 'avatar', 'theme', 'buttonStyle',
      'font', 'socialPlacement', 'socials', 'bgImage', 'customBgColor',
      'customTextColor', 'customBtnColor', 'customBtnTextColor'
    ];

    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        db.users[index][field] = updates[field];
      }
    });

    this.write(db);
    return db.users[index];
  }

  getUserLinks(userId) {
    const db = this.read();
    return db.links
      .filter(l => l.userId === userId)
      .sort((a, b) => a.order - b.order);
  }

  createLink(userId, { title, url, icon = 'globe', active = true }) {
    const db = this.read();
    const userLinks = db.links.filter(l => l.userId === userId);
    const newLink = {
      id: 'l_' + crypto.randomBytes(6).toString('hex'),
      userId,
      title: title || 'My Link',
      url: url || 'https://linktr.ee',
      icon,
      active: active !== false,
      order: userLinks.length,
      clicks: 0,
      createdAt: new Date().toISOString()
    };
    db.links.push(newLink);
    this.write(db);
    return newLink;
  }

  updateLink(userId, linkId, updates) {
    const db = this.read();
    const link = db.links.find(l => l.id === linkId && l.userId === userId);
    if (!link) throw new Error('Link not found');

    if (updates.title !== undefined) link.title = updates.title;
    if (updates.url !== undefined) link.url = updates.url;
    if (updates.icon !== undefined) link.icon = updates.icon;
    if (updates.active !== undefined) link.active = !!updates.active;
    if (updates.order !== undefined) link.order = Number(updates.order);

    this.write(db);
    return link;
  }

  deleteLink(userId, linkId) {
    const db = this.read();
    const index = db.links.findIndex(l => l.id === linkId && l.userId === userId);
    if (index === -1) throw new Error('Link not found');
    db.links.splice(index, 1);
    this.write(db);
    return true;
  }

  reorderLinks(userId, orderedIds) {
    const db = this.read();
    orderedIds.forEach((id, newOrder) => {
      const link = db.links.find(l => l.id === id && l.userId === userId);
      if (link) {
        link.order = newOrder;
      }
    });
    this.write(db);
    return this.getUserLinks(userId);
  }

  trackProfileView(userId) {
    const db = this.read();
    const user = db.users.find(u => u.id === userId);
    if (user) {
      user.views = (user.views || 0) + 1;
      db.analytics.push({
        type: 'view',
        userId,
        timestamp: new Date().toISOString()
      });
      if (db.analytics.length > 5000) {
        db.analytics = db.analytics.slice(-5000);
      }
      this.write(db);
    }
  }

  trackLinkClick(linkId) {
    const db = this.read();
    const link = db.links.find(l => l.id === linkId);
    if (link) {
      link.clicks = (link.clicks || 0) + 1;
      db.analytics.push({
        type: 'click',
        linkId,
        userId: link.userId,
        timestamp: new Date().toISOString()
      });
      if (db.analytics.length > 5000) {
        db.analytics = db.analytics.slice(-5000);
      }
      this.write(db);
      return link.url;
    }
    return null;
  }

  getAnalytics(userId) {
    const db = this.read();
    const user = db.users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');

    const userLinks = db.links.filter(l => l.userId === userId);
    const totalClicks = userLinks.reduce((acc, l) => acc + (l.clicks || 0), 0);
    const totalViews = user.views || 0;
    const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : 0;

    const now = Date.now();
    const dayStats = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now - i * 86400000);
      const key = d.toISOString().split('T')[0];
      dayStats[key] = { date: key, views: 0, clicks: 0 };
    }

    db.analytics.forEach(event => {
      if (event.userId === userId && event.timestamp) {
        const key = event.timestamp.split('T')[0];
        if (dayStats[key]) {
          if (event.type === 'view') dayStats[key].views++;
          if (event.type === 'click') dayStats[key].clicks++;
        }
      }
    });

    return {
      totalViews,
      totalClicks,
      ctr,
      links: userLinks.sort((a, b) => (b.clicks || 0) - (a.clicks || 0)),
      dailyActivity: Object.values(dayStats)
    };
  }
}

const db = new Database();

// -------------------------------------------------------------
// Express Server Setup
// -------------------------------------------------------------
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb', extended: true }));
app.use(cookieParser('linktree_secret_key_2026'));
app.use(express.static(path.join(__dirname, 'public')));

function authMiddleware(req, res, next) {
  const userId = req.signedCookies.userId;
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: Please login first' });
  }
  const user = db.getUserById(userId);
  if (!user) {
    res.clearCookie('userId');
    return res.status(401).json({ error: 'User session expired' });
  }
  req.user = user;
  next();
}

function sendHtmlView(res, key, localPath) {
  const fullPath = path.join(__dirname, 'views', localPath);
  if (fs.existsSync(fullPath)) {
    return res.sendFile(fullPath);
  }
  if (BUNDLE[key]) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.send(BUNDLE[key]);
  }
  res.status(404).send('View not found');
}

// Static Assets Fallback Routes (If public folder is not uploaded)
app.get('/css/style.css', (req, res) => {
  const fullPath = path.join(__dirname, 'public', 'css', 'style.css');
  if (fs.existsSync(fullPath)) return res.sendFile(fullPath);
  res.setHeader('Content-Type', 'text/css; charset=utf-8');
  res.send(BUNDLE.css);
});

app.get('/js/admin.js', (req, res) => {
  const fullPath = path.join(__dirname, 'public', 'js', 'admin.js');
  if (fs.existsSync(fullPath)) return res.sendFile(fullPath);
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  res.send(BUNDLE.adminJs);
});

app.get('/js/profile.js', (req, res) => {
  const fullPath = path.join(__dirname, 'public', 'js', 'profile.js');
  if (fs.existsSync(fullPath)) return res.sendFile(fullPath);
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  res.send(BUNDLE.profileJs);
});

// -------------------------------------------------------------
// HTML Page Routes
// -------------------------------------------------------------
app.get('/', (req, res) => {
  sendHtmlView(res, 'landing', 'landing.html');
});

app.get('/login', (req, res) => {
  if (req.signedCookies.userId) {
    return res.redirect('/admin');
  }
  sendHtmlView(res, 'login', 'login.html');
});

app.get('/signup', (req, res) => {
  if (req.signedCookies.userId) {
    return res.redirect('/admin');
  }
  sendHtmlView(res, 'signup', 'signup.html');
});

app.get('/admin', (req, res) => {
  if (!req.signedCookies.userId) {
    return res.redirect('/login');
  }
  sendHtmlView(res, 'admin', 'admin.html');
});

app.get('/logout', (req, res) => {
  res.clearCookie('userId');
  res.redirect('/login');
});

app.get('/r/:linkId', (req, res) => {
  const { linkId } = req.params;
  const targetUrl = db.trackLinkClick(linkId);
  if (targetUrl) {
    return res.redirect(targetUrl);
  }
  res.status(404).send('Link not found or inactive');
});

// -------------------------------------------------------------
// REST API Routes
// -------------------------------------------------------------
app.get('/api/check-username/:username', (req, res) => {
  const { username } = req.params;
  const user = db.getUserByUsername(username);
  res.json({ available: !user, username });
});

app.post('/api/auth/register', (req, res) => {
  try {
    const { username, email, password, name } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Please fill in all required fields' });
    }
    const user = db.createUser({ username, email, password, name });
    res.cookie('userId', user.id, { signed: true, httpOnly: true, maxAge: 86400000 * 14 });
    res.json({ success: true, user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/auth/login', (req, res) => {
  const { usernameOrEmail, password } = req.body;
  if (!usernameOrEmail || !password) {
    return res.status(400).json({ error: 'Please enter username/email and password' });
  }

  let user = db.getUserByUsername(usernameOrEmail);
  if (!user) {
    user = db.getUserByEmail(usernameOrEmail);
  }

  if (!user || !verifyPassword(password, user.passwordHash, user.passwordSalt)) {
    return res.status(401).json({ error: 'Invalid username/email or password' });
  }

  res.cookie('userId', user.id, { signed: true, httpOnly: true, maxAge: 86400000 * 14 });
  res.json({ success: true, user });
});

app.get('/api/user/me', authMiddleware, (req, res) => {
  const user = req.user;
  const links = db.getUserLinks(user.id);
  const analytics = db.getAnalytics(user.id);
  res.json({
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      bio: user.bio,
      avatar: user.avatar,
      verified: user.verified,
      theme: user.theme || 'clean',
      buttonStyle: user.buttonStyle || 'rounded',
      font: user.font || 'Inter',
      socialPlacement: user.socialPlacement || 'top',
      socials: user.socials || {},
      bgImage: user.bgImage || null,
      customBgColor: user.customBgColor,
      customTextColor: user.customTextColor,
      customBtnColor: user.customBtnColor,
      customBtnTextColor: user.customBtnTextColor
    },
    links,
    analytics
  });
});

app.put('/api/user/profile', authMiddleware, (req, res) => {
  try {
    const updated = db.updateUserProfile(req.user.id, req.body);
    res.json({ success: true, user: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/user/links', authMiddleware, (req, res) => {
  try {
    const { title, url, icon, active } = req.body;
    const link = db.createLink(req.user.id, { title, url, icon, active });
    res.json({ success: true, link });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/user/links/:id', authMiddleware, (req, res) => {
  try {
    const link = db.updateLink(req.user.id, req.params.id, req.body);
    res.json({ success: true, link });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/user/links/:id', authMiddleware, (req, res) => {
  try {
    db.deleteLink(req.user.id, req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/user/links-reorder', authMiddleware, (req, res) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ error: 'orderedIds must be an array' });
    }
    const links = db.reorderLinks(req.user.id, orderedIds);
    res.json({ success: true, links });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/user/analytics', authMiddleware, (req, res) => {
  try {
    const analytics = db.getAnalytics(req.user.id);
    res.json(analytics);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/public/:username', (req, res) => {
  const user = db.getUserByUsername(req.params.username);
  if (!user) {
    return res.status(404).json({ error: 'Creator not found' });
  }
  db.trackProfileView(user.id);

  const links = db.getUserLinks(user.id).filter(l => l.active);
  res.json({
    user: {
      username: user.username,
      name: user.name,
      bio: user.bio,
      avatar: user.avatar,
      verified: user.verified,
      theme: user.theme || 'clean',
      buttonStyle: user.buttonStyle || 'rounded',
      font: user.font || 'Inter',
      socialPlacement: user.socialPlacement || 'top',
      socials: user.socials || {},
      bgImage: user.bgImage || null,
      customBgColor: user.customBgColor,
      customTextColor: user.customTextColor,
      customBtnColor: user.customBtnColor,
      customBtnTextColor: user.customBtnTextColor
    },
    links
  });
});

app.get('/:username', (req, res, next) => {
  const reserved = ['login', 'signup', 'admin', 'logout', 'r', 'api', 'css', 'js', 'images'];
  if (reserved.includes(req.params.username.toLowerCase())) {
    return next();
  }
  const user = db.getUserByUsername(req.params.username);
  if (!user) {
    return res.status(404).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>User Not Found - Linktree</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
      </head>
      <body class="bg-[#f3f3f1] min-h-screen flex items-center justify-center font-['Plus_Jakarta_Sans'] p-6">
        <div class="text-center max-w-md bg-white p-8 rounded-3xl shadow-sm border border-stone-200">
          <div class="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🌴</div>
          <h1 class="text-2xl font-black text-stone-900 mb-2">The page you're looking for doesn't exist.</h1>
          <p class="text-stone-500 mb-6">Want this username? Claim <strong>@${req.params.username}</strong> now and create your own Linktree!</p>
          <a href="/signup?claim=${encodeURIComponent(req.params.username)}" class="inline-block w-full py-3.5 px-6 bg-[#d2e823] hover:bg-[#c0d619] text-stone-900 font-bold rounded-full transition shadow-sm">
            Claim this Linktree
          </a>
          <a href="/" class="inline-block mt-4 text-stone-500 text-sm font-semibold hover:underline">
            Go to Linktree Home
          </a>
        </div>
      </body>
      </html>
    `);
  }
  sendHtmlView(res, 'profile', 'profile.html');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Linktree Clone running at: http://localhost:${PORT}`);
});
