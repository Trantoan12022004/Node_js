import { where } from "sequelize";
import db from "../models/index";
import bcrypt from "bcryptjs";

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);
            if (isExist) {
                let user = await db.User.findOne({
                    where: { email: email },
                });
                if (user) {
                    let checkPassword = bcrypt.compareSync(
                        password,
                        user.password
                    );
                    if (checkPassword) {
                        userData.errCode = 0;
                        userData.errMessage = "ok";
                        userData.user = {
                            email: user.email,
                            roleId: user.roleID,
                            firstName: user.firstName,
                            lastName: user.lastName,
                        };
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = "sai mat khau";
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = "User not found";
                }
            } else {
                userData.errCode = 2;
                userData.errMessage = "User not found";
            }
            resolve(userData);
        } catch (error) {
            reject(error);
        }
    });
};

let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail },
            });
            if (user) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (error) {
            reject(error);
        }
    });
};
let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = "";
            if (userId === "ALL") {
                users = await db.User.findAll({
                    attributes: { exclude: ["password"] },
                });
            } else if (userId && userId !== "ALL") {
                users = await db.User.findOne({
                    attributes: { exclude: ["password"] },
                    where: { id: userId },
                });
            }
            resolve(users);
        } catch (error) {
            reject(error);
        }
    });
};

const deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        let user = await db.User.findOne({
            where: { id: userId },
        });
        if (!user) {
            resolve({
                errCode: 2,
                errMessage: "User not found",
            });
        }
        if (user) {
            await user.destroy();
            resolve({
                errCode: 0,
                errMessage: "User deleted successfully",
            });
        }
    });
};

const updateUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: data.id },
            });
            if (!user) {
                resolve({
                    errCode: 2,
                    errMessage: "User not found",
                });
            } else {
                await db.User.update(
                    {
                        firstName: data.firstName,
                        lastName: data.lastName,
                        email: data.email,
                        address: data.address,
                    },
                    {
                        where: { id: data.id },
                    }
                );
                resolve({
                    errCode: 0,
                    errMessage: "User updated successfully",
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

const createUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Kiem tra xem email da ton tai chu
            let check = await db.User.findOne({
                where: { email: data.email },
            });

            if (check) {
                resolve({
                    errCode: 1,
                    errMessage: "Email already in use",
                });
            } else {
                const hashPassword = await bcrypt.hash(data.password, 10);
                await db.User.create({
                    email: data.email,
                    password: hashPassword,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phonenumber: data.phoneNumber,
                    gender: data.gender,
                    roleID: data.roleId,
                    positionId: data.position,
                });
                resolve({
                    errCode: 0,
                    errMessage: "User created successfully",
                });
            }
        } catch (error) {
            reject({
                errCode: 2,
                errMessage: "Error from server",
            });
        }
    });
};


let getAllCodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let res = {};
            if (!typeInput) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter",
                });
            } else {
                let allcode = await db.Allcode.findAll({
                    where: {
                        type: typeInput,
                    },
                });
                res.errCode = 0;
                res.data = allcode;
                resolve(res);
            }
        } catch (error) {
            reject(error);
        }
    });
};

export default {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers,
    deleteUser: deleteUser,
    updateUser: updateUser,
    createUser: createUser,
    getAllCodeService: getAllCodeService,
};
