import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import produce from 'immer'
import { RootState } from '../../app/store';
import { fetchPosts, createPost,editPost, destroyPost } from './postAPI';

export enum Statuses {
  Initial = "Not Fetch",
  Loading = "Loading...",
  UpToDate = "Up To Date",
  Delete = "Deleted",
  Error = "Error",
}

export interface PostState {
  id?: number;
  title?: string;
  body?: string;
  created_at?: any;
  updated_at?: any;
}

export interface PostsState {
  posts: PostState[];
  status: string;
}

const initialState: PostsState = {
  posts: [
    {
      id: 0,
      title: "",
      body: "",
      created_at: "",
      updated_at: "",
    }
  ],
  status: Statuses.Initial
}

export interface PostFormData {
  post: {
    id?: number;
    title: string;
    body: string;
  }
}

export interface PostDeleteData {
  post: {
    post_id: number;
  }
}

export interface PostEditData {
  post: {
    post_id: number;
    post_title:string;
    post_body:string;
  }
}



export const createPostAsync = createAsyncThunk(
  'posts/createPost',
  async (payload: PostFormData) => {
    const response = await createPost(payload);
    return response;
  }
)

export const fetchPostsAsync = createAsyncThunk(
  'posts/fetchPosts',
  async () => {
    const response = await fetchPosts();
    return response;
  }
)

export const editPostAsync = createAsyncThunk(
  'posts/editPost',
  async (payload: PostEditData) => {
    const response = await editPost(payload);
    return response;
  }
)

export const destroyPostAsync = createAsyncThunk(
  'posts/destroyPost',
  async (payload: PostDeleteData) => {
    const response = await destroyPost(payload);
    return response;
  }
)



export const postSlice = createSlice({
  name: "posts",
  initialState,
  /*
  Synchronous action */
  reducers: {},

  extraReducers: (builder) => {
    builder
      // fetchPosts
      .addCase(fetchPostsAsync.pending, (state) => {
        return produce(state, (draftState) => {
          draftState.status = Statuses.Loading;
        })
      })
      .addCase(fetchPostsAsync.fulfilled, (state, action: any) => {
        return produce(state, (draftState) => {
          draftState.posts = action.payload;
          draftState.status = Statuses.UpToDate;
        })
      })
      .addCase(fetchPostsAsync.rejected, (state) => {
        return produce(state, (draftState) => {
          draftState.status = Statuses.Error;
        })
      })

      // create post
      .addCase(createPostAsync.pending, (state) => {
        return produce(state, (draftState) => {
          draftState.status = Statuses.Loading;
        })
      })
      .addCase(createPostAsync.fulfilled, (state, action: any) => {
        return produce(state, (draftState) => {
          draftState.posts.push(action.payload);
          draftState.status = Statuses.UpToDate;
        })
      })
      .addCase(createPostAsync.rejected, (state) => {
        return produce(state, (draftState) => {
          draftState.status = Statuses.Error;
        })
      })
      //delete post
      .addCase(destroyPostAsync.pending, (state) => {
        return produce(state, (draftState) => {
          draftState.status = Statuses.Loading;
        })
      })
      .addCase(destroyPostAsync.fulfilled, (state, action) => {
        return produce(state, (draftState) => {
          draftState.posts = action.payload;
          draftState.status = Statuses.UpToDate;
        })
      })
      .addCase(destroyPostAsync.rejected, (state) => {
        return produce(state, (draftState) => {
          draftState.status = Statuses.Error;
        })
      })
  }
})


export const { } = postSlice.actions;

export const selectPosts = (state: RootState) => state.posts.posts;

export const selectStatus = (state: RootState) => state.posts.status;

export default postSlice.reducer;

