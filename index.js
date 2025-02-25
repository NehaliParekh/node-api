const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const mongoose = require('mongoose');
// const { createCanvas, loadImage } = require('canvas');
// const sharp = require('sharp')
const app = express();
const upload = multer({ dest: 'AnnotatedFiles/' });
app.use(function (req, res, next) {
    const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://agp-dental-dental.mdbgo.io',
        'https://agp-ui-dental.mdbgo.io'
    ];

    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
    }
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Accept-Encoding, Accept-Language, Connection, Host, Referer, Sec-Ch-Ua, Sec-Ch-Ua-Mobile, Sec-Ch-Ua-Platform, Sec-Fetch-Dest, Sec-Fetch-Mode, Sec-Fetch-Site, User-Agent");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }
    next();
});

// const corsOptions = {
//     origin: '*', // Replace this with the allowed origin
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Specify allowed methods
// };
   app.use(cors())
//app.use(cors(corsOptions));
app.use(express.json({ limit: '10000mb' }));
app.use(express.urlencoded({ limit: '10000mb', extended: true }));
async function connectToDatabase() {
    try {
        await mongoose.connect('mongodb://agp-ui_agp:Dental%40123@mongo.db.mdbgo.com:8604/agp-ui_agpui', {
        });
        console.log('Connected to the database');
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
}
connectToDatabase();
const PracticeListSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    contactNo: {
        type: String,
        required: true,
    }
}, {
    collection: "PracticeList"
})
const PracticeList = new mongoose.model('practiceList', PracticeListSchema)
const PatientSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    telephone: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    date_of_birth: {
        type: String,
        required: false,
    },
    reference_dob_for_age: {
        type: String,
        required: false,
    },
    guardian_first_name: {
        type: String,
        required: false,
    },
    guardian_last_name: {
        type: String,
        required: false,
    },
    guardian_relationship: {
        type: String,
        required: false,
    },
    address: {
        type: String,
        required: true,
    },
    is_active: {
        type: Boolean,
        required: true,
    },
    created_on: {
        type: String,
        required: true,
    },
    created_by: {
        type: String,
        required: true,
    },
    modified_on: {
        type: String,
        required: false,
    },
    modified_by: {
        type: String,
        required: false,
    },
    practiceId: {
        type: String,
        required: true,
    },
}, {
    collection: "Patient"
})
const Patient = new mongoose.model('patient', PatientSchema)
const ClassNameSchema = new mongoose.Schema({
    className:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    color:{
        type:String,
        required:true,
    },
    yt_url1:{
        type:String,
        required:true,
    },
    yt_url2:{
        type:String,
        required:false,
    },
    thumbnail1:{
        type:String,
        required:true,
    },
    thumbnail2:{
        type:String,
        required:false,
    },
    created_on:{
        type:String,
        required:true,
    },
    created_by:{
        type:String,
        required:true,
    },
    modified_on:{
        type:String,
        required:false,
    },
    modified_by:{
        type:String,
        required:false,
    },
    is_deleted:{
        type:Boolean,
        required:true,
    }
},{
    collection:'ClassNames'
})
const ClassName = new mongoose.model('className', ClassNameSchema)
const PatientVisitSchema = new mongoose.Schema({
    patientId: {
        type: String,
        required: true,
    },
    date_of_xray: {
        type: String,
        required: true,
    },
    notes: {
        type: String,
        required: false,
    },
    date_of_visit: {
        type: String,
        required: true,
    },
    summary: {
        type: String,
        required: false,
    },
    created_on: {
        type: String,
        required: true,
    },
    created_by: {
        type: String,
        required: true,
    }
}, {
    collection: "PatientVisits"
})
const PatientVisits = new mongoose.model('patientVisits', PatientVisitSchema)

const PatientImagesSchema = new mongoose.Schema({
    visitId: {
        type: String,
        required: true,
    },
    patientId: {
        type: String,
        required: true,
    },
    image_url: {
        type: String,
        required: true,
    },
    json_url: {
        type: String,
        required: true,
    },
    thumbnail_url: {
        type: String,
        required: true,
    },
    is_deleted: {
        type: Boolean,
        required: true,
    }
}, {
    collection: "PatientImages"
})
const PatientImages = new mongoose.model('patientImages', PatientImagesSchema)



