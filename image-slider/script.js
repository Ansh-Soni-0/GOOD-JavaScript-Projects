const sliderTabs = document.querySelectorAll('.slide-tab');
const sliderIndecator = document.querySelector('.slider-indecator');
const sliderControles = document.querySelector('.slider-controles');


//initialize swiper instance
const swiper = new Swiper(".slider-container" , {
    effect : "fade",
    speed : 1300,
    autoplay: { delay : 4000 },

    navigation : {
        prevEl : "#slide-prev",
        nextEl : "#slide-next",
    },
    
    on : {
        // update indecator on slide change 
        slideChange : () => {
            const currentTabIndex = [...sliderTabs].indexOf(sliderTabs[swiper.activeIndex]);
            updateIndecator(sliderTabs[swiper.activeIndex] , currentTabIndex);
        },
        reachEnd: () => swiper.autoplay.stop()
    }
});

// effect - > fade , slide ,cube , coverflow


const updateIndecator = (tab , index) => {
    sliderIndecator.style.transform = `translateX(${tab.offsetLeft - 20}px)`;
    sliderIndecator.style.width = `${tab.getBoundingClientRect().width}px`;

    //calculate the scroll position and scroll amothly
    const scrollLeft = sliderTabs[index].offsetLeft - sliderControles.offsetWidth / 2 + sliderTabs[index].offsetWidth / 2;

    sliderControles.scrollTo({left : scrollLeft , behavior:"smooth"});
}
// update the slide and indecator on tab click 
sliderTabs.forEach((tab , index) => {
    tab.addEventListener('click' , () => {
        swiper.slideTo(index);
        updateIndecator(tab , index);
    });
});

updateIndecator(sliderTabs[0] , 0);

window.addEventListener("resize" , () => 
    updateIndecator(sliderTabs[swiper.activeIndex] , 0)
)