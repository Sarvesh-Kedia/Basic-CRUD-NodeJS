const express = require('express');
const app = express();
const bodyParser= require('body-parser');

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
var mongoose = require('mongoose');
var mongo = require('mongodb');
var Form = require('./models/formSchema');

var db;


mongoose.connect('mongodb://localhost/forms')
mongoose.Promise = global.Promise;

app.listen(5000, function() {
    console.log('listening on 5000')
});

/*  
//For online database access

MongoClient.connect('mongodb+srv://Sarvesh:passwordispassword@cluster0-gbqnx.mongodb.net/test?retryWrites=true', (err, client) => {
    if (err) return console.log(err)
    db = client.db('details') // whatever your database name is
    app.listen(5000, function() {
        console.log('listening on 5000')
    });
});
*/

app.use(bodyParser.json()); //middleware
app.use(bodyParser.urlencoded({extended: true})) //middleware

app.use('/', function(req, res, next){
    console.log("A request for things received at " + Date.now());
    next();
});

 app.set('view engine', 'ejs');

app.post('/dashboard/post', function(req, res) {

    Form.create(req.body).then(function(newForm){
        res.send(newForm);
    });

    res.redirect('../submit-success');

    // db.collection('forms').save(req.body, (err, result) => {
    //     if (err){
    //         return console.log(err);
    //     }
    //     console.log(req.body);
    //     console.log('saved to database');
    //     res.redirect('submit-success');
    // });

});

app.get('/', function(req, res) {
    
    Form.find().exec(function(err, result){
        res.render('form', {forms: result});
        //response.send(result);
    })
    // res.render('form');
    console.log('form page rendered');
});

app.get('/submit-success', function(req, res) {
    //res.render('form', {forms: res});
    res.render('submit-success');
    console.log('submit page rendered');
});

app.get('/delete/:id', function(req, res) {
    var id = ObjectID(req.params.id);
    console.log(req.query)
    //console.log(req.params.params);
    //console.log('delete route');

    Form.remove({"_id": id }, function(err, result){
        if (err) {console.log(err)}
        else {console.log("Removed");}

        console.log(result);
        res.redirect('/get-all');
    });

})


app.post('/update', function(req, res) {
    
    
    var id = ObjectID(req.body.id);
    // console.log("id: "+id)
    //console.log(req)
    var name = req.body.name;
    var email = req.body.email;
    var subject = req.body.subject;
    var message = req.body.message;

    Form.updateOne(
        {"_id": id},
        {$set: {
            "name": name,
            "email": email,
            "subject": subject,
            "message": message
        }},

    ).exec().then((data)=> {
        console.log(data);
        res.redirect('/get-all');

    })
    
    // res.redirect('get-all');

    // , function(response, error){
    //     if(error)
    //         console.log(error)

    //     console.log(response);
    // }

})

app.get('/get-one', (request, response) => {

    let id = ObjectID(request.query.fid);
    //console.log(request.query.fid)
    
    Form.find().where('_id', id).exec(function(err, result){
        response.render('get-one', {forms: result});
        //response.send(result);
    })

    //response.send(result);
    
    // db.collection('forms').find({'_id':id}).toArray( (err, result) => {
    //     if(err) {
    //       throw err;
    //     }
    //     response.render('get-one', {forms: result});
    //     //response.send(result);
    // });
    // console.log('displaying required form');
});

app.get('/get-one-email', (request, response) => {

    let id = request.query.emailid;
    // /console.log(request)

    Form.find().where('email', id).exec(function(err, result){
        //console.log(result);
        response.render('get-one', {forms: result});
        // response.send(result);

    })

    // db.collection('forms').find({'email':id}).toArray( (err, result) => {
    //     if(err) {
    //       throw err;
    //     }
    //     response.render('get-one', {forms: result});
    //     //response.send(result);
    // });
    console.log('displaying required form');
});

app.get('/get-all', (request, response) => {
    
    console.log("displaying all the forms");
    Form.find().exec(function(err, result){
        response.render('get-all', {forms: result});
        //response.send(result);
    })
    
    
    // console.log("displaying all the forms");
    // db.collection('forms').find({}).toArray((error, result) => {
    //     if(error) {
    //         return response.status(500).send(error);
    //     }
    //     //response.send(result);
    //     response.render('get-all', {forms: result});    //first parameter is the file to render. second one is data to apss to the file
    // });
});


// app.get('*', function(req, res) {
//     res.render('error');
//     console.log('error page rendered');
// });



