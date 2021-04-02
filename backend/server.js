const express = require("express");
const app = express();
const http = require("http").createServer(app);
const port = 3000;
const io = require("socket.io")(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
const bodyParser = require("body-parser");
const cors = require("cors");

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

app.get("/", (req,res) => {
    res.send("Hello world");
});

app.get("/api/users",(req,res) => {
    res.send(users);
});

app.get("/api/units", (req,res) => {
    res.send(units);
});

app.get("/api/units/:id", (req,res) => {
    let unitId = Number(req.params.id);
    res.send(units[unitId]);
});

app.get("/api/videos", (req, res) => {
    res.send(videos);
});

app.get("/api/posts", (req,res) => {
   res.send(posts);
});

app.get("/api/posts/:id", (req,res) => {
    let postId = Number(req.params.id);
    res.send(posts[postId]);
});

app.get("/api/posts/unitId/:id", (req,res) => {
    let unitId = Number(req.params.id);
    const matchingPosts = [];
    posts.forEach(post => {
        if(post.unit === unitId) {
            matchingPosts.push(post);
        }
    });
    res.send(matchingPosts);
});

app.post("/api/posts/newPost", (req,res) => {
    console.log(req.body);
    const newPost = req.body;
    newPost.id = posts.length;
    newPost.uploader = 4;
    newPost.isAnonymous = false;
    posts.push(newPost);
    res.send(newPost);
})

io.on('connection', (socket) => {
    console.log("connection");
    socket.on('room', (room) => {
        socket.join(room);
        console.log('user ' + socket.id + ' connected at room ' + room);
    })
    socket.on('disconnect', () => {
        socket.leave();
        console.log('user ' + socket.id + ' disconnected');
    })
    socket.on("save_new_post",(data) => {
        console.log(data.room,data.post);
        socket.broadcast.to(data.room).emit("new_post",data.post);
    })
});

io.on('connection', (socket) => {
    socket.on('chat_message', (chat) => {
        console.log('room: ' + chat.room + ' user: ' + socket.id + ' message: ' + chat.msg);
        socket.broadcast.to(chat.room).emit('chat_message', socket.id, chat.msg);
    });
});

io.on('connection', (socket) => {
    socket.on('room', (room) => {
        socket.join(room);
        console.log('user ' + socket.id + ' connected at room ' + room);
    })
    socket.on("share-pdf",(room,data) => {
        console.log(data);
        socket.broadcast.to(room).emit("shared-pdf",data);
    })
    socket.on('chat message', (chat) => {
        console.log('room: ' + chat.room + ' user: ' + socket.id + ' message: ' + chat.msg);
        socket.broadcast.to(chat.room).emit('chat message', socket.id, chat.msg);
    })
    socket.on("record_start", (room) => {
        console.log("record started at", room);
        socket.broadcast.to(room).emit("record_started");
    })
    socket.on("record_stop", (room) => {
        console.log("record stopped at", room);
        socket.broadcast.to(room).emit("record_stopped");
    })
    socket.on('disconnect', () => {
        socket.leave();
        console.log('user ' + socket.id + ' disconnected');
    })
});

http.listen(port, () => {
    console.log('listening on *:' + port);
});