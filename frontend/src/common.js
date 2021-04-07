import Vue from 'vue'
import VueRouter from 'vue-router'
import io from "socket.io-client"
import VueSocketIO from "vue-socket.io";

import unit from "@/components/unit";
import index from '@/components/index.vue';
import forum from '@/components/forum.vue';
import live from '@/components/live.vue';
import post from "@/components/post/post";
import postView from "@/components/post/postView";
import assessment from "@/components/assessment";

Vue.config.productionTip = false
Vue.use(VueRouter);
const socketTarget = "http://localhost:3000"
function setSocketIO() {
    if (!Vue.prototype.$socket) {
        Vue.use(new VueSocketIO({
            debug: true,
            connection: io(socketTarget)
        }))
    }
}

const routes = [
    {
        path: "/",
        component: index
    },
    {
        path: "/units/:id/",
        component: unit
    },
    {
        path: "/units/:id/forum/",
        component: forum,
        beforeEnter(to,from,next) {
            setSocketIO();
            next()
        }
    },
    {
        path: "/live/",
        component: live,
        beforeEnter(to,from,next) {
            setSocketIO();
            next()
        }
    },
    {
        path: "/test/",
        component: post
    },
    {
        path: "/units/:id/forum/posts/:postId",
        component: postView,
        beforeEnter(to,from,next) {
            setSocketIO();
            next()
        }
    },
    {
        path: "/assessments/",
        component: assessment
    }
];

export const router = new VueRouter({
    mode: "history",
    routes: routes
});