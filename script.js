// 保留原有的平滑滚动代码
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// 添加这个函数来记录调试信息
function log(message) {
    console.log(message);
    const debugInfo = document.getElementById('debug-info');
    if (debugInfo) {
        debugInfo.innerHTML += `<br>${message}`;
    }
}

// 更新轮播图功能
let slideIndex = 0;
let slidesWrapper;
let slides;
let totalSlides;
let slideInterval;

function showSlides() {
    if (!slides || slides.length === 0) {
        log('没有找到图片');
        return;
    }
    slideIndex++;
    if (slideIndex >= totalSlides) {
        slideIndex = 0;
    }
    slidesWrapper.style.transform = `translateX(-${slideIndex * 100}%)`;
    log(`当前显示第 ${slideIndex + 1} 张图片`);
}

function setSlideWidth() {
    if (!slidesWrapper || !slides) {
        log('轮播图元素未找到');
        return;
    }
    const containerWidth = document.querySelector('.slideshow-container').offsetWidth;
    slides.forEach((slide, index) => {
        slide.style.width = `${containerWidth}px`;
        log(`设置第 ${index + 1} 张图片宽度为 ${containerWidth}px`);
    });
    slidesWrapper.style.width = `${containerWidth * totalSlides}px`;
    log(`设置轮播图总宽度为 ${containerWidth * totalSlides}px`);
}

function initSlideshow() {
    log('开始初始化轮播图');
    slidesWrapper = document.querySelector('.slides-wrapper');
    slides = slidesWrapper.querySelectorAll('img');
    totalSlides = slides.length;
    
    if (!slidesWrapper || !slides || totalSlides === 0) {
        log('轮播图初始化失败：未找到必要的元素');
        return;
    }
    
    setSlideWidth();
    Promise.all(Array.from(slides).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => { img.onload = img.onerror = resolve; });
    })).then(() => {
        slidesWrapper.style.visibility = 'visible';
        log('所有图片加载完成，轮播图可见');
        startSlideshow();
        log('开始自动轮播');
    }).catch(error => {
        log(`图片加载出错：${error}`);
    });
}

function startSlideshow() {
    if (slideInterval) {
        clearInterval(slideInterval);
    }
    slideInterval = setInterval(showSlides, 8000); // 增加间隔时间到8秒
}

// 初始化
window.addEventListener('load', initSlideshow);
window.addEventListener('resize', setSlideWidth);

log('脚本加载完成');

// 在文件末尾添加以下代码
document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('click', function() {
        this.blur(); // 移除焦点
    });
});
