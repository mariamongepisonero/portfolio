/*-------------------------------------------------*/
/*                 MENÚ NAVEGACIÓN                 */
/*-------------------------------------------------*/

const header = document.querySelector('.header');
const hamburger = document.querySelector('.hamburguesa');
const mobileMenu = document.querySelector('.nav--mobile');

//1. Cambiar estilo del header al hacer scroll
// Añade/quita la clase 'scrolled' si la posición vertical del scroll supera 50px
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
});

// 2. Abre/cierra el menú móvil al al hacer click en el botón hamburguesa
// Alterna la clase 'active' del menú móvil
hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
});

// 3. Muestra/oculta el submenú al hacer clic en elementos con submenú en móviles
// Solo se aplica si el ancho de ventana es menor o igual a 768px
document.querySelectorAll('.nav--mobile .nav__item--submenu > .nav__link').forEach(link => {
    link.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            const submenu = link.nextElementSibling;
            // Muestra si está oculto, o lo oculta si está visible
            submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
        }
    });
});

// 4. Cerrar menú móvil y submenús cuando se hace clic en cualquier enlace de navegación
document.querySelectorAll(
    '.nav--mobile .nav__item:not(.nav__item--submenu) > .nav__link, ' +
    '.nav--mobile .nav__sublink'
).forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        document
            .querySelectorAll('.nav--mobile .nav__submenu')
            .forEach(sub => sub.style.display = 'none');
    });
});

// 5. Verifica si la ventana se ha redimensionado a un ancho mayor a 768px para cerrar el menú móvil.
// (Sin esto, el menú no funcionaba correctamente al encoger la pantalla y volver a agrandarla)
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        mobileMenu.classList.remove('active');
        document.querySelectorAll('.nav--mobile .nav__submenu').forEach(sub => sub.style.display = 'none');
    }
});



/*-------------------------------------------------*/
/*     TABS SECCIÓN ABOUT ME: Ordenador y móvil    */
/*-------------------------------------------------*/

//Recorrer cada device (monitor y movil) por separado
document.querySelectorAll('.device').forEach(device => {
    //Dentro de cada device, seleccionamos:
    const nav = device.querySelector('.tabs__nav'); //barra pestañas
    const tabs = nav.querySelectorAll('.tab'); //cada botón tab
    const paneC = device.querySelector('.tabs__content'); //contenedor de paneles
    const panes = paneC.querySelectorAll('.tab__panel'); //cada panel .tab__panel

    //para cada pestaña un listener de clic
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const key = tab.dataset.tab;

            //desactivar todo
            tabs.forEach(t => t.classList.remove('active'));
            panes.forEach(p => p.classList.remove('active'));

            //activar el tab clicado y el panel correspondiente
            tab.classList.add('active');
            paneC
                .querySelector(`.tab__panel[data-tab="${key}"]`)
                .classList.add('active');
        });
    });
});



/*----------- GALERÍA FOTOS ABOUT ME------------*/

// 1. Seleccionar imágenes de la galería y crear una ventana flotante en el html
const aboutImgs = document.querySelectorAll('.aboutme__img');

// Crear contenedor modal
const galleryModal = document.createElement('div');
galleryModal.classList.add('gallery-modal');
galleryModal.innerHTML = `
            <div class="gallery-modal__overlay"></div>
            <div class="gallery-modal__content">
                <img src="" alt="Imagen ampliada" class="gallery-modal__img" />
                <button class="gallery-modal__close">&times;</button>
            </div>`;
document.body.appendChild(galleryModal);

//var porque estas variables se vuelven a utilizar más abajo!
const modalImg = galleryModal.querySelector('.gallery-modal__img');
var closeBtn = galleryModal.querySelector('.gallery-modal__close');
var overlay = galleryModal.querySelector('.gallery-modal__overlay');

//2. Al hacer clic en cada miniatura, se abre el modal
aboutImgs.forEach(img => {
    img.addEventListener('click', () => {
        modalImg.src = img.src; //mostrar la misma imagen en grande
        galleryModal.classList.add('active');
    });
});

//3. Cerrar el modal
function closeGalleryModal() {
    galleryModal.classList.remove('active');
}

closeBtn.addEventListener('click', closeGalleryModal);
overlay.addEventListener('click', closeGalleryModal);


//------------- SKILLS -----------------//

