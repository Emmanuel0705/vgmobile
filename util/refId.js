exports.generateReferralId = () => {
    return Math.floor(Math.random() * 9000) + 1000 + "" + stringGen(2);
};

function stringGen(len) {
    var text = "";
    var charset = "abcdefghijklmnopqrstuvwxyz";

    for (var i = 0; i < len; i++)
        text += charset.charAt(Math.floor(Math.random() * charset.length));

    return text.toUpperCase();
}
