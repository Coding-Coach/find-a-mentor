export function isMentor(user) {
  return user.roles.includes('MENTOR');
}

export function fromVMtoM(user) {
  return {
    ...user,
    tags: user.tags.map(i => i.value)
  }
}

export function fromMtoVM(user) {
  return {
    ...user,
    tags: user.tags ? user.tags.map(i => ({label: i, value: i})) : []
  }
}