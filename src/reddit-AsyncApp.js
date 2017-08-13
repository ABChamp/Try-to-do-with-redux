import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    selectSubreddit, // it's a function
    fetchPostsIfNeeded,
    invaildateSubrreddit
} from './reddit-actions'

/** Component  */
import Picker from './reddit-Picker'
import Posts from './reddit-Posts'

class AsyncApp extends Component {
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this)
        this.handleRefreshClick = this.handleRefreshClick.bind(this)
    }

    componentDidMount() {
        const { dispatch, selectedSubreddit } = this.props
        dispatch(fetchPostsIfNeeded(selectedSubreddit))
    }

    componentDidUpdate(prevProps) {
        if(this.props.selectedSubreddit !== prevProps.selectedSubreddit ) {
            const { dispatch, selectedSubreddit } = this.props
            dispatch(fetchPostsIfNeeded(selectedSubreddit))
        }
    }

    handleChange(nextSubreddit) {
        this.props.dispatch(selectSubreddit(nextSubreddit))
        this.props.dispatch(fetchPostsIfNeeded(nextSubreddit))
    }

    handleRefreshClick(e) {
        e.preventDefault()
        const { dispatch, selectedSubreddit } = this.props
        dispatch(invaildateSubrreddit(selectedSubreddit))
        dispatch(fetchPostsIfNeeded(selectedSubreddit))
    }

    render() {
        const { selectedSubreddit, posts, isFetching, lastUpdated } = this.props
        return (
            <div>
                <Picker 
                    value={selectedSubreddit}
                    onChange={this.handleChange}
                    options={['reactjs', 'frontend']}
                />
                <p>
                    {lastUpdated &&
                        <span>
                            Last updated at {new Date(lastUpdated).toLocaleString()}.
                            {' '} 
                        </span>}
                    {!isFetching &&
                        <a href="#" onClick={this.handleRefreshClick}>
                            Refresh
                        </a> }
                </p>
                { isFetching && posts.length === 0 && <h2> Loading .. </h2> /**show fetching */}
                { !isFetching && posts.length === 0 && <h2> Empty. </h2> /**show error. */}
                { posts.length > 0 && 
                    <div style={{ opacity: isFetching ? 0.5 : 1 }} >
                        <Posts posts={posts } />
                    </div> } 
            </div>
        )
    }
}

AsyncApp.propTypes = {
    selectedSubreddit: PropTypes.string.isRequired,
    posts: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    lastUpdated: PropTypes.number,
    dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
    const { selectedSubreddit, postsBySubreddit } = state
    console.log("mapStateToProps");
    const {
        isFetching,
        lastUpdated,
        items: posts // items => posts in const 
    } = postsBySubreddit[selectedSubreddit] || { // <== this default starter
        isFetching: true,
        items: []
    }

    return {
        selectedSubreddit,
        posts,
        isFetching,
        lastUpdated
    }
}

export default connect(mapStateToProps)(AsyncApp)