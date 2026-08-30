// ===== جلب العناصر (كما هي) =====
const fileInput = document.getElementById('fileInput');
const dropZone = document.getElementById('dropZone');
const originalImg = document.getElementById('originalPreview');
const enhancedImg = document.getElementById('enhancedPreview');
const enhanceBtn = document.getElementById('enhanceBtn');
const downloadBtn = document.getElementById('downloadBtn');
const strengthSlider = document.getElementById('strengthSlider');
const strengthValue = document.getElementById('strengthValue');

let currentImageFile = null;
let enhancedImageURL = null;

// ===== شريط التحكم =====
strengthSlider.addEventListener('input', () => {
    strengthValue.textContent = strengthSlider.value;
});

// ===== رفع الصورة (نفس الكود السابق) =====
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

dropZone.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) loadImage(e.target.files[0]);
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

// ===== زر التحسين بالذكاء الاصطناعي =====
enhanceBtn.addEventListener('click', async () => {
    if (!currentImageFile) return;

    enhanceBtn.disabled = true;
    enhanceBtn.textContent = '⏳ جاري تحميل نموذج الذكاء الاصطناعي...';

    try {
        const strength = parseFloat(strengthSlider.value);
        
        // اختيار النموذج المناسب حسب القوة
        let modelName;
        if (strength <= 1.5) {
            modelName = 'slim';  // خفيف وسريع
        } else if (strength <= 2.5) {
            modelName = 'default'; // متوسط
        } else {
            modelName = 'thick'; // أعلى جودة
        }

        enhanceBtn.textContent = `⏳ جاري التحسين بالنموذج ${modelName}...`;

        // إنشاء عنصر صورة للتحسين
        const img = new Image();
        img.src = currentImageFile;
        await img.decode();

        // استخدام UpscalerJS مع النموذج المختار
        const upscaler = new Upscaler();
        const result = await upscaler.upscale(img, {
            model: modelName,
            patchSize: 64,
            padding: 4
        });

        // عرض النتيجة
        enhancedImageURL = result;
        enhancedImg.src = enhancedImageURL;
        downloadBtn.disabled = false;

        enhanceBtn.textContent = '🎨 حسّن الصورة';
        enhanceBtn.disabled = false;

    } catch (error) {
        console.error('خطأ:', error);
        alert('❌ حدث خطأ أثناء تحسين الصورة. حاول بقوة أقل.');
        enhanceBtn.textContent = '🎨 حسّن الصورة';
        enhanceBtn.disabled = false;
    }
});

// ===== زر التحميل =====
downloadBtn.addEventListener('click', () => {
    if (!enhancedImageURL) return;
    const link = document.createElement('a');
    link.download = 'nature-ai-enhanced.jpg';
    link.href = enhancedImageURL;
    link.click();
});

// ===== رابط الانستغرام =====
document.getElementById('instaLink').href = 'https://www.instagram.com/shi_nichi999';

console.log('🌿 معزّز صور الطبيعة بالذكاء الاصطناعي جاهز!');