app.get('/getPracticeList', async (req, res) => {
    try {
        const practiceList = await PracticeList.find()
        res.status(200).json({ practiceList })
    }
    catch (err) {
        res.status(500).json({ message: err })
    }
})
app.get('/getPatient', async (req, res) => {
    try {
        const practiceId = req.query.practiceId;
        const patientList = await Patient.find({
            "is_active": true,
            "practiceId": practiceId
        })
        res.status(200).json({ patientList })
    }
    catch (err) {
        res.status(500).json({ message: err })
    }
})

app.get('/getPatientByID', async (req, res) => {
    try {
        const patientId = req.query.patientId;
        const patientList = await Patient.findOne({
            "is_active": true,
            "_id": patientId
        }).sort({ date_of_visit: -1 });
        res.status(200).json({ patientList })
    }
    catch (err) {
        res.status(500).json({ message: err })
    }
})

app.post('/add-patient', async (req, res) => {
    try {
        if (await Patient.findOne({ "email": req.body.email })) {
            res.status(409).json({ message: "Patient already found" })
        }
        else {
            const date = new Date();
            const user = new Patient({
                "first_name": req.body.first_name, "last_name": req.body.last_name, "email": req.body.email, "telephone": req.body.telephone, "gender": req.body.gender,
                "date_of_birth": req.body.dob, "reference_dob_for_age": req.body.reference_dob_for_age, "guardian_first_name": req.body.guardian_first_name,
                "guardian_last_name": req.body.guardian_last_name, "guardian_relationship": req.body.guardian_relationship, "address": req.body.address,
                "is_active": req.body.is_active, "created_on": date.toUTCString(), "created_by": req.body.created_by, "practiceId": req.body.practiceId
            })
            await user.save()
            const user1 = await Patient.findOne({ "email": req.body.email })
            res.status(200).json({ user1 })
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ err })
    }
})

app.post('/add-className', async(req,res)=>{
    try{
        const thumbnail1Base64 = req.body.thumbnail1Base64;
        const fileName1 = req.body.fileName1;
        const date = new Date();
        const thumbnailData1 = thumbnail1Base64.replace(/^data:image\/\w+;base64,/, "");
        const thumbnailBinaryData1 = Buffer.from(thumbnailData1, 'base64');
        const thumbnailPath1 = path.join(__dirname, 'AnnotatedFiles', 'Thumbnail', `T${fileName1}`);
            // Save thumbnail
            await fs.promises.writeFile(thumbnailPath1, thumbnailBinaryData1);
        let thumbnailPath2= null
        if(req.body.thumbnail2Base64){
            const fileName2 = req.body.fileName2
            const thumbnail2Base64 = req.body.thumbnail2Base64;
            const thumbnailData2 = thumbnail2Base64.replace(/^data:image\/\w+;base64,/, "");
            const thumbnailBinaryData2 = Buffer.from(thumbnailData2, 'base64');
            thumbnailPath2 = path.join(__dirname, 'AnnotatedFiles', 'Thumbnail', `T${fileName2}`);
                // Save thumbnail
                await fs.promises.writeFile(thumbnailPath2, thumbnailBinaryData2);
        }
            const classDetails = new ClassName({
            "className":req.body.className, "description":req.body.description, "created_on":date.toUTCString(), "created_by":req.body.created_by, "color":req.body.color,
            "is_deleted":false, "yt_url1":req.body.yt_url1, "yt_url2":req.body.yt_url2||null, "thumbnail1":req.body.thumbnailPath1, "thumbnail2":req.body.thumbnailPath2
        })
        await classDetails.save()
        res.status(200)
    }
    catch(err){
        console.log(err);
        res.status(500).json({err});
    }
})

app.get('/get-className', async(req,res)=>{
    try{
        const classDetails =await ClassName.findOne({
            className:req.query.className, is_deleted:false
        })
        res.status(200).json(classDetails)
    }
    catch(err){
        res.status(500).json({err});
    }
})

app.post('/add-patientVisit', async (req, res) => {
    try {

        const date = new Date();
        const visit = new PatientVisits({
            "patientId": req.body.patientId, "date_of_xray": req.body.date_of_xray, "notes": req.body.notes, "date_of_visit": req.body.date_of_visit,
            "summary": req.body.summary, "created_on": date.toUTCString(), "created_by": req.body.created_by
        })
        await visit.save()
        const visitDetail = await PatientVisits.findOne({ "patientId":req.body.patientId, 
            "date_of_visit": req.body.date_of_visit, "created_on": date.toUTCString()})
        res.status(200).json({ visitDetail })

    }
    catch (err) {
        console.log(err)
        res.status(500).json({ err })
    }
})