document.querySelectorAll('.skills').forEach(skillsSection => {
    const skillsItems = skillsSection.querySelectorAll('.skills__item');      //todos los botones‑icono
    const skillsPopup = skillsSection.querySelector('.skills__popup');       //el cuadro emergente
    const popupHeader = skillsPopup.querySelector('.skills__popup-header');  //<h4> con el nombre de la app
    const popupStars = skillsPopup.querySelector('.skills__popup-stars');   //contenedor de ★

    //1. Función handleSkillClick: Se ejecuta cuando el usuario pulsa un icono
    function handleSkillClick(e) {
        e.stopPropagation();                  // evita que el “click global” lo cierre enseguida
        const btn = e.currentTarget;         // botón que generó el evento
        const name = btn.dataset.skillsName;  // nombre de la skill (HTML, Figma…)
        const rating = +btn.dataset.skillsRating || 0;  // rating numérico (1‑5)

        //Cierra cualquier popup que pudiera estar visible (incluyendo otros bloques .skills)
        document.querySelectorAll('.skills__popup')
            .forEach(p => p.classList.add('skills__popup--hidden'));

        //Rellena el encabezado con el nombre
        popupHeader.textContent = name;

        /*Genera dinámicamente las 5 estrellas:
               – ★ llena (class skills__star--filled) si i ≤ rating
               – ★ vacía (gris) en caso contrario                     */
        popupStars.innerHTML = '';
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('span');
            star.textContent = '★';
            star.className = `skills__star${i <= rating ? ' skills__star--filled' : ''}`;
            popupStars.appendChild(star);
        }

        //Muestra el popup (quitar la clase que lo ocultaba)
        skillsPopup.classList.remove('skills__popup--hidden');

        /*Calcula la posición del popup
            – top: justo debajo del icono
            – left: centrado respecto al icono*/
        const btnRect = btn.getBoundingClientRect();             //posición absoluta del botón
        const contRect = skillsSection.getBoundingClientRect();  //posición de la caja .skills

        const top = btnRect.bottom - contRect.top + 4;        //+4 px de margen!
        const left = btnRect.left - contRect.left
            + (btnRect.width - skillsPopup.offsetWidth) / 2;

        skillsPopup.style.top = `${top}px`;
        skillsPopup.style.left = `${left}px`;
    }

    //Asignar el listener a cada botón de la sección
    skillsItems.forEach(btn => btn.addEventListener('click', handleSkillClick));
});

//2. Función click global – cerrar el popup: Si el clic NO cae ni sobre un .skills__item ni sobre el propio .skills__popup, se oculta
document.addEventListener('click', e => {
    if (!e.target.closest('.skills__item') &&
        !e.target.closest('.skills__popup')) {
        document.querySelectorAll('.skills__popup')
            .forEach(p => p.classList.add('skills__popup--hidden'));
    }
});



/*-------------------------------------------------*/
/*                  DISEÑO GRÁFICO                */
/*------------------------------------------------*/

const track = document.querySelector('.carousel__track');
//Array de todas las diapositivas dentro del track
const slides = Array.from(track.children);
const nextButton = document.querySelector('.carousel__btn--next');
const prevButton = document.querySelector('.carousel__btn--prev');
let currentIndex = 0;

//Actualiza la posición del carrusel según el currentIndez
function updateCarousel() {
    const viewport = document.querySelector('.carousel__viewport');
    const slide = slides[0];
    const slideStyle = getComputedStyle(slide);
    const slideMarginRight = parseFloat(slideStyle.marginRight || 0);
    const slideWidth = slide.offsetWidth + slideMarginRight;

    //Cálculo del ancho total y el viewport para centrar la diapositiva activa
    const totalWidth = slideWidth * slides.length;
    const viewportWidth = viewport.offsetWidth;

    let offset = slideWidth * currentIndex - (viewportWidth - slideWidth) / 2;

    //Limitar EL desplazamiento para no cortar el último slide!
    const maxOffset = Math.max(0, totalWidth - viewportWidth);
    offset = Math.min(offset, maxOffset);
    offset = Math.max(0, offset);

    track.style.transform = `translateX(-${offset}px)`;

    //Añadir clase activa a la diapositiva correspondiente
    slides.forEach((slide, index) => {
        slide.classList.toggle('carousel__slide--active', index === currentIndex);
    });
}

//Avanza la diapositiva una posición y actualiza el carrusel
nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel();
});

//Retrocede la diapositiva una posición y actualiza el carrusel
prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateCarousel();
});

