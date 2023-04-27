const { role, Sequelize } = require("../models");
let self = {};

/**
* @description Get All Roles
* @type GET
* @path /roles
* @param {*} req
* @param {*} res
* @returns JSON
*/
self.getAll = async (req, res) => {
    try {
        let data = await role.findAll({});
        if (data) {
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
}

/**
* @description Create New Role
* @type POST
* @path /roles/
* @param {*} req
* @param {*} res
* @returns JSON
*/
self.createRole = async (req, res) => {

    // check for empty fields
    if (!req.body.role) {
        return res.status(400).send({
            success: false,
            message: "Role can not be empty!"
        });
    }
    try {

        //  check if role exists in db
        const find_role = await role.findOne({ where: { role: req.body.role } });

        // return 406 status code if role exists
        if(find_role && find_role.role) {
            return res.status(406).send({
                success: false,
                message: "Role already exists"
            })
        }

        //  create new role in db
        const newRole = {
            role: req.body.role
        };
        let data = await role.create(newRole);
        return res.status(201).json({
            success: true,
            data: data
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error
        })
    }
}

module.exports = self;