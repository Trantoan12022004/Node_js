import db from "../models/index";
import userServices from "../service/userServices";

let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: "nhập email và password",
        });
    }
    let userData = await userServices.handleUserLogin(email, password);
    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user,
    });
};

// let handleGetAllUsers = async (req, res) => {
//     let id = req.query.id; //all single
//     let users = await userServices.getAllUsers(id);

//     return res.status(200).json({
//         errCode: 0,
//         errMessage: "Ok",
//         users,
//     });
// };

let handleGetAllUsers = async (req, res) => {
    let id = req.query.id; // "ALL" or a single user ID
    try {
        let users = await userServices.getAllUsers(id);
        if (!id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: "Không tìm thấy Id",
                users: "",
            });
        }
        return res.status(200).json({
            errCode: 0,
            errMessage: "Ok",
            users,
        });
    } catch (error) {
        return res.status(500).json({
            errCode: 1,
            errMessage: "Error from server",
        });
    }
};

let handleDeleteUser = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing required parameter444444",
        });
    }

    let message = await userServices.deleteUser(req.body.id);
    return res.status(200).json(message);
};

let handleUpdateUser = async (req, res) => {
    let data = req.body;
    if (
        !data.id ||
        !data.firstName ||
        !data.lastName ||
        !data.email ||
        !data.address
    ) {
        return res.status(400).json({
            errCode: 1,
            errMessage: "Missing required parameters",
        });
    }
    try {
        let message = await userServices.updateUser(data);
        return res.status(200).json(message);
    } catch (error) {
        return res.status(500).json({
            errCode: 1,
            errMessage: "Error from server",
        });
    }
};

const handleCreateUser = async (req, res) => {
    let data = req.body;
    console.log("check", data)
    try {
        let message = await userServices.createUser(data);
        return res.status(201).json(message);
    } catch (error) {
        return res.status(500).json({
            errCode: 1,
            errMessage: "Error from server",
        });
    }
};

let getAllCode = async (req, res) => {
    try {
        setTimeout(async () => {
            let data = await userServices.getAllCodeService(req.query.type);
            return res.status(200).json(data);
        }, 1000);
    } catch (error) {
        console.log("Get all code error:", error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};

module.exports = {
    handleLogin: handleLogin,
    handleGetAllUsers: handleGetAllUsers,
    handleDeleteUser: handleDeleteUser,
    handleUpdateUser: handleUpdateUser,
    handleCreateUser: handleCreateUser,
    getAllCode: getAllCode,
};
