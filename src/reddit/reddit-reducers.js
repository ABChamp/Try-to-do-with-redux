import { combineReducers } from 'redux'
import {
    SELECT_SUBREDDIT,
    INVALIDATE_SUBREDDIT,
    REQUEST_POSTS,
    RECEIVE_POSTS
} from './reddit-actions'

function selectedSubreddit(state = "reactjs", action) {
    switch (action.type) {
        case SELECT_SUBREDDIT:
            return action.subreddit
        default:
            console.log("reducers@selectedSubreddit" + state);
            return state
    }
}

function posts(
    state = {
        isFetching: false,
        didInvlidate: false,
        items: []
    }, action 
) {
    switch(action.type) {
        case INVALIDATE_SUBREDDIT:
            return Object.assign({}, state, {
                didInvlidate: true
            })
        case REQUEST_POSTS:
            return Object.assign({}, state, {
                isFetching: true,
                didInvlidate: false
            })
        case RECEIVE_POSTS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvlidate: false,
                items: action.posts,
                lastUpdated: action.receivedAt
            })
        default:
            return state
    }
}

function postsBySubreddit(state = {}, action) {
    switch (action.type) {
        case INVALIDATE_SUBREDDIT:
        case RECEIVE_POSTS:
        case REQUEST_POSTS:
            return Object.assign({}, state, {
                [action.subreddit]: posts(state[action.subreddit], action)
            })
        default:
            return state
    }
}

const rootReducer = combineReducers ({
    postsBySubreddit,
    selectedSubreddit
})

export default rootReducer;