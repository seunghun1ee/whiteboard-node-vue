//environment
require("dotenv").config();

const express = require("express");
const app = express();
const http = require("http").createServer(app);
const port = 3000;
const path = require("path");
const io = require("socket.io")(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
const bodyParser = require("body-parser");
const cors = require("cors");

const multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname,"presentation/pdfs"));
    },
    filename: function (req, file, cb) {
        cb(null, "presenting.pdf");
    }
});
const pdf2base64 = require("pdf-to-base64");

//DB
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log("Successful MongoDB connection"))
    .catch(err => console.error(err));
const Unit = require("./models/unit");
const Post = require("./models/post");
const Comment = require("./models/comment");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const users = [
    {id: 0, name: "Alice Wonderland", email:"alice@mail.com"},
    {id: 1, name: "Brad Cornwall", email:"brad@mail.com"},
    {id: 2, name: "Claire Smith", email:"claire@mail.com"},
    {id: 3, name: "David Wilson", email:"david@mail.com"},
    {id: 4, name: "Edgar Wright", email: "edgar@mail.com"}
]

const units = [
    {id: 0, code: "COMS10000", name: "CS Basics", director: "Alice Wonderland", staffs: [], videos: []},
    {id: 1, code: "COMS10001", name: "Theory of Computer", director: "Brad Cornwall", staffs: [], videos: []},
    {id: 2, code: "COMS10002", name: "Security", director: "Claire Smith", staffs: [], videos: []}
];

const videos = [
    { id: 0, unit: "COMS10000" ,title: "Test title 0", uploader: "Alice Wonderland" },
    { id: 1, unit: "COMS10001", title: "Test title 1", uploader: "Brad Cornwall" },
    { id: 2, unit: "COMS10001", title: "Test title 2", uploader: "Brad Cornwall" },
    { id: 3, unit: "COMS10002", title: "Test title 3", uploader: "Claire Smith" },
    { id: 4, unit: "COMS10002", title: "Test title 4", uploader: "David Wilson" },
    { id: 5, unit: "COMS10000" ,title: "Test title 5", uploader: "Alice Wonderland" },
    { id: 6, unit: "COMS10001", title: "Test title 6", uploader: "Brad Cornwall" },
    { id: 7, unit: "COMS10001", title: "Test title 7", uploader: "Brad Cornwall" },
    { id: 8, unit: "COMS10002", title: "Test title 8", uploader: "Claire Smith" },
    { id: 9, unit: "COMS10002", title: "Test title 9", uploader: "David Wilson" }
];

const posts = [
    { id: 0, unit: 0, title: "Need help on x", message: "Hi, why does x behave like y?", uploader: 0, parent: null, children: [1,3], isAnonymous: false, tags: []},
    { id: 1, unit: 0, title: "", message: "Hi Alice, it's because x = y. Hope this helps.", uploader: 1, parent: 0, children: [], isAnonymous: false, tags: []},
    { id: 2, unit: 0, title: "", message: "This is anonymous post", uploader: 1, parent : null, children: [4], isAnonymous: true, tags: []},
    { id: 3, unit: 0, title: "", message: "Thanks!", uploader: 0, parent: 0, children: [], isAnonymous: false, tags: []},
    { id: 4, unit: 0, title: "", message: "Anonymous reply", uploader: 0, parent: 2, children: [], isAnonymous: true, tags: []},
    { id: 5, unit: 1, title: "", message: "Welcome to Theory of Computer", uploader: 1, parent: null, children: [], isAnonymous: false, tags: []}
];

const tags= [
    {
        id: 0,
        name: "Answered",
        description: "",
        colour: "#00ff00"
    },
    {
        id: 1,
        name: "Question",
        description: "",
        colour: "#ff8400"
    },
    {
        id: 2,
        name: "Error found",
        description: "",
        colour: "#ff0000"
    },
    {
        id: 3,
        name: "Technical help",
        description: "",
        colour: "#1a51ff"
    },
    {
        id: 4,
        name: "Announcement",
        description: "",
        colour: "#0f9210"
    },
    {
        id: 5,
        name: "Assessment",
        description: "",
        colour: "#ba0eef"
    }
]

const recordStates = {};
let pdfPresenting = null;

