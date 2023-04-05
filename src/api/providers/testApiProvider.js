const axios = require('axios');

const baseurl ="https://dummyjson.com"

exports.getRandomText = async () => {
    let id = Math.floor(Math.random() * 100);
    const response = await axios.get(`${baseurl}/posts/${id}`);
    return response.data;
}
 