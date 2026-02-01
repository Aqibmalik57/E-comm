import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { fetchCart } from "./CartSlice";

// Signup thunk
export const signup = createAsyncThunk(
  "user/signup",
  async (info, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v2/signup",
        info,
        { withCredentials: true },
      );
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message);
      return rejectWithValue(
        error.response?.data?.message || "An unknown error occurred",
      );
    }
  },
);

// Login thunk
export const login = createAsyncThunk(
  "user/login",
  async (info, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v2/login",
        info,
        { withCredentials: true },
      );
      toast.success(response.data.message);
      dispatch(fetchCart(response.data.user._id));

      return response.data.user;
    } catch (error) {
      toast.error(error.response?.data?.message);
      return rejectWithValue(
        error.response?.data?.message || "An unknown error occurred",
      );
    }
  },
);

// MyProfile thunk
export const MyProfile = createAsyncThunk(
  "user/myprofile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/v2/myprofile",
        { withCredentials: true },
      );
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      console.log(error.response?.data?.message);
      return rejectWithValue(
        error.response?.data?.message || "An unknown error occurred",
      );
    }
  },
);

// UpdateProfile thunk
export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (info, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        "http://localhost:5000/api/v2/updateprofile",
        info,
        { withCredentials: true },
      );
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message);
      return rejectWithValue(
        error.response?.data?.message || "An unknown error occurred",
      );
    }
  },
);

// Logout thunk
export const logout = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v2/logout",
        {},
        {
          withCredentials: true,
        },
      );
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message);
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  },
);

// Thunk to update user role
export const updateUserRole = createAsyncThunk(
  "user/updateUserRole",
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/v2/updateRole/${userId}`,
        { role },
        { withCredentials: true },
      );
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message);
      return rejectWithValue(
        error.response?.data || { message: "Something went wrong!" },
      );
    }
  },
);

// FetchAllUsers thunk
export const fetchUsers = createAsyncThunk(
  "user/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/v2/allUsers",
        { withCredentials: true },
      );
      toast.success(response.data.message);
      return response.data.users;
    } catch (error) {
      toast.error(error.response?.data?.message);
      return rejectWithValue(
        error.response?.data?.message || "An unknown error occurred",
      );
    }
  },
);

// Fetch single user by ID thunk
export const fetchSingleUser = createAsyncThunk(
  "user/fetchSingleUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/v2/singleuser/${userId}`,
        { withCredentials: true },
      );
      toast.success(response.data.message);
      return response.data.user;
    } catch (error) {
      toast.error(error.response?.data?.message);
      return rejectWithValue(
        error.response?.data?.message ||
          "User not found or an unknown error occurred",
      );
    }
  },
);

// Update Password thunk
export const updatePassword = createAsyncThunk(
  "user/updatePassword",
  async (info, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        "http://localhost:5000/api/v2/updatePass",
        info,
        { withCredentials: true },
      );
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "An unknown error occurred");
      return rejectWithValue(
        error.response?.data?.message || "An unknown error occurred",
      );
    }
  },
);

// edit user profile by Admin thunk
export const editUserProfile = createAsyncThunk(
  "user/editProfile",
  async (info, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/v2/updateUserProfile/${info.id}`,
        info,
        { withCredentials: true },
      );
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message);
      return rejectWithValue(
        error.response?.data?.message || "An unknown error occurred",
      );
    }
  },
);

// Delete own profile thunk
export const deleteOwnProfile = createAsyncThunk(
  "user/deleteProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        "http://localhost:5000/api/v2/deleteProfile",
        { withCredentials: true },
      );
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message);
      return rejectWithValue(
        error.response?.data?.message || "An unknown error occurred",
      );
    }
  },
);

// Delete user by Admin thunk
export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/v2/deleteUser/${userId}`,
        { withCredentials: true },
      );
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message);
      return rejectWithValue(
        error.response?.data?.message || "An unknown error occurred",
      );
    }
  },
);

// Thunk for Forgot Password
export const forgotPassword = createAsyncThunk(
  "user/forgotPassword",
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v2/forgotPassword",
        { email },
      );
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to send email";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

// Create AsyncThunk for reset password
export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async ({ token, newPassword, confirmPassword }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/v2/resetPassword/${token}`,
        {
          newPassword,
          confirmPassword,
        },
      );
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to reset password";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

const initialState = {
  user: null,
  isLoggedIn: false,
  error: null,
  message: "",
  loading: false,
  users: [],
  success: null, // Added for password resets
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    clearUserState: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.error = null;
      state.message = "";
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Signup cases
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user; // Set the user object from response
        state.isLoggedIn = true;
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.isLoggedIn = false;
        state.error = action.payload;
      })
      // Login cases
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // This is response.data.user from your thunk
        state.isLoggedIn = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isLoggedIn = false;
        state.error = action.payload;
      })
      // MyProfile cases
      .addCase(MyProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(MyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isLoggedIn = true; // If we can fetch profile, we are logged in
        state.error = null;
      })
      .addCase(MyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // UpdateProfile cases
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.message = action.payload.message;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout cases
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isLoggedIn = false;
        state.error = null;
        state.message = "";
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // UpdateUserRole cases
      .addCase(updateUserRole.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user; // Update the user state with the new role
        state.message = action.payload.message; // Set the success message
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set the error message if the request fails
      })
      // FetchUsers cases
      .addCase(fetchUsers.pending, (state) => {
        state.usersLoading = true;
        state.usersError = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.users = action.payload; // Store fetched users
        state.usersError = null; // Reset error state
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.usersLoading = false;
        state.usersError = action.payload; // Set error message if the request fails
      })
      // Fetch single user cases
      .addCase(fetchSingleUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSingleUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // Set the fetched user data
        state.error = null;
      })
      .addCase(fetchSingleUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set error message if the request fails
      })
      // Update Password cases
      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user; // Assuming the updated user is returned
        state.message = action.payload.message; // Success message from response
        state.error = null;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set the error message
      })
      // EditUserProfile cases
      .addCase(editUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.message = action.payload.message;
      })
      .addCase(editUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // DeleteOwnProfile cases
      .addCase(deleteOwnProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOwnProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isLoggedIn = false;
        state.message = action.payload.message;
      })
      .addCase(deleteOwnProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // DeleteUser by Admin cases
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(
          (user) => user._id !== action.payload._id,
        );
        state.message = action.payload.message;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Forgot Password cases
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Reset Password cases
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = null;
      });
  },
});

export const { clearErrors, clearUserState } = userSlice.actions;
export default userSlice.reducer;
