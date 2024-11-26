export const siteSecurity = () => {
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    });

    document.addEventListener('keydown', function (e) {
        if ((e.ctrlKey && (
            e.key === 'shift' ||
            e.key === 'i' ||
            e.key === 'I' ||
            e.key === 'j' ||
            e.key === 'J' ||
            e.keyCode === 74 ||
            e.keyCode === 85 ||
            e.keyCode === 73
        )) || e.key === 'F12') e.preventDefault();
    });
};