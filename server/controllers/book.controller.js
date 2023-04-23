const self = {};

/**
 * @description Get All Books
 * @type GET
 * @path /books
 * @param {*} req
 * @param {*} res
 * @returns JSON
 */
self.getAll = async (req, res) => {
  try {
    const books = "All books";
    res.json(books);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error
  })
  }
};


self.addBook = async (req, res) => {
  try {
    const books = "Add book";
    res.json(books);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error
  })
}
}



module.exports = self;