app.get("/", (req,res) => {
    res.send("Hello world");
});

app.get("/api/users",(req,res) => {
    res.send(users);
});

app.get("/api/units", (req,res) => {
    Unit.find({}).then(units => {
        res.send(units.map(unit => unit.toJSON()));
    }).catch(err => res.send(`Internal server error, ${err}`));
});

app.get("/api/units/:id", (req,res) => {
    let unitId = req.params.id;
    Unit.findOne({_id: unitId}).then(unit => {
        res.send(unit.toJSON());
    }).catch(err => res.send(`Internal server error, ${err}`));
});

app.get("/api/videos", (req, res) => {
    res.send(videos);
});

app.get("/api/posts", (req,res) => {
   Post.find({}).then(posts => {
       res.send(posts.map(post => post.toJSON()));
   }).catch(err => res.send(`Internal server error, ${err}`));
});

app.get("/api/posts/:id", (req,res) => {
    let postId = req.params.id;
    Post.findOne({_id: postId}).then(post => {
        res.send(post.toJSON());
    }).catch(err => res.send(`Internal server error, ${err}`));
});

app.get("/api/posts/unitId/:id", (req,res) => {
    let unitId = req.params.id;
    Post.find({unitId: unitId}).sort({createdAt: -1}).then(posts => {
        res.send(posts.map(post => post.toJSON()));
    }).catch(err => res.send(`Internal server error, ${err}`));
});

app.post("/api/posts/newPost", (req,res) => {
    let selectedTags = [];
    req.body.tags.forEach(id => {
        selectedTags.push(tags[id]);
    });
    let newPost = new Post({
        unitId: mongoose.Types.ObjectId(req.body.unitId), //convert string to ObjectId
        title: req.body.title,
        author: req.body.author,
        tags: selectedTags,
        body: req.body.body,
        anonymous: req.body.anonymous
    });
    console.log(newPost);
    newPost.save().then(() => {
        console.log("New post saved");
        res.send(newPost);
    }).catch(err => {
        console.log("Post save error",err);
        res.status(500).send(`Post Save error ${err}`);
    });
});

app.patch("/api/posts/:postId/newComment", (req,res) => {
    console.log(req.body);
    let newComment = new Comment({
        author: req.body.author,
        body: req.body.body,
        anonymous: req.body.anonymous
    });
    Post.updateOne({_id: req.params.postId},{$push: {comments: newComment}}).then(() => {
        console.log("new comment saved");
        res.send(newComment);
    });
});

app.get("/api/tags", (req,res) => {
   res.send(tags);
});

app.patch("/api/posts/:postId/newTags", (req,res) => {
    const newTags = [];
    req.body.map(tagId => {
       newTags.push(tags[tagId]);
    });
    console.log(req.params);
    Post.updateOne({_id: req.params.postId},{ $push: { tags:{ $each: newTags } } })
        .then(() => {
            console.log("new tags saved");
            res.send(newTags);
        });
});

app.patch("/api/posts/:postId/markAnswered",(req,res) => {
    console.log(req.params);
    Post.updateOne({_id: req.params.postId},{answered: true, $push: { tags: tags[0] }})
        .then(() => {
            Post.findOne({_id: req.params.postId})
                .then(data => {
                    console.log("post marked as answered");
                    res.send(data.toJSON());
                });
        });
})

app.post("/api/uploadPdf", (req,res) => {
    multer({storage: storage, fileFilter: pdfFilter}).single("pdf")(req,res,function (err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            console.log(err);
            res.status(500).error();
        }
        pdf2base64(path.join(__dirname,"presentation/pdfs/presenting.pdf")).then(base64 => {
            pdfPresenting = base64;
            io.emit("presenting_pdf",base64);
        }).catch(err => {
            res.send(err);
        })
        res.send("pdf upload success");
    });
});

const pdfFilter = (req,file,cb) => {
    const allowedTypes = ["application/pdf"];
    if(!allowedTypes.includes(file.mimetype)) {
        const error = new Error("Incorrect file type");
        error.code = "INCORRECT_FILETYPE";
        return cb(error,false);
    }
    return cb(null,true);
}

