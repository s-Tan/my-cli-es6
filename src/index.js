import './css/common.css'
import {user, sex, year, dom , lesDom} from './tool/t1.js';
import {prt} from './tool/fun.js';
import bg from './imgs/init_img.jpg'
let intr = user + sex + year;
let demo = $('#demo');
prt(intr);
demo.html(dom);
demo.append(lesDom).click(function () {
    window.location.href = './tmpl.html'
})
setTimeout(function () {
    $('.active').addClass('stay').click(function () {
        $(this).removeClass('stay')
    });
});
$('#img').attr('src',bg);
