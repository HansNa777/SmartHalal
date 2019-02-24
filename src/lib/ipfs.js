const ipfsAPI = require('ipfs-api');


module.exports = {
    ipfs: ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'}),

    async addFile (buffer) {
        return new Promise((resolve, reject) => {
            this.ipfs.files.add(buffer, (err, file) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(file);
            });
        });
    },

    async getFiles (hash) {
        return new Promise((resolve, reject) => {
            this.ipfs.files.get(hash, (err, files) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(files);
            });
        });
    },
}

