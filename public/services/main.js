import { router } from './router.js';

document.addEventListener('DOMContentLoaded', () => {
    router.init();
});

window.navigateTo = (path) => {
    router.navigate(path);
};
