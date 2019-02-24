
let vm_ = null;

function init (item, certificates) {

    item.additional_fields = JSON.parse(item.additional_fields);

    for (const ci in certificates) {
        const cert = certificates[ci];
        cert.content = JSON.parse(cert.content);
    }


    // find first one
    certificates = _makeSortedCertificates(certificates);

    vm_ = new Vue({
        el: '#app',
        data: {
            item: item,
            certificates: certificates,

            confirm_err: '',
            is_submitable: true,
        },
        methods: {
            onAddRandomCert () {
                const pre_cert_id = (this.certificates.length > 0)?
                    this.certificates[this.certificates.length-1].id:
                    null;
                window.location.href = '/certificates/add?pre_cert_id=' + pre_cert_id + '&item_id=' + this.item.id;
            },
            onBack () {
                window.location.href = '/';
            },
            _checkError (errs, condition, msg) {
                if (condition == true)
                    errs.push(msg);
            },
        },
    });
}

function _findFirstCert (certificates) {
    for (const ci in certificates) {
        const cert = certificates[ci];
        if (cert.pre_cert_id == null)
            return cert;
    }
}

function _makeSortedCertificates (certificates) {
    if (certificates.length <= 0)
        return certificates;

    const first_cert = _findFirstCert(certificates);

    const pre_cert_map = {};
    for (const ci in certificates) {
        const cert = certificates[ci];
        if (cert.pre_cert_id == null)
            continue;
        pre_cert_map[cert.pre_cert_id] = cert;
    }

    const result = [first_cert];
    while (true) {
        const last_cert = result[result.length-1];
        const pre_cert = pre_cert_map[last_cert.id];
        if (pre_cert == undefined)
            break;

        result.push(pre_cert);
    }

    return result;
}

