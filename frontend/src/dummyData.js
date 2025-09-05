export const currentUser = {
  id: 'u1',
  name: 'Jacques',
  handle: '@jacques',
  avatar: '/assets/images/codecontrol-logo.png',
  friends: [{ id: 'u2', name: 'Ava' }, { id: 'u3', name: 'Neo' }]
};

export const projects = [
  {
    id: 'p1',
    name: 'Compiler-Lab',
    description: 'Toy compiler',
    files: ['README.md', 'lexer.js', 'parser.js'],
    messages: [{ who: 'u1', text: 'Checked in lexer.js' }]
  },
  {
    id: 'p2',
    name: 'API Threat Scanner',
    description: 'AT-AT mini',
    files: ['api.yaml', 'scanner.py'],
    messages: [{ who: 'u1', text: 'Added schema checks' }]
  }
];
