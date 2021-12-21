module.exports = {
  displayTrueFalse: function (object) {
    return {
      ...object,
      attending:
        object.attending === 1 || object.attending === true ? true : false,
    };
  },
};
