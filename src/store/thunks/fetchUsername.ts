import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchUsername = createAsyncThunk('username/fetch', async () => {
  const res = await axios.get('/api/get-username');
  console.log(res);
  return res.data.username;
});
