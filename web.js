/**
 * Created with JetBrains WebStorm.
 * User: thanhquanky
 * Date: 5/20/13
 * Time: 10:21 AM
 * To change this template use File | Settings | File Templates.
 */

var express = require('express'),
    mongoose = require('mongoose'),
    qs = require('querystring')

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId

var ContactSchema = new Schema({
    id: ObjectId,
    name: String,
    phone: String,
    email: String
});

var Contact = mongoose.model('contact', ContactSchema);

var app = express();


var uristring = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/contacts';


mongoose.connect(uristring, function (err, res) {
    if (err) {
        console.log ('ERROR connecting to: ' + uristring + '. ' + err);
    } else {
        console.log ('Succeeded connected to: ' + uristring);
    }
});

/* App configuration */
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.set('view options', {layout: false});


/* Static */
app.use(express.static("public"));
app.use(express.bodyParser());
//app.use(app.router);
/* Define routes */

app.get('/', function(req, res) {
    res.render('index');
});

app.post('/contacts/add', function(req, res) {
    if (req.body.contact) {
        var myContact = new Contact({
            name: req.body.contact.name,
            phone: req.body.contact.phone,
            email: req.body.contact.email
        });
        myContact.save(function (err) {
            if (!err) {
                res.send(200, JSON.stringify(myContact));
                return res.end();
            }
            else {
                res.send(500, "Something is wrong here");
                return res.end();
            }
        });
    }
});

app.put('/contacts/update', function(req, res) {
    var contact = req.body.contact;
    if (contact) {
        delete contact['$$hashkey'];
        Contact.findByIdAndUpdate(contact._id, {
            name: contact.name,
            phone: contact.phone,
            email: contact.email
        },
        function(err, doc) {
            if (err) {
                res.status(500);
                return res.end(err);
            }
            res.status(200);
            return res.end();
        });
    }
    res.status(200);
    return res.end();
});

app.delete('/contacts/delete', function(req, res) {
    var contact = req.body.contact;
    if (contact) {
        delete contact['$$hashkey'];
        Contact.findByIdAndRemove(contact._id,
        function(err, doc) {
            if (err) {
                res.status(500);
                return res.end(err);
            }
            res.status(200);
            return res.end();
        });
    }
    res.status(200);
    return res.end();
});

app.get('/contacts/get', function(req, res) {
    Contact.find().exec(function(err, contacts) {
        return res.end(JSON.stringify(contacts));
    });
});

/* Listen */
app.listen(process.env.PORT || 5000);