app.get('/getPatientVisitsByID', async (req, res) => {
    try {
        const patientId = req.query.patientId;
        const patienVisits = await PatientVisits.find({
            "patientId": patientId
        }).sort({ date_of_visit: -1 }); 
        res.status(200).json({ patienVisits })
    }
    catch (err) {
        res.status(500).json({ message: err })
    }
})

app.get('/getPatientImagesByID', async (req, res) => {
    try {
        const patientId = req.query.patientId;
        const patienImages = await PatientImages.find({
            "patientId": patientId
        })
        res.status(200).json({ patienImages })
    }
    catch (err) {
        res.status(500).json({ message: err })
    }
})
app.get('/next-previousVisit', async(req,res)=>{
    try{
        const visitId= req.query.visitId
        const patientId = req.query.patientId;
        const patientVisits= await PatientVisits.find({
            "patientId":patientId
        })
        patientVisits.sort((a, b) => a.date_of_visit -b.date_of_visit);
        const currentVisitIndex = patientVisits.findIndex(visit => visit._id.toString() === visitId);
        if (currentVisitIndex === -1) {
            console.log(currentVisitIndex)
            return res.status(404).json({ message: 'Visit not found' });
        }
        if(req.query.next==="true"){
            res.status(200).json({visitId :patientVisits[currentVisitIndex+1],last:currentVisitIndex+1===patientVisits.length-1})
        }
        else{
            res.status(200).json({visitId:patientVisits[currentVisitIndex-1],first:currentVisitIndex-1===0})
        }
    }
    catch(err){
        res.status(500).json({message:err})
    }
})
app.post('/delete-patient', async (req, res) => {
    try {
        await Patient.findOneAndUpdate({ "email": req.body.email }, { $set: { "is_active": false } })
        res.status(200).json({ message: "Successfully deleted" })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ err })
    }
})
app.post('/edit-patient', async (req, res) => {
    try {
        let date = new Date()
        const user1 = await Patient.findOne({ "email": req.body.email });
        await Patient.findOneAndUpdate({ "email": req.body.email }, {
            $set: {
                "first_name": req.body.new_firstName, "last_name": req.body.new_lastName, "email": req.body.new_email,
                "telephone": req.body.new_telephone, "gender": req.body.gender, "date_of_birth": req.body.new_dob, "reference_dob_for_age": req.body.new_ref_dob,
                "guardian_first_name": req.body.new_guardian_first_name, "guardian_last_name": req.body.new_guardian_last_name, "guardian_relationship": req.body.new_guardian_relationship,
                "address": req.body.new_address, "modified_on": date.toUTCString(), "modified_by": req.body.modified_by
            }
        });
        if (user1) {
            res.status(200).json({ message: "Successfully updated" });
        } else {
            res.status(404).json({ message: "Item not found" });
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ err })
    }
})
app.put('/upload/image-and-annotations', async (req, res) => {
    const { base64Image, thumbnailBase64, fileName, patientID, imageNumber, scaledResponse, annotationFileName,visitId } = req.body;

    // Extract base64 data
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
    const binaryData = Buffer.from(base64Data, 'base64');

    // Extract thumbnail base64 data
    const thumbnailData = thumbnailBase64.replace(/^data:image\/\w+;base64,/, "");
    const thumbnailBinaryData = Buffer.from(thumbnailData, 'base64');

    const imagePath = path.join(__dirname, 'AnnotatedFiles', fileName);
    const annotationPath = path.join(__dirname, 'AnnotatedFiles', annotationFileName);
    const thumbnailPath = path.join(__dirname, 'AnnotatedFiles', 'Thumbnail', `T${fileName}`);

    try {
        // Save image
        await fs.promises.writeFile(imagePath, binaryData);

        // Save thumbnail
        await fs.promises.writeFile(thumbnailPath, thumbnailBinaryData);

        // Save annotations
        await fs.promises.writeFile(annotationPath, JSON.stringify(scaledResponse));

        console.log(`Image, thumbnail, and annotations saved for Patient ID: ${patientID}, Image Number: ${imageNumber}`);

        //Save to Database
        const date = new Date();
        const images = new PatientImages({
            "visitId": visitId, "patientId": patientID, "image_url": path.join('AnnotatedFiles', fileName),
            "json_url": path.join('AnnotatedFiles', annotationFileName),
            "thumbnail_url": path.join('AnnotatedFiles', 'Thumbnail', `T${fileName}`), "created_on": date.toUTCString(),
            "is_deleted":false
        })
        await images.save()
        res.status(200).send('Image, thumbnail, and annotations uploaded and saved successfully');
    } catch (err) {
        console.error('Error uploading files:', err);
        res.status(500).send('Error uploading files: ' + err.message);
    }
});

