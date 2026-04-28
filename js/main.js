'use strict';

// ── Gallery data ────────────────────────────────────────────────────────────

const categories = {
  cabinets: {
    folder: 'Cabinets%2C%20Wardrobes%20and%20Shelves',
    images: [
      'Attic%20Storage.jpeg',
      'Bathroom%20Sink%20Cabinet.jpg',
      'Bedroom%20Wardrobe.jpg',
      'Book%20Shelves.jpg',
      'Book%20Storage.jpeg',
      'Bookshelves.jpg',
      'Corner%20Cabinet.jpg',
      'Corner%20Wardrobe.jpg',
      'Counter%20and%20Cupboard.jpg',
      'Cupboard%20%26%20Worksurface.jpg',
      'Cupboards.jpg',
      'Custom%20Shelves.jpg',
      'Custom%20Storage.jpg',
      'In-build%20Hangers.jpg',
      'Kitchen%20Shelves.jpg',
      'L-shaped%20Shelves.jpg',
      'Living%20room.jpeg',
      'Livingroom%20Storage.jpg',
      'Low%20Cupboards%20%26%20Shelves.jpg',
      'Modern%20Storage.jpg',
      'Modern%20Wardrobe.jpg',
      'Narrow%20Wardrobes.jpg',
      'Nursery%20Cupboards%20%26%20Shelves.jpeg',
      'Offset%20Shelf%20Unit.jpg',
      'Ornate%20Corner%20Cabinet.jpg',
      'Panelled%20Cabinet.jpg',
      'Panelled%20Cupboards.jpg',
      'Recessed%20Book%20Shelves.jpeg',
      'Screenshot_20210722_215419_com_edited.jpg',
      'Shelves%20%26%20Drawers.jpg',
      'Shelves%20%26%20Storage.jpeg',
      'Small%20Shelves.jpeg',
      'Understair%20Shoe%20Store.jpg',
      'Wardrobe%20%26%20Shelves.jpg',
      'Wardrobe%20%26%20Table.jpg',
      'Wardrobe%20Doors.jpg',
      'Wardrobe%20Sliding%20Doors.jpeg',
      'Wardrobe.jpg',
      'Wine%20Bar.jpg',
    ],
  },
  kitchen: {
    folder: 'Kitchen',
    images: [
      'Fitted%20Kitchen.jpg',
      'Kitchen%20%26%20Shelves.jpg',
      'Kitchen%20and%20Double%20Doors.jpg',
      'Kitchen%20Front.jpg',
      'Kitchen%20Side.jpg',
      'Kitchen%20Worktop.jpg',
      'Kitchen.jpg',
    ],
  },
  floors: {
    folder: 'Floors',
    images: [
      'Laminate%20Wood%20Floor.jpg',
      'Laminate%20Wood%20Floor%20Side.jpg',
    ],
  },
  doors: {
    folder: 'Doors',
    images: [
      'Custom%20Frame.jpg',
      'Custom%20Frame%20Edge.jpg',
      'Door%20Catch.jpg',
      'Door%20Handles.jpeg',
      'Hinge%20Side.jpg',
      'Hinge%20Top.jpg',
      'Natural%20Panel%20Door.jpg',
      'Natural%20Wood%20Frame.jpg',
      'Painted%20Front%20Door.jpg',
      'Panelled%20Front%20Door.jpg',
      'Solid%20Wood%20Door.jpg',
    ],
  },
  other: {
    folder: 'Other',
    images: [
      'Bannister.jpg',
      'Bannister%20Side.jpg',
      'Bench.jpeg',
      'Bottom%20Stair%20Gate.jpg',
      'Built-in%20Storage.jpg',
      'Glass%20Storage.jpg',
      'Pallete%20Furniture.jpg',
      'Stair%20Gate%20Closed.jpg',
      'Stair%20Gate%20Open.jpg',
      'Storage.jpg',
      'Top%20Stair%20Gate.jpg',
    ],
  },
};

// Build flat list of all items
const allItems = [];
for (const [cat, data] of Object.entries(categories)) {
  for (const filename of data.images) {
    allItems.push({
      category: cat,
      src: `assets/images/${data.folder}/${filename}`,
      alt: decodeURIComponent(filename).replace(/\.[^.]+$/, ''),
    });
  }
}

// ── Gallery rendering ────────────────────────────────────────────────────────

const grid = document.getElementById('gallery-grid');
let visibleItems = [];
let currentIndex = 0;

function renderGallery(filter) {
  visibleItems = filter === 'all'
    ? allItems
    : allItems.filter(item => item.category === filter);

  grid.innerHTML = '';
  visibleItems.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = 'gallery-item';

    const img = document.createElement('img');
    img.src = item.src;
    img.alt = item.alt;
    img.loading = 'lazy';

    div.appendChild(img);
    div.addEventListener('click', () => openLightbox(i));
    grid.appendChild(div);
  });
}

renderGallery('all');

// ── Tab filtering ────────────────────────────────────────────────────────────

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderGallery(btn.dataset.tab);
  });
});

// ── Lightbox ─────────────────────────────────────────────────────────────────

const lightbox  = document.getElementById('lightbox');
const lbImg     = document.getElementById('lb-img');
const lbCaption = document.getElementById('lb-caption');

function openLightbox(index) {
  currentIndex = index;
  updateLightbox();
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function prevImage() {
  currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
  updateLightbox();
}

function nextImage() {
  currentIndex = (currentIndex + 1) % visibleItems.length;
  updateLightbox();
}

function updateLightbox() {
  const item = visibleItems[currentIndex];
  lbImg.src = item.src;
  lbImg.alt = item.alt;
  lbCaption.textContent = item.alt;
}

document.getElementById('lb-close').addEventListener('click', closeLightbox);
document.getElementById('lb-prev').addEventListener('click', prevImage);
document.getElementById('lb-next').addEventListener('click', nextImage);

// Close on backdrop click
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});

// Keyboard navigation
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowLeft')   prevImage();
  if (e.key === 'ArrowRight')  nextImage();
});

// Touch swipe
let touchStartX = 0;
lightbox.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
}, { passive: true });
lightbox.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 50) dx < 0 ? nextImage() : prevImage();
});

// ── Testimonial slider ───────────────────────────────────────────────────────

const slides    = Array.from(document.querySelectorAll('.testimonial-slide'));
const dotsWrap  = document.getElementById('testimonial-dots');
let tCurrent    = 0;
let tTimer;

// Build dots
slides.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.className = 't-dot' + (i === 0 ? ' active' : '');
  dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
  dot.addEventListener('click', () => goToSlide(i));
  dotsWrap.appendChild(dot);
});

function goToSlide(index) {
  slides[tCurrent].classList.remove('active');
  dotsWrap.children[tCurrent].classList.remove('active');
  tCurrent = (index + slides.length) % slides.length;
  slides[tCurrent].classList.add('active');
  dotsWrap.children[tCurrent].classList.add('active');
  resetTimer();
}

function resetTimer() {
  clearInterval(tTimer);
  tTimer = setInterval(() => goToSlide(tCurrent + 1), 8000);
}

document.querySelector('.t-prev').addEventListener('click', () => goToSlide(tCurrent - 1));
document.querySelector('.t-next').addEventListener('click', () => goToSlide(tCurrent + 1));

resetTimer();

// ── Mobile nav ───────────────────────────────────────────────────────────────

const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', open);
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// ── FormSubmit redirect ───────────────────────────────────────────────────────

document.getElementById('form-next').value = window.location.href;
