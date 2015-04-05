var options = {
    icon: {
        background: 'rgba(67, 91, 255, 0.6)',
        border: '#000000'
    },
    active: false,
    click: function (e) {
        this.classList.toggle('enabled');
        this.classList.toggle('disabled');
        browseService();
    }
}
widgetService().addDockItem2(options).innerHTML = 'Browse';
function browseService(){

}