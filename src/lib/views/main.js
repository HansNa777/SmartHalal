
let vm_ = null;

function _onResize () {
    $('#search-bar').outerHeight($('#banner-img').outerHeight());
}

function init (items) {
    $(window).resize(_onResize);
    _onResize();

    items.map((item, idx) => {
        item.additional_fields = JSON.parse(item.additional_fields);
    });

    vm_ = new Vue({
        el: '#app',
        data: {
            items: items,
            confirm_err: '',
        },
        methods: {
            onShowDetail (idx) {
                window.location.href = '/item/' + this.items[idx].id;
            },
            onAddItem () {
                window.location.href = '/add-item';
            },
            onAddCertifier () {
                window.location.href = '/certifiers/add';
            },
        },
        computed: {
        },
    });
}

