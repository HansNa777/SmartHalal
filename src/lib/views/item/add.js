
let vm_ = null;

function init (keys, special_keys) {

    const text_keys = [];
    keys.map((k, idx) => (special_keys.indexOf(k) < 0)? text_keys.push(k): null);

    const data = {};
    keys.map((k, idx) => data[k] = '');

    data['image_src'] = '';
    data['additional_fields'] = '{\n\n}';

    vm_ = new Vue({
        el: '#app',
        data: {
            keys        : keys,
            text_keys   : text_keys,
            special_keys: special_keys,
            data: data,
            confirm_err: '',
            is_submitable: true,
        },
        methods: {
            onLoadImage () {
                $('#image-file').click();
            },
            onImageChanged () {
                const files = this.$refs.image_file.files;

                if (files && files[0]) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        vm_.data.image_src = e.target.result;
                    }
                    reader.readAsDataURL(files[0]);
                }
            },
            onAdd () {
                if (this.is_submitable == false)
                    return;

                const errs = [];
                for (let k in this.data) {
                    if (k == 'image_src')
                        continue;
                    this._checkError(errs, this.data[k].length <= 0,
                        k + '을 작성해 주세요');
                }

                this._checkError(errs, this.data['image_src'].length <= 0,
                    '이미지를 불러와 주세요');

                try {
                    JSON.parse(this.data['additional_fields']);
                }catch (e) {
                    this._checkError(errs, true,
                        'additional_fields가 올바른 JSON 형식이 아닙니다');
                }

                this.confirm_err = errs;

                if (errs.length > 0)
                    return;

                this.is_submitable = false;
                $('#add-form').submit();
            },
            _checkError (errs, condition, msg) {
                if (condition == true)
                    errs.push(msg);
            },
        },
    });
}
