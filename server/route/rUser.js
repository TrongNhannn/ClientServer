var express = require('express');
const User = require('../Model/User');
var router = express.Router();
// var db = require("../Connect/Dbconnection")
const tables = require('../mongo/tables');
const { cropIMG } = require('../module/crop');

const { mongo } = require('../Connect/conect');
//@route GET api/user/GetAll
//@desc GetAll or GetById user
//@access Public
router.get('/getall/:credential_string', function (req, res) {
    if (req.params.credential_string) {
        try {
            User.getUser_detail(req.params.credential_string, function (err, rows) {
                if (err) {
                    return res.status(404).json({ success: false, error: "Lỗi!" });
                } else {
                    return res.status(200).json({ success: true, content: "Thành công", data: rows });
                }
            });
        } catch (error) {
            return res.status(500).json({ success: false, content: "Không tìm thấy!" });
        }
    }
});

//@route GET api/auth/getall
//@desc Get all users
//@access Public

router.get('/getall', function (req, res) {
    User.getAllUser(function (err, rows) {
        if (rows && rows.length > 0) {
            return res.status(200).json({ success: true, content: "Thành công", data: rows });
        } else {
            return res.status(404).json({ success: false, error: "Lỗi!" });
        }
    });
});

//@route POST api/auth/register
//@desc Register user
//@access Public
// router.post('/register',function(req,res){
//     try {
//         User.addUser(req.body,function(err,count){

//             if(err){ return res.status(500).json({ success: false, error: "Vui lòng nhập dữ liệu!" });
//             } else{
//                 return res.status(201).json({ data: count });
//             }
//         });
//     } catch (error) {
//        return res.status(500).json({success: false, message: error.message});
//     }

// });
//@route POST api/user/active
//@desc Update Role user
//@access Public
router.put('/active', function (req, res) {
    User.activeUser(req.body, function (err, count) {
        if (err) {
            return res.status(500).json({ success: false, content: "Cập nhật thất bại!" });
        } else {
            return res.status(201).json({ success: true, content: "Cập nhật thành công!" });
        }
    });
});
//@route POST api/user/changePassword
//@desc changepass user
//@access Public
router.put('/changePassword', async (req, res) => {
    User.user_change_password(req.body, function (err, count) {
        if (err) {
            return res.status(500).json({ success: false, content: "Cập nhật thất bại!" });
        } else {
            return res.status(201).json({ success: true, content: "Cập nhật thành công!" });
        }
    });
})
//@route POST api/user/changeInfo
//@desc change Info user
//@access Public
router.put('/changeInfo', async (req, res) => {
    User.user_change_info(req.body, function (err, count) {
        if (err) {
            return res.status(500).json({ success: false, content: "Cập nhật thất bại!" });
        } else {
            return res.status(201).json({ success: true, content: "Cập nhật thành công!" });
        }
    });
})

router.delete('/delete/:credential_string', async (req, res) => {
    const { credential_string } = req.params;

    mongo( dbo => {
        dbo.collection( tables.accounts ).deleteOne({ credential_string }, (err, result) => {
            return res.status(200).json({ success: true, content: "Xóa thành công gòi nè" });
        })
    })

})
router.put('/update-user/:id', async (req, res) => {
    try {
       const { credential_string } = req.params;
      const updatedUserData = req.body;
  
      await client.connect();
      const database = client.db('nhantestmongo');
      const collection = database.collection('accounts');
  
      const filter = { credential_string: new ObjectId(credential_string) };
      const update = { $set: updatedUserData };
      const result = await collection.updateOne(filter, update);
  
      if (result.modifiedCount === 0) {
        res.status(404).json({ message: 'User not found or no changes made' });
      } else {
        res.status(200).json({ message: 'User updated successfully' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error occurred while updating user', error });
    } finally {
      await client.close();
    }
  });
  
  router.put('/update/:credential_string', (req, res) => {
    const { _id, account_string, account_role, account_role_label, fullname, email, phone, address, credential_string, account_status, avatar, user, name } = req.body;
    const { credential_string: credentialParam } = req.params;
    console.log(req.body);
  
    mongo(dbo => {
      dbo.collection(tables.accounts).updateOne({ credential_string: credentialParam }, {
        $set: {
          _id,
          account_string,
          account_role,
          account_role_label,
          fullname,
          email,
          phone,
          address,
          credential_string,
          account_status,
          avatar,
          user,
          name
        }
      }, (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).send({ success: false, message: 'Error updating user' });
        } else {
          if (result.matchedCount > 0) {
            res.status(200).send({ success: true });
          } else {
            res.status(404).send({ success: false, message: 'User not found' });
          }
        }
      });
    });
  });
  
router.put(`/:credential_string/changeava`, (req, res) => {
    const { img } = req.body;
    const { credential_string } = req.params;
    cropIMG( img, credential_string, ({ success, avatar }) => {
        mongo( dbo => {
            dbo.collection( tables.accounts ).updateOne({ credential_string },
                { $set: { avatar: avatar } },
                (err, result)=> {
                res.status(200).send({ success: true })
            })
        })
    })
})
module.exports = router;