//Ajusta la posición del carrusel cuando cambia el tamaño de la ventana.
window.addEventListener('resize', updateCarousel);
//Actualiza el carrusel al cargar la página
window.addEventListener('load', updateCarousel);


//Permite hacer swipe en móvil
//Registra la posición inicial y determina la diferencia al soltar el dedo para avanzar o retroceder
let startX = 0;
track.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
});

track.addEventListener('touchend', e => {
    const endX = e.changedTouches[0].clientX;
    if (endX < startX - 50) nextButton.click();
    else if (endX > startX + 50) prevButton.click();
});

//Modal (ventana flotante) en carrusel diseño gráfico, botón cerrar y fondo superpuesto
const modal = document.getElementById('projectModal');
var closeBtn = modal.querySelector('.modal__close');
var overlay = modal.querySelector('.modal__overlay');
var title = modal.querySelector('.modal__title');
var description = modal.querySelector('.modal__description');
var gallery = modal.querySelector('.modal__gallery');


//Datos de cada proyecto 
const projectData = {
    1: {
        title: "Día del Libro 2024",
        description: "Ilustración y diseño de la cartelería para el Día del Libro, Palencia (2024)",
        images: [
            "./img/proyectos/diseno_grafico/dialibro/dialibro1.jpg",
            "./img/proyectos/diseno_grafico/dialibro/dialibro2.jpg",
            "./img/proyectos/diseno_grafico/dialibro/dialibro3.jpg"
        ]
    },
    2: {
        title: "Tapa del Bendito Bacalao",
        description: "Diseño de la imagen oficial para el festival gastronómico 'Bendito Bacalao' (2024)",
        images: [
            "./img/proyectos/diseno_grafico/benditobacalao/benditobacalao1.jpg",
            "./img/proyectos/diseno_grafico/benditobacalao/benditobacalao2.jpg",
            "./img/proyectos/diseno_grafico/benditobacalao/benditobacalao3.jpg"
        ]
    },
    3: {
        title: "Feria del libro",
        description: "Diseño de cartelería para la Feria del Libro, Palencia (2023)",
        images: [
            "./img/proyectos/diseno_grafico/Ferialibro2023/ferialibro1.jpg",
            "./img/proyectos/diseno_grafico/Ferialibro2023/ferialibro2.jpg",
            "./img/proyectos/diseno_grafico/Ferialibro2023/ferialibro3.jpg"
        ]
    },
    4: {
        title: "Menú GAVA",
        description: "Diseño de carta para restaurante GAVA Valladolid",
        images: [
            "./img/proyectos/diseno_grafico/GAVA/GAVA2.jpg",
            "./img/proyectos/diseno_grafico/GAVA/GAVA3.jpg",
            "./img/proyectos/diseno_grafico/GAVA/GAVA4.jpg"
        ]
    },
    5: {
        title: "Semana Cultural UPP",
        description: "Diseño de imagen y programa de actividades para la UPP",
        images: [
            "./img/proyectos/diseno_grafico/semanaculturalupp/semanaculturalupp1.jpg",
            "./img/proyectos/diseno_grafico/semanaculturalupp/semanaculturalupp2.jpg",
            "./img/proyectos/diseno_grafico/semanaculturalupp/semanaculturalupp3.jpg"
        ]
    }
};

//Para abrir el modal al hacer clic en "Ver proyecto"
document.querySelectorAll('.carousel__cta').forEach((button, index) => {
    button.setAttribute('data-project', index + 1);
    button.addEventListener('click', e => {
        e.preventDefault();
        const projectId = button.getAttribute('data-project');
        const data = projectData[projectId];

        if (data) {
            title.textContent = data.title;
            description.textContent = data.description;

            //Limpia galería anterior
            gallery.innerHTML = '';

            //Carga nuevas imágenes
            data.images.forEach(src => {
                const img = document.createElement('img');
                img.src = src;
                img.alt = data.title;
                gallery.appendChild(img);
            });
        }

        modal.classList.add('active');
    });
});

//Cierra el modal cuando se hace clic en X o en fondo overlay
closeBtn.addEventListener('click', () => modal.classList.remove('active'));
overlay.addEventListener('click', () => modal.classList.remove('active'));



/*-------------------------------------------------*/
/*                 DISEÑO EDITORIAL               */
/*------------------------------------------------*/

