import {mount, createLocalVue} from '@vue/test-utils'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import Posts from "../../src/components/Posts.vue";

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(VueRouter);

//Create dummy store
const store = new Vuex.Store({
    state: {
        user: {
            id: 1,
            firstname: 'test',
            lastname: 'test',
            email: 'test',
            avatar: 'test',
        }
    },
    getters: {
        user: (state) => state.user,
    }
});

//Create dummy routes
const routes = [
    {
        path: '/',
        name: 'posts',
    },
    {
        path: '/profiles',
        name: 'profiles'
    }
];

const router = new VueRouter({routes});

const testData = [
    {
        id: 1,
        text: "I think it's going to rain",
        createTime: "2020-12-05 13:53:23",
        likes: 0,
        liked: false,
        media: {
            url: "test-image.jpg",
            type: "image"
        },
        author: {
            id: 2,
            firstname: "Gordon",
            lastname: "Freeman",
            avatar: 'avatar.url'
        }
    },
    {
        id: 2,
        text: "Which weighs more, a pound of feathers or a pound of bricks?",
        createTime: "2020-12-05 13:53:23",
        likes: 1,
        liked: true,
        media: null,
        author: {
            id: 3,
            firstname: "Sarah",
            lastname: "Connor",
            avatar: 'avatar.url'
        }
    },
    {
        id: 4,
        text: null,
        createTime: "2020-12-05 13:53:23",
        likes: 3,
        liked: false,
        media: {
            url: "test-video.mp4",
            type: "video"
        },
        author: {
            id: 5,
            firstname: "Richard",
            lastname: "Stallman",
            avatar: 'avatar.url'
        }
    }
];

//Mock axios.get method that our Component calls in mounted event
jest.mock("axios", () => ({
    get: () => Promise.resolve({
        data: testData
    })
}));

describe('Posts', () => {

    const wrapper = mount(Posts, {router, store, localVue});

    it('1 == 1', function () {
        expect(true).toBe(true)
    });

    //Test that exactly as many posts are rendered as contained in testData variable
    it('count post', function () {

        let postsArray = wrapper.findAll(".post");
        expect(postsArray.length).toBe(testData.length);
    });

    //Test that if post has media property, image or video tags are rendered depending on media.
    //type property, or if media property is absent nothing is rendered.
    it('media property', function () {

        let posts = wrapper.findAll(".post")

        Array.prototype.forEach.call(posts, (i) => {

            let img = i.findComponent('img')
            let video = i.findComponent('video')

            if (img && i.media.type === 'image') {
                expect(img.exists()).toBe(true);
                expect(video.exists()).toBe(false);
            } else if (video && i.media.type === 'video') {
                expect(video.exists()).toBe(true);
                expect(img.exists()).toBe(false);
            } else {
                expect(video.exists()).toBe(false);
                expect(img.exists()).toBe(false);
            }
        });
    });

    //Test that post create time is displayed in correct format: Saturday, December 5, 2020 1:53 PM
    it('time format', () => {

        let posts = wrapper.findAll('.post-author')

        Array.prototype.forEach.call(posts, (i) => {
            let time = i.findComponent('small')

            expect(time).toBe(moment(time).format('LLLL'))
        });
    });

});