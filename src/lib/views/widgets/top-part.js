
Vue.component('top-part', {
    props: ['current'],
    data: function () {
        return {
        };  
    },  
    methods:{
        onHome () {
            window.location.href = '/';
        },
        onAddItem () {
            window.location.href = '/add-item';
        },
        onAddCertifier () {
            window.location.href = '/certifiers/add';
        },
    },  
    mounted:function(){
        /*  
        const top_nav_div = $("#top_nav");
        const nav_height = top_nav_div.height() + 20;

        const top_margin_div = $("#top_margin_box");
        top_margin_div.height(nav_height);
        */

    },  
    template: `
    <div class="d-flex align-items-center">
      <div style="cursor:pointer;" @click="onHome">
        <img src="/common/icLogo_.png" height="62pt" class="mr-3">
        <img src="/common/logo_text.png" height="62pt">
      </div>
      <div class="flex-grow-1">
      </div>
      <button class="btn mb-1 mr-4 px-5" style="background-color:rgb(55,101,55);color:white;" @click="onAddItem">품목 추가</button>
      <button class="btn mb-1 px-5" style="background-color:white;color:rgb(55,101,55);border-color:rgb(55,101,55);" @click="onAddCertifier">인증자 추가</button>
    </div>
    `,
});

