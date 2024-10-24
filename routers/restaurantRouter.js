const express = require('express');
const router = express.Router();

const db = require('../db/db');

//get all restaurants 
router.get('/', async (req, res) => {
    // const result_row = await db.query('select * from restaurant');
    const result_row = await db.query("SELECT * FROM restaurant left join (SELECT restaurant_id,COUNT(*),TRUNC(AVG(rating),1) as average_rating from reviews group by restaurant_id) reviews on  restaurant.ID=reviews.restaurant_id")
    res.status(200).json({ data: { restaurant: result_row.rows }, status: "success", result: result_row.rowCount })
})

//insert new record
router.post('/', async (req, res) => {
    console.log(req.body)
    try {
        const insert_result = await db.query("INSERT INTO restaurant(name,location ,price_range) VALUES($1,$2,$3) returning *", [
            req.body.name,
            req.body.location,
            req.body.price_range
        ])
        console.log(insert_result);
        res.status(201).json({
            status: "success",
            message: "data inserted successfully",
            data: { restaurant: insert_result.rows[0] }
        })
    } catch (e) {
        console.log(e)
    }

})

router.post('/:id/addReview', async (req, res) => {
    try {
        const insert_review = await db.query("INSERT INTO reviews(restaurant_id,name,review,rating)VALUES($1,$2,$3,$4) returning *", [
            req.params.id,
            req.body.name,
            req.body.review,
            req.body.rating
        ]);
        res.status(200).json({
            status: "success",
            data: insert_review.rows[0]
        })
    } catch (e) {
        console.log(e)
    }
})


//using query param

router.route('/:id').get(async (req, res) => {
    try {

        const id = req.params.id
        //one way
        // const result_row = await db.query(`select * from restaurant where id=${id}`)
        //another way
        const result_row = await db.query({
            name: "fetch-restaurant",
            // text: "SELECT * FROM restaurant where id = $1",
            text:'SELECT * FROM restaurant left join (SELECT restaurant_id,COUNT(*),TRUNC(AVG(rating),1) as average_rating from reviews group by restaurant_id) reviews on  restaurant.ID=reviews.restaurant_id where id=$1',
            values: [id]
        })
        const review_rows = await db.query("select * from reviews where restaurant_id=$1", [id])
        res.status(200).json({
            status: "success",
            data: {
                restaurant: result_row.rows[0],
                reviews: review_rows.rows
            }
        })
    } catch (e) {
        console.log(e)
    }
}).put(async (req, res) => {
    try {

        const update_result = await db.query("UPDATE restaurant SET name=$1,location=$2,price_range=$3 WHERE id=$4 returning *", [
            req.body.name,
            req.body.location,
            req.body.price_range,
            req.params.id
        ]);

        res.status(201).json({
            status: "success",
            data: {
                restaurant: update_result.rows[0]
            }
        })

    } catch (e) {
        console.log(e)
    }

}).delete(async (req, res) => {
    try {
        const delete_result = await db.query("DELETE FROM restaurant WHERE id= $1", [req.params.id])
        console.log(delete_result);
        res.status(200).json({
            status: "success",
            message: "Record deleted successfully",
            id: req.params.id
        })
    } catch (e) {
        console.log(e)
    }
})

module.exports = router;