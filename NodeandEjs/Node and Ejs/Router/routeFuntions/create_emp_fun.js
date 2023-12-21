const emp_tab = require('../../Model/emp_table')
const Emp_Details = require('../../Model/emp_details_tb')
const create_emp_fun = (req, res) => {
    const { name, email, doj, dob, gender, designation, comments } = req.body
    console.log(email)

    const select_from_emp = `SELECT * FROM Emp_Table WHERE Email = "${email}"`

    emp_tab.query(select_from_emp, (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            res.json({
                status: 400,
                error: 'employee',
                message: "Employee email already Exist"
            })
        } else {
            const insert_emp_tab = `INSERT INTO Emp_Table (Emp_name,Email,Designation) VALUES (?,?,?)`

            const insert_format = emp_tab.format(insert_emp_tab, [`${name}`, `${email}`, `${designation}`])

            emp_tab.query(insert_format, (err, result1) => {

                try {
                    if (err) throw err;

                    const id = result1.insertId

                    const insert_emp_details_tb = `INSERT INTO Emp_Details (id,Doj,Dob,Gender,Comment) VALUES (?,?,?,?,?)`

                    const insert_details_format = Emp_Details.format(insert_emp_details_tb, [id, doj, dob, gender, comments])

                    Emp_Details.query(insert_details_format, (err, result2) => {
                        try {
                            if (err) throw err;
                            res.json({
                                status: 200,
                                message: "Employee details created Successfully "
                            })
                        } catch (err) {
                            res.json({
                                status: 501,
                                error: 'sql',
                                message: "Internal server error"
                            })
                        }

                    })
                } catch (err) {
                    res.json({
                        status: 500,
                        error: 'sql',
                        message: 'Internal server error'
                    })
                }




            })

        }
    })



}

module.exports = { create_emp_fun }