const router = require('express').Router();
const conn = require("../db/connection");


///////////////////////////////////////////////read reader///////////////////////////////
router.get("/", function (req, res) {
  conn.query("select * from  users where ?", { Type: "reader" }, (error, result, fields) => {
    res.json(result);
  });
});


//////////////////////////////////////////////add reader/////////////////////////////////
router.post("/", function (req, res) {
  const data = req.body;
  if (!data.email || !data.password || !data.phone) {
    return res.json({ status: "error", message: "please Enter your data" })
  }
  else {
    conn.query('SELECT email FROM users WHERE email = ?', [email], (error, result) => {
      if (error) {
        res.json({ message: "this reader already exist" });
      }
      else {
        const password = bcrypt.hashSync(data.password, 8);
        conn.query("INSERT INTO users set ?",
          { Email: data.Email, password: password, phone: data.phone },
          (error, result, fields) => {
            if (error) {
              res.statusCode = 500;
              res.json({
                message: "reader not added",
              });
            }
            else {
              res.json({
                message: "reader added",
              });
            }
          })
      }
    });
  }
});


/////////////////////////////////////////// show specific reader/////////////////////////////
router.get("/:id", function (req, res) {
  const { id } = req.params;
  conn.query("select * from users where id = ? and Type = 'reader'", id, (error, result, fields) => {
    if (result.length == 0) {
      res.json({
        message: "reader not found",
      });
    }
    else {
      res.json(result);
    }
  })
});


///////////////////////////////////////////// update reader /////////////////////////
router.put("/:id", function (req, res) {
  const { id } = req.params;
  const data = req.body;
  const password = bcrypt.hashSync(data.password, 8);
  conn.query("update users set ? where id = ?",
    [{ Email: data.Email, password: password, phone: data.phone }, id], (err, result) => {
      if (result.affectedRows == 0) {
        res.json({
          message: "failed to update",
        });
      }
      else {
        res.json(result);
      }
    })
});


///////////////////////////////////////////////// delete reader /////////////////////////
router.delete("/:id", function (req, res) {
  const { id } = req.params;
  conn.query("delete from users where id = ?", id, (err, result) => {
    if (result.affectedRows == 0) {
      res.json({
        message: "failed to delete",
      });
    }
    else {
      res.json({
        message: "reader delete",
      });
    }
  })
});


module.exports = router;