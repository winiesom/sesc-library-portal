const self = {};
const { account, book, role, borrow } = require("../models");
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
    if (req.role_id !== 1) {
        return res.status(403).send({
            success: false,
            message: "You are not authorized to view this data"
        });
    }

    try {

        let data = await borrow.findAll({
            where: {
                returned: false
            }
        });
        if(data) {
            return res.status(200).json({
                success: true,
                count: data.length,
                data: data
            })
        }
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error
        })
    }
   
};

/**
 * @description Get All Books
 * @type GET
 * @path /books
 * @param {*} req
 * @param {*} res
 * @returns JSON
 */
self.getAllStudent = async (req, res) => {
    try {
        let data = await borrow.findAll({
            where: {
                account_id: req.account_id,
                returned: false
            }
        });
        if(data) {
            return res.status(200).json({
                success: true,
                count: data.length,
                data: data
            })
        }
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error
        })
    }
};


/**
 * @description Borrow Book
 * @type POST
 * @path /borrow
 * @param {*} req
 * @param {*} res
 * @returns JSON
 */


self.borrowBook = async (req, res) => {
    const { book_id, account_id, returned } = req.body;

     // Check if the currently logged-in account_id is the same as the one trying to borrow a book
     if (req.account_id !== account_id) {
        return res.status(403).send({
            success: false,
            message: "You are not authorized to borrow a book for another user"
        });
    }


    if (!book_id || !account_id || returned !== false) {
        return res.status(400).send({
            success: false,
            message: "Fields can not be empty!"
        });
    }

try {
    const find_role = await account.findOne({ where: { role_id: 2, account_id: account_id } });
    if(!find_role) {
        return res.status(400).send({
            success: false,
            message: "You cannot carry out this action"
          })
    }

    const find_max_days = await book.findOne({ where: { id: book_id } });
    let max_days;
    if(find_max_days) {
        max_days = find_max_days.max_days
    }



    const find_book = await book.findOne({ where: { id:book_id, copies: { [Op.gt]: 0 } } })
    if(!find_book) {
        return res.status(404).send({
            success: false,
            message: "The book you are trying to borrow does not exist"
          })
    }
  

    const find_borrowed_book = await borrow.findOne({ 
        where: { 
          book_id: book_id,
          account_id: account_id,
          returned: false  
        } 
      });
      
    if (find_borrowed_book) {
        return res.status(406).send({
          success: false,
          message: "You already borrowed this book"
        });
      }
      
    

    const newBorrow = {
        account_id,
        book_id,
        returned
    }

    let data = await borrow.create(newBorrow)
  

    const updatedBook = {
        ...find_book.toJSON(),
        copies: find_book.copies - 1
      };
      await book.update(updatedBook, { where: { id: book_id } });
  
      console.log(updatedBook, 'updatedBook')

    return res.status(201).json({
        success: true,
        data: data,
        max_days: max_days
    })



} catch(error) {
    return res.status(500).json({
        success: false,
        error: error
    })
}
}


module.exports = self;

