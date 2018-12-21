import express from 'express';
import bodyparser from 'body-parser';
import mongoose, { Schema } from 'mongoose';
import { Router } from 'express';

const app = express();
const route = new Router();

app.use(bodyparser.json());

app.use('/api', route);
app.use('/', (request, response) => {
    response.send('Hello World');
});

app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});

/**
 * Mongodb connection
 */

const uri = "mongodb://localhost/nodejs";
const initiatemongodb = mongoose.connect(uri, { useNewUrlParser: true });
initiatemongodb.catch(err => console.log(`Error occured during db connection ${err}`));

mongoose.connection.once('open', () => {
    console.log('Successfully connected to the database');
});

const studentSchema = new Schema({
    studentName: String,
    studentID: Number,
    studentAge: Number,
    studentLocation: String
});

const student = mongoose.model('student', studentSchema);


route.get('/students', (req, res) => {
    student.find().then(stud => {
        res.status(200).json(stud);
    }).catch(err => {
        res.status(500).send(err);
    })
})

route.post('/add-student', (req, res) => {
    student.insertMany(req.body).then(stud => {
        res.status(201).json(stud);
    }).catch(err => {
        res.status(404).send(err);
    })
})

route.put('/update-student/:age', (req, res) => {
    //const updateStud = student.findOne({ studentAge: req.params.age }).update(req.body)
    student.findOneAndUpdate({ studentAge: req.params.age }, req.body).then(stud => {
        res.status(200).json(stud);
    }).catch(err => {
        res.status(400).send(err);
    })
})


route.delete('/delete-student/:age', (req, res) => {
    student.findOneAndRemove({ studentAge: req.params.age }).then(stud => {
        res.status(200).json(stud);
    }).catch(err => {
        res.status(404).send(err);
    })
})