app.get('/most-recent-image', async (req, res) => {
    const annotatedFilesDir = path.join(__dirname, 'AnnotatedFiles');

    try {
        const files = await fs.promises.readdir(annotatedFilesDir);

        // Filter image files and sort by modification time (most recent first)
        const imageFiles = await Promise.all(files
            .filter(file => file.match(/\.(jpg|jpeg|png|gif)$/i))
            .map(async file => {
                const stats = await fs.promises.stat(path.join(annotatedFilesDir, file));
                return { name: file, mtime: stats.mtime };
            }));
        console.log(imageFiles)
        imageFiles.sort((a, b) => b.mtime - a.mtime);
        if (imageFiles.length === 0) {
            return res.status(404).json({ message: 'No images found' });
        }

        const mostRecentImage = imageFiles[0].name;
        const annotationFileName = mostRecentImage.split('.').slice(0, -1).join('.') + '.json';

        // Read the image file
        const imageBuffer = await fs.promises.readFile(path.join(annotatedFilesDir, mostRecentImage));
        const base64Image = imageBuffer.toString('base64');

        // Read the annotation file
        const annotationData = await fs.promises.readFile(path.join(annotatedFilesDir, annotationFileName), 'utf8');

        res.json({
            image: `data:image/${path.extname(mostRecentImage).slice(1)};base64,${base64Image}`,
            annotations: JSON.parse(annotationData)
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/recent-images', async (req, res) => {
    const limit = parseInt(req.query.limit) || 3;
    const thumbnailDir = path.join(__dirname, 'AnnotatedFiles', 'Thumbnail');

    try {
        const files = await fs.promises.readdir(thumbnailDir);

        // Filter image files and sort by modification time (most recent first)
        const imageFiles = await Promise.all(files
            .filter(file => file.match(/\.(jpg|jpeg|png|gif)$/i))
            .map(async file => {
                const stats = await fs.promises.stat(path.join(thumbnailDir, file));
                return { name: file, mtime: stats.mtime };
            }));

        imageFiles.sort((a, b) => b.mtime - a.mtime);

        const recentImages = imageFiles.slice(1, limit + 1); // Exclude the most recent image and limit the results

        // Read each image file and convert to base64
        const imageData = await Promise.all(recentImages.map(async (file) => {
            const imageBuffer = await fs.promises.readFile(path.join(thumbnailDir, file.name));
            const base64Image = imageBuffer.toString('base64');
            return `data:image/${path.extname(file.name).slice(1)};base64,${base64Image}`;
        }));

        res.json({ images: imageData });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});
app.get('/visitid-images', async (req, res) => {
    const annotatedFilesDir = path.join(__dirname, 'AnnotatedFiles');
    try {
        const images = await PatientImages.find({ visitId: req.query.visitID });
        // Map through the images and prepare the response for each
        const imageData = await Promise.all(images.map(async (image) => {
            const base64Image = await fs.promises.readFile(image.image_url, 'base64');
            const annotationFilePath = image.image_url.split('.').slice(0,-1).join('.') + '.json';
            const annotationData = await fs.promises.readFile(annotationFilePath, 'utf8');

            return {
                image: `data:image/${path.extname(image.image_url).slice(1)};base64,${base64Image}`,
                annotations: JSON.parse(annotationData)
            };
        }));
        // Return all images and annotations as an array
        res.json({images:imageData});
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.use('/AnnotatedFiles/Thumbnail', express.static(path.join(__dirname, 'AnnotatedFiles/Thumbnail')));

// Serve static files from the 'public/images' directory
//app.use('/images', express.static(path.join(__dirname, 'AnnotatedFiles/Thumbnail')));

app.listen(3001, () => console.log('Server running on port 3000'));