const carousel = document.querySelector('#carousel');
const slider = document.querySelector('#wrapper');
const prev = document.querySelector('.prev');
const next = document.querySelector('.next');

let direction = -1;

next.addEventListener('click', () => {
    if (direction === 1)
        slider.appendChild(slider.firstElementChild);

    direction = -1;
    carousel.style['justify-content'] = 'flex-start';
    slider.style['transform'] = 'translate(calc(-30vw + 60px))';
    next.setAttribute('disabled', 'disabled');

    setTimeout(() => {
        slider.appendChild(slider.firstElementChild);

        slider.style['transition'] = 'none';
        slider.style['transform'] = 'translate(0)';
    }, 500)

    setTimeout(() => {
        slider.style['transition'] = 'all 500ms';
        next.removeAttribute('disabled');
    }, 600)
})

prev.addEventListener('click', () => {
    if (direction === -1)
        slider.prepend(slider.lastElementChild);

    direction = 1;
    carousel.style['justify-content'] = 'flex-end';
    slider.style['transform'] = 'translate(calc(30vw - 60px))';
    prev.setAttribute('disabled', 'disabled');

    setTimeout(() => {
        slider.prepend(slider.lastElementChild);

        slider.style['transition'] = 'none';
        slider.style['transform'] = 'translate(0)';
    }, 500)

    setTimeout(() => {
        slider.style['transition'] = 'all 500ms';
        prev.removeAttribute('disabled');
    }, 600)
})
