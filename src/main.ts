// src/main.ts

// Basic event listeners for interactive buttons
// Demonstrating decoupling structure: HTML, CSS, JS

document.addEventListener('DOMContentLoaded', () => {
    // Select styling for interaction feedback
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            button.classList.add('focused');
            setTimeout(() => {
                button.classList.remove('focused');
            }, 150);
        });
    });

    // =========================================
    // Swipeable Carousel (scroll-snap based)
    // =========================================
    function initCarousel(carouselId: string, dotsId: string) {
        const carousel = document.getElementById(carouselId);
        const dotsContainer = document.getElementById(dotsId);
        if (!carousel || !dotsContainer) return;

        const track = carousel.querySelector('.carousel-track') as HTMLElement;
        const dots = dotsContainer.querySelectorAll('.dot');
        if (!track || dots.length === 0) return;

        // Update dots on scroll
        let scrollTimeout: number;
        track.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = window.setTimeout(() => {
                const slideWidth = track.clientWidth;
                const activeIndex = Math.round(track.scrollLeft / slideWidth);
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === activeIndex);
                });
            }, 50);
        });

        // Click dot to navigate
        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                track.scrollTo({ left: i * track.clientWidth, behavior: 'smooth' });
            });
        });
    }

    initCarousel('carousel-vgosti', 'dots-vgosti');
    initCarousel('carousel-vi', 'dots-vi');
    initCarousel('carousel-vstrechai', 'dots-vstrechai');

    // Modal Logic
    const btnMenuVgosti = document.getElementById('btn-menu-vgosti');
    const btnMenuVi = document.getElementById('btn-menu-vi');
    const btnMenuVstrechai = document.getElementById('btn-menu-vstrechai');
    const modal = document.getElementById('menu-modal');
    const closeBtn = document.getElementById('modal-close-btn');
    const modalImage = document.getElementById('modal-menu-image') as HTMLImageElement;

    if (modal && closeBtn && modalImage) {
        modalImage.addEventListener('load', () => {
            modalImage.classList.remove('loading');
        });

        function openModal(imgSrc: string) {
            if (modalImage.getAttribute('src') !== imgSrc) {
                modalImage.classList.add('loading');
                modalImage.setAttribute('src', imgSrc);
            }
            modal?.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        btnMenuVgosti?.addEventListener('click', () => {
            openModal('/menu-vgosti.jpg');
        });

        btnMenuVi?.addEventListener('click', () => {
            openModal('/menu-vi.jpg');
        });

        btnMenuVstrechai?.addEventListener('click', () => {
            openModal('/menu-vstrechai.jpg');
        });

        // Close Modal via button
        closeBtn.addEventListener('click', () => {
            closeModal();
        });

        // Close Modal by clicking outside the image
        modal.addEventListener('click', (e) => {
            if (e.target === modal || (e.target as HTMLElement).classList.contains('modal-content-wrapper')) {
                closeModal();
            }
        });

        function closeModal() {
            modal?.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Maps Logic
    const mapsButtons = document.querySelectorAll('.btn-maps');
    const mapsModal = document.getElementById('maps-modal');
    const mapsCloseBtn = document.getElementById('maps-close-btn');
    const linkYandex = document.getElementById('link-yandex') as HTMLAnchorElement;
    const link2gis = document.getElementById('link-2gis') as HTMLAnchorElement;
    const linkGoogle = document.getElementById('link-google') as HTMLAnchorElement;

    if (mapsButtons.length > 0 && mapsModal && mapsCloseBtn && linkYandex && link2gis && linkGoogle) {
        mapsButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget as HTMLElement;
                const lat = target.getAttribute('data-lat');
                const lng = target.getAttribute('data-lng');
                const query = target.getAttribute('data-query') || '';

                if (lat && lng) {
                    /* If we have direct lat/lng coords */
                    linkYandex.href = `https://yandex.ru/maps/?text=${lat},${lng}`;
                    link2gis.href = `https://2gis.ru/search/${lat},${lng}`;
                    linkGoogle.href = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
                } else {
                    /* If we only have address text */
                    const encodedQuery = encodeURIComponent(query);
                    linkYandex.href = `https://yandex.ru/maps/?text=${encodedQuery}`;
                    link2gis.href = `https://2gis.ru/search/${encodedQuery}`;
                    linkGoogle.href = `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;
                }

                mapsModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        mapsCloseBtn.addEventListener('click', () => {
            closeMapsModal();
        });

        mapsModal.addEventListener('click', (e) => {
            if (e.target === mapsModal) {
                closeMapsModal();
            }
        });

        function closeMapsModal() {
            mapsModal?.classList.remove('active');
            // If the other modal isn't open, restore scroll
            if (!document.getElementById('menu-modal')?.classList.contains('active') && !document.getElementById('download-modal')?.classList.contains('active')) {
                document.body.style.overflow = '';
            }
        }
    }

    // App Download Modal Logic
    const btnDownloadVi = document.getElementById('btn-download-vi');
    const downloadModal = document.getElementById('download-modal');
    const downloadCloseBtn = document.getElementById('download-close-btn');

    if (downloadModal && downloadCloseBtn) {
        const openDownloadModal = () => {
            downloadModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        if (btnDownloadVi) btnDownloadVi.addEventListener('click', openDownloadModal);

        downloadCloseBtn.addEventListener('click', () => {
            closeDownloadModal();
        });

        downloadModal.addEventListener('click', (e) => {
            if (e.target === downloadModal) {
                closeDownloadModal();
            }
        });

        function closeDownloadModal() {
            downloadModal?.classList.remove('active');
            if (!document.getElementById('menu-modal')?.classList.contains('active') && !document.getElementById('maps-modal')?.classList.contains('active')) {
                document.body.style.overflow = '';
            }
        }
    }

    // =========================================
    // Toast Notification
    // =========================================
    function showToast(message: string) {
        const toast = document.getElementById('toast');
        const toastText = document.getElementById('toast-text');
        if (!toast || !toastText) return;

        toastText.textContent = message;
        toast.classList.add('visible');

        setTimeout(() => {
            toast.classList.remove('visible');
        }, 2500);
    }

    // =========================================
    // Clipboard Helper
    // =========================================
    async function copyToClipboard(code: string): Promise<boolean> {
        try {
            await navigator.clipboard.writeText(code);
            return true;
        } catch {
            // Fallback for older browsers / insecure context
            const textarea = document.createElement('textarea');
            textarea.value = code;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                return true;
            } catch {
                return false;
            } finally {
                document.body.removeChild(textarea);
            }
        }
    }

    // =========================================
    // Promo Gift Button + Modal (ВКУСНО10)
    // =========================================
    const PROMO_CODE_GIFT = 'ВКУСНО10';

    const btnGift = document.getElementById('btn-gift');
    const promoModal = document.getElementById('promo-modal');
    const promoCloseBtn = document.getElementById('promo-close-btn');
    const btnCopyPromo = document.getElementById('btn-copy-promo');
    const btnCopyText = document.getElementById('btn-copy-text');

    if (btnGift && promoModal && promoCloseBtn) {
        btnGift.addEventListener('click', () => {
            // Open modal directly without localStorage checks
            promoModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        promoCloseBtn.addEventListener('click', closePromoModal);
        promoModal.addEventListener('click', (e) => {
            if (e.target === promoModal) closePromoModal();
        });

        function closePromoModal() {
            promoModal?.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Copy promo code button
    if (btnCopyPromo && btnCopyText) {
        btnCopyPromo.addEventListener('click', async () => {
            const success = await copyToClipboard(PROMO_CODE_GIFT);
            if (success) {
                btnCopyPromo.classList.add('copied');
                btnCopyText.textContent = 'Скопировано ✓';
                showToast(`Промокод ${PROMO_CODE_GIFT} скопирован`);

                setTimeout(() => {
                    btnCopyPromo.classList.remove('copied');
                    btnCopyText.textContent = 'Скопировать код';
                }, 3000);
            }
        });
    }

    // =========================================
    // Download App + Auto-copy (ИСТОРИИ20)
    // =========================================
    const PROMO_CODE_APP = 'ИСТОРИИ20';
    const downloadLinks = document.querySelectorAll('.download-link');

    downloadLinks.forEach(link => {
        link.addEventListener('click', () => {
            copyToClipboard(PROMO_CODE_APP).then((success) => {
                if (success) {
                    showToast(`Промокод ${PROMO_CODE_APP} скопирован`);
                }
            });
        });
    });

    // =========================================
    // Phone Copy
    // =========================================
    const phoneLinks = document.querySelectorAll('.copyable-phone');
    phoneLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const phone = link.getAttribute('data-phone');
            if (phone) {
                copyToClipboard(phone).then((success) => {
                    if (success) {
                        showToast(`Скопирован: ${phone}`);
                    }
                });
            }
        });
    });
});
