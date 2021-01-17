import _SuccessModal from './SuccessModal';
export { default as DeclinedModal } from './DeclinedModal';
export const SuccessModal = _SuccessModal;
export const MentorApprovedModal = props => (
  <SuccessModal type="Mentor" {...props} />
);
export const MenteeSuccessModal = props => (
  <SuccessModal type="Mentee" {...props} />
);
