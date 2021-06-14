import ISO6391 from 'iso-639-1';
import { FC } from 'react';
import { toast } from 'react-toastify';
import countries from 'svg-country-flags/countries.json';
import {
  clearCurrentUser,
  getCurrentUser,
  updateMentor,
} from '../../api/index';
import { useModal } from '../../context/modalContext/ModalContext';
import { useUser } from '../../context/userContext/UserContext';
import messages from '../../messages';
import { Mentor } from '../../types/models';
import Card from '../components/Card';
import List from '../components/List';
import EditMentorDetails from '../Modals/EditMentorDetails';

const Profile: FC = () => {
  const { currentUser, updateCurrentUser } = useUser();

  const [openModal, closeModal] = useModal(
    <EditMentorDetails
      userDetails={currentUser!}
      updateMentor={handleUpdateMentor}
      closeModal={() => {}}
    />
  );

  async function handleUpdateMentor(updatedUserInfo: Mentor) {
    try {
      const updateMentorResult = await updateMentor(updatedUserInfo);
      if (updateMentorResult) {
        clearCurrentUser();
        toast.success(messages.EDIT_DETAILS_MENTOR_SUCCESS);
        const updatedUserDetails = (await getCurrentUser())!;
        updateCurrentUser(updatedUserDetails);
        closeModal();
      } else {
        toast.error(messages.GENERIC_ERROR);
      }
    } catch (error) {
      toast.error(messages.GENERIC_ERROR);
    }
  }

  return (
    <Card title="My Profile" onEdit={openModal}>
      {currentUser && (
        <List>
          <List.Item type="email" value={currentUser.email} />
          <List.Item
            type="spokenLanguages"
            value={currentUser.spokenLanguages
              .map(language => ISO6391.getName(language))
              .join(', ')}
          />
          <List.Item type="country" value={countries[currentUser.country]} />
          <List.Item type="title" value={currentUser.title} />
          <List.Item type="tags" value={currentUser.tags.join(', ')} />
          <List.Item
            type="available"
            value={currentUser.available ? 'available' : 'unavailable'}
          />
          <List.Item type="description" value={currentUser.description} />
        </List>
      )}
    </Card>
  );
};

export default Profile;
