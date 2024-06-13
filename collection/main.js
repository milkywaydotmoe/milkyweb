$(document).ready(function () {
    //⭐ Here write the path of your gallery folder ⭐
    let gallery_folder = "assets/gallery";
    //⭐ Here write the name of your images, including the extension ⭐
    let gallery_images = ["akira-deng-gNZ6MHqtsLY-unsplash.jpg", "ling-xian-su-7FV4bEljHe8-unsplash.jpg", "mi-min-pkpqoBp11Jc-unsplash.jpg", "tomoko-uji-38afJMG_hS0-unsplash.jpg", "veronika-bykovich--umXNG5C544-unsplash.jpg"];

    gallery_images.forEach((element, index) => {
        $('#gallery_content').append(`
                <figure class="gallery_thumb open_modal" data-toggle="modal" data-target="${element}">
                    <img class="photo" src="${gallery_folder}/${element}" />
                </figure>`);
    });

    var showModal = false;
    $('.open_modal, #close_modal').click(function () {
        showModal = !showModal;
        if (showModal) {
            var foto = $(this);
            var modalID = foto.data('target');
            $(".modal_image").attr("src", gallery_folder + "/" + modalID);
            $("#modal_backdrop").css({ "transform": "translateY(0px)", "opacity": 1 });
        } else {
            $("#modal_backdrop").css({ "transform": "translateY(-150vh)", "opacity": 0 });
        }
    });
});