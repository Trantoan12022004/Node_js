import db from "../models/index";
import CRUDservices from "../service/CRUDservices";
let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();

        return res.render("homepage.ejs", {
            data: JSON.stringify(data),
        });
    } catch (e) {
        console.log(e);
    }
};

let getAboutPage = (req, res) => {
    return res.render("test/about.ejs");
};

let getCRUD = (req, res) => {
    return res.render("crud.ejs");
};

let postCRUD = async (req, res) => {
    let message = await CRUDservices.createNewUser(req.body);
    console.log(message);
    return res.send("post crud from sever");
};

let displayGetCRUD = async (req, res) => {
    let data = await CRUDservices.getAllUser();
    return res.render("displaycrud.ejs", {
        dataTable: data,
    });
};

let getEditCRUD = async (req, res) => {
    let userId = req.query.id;
    if (userId) {
        let userData = await CRUDservices.getUserinfoById(userId);
        return res.render("edit-CRUD.ejs", {
            user: userData,
        });
    } else {
        return res.send("User not found");
    }
};

let putCRUD = async (req, res) => {
    let data = req.body;
    let allUsers = await CRUDservices.updateUserData(data);
    return res.render("displayCRUD.ejs", {
        dataTable: allUsers,
    });
    // return res.send("update done!");
};

let deleteCRUD = async (req, res) => {
    let id = req.query.id;
    await CRUDservices.deleteUserById(id);
    return res.send("delete user succeed!")
};
module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayGetCRUD: displayGetCRUD,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD,
};
