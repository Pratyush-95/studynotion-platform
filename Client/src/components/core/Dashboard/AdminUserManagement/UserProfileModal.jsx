import StudentProfileModal from "./StudentProfileModal";
import InstructorProfileModal from "./InstructorProfileModal";

const UserProfileModal = ({ user, onClose }) => {
  if (!user) return null;

  const accountType = user?.basicInformation?.accountType;

  if (accountType === "Instructor") {
    return (
      <InstructorProfileModal
        user={user}
        onClose={onClose}
      />
    );
  }

  return (
    <StudentProfileModal
      user={user}
      onClose={onClose}
    />
  );
};

export default UserProfileModal;