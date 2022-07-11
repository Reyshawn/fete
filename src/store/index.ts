import { createSlice, configureStore, createAsyncThunk, createSelector } from "@reduxjs/toolkit";



const getSomePosts = (url: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        data: "some posts data"
      })
    }, 500)

  })
}



export const fetchPosts = createAsyncThunk('posts/fetchPosts', async (payload) => {
  console.log("fetch ....::::", payload)
  const response = await getSomePosts('/fakeApi/posts')
  return response.data
})


const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0
  },
  reducers: {
    incremented: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes

      // console.log("state::::", state)
      // console.log("action::::", action)
      state.value += 1
    },
    decremented: state => {
      state.value -= 1
    }
  }
})


const asyncReducer = createSlice({
  name: 'async',
  initialState: {
    status: 'idle'
  },
  reducers: {

  },
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        // console.log("loading.action:::", action)
        state.status = 'loading'
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        // console.log("loading.fulfilled:::", action)
        state.status = 'succeeded'
        // Add any fetched posts to the array
        // state.posts = state.posts.concat(action.payload)
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed'
        // state.error = action.error.message
      })
  },
})


export const { incremented, decremented } = counterSlice.actions

export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
    async: asyncReducer.reducer
  }
})


// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectCount = createSelector([state => state.counter.value], (value) => {
  console.log("called::::selectCount::::", value)
  return value

})  

export const selectStatus = state => state.async.status