document.addEventListener('DOMContentLoaded', () => {
    const editorialModal = document.getElementById('editorialModal');
    const overlay = editorialModal.querySelector('.editorial-modal__overlay');
    const closeBtn = editorialModal.querySelector('.editorial-modal__close');
    const modalTitle = editorialModal.querySelector('.editorial-modal__title');
    const modalDesc = editorialModal.querySelector('.editorial-modal__desc');
    const modalGallery = editorialModal.querySelector('.editorial-modal__gallery');

    const editorialProjects = {
        6: {
            title: "Agenda 2025",
            desc: "Diseño y maquetación de agenda planner año 2025",
            images: [
                "./img/proyectos/diseno_editorial/agenda2025/agenda3.jpg",
                "./img/proyectos/diseno_editorial/agenda2025/agenda2.jpg",
                "./img/proyectos/diseno_editorial/agenda2025/agenda4.jpg"
            ]
        },
        7: {
            title: "Revista NeoRetro",
            desc: "Catálogo para la marca de muebles NeoRetro",
            images: [
                "./img/proyectos/diseno_editorial/revistaneoretro/neoretro3.jpg",
                "./img/proyectos/diseno_editorial/revistaneoretro/neoretro2.jpg",
                "./img/proyectos/diseno_editorial/revistaneoretro/neoretro4.jpg"
            ]
        },
        8: {
            title: "Libro poesía",
            desc: "Diseño y maquetación de colección de poemas",
            images: [
                "./img/proyectos/diseno_editorial/libro/libro1.png",
                "./img/proyectos/diseno_editorial/libro/libro2.jpg",
                "./img/proyectos/diseno_editorial/libro/libro3.jpg"
            ]
        }
    };

    //1. Abrir modal y cargar datos
    document.querySelectorAll('.editorial__btn').forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();

            const key = btn.dataset.project;
            const data = editorialProjects[key];
            if (!data) return;    //seguridad

            //Rellenar contenido
            modalTitle.textContent = data.title;
            modalDesc.textContent = data.desc;
            modalGallery.innerHTML = '';      //limpiar galería

            data.images.forEach(src => {
                const img = document.createElement('img');
                img.src = src;
                img.alt = data.title;
                img.classList.add('editorial-modal__image');
                modalGallery.appendChild(img);
            });

            //Mostrar el modal
            editorialModal.classList.add('editorial-modal--active');
        });
    });


    //2. Cerrar el modal
    function closeEditorialModal() {
        editorialModal.classList.remove('editorial-modal--active');
    }
    closeBtn.addEventListener('click', closeEditorialModal);
    overlay.addEventListener('click', closeEditorialModal);
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeEditorialModal();
    });

    //3. Flip cards en móvil 
    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    if (isTouch) {
        document.querySelectorAll('.editorial__card').forEach(card => {
            card.addEventListener('click', () => {
                card.querySelector('.editorial__flip').classList.toggle('is-flipped');
            });
        });
    }

});

document.querySelectorAll('.editorial__card').forEach(card => {
    card.addEventListener('click', e => {
        card.querySelector('.editorial__flip')
            .classList.toggle('is-flipped');
    });
});


/*-------------------------------------------------*/
/*              IDENTIDADES VISUALES               */
/*------------------------------------------------*/