app.get("/api/test", (req,res) => {
    Post.deleteMany({}).catch(err => console.log(err));
    Unit.deleteMany({}).catch(err => console.log(err));
    let coms10000 = new Unit({
        code: "COMS10000",
        title: "CS Basics",
        director: "Alice Wonderland",
        staffs: [],
        students: []
    });
    let coms10001 = new Unit({
        code: "COMS10001",
        title: "Theory of Computation",
        director: "Brad Cornwall",
        staffs: [],
        students: []
    });
    let coms10002 = new Unit({
        code: "COMS10002",
        title: "Security",
        director: "Claire Smith",
        staffs: ["David Wilson"],
        students: []
    });
    coms10000.save().catch(err => {
        console.log(err);
        res.send("unit save error");
    });
    coms10001.save().catch(err => {
        console.log(err);
        res.send("unit save error");
    });
    coms10002.save().catch(err => {
        console.log(err);
        res.send("unit save error");
    });
    let post0 = new Post({
        unitId: coms10000._id,
        title: "Need help on x",
        author: "Alice Wonderland",
        tags: [tags[1],tags[0]],
        body: "Hi, why does x behave like y?",
        anonymous: false,
        answered: true,
        comments: [
            new Comment({
                author: "Brad Cornwall",
                body: "Hi Alice, it's because x = y. Hope this helps.",
                anonymous: false
            }),
            new Comment({
                author: "Alice Wonderland",
                body: "Thanks Brad",
                anonymous: false
            })
        ]
    });
    let post1 = new Post({
        unitId: coms10000._id,
        title: "This is anonymous post",
        author: "Brad Cornwall",
        tags: [],
        body: "Author should be invisible",
        anonymous: true,
        comments: [
            new Comment({
                author: "Brad Cornwall",
                body: "This is anonymous reply",
                anonymous: true
            })
        ]
    });
    let post2 = new Post({
        unitId: coms10001._id,
        title: "Welcome to Theory of Computation",
        author: "Claire Smith",
        tags: [],
        body: "Hi",
        anonymous: false,
        comments: []
    });
    post0.save().catch(err => {
        console.log(err);
        res.send("post save error");
    });
    post1.save().catch(err => {
        console.log(err);
        res.send("post save error");
    });
    post2.save().catch(err => {
        console.log(err);
        res.send("post save error");
    });
    res.send("test data loaded");
});

io.on('connection', (socket) => {
    console.log("connection");
    socket.on('room', (room) => {
        socket.join(room);
        if(recordStates[room]) {
            socket.emit("record_state_true");
        }
        if(pdfPresenting) {
            socket.emit("presenting_pdf",pdfPresenting);
        }
        console.log('user ' + socket.id + ' connected at room ' + room);
    })
    socket.on("save_new_post",(data) => {
        console.log(data.room,data.post);
        socket.broadcast.to(data.room).emit("new_post",data.post);
    })
    socket.on("save_new_comment", (comment,room) => {
        console.log(room, comment);
        socket.broadcast.to(room).emit("new_comment",comment);
    })
    socket.on("send_chat", (chat,anonymous,room,channel) => {
        console.log(`room: ${room} channel: ${channel} user: ${socket.id} message: ${chat} anonymous: ${anonymous}`);
        socket.broadcast.to(room).emit("receive_chat",{chat:chat, anonymous: anonymous, channel:channel, id:socket.id});
    })
    socket.on("share-pdf",(room,data) => {
        console.log(data);
        socket.broadcast.to(room).emit("shared-pdf",data);
    })
    socket.on("record_start", (room) => {
        console.log("record started at", room);
        recordStates[room] = true;
        socket.broadcast.to(room).emit("record_started");
    })
    socket.on("record_stop", (room) => {
        console.log("record stopped at", room);
        recordStates[room] = false;
        socket.broadcast.to(room).emit("record_stopped");
    })
    socket.on("pdf_page_change", (pageNum) => {
        socket.broadcast.emit("pdf_page_changed",pageNum);
    })
    socket.on("stop_presenting_pdf", () => {
        pdfPresenting = null;
        io.emit("presentation_stopped");
    })
    socket.on('disconnect', () => {
        socket.leave();
        console.log('user ' + socket.id + ' disconnected');
    })
});

http.listen(port, () => {
    console.log('listening on *:' + port);
});