const DeleteUserModal = ({
  user,
  onClose,
  onDelete,
}) => {

  if (!user) return null;

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">

      <div className="w-[450px] rounded-lg bg-richblack-800 p-6">

        <h2 className="text-2xl font-bold text-richblack-5">
          Delete User
        </h2>

        <p className="mt-5 text-richblack-200">

          Are you sure you want to delete

          <span className="font-semibold text-yellow-50">
            {" "}
            {user.firstName} {user.lastName}
          </span>

          ?

        </p>

        <p className="mt-2 text-sm text-pink-300">

          This action cannot be undone.

        </p>

        <div className="mt-8 flex justify-end gap-4">

          <button
            onClick={onClose}
            className="rounded-md bg-richblack-600 px-5 py-2"
          >
            Cancel
          </button>

          <button
            onClick={() => onDelete(user._id)}
            className="rounded-md bg-pink-600 px-6 py-2 font-semibold text-white"
          >
            Delete
          </button>

        </div>

      </div>

    </div>

  );

};

export default DeleteUserModal;