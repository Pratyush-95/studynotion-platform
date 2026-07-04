import { useState } from "react";

const NotificationModal = ({
  user,
  onClose,
  onSend,
}) => {

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {

    if (!title || !message) return;

    onSend(user._id, title, message);

  };

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">

      <div className="w-[500px] rounded-lg bg-richblack-800 p-6">

        <h2 className="text-2xl font-bold text-richblack-5">
          Send Notification
        </h2>

        <input
          type="text"
          placeholder="Notification Title"
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
          className="mt-5 w-full rounded-md border border-richblack-600 bg-richblack-900 p-3 text-white"
        />

        <textarea
          rows={5}
          placeholder="Notification Message"
          value={message}
          onChange={(e)=>setMessage(e.target.value)}
          className="mt-4 w-full rounded-md border border-richblack-600 bg-richblack-900 p-3 text-white"
        />

        <div className="mt-6 flex justify-end gap-4">

          <button
            onClick={onClose}
            className="rounded-md bg-richblack-600 px-5 py-2 text-white"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="rounded-md bg-yellow-50 px-5 py-2 font-semibold text-black"
          >
            Send
          </button>

        </div>

      </div>

    </div>

  );

};

export default NotificationModal;