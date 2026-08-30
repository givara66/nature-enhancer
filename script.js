// ===== جلب عناصر الصفحة (نفسها ما تغيرت) =====
const fileInput = document.getElementById('fileInput');
const dropZone = document.getElementById('dropZone');
const originalImg = document.getElementById('originalPreview');
const enhancedImg = document.getElementById('enhancedPreview');
const enhanceBtn = document.getElementById('enhanceBtn');
const downloadBtn = document.getElementById('downloadBtn');
const strengthSlider = document.getElementById('strengthSlider');
const strengthValue = document.getElementById('strengthValue');

// ===== متغيرات لتخزين الصور =====
let currentImageFile = null;        // الملف الأصلي
let enhancedImageURL = null;       // رابط الصورة المحسّنة

// ===== تحديث قيمة شريط التحكم (كما هي) =====
strengthSlider.addEventListener('input', () => {
    strengthValue.textContent = strengthSlider.value;
});

// ===== دالة تحميل الصورة =====
function loadImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        currentImageFile = e.target.result;
        originalImg.src = currentImageFile;
        enhancedImg.src = '';
        enhanceBtn.disabled = false;
        downloadBtn.disabled = true;
        enhancedImageURL = null;
    };
    reader.readAsDataURL(file);
}

// ===== رفع الصورة بالضغط والسحب والإفلات (نفس الكود السابق) =====
dropZone.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
        loadImage(e.target.files[0]);
    }
});

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#2d4a2d';
    dropZone.style.background = '#f0f7f0';
});
dropZone.addEventListener('dragleave', () => {
    dropZone.style.borderColor = '#c5d5c5';
    dropZone.style.background = '#fafcfa';
});
dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#c5d5c5';
    dropZone.style.background = '#fafcfa';
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        loadImage(e.dataTransfer.files[0]);
    }
});

// ===== الدالة السحرية لتحسين الصورة بالذكاء الاصطناعي =====
enhanceBtn.addEventListener('click', async () => {
    if (!currentImageFile) return;

    enhanceBtn.disabled = true;
    enhanceBtn.textContent = '⏳ جاري تحميل نموذج الذكاء الاصطناعي...';

    try {
        // 1. تهيئة المحسن
        const upscaler = new Upscaler();
        
        // 2. الحصول على قوة التحسين من شريط التمرير
        const strength = parseFloat(strengthSlider.value);
        
        // 3. اختيار النموذج بناءً على قوة التحسين
        //    النماذج تتراوح بين السريع (Slim) والعالي الجودة (Thick) [citation:1][citation:10][citation:11]
        let modelConfig;
        if (strength <= 1.5) {
            modelConfig = 'slim';      // خفيف وسريع
        } else if (strength <= 2.5) {
            modelConfig = 'default';    // التوازن بين السرعة والجودة
        } else {
            modelConfig = 'thick';      // أعلى جودة، لكن أبطأ
        }
        
        enhanceBtn.textContent = `⏳ جاري تحسين الصورة باستخدام النموذج ${modelConfig}...`;
        
        // 4. تشغيل نموذج الذكاء الاصطناعي على الصورة
        //    'patchSize' يساعد في تثبيت الذاكرة ومنع تعطل المتصفح [citation:11]
        const resultImage = await upscaler.upscale(currentImageFile, {
            model: modelConfig,
            patchSize: 64,
            padding: 4
        });
        
        // 5. عرض النتيجة
        enhancedImageURL = resultImage;
        enhancedImg.src = enhancedImageURL;
        downloadBtn.disabled = false;
        
        enhanceBtn.textContent = '🎨 حسّن الصورة';
        enhanceBtn.disabled = false;
        
    } catch (error) {
        console.error('خطأ في تحسين الصورة:', error);
        alert('❌ حدث خطأ أثناء تحسين الصورة. قد يكون النموذج كبيراً جداً، حاول بقوة تحسين أقل.');
        enhanceBtn.textContent = '🎨 حسّن الصورة';
        enhanceBtn.disabled = false;
    }
});

// ===== زر تحميل الصورة المحسّنة (نفس الكود السابق) =====
downloadBtn.addEventListener('click', () => {
    if (!enhancedImageURL) return;
    const link = document.createElement('a');
    link.download = 'nature-ai-enhanced.jpg';
    link.href = enhancedImageURL;
    link.click();
});

// ===== رابط الانستغرام (عدله لحسابك) =====
document.getElementById('instaLink').href = 'https://instagram.com/اسم_حسابك';

console.log('🌿 معزّز صور الطبيعة بالذكاء الاصطناعي جاهز!');
