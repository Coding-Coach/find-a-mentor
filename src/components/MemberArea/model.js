export default {
  email: {
    type: 'text',
    defaultValue: '',
  },
  name: {
    type: 'text',
    defaultValue: '',
  },
  avatar: {
    type: 'text',
    defaultValue: '',
  },
  title: {
    type: 'text',
    defaultValue: '',
  },
  description: {
    type: 'text',
    defaultValue: '',
  },
  country: {
    type: 'text',
    defaultValue: '',
  },
  spokenLanguages: {
    type: 'text',
    defaultValue: '',
  },
  tags: {
    type: 'tags',
    defaultValue: [],
    options: [
      { value: 'chocolate', label: 'Chocolate' },
      { value: 'strawberry', label: 'Strawberry' },
      { value: 'vanilla', label: 'Vanilla' }
    ]
  },
  roles: {
    type: 'text',
    defaultValue: '',
  },
}