
let vm_ = null;

function init (keys, static_keys, special_keys, data, certifiers) {

    const text_keys = [];
    keys.map((k, idx) => (static_keys.indexOf(k) < 0 && special_keys.indexOf(k) < 0)? text_keys.push(k): null);

    keys.map((k, idx) => (data[k] == undefined)? data[k] = '' : null);

    data['content'] = '{\n\n}';

    static_keys.splice(static_keys.indexOf('certifier_id'), 1);
    
    vm_ = new Vue({
        el: '#app',
        data: {
            keys        : keys,
            static_keys : static_keys,
            text_keys   : text_keys,
            special_keys: special_keys,
            data: data,
            certifiers: certifiers,
            confirm_err: '',
            is_submitable: true,
        },
        methods: {
            onLoadImage () {
                $('#image-file').click();
            },
            onAdd () {
                if (this.is_submitable == false)
                    return;

                const errs = [];
                for (let k in this.data) {
                    this._checkError(errs, this.data[k].length <= 0,
                        k + '을 작성해 주세요');
                }

                try {
                    JSON.parse(this.data['content']);
                }catch (e) {
                    this._checkError(errs, true,
                        'content가 올바른 JSON 형식이 아닙니다');
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
