import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { fetchSingleUser, updateUserRole } from "../../store/feature/userSlice";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";


const SingleUserProfile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showRoleInput, setShowRoleInput] = useState(false);
  const [newRole, setNewRole] = useState("");

  const { user, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    if (!user || user._id !== id) {
      dispatch(fetchSingleUser(id));
    }
  }, [dispatch, user, id]);

  useEffect(() => {
    if (user) {
      setNewRole(user.role);
    }
  }, [user]);

  const handleEditRole = () => {
    setShowRoleInput(!showRoleInput);
  };

  const handleRoleChange = (e) => {
    setNewRole(e.target.value);
  };

  // const handleSubmit = () => {
  //   if (user && newRole) {
  //     dispatch(updateUserRole({ userId: user._id, role: newRole }));
  //   }
  //   setShowRoleInput(false);
  // };

  const handleSubmit = async () => {
    if (user && newRole) {
      await dispatch(updateUserRole({ userId: user._id, role: newRole }));
  
      dispatch(fetchSingleUser(id));
      
    }
    setShowRoleInput(false);
  };
  

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (error) {
    toast.error("Error fetching user data");
    return <p className="text-center text-red-500">{error}</p>;
  }

  return user ? (
    <div className="user-profile max-w-6xl mx-auto p-5">
      <FaArrowLeft
        className="text-xl cursor-pointer"
        onClick={() => navigate(-1)}
      />
      <h1 className="text-4xl font-bold text-[#10b981] text-center mb-5">
        User Profile
      </h1>
      <div className="bg-white shadow-lg rounded-lg p-6 mx-auto max-w-lg">
        <div className="mb-4">
          <p>
            <strong>ID:</strong> {user._id}
          </p>
        </div>
        <div className="mb-4">
          <p>
            <strong>Name:</strong> {user.name}
          </p>
        </div>
        <div className="mb-4">
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        </div>
        <div className="mb-4">
          <div className="flex justify-between items-center">
            <div>
              <p>
                <strong>Role:</strong> {user.role}
              </p>
            </div>
            <button
              onClick={handleEditRole}
              className="bg-[#10b981] text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200"
            >
              {showRoleInput ? "Cancel" : "Edit Role"}
            </button>
          </div>
          {showRoleInput && (
            <div className="mt-4">
              <label
                className="block text-gray-700 font-semibold mb-2"
                htmlFor="role"
              >
                Change Role:
              </label>
              <input
                id="role"
                type="text"
                value={newRole}
                onChange={handleRoleChange}
                className="border border-gray-300 rounded-md py-2 px-4 w-full"
              />
              <button
                onClick={handleSubmit}
                className="mt-4 bg-[#10b981] text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200"
              >
                Save Role
              </button>
            </div>
          )}
        </div>
        <div className="flex justify-end mt-4">
          <Link to={`/updateUser/${user._id}`}>
            <button className="bg-[#10b981] text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200">
              Edit Profile
            </button>
          </Link>
        </div>
      </div>
    </div>  
  ) : (
    <p className="text-center text-gray-500">User not found</p>
  );
};

export default SingleUserProfile;
