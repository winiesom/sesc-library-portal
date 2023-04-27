const self = {};
const { account, book, role } = require("../models");
const { Op } = require('sequelize');


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
    const { page = 1, pageSize = 10, search = '' } = req.query;
    const offset = (page - 1) * pageSize;

  let data = await book.findAndCountAll({
    where: {
      title: {
        [Op.like]: `%${search}%`
      }
    },
    limit: pageSize,
    offset: offset
  });


    if(data.count > 0) {
      return res.status(200).json({
        success: true,
        count: data.count,
        data: data
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "No books found"
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};



self.addBook = async (req, res) => {

  const  { isbn, title, author, year, copies, max_days } = req.body;

  if(!isbn || !title || !author || !year || !copies || !max_days) {
    return res.status(400).send({
      success: false,
      message: "Fields cannot be empty"
    })
  }

  try {

    const find_role = req.role_id;

    if(find_role !== 1) {
      return res.status(401).send({
        success: false,
        message: "You are not authorized to carry out this action"
      })
    }

    const find_book = await book.findOne({ where: { isbn } });

    if(find_book) {
      return res.status(406).send({
        success: false,
        message: "Book already exists"
      })
    }

    const newBook = {
      isbn, 
      title, 
      author, 
      year, 
      copies,
      max_days
    };

    let data = await book.create(newBook);
    return res.status(201).json({
      success: true,
      data: data
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error,
      message: "Bad request"
  })
}
}

self.updateBook = async (req, res) => {
  
  const { id } = req.params;
  const updatedBook = req.body;
  console.log(updatedBook, 'jajaja')

  
  try {

    const find_role = req.role_id;
    
    if(find_role !== 1) {
      return res.status(401).send({
        success: false,
        message: "You are not authorized to carry out this action"
      });
    }
    
    const bookRecord = await book.findOne({ where: { id } });
    
    if (!bookRecord) {
      return res.status(404).json({
        message: `Book with id ${id} does not exist`
      });
    }
    
    await book.update(updatedBook, { where: { id } });
    
    const updatedBookRecord = await book.findOne({ where: { id } });
    return res.json(updatedBookRecord);
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};

self.deleteBook = async (req, res) => {
  const { id } = req.params;
  
  try {
    const find_role = req.role_id;
    
    if(find_role !== 1) {
      return res.status(401).send({
        success: false,
        message: "You are not authorized to carry out this action"
      });
    }
    
    const bookRecord = await book.findOne({ where: { id } });
      
    if (!bookRecord) {
      return res.status(404).json({
        message: `Book with id ${id} does not exist`
      });
    }
    
    await book.destroy({ where: { id } });
      
    return res.json({
      success: true,
      message: `Book with id ${id} has been deleted`
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};


module.exports = self;

