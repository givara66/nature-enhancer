// استيراد مكتبة التحسين
import { applyPACE } from '@shahid-labs/pace';

// جلب عناصر الصفحة
const fileInput = document.getElementById('fileInput');
const dropZone = document.getElementById('dropZone');
const originalImg = document.getElementById('originalPreview');
const enhancedImg = document.getElementById('enhancedPreview');
const enhanceBtn = document.getElementById('enhanceBtn');
const downloadBtn = document.getElementById('downloadBtn');
const strengthSlider = document.getElementById('strengthSlider');
const strengthValue = document.getElementById('strengthValue');

// متغيرات لتخزين الصور
let currentImageData = null;
let enhancedImageData = null;

// تحديث قيمة شريط التحكم
strengthSlider.addEventListener('input', () => {
    strengthValue.textContent = strengthSlider.value;
});

// دالة تحميل الصورة
function loadImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            currentImageData = new ImageData(
                new Uint8ClampedArray(imageData.data),
                imageData.width,
                imageData.height
            );

            originalImg.src = canvas.toDataURL('image/jpeg', 0.92);
            enhancedImg.src = '';
            enhancedImageData = null;
            downloadBtn.disabled = true;
            enhanceBtn.disabled = false;
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// رفع بالضغط
dropZone.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
        loadImage(e.target.files[0]);
    }
});

// رفع بالسحب والإفلات
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

// زر تحسين الصورة
enhanceBtn.addEventListener('click', async () => {
    if (!currentImageData) return;

    enhanceBtn.disabled = true;
    enhanceBtn.textContent = '⏳ جاري التحسين...';

    try {
        const strength = parseFloat(strengthSlider.value);
        const result = await applyPACE(currentImageData, {
            strength: strength,
            debug: false
        });

        enhancedImageData = result;

        const canvas = document.createElement('canvas');
        canvas.width = result.width;
        canvas.height = result.height;
        const ctx = canvas.getContext('2d');
        ctx.putImageData(result, 0, 0);
        enhancedImg.src = canvas.toDataURL('image/jpeg', 0.92);

        downloadBtn.disabled = false;
    } catch (error) {
        console.error('خطأ:', error);
        alert('❌ حدث خطأ أثناء تحسين الصورة. حاول مرة أخرى.');
    } finally {
        enhanceBtn.disabled = false;
        enhanceBtn.textContent = '🎨 حسّن الصورة';
    }
});

// زر تحميل الصورة المحسّنة
downloadBtn.addEventListener('click', () => {
    if (!enhancedImageData) return;

    const canvas = document.createElement('canvas');
    canvas.width = enhancedImageData.width;
    canvas.height = enhancedImageData.height;
    const ctx = canvas.getContext('2d');
    ctx.putImageData(enhancedImageData, 0, 0);

    const link = document.createElement('a');
    link.download = 'nature-enhanced.jpg';
    link.href = canvas.toDataURL('image/jpeg', 0.95);
    link.click();
});

// رابط الانستغرام (عدله لحسابك)
document.getElementById('instaLink').href = 'https://instagram.com/اسم_حسابك';

console.log('🌿 معزّز صور الطبيعة جاهز!');