new Swiper('.card-wrapper', {
    //if loop is false then not move card after reach first of end card
    loop: true,
    spaceBetween:30,
  
    // pagination bullets
    pagination: {
      el: '.swiper-pagination',
      clickable:true,
      dynamicBullets:true
    },
  
    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },

    // responsive breake point 
    breakpoints:{
        0:{
            slidesPerView : 1
        },
        768:{
            slidesPerView : 2
        },
        1024:{
            slidesPerView : 3
        },
    }
  });