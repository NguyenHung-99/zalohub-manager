var express = require('express');
var router = express.Router();
require('dotenv').config()
var dateFormat = require('dateformat');
const usersDAO = require('../daos/user.dao');
var uuid = require('uuid');



/* GET home page. */
router.get('/', async function(req, res, next) {
    const users = await usersDAO.getAll();

    res.render('index', { datas: users, });
});
router.get('/login', function(req, res, next) {


    res.render('loginForm', { message: '' });
});
router.get('/new', ((req, res) => {
    res.render('createForm');
}));


router.post('/users', async function(req, res, next) {
    idAu = uuid.v1();
    ngaysinh = req.body.ngaySinh;
    console.log(dateFormat(Date.now(), "dd-mm-yyyy"));
    console.log(dateFormat(ngaysinh, "dd-mm-yyyy"));
    const user = {
        id: String(idAu),
        phone: req.body.phone,
        user_name: req.body.user_name,
        gioiTinh: req.body.gioiTinh,
        ngaySinh: dateFormat(ngaysinh, "dd-mm-yyyy"),
        avata: 'https://picsum.photos/id/237/200/300',
        ngayTao: dateFormat(Date.now(), "dd-mm-yyyy"),
        status: 'Active',
        role: 'User',
        password: '123',
    }
    const success = await usersDAO.add(user)
    if (success) {
        res.redirect('/')
    } else {
        res.status(400).send("Invalid")
    }
});


//method delete
router.get('/delete', async(req, res) => {
    const phone = req.query.phone;
    const name = req.query.name;
    console.log(phone);
    const success = await usersDAO.delete(phone);
    if (success) {
        res.redirect('/')
    } else {
        res.status(500).send(err);
    }


});
router.get('/update', async(req, res) => {
    const phone = req.query.phone;
    const name = req.query.name;
    const user = await usersDAO.getSingleById(phone);

    res.render('updateForm', { user: user });

});
router.post('/confirmation', async function(req, res, next) {
    const phone = req.body.phone;
    const pass = req.body.password;
    const user = await usersDAO.getSingleById(phone);
    const users = await usersDAO.getAll();
    if (user) {
        if (pass === user.password && user.role === 'User') {
            res.render('loginForm', { message: 'Tài khoản không được cấp quyền!!!' })
        } else if (pass === user.password && user.role === 'Admin') {
            res.render('index', { userphone: user, datas: users, })
        } else if (pass !== user.password) {
            res.render('loginForm', { message: 'Sai Mật khẩu!!!' })
        }
    } else {
        res.render('loginForm', { message: 'Số điện thoại không tồn tại!!!' })
    }

});
router.post('/update/:phone/:user_name', async function(req, res, next) {
    const phone = req.params.phone;
    const name = req.params.user_name;

    //file
    // let files = req.files;
    // console.log(files);
    // let avata = await files.avata;
    // console.log(avata);
    // const uploadS3 = await usersDAO.uploadAvatar(avata);


    const user = await usersDAO.getSingleById(phone);
    console.log(user);
    const userUpdate = {
        role: req.body.role,
        phone: req.params.phone,
        user_name: req.params.user_name,
        //avata: uploadS3,
        avata: user.avata,
        ngaySinh: user.ngaySinh,
        id: user.id,
        gioiTinh: user.gioiTinh,
        ngayTao: user.ngayTao,
        status: req.body.status,
        password: user.password,

    };
    console.log(userUpdate);
    const success = await usersDAO.update(userUpdate);
    if (success) {
        res.redirect('/')
    } else {
        res.status(400).send("Invalid")
    }

});

module.exports = router;