document.addEventListener('DOMContentLoaded', () => {

    //Datos de los proyectos
    const brandingProjects = [
        {
            id: 'burbuz',
            title: 'Burbuz',
            desc: 'Packaging para marca de refrescos.',
            cover: './img/proyectos/identidad/burbuz/burbuz.jpg',
            images: [
                './img/proyectos/identidad/burbuz/burbuz1.jpg',
                './img/proyectos/identidad/burbuz/burbuz2.jpg',
                './img/proyectos/identidad/burbuz/burbuz3.jpg'
            ]
        },
        {
            id: 'skin00',
            title: 'skin00',
            desc: 'Identidad visual y packaging para marca de cosméticos',
            cover: './img/proyectos/identidad/skin00/skin.jpg',
            images: [
                './img/proyectos/identidad/skin00/skin1.jpg',
                './img/proyectos/identidad/skin00/skin3.jpg',
                './img/proyectos/identidad/skin00/skin2.jpg'
            ]
        },
        {
            id: 'dostazas',
            title: 'Dos tazas',
            desc: 'Identidad visual y packaging para cafetería.',
            cover: './img/proyectos/identidad/dostazas/dostazas.jpg',
            images: [
                './img/proyectos/identidad/dostazas/dostazas1.jpg',
                './img/proyectos/identidad/dostazas/dostazas2.jpg',
                './img/proyectos/identidad/dostazas/dostazas3.jpg'
            ]
        }
    ];

    //2. Construir las diapositivas con HTML
    const brandingTrack = document.getElementById('brandingTrack');
    brandingProjects.forEach(p => {
        brandingTrack.insertAdjacentHTML('beforeend', `
                <div class="carousel__slide">
                    <div class="carousel__card" data-id="${p.id}">
                        <img src="${p.cover}" alt="${p.title}" class="carousel__image">
                         <div class="carousel__content">
                             <h3 class="carousel__heading">${p.title}</h3>
                             <p  class="carousel__description">${p.desc}</p>
                             <a href="#" class="carousel__cta">Ver proyecto</a>
                         </div>
                    </div>
                </div>
              `);
    });

    //3. Seleccionar elementos y marcar estado del carrusel
    const brandingViewport = document.querySelector('#branding .carousel__viewport');
    const brandingSlides = Array.from(brandingTrack.children);
    const prevBtn = brandingViewport.querySelector('.carousel__btn--prev');
    const nextBtn = brandingViewport.querySelector('.carousel__btn--next');
    let currentIndex = 0;

    //Centrar el carrusel (igual que el de Diseño gráfico)
    function updateBrandingCarousel() {
        const slide = brandingSlides[0];
        const style = getComputedStyle(slide);
        const marginRight = parseFloat(style.marginRight) || 0;
        const slideWidth = slide.offsetWidth + marginRight;

        const totalWidth = slideWidth * brandingSlides.length;
        const viewportWidth = brandingViewport.offsetWidth;
        let offset = slideWidth * currentIndex - (viewportWidth - slideWidth) / 2;

        const maxOffset = Math.max(0, totalWidth - viewportWidth);
        offset = Math.max(0, Math.min(offset, maxOffset));

        brandingTrack.style.transform = `translateX(-${offset}px)`;

        brandingSlides.forEach((s, i) =>
            s.classList.toggle('carousel__slide--active', i === currentIndex));
    }

    //Botones de navegación a un lado y otro
    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % brandingSlides.length;
        updateBrandingCarousel();
    });

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + brandingSlides.length) % brandingSlides.length;
        updateBrandingCarousel();
    });

    //swipe en móviles
    let startX = 0;
    brandingTrack.addEventListener('touchstart', e => startX = e.touches[0].clientX);
    brandingTrack.addEventListener('touchend', e => {
        const endX = e.changedTouches[0].clientX;
        if (endX < startX - 50) nextBtn.click();
        else if (endX > startX + 50) prevBtn.click();
    });

    //ajuste responsive
    window.addEventListener('load', updateBrandingCarousel);
    window.addEventListener('resize', updateBrandingCarousel);

    //Modal
    const modal = document.getElementById('brandingModal');
    const mTitle = modal.querySelector('.modal__title');
    const mDesc = modal.querySelector('.modal__description');
    const mGallery = document.getElementById('brandingGallery');
    const mClose = modal.querySelector('.modal__close');
    const mOverlay = modal.querySelector('.modal__overlay');

    brandingTrack.addEventListener('click', e => {
        const btn = e.target.closest('.carousel__cta');
        if (!btn) return;
        e.preventDefault();

        const card = btn.closest('.carousel__card');
        const data = brandingProjects.find(p => p.id === card.dataset.id);
        if (!data) return;

        //Completar datos del modal
        mTitle.textContent = data.title;
        mDesc.textContent = data.desc;
        mGallery.innerHTML = data.images
            .map(src => `<img src="${src}" alt="${data.title}">`)
            .join('');

        modal.classList.add('active');
    });

    const closeModal = () => modal.classList.remove('active');
    mClose.addEventListener('click', closeModal);
    mOverlay.addEventListener('click', closeModal);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

    //Arrancar en la primera diapo
    updateBrandingCarousel();
});


/*-------------------------------------------------*/
/*              FORMULARIO CONTACTO               */
/*------------------------------------------------*/
document.getElementById('formulario-contacto').addEventListener('submit', function (e) {
    e.preventDefault();
    const mensaje = document.getElementById('mensaje-exito');
    mensaje.style.display = 'block';

    //Resetear formulario
    this.reset();
});