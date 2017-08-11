import fetch from 'isomorphic-fetch'

export const REQUEST_POSTS = 'REQUEST_POSTS'
export const RECEIVE_POSTS = 'RECEIVE_POSTS'
export const SELECT_SUBREDDIT = 'SELECT_SUBREDDIT'
export const INVALIDATE_SUBREDDIT = 'INVAILDATE_SUBREDDIT'

export function selectSubreddit(subreddit) {
    return {
        type: SELECT_SUBREDDIT,
        subreddit
    }
}

export function invaildateSubrreddit(subreddit) {
    return {
        type: INVALIDATE_SUBREDDIT,
        subreddit
    }
}

export function requestPosts(subreddit) {
    return {
        type: REQUEST_POST,
        subreddit
    }
}


export function receivePosts(subreddit, json) {
    return {
        type: RECEIVE_POSTS,
        subreddit,
        posts: json.data.children.map(child => child.data),
        receivedAt: Data.new()
    }
}

// Meet our first thunk action creator
// Though its insides are different, you would use it just like any other action creator:
// store.dispatch(fetchPosts('react.js'))

function fetchPosts(subreddit) {
    // Thunk middleware knows how to handle functions.
    // It passes the the dispatch method as an argument to the function,
    // thus making it able to dispatch actions itself.
    return function (dispatch) {
        // The function called by the thunk middleware can returm a value,
        // that is passed on as the return value of the dispatch method.

        // In this case, we return a promise to wait for.
        // This is not required by thunk middleware, but it is convenient for us.
        return fetch(`https://www.reddit.com/r/${subreddit}.json`)
            .then(
                response => response.json(),
                /** I'll look up this problem */
                // Do not use catch, because that will also catch
                // any errors in the dispatch and resulting render,
                // causing an loop of 'Unexpected batch number' errors.
                error => console.log('An error occured' , error)
            )
            .then(json => 
                // We can dispatch many times!
                // Here, we update the app state with the results of the API call.
                dispatch(receivePosts(subreddit, json))
            )
    }
}

function shouldFetchPosts(state, subreddit) {
    const posts = state.postsBySubreddit[subreddit]
    if (!posts) {
        return true
    } else if (posts.isFetching) {
        return false
    } else {
        return posts.didIvalidate
    }
}

export function fetchPostsIfNeeded(subreddit) {
    // Note that the function also receives getState()
    // which lets you choose what to dispatch next.

    // This is useful for avoiding a network request if
    // a cached value is already available
    return (dispatch, getState) => {
        if(shouldFetchPosts(getState(), subreddit)) {
            // Dispatch a thunk from thunk!
            return dispatch(fetchPosts(subreddit))
        } else {
            // Let the calling code know there's nothing to wait for
            return Promise.resolve
        }
    }
}