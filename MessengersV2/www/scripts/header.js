$(document).ready(function () {
    $('#simple-menu').sidr();

    $('.menu5').click(function () {
        $.sidr('close');
        window.location.href = "#/collect";
    });

    $('.menu2').click(function () {
        $.sidr('close');
        window.location.href = "#/distribution";
    });

    $('.menu4').click(function () {
        $.sidr('close');
        window.location.href = "#/deliver";
    });
    $('.menu3').click(function () {
        $.sidr('close');
        window.location.href = "#/weightNormal";
    });

    